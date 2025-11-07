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
            static fromName(name) {
                return new Test(name, null);
            }
            static fromRun(run) {
                var name = run.name; // todo
                var test = Test.fromName(name);
                test.runThenSet((testComplete) => {
                    testComplete(test);
                });
                return test;
            }
            static fromNameAndRunThen(name, runThen) {
                return new Test(name, runThen);
            }
            runThenSet(value) {
                this.runThen = value;
                return this;
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
