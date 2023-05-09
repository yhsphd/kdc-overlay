//
// Make forEach available for getElementsByClassName
NodeList.prototype.forEach = HTMLCollection.prototype.forEach = Array.prototype.forEach;


//
// Utils

function HTMLImporter() {
}

HTMLImporter.import = function (url) {
    let error, http_request, load, script;

    script = document.currentScript || document.scripts[document.scripts.length - 1];

    load = function (event) {
        let attribute, index, index1, new_script, old_script, scripts, wrapper;

        wrapper = document.createElement("div");
        wrapper.innerHTML = this.responseText;

        scripts = wrapper.getElementsByTagName("SCRIPT");

        for (index = scripts.length - 1; index > -1; --index) {
            old_script = scripts[index];

            new_script = document.createElement("script");
            new_script.innerHTML = old_script.innerHTML;

            for (index1 = old_script.attributes.length - 1; index1 > -1; --index1) {
                attribute = old_script.attributes[index1];
                new_script.setAttribute(attribute.name, attribute.value);
            }

            old_script.parentNode.replaceChild(new_script, old_script);
        }

        while (wrapper.firstChild) {
            script.parentNode.insertBefore(wrapper.removeChild(wrapper.firstChild), script);
        }

        script.parentNode.removeChild(script);

        this.removeEventListener("error", error);
        this.removeEventListener("load", load);
    };

    error = function (event) {
        this.removeEventListener("error", error);
        this.removeEventListener("load", load);

        alert("there was an error!");
    };

    http_request = new XMLHttpRequest();
    http_request.addEventListener("error", error);
    http_request.addEventListener("load", load);
    http_request.open("GET", url);
    http_request.send();
};

function secondsToMMSS(seconds) {
    return new Date(seconds * 1000).toISOString().substring(14, 19);
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const clampNumber = (num, a, b) =>
    Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));

function transitionCrossfadeElements(element2hide, element2show, duration) {
    let element2hide_opacity = window.getComputedStyle(element2hide).getPropertyValue("opacity");
    let element2show_opacity = window.getComputedStyle(element2show).getPropertyValue("opacity");

    if (element2hide_opacity === "1" && element2show_opacity === "0") {
        element2hide.style.animationDuration = `${duration}ms`;
        element2hide.classList.add("fadeOutAnimation");
        element2hide.addEventListener("animationend", () => {
            element2hide.style.opacity = 0;
            element2hide.classList.remove("fadeOutAnimation");
            element2show.style.animationDuration = `${duration}ms`;
            element2show.classList.add("fadeInAnimation");
            element2show.addEventListener("animationend", () => {
                element2show.style.opacity = 1;
                element2show.classList.remove("fadeInAnimation");
            }, {once: true});
        }, {once: true});
    }
}

function teamName2color(overlayData, mode, name) {
    let names;

    if (mode === 0) {           // Team Name
        names = [overlayData.teams[0].name, overlayData.teams[1].name];
    } else if (mode === 1) {    // Team Acronym
        names = [overlayData.teams[0].acronym, overlayData.teams[1].acronym];
    }

    if (name === names[0]) {
        return "red"
    } else if (name === names[1]) {
        return "blue"
    }
}


//
// Overlay Data

let overlayData = {}
let overlayDataUpdate = io("/update");
overlayDataUpdate.on("update", function (data) {
    overlayData = data;
});
overlayDataUpdate.emit(location.href.split("/").slice(-1));     // Report which page was loaded