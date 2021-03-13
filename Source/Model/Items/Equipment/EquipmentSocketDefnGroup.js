"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class EquipmentSocketDefnGroup {
            constructor(name, socketDefns) {
                this.name = name;
                this.socketDefns = socketDefns;
                this.socketDefnsByName = GameFramework.ArrayHelper.addLookupsByName(this.socketDefns);
            }
        }
        GameFramework.EquipmentSocketDefnGroup = EquipmentSocketDefnGroup;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
