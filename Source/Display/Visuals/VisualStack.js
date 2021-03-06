"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualStack {
            constructor(childSpacing, children) {
                this.childSpacing = childSpacing;
                this.children = children;
                this._posSaved = GameFramework.Coords.create();
            }
            draw(uwpe, display) {
                var entity = uwpe.entity;
                var drawPos = entity.locatable().loc.pos;
                this._posSaved.overwriteWith(drawPos);
                for (var i = 0; i < this.children.length; i++) {
                    var child = this.children[i];
                    var wasChildVisible = child.draw(uwpe, display);
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
                var otherAsVisualStack = other;
                this.childSpacing.overwriteWith(otherAsVisualStack.childSpacing);
                GameFramework.ArrayHelper.overwriteWith(this.children, otherAsVisualStack.children);
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
