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
                var returnValue = this._idNext;
                this._idNext++;
                if (this._idNext >= Number.MAX_SAFE_INTEGER) {
                    throw ("IDHelper is out of IDs!");
                }
                return returnValue;
            }
        }
        GameFramework.IDHelper = IDHelper;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
