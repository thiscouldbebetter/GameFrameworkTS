"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualStack extends GameFramework.VisualBase {
            constructor(childSpacing, children) {
                super();
                this.childSpacing = childSpacing;
                this.children = children;
                this._posSaved = Coords.create();
            }
            static fromSpacingAndChildren(childSpacing, children) {
                return new VisualStack(childSpacing, children);
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
                var entity = uwpe.entity;
                var drawPos = GameFramework.Locatable.of(entity).loc.pos;
                this._posSaved.overwriteWith(drawPos);
                for (var i = 0; i < this.children.length; i++) {
                    //var child = this.children[i];
                    var wasChildVisible = true; // hack
                    // child.draw(uwpe, display);
                    if (wasChildVisible) {
                        drawPos.add(this.childSpacing);
                    }
                }
                drawPos.overwriteWith(this._posSaved);
            }
            // Clonable.
            clone() {
                return new VisualStack(this.childSpacing.clone(), GameFramework.ArrayHelper.clone(this.children));
            }
            overwriteWith(other) {
                this.childSpacing.overwriteWith(other.childSpacing);
                GameFramework.ArrayHelper.overwriteWith(this.children, other.children);
                return this;
            }
            // Transformable.
            transform(transformToApply) {
                this.children.forEach(x => transformToApply.transform(x));
                return this;
            }
        }
        GameFramework.VisualStack = VisualStack;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
