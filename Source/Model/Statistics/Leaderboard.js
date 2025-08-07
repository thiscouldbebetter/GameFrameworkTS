"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Leaderboard {
            constructor(playerScoresCount, playerScores) {
                this.playerScoresCount = playerScoresCount || 10;
                this.playerScores = playerScores || [];
                this.playerScoreBeingEntered = null;
                this.cursorOffsetInChars = 0;
            }
            static create() {
                return new Leaderboard(null, null);
            }
            static createWithFakeScores() {
                var ps = (n, s) => LeaderboardPlayerScore.fromPlayerNameAndScore(n, s);
                var playerScoresFake = [
                    ps("AAA", 100000),
                    ps("BBB", 50000),
                    ps("CCC", 20000),
                    ps("DDD", 10000),
                    ps("EEE", 5000),
                    ps("FFF", 2000),
                    ps("GGG", 1000),
                    ps("HHH", 500),
                    ps("III", 200),
                    ps("JJJ", 100)
                ];
                return new Leaderboard(playerScoresFake.length, playerScoresFake);
            }
            static fromStorageHelper(storageHelper) {
                var leaderboard = storageHelper.load(Leaderboard.name);
                if (leaderboard == null) {
                    leaderboard = Leaderboard.createWithFakeScores();
                    storageHelper.save(Leaderboard.name, leaderboard);
                }
                return leaderboard;
            }
            scoreInsert(scoreToInsert) {
                this.playerScoreBeingEntered = null;
                for (var i = 0; i < this.playerScores.length; i++) {
                    var playerScoreExisting = this.playerScores[i].score;
                    if (scoreToInsert > playerScoreExisting) {
                        var playerScoreToInsert = LeaderboardPlayerScore.fromScore(scoreToInsert);
                        this.playerScores.splice(i, 0, playerScoreToInsert);
                        this.playerScores.length = this.playerScoresCount;
                        this.playerScoreBeingEntered = playerScoreToInsert;
                        this.cursorOffsetInChars = 0;
                        break;
                    }
                }
            }
            // Controllable.
            toControl(uwpe) {
                var textLines = [];
                textLines.push("High Scores");
                textLines.push("-----------");
                var playerScoresAsTextLines = [];
                for (var i = 0; i < this.playerScores.length; i++) {
                    var playerScore = this.playerScores[i];
                    var playerScoreAsTextLine = playerScore.toString();
                    playerScoresAsTextLines.push(playerScoreAsTextLine);
                }
                textLines.push(...playerScoresAsTextLines);
                var newline = "\n";
                var text = textLines.join(newline);
                var universe = uwpe.universe;
                var sizeInPixels = universe.display.sizeInPixels;
                var fontNameAndHeight = GameFramework.FontNameAndHeight.default();
                var controlBuilder = universe.controlBuilder;
                var controlLeaderboard = controlBuilder.message(universe, sizeInPixels, GameFramework.DataBinding.fromContext(text), () => { this.toControl_Finished(universe); }, true, // showMessageOnly
                fontNameAndHeight);
                /*
                var fontHeight = fontNameAndHeight.heightInPixels;
        
                var controlTextBox =
                    ControlTextBox.fromPosSizeAndTextImmediate
                    (
                        Coords.fromXY(0, 0),
                        Coords.fromXY(100, fontHeight * 2),
                        ""
                    ).charsMaxSet(3);
                controlLeaderboard.childAdd(controlTextBox);
                */
                return controlLeaderboard;
            }
            toControl_Finished(universe) {
                universe.venueTransitionTo(universe.controlBuilder.title(universe, universe.display.sizeInPixels).toVenue());
            }
            toVenue(uwpe) {
                var thisAsControl = this.toControl(uwpe);
                var thisAsVenue = thisAsControl.toVenue();
                return thisAsVenue;
            }
        }
        GameFramework.Leaderboard = Leaderboard;
        class LeaderboardPlayerScore {
            constructor(playerInitials, score, timeEntered) {
                this.playerInitials = playerInitials;
                this.score = score;
                this.timeEntered = timeEntered || new Date();
            }
            static fromPlayerNameAndScore(playerName, score) {
                return new LeaderboardPlayerScore(playerName, score, null);
            }
            static fromScore(score) {
                return new LeaderboardPlayerScore("---", score, null);
            }
            toString() {
                var scoreLengthMax = 9;
                var scoreAsString = ("" + this.score).padStart(scoreLengthMax, " ");
                var returnValue = this.playerInitials + scoreAsString;
                return returnValue;
            }
        }
        GameFramework.LeaderboardPlayerScore = LeaderboardPlayerScore;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
