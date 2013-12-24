/**
 * Created by XadillaX on 13-12-22.
 */
module.exports = Instance;

/**
 * Hall manager instance
 * @param app
 * @constructor
 */
function Instance(app) {
    this.app = app;
    this.players = {  };
    this.searchingPlayers = {  };
    this.playerCount = 0;

    this.intervalId = null;
}

Instance.prototype.removeFromSearchList = function(uid) {
    if(this.searchingPlayers[uid] === undefined) {
        return false;
    }

    delete this.searchingPlayers[uid];

    return true;
};

function perQuery() {
    var channelService = this.app.get("channelService");
    if(!channelService) return;

    var players = [];

    for(var uid in this.searchingPlayers) {
        players.push(this.searchingPlayers[uid]);

        if(players.length >= 2) break;
    }

    if(players.length !== 2) return;
    if(players[0] === undefined || players[1] === undefined) return;

    this.removeFromSearchList(players[0].getGUID());
    this.removeFromSearchList(players[1].getGUID());

    var p1Uid = players[0].getGUID();
    var p2Uid = players[1].getGUID();
    var p1Sid = players[0].getServerId();
    var p2Sid = players[1].getServerId();

    // let these two players go to one room.
    var roomId = this.app.roomManager.newRoom(players[0], players[1]);
    if(false === roomId) {
        channelService.pushMessageByUids(
            "hall.onRoomFull",
            {},
            [
                { "uid": p1Uid, "sid": p1Sid },
                { "uid": p2Uid, "sid": p2Sid }
            ]
        );
    } else {
        this.removePlayer(p1Uid);
        this.removePlayer(p2Uid);

        var room = this.app.roomManager.getRoom(roomId);
        room.start();
    }
}

Instance.prototype.startQuery = function() {
    perQuery.bind(this)();

    var self = this;
    this.intervalId = setInterval(perQuery.bind(self), 10);
};

/**
 * Add a player to searching list
 * @param uid
 * @returns {boolean}
 */
Instance.prototype.addToSearchList = function(uid) {
    if(this.searchingPlayers[uid] !== undefined) {
        return false;
    }

    var player = this.getPlayer(uid);
    if(!player) {
        return false;
    }

    this.searchingPlayers[uid] = player;
    return true;
};

/**
 * Get the player count in this hall.
 * @returns {number}
 */
Instance.prototype.getPlayerCount = function() {
    return this.playerCount;
};

Instance.prototype.pushCountMessage = function() {
    var channelService = this.app.get("channelService");
    if(!channelService) return;
    var channel = channelService.getChannel("hall");

    var param = {
        route       : "hall.updateHallCount",
        count       : this.getPlayerCount()
    };
    channel.pushMessage(param);
};

/**
 * Add a player to hall
 * @param player
 */
Instance.prototype.addPlayer = function(player) {
    this.players[player.getGUID()] = player;
    this.playerCount++;
    this.pushCountMessage();
};

/**
 * Get a player
 * @param uid
 * @returns {Player}
 */
Instance.prototype.getPlayer = function(uid) {
    return this.players[uid];
};

/**
 * Remove a player from the hall
 * @param uid
 * @returns {boolean}
 */
Instance.prototype.removePlayer = function(uid) {
    var player = this.players[uid];
    if(!player) return false;

    delete this.players[uid];
    this.playerCount--;

    // player in searching list.
    player = this.searchingPlayers[uid];
    if(player) {
        delete this.searchingPlayers[uid];
    }

    this.pushCountMessage();

    return true;
};
