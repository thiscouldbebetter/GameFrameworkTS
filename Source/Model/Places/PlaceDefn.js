"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class PlaceDefn {
            constructor(name, actions, actionToInputsMappings, propertyNamesToProcess, placeInitialize, placeFinalize) {
                this.name = name;
                this.actions = actions || [];
                this.actionToInputsMappingsDefault = actionToInputsMappings || [];
                this.propertyNamesToProcess = propertyNamesToProcess;
                this._placeInitialize = placeInitialize;
                this._placeFinalize = placeFinalize;
                this.actionsByName = GameFramework.ArrayHelper.addLookupsByName(this.actions);
                this.actionToInputsMappings = GameFramework.ArrayHelper.clone(this.actionToInputsMappingsDefault);
                this.actionToInputsMappingsEdited = GameFramework.ArrayHelper.clone(this.actionToInputsMappings);
                this.actionToInputsMappingsByInputName = GameFramework.ArrayHelper.addLookupsMultiple(this.actionToInputsMappings, (x) => x.inputNames);
            }
            static default() {
                return new PlaceDefn("Default", // name,
                [], // actions,
                [], // actionToInputsMappings,
                [], // propertyNamesToProcess,
                null, // placeInitialize
                null // placeFinalize
                );
            }
            static from4(name, actions, actionToInputsMappings, propertyNamesToProcess) {
                return new PlaceDefn(name, actions, actionToInputsMappings, propertyNamesToProcess, null, null // placeInitialize, placeFinalize
                );
            }
            actionToInputsMappingsEdit() {
                GameFramework.ArrayHelper.overwriteWith(this.actionToInputsMappingsEdited, this.actionToInputsMappings);
                this.actionToInputsMappingSelected = null;
            }
            actionToInputsMappingsRestoreDefaults() {
                GameFramework.ArrayHelper.overwriteWith(this.actionToInputsMappingsEdited, this.actionToInputsMappingsDefault);
            }
            actionToInputsMappingsSave() {
                this.actionToInputsMappings = GameFramework.ArrayHelper.clone(this.actionToInputsMappingsEdited);
                this.actionToInputsMappingsByInputName = GameFramework.ArrayHelper.addLookupsMultiple(this.actionToInputsMappings, (x) => x.inputNames);
            }
            placeFinalize(uwpe) {
                if (this._placeFinalize != null) {
                    this._placeFinalize(uwpe);
                }
            }
            placeInitialize(uwpe) {
                if (this._placeInitialize != null) {
                    this._placeInitialize(uwpe);
                }
            }
        }
        GameFramework.PlaceDefn = PlaceDefn;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
