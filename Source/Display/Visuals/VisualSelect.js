"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualSelect {
            constructor(childrenByName, selectChildNames) {
                this.childrenByName = childrenByName;
                this.selectChildNames = selectChildNames;
            }
            draw(uwpe, display) {
                var childrenToSelectNames = this.selectChildNames(uwpe, display);
                var childrenSelected = childrenToSelectNames.map(childToSelectName => this.childrenByName.get(childToSelectName));
                childrenSelected.forEach(childSelected => childSelected.draw(uwpe, display));
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
        GameFramework.VisualSelect = VisualSelect;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
