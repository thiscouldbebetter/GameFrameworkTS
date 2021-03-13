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
            action(universe) {
                return universe.world.defn.actionDefnsByName().get(this.actionName);
            }
            // Cloneable implementation.
            clone() {
                return new ActionToInputsMapping(this.actionName, this.inputNames.slice(), this.inactivateInputWhenActionPerformed);
            }
            overwriteWith(other) {
                this.actionName = other.actionName;
                this.inputNames = other.inputNames.slice();
                this.inactivateInputWhenActionPerformed = other.inactivateInputWhenActionPerformed;
            }
        }
        GameFramework.ActionToInputsMapping = ActionToInputsMapping;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
