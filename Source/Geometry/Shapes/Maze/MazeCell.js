"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class MazeCell {
            constructor(numberOfNeighbors) {
                this.connectedToNeighbors = [];
                for (var n = 0; n < numberOfNeighbors; n++) {
                    this.connectedToNeighbors.push(false);
                }
                this.network = new GameFramework.MazeCellNetwork();
                this.network.cells.push(this);
            }
        }
        GameFramework.MazeCell = MazeCell;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
