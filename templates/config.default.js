let config = {};

// Overlay Server Port
config.port = 3000;

// Stream Data Sheet
config.sheet = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// osu!api v2
config.clientID = 0;
config.clientSecret = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Gosumemory
config.gosumemoryHost = "127.0.0.1"
config.gosumemoryPort = 24050;

// StreamCompanion
config.SChost = "localhost";
config.SCport = 20727;

// foobar2000
config.fb2k = {beefweb: {}, controlserver: {}};
config.fb2k.beefweb.host = "127.0.0.1";
config.fb2k.beefweb.port = 8880;
config.fb2k.controlserver.host = "127.0.0.1";
config.fb2k.controlserver.port = 3333;


module.exports = config;