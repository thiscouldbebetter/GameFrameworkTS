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
            drawColliders() {
                return (this.settingValueByName("DrawColliders") != null);
            }
            skipOpening() {
                return (this.settingValueByName("SkipOpening") != null);
            }
        }
        GameFramework.DebugSettings = DebugSettings;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
