const apiUrl = "https://osu.ppy.sh/api/v2";
const tokenUrl = "https://osu.ppy.sh/oauth/token";

let playersInfo;

let bearer = "";

let players = {};
let beatmaps = {};

function getBearer() {
    let clientID;
    let clientSecret;

    fetch("/options/osuapi.txt")
        .then(response => response.text())
        .then((data) => {
            clientID = data.split(/\r?\n/)[0];
            clientSecret = data.split(/\r?\n/)[1];
        });

    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    };

    fetch(tokenUrl, {
        method: "POST",
        headers,
        body: {
            "client_id": clientID,
            "client_secret": clientSecret,
            "grant_type": "client_credentials",
            "scope": "public"
        },
    }).then(response => response.json()).then((data) => {
        console.log(data);
    });
}