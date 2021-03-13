"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Goal extends GameFramework.EntityProperty {
            constructor(numberOfKeysToUnlock) {
                super();
                this.numberOfKeysToUnlock = numberOfKeysToUnlock;
            }
        }
        GameFramework.Goal = Goal;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
