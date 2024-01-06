"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ControlSoundScheme {
            constructor(name, soundClickName) {
                this.name = name;
                this.soundClickName = soundClickName;
            }
            static Instances() {
                if (ControlSoundScheme._instances == null) {
                    ControlSoundScheme._instances = new ControlSoundScheme_Instances();
                }
                return ControlSoundScheme._instances;
            }
            static byName(soundSchemeName) {
                return ControlSoundScheme.Instances()._AllByName.get(soundSchemeName);
            }
            clone() {
                return new ControlSoundScheme(this.name, this.soundClickName);
            }
        }
        GameFramework.ControlSoundScheme = ControlSoundScheme;
        class ControlSoundScheme_Instances {
            constructor() {
                this.Default = new ControlSoundScheme("Default", // name
                "Sound" // soundClickName
                );
                this._All =
                    [
                        this.Default
                    ];
                this._AllByName = GameFramework.ArrayHelper.addLookupsByName(this._All);
            }
        }
        GameFramework.ControlSoundScheme_Instances = ControlSoundScheme_Instances;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
