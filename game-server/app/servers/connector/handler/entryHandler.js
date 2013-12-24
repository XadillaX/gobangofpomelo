/**
 * Created by XadillaX on 13-12-22.
 */
var guid = require("guid");

module.exports = function(app) {
    return new Handler(app);
};

function Handler(app) {
    this.app = app;
}

Handler.prototype.connect = function(msg, session, next) {
    var self = this;
    var uid = guid.create().toString();

    var sessionService = self.app.get("sessionService");

    session.bind(uid);
    session.on("closed", onUserLeave.bind(null, self.app));

    self.app.rpc.hall.hallRemote.enter(session, uid, self.app.get("serverId"), function(count) {
        next(null, { clientId: uid, hallCount: count });
    });
};

function onUserLeave(app, session) {
    if(!session || !session.uid) {
        return;
    }

    console.log(session.uid + " left. ->");
    var uid = session.uid;

    // test kick room
    app.rpc.hall.roomRemote.kick(session, uid, function() {

    });

    // test kick hall
    app.rpc.hall.hallRemote.kick(session, uid, app.get("serverId"), function() {

    });
}
