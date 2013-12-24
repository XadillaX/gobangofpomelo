/**
 * Created by XadillaX on 13-12-22.
 */
function Gobang() {
    this.pomelo = window.pomelo;
    this.uid = null;
    this.connectorInfo = {};
}

Gobang.prototype.addListeners = function() {
    $("#searching-rival").click(function() {
        $(this).button("loading");

        var route = "hall.hallHandler.searchForRival";
        pomelo.request(route, {}, function(data) {
            $("#cancel-searching-rival").removeAttr("disabled");
        });
    });

    $("#cancel-searching-rival").click(function() {
        $(this).attr("disabled", "disabled");

        var route = "hall.hallHandler.cancelSearchRival";
        pomelo.request(route, {}, function(data) {
            $("#searching-rival").button("reset");
        })
    });

    $("#exit-room").click(function() {

    });

    pomelo.on('hall.updateHallCount', function(data) {
        $("#hallCount").html(data.count);
    });

    pomelo.on("hall.onRivalFound", function(data) {
        $("#roomId").html(data.roomId);

        $("#waiting-xhb-bar .progress-bar").removeClass("progress-bar-info");
        $("#waiting-xhb-bar .progress-bar").addClass("progress-bar-warning");
        $("#waiting-xhb-bar .progress-bar span").html("等待小伙伴进来没羞没臊中...");

        $("#connected").slideUp("fast");
        $("#waiting-xhb").slideDown("fast");

        var route = "hall.roomHandler.enter";
        pomelo.request(route, {}, function(data) {
            if(data.error === true) {
                alert("房间不存在，有可能是在你进来的时候小伙伴就已经撸完走了呢。");
            }
        });
    });

    pomelo.on("room.onRoomReady", function(data) {
        $("#waiting-xhb-bar .progress-bar").removeClass("progress-bar-warning");
        $("#waiting-xhb-bar .progress-bar").addClass("progress-bar-info");
        $("#waiting-xhb-bar .progress-bar span").html("小伙伴成功进来了...");

        $("#waiting-xhb-bar").slideUp("fast");
        $("#gobang-board").slideDown("fast");
    });

    pomelo.on("room.onRivalLeave", function(data) {
        alert("啊呀呀，小伙伴抛弃你了~");

        $("#waiting-xhb").css("display", "none");
        $("#connected").slideDown("fast");

        $("#searching-rival").button("reset");
        $("#cancel-searching-rival").attr("disabled", "disabled");

        $("#waiting-xhb-bar").slideDown("fast");
        $("#gobang-board").slideUp("fast");
    });
};

Gobang.prototype.init = function() {
    var self = this;

    // dispatch connector
    var route = "gate.gateHandler.dispatchConnector";
    pomelo.init({
        host: window.location.hostname,
        port: 3333,
        log: true
    }, function() {
        pomelo.request(route, { host: window.location.hostname }, function(data) {
            pomelo.disconnect();
            if(data.code === 500) {
                $("#connecting-bar").removeClass("active");
                $("#connecting-bar").removeClass("progress-striped");
                $("#connecting-bar .progress-bar").removeClass("progress-bar-warning");
                $("#connecting-bar .progress-bar").addClass("progress-bar-danger");
                $("#connecting-bar .progress-bar span").html("服务器无法调度一个有效的连接器，请刷新重试。");
                return;
            }

            self.uid = data.uid;
            self.connectorInfo.host = data.host;
            self.connectorInfo.port = data.port;

            $("#connecting-bar .progress-bar").removeClass("progress-bar-warning");
            $("#connecting-bar .progress-bar").addClass("progress-bar-info");
            $("#connecting-bar .progress-bar span").html("连接服务器 [" + self.connectorInfo.host + ":" + self.connectorInfo.port +
                "] 分配成功...");

            pomelo.init({
                host: self.connectorInfo.host,
                port: self.connectorInfo.port,
                log: true
            }, function() {
                var route = "connector.entryHandler.connect";
                pomelo.request(route, {}, function(data) {
                    self.addListeners();

                    $("#connecting-bar .progress-bar span").html("服务器成功连接。目前大厅共有 " + data.hallCount + " 人。分配到的客户端编号为：" + data.clientId + "...");
                    $("#hallCount").html(data.hallCount);

                    $("#connecting").slideUp("normal");
                    $("#connected").slideDown("normal");
                });
            });
        });
    });
};

$(function() {
    var gobang = new Gobang();
    gobang.init();
});
