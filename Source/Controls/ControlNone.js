"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ControlNone extends GameFramework.ControlBase {
            constructor() {
                super(null, null, null, null);
            }
            static create() {
                return new ControlNone();
            }
        }
        GameFramework.ControlNone = ControlNone;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
