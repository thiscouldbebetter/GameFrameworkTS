"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class EquipmentSocketGroup {
            constructor(defnGroup) {
                this.defnGroup = defnGroup;
                this.sockets = [];
                var socketDefns = this.defnGroup.socketDefns;
                for (var i = 0; i < socketDefns.length; i++) {
                    var socketDefn = socketDefns[i];
                    var socket = new GameFramework.EquipmentSocket(socketDefn.name, null);
                    this.sockets.push(socket);
                }
                ;
                this.socketsByDefnName = GameFramework.ArrayHelper.addLookups(this.sockets, (x) => x.defnName);
            }
        }
        GameFramework.EquipmentSocketGroup = EquipmentSocketGroup;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
