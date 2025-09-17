"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class DummyClass {
        }
        GameFramework.DummyClass = DummyClass;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
// Classes from the framework must be imported here
// or in some other _Imports.ts file
// so that they can be referenced without using the namespace.
var gf = ThisCouldBeBetter.GameFramework;
