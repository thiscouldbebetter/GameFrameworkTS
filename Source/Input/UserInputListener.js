"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class UserInputListener extends GameFramework.Entity {
            constructor() {
                super(UserInputListener.name, [
                    GameFramework.Actor.fromActivityDefnName(GameFramework.ActivityDefn.Instances().HandleUserInput.name)
                ]);
            }
        }
        GameFramework.UserInputListener = UserInputListener;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
