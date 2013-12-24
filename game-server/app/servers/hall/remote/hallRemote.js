/**
 * Created by XadillaX on 13-12-22.
 */
var Player = require("../../../player/player");

module.exports = function(app) {
    return new HallRemote(app);
};

/**
 * Hall remote
 * @param app
 * @constructor
 */
function HallRemote(app) {
    this.app = app;
    this.hallManager = app.hallManager;

    this.channelService = app.get("channelService");
    this.channel = this.channelService.getChannel("hall", true);
}

/**
 * a new user entered. (uid is a GUID)
 * @param uid
 * @param serverId
 * @param callback
 */
HallRemote.prototype.enter = function(uid, serverId, callback) {
    var self = this;

    /**
     * Create a new player.
     * @type {Player}
     */
    var player = new Player(uid, serverId);

    /**
     * Add the player to hall manager and channel.
     */
    this.hallManager.addPlayer(player);
    this.channel.add(uid, serverId);

    console.log("A new player come in. Total: " + this.hallManager.getPlayerCount());

    callback(this.hallManager.getPlayerCount());
};

/**
 * a user left.
 * @param uid
 * @param serverId
 */
HallRemote.prototype.kick = function(uid, serverId) {
    console.log("  " + uid + " left hall.");

    if(this.hallManager.removePlayer(uid)) {
        this.channel.leave(uid, serverId);
    }

    var param = {
        route       : "hall.updateHallCount",
        count       : this.hallManager.getPlayerCount()
    };

    this.channel.pushMessage(param);
};
