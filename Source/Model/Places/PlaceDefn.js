"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class PlaceDefn {
            constructor(name, soundForMusicName, actions, actionToInputsMappings, propertyNamesToProcess, placeInitialize, placeFinalize) {
                this.name = name || PlaceDefn.name + "Default";
                this.soundForMusicName = soundForMusicName;
                this.actions = actions || [];
                this.actionToInputsMappingsDefault = actionToInputsMappings || [];
                this.propertyNamesToProcess = propertyNamesToProcess;
                this._placeInitialize = placeInitialize;
                this._placeFinalize = placeFinalize;
                this.actionsByName =
                    GameFramework.ArrayHelper.addLookupsByName(this.actions);
                this.actionToInputsMappings =
                    GameFramework.ArrayHelper.clone(this.actionToInputsMappingsDefault);
                this.actionToInputsMappingsEdited =
                    GameFramework.ArrayHelper.clone(this.actionToInputsMappings);
                this.actionToInputsMappingsByInputName = GameFramework.ArrayHelper.addLookupsMultiple(this.actionToInputsMappings, (x) => x.inputNames);
            }
            static default() {
                return new PlaceDefn(null, // name,
                null, // soundForMusicName
                [], // actions,
                [], // actionToInputsMappings,
                [], // propertyNamesToProcess,
                null, // placeInitialize
                null // placeFinalize
                );
            }
            static fromNameAndPropertyNamesToProcess(name, propertyNamesToProcess) {
                return new PlaceDefn(name, null, // soundForMusicName
                [], // actions
                [], // actionToInputsMapping,
                propertyNamesToProcess, null, // placeInitialize
                null // placeFinalize
                );
            }
            static fromNameMusicActionsMappingsAndPropertyNames(name, soundForMusicName, actions, actionToInputsMappings, propertyNamesToProcess) {
                return new PlaceDefn(name, soundForMusicName, actions, actionToInputsMappings, propertyNamesToProcess, null, null // placeInitialize, placeFinalize
                );
            }
            static fromPropertyNamesToProcess(propertyNamesToProcess) {
                return PlaceDefn.fromNameAndPropertyNamesToProcess(PlaceDefn.name, propertyNamesToProcess);
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
                if (this.soundForMusicName != null) {
                    var universe = uwpe.universe;
                    var soundHelper = universe.soundHelper;
                    var soundPlaybackForMusicAlreadyPlaying = soundHelper.soundPlaybackForMusic;
                    if (soundPlaybackForMusicAlreadyPlaying != null
                        && soundPlaybackForMusicAlreadyPlaying.sound.name != this.soundForMusicName) {
                        soundPlaybackForMusicAlreadyPlaying.stop(uwpe);
                        var mediaLibrary = universe.mediaLibrary;
                        var sound = mediaLibrary.soundGetByName(this.soundForMusicName);
                        var soundPlayback = GameFramework.SoundPlayback
                            .fromSound(sound)
                            .volumeAsFractionSet(universe.soundHelper.effectVolume);
                        soundPlayback.startIfNotStartedYet(uwpe);
                    }
                }
                if (this._placeInitialize != null) {
                    this._placeInitialize(uwpe);
                }
            }
        }
        GameFramework.PlaceDefn = PlaceDefn;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
