"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class FontNameAndHeight {
            constructor(name, heightInPixels) {
                this.name = name || "Font";
                this.heightInPixels = heightInPixels || 10;
            }
            static default() {
                return new FontNameAndHeight(null, null);
            }
            static fromHeightInPixels(heightInPixels) {
                return new FontNameAndHeight(null, heightInPixels);
            }
            static fromNameAndHeightInPixels(name, heightInPixels) {
                return new FontNameAndHeight(name, heightInPixels);
            }
            font(universe) {
                return universe.mediaLibrary.fontGetByName(this.name);
            }
            toStringSystemFont() {
                return this.heightInPixels + "px " + this.name;
            }
            // Clonable.
            clone() {
                return new FontNameAndHeight(this.name, this.heightInPixels);
            }
            overwriteWith(other) {
                this.name = other.name;
                this.heightInPixels = other.heightInPixels;
                return this;
            }
            // Equatable.
            equals(other) {
                var returnValue = (this.name == other.name
                    && this.heightInPixels == other.heightInPixels);
                return returnValue;
            }
        }
        GameFramework.FontNameAndHeight = FontNameAndHeight;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
