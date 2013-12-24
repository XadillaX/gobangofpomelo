/**
 * Created by XadillaX on 13-12-22.
 */
module.exports = function(app) {
    return new Handler(app);
};

function Handler(app) {
    this.app = app;
}

/**
 * dispatch connector for one client.
 * @param message
 * @param session
 * @param next
 */
Handler.prototype.dispatchConnector = function(msg, session, next) {
    var connectors = this.app.getServersByType("connector");
    if(!connectors || connectors.length === 0) {
        return next(null, { code: 500 });
    }

    // Only one connector so far.
    var connector = connectors[0];

    next(null, {
        code: 200,
        host: msg.host,
        port: connector.clientPort
    });
};
