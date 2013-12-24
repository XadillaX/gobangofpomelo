/**
 * Created by XadillaX on 13-12-23.
 */
var Player = require("../player/player");
var Room = require("./room");

function Instance(app) {
    this.app = app;
    this.rooms = {};
    this.players = {};
}

module.exports = Instance;

Instance.prototype.getPlayer = function(uid) {
    if(undefined === this.players[uid]) {
        return null;
    }

    return this.players[uid];
};

Instance.prototype.removeRoom = function(roomId) {
    var room = this.rooms[roomId];
    if(undefined === room) return;

    var players = room.getPlayers();

    delete this.players[players[0].getGUID()];
    delete this.players[players[1].getGUID()];
    delete this.rooms[roomId];
};

/**
 * Create a new room
 * @param player1
 * @param player2
 * @returns {*}
 */
Instance.prototype.newRoom = function(player1, player2) {
    // get room number
    for(var i = 0; i < 500; i++) {
        if(undefined === this.rooms[i]) {
            this.rooms[i] = new Room(this.app, i, player1, player2);

            this.players[player1.getGUID()] = {
                "roomId": i,
                "player": player1
            };
            this.players[player2.getGUID()] = {
                "roomId": i,
                "player": player2
            };

            return i;
        }
    }

    return false;
};

/**
 * Get a room
 * @param roomId
 * @returns {*}
 */
Instance.prototype.getRoom = function(roomId) {
    if(this.rooms[roomId] === undefined) {
        return false;
    }

    return this.rooms[roomId];
}
