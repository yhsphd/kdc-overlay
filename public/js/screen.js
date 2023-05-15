let screen_streamTitleElement = document.getElementById("streamTitle");


//
// UI Update Functions

function screen_updateStreamTitle(streamTitle) {
    screen_streamTitleElement.innerText = streamTitle;
}


//
// Update Function

function screen_update() {
    screen_updateStreamTitle(overlayData.stream_title);
}

setInterval(screen_update, 1000);