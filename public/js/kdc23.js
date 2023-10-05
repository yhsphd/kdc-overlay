//
// Make forEach available for getElementsByClassName
NodeList.prototype.forEach = HTMLCollection.prototype.forEach =
  Array.prototype.forEach;

//
// Utils

function HTMLImporter() {}

HTMLImporter.import = function (url) {
  let error, http_request, load, script;

  script =
    document.currentScript || document.scripts[document.scripts.length - 1];

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
      script.parentNode.insertBefore(
        wrapper.removeChild(wrapper.firstChild),
        script
      );
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

function transitionCrossfadeElements(
  element2hide,
  element2show,
  duration,
  force
) {
  if (!element2hide) {
    // no element to hide
    element2show.style.animationDuration = `${duration}ms`;
    element2show.classList.add("fadeInAnimation");
    element2show.addEventListener(
      "animationend",
      () => {
        element2show.style.opacity = 1;
        element2show.classList.remove("fadeInAnimation");
      },
      { once: true }
    );
  } else if (!element2show) {
    // no element to show
    element2hide.style.animationDuration = `${duration}ms`;
    element2hide.classList.add("fadeOutAnimation");
    element2hide.addEventListener(
      "animationend",
      () => {
        element2hide.style.opacity = 0;
        element2hide.classList.remove("fadeOutAnimation");
      },
      { once: true }
    );
  } else {
    // there are both element to hide and element to show
    let element2hide_opacity = window
      .getComputedStyle(element2hide)
      .getPropertyValue("opacity");
    let element2show_opacity = window
      .getComputedStyle(element2show)
      .getPropertyValue("opacity");

    if (
      (element2hide_opacity === "1" && element2show_opacity === "0") ||
      force
    ) {
      element2hide.style.animationDuration = `${duration}ms`;
      element2hide.classList.add("fadeOutAnimation");
      element2hide.addEventListener(
        "animationend",
        () => {
          element2hide.style.opacity = 0;
          element2hide.classList.remove("fadeOutAnimation");
          element2show.style.animationDuration = `${duration}ms`;
          element2show.classList.add("fadeInAnimation");
          element2show.addEventListener(
            "animationend",
            () => {
              element2show.style.opacity = 1;
              element2show.classList.remove("fadeInAnimation");
            },
            { once: true }
          );
        },
        { once: true }
      );
    } else {
      element2hide.style.opacity = 0;
      element2show.style.opacity = 1;
    }
  }
}

function teamName2color(overlayData, mode, name) {
  let names;

  if (mode === 0) {
    // Team Name
    names = [overlayData.teams[0].name, overlayData.teams[1].name];
  } else if (mode === 1) {
    // Team Acronym
    names = [overlayData.teams[0].acronym, overlayData.teams[1].acronym];
  }

  if (name === names[0]) {
    return "red";
  } else if (name === names[1]) {
    return "blue";
  }
}

function code2mapId(overlayData, code) {}

//
// overflowScroll
function overflowScroll_reset(element) {
  element.style.transitionDuration = `0s, 0s`;
  element.style.transform = "translateX(0%)";
  element.style.left = `0%`;
  element.style.transition = "none";
}

function overflowScroll_move(element, widthToMove, intro) {
  if (!element.classList.contains("overflowScrollAnimation")) {
    // stop animation if the element has lost the class
    return;
  }
  element.style.transition = "none";
  element.style.transitionProperty = "transform, left";
  element.style.transitionTimingFunction = "linear";
  if (intro) {
    // start moving
    const animationDuration = Math.round(widthToMove / 5);
    element.style.transitionDuration = `${animationDuration}s, ${animationDuration}s`;
    element.style.transform = `translateX(-100%)`;
    element.style.left = `100%`;
    setTimeout(
      () => {
        overflowScroll_move(element, widthToMove, false);
      },
      animationDuration * 1000 + 5000
    );
  } else {
    // return
    const animationDuration = Math.round(widthToMove / 10);
    element.style.transitionDuration = `${animationDuration}s, ${animationDuration}s`;
    element.style.transform = `translateX(0%)`;
    element.style.left = `0%`;
    setTimeout(
      () => {
        overflowScroll_move(element, widthToMove, true);
      },
      animationDuration * 1000 + 5000
    );
  }
}

function updateOverflowScroll() {
  const overflowScrollElements =
    document.getElementsByClassName("overflowScroll");

  overflowScrollElements.forEach((element) => {
    const innerSpanElement = element.getElementsByTagName("span")[0];
    if (element.clientWidth < innerSpanElement.clientWidth) {
      if (!innerSpanElement.classList.contains("overflowScrollAnimation")) {
        const widthToMove = innerSpanElement.clientWidth - element.clientWidth;
        innerSpanElement.classList.add("overflowScrollAnimation");
        overflowScroll_move(innerSpanElement, widthToMove, true);
      }
    } else {
      element.classList.remove("overflowScrollAnimation");
      overflowScroll_reset(innerSpanElement);
    }
  });
}

setInterval(updateOverflowScroll, 100);

//
// Overlay Data

let overlayData = {};
let overlayDataUpdate = io("/update");
overlayDataUpdate.on("update", function (data) {
  overlayData = data;
});
overlayDataUpdate.emit(location.href.split("/").slice(-1)); // Report which page was loaded
