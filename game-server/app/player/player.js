/**
 * Created by XadillaX on 13-12-22.
 */
module.exports = Instance;

/**
 * Player instance
 * @param uid
 * @param serverId
 * @constructor
 */
function Instance(uid, serverId) {
    this.guid = uid;
    this.serverId = serverId;
    this.currentPosition = "";
}

/**
 * Get the GUID of a player
 * @returns {string}
 */
Instance.prototype.getGUID = function() {
    return this.guid;
};

/**
 * Get the frontend server id of a player
 * @returns {string}
 */
Instance.prototype.getServerId = function() {
    return this.serverId;
};
