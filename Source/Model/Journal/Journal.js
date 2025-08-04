"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Journal {
            constructor(entries) {
                this.entries = entries;
            }
            static fromEntries(entries) {
                return new Journal(entries);
            }
        }
        GameFramework.Journal = Journal;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
