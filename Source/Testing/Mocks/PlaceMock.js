"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class PlaceMock extends GameFramework.PlaceBase {
            constructor() {
                super(PlaceMock.name, null, // defnName
                null, // parentName
                GameFramework.Coords.create(), // size
                [] // entities
                );
            }
            static create() {
                return new PlaceMock();
            }
        }
        GameFramework.PlaceMock = PlaceMock;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
