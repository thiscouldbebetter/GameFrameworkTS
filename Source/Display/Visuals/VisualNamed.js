"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualNamed {
            constructor(name, child) {
                this.name = name;
                this.child = child;
            }
            static fromNameAndChild(name, child) {
                return new VisualNamed(name, child);
            }
            // Visual.
            initialize(uwpe) {
                this.child.initialize(uwpe);
            }
            initializeIsComplete(uwpe) {
                return this.child.initializeIsComplete(uwpe);
            }
            draw(uwpe, display) {
                this.child.draw(uwpe, display);
            }
            // Clonable.
            clone() {
                return new VisualNamed(this.name, this.child.clone());
            }
            overwriteWith(other) {
                this.name = other.name;
                this.child.overwriteWith(other.child);
                return this;
            }
            // Transformable.
            transform(transformToApply) {
                transformToApply.transform(this.child);
                return this;
            }
        }
        GameFramework.VisualNamed = VisualNamed;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
