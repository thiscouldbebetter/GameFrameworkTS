"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class IDHelper {
            constructor() {
                this._idNext = 0;
            }
            static Instance() {
                if (IDHelper._instance == null) {
                    IDHelper._instance = new IDHelper();
                }
                return IDHelper._instance;
            }
            idNext() {
                var returnValue = "_" + this._idNext;
                this._idNext++;
                return returnValue;
            }
        }
        GameFramework.IDHelper = IDHelper;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
