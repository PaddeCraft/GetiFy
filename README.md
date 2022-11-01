# GetiFy

A simple grabify-like ip-logger, but with more information.

## Disclaimer

This software is for educational purposes only. Do not use it to harm anyone in any form. Only use it with your own devices or with ones you are allowed to by the owner.

## Usage

```shell
# Install requirements
python3 -m pip install -r requirements.txt

# Start the server
python3 app.py
```

## Developement

If you want to change something, here are some things:
 - To renew the css, use `yarn css`, or any command that will run the css task from the `package.json`-file. You might need to run `yarn install` the first time to install the packages.
 - If you plan on publishing your changes, please use a code formatter. I recommend black, but you can use any other (e.g. prettier) too.
 - If you make any changes to CSS-code which is not generated by tailwindcss, please make sure that is is compatible with dark and light mode. To test this in chromium-based browsers, use `ctrl` + `shift` + `P` in the devtools and search for `Emulate CSS prefers-color-scheme: dark` or `Emulate CSS prefers-color-scheme: light`.

## License notice

jsonTreeViewer (https://github.com/summerstyle/jsonTreeViewer) is included under the [MIT license](https://choosealicense.com/licenses/mit/).
{UAParser.js} (https://faisalman.github.io/ua-parser-js/) is included unter the [MIT license](https://choosealicense.com/licenses/mit/).