from crypt import methods
import json
import time

from flask import Flask, request, render_template, redirect, abort
from flask_limiter.util import get_remote_address
from flask_limiter import Limiter
from threading import Thread
from lmdbm import Lmdb
from cuid import cuid


class JsonLmdb(Lmdb):
    def _pre_key(self, value):
        return value.encode("utf-8")

    def _post_key(self, value):
        return value.decode("utf-8")

    def _pre_value(self, value):
        return json.dumps(value).encode("utf-8")

    def _post_value(self, value):
        return json.loads(value.decode("utf-8"))


def createNewLink(url):
    id = cuid()
    with JsonLmdb.open("data.db", "c") as db:
        db[id] = {
            "id": id,
            "redirect_url": url,
            "results": [],
            "expires": int(time.time() + 900),
        }

    return id


def deleteThread():
    while True:
        with JsonLmdb.open("data.db", "c") as db:
            for k, v in db.items():
                if v["expires"] < time.time():
                    del db[k]

        time.sleep(1)


app = Flask("GetiFy")
Thread(target=deleteThread).start()
try:
    limiter = Limiter(
        app,
        key_func=get_remote_address,
        default_limits=[],
    )
except Exception:
    limiter = Limiter(
        app=app,
        key_func=get_remote_address,
        default_limits=[],
    )


@app.route("/api/bycode")
@limiter.limit("30 per minute")
def getByCode():
    if request.args.get("code") == None:
        return {"status": "error", "message": "'code' parameter not provided"}
    with JsonLmdb.open("data.db", "c") as db:
        try:
            return {"status": "success", "data": db[request.args.get("code")]}
        except Exception:
            return {"status": "error", "message": "Code not found"}


@app.post("/submit")
def submit():
    if request.args.get("code") == None:
        return {"status": "error", "message": "'code' parameter not provided"}
    with JsonLmdb.open("data.db", "c") as db:
        try:
            entry = db[request.args.get("code")]
            data = request.json
            if not "ip" in data["network"]:
                data["network"]["ip"] = request.remote_addr
            data["response_id"] = cuid()
            entry["results"].append(data)
            db[request.args.get("code")] = entry
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "message": "Code not found"}


@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "GET":
        if request.args.get("id") == None:
            return render_template("home.html")
        with JsonLmdb.open("data.db", "c") as db:
            try:
                return render_template(
                    "getify.html", dest=db[request.args.get("id")]["redirect_url"]
                )
            except Exception:
                return {"status": "error", "message": "Invalid Redirect"}
    else:

        id = createNewLink(request.form.get("url"))
        return redirect("/results?code=" + id)


@app.route("/results")
def results():
    if request.args.get("code") == None:
        abort(400)
    return render_template("display.html")


app.run("0.0.0.0", 8083, debug=True)
