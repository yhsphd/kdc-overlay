let mappool_map_baseElement;
let mappool_map_elements = {};

function mappool_map_updateMaps(overlayData, mappoolColumnsElement) {
    if (!mappool_map_baseElement) return -1;

    const mappool = overlayData.mappool;

    mappoolColumnsElement.forEach((element) => {
        element.innerHTML = "";
    });

    const addMaps = (mod, color, column) => {
        for (let i = 1; mappool.hasOwnProperty(mod + i); i++) {
            let element2add = mappool_map_baseElement.cloneNode(true);
            const mapInfo = overlayData.mappool[mod + i];

            element2add.querySelector(".mappool-map-code").innerText = mapInfo.code;
            element2add.querySelector(".mappool-map-code").style.color = color;
            element2add.querySelector(".mappool-map-title").innerText = mapInfo.title;
            mappoolColumnsElement[column].appendChild(element2add);
            mappool_map_elements[mod + i] = mappoolColumnsElement[column].lastChild;
        }
    };

    addMaps("NM", "var(--greenOpaque)", 0);
    addMaps("HD", "var(--yellowOpaque)", 1);
    addMaps("HR", "var(--redOpaque)", 1);
    addMaps("DT", "var(--purpleOpaque)", 2);
    addMaps("FM", "var(--blueOpaque)", 3);
    addMaps("FcM", "var(--orangeOpaque)", 3);

    return 0;
}

function mappool_map_updateStatus(overlayData) {
    const phases = overlayData.progress.phases;

    let unavailableMaps = [];

    // Get already picked/banned maps
    for (let i = 0; i < phases.length; i++) {
        for (let j = 0; j < phases[i].order.length; j++) {
            if (phases[i].order[j].pick !== -1) {
                unavailableMaps.push(phases[i].order[j].code);
            }
        }
    }

    for (let key in mappool_map_elements) {
        mappool_map_elements[key].style.opacity = 1;
    }
    unavailableMaps.forEach((code) => {
        mappool_map_elements[code].style.opacity = 0.5;
    });
}


// Initialize Base Chat Element
fetch("/components/mappool-map.html").then((response) => response.text()).then((text) => {
    mappool_map_baseElement = document.createRange().createContextualFragment(text);
});