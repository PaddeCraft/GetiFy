const code = new URL(window.location.href).searchParams.get("code");
const url = new URL(window.location.origin + "?id=" + code);

var results = [];
var selectedReslt = null;

function display(res) {
    const id = results[res].response_id;

    document.querySelectorAll("a").forEach((element) => {
        element.classList.remove("tab-active");
    });
    document.getElementById("tabdsp").innerHTML = "";
    document.getElementById(id).classList.add("tab-active");
    selectedReslt = id;
    var tree = jsonTree.create(results[res], document.getElementById("tabdsp"));
    tree.expand();
}

async function load() {
    const res = await fetch("/api/bycode?code=" + code);
    const json = await res.json();
    if (json.status == "error") {
        alert(
            "Error while fetching data: " +
                json.message +
                "\n\nRefresh to retry."
        );
        clearInterval(intvId);
    }
    results = await json.data.results;
    document.getElementById("expires").innerText = new Date(
        json.data.expires * 1000
    ).toString();
    document.getElementById("result_cnt").innerText = results.length;
    document.getElementById("results").innerHTML = "";
    for (var i = 1; i < results.length + 1; i++) {
        document.getElementById("results").innerHTML +=
            '<a class="tab tab-bordered" id="' +
            results[i - 1].response_id +
            '" onclick=display(' +
            (i - 1) +
            ")>#" +
            i +
            "</a>";
    }
    if (!(selectedReslt == null)) {
        document.getElementById(selectedReslt).classList.add("tab-active");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("url").innerText = url;
    document.getElementById("code").innerText = code;

    load();
});

const intvId = setInterval(load, 5000);
