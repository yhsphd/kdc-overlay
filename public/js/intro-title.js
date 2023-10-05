let intro_streamTitleElement = document.getElementById("streamTitle");

//
// UI Update Functions

function intro_updateStreamTitle(streamTitle) {
  intro_streamTitleElement.innerText = streamTitle;
}

//
// Update Function

function intro_title_update() {
  intro_updateStreamTitle(overlayData.stream_title);
}

setInterval(intro_title_update, 1000);
