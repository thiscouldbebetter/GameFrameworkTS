"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Leaderboard {
            constructor(secondsToShow, playerScoresCount, playerScores) {
                this.secondsToShow = secondsToShow;
                this.playerScoresCount = playerScoresCount || 10;
                this.playerScores = playerScores || [];
                this.scoreBeingEntered = null;
            }
            static create() {
                return new Leaderboard(null, null, null);
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
                return new Leaderboard(null, playerScoresFake.length, playerScoresFake);
            }
            static fromStorageHelper(storageHelper) {
                var propertyName = Leaderboard.name;
                var leaderboardAsJson = storageHelper.propertyWithNameReadValue(propertyName);
                if (leaderboardAsJson == null) {
                    leaderboard = Leaderboard.createWithFakeScores();
                    leaderboardAsJson = leaderboard.toJson();
                    storageHelper.propertyWithNameWriteValue(propertyName, leaderboardAsJson);
                }
                var leaderboard = Leaderboard.fromJson(leaderboardAsJson);
                return leaderboard;
            }
            secondsToShowSet(value) {
                this.secondsToShow = value;
                return this;
            }
            scoreBeingEnteredSet(value) {
                for (var i = 0; i < this.playerScores.length; i++) {
                    var playerScoreExisting = this.playerScores[i].score;
                    if (value > playerScoreExisting) {
                        this.scoreBeingEntered =
                            LeaderboardPlayerScore.fromScore(value);
                        this.playerScores.splice(i, 0, this.scoreBeingEntered);
                        this.playerScores.length = this.playerScoresCount;
                        break;
                    }
                }
            }
            // Controllable.
            toControl(uwpe) {
                var control = this.scoreBeingEntered == null
                    ? this.toControl_ScoresAllShow(uwpe)
                    : this.toControl_PlayerIntialsEnter(uwpe);
                return control;
            }
            toControl_PlayerIntialsEnter(uwpe) {
                var textAsLines = [
                    "Your score is among ",
                    "the top " + this.playerScoresCount,
                    "of all time!",
                    " ",
                    "Enter your initials:",
                    " ",
                    " ",
                    " "
                ];
                var text = textAsLines.join("\n");
                var universe = uwpe.universe;
                var controlBuilder = universe.controlBuilder;
                var sizeInPixels = universe.display.sizeInPixels;
                var fontNameAndHeight = GameFramework.FontNameAndHeight.default();
                var controlRoot = controlBuilder.message(universe, sizeInPixels, GameFramework.DataBinding.fromContext(text), () => this.toControl_PlayerInitialsEnter_Finished(uwpe), // acknowledge
                true, // acknowledgeButtonIsSuppressed
                false, // backgroundIsTransparent
                fontNameAndHeight, this.secondsToShow);
                controlRoot.containerInner.indexOfChildWithFocusCannotBeNullSet(true);
                var textBoxInitials = GameFramework.ControlTextBox.fromNamePosSizeAndTextBinding("textBoxInitials", GameFramework.Coords.fromXY(150, 200), // pos
                GameFramework.Coords.fromXY(100, 40), // size
                GameFramework.DataBinding.fromContextGetAndSet(this.scoreBeingEntered, (c) => c.playerInitials, (c, v) => c.playerInitials = v)).charsMaxSet(3).characterSetSet(GameFramework.CharacterSet.Instances().LettersUppercase);
                textBoxInitials.fontHeightInPixelsSet(fontNameAndHeight.heightInPixels * 2);
                controlRoot
                    .childAdd(textBoxInitials)
                    .childFocusNextInDirection(1);
                return controlRoot;
            }
            toControl_PlayerInitialsEnter_Finished(uwpe) {
                var universe = uwpe.universe;
                var thisAsJson = this.toJson();
                var storageHelper = universe.storageHelper;
                storageHelper.propertyWithNameWriteValue(Leaderboard.name, thisAsJson);
                var control = this.toControl_ScoresAllShow(uwpe);
                var venueNext = control.toVenue();
                universe.venueTransitionTo(venueNext);
            }
            toControl_ScoresAllShow(uwpe) {
                var textLines = [];
                textLines.push("High Scores");
                textLines.push(" ");
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
                var controlLeaderboard = controlBuilder.message(universe, sizeInPixels, GameFramework.DataBinding.fromContext(text), () => { this.toControl_ScoresAllShow_Finished(universe); }, true, // acknowledgeButtonIsSuppressed
                false, // backgroundIsTransparent
                fontNameAndHeight, this.secondsToShow);
                return controlLeaderboard;
            }
            toControl_ScoresAllShow_Finished(universe) {
                var venueNext = universe.controlBuilder.titleAsVenue(universe, universe.display.sizeInPixels);
                universe.venueTransitionTo(venueNext);
            }
            toVenue(uwpe) {
                var thisAsControl = this.toControl(uwpe);
                var thisAsVenue = thisAsControl.toVenue();
                return thisAsVenue;
            }
            // Json.
            static fromJson(leaderboardAsJson) {
                var leaderboard = JSON.parse(leaderboardAsJson);
                Object.setPrototypeOf(leaderboard, Leaderboard.prototype);
                var playerScores = leaderboard.playerScores;
                for (var i = 0; i < playerScores.length; i++) {
                    var playerScore = playerScores[i];
                    Object.setPrototypeOf(playerScore, LeaderboardPlayerScore.prototype);
                }
                return leaderboard;
            }
            toJson() {
                return JSON.stringify(this);
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
                return new LeaderboardPlayerScore("", score, null);
            }
            toString() {
                var playerInitialsPadded = this.playerInitials.padEnd(3, " ");
                var scoreLengthMax = 9;
                var scoreAsString = ("" + this.score).padStart(scoreLengthMax, " ");
                var returnValue = playerInitialsPadded + scoreAsString;
                return returnValue;
            }
        }
        GameFramework.LeaderboardPlayerScore = LeaderboardPlayerScore;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
