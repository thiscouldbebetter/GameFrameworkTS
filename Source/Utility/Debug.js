"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Debug {
            static doNothing() {
                // A call to this provides something to set a breakpoint on
                // when doing "var todo = 'todo';" causes the compiler to complain,
                // and console.log() would kill performance.
            }
        }
        GameFramework.Debug = Debug;
        class DebuggingModeNames {
        }
        DebuggingModeNames.SkipOpening = "SkipOpening";
        GameFramework.DebuggingModeNames = DebuggingModeNames;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
