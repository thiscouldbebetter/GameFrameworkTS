"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualDynamic {
            constructor(methodForVisual) {
                this.methodForVisual = methodForVisual;
            }
            // Visual.
            initialize(uwpe) {
                // Do nothing.
            }
            draw(uwpe, display) {
                var visual = this.methodForVisual.call(this, uwpe);
                visual.draw(uwpe, display);
            }
            // Clonable.
            clone() {
                return this; // todo
            }
            overwriteWith(other) {
                return this; // todo
            }
            // Transformable.
            transform(transformToApply) {
                return this; // todo
            }
        }
        GameFramework.VisualDynamic = VisualDynamic;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
