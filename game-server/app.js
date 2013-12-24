var pomelo = require('pomelo');
require("sugar");

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'test-gobang');

app.route("hall", function(param, msg, context, cb) {
    var id = "hall-server-1";
    cb(null, id);
});

app.configure("development|production", "hall", function() {
    var HallManager = require("./app/hall/hallManager");
    app.hallManager = new HallManager(app);

    var RoomManager = require("./app/room/roomManager");
    app.roomManager = new RoomManager(app);

    app.hallManager.startQuery();
});

// start app
app.start();

process.on('uncaughtException', function (err) {
    console.error(' Caught exception: ' + err.stack);
});
