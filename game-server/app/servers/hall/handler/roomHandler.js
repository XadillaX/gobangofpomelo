/**
 * Created by XadillaX on 13-12-23.
 */
module.exports = function(app) {
    return new Handler(app);
}

function Handler(app) {
    this.app = app;
}

Handler.prototype.enter = function(msg, session, next) {
    var uid = session.uid;

    // 玩家不在了
    var playerInfo = this.app.roomManager.getPlayer(uid);
    if(!playerInfo) {
        next(null, { error: true });
        return;
    }

    // 房间掉线了
    var room = this.app.roomManager.getRoom(playerInfo.roomId);
    if(!room) {
        next(null, { error: true });
        return;
    }

    // 房间已经不是他的房间了
    if(room.getPlayer(uid) === null) {
        next(null, { error: true });
        return;
    }

    room.enterPlayer(uid);
    next(null, { error: false });
};
