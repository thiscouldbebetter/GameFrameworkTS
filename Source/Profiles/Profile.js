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
            saveStateSelected() {
                return this.saveStates.filter(x => x.name == this.saveStateNameSelected)[0];
            }
            // controls
            static toControlSaveStateLoad(universe, size, venuePrev) {
                var isLoadNotSave = true;
                return Profile.toControlSaveStateLoadOrSave(universe, size, venuePrev, isLoadNotSave);
            }
            static toControlSaveStateSave(universe, size, venuePrev) {
                var isLoadNotSave = false;
                return Profile.toControlSaveStateLoadOrSave(universe, size, venuePrev, isLoadNotSave);
            }
            static toControlSaveStateLoadOrSave(universe, size, venuePrev, isLoadNotSave) {
                if (size == null) {
                    size = universe.display.sizeDefault();
                }
                var controlBuilder = universe.controlBuilder;
                var sizeBase = controlBuilder.sizeBase;
                var scaleMultiplier = size.clone().divide(sizeBase);
                var fontHeight = controlBuilder.fontHeightInPixelsBase;
                var buttonHeightBase = controlBuilder.buttonHeightBase;
                var visualThumbnailSize = new GameFramework.Coords(60, 45, 0);
                var venueToReturnTo = universe.venueCurrent;
                var loadNewWorld = () => {
                    var world = universe.worldCreate();
                    universe.world = world;
                    var venueNext = new GameFramework.VenueControls(controlBuilder.worldDetail(universe, size, universe.venueCurrent), false);
                    venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                    universe.venueNext = venueNext;
                };
                var loadSelectedSlotFromLocalStorage = () => {
                    var saveStateNameSelected = universe.profile.saveStateNameSelected;
                    if (saveStateNameSelected != null) {
                        var messageAsDataBinding = new GameFramework.DataBinding(null, // Will be set below.
                        (c) => "Loading game...", null);
                        var venueMessage = new GameFramework.VenueMessage(messageAsDataBinding, null, null, null, null);
                        var venueTask = new GameFramework.VenueTask(venueMessage, () => // perform
                         {
                            return universe.storageHelper.load(saveStateNameSelected);
                        }, (universe, saveStateSelected) => // done
                         {
                            var worldSelected = saveStateSelected.world;
                            universe.world = worldSelected;
                            var venueNext = new GameFramework.VenueWorld(worldSelected);
                            venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                            universe.venueNext = venueNext;
                        });
                        messageAsDataBinding.contextSet(venueTask);
                        universe.venueNext = new GameFramework.VenueFader(venueTask, universe.venueCurrent, null, null);
                    }
                };
                var saveToLocalStorage = (saveState) => {
                    var profile = universe.profile;
                    var world = universe.world;
                    var now = GameFramework.DateTime.now();
                    world.dateSaved = now;
                    var nowAsString = now.toStringYYYYMMDD_HHMM_SS();
                    var place = world.placeCurrent;
                    var placeName = place.name;
                    var timePlayingAsString = world.timePlayingAsStringShort(universe);
                    var displaySize = universe.display.sizeInPixels;
                    var displayFull = new GameFramework.Display2D([displaySize], null, null, null, null, true); // isInvisible
                    displayFull.initialize(universe);
                    place.draw(universe, world, displayFull);
                    var imageSnapshotFull = displayFull.toImage();
                    var imageSizeThumbnail = visualThumbnailSize.clone();
                    var displayThumbnail = new GameFramework.Display2D([imageSizeThumbnail], null, null, null, null, true);
                    displayThumbnail.initialize(universe);
                    displayThumbnail.drawImageScaled(imageSnapshotFull, GameFramework.Coords.Instances().Zeroes, imageSizeThumbnail);
                    var imageThumbnailFromDisplay = displayThumbnail.toImage();
                    var imageThumbnailAsDataUrl = imageThumbnailFromDisplay.systemImage.toDataURL();
                    var imageThumbnail = new GameFramework.Image2("Snapshot", imageThumbnailAsDataUrl).unload();
                    var saveStateName = "Save-" + nowAsString;
                    var saveState = new GameFramework.SaveState(saveStateName, placeName, timePlayingAsString, now, imageThumbnail, world);
                    var storageHelper = universe.storageHelper;
                    var wasSaveSuccessful;
                    try {
                        storageHelper.save(saveStateName, saveState);
                        if (profile.saveStates.some(x => x.name == saveStateName) == false) {
                            saveState.unload();
                            profile.saveStates.push(saveState);
                            storageHelper.save(profile.name, profile);
                        }
                        var profileNames = storageHelper.load("ProfileNames");
                        if (profileNames.indexOf(profile.name) == -1) {
                            profileNames.push(profile.name);
                            storageHelper.save("ProfileNames", profileNames);
                        }
                        wasSaveSuccessful = true;
                    }
                    catch (ex) {
                        wasSaveSuccessful = false;
                    }
                    return wasSaveSuccessful;
                };
                var saveToLocalStorageDone = (wasSaveSuccessful) => {
                    var message = (wasSaveSuccessful ? "Game saved successfully." : "Save failed due to errors.");
                    var controlMessage = universe.controlBuilder.message(universe, size, new GameFramework.DataBinding(message, null, null), () => // acknowledge
                     {
                        var venueNext = new GameFramework.VenueControls(universe.controlBuilder.game(universe, null, universe.venueCurrent), false);
                        venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                        universe.venueNext = venueNext;
                    }, false);
                    var venueNext = new GameFramework.VenueControls(controlMessage, false);
                    venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                    universe.venueNext = venueNext;
                };
                var saveToLocalStorageAsNewSlot = () => {
                    var messageAsDataBinding = new GameFramework.DataBinding(null, // context - Set below.
                    (c) => "Saving game...", null);
                    var venueMessage = new GameFramework.VenueMessage(messageAsDataBinding, null, null, null, null);
                    var venueTask = new GameFramework.VenueTask(venueMessage, saveToLocalStorage, (universe, result) => // done
                     {
                        saveToLocalStorageDone(result);
                    });
                    messageAsDataBinding.contextSet(venueTask);
                    universe.venueNext = new GameFramework.VenueFader(venueTask, universe.venueCurrent, null, null);
                };
                var saveToFilesystem = () => {
                    var venueMessage = GameFramework.VenueMessage.fromText("Saving game...");
                    var venueTask = new GameFramework.VenueTask(venueMessage, () => // perform
                     {
                        var world = universe.world;
                        world.dateSaved = GameFramework.DateTime.now();
                        var worldSerialized = universe.serializer.serialize(world, null);
                        var compressor = universe.storageHelper.compressor;
                        var worldCompressedAsBytes = compressor.compressStringToBytes(worldSerialized);
                        return worldCompressedAsBytes;
                    }, (universe, worldCompressedAsBytes) => // done
                     {
                        var wasSaveSuccessful = (worldCompressedAsBytes != null);
                        var message = (wasSaveSuccessful ? "Save ready: choose location on dialog." : "Save failed due to errors.");
                        new GameFramework.FileHelper().saveBytesToFileWithName(worldCompressedAsBytes, universe.world.name + ".json.lzw");
                        var controlMessage = universe.controlBuilder.message(universe, size, new GameFramework.DataBinding(message, null, null), () => // acknowledge
                         {
                            var venueNext = new GameFramework.VenueControls(universe.controlBuilder.game(universe, null, universe.venueCurrent), false);
                            venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                            universe.venueNext = venueNext;
                        }, null);
                        var venueMessage = new GameFramework.VenueControls(controlMessage, false);
                        universe.venueNext = new GameFramework.VenueFader(venueMessage, universe.venueCurrent, null, null);
                    });
                    universe.venueNext = new GameFramework.VenueFader(venueTask, universe.venueCurrent, null, null);
                };
                var loadFromFile = () => // click
                 {
                    var venueFileUpload = new GameFramework.VenueFileUpload(null, null);
                    var controlMessageReadyToLoad = universe.controlBuilder.message(universe, size, new GameFramework.DataBinding("Ready to load from file...", null, null), () => // acknowledge
                     {
                        function callback(fileContentsAsString) {
                            var worldAsStringCompressed = fileContentsAsString;
                            var compressor = universe.storageHelper.compressor;
                            var worldSerialized = compressor.decompressString(worldAsStringCompressed);
                            var worldDeserialized = universe.serializer.deserialize(worldSerialized);
                            universe.world = worldDeserialized;
                            var venueNext = new GameFramework.VenueControls(universe.controlBuilder.game(universe, size, universe.venueCurrent), false);
                            venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                            universe.venueNext = venueNext;
                        }
                        var inputFile = venueFileUpload.toDomElement().getElementsByTagName("input")[0];
                        var fileToLoad = inputFile.files[0];
                        new GameFramework.FileHelper().loadFileAsBinaryString(fileToLoad, callback, null // contextForCallback
                        );
                    }, null);
                    var venueMessageReadyToLoad = new GameFramework.VenueControls(controlMessageReadyToLoad, false);
                    var controlMessageCancelled = universe.controlBuilder.message(universe, size, new GameFramework.DataBinding("No file specified.", null, null), () => // acknowlege
                     {
                        var venueNext = new GameFramework.VenueControls(universe.controlBuilder.game(universe, size, universe.venueCurrent), false);
                        venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                        universe.venueNext = venueNext;
                    }, false //?
                    );
                    var venueMessageCancelled = new GameFramework.VenueControls(controlMessageCancelled, false);
                    venueFileUpload.venueNextIfFileSpecified = venueMessageReadyToLoad;
                    venueFileUpload.venueNextIfCancelled = venueMessageCancelled;
                    universe.venueNext = venueFileUpload;
                };
                var back = () => {
                    var venueNext = venueToReturnTo;
                    venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                    universe.venueNext = venueNext;
                };
                var deleteSaveSelectedConfirm = () => {
                    var saveStateSelected = universe.profile.saveStateSelected();
                    var storageHelper = universe.storageHelper;
                    storageHelper.delete(saveStateSelected.name);
                    var profile = universe.profile;
                    GameFramework.ArrayHelper.remove(profile.saveStates, saveStateSelected);
                    storageHelper.save(profile.name, profile);
                };
                var deleteSaveSelected = () => {
                    var saveStateSelected = universe.profile.saveStateSelected();
                    if (saveStateSelected == null) {
                        return;
                    }
                    var controlConfirm = universe.controlBuilder.confirmAndReturnToVenue(universe, size, "Delete save state \""
                        + saveStateSelected.timeSaved.toStringYYYY_MM_DD_HH_MM_SS()
                        + "\"?", universe.venueCurrent, deleteSaveSelectedConfirm, null // cancel
                    );
                    var venueNext = new GameFramework.VenueControls(controlConfirm, false);
                    venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                    universe.venueNext = venueNext;
                };
                var saveToLocalStorageOverwritingSlotSelected = () => {
                    deleteSaveSelectedConfirm();
                    saveToLocalStorageAsNewSlot();
                };
                var returnValue = new GameFramework.ControlContainer("containerSaveStates", GameFramework.Coords.blank(), // pos
                sizeBase.clone(), // size
                // children
                [
                    new GameFramework.ControlLabel("labelProfileName", new GameFramework.Coords(100, 10, 0), // pos
                    new GameFramework.Coords(120, fontHeight, 0), // size
                    true, // isTextCentered
                    "Profile: " + universe.profile.name, fontHeight),
                    new GameFramework.ControlLabel("labelChooseASave", new GameFramework.Coords(100, 20, 0), // pos
                    new GameFramework.Coords(150, 25, 0), // size
                    true, // isTextCentered
                    "Choose a State to " + (isLoadNotSave ? "Restore" : "Overwrite") + ":", fontHeight),
                    new GameFramework.ControlList("listSaveStates", new GameFramework.Coords(10, 35, 0), // pos
                    new GameFramework.Coords(110, 75, 0), // size
                    new GameFramework.DataBinding(universe.profile, (c) => c.saveStates, null), // items
                    GameFramework.DataBinding.fromGet((c) => {
                        var timeSaved = c.timeSaved;
                        return (timeSaved == null ? "-" : timeSaved.toStringYYYY_MM_DD_HH_MM_SS());
                    }), // bindingForOptionText
                    fontHeight, new GameFramework.DataBinding(universe.profile, (c) => c.saveStateSelected(), (c, v) => { c.saveStateNameSelected = v.name; }), // bindingForOptionSelected
                    GameFramework.DataBinding.fromGet((c) => c), // value
                    null, (isLoadNotSave ? loadSelectedSlotFromLocalStorage : saveToLocalStorageOverwritingSlotSelected), // confirm
                    null),
                    new GameFramework.ControlButton("buttonNew", new GameFramework.Coords(10, 120, 0), // pos
                    new GameFramework.Coords(25, buttonHeightBase, 0), // size
                    "New", fontHeight, true, // hasBorder
                    true, // isEnabled
                    (isLoadNotSave ? loadNewWorld : saveToLocalStorageAsNewSlot), // click
                    null, null),
                    new GameFramework.ControlButton("buttonSelect", new GameFramework.Coords(40, 120, 0), // pos
                    new GameFramework.Coords(25, buttonHeightBase, 0), // size
                    (isLoadNotSave ? "Load" : "Save"), fontHeight, true, // hasBorder
                    // isEnabled
                    new GameFramework.DataBinding(universe.profile, (c) => (c.saveStateNameSelected != null), null), (isLoadNotSave ? loadSelectedSlotFromLocalStorage : saveToLocalStorageOverwritingSlotSelected), // click
                    null, null),
                    new GameFramework.ControlButton("buttonFile", new GameFramework.Coords(70, 120, 0), // pos
                    new GameFramework.Coords(25, buttonHeightBase, 0), // size
                    "File", fontHeight, true, // hasBorder
                    // isEnabled
                    new GameFramework.DataBinding(universe.profile, (c) => (c.saveStateNameSelected != null), null), (isLoadNotSave ? loadFromFile : saveToFilesystem), // click
                    null, null),
                    new GameFramework.ControlButton("buttonDelete", new GameFramework.Coords(100, 120, 0), // pos
                    new GameFramework.Coords(20, buttonHeightBase, 0), // size
                    "X", fontHeight, true, // hasBorder
                    // isEnabled
                    new GameFramework.DataBinding(universe.profile, (c) => (c.saveStateNameSelected != null), null), deleteSaveSelected, // click
                    null, null),
                    new GameFramework.ControlVisual("visualSnapshot", new GameFramework.Coords(130, 35, 0), visualThumbnailSize, new GameFramework.DataBinding(universe.profile, (c) => {
                        var saveState = c.saveStateSelected();
                        var saveStateImageSnapshot = (saveState == null
                            ? null
                            : saveState.imageSnapshot.load());
                        var returnValue = (saveStateImageSnapshot == null || saveStateImageSnapshot.isLoaded == false
                            ? new GameFramework.VisualNone()
                            : new GameFramework.VisualImageImmediate(saveStateImageSnapshot, true) // isScaled
                        );
                        return returnValue;
                    }, null), GameFramework.Color.byName("White"), null // colorBorder
                    ),
                    new GameFramework.ControlLabel("labelPlaceName", new GameFramework.Coords(130, 80, 0), // pos
                    new GameFramework.Coords(120, buttonHeightBase, 0), // size
                    false, // isTextCentered
                    new GameFramework.DataBinding(universe.profile, (c) => {
                        var saveState = c.saveStateSelected();
                        return (saveState == null ? "" : saveState.placeName);
                    }, null), fontHeight),
                    new GameFramework.ControlLabel("labelTimePlaying", new GameFramework.Coords(130, 90, 0), // pos
                    new GameFramework.Coords(120, buttonHeightBase, 0), // size
                    false, // isTextCentered
                    new GameFramework.DataBinding(universe.profile, (c) => {
                        var saveState = c.saveStateSelected();
                        return (saveState == null ? "" : saveState.timePlayingAsString);
                    }, null), fontHeight),
                    new GameFramework.ControlLabel("labelDateSaved", new GameFramework.Coords(130, 100, 0), // pos
                    new GameFramework.Coords(120, buttonHeightBase, 0), // size
                    false, // isTextCentered
                    new GameFramework.DataBinding(universe.profile, (c) => {
                        var saveState = c.saveStateSelected();
                        var returnValue = (saveState == null
                            ? ""
                            :
                                (saveState.timeSaved == null
                                    ? ""
                                    : saveState.timeSaved.toStringYYYY_MM_DD()));
                        return returnValue;
                    }, null), fontHeight),
                    new GameFramework.ControlLabel("labelTimeSaved", new GameFramework.Coords(130, 110, 0), // pos
                    new GameFramework.Coords(120, buttonHeightBase, 0), // size
                    false, // isTextCentered
                    new GameFramework.DataBinding(universe.profile, (c) => {
                        var saveState = c.saveStateSelected();
                        return (saveState == null ? "" : saveState.timeSaved.toStringHH_MM_SS());
                    }, null), fontHeight),
                    new GameFramework.ControlButton("buttonBack", new GameFramework.Coords(sizeBase.x - 10 - 25, sizeBase.y - 10 - 15, 0), // pos
                    new GameFramework.Coords(25, 15, 0), // size
                    "Back", fontHeight, true, // hasBorder
                    true, // isEnabled
                    back, // click
                    null, null),
                ], null, null);
                returnValue.scalePosAndSize(scaleMultiplier);
                return returnValue;
            }
            static toControlProfileNew(universe, size) {
                if (size == null) {
                    size = universe.display.sizeDefault();
                }
                var controlBuilder = universe.controlBuilder;
                var sizeBase = controlBuilder.sizeBase;
                var scaleMultiplier = size.clone().divide(sizeBase);
                var fontHeight = controlBuilder.fontHeightInPixelsBase;
                var buttonHeightBase = controlBuilder.buttonHeightBase;
                var returnValue = new GameFramework.ControlContainer("containerProfileNew", GameFramework.Coords.blank(), // pos
                sizeBase.clone(), // size
                // children
                [
                    new GameFramework.ControlLabel("labelName", new GameFramework.Coords(100, 40, 0), // pos
                    new GameFramework.Coords(100, 20, 0), // size
                    true, // isTextCentered
                    "Profile Name:", fontHeight),
                    new GameFramework.ControlTextBox("textBoxName", new GameFramework.Coords(50, 50, 0), // pos
                    new GameFramework.Coords(100, 20, 0), // size
                    new GameFramework.DataBinding(universe.profile, (c) => { return c.name; }, (c, v) => { c.name = v; }), // text
                    fontHeight, null, // charCountMax
                    new GameFramework.DataBinding(true, null, null) // isEnabled
                    ),
                    new GameFramework.ControlButton("buttonCreate", new GameFramework.Coords(50, 80, 0), // pos
                    new GameFramework.Coords(45, buttonHeightBase, 0), // size
                    "Create", fontHeight, true, // hasBorder
                    // isEnabled
                    new GameFramework.DataBinding(universe.profile, (c) => { return c.name.length > 0; }, null), () => // click
                     {
                        var venueControls = universe.venueCurrent;
                        var controlRootAsContainer = venueControls.controlRoot;
                        var textBoxName = controlRootAsContainer.childrenByName.get("textBoxName");
                        var profileName = textBoxName.text(null, universe);
                        if (profileName == "") {
                            return;
                        }
                        var storageHelper = universe.storageHelper;
                        var profile = new Profile(profileName, []);
                        var profileNames = storageHelper.load("ProfileNames");
                        if (profileNames == null) {
                            profileNames = [];
                        }
                        profileNames.push(profileName);
                        storageHelper.save("ProfileNames", profileNames);
                        storageHelper.save(profileName, profile);
                        universe.profile = profile;
                        var venueNext = new GameFramework.VenueControls(Profile.toControlSaveStateLoad(universe, null, universe.venueCurrent), false);
                        venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                        universe.venueNext = venueNext;
                    }, null, null),
                    new GameFramework.ControlButton("buttonCancel", new GameFramework.Coords(105, 80, 0), // pos
                    new GameFramework.Coords(45, buttonHeightBase, 0), // size
                    "Cancel", fontHeight, true, // hasBorder
                    true, // isEnabled
                    () => // click
                     {
                        var venueNext = new GameFramework.VenueControls(Profile.toControlProfileSelect(universe, null, universe.venueCurrent), false);
                        venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                        universe.venueNext = venueNext;
                    }, null, null),
                ], null, null);
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
                var fontHeight = controlBuilder.fontHeightInPixelsBase;
                var buttonHeightBase = controlBuilder.buttonHeightBase;
                var storageHelper = universe.storageHelper;
                var profileNames = storageHelper.load("ProfileNames");
                if (profileNames == null) {
                    profileNames = [];
                    storageHelper.save("ProfileNames", profileNames);
                }
                var profiles = profileNames.map(x => storageHelper.load(x));
                var create = () => {
                    universe.profile = new Profile("", null);
                    var venueNext = new GameFramework.VenueControls(Profile.toControlProfileNew(universe, null), false);
                    venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                    universe.venueNext = venueNext;
                };
                var select = () => {
                    var venueControls = universe.venueCurrent;
                    var controlRootAsContainer = venueControls.controlRoot;
                    var listProfiles = controlRootAsContainer.childrenByName.get("listProfiles");
                    var profileSelected = listProfiles.itemSelected(null);
                    universe.profile = profileSelected;
                    if (profileSelected != null) {
                        var venueNext = new GameFramework.VenueControls(Profile.toControlSaveStateLoad(universe, null, universe.venueCurrent), false);
                        venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                        universe.venueNext = venueNext;
                    }
                };
                var skip = () => {
                    var messageAsDataBinding = new GameFramework.DataBinding(null, // Will be set below.
                    (c) => "Generating world...", null);
                    var venueMessage = new GameFramework.VenueMessage(messageAsDataBinding, null, null, null, null);
                    var venueTask = new GameFramework.VenueTask(venueMessage, () => // perform
                     {
                        return universe.worldCreate();
                    }, (universe, world) => // done
                     {
                        universe.world = world;
                        var now = GameFramework.DateTime.now();
                        var nowAsString = now.toStringMMDD_HHMM_SS();
                        var profileName = "Anon-" + nowAsString;
                        var profile = new Profile(profileName, []);
                        universe.profile = profile;
                        var venueNext = new GameFramework.VenueWorld(universe.world);
                        venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                        universe.venueNext = venueNext;
                    });
                    messageAsDataBinding.contextSet(venueTask);
                    universe.venueNext = new GameFramework.VenueFader(venueTask, universe.venueCurrent, null, null);
                };
                var deleteProfileConfirm = () => {
                    var profileSelected = universe.profile;
                    var storageHelper = universe.storageHelper;
                    storageHelper.delete(profileSelected.name);
                    var profileNames = storageHelper.load("ProfileNames");
                    GameFramework.ArrayHelper.remove(profileNames, profileSelected.name);
                    storageHelper.save("ProfileNames", profileNames);
                };
                var deleteProfile = () => {
                    var profileSelected = universe.profile;
                    if (profileSelected != null) {
                        var controlConfirm = universe.controlBuilder.confirmAndReturnToVenue(universe, size, "Delete profile \""
                            + profileSelected.name
                            + "\"?", universe.venueCurrent, deleteProfileConfirm, null // cancel
                        );
                        var venueNext = new GameFramework.VenueControls(controlConfirm, false);
                        venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                        universe.venueNext = venueNext;
                    }
                };
                var returnValue = new GameFramework.ControlContainer("containerProfileSelect", GameFramework.Coords.blank(), // pos
                sizeBase.clone(), // size
                // children
                [
                    new GameFramework.ControlLabel("labelSelectAProfile", new GameFramework.Coords(100, 40, 0), // pos
                    new GameFramework.Coords(100, 25, 0), // size
                    true, // isTextCentered
                    "Select a Profile:", fontHeight),
                    new GameFramework.ControlList("listProfiles", new GameFramework.Coords(30, 50, 0), // pos
                    new GameFramework.Coords(140, 40, 0), // size
                    GameFramework.DataBinding.fromContext(profiles), // items
                    GameFramework.DataBinding.fromGet((c) => c.name), // bindingForItemText
                    fontHeight, new GameFramework.DataBinding(universe, (c) => { return c.profile; }, (c, v) => { c.profile = v; }), // bindingForOptionSelected
                    GameFramework.DataBinding.fromGet((c) => c), // value
                    null, // bindingForIsEnabled
                    select, // confirm
                    null // widthInItems
                    ),
                    new GameFramework.ControlButton("buttonNew", new GameFramework.Coords(30, 95, 0), // pos
                    new GameFramework.Coords(35, buttonHeightBase, 0), // size
                    "New", fontHeight, true, // hasBorder
                    true, // isEnabled
                    create, // click
                    null, null),
                    new GameFramework.ControlButton("buttonSelect", new GameFramework.Coords(70, 95, 0), // pos
                    new GameFramework.Coords(35, buttonHeightBase, 0), // size
                    "Select", fontHeight, true, // hasBorder
                    // isEnabled
                    new GameFramework.DataBinding(universe, (c) => { return (c.profile != null); }, null), select, // click
                    null, null),
                    new GameFramework.ControlButton("buttonSkip", new GameFramework.Coords(110, 95, 0), // pos
                    new GameFramework.Coords(35, buttonHeightBase, 0), // size
                    "Skip", fontHeight, true, // hasBorder
                    true, // isEnabled
                    skip, // click
                    null, null),
                    new GameFramework.ControlButton("buttonDelete", new GameFramework.Coords(150, 95, 0), // pos
                    new GameFramework.Coords(20, buttonHeightBase, 0), // size
                    "X", fontHeight, true, // hasBorder
                    true, // isEnabled
                    deleteProfile, // click
                    null, null),
                    new GameFramework.ControlButton("buttonBack", new GameFramework.Coords(sizeBase.x - 10 - 25, sizeBase.y - 10 - 20, 0), // pos
                    new GameFramework.Coords(25, 20, 0), // size
                    "Back", fontHeight, true, // hasBorder
                    true, // isEnabled
                    () => // click
                     {
                        var venueNext = venuePrev;
                        venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                        universe.venueNext = venueNext;
                    }, null, null),
                ], null, null);
                returnValue.scalePosAndSize(scaleMultiplier);
                return returnValue;
            }
        }
        GameFramework.Profile = Profile;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
