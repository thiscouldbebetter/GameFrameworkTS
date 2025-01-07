"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualGroup {
            constructor(children) {
                this.children = children;
            }
            // Visual.
            initialize(uwpe) {
                this.children.forEach(x => x.initialize(uwpe));
            }
            draw(uwpe, display) {
                for (var i = 0; i < this.children.length; i++) {
                    var child = this.children[i];
                    child.draw(uwpe, display);
                }
            }
            // Clonable.
            clone() {
                return new VisualGroup(GameFramework.ArrayHelper.clone(this.children));
            }
            overwriteWith(other) {
                GameFramework.ArrayHelper.overwriteWith(this.children, other.children);
                return this;
            }
            // Transformable.
            transform(transformToApply) {
                this.children.forEach(x => transformToApply.transform(x));
                return this;
            }
        }
        GameFramework.VisualGroup = VisualGroup;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
