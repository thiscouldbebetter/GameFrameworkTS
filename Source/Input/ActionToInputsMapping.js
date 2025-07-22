"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ActionToInputsMapping {
            constructor(actionName, inputNames, inactivateInputWhenActionPerformed) {
                this.actionName = actionName;
                this.inputNames = inputNames;
                this.inactivateInputWhenActionPerformed =
                    inactivateInputWhenActionPerformed;
            }
            static fromActionNameAndInputName(actionName, inputName) {
                return new ActionToInputsMapping(actionName, [inputName], false);
            }
            static fromActionNameAndInputNames(actionName, inputNames) {
                return new ActionToInputsMapping(actionName, inputNames, false);
            }
            static fromActionNameInputNameAndOnlyOnce(actionName, inputName, inactivateInputWhenActionPerformed) {
                return new ActionToInputsMapping(actionName, [inputName], inactivateInputWhenActionPerformed);
            }
            static fromActionNameInputNamesAndOnlyOnce(actionName, inputNames, inactivateInputWhenActionPerformed) {
                return new ActionToInputsMapping(actionName, inputNames, inactivateInputWhenActionPerformed);
            }
            action(universe) {
                return universe.world.defn.actionByName(this.actionName);
            }
            inactivateInputWhenActionPerformedSet(value) {
                this.inactivateInputWhenActionPerformed = value;
                return this;
            }
            // Clonable.
            clone() {
                return new ActionToInputsMapping(this.actionName, this.inputNames.slice(), this.inactivateInputWhenActionPerformed);
            }
            overwriteWith(other) {
                this.actionName = other.actionName;
                this.inputNames = other.inputNames.slice();
                this.inactivateInputWhenActionPerformed =
                    other.inactivateInputWhenActionPerformed;
                return this;
            }
        }
        GameFramework.ActionToInputsMapping = ActionToInputsMapping;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
