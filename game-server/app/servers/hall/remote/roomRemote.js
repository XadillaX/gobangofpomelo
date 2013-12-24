/**
 * Created by XadillaX on 13-12-23.
 */
module.exports = function(app) {
    return new RoomRemote(app);
};

function RoomRemote(app) {
    this.app = app;

    this.channelService = app.get("channelService");
}

/**
 * One player left. and another blahblah...
 * @param uid
 */
RoomRemote.prototype.kick = function(uid) {
    console.log("  " + uid + " left room.");

    var player = this.app.roomManager.getPlayer(uid);
    if(!player) return;

    var roomId = player.roomId;
    var room = this.app.roomManager.getRoom(roomId);
    if(!room) return;

    var player = room.getPlayer(uid);
    if(!player) return;

    var players = room.getPlayers();
    if(players[0].getGUID() === uid) player = players[1];
    if(players[1].getGUID() === uid) player = players[0];

    var to = [ { uid: player.getGUID(), sid: player.getServerId() } ];
    var route = "room.onRivalLeave";

    this.channelService.pushMessageByUids(route, {  }, to);
    this.app.roomManager.removeRoom(roomId);

    this.app.rpc.hall.hallRemote.enter(0, player.getGUID(), player.getServerId(), function() {
        delete player;
    });
};
