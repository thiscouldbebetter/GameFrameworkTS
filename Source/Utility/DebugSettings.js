"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class DebugSettings {
            constructor(settingValuesByName) {
                this.settingValuesByName = settingValuesByName;
            }
            static fromString(stringToParse) {
                var settingValuesByName = new Map();
                if (stringToParse != null) {
                    var settingsAsStrings = stringToParse.split("|");
                    var settingNameValuePairs = settingsAsStrings.map(x => x.split(":"));
                    for (var i = 0; i < settingNameValuePairs.length; i++) {
                        var settingNameAndValue = settingNameValuePairs[i];
                        var settingName = settingNameAndValue[0];
                        var settingValue = settingNameAndValue[1] || settingName;
                        settingValuesByName.set(settingName, settingValue);
                    }
                }
                return new DebugSettings(settingValuesByName);
            }
            settingValueByName(name) {
                return this.settingValuesByName.get(name);
            }
            // Particular settings.
            difficultyEasy() {
                return (this.settingValueByName(DebugSettings_Names.Instance().DifficultyEasy) != null);
            }
            drawColliders() {
                return (this.settingValueByName(DebugSettings_Names.Instance().DrawColliders) != null);
            }
            localStorageClear() {
                return (this.settingValueByName(DebugSettings_Names.Instance().LocalStorageClear) != null);
            }
            placeToStartAtName() {
                return (this.settingValueByName(DebugSettings_Names.Instance().PlaceToStartAtName));
            }
            playerCannotDie() {
                return (this.settingValueByName(DebugSettings_Names.Instance().PlayerCannotDie) != null);
            }
            skipOpening() {
                return (this.settingValueByName(DebugSettings_Names.Instance().SkipOpening) != null);
            }
        }
        GameFramework.DebugSettings = DebugSettings;
        class DebugSettings_Names {
            constructor() {
                this.DifficultyEasy = "DifficultyEasy";
                this.DrawColliders = "DrawColliders";
                this.LocalStorageClear = "LocalStorageClear";
                this.PlaceToStartAtName = "PlaceToStartAtName";
                this.PlayerCannotDie = "PlayerCannotDie";
                this.SkipOpening = "SkipOpening";
            }
            static Instance() {
                if (this._instance == null) {
                    this._instance = new DebugSettings_Names();
                }
                return this._instance;
            }
        }
        GameFramework.DebugSettings_Names = DebugSettings_Names;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
