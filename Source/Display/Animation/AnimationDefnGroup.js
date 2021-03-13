"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class AnimationDefnGroup {
            constructor(name, animationDefns) {
                this.name = name;
                this.animationDefns = animationDefns;
                this.animationDefnsByName = GameFramework.ArrayHelper.addLookupsByName(this.animationDefns);
            }
        }
        GameFramework.AnimationDefnGroup = AnimationDefnGroup;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
