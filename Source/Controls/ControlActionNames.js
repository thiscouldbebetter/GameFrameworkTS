"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ControlActionNames_Instances {
            constructor() {
                this.ControlCancel = "ControlCancel";
                this.ControlConfirm = "ControlConfirm";
                this.ControlDecrement = "ControlDecrement";
                this.ControlIncrement = "ControlIncrement";
                this.ControlNext = "ControlNext";
                this.ControlPrev = "ControlPrev";
            }
        }
        GameFramework.ControlActionNames_Instances = ControlActionNames_Instances;
        class ControlActionNames {
            static Instances() {
                if (ControlActionNames._instances == null) {
                    ControlActionNames._instances = new ControlActionNames_Instances();
                }
                return ControlActionNames._instances;
            }
            ;
        }
        GameFramework.ControlActionNames = ControlActionNames;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
