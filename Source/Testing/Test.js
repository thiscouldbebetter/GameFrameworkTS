"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Test {
            constructor(name, runThen) {
                this.name = name;
                this.runThen = runThen;
            }
            static fromNameAndRunThen(name, runThen) {
                return new Test(name, runThen);
            }
            writeMessageInColor(messageToWrite, color) {
                console.log("%c" + messageToWrite, "color: " + color);
            }
            writeError(messageToWrite) {
                this.writeMessageInColor(messageToWrite, "Red");
            }
            writeInfo(messageToWrite) {
                this.writeMessageInColor(messageToWrite, "Black");
            }
        }
        GameFramework.Test = Test;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
