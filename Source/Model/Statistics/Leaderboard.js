"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Leaderboard {
            constructor(playerScores) {
                this.playerScores = playerScores || [];
            }
            static create() {
                return new Leaderboard(null);
            }
            // Controllable.
            toControl(uwpe) {
                var textLines = [];
                textLines.push("High Scores:");
                textLines.push("");
                for (var i = 0; i < this.playerScores.length; i++) {
                    var playerScore = this.playerScores[i];
                    var playerScoreAsTextLine = playerScore.toString();
                    textLines.push(playerScoreAsTextLine);
                }
                var newline = "\n";
                var text = textLines.join(newline);
                var container = GameFramework.ControlContainer.fromPosSizeAndChildren(GameFramework.Coords.zeroes(), uwpe.universe.display.sizeInPixels, [
                    GameFramework.ControlLabel.fromPosAndText(GameFramework.Coords.fromXY(0, 0), GameFramework.DataBinding.fromGet(() => text))
                ]).toControlContainerTransparent();
                return container;
            }
        }
        GameFramework.Leaderboard = Leaderboard;
        class Leaderboard_PlayerScore {
            constructor(playerName, score, timeEntered) {
                this.playerName = playerName;
                this.score = score;
                this.timeEntered = timeEntered || new Date();
            }
            static fromPlayerNameAndScore(playerName, score) {
                return new Leaderboard_PlayerScore(playerName, score, null);
            }
            toString() {
                return this.playerName + " " + this.score;
            }
        }
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
