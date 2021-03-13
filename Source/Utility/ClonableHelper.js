"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ClonableHelper {
            static clone(clonableToClone) {
                return (clonableToClone == null ? null : clonableToClone.clone());
            }
        }
        GameFramework.ClonableHelper = ClonableHelper;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
