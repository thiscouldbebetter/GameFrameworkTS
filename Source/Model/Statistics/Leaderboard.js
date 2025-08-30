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
                this.playerScoreBeingEntered = null;
                this.cursorOffsetInChars = 0;
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
                return new Leaderboard(30, playerScoresFake.length, playerScoresFake);
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
                fontNameAndHeight, this.secondsToShow);
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
            static toControlGetInitials(uwpe) {
                var universe = uwpe.universe;
                var size = universe.display.sizeDefault().clone();
                var controlBuilder = universe.controlBuilder;
                var sizeBase = controlBuilder.sizeBase;
                var scaleMultiplier = size.clone().divide(sizeBase);
                var fontNameAndHeight = controlBuilder.fontBase;
                var buttonHeightBase = controlBuilder.buttonHeightBase;
                var controls = [
                    GameFramework.ControlLabel.fromPosSizeTextFontCentered(GameFramework.Coords.fromXY(50, 15), // pos
                    GameFramework.Coords.fromXY(100, 15), // size
                    GameFramework.DataBinding.fromContext("Your Score:"), fontNameAndHeight),
                    GameFramework.ControlLabel.fromPosSizeTextFontCentered(GameFramework.Coords.fromXY(50, 35), // pos
                    GameFramework.Coords.fromXY(100, 15), // size
                    GameFramework.DataBinding.fromContext("Enter your initials:"), fontNameAndHeight),
                    GameFramework.ControlTextBox.fromNamePosSizeAndTextBinding("textBoxInitials", GameFramework.Coords.fromXY(50, 50), // pos
                    GameFramework.Coords.fromXY(100, 20), // size
                    GameFramework.DataBinding.fromContextGetAndSet(universe.profile, (c) => c.name, (c, v) => c.name = v)).charsMaxSet(3),
                    GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(50, 80), // pos
                    GameFramework.Coords.fromXY(45, buttonHeightBase), // size
                    "Submit", fontNameAndHeight, () => this.toControlGetInitials_Submit(uwpe)).isEnabledSet(GameFramework.DataBinding.fromContextAndGet(universe.profile, (c) => { return c.name.length > 0; }))
                ];
                var returnValue = GameFramework.ControlContainer.fromNamePosSizeAndChildren("containerProfileNew", GameFramework.Coords.zeroes(), // pos
                sizeBase.clone(), // size
                controls);
                returnValue.scalePosAndSize(scaleMultiplier);
                return returnValue;
            }
            static toControlGetInitials_Submit(uwpe) {
                var universe = uwpe.universe;
                var venueControls = universe.venueCurrent();
                var controlRootAsContainer = venueControls.controlRoot;
                var textBoxName = controlRootAsContainer.childByName("textBoxInitials");
                var profileName = textBoxName.text();
                if (profileName == "") {
                    return;
                }
                var storageHelper = universe.storageHelper;
                var profile = new GameFramework.Profile(profileName, []);
                var profileNames = storageHelper.load(GameFramework.Profile.StorageKeyProfileNames);
                if (profileNames == null) {
                    profileNames = [];
                }
                profileNames.push(profileName);
                storageHelper.save(GameFramework.Profile.StorageKeyProfileNames, profileNames);
                storageHelper.save(profileName, profile);
                universe.profileSet(profile);
                var venueNext = GameFramework.Profile.toControlSaveStateLoad(universe, null, universe.venueCurrent()).toVenue();
                universe.venueTransitionTo(venueNext);
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
