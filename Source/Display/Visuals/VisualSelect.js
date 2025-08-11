"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualSelect {
            constructor(selectChildToShow, children) {
                this._selectChildToShow = selectChildToShow;
                this.children = children;
            }
            static fromSelectChildToShowAndChildren(selectChildToShow, children) {
                return new VisualSelect(selectChildToShow, children);
            }
            selectChildToShow(uwpe, visualSelect) {
                return this._selectChildToShow(uwpe, visualSelect);
            }
            // Visual.
            initialize(uwpe) {
                this.children.forEach(x => x.initialize(uwpe));
            }
            initializeIsComplete(uwpe) {
                var atLeastOneChildIsNotInitialized = this.children.some(x => x.initializeIsComplete(uwpe) == false);
                var childrenAreAllInitialized = (atLeastOneChildIsNotInitialized == false);
                return childrenAreAllInitialized;
            }
            draw(uwpe, display) {
                var childToShow = this.selectChildToShow(uwpe, this);
                childToShow.draw(uwpe, display);
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
