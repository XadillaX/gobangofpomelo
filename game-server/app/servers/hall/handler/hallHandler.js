/**
 * Created by XadillaX on 13-12-22.
 */
module.exports = function(app) {
    return new Handler(app);
}

function Handler(app) {
    this.app = app;
    this.hallManager = app.hallManager;
}

Handler.prototype.searchForRival = function(msg, session, next) {
    var uid = session.uid;
    this.hallManager.addToSearchList(uid);

    next(null, {});
};

Handler.prototype.cancelSearchRival = function(msg, session, next) {
    var uid = session.uid;
    this.hallManager.removeFromSearchList(uid);

    next(null, {});
};
