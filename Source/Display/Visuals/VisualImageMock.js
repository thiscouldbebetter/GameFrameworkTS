"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualImageMock {
            constructor(sizeInPixels) {
                this._sizeInPixels = sizeInPixels;
            }
            // Transform.
            transform(transformToApply) {
                return this;
            }
            // Visual.
            draw(uwpe, display) { }
            clone() { return this; }
            overwriteWith(x) { return this; }
            // VisualImage.
            image(u) {
                throw new Error("Not implemented!");
            }
            sizeInPixels(u) {
                return this._sizeInPixels;
            }
        }
        GameFramework.VisualImageMock = VisualImageMock;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
