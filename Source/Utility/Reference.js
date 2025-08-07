"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Reference {
            constructor(value) {
                this.value = value;
            }
            static fromValue(value) {
                return new Reference(value);
            }
            get() {
                return this.value;
            }
            set(valueToSet) {
                this.value = valueToSet;
                return this.value;
            }
            // Clonable.
            clone() {
                return new Reference(this.value);
            }
            overwriteWith(other) {
                this.value = other.value;
                return this;
            }
        }
        GameFramework.Reference = Reference;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
