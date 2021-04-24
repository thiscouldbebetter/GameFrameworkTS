"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ActionToInputsMapping {
            constructor(actionName, inputNames, inactivateInputWhenActionPerformed) {
                this.actionName = actionName;
                this.inputNames = inputNames;
                this.inactivateInputWhenActionPerformed = inactivateInputWhenActionPerformed;
            }
            static fromActionAndInputName(actionName, inputName) {
                return new ActionToInputsMapping(actionName, [inputName], false);
            }
            action(universe) {
                return universe.world.defn.actionByName(this.actionName);
            }
            // Cloneable implementation.
            clone() {
                return new ActionToInputsMapping(this.actionName, this.inputNames.slice(), this.inactivateInputWhenActionPerformed);
            }
            overwriteWith(other) {
                this.actionName = other.actionName;
                this.inputNames = other.inputNames.slice();
                this.inactivateInputWhenActionPerformed = other.inactivateInputWhenActionPerformed;
                return this;
            }
        }
        GameFramework.ActionToInputsMapping = ActionToInputsMapping;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
