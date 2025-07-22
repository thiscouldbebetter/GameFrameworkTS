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
            static default() {
                return new ProfileHelper(null, null);
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
