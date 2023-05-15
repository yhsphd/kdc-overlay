exports = module.exports = function (io) {
    let defaultSession = require("./templates/session");
    let session = defaultSession;

    session = require("./session");      // debug

    io.on("connection", function (socket) {
        socket.on("file1Event", function () {
            console.log("file1Event triggered");
        });
    });


    //
    // Updating now playing info
    function update_nowplaying() {
        fetch("http://127.0.0.1:3000/api/fb2k/nowplaying")
            .then((response) => response.json())
            .then((data) => {
                if (data.fb2k_running && data.player.activeItem.index !== -1) {
                    // getOsuNp = false;
                    session.now_playing = defaultSession.now_playing;
                    session.now_playing.mode = "fb2k";
                    session.now_playing.fb2k.title = data.player.activeItem.columns[1];
                    session.now_playing.fb2k.artist = data.player.activeItem.columns[0];
                    session.now_playing.time = data.player.activeItem.position;
                    session.now_playing.fb2k.length = data.player.activeItem.duration;
                } else {
                    // getOsuNp = true;
                }
            });
    }

    setInterval(update_nowplaying, 200);


    //
    // Session data broadcasting
    function broadcastUpdate() {
        io.emit("update", session);
    }

    setInterval(broadcastUpdate, 100);
}


/*
setTimeout(() => {
        osuapi.getPlayers([6665667, 4585186, 1076236, 6537257]);
    }, 1000
);
*/