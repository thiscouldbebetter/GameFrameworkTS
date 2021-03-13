"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Reference {
            constructor(value) {
                this.value = value;
            }
            get() {
                return this.value;
            }
            set(valueToSet) {
                this.value = valueToSet;
                return this.value;
            }
        }
        GameFramework.Reference = Reference;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
