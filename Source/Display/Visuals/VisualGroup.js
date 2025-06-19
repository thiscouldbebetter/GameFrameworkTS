"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualGroup {
            constructor(name, children) {
                this.name = name;
                this.children = children;
            }
            static fromChildren(children) {
                return new VisualGroup(null, children);
            }
            static fromNameAndChildren(name, children) {
                return new VisualGroup(name, children);
            }
            childAdd(childToAdd) {
                this.children.push(childToAdd);
                return this;
            }
            // Visual.
            initialize(uwpe) {
                this.children.forEach(x => x.initialize(uwpe));
            }
            initializeIsComplete(uwpe) {
                var childrenAreAllInitialized = (this.children.some(x => x.initializeIsComplete(uwpe) == false) == false);
                return childrenAreAllInitialized;
            }
            draw(uwpe, display) {
                for (var i = 0; i < this.children.length; i++) {
                    var child = this.children[i];
                    child.draw(uwpe, display);
                }
            }
            // Clonable.
            clone() {
                return new VisualGroup(this.name, GameFramework.ArrayHelper.clone(this.children));
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
