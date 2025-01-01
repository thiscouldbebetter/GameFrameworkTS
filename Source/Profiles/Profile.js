"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Profile {
            constructor(name, saveStates) {
                this.name = name;
                this.saveStates = saveStates;
                this.saveStateNameSelected = null;
            }
            static anonymous() {
                var now = GameFramework.DateTime.now();
                var nowAsString = now.toStringMMDD_HHMM_SS();
                var profileName = "Anon-" + nowAsString;
                var profile = new Profile(profileName, []);
                return profile;
            }
            static blank() {
                return new Profile("", []);
            }
            saveStateSelected() {
                var returnValue = this.saveStates.filter(x => x.name == this.saveStateNameSelected)[0];
                return returnValue;
            }
            // controls
            static toControlSaveStateLoad(universe, size, venuePrev) {
                var isLoadNotSave = true;
                var returnValue = Profile.toControlSaveStateLoadOrSave(universe, size, venuePrev, isLoadNotSave);
                return returnValue;
            }
            static toControlSaveStateSave(universe, size, venuePrev) {
                var isLoadNotSave = false;
                var returnValue = Profile.toControlSaveStateLoadOrSave(universe, size, venuePrev, isLoadNotSave);
                return returnValue;
            }
            static toControlSaveStateLoadOrSave(universe, size, venuePrev, isLoadNotSave) {
                if (size == null) {
                    size = universe.display.sizeDefault();
                }
                var margin = 8;
                var controlBuilder = universe.controlBuilder;
                var sizeBase = controlBuilder.sizeBase;
                var scaleMultiplier = size.clone().divide(sizeBase);
                var fontHeight = controlBuilder.fontHeightInPixelsBase;
                var fontNameAndHeight = new GameFramework.FontNameAndHeight(null, fontHeight);
                var buttonHeightBase = controlBuilder.buttonHeightBase;
                var buttonSize = GameFramework.Coords.fromXY(1.5, 1).multiplyScalar(buttonHeightBase);
                var colors = GameFramework.Color.Instances();
                var visualThumbnailSize = Profile.toControlSaveStateLoadOrSave_ThumbnailSize();
                var venueToReturnTo = universe.venueCurrent();
                var back = () => universe.venueTransitionTo(venueToReturnTo);
                var saveToLocalStorageOverwritingSlotSelected = () => {
                    Profile.toControlSaveStateLoadOrSave_DeleteSaveSelected_Confirm(universe);
                    Profile.toControlSaveStateLoadOrSave_SaveToLocalStorageAsNewSlot(universe, size, venueToReturnTo);
                };
                var labelProfileName = GameFramework.ControlLabel.fromPosSizeTextFontCenteredHorizontally(GameFramework.Coords.fromXY(margin, margin), // pos
                GameFramework.Coords.fromXY(sizeBase.x, fontHeight), // size
                GameFramework.DataBinding.fromContext("Profile: " + universe.profile.name), fontNameAndHeight);
                var labelChooseAState = GameFramework.ControlLabel.fromPosSizeTextFontCenteredHorizontally(GameFramework.Coords.fromXY(margin, margin * 2), // pos
                GameFramework.Coords.fromXY(sizeBase.x, 25), // size
                GameFramework.DataBinding.fromContext("Choose a State to "
                    + (isLoadNotSave ? "Restore" : "Overwrite") + ":"), fontNameAndHeight);
                var listPosY = margin * 4;
                var listSize = GameFramework.Coords.fromXY(sizeBase.x - margin * 3 - visualThumbnailSize.x, sizeBase.y - margin * 6 - buttonSize.y);
                var listSaveStates = GameFramework.ControlList.from10("listSaveStates", GameFramework.Coords.fromXY(margin, listPosY), // pos
                listSize, GameFramework.DataBinding.fromContextAndGet(universe.profile, (c) => c.saveStates), // items
                GameFramework.DataBinding.fromGet((c) => {
                    var timeSaved = c.timeSaved;
                    var timeSavedAsString = timeSaved == null
                        ? "-"
                        : timeSaved.toStringYYYY_MM_DD_HH_MM_SS();
                    return timeSavedAsString;
                }), // bindingForOptionText
                fontNameAndHeight, new GameFramework.DataBinding(universe.profile, (c) => c.saveStateSelected(), (c, v) => c.saveStateNameSelected = v.name), // bindingForOptionSelected
                GameFramework.DataBinding.fromGet((v) => v.name), // value
                null, (isLoadNotSave
                    ? Profile.toControlSaveStateLoadOrSave_LoadSelectedSlotFromLocalStorage
                    : saveToLocalStorageOverwritingSlotSelected) // confirm
                );
                var buttonPosY = sizeBase.y - margin - buttonSize.y;
                var buttonNew = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(margin, buttonPosY), // pos
                buttonSize.clone(), "New", fontNameAndHeight, (isLoadNotSave
                    ? () => Profile.toControlSaveStateLoadOrSave_LoadNewWorld(universe, size)
                    : () => Profile.toControlSaveStateLoadOrSave_SaveToLocalStorageAsNewSlot(universe, size, venueToReturnTo)) // click
                );
                var buttonSelect = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(margin * 2 + buttonSize.x, buttonPosY), // pos
                buttonSize.clone(), (isLoadNotSave ? "Load" : "Save"), fontNameAndHeight, (isLoadNotSave
                    ? () => Profile.toControlSaveStateLoadOrSave_LoadSelectedSlotFromLocalStorage(universe)
                    : saveToLocalStorageOverwritingSlotSelected)).isEnabledSet(GameFramework.DataBinding.fromContextAndGet(universe.profile, (c) => (c.saveStateNameSelected != null)));
                var buttonFile = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(margin * 3 + buttonSize.x * 2, buttonPosY), // pos
                buttonSize.clone(), "File", fontNameAndHeight, (isLoadNotSave
                    ? () => Profile.toControlSaveStateLoadOrSave_LoadFromFile(universe, size, venuePrev)
                    : () => Profile.toControlSaveStateLoadOrSave_SaveToFilesystem(universe, size)) // click
                );
                var deleteSaveStateSelected = () => {
                    Profile.toControlSaveStateLoadOrSave_DeleteSaveSelected(universe, size);
                };
                var buttonDelete = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(margin * 4 + buttonSize.x * 3, buttonPosY), // pos
                buttonSize.clone(), "Delete", fontNameAndHeight, deleteSaveStateSelected).isEnabledSet(GameFramework.DataBinding.fromContextAndGet(universe.profile, (c) => (c.saveStateNameSelected != null)));
                var imagePosX = margin * 2 + listSize.x;
                var visualSnapshot = GameFramework.ControlVisual.fromNamePosSizeVisualColorBackground("visualSnapshot", GameFramework.Coords.fromXY(imagePosX, listPosY), visualThumbnailSize, GameFramework.DataBinding.fromContextAndGet(universe.profile, (c) => {
                    var saveState = c.saveStateSelected();
                    var saveStateImageSnapshot = (saveState == null
                        ? null
                        : saveState.imageSnapshot.load(null));
                    var returnValue = (saveStateImageSnapshot == null || saveStateImageSnapshot.isLoaded == false
                        ? new GameFramework.VisualNone()
                        : new GameFramework.VisualImageScaled(visualThumbnailSize.clone(), new GameFramework.VisualImageImmediate(saveStateImageSnapshot, true) // isScaled
                        ));
                    return returnValue;
                }), colors.White);
                var labelSize = GameFramework.Coords.fromXY(120, buttonHeightBase);
                var labelPlaceName = GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(imagePosX, listPosY + visualThumbnailSize.y + margin), // pos
                labelSize.clone(), GameFramework.DataBinding.fromContextAndGet(universe.profile, (c) => {
                    var saveState = c.saveStateSelected();
                    return (saveState == null ? "" : saveState.placeName);
                }), fontNameAndHeight);
                var labelTimePlaying = GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(imagePosX, 90), // pos
                labelSize.clone(), // size
                GameFramework.DataBinding.fromContextAndGet(universe.profile, (c) => {
                    var saveState = c.saveStateSelected();
                    return (saveState == null ? "" : saveState.timePlayingAsString);
                }), fontNameAndHeight);
                var labelTimeSavedYMD = GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(imagePosX, 100), // pos
                labelSize.clone(), GameFramework.DataBinding.fromContextAndGet(universe.profile, (c) => {
                    var saveState = c.saveStateSelected();
                    var returnValue = (saveState == null
                        ? ""
                        :
                            (saveState.timeSaved == null
                                ? ""
                                : saveState.timeSaved.toStringYYYY_MM_DD()));
                    return returnValue;
                }), fontNameAndHeight);
                var labelTimeSavedHMS = GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(imagePosX, 110), // pos
                labelSize.clone(), GameFramework.DataBinding.fromContextAndGet(universe.profile, (c) => {
                    var saveState = c.saveStateSelected();
                    return (saveState == null ? "" : saveState.timeSaved.toStringHH_MM_SS());
                }), fontNameAndHeight);
                var buttonBack = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(sizeBase.x - margin - buttonSize.x, buttonPosY), // pos
                buttonSize.clone(), "Back", fontNameAndHeight, back // click
                );
                var childControls = [
                    labelProfileName,
                    labelChooseAState,
                    listSaveStates,
                    buttonNew,
                    buttonSelect,
                    buttonFile,
                    buttonDelete,
                    visualSnapshot,
                    labelPlaceName,
                    labelTimePlaying,
                    labelTimeSavedYMD,
                    labelTimeSavedHMS,
                    buttonBack
                ];
                var returnValue = new GameFramework.ControlContainer("containerSaveStates", GameFramework.Coords.create(), // pos
                sizeBase.clone(), // size
                childControls, null, null);
                returnValue.scalePosAndSize(scaleMultiplier);
                return returnValue;
            }
            static toControlSaveStateLoadOrSave_DeleteSaveSelected(universe, size) {
                var saveStateSelected = universe.profile.saveStateSelected();
                if (saveStateSelected != null) {
                    var controlConfirm = universe.controlBuilder.confirmAndReturnToVenue(universe, size, "Delete save state \""
                        + saveStateSelected.timeSaved.toStringYYYY_MM_DD_HH_MM_SS()
                        + "\"?", universe.venueCurrent(), () => Profile.toControlSaveStateLoadOrSave_DeleteSaveSelected_Confirm(universe), null // cancel
                    );
                    var venueNext = controlConfirm.toVenue();
                    universe.venueTransitionTo(venueNext);
                }
            }
            static toControlSaveStateLoadOrSave_DeleteSaveSelected_Confirm(universe) {
                var saveStateSelected = universe.profile.saveStateSelected();
                var storageHelper = universe.storageHelper;
                storageHelper.delete(saveStateSelected.name);
                var profile = universe.profile;
                GameFramework.ArrayHelper.remove(profile.saveStates, saveStateSelected);
                storageHelper.save(profile.name, profile);
            }
            ;
            static toControlSaveStateLoadOrSave_LoadFromFile(universe, size, venueToReturnTo) {
                var venueFileUpload = new GameFramework.VenueFileUpload(null, null);
                var controlBuilder = universe.controlBuilder;
                var controlMessageReadyToLoad = controlBuilder.message4(universe, size, GameFramework.DataBinding.fromContext("Ready to load from file..."), () => Profile.toControlSaveStateLoadOrSave_LoadFromFile_Acknowledge(universe, size, venueFileUpload, venueToReturnTo));
                var venueMessageReadyToLoad = controlMessageReadyToLoad.toVenue();
                var controlMessageCancelled = controlBuilder.message4(universe, size, GameFramework.DataBinding.fromContext("No file specified."), () => // acknowlege
                 {
                    var control = controlBuilder.game(universe, size, venueToReturnTo);
                    var venueNext = control.toVenue();
                    universe.venueTransitionTo(venueNext);
                });
                var venueMessageCancelled = controlMessageCancelled.toVenue();
                venueFileUpload.venueNextIfFileSpecified = venueMessageReadyToLoad;
                venueFileUpload.venueNextIfCancelled = venueMessageCancelled;
                universe.venueTransitionTo(venueFileUpload);
            }
            ;
            static toControlSaveStateLoadOrSave_LoadFromFile_Acknowledge(universe, size, venueFileUpload, venueToReturnTo) {
                var callback = (fileContentsAsString) => {
                    var saveStateAsStringCompressed = fileContentsAsString;
                    var compressor = universe.storageHelper.compressor;
                    var saveStateSerialized = compressor.decompressString(saveStateAsStringCompressed);
                    var serializer = universe.serializer;
                    var saveState = serializer.deserialize(saveStateSerialized);
                    universe.world = saveState.toWorld(universe);
                    var venueNext = universe.controlBuilder.game(universe, size, venueToReturnTo).toVenue();
                    universe.venueTransitionTo(venueNext);
                };
                var domElement = venueFileUpload.toDomElement();
                var inputFile = domElement.getElementsByTagName("input")[0];
                var fileToLoad = inputFile.files[0];
                new GameFramework.FileHelper().loadFileAsBinaryString(fileToLoad, callback, null // contextForCallback
                );
            }
            static toControlSaveStateLoadOrSave_LoadNewWorld(universe, size) {
                var world = universe.worldCreate();
                universe.world = world;
                var controlBuilder = universe.controlBuilder;
                var venueNext = controlBuilder.worldDetail(universe, size, universe.venueCurrent()).toVenue();
                universe.venueTransitionTo(venueNext);
            }
            static toControlSaveStateLoadOrSave_LoadSelectedSlotFromLocalStorage(universe) {
                var saveStateNameSelected = universe.profile.saveStateNameSelected;
                if (saveStateNameSelected != null) {
                    var messageAsDataBinding = GameFramework.DataBinding.fromContextAndGet(null, // Will be set below.
                    (c) => "Loading game...");
                    var venueMessage = GameFramework.VenueMessage.fromMessage(messageAsDataBinding);
                    var venueTask = new GameFramework.VenueTask(venueMessage, () => // perform
                     {
                        return universe.storageHelper.load(saveStateNameSelected);
                    }, (saveStateSelected) => // done
                     {
                        var worldSelected = saveStateSelected.toWorld(universe);
                        universe.world = worldSelected;
                        var venueNext = worldSelected.toVenue();
                        universe.venueTransitionTo(venueNext);
                    });
                    messageAsDataBinding.contextSet(venueTask);
                    universe.venueTransitionTo(venueTask);
                }
            }
            static toControlSaveStateLoadOrSave_SaveToLocalStorage(universe) {
                var profile = universe.profile;
                var world = universe.world;
                var saveState = world.toSaveState(universe);
                var storageHelper = universe.storageHelper;
                var errorMessageFromSave;
                try {
                    var saveStateName = saveState.name;
                    storageHelper.save(saveStateName, saveState);
                    var profileHasSaveStateWithName = profile.saveStates.some(x => x.name == saveStateName);
                    if (profileHasSaveStateWithName == false) {
                        saveState.unload();
                        profile.saveStates.push(saveState);
                        storageHelper.save(profile.name, profile);
                    }
                    var profileNames = storageHelper.load(Profile.StorageKeyProfileNames);
                    if (profileNames == null) {
                        profileNames = new Array();
                        storageHelper.save(Profile.StorageKeyProfileNames, profileNames);
                    }
                    if (profileNames.indexOf(profile.name) == -1) {
                        profileNames.push(profile.name);
                        storageHelper.save(Profile.StorageKeyProfileNames, profileNames);
                    }
                    errorMessageFromSave = null;
                }
                catch (ex) {
                    var exceptionTypeName = ex.constructor.name;
                    var exceptionMessage = ex.message;
                    if (exceptionTypeName == DOMException.name
                        && exceptionMessage.endsWith("exceeded the quota.")) {
                        errorMessageFromSave = "Browser out of storage space.";
                    }
                    else {
                        errorMessageFromSave = "Unexpected error.";
                    }
                }
                return errorMessageFromSave;
            }
            static toControlSaveStateLoadOrSave_SaveToLocalStorage_Done(universe, size, errorMessageFromSave, venueToReturnTo) {
                var message = (errorMessageFromSave == null
                    ? "Game saved successfully."
                    : "Save failed due to errors:\n" + errorMessageFromSave);
                var controlMessage = universe.controlBuilder.message4(universe, size, GameFramework.DataBinding.fromContext(message), () => // acknowledge
                 {
                    var venueNext = universe.controlBuilder.game(universe, null, venueToReturnTo).toVenue();
                    universe.venueTransitionTo(venueNext);
                });
                var venueNext = controlMessage.toVenue();
                universe.venueTransitionTo(venueNext);
            }
            static toControlSaveStateLoadOrSave_SaveToFilesystem(universe, size) {
                var venueMessage = GameFramework.VenueMessage.fromText("Saving game...");
                var saveDo = () => Profile.toControlSaveStateLoadOrSave_SaveToFilesystem_Do(universe);
                var venueToReturnTo = universe.venuePrev();
                var saveDone = (worldCompressedAsBytes) => Profile.toControlSaveStateLoadOrSave_SaveToFilesystem_Done(worldCompressedAsBytes, universe, size, venueToReturnTo);
                var venueTask = new GameFramework.VenueTask(venueMessage, saveDo, saveDone);
                universe.venueTransitionTo(venueTask);
            }
            static toControlSaveStateLoadOrSave_SaveToFilesystem_Do(universe) {
                var world = universe.world;
                var worldAsSaveState = world.toSaveState(universe);
                var serializer = universe.serializer;
                var saveStateSerialized = serializer.serializeWithoutFormatting(worldAsSaveState);
                var compressor = universe.storageHelper.compressor;
                var worldCompressedAsBytes = compressor.compressStringToBytes(saveStateSerialized);
                return worldCompressedAsBytes;
            }
            static toControlSaveStateLoadOrSave_SaveToFilesystem_Done(saveStateCompressedAsBytes, universe, size, venueToReturnTo) {
                var wasSaveSuccessful = (saveStateCompressedAsBytes != null);
                var message = (wasSaveSuccessful
                    ? "Save ready: choose location on dialog."
                    : "Save failed due to errors.");
                var fileNameStem = universe.saveFileNameStem();
                var fileName = fileNameStem + ".json.lzw";
                new GameFramework.FileHelper().saveBytesToFileWithName(saveStateCompressedAsBytes, fileName);
                var controlMessage = universe.controlBuilder.message4(universe, size, GameFramework.DataBinding.fromContext(message), () => // acknowledge
                 {
                    var venueNext = universe.controlBuilder.game(universe, null, venueToReturnTo).toVenue();
                    universe.venueTransitionTo(venueNext);
                });
                var venueMessage = controlMessage.toVenue();
                universe.venueTransitionTo(venueMessage);
            }
            static toControlSaveStateLoadOrSave_SaveToLocalStorageAsNewSlot(universe, size, venueToReturnTo) {
                var messageAsDataBinding = GameFramework.DataBinding.fromContextAndGet(null, // context - Set below.
                (c) => "Saving game...");
                var venueMessage = GameFramework.VenueMessage.fromMessage(messageAsDataBinding);
                var perform = () => Profile.toControlSaveStateLoadOrSave_SaveToLocalStorage(universe);
                var venueTask = new GameFramework.VenueTask(venueMessage, perform, (errorMessageFromSave) => // done
                 {
                    Profile.toControlSaveStateLoadOrSave_SaveToLocalStorage_Done(universe, size, errorMessageFromSave, venueToReturnTo);
                });
                messageAsDataBinding.contextSet(venueTask);
                universe.venueTransitionTo(venueTask);
            }
            static toControlSaveStateLoadOrSave_ThumbnailSize() {
                return GameFramework.Coords.fromXY(60, 45);
            }
            static toControlProfileNew(universe, size) {
                if (size == null) {
                    size = universe.display.sizeDefault();
                }
                var controlBuilder = universe.controlBuilder;
                var sizeBase = controlBuilder.sizeBase;
                var scaleMultiplier = size.clone().divide(sizeBase);
                var fontNameAndHeight = controlBuilder.fontBase;
                var buttonHeightBase = controlBuilder.buttonHeightBase;
                var create = () => {
                    var venueControls = universe.venueCurrent();
                    var controlRootAsContainer = venueControls.controlRoot;
                    var textBoxName = controlRootAsContainer.childByName("textBoxName");
                    var profileName = textBoxName.text(null);
                    if (profileName == "") {
                        return;
                    }
                    var storageHelper = universe.storageHelper;
                    var profile = new Profile(profileName, []);
                    var profileNames = storageHelper.load(Profile.StorageKeyProfileNames);
                    if (profileNames == null) {
                        profileNames = [];
                    }
                    profileNames.push(profileName);
                    storageHelper.save(Profile.StorageKeyProfileNames, profileNames);
                    storageHelper.save(profileName, profile);
                    universe.profileSet(profile);
                    var venueNext = Profile.toControlSaveStateLoad(universe, null, universe.venueCurrent()).toVenue();
                    universe.venueTransitionTo(venueNext);
                };
                var cancel = () => // click
                 {
                    var venueNext = Profile.toControlProfileSelect(universe, null, universe.venueCurrent()).toVenue();
                    universe.venueTransitionTo(venueNext);
                };
                var returnValue = GameFramework.ControlContainer.fromNamePosSizeChildren("containerProfileNew", GameFramework.Coords.create(), // pos
                sizeBase.clone(), // size
                // children
                [
                    GameFramework.ControlLabel.fromPosSizeTextFontCentered(GameFramework.Coords.fromXY(50, 35), // pos
                    GameFramework.Coords.fromXY(100, 15), // size
                    GameFramework.DataBinding.fromContext("Profile Name:"), fontNameAndHeight),
                    new GameFramework.ControlTextBox("textBoxName", GameFramework.Coords.fromXY(50, 50), // pos
                    GameFramework.Coords.fromXY(100, 20), // size
                    new GameFramework.DataBinding(universe.profile, (c) => c.name, (c, v) => c.name = v), // text
                    fontNameAndHeight, null, // charCountMax
                    GameFramework.DataBinding.fromTrue() // isEnabled
                    ),
                    GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(50, 80), // pos
                    GameFramework.Coords.fromXY(45, buttonHeightBase), // size
                    "Create", fontNameAndHeight, create).isEnabledSet(GameFramework.DataBinding.fromContextAndGet(universe.profile, (c) => { return c.name.length > 0; })),
                    GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(105, 80), // pos
                    GameFramework.Coords.fromXY(45, buttonHeightBase), // size
                    "Cancel", fontNameAndHeight, cancel),
                ]);
                returnValue.scalePosAndSize(scaleMultiplier);
                return returnValue;
            }
            static toControlProfileSelect(universe, size, venuePrev) {
                if (size == null) {
                    size = universe.display.sizeDefault();
                }
                var controlBuilder = universe.controlBuilder;
                var sizeBase = controlBuilder.sizeBase;
                var scaleMultiplier = size.clone().divide(sizeBase);
                var fontNameAndHeight = controlBuilder.fontBase;
                var buttonHeightBase = controlBuilder.buttonHeightBase;
                var storageHelper = universe.storageHelper;
                var profileNames = storageHelper.load(Profile.StorageKeyProfileNames);
                if (profileNames == null) {
                    profileNames = [];
                    storageHelper.save(Profile.StorageKeyProfileNames, profileNames);
                }
                var profiles = profileNames.map(x => storageHelper.load(x));
                var create = () => {
                    var profile = Profile.blank();
                    universe.profileSet(profile);
                    var venueNext = Profile.toControlProfileNew(universe, null).toVenue();
                    universe.venueTransitionTo(venueNext);
                };
                var select = () => {
                    var venueControls = universe.venueCurrent();
                    var controlRootAsContainer = venueControls.controlRoot;
                    var listProfiles = controlRootAsContainer.childByName("listProfiles");
                    var profileSelected = listProfiles.itemSelected();
                    universe.profileSet(profileSelected);
                    if (profileSelected != null) {
                        var venueNext = Profile.toControlSaveStateLoad(universe, null, universe.venueCurrent()).toVenue();
                        universe.venueTransitionTo(venueNext);
                    }
                };
                var deleteProfileConfirm = () => {
                    var profileSelected = universe.profile;
                    var storageHelper = universe.storageHelper;
                    storageHelper.delete(profileSelected.name);
                    var profileNames = storageHelper.load(Profile.StorageKeyProfileNames);
                    GameFramework.ArrayHelper.remove(profileNames, profileSelected.name);
                    storageHelper.save(Profile.StorageKeyProfileNames, profileNames);
                };
                var deleteProfile = () => {
                    var profileSelected = universe.profile;
                    if (profileSelected != null) {
                        var controlConfirm = universe.controlBuilder.confirmAndReturnToVenue(universe, size, "Delete profile \""
                            + profileSelected.name
                            + "\"?", universe.venueCurrent(), deleteProfileConfirm, null // cancel
                        );
                        var venueNext = controlConfirm.toVenue();
                        universe.venueTransitionTo(venueNext);
                    }
                };
                var returnValue = GameFramework.ControlContainer.fromNamePosSizeChildren("containerProfileSelect", GameFramework.Coords.create(), // pos
                sizeBase.clone(), // size
                // children
                [
                    GameFramework.ControlLabel.fromPosSizeTextFontCentered(GameFramework.Coords.fromXY(30, 35), // pos
                    GameFramework.Coords.fromXY(140, 15), // size
                    GameFramework.DataBinding.fromContext("Select a Profile:"), fontNameAndHeight),
                    new GameFramework.ControlList("listProfiles", GameFramework.Coords.fromXY(30, 50), // pos
                    GameFramework.Coords.fromXY(140, 40), // size
                    GameFramework.DataBinding.fromGet((c) => profiles), // items
                    GameFramework.DataBinding.fromGet((c) => c.name), // bindingForItemText
                    fontNameAndHeight, new GameFramework.DataBinding(universe, (c) => c.profile, (c, v) => c.profileSet(v)), // bindingForOptionSelected
                    GameFramework.DataBinding.fromGet((c) => c.name), // value
                    null, // bindingForIsEnabled
                    select, // confirm
                    null // widthInItems
                    ),
                    GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(30, 95), // pos
                    GameFramework.Coords.fromXY(35, buttonHeightBase), // size
                    "New", fontNameAndHeight, create // click
                    ),
                    GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(70, 95), // pos
                    GameFramework.Coords.fromXY(35, buttonHeightBase), // size
                    "Select", fontNameAndHeight, select // click
                    ).isEnabledSet(GameFramework.DataBinding.fromContextAndGet(universe, (c) => { return (c.profile != null); })),
                    GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(110, 95), // pos
                    GameFramework.Coords.fromXY(35, buttonHeightBase), // size
                    "Skip", fontNameAndHeight, () => {
                        var profile = Profile.anonymous();
                        universe.profileSet(profile);
                        var venueNext = universe.worldCreator.toVenue(universe);
                        universe.venueTransitionTo(venueNext);
                    }),
                    GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(150, 95), // pos
                    GameFramework.Coords.fromXY(20, buttonHeightBase), // size
                    "X", fontNameAndHeight, deleteProfile // click
                    ).isEnabledSet(GameFramework.DataBinding.fromContextAndGet(universe, (c) => { return (c.profile != null); })),
                    GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(sizeBase.x - 10 - 25, sizeBase.y - 10 - 20), // pos
                    GameFramework.Coords.fromXY(25, 20), // size
                    "Back", fontNameAndHeight, () => // click
                     {
                        universe.venueTransitionTo(venuePrev);
                    }),
                ]);
                returnValue.scalePosAndSize(scaleMultiplier);
                return returnValue;
            }
        }
        Profile.StorageKeyProfileNames = "ProfileNames";
        GameFramework.Profile = Profile;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
