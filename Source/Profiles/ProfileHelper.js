"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ProfileHelper {
            constructor(gameCanBeSaved, profilesMultipleAreAllowed) {
                this.gameCanBeSaved = gameCanBeSaved || false;
                this.profilesMultipleAreAllowed = profilesMultipleAreAllowed || false;
            }
            static maximal() {
                return new ProfileHelper(true, true);
            }
            static minimal() {
                return new ProfileHelper(false, false);
            }
            static fromGameCanBeSavedAndProfilesMultipleAreAllowed(gameCanBeSaved, profilesMultipleAreAllowed) {
                return new ProfileHelper(gameCanBeSaved, profilesMultipleAreAllowed);
            }
            gameCanBeSavedSet(value) {
                this.gameCanBeSaved = value;
                return this;
            }
            profilesMultipleAreAllowedSet(value) {
                this.profilesMultipleAreAllowed = value;
                return this;
            }
        }
        GameFramework.ProfileHelper = ProfileHelper;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
