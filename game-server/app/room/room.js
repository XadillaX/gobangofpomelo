/**
 * Created by XadillaX on 13-12-23.
 */
var Player = require("../player/player");

function Room(app, roomId, player1, player2) {
    this.app = app;
    this.id = roomId;
    this.players = [ player1, player2 ];
    this.enteredPlayers = [];
    this.isOk = false;

    this.channelService = this.app.get("channelService");
}

module.exports = Room;

function isRoomOk() {
    if(!this.isOk) {
        // TODO.
    }
}

Room.prototype.getRoomId = function() {
    return this.id;
};

Room.prototype.getPlayers = function() {
    return this.players;
};

Room.prototype.getPlayer = function(uid) {
    if(this.players[0].getGUID() === uid) return this.players[0];
    if(this.players[1].getGUID() === uid) return this.players[1];

    return null;
};

/**
 * Enter a player
 * @param uid
 */
Room.prototype.enterPlayer = function(uid) {
    if(uid !== this.players[0].getGUID() && uid !== this.players[1].getGUID()) {
        return;
    }

    if(this.enteredPlayers.length >= 2) {
        return;
    } else if(this.enteredPlayers.length === 0) {
        this.enteredPlayers.push(uid);
    } else if(this.enteredPlayers.length === 1 && uid !== this.enteredPlayers[0]) {
        this.enteredPlayers.push(uid);
    }

    // finish enter.
    if(this.enteredPlayers.length === 2) {
        console.log("Room " + this.id + " is ready.");

        this.isOk = true;

        var roomId = this.id;
        var p1Uid = this.players[0].getGUID();
        var p2Uid = this.players[1].getGUID();
        var p1Sid = this.players[0].getServerId();
        var p2Sid = this.players[1].getServerId();
        var users = [ { "uid": p1Uid, "sid": p1Sid }, { "uid": p2Uid, "sid": p2Sid } ];
        var param = {
            roomId: roomId,
            playerUid: [ p1Uid, p2Uid ]
        };

        this.channelService.pushMessageByUids("room.onRoomReady", param, users);
    }
};

/**
 * Start room life
 */
Room.prototype.start = function() {
    var roomId = this.id;
    var p1Uid = this.players[0].getGUID();
    var p2Uid = this.players[1].getGUID();
    var p1Sid = this.players[0].getServerId();
    var p2Sid = this.players[1].getServerId();

    var m1 = {
        roomId: roomId,
        rivalUid: p2Uid
    };
    var m2 = {
        roomId: roomId,
        rivalUid: p1Uid
    };
    var u1 = [ { "uid": p1Uid, "sid": p1Sid } ];
    var u2 = [ { "uid": p2Uid, "sid": p2Sid } ];

    this.channelService.pushMessageByUids("hall.onRivalFound", m1, u1);
    this.channelService.pushMessageByUids("hall.onRivalFound", m2, u2);

    // Give 1000 ms to waiting player's ready
    setTimeout(isRoomOk.bind(this), 1000);
};
