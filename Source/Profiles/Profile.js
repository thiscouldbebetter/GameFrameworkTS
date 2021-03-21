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
                var visualThumbnailSize = GameFramework.Coords.fromXY(60, 45);
                var venueToReturnTo = universe.venueCurrent;
                var loadNewWorld = () => {
                    var world = universe.worldCreate();
                    universe.world = world;
                    var venueNext = controlBuilder.worldDetail(universe, size, universe.venueCurrent).toVenue();
                    venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                    universe.venueNext = venueNext;
                };
                var loadSelectedSlotFromLocalStorage = () => {
                    var saveStateNameSelected = universe.profile.saveStateNameSelected;
                    if (saveStateNameSelected != null) {
                        var messageAsDataBinding = GameFramework.DataBinding.fromContextAndGet(null, // Will be set below.
                        (c) => "Loading game...");
                        var venueMessage = GameFramework.VenueMessage.fromMessage(messageAsDataBinding);
                        var venueTask = new GameFramework.VenueTask(venueMessage, () => // perform
                         {
                            return universe.storageHelper.load(saveStateNameSelected);
                        }, (universe, saveStateSelected) => // done
                         {
                            var worldSelected = saveStateSelected.world;
                            universe.world = worldSelected;
                            var venueNext = worldSelected.toVenue();
                            venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                            universe.venueNext = venueNext;
                        });
                        messageAsDataBinding.contextSet(venueTask);
                        universe.venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueTask, universe.venueCurrent);
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
                        var venueNext = universe.controlBuilder.game(universe, null, universe.venueCurrent).toVenue();
                        venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                        universe.venueNext = venueNext;
                    }, false);
                    var venueNext = controlMessage.toVenue();
                    venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                    universe.venueNext = venueNext;
                };
                var saveToLocalStorageAsNewSlot = () => {
                    var messageAsDataBinding = GameFramework.DataBinding.fromContextAndGet(null, // context - Set below.
                    (c) => "Saving game...");
                    var venueMessage = GameFramework.VenueMessage.fromMessage(messageAsDataBinding);
                    var venueTask = new GameFramework.VenueTask(venueMessage, saveToLocalStorage, (universe, result) => // done
                     {
                        saveToLocalStorageDone(result);
                    });
                    messageAsDataBinding.contextSet(venueTask);
                    universe.venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueTask, universe.venueCurrent);
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
                            var venueNext = universe.controlBuilder.game(universe, null, universe.venueCurrent).toVenue();
                            venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                            universe.venueNext = venueNext;
                        }, null);
                        var venueMessage = controlMessage.toVenue();
                        universe.venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueMessage, universe.venueCurrent);
                    });
                    universe.venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueTask, universe.venueCurrent);
                };
                var loadFromFile = () => // click
                 {
                    var venueFileUpload = new GameFramework.VenueFileUpload(null, null);
                    var controlMessageReadyToLoad = controlBuilder.message(universe, size, new GameFramework.DataBinding("Ready to load from file...", null, null), () => // acknowledge
                     {
                        var callback = (fileContentsAsString) => {
                            var worldAsStringCompressed = fileContentsAsString;
                            var compressor = universe.storageHelper.compressor;
                            var worldSerialized = compressor.decompressString(worldAsStringCompressed);
                            var worldDeserialized = universe.serializer.deserialize(worldSerialized);
                            universe.world = worldDeserialized;
                            var venueNext = universe.controlBuilder.game(universe, size, universe.venueCurrent).toVenue();
                            venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                            universe.venueNext = venueNext;
                        };
                        var inputFile = venueFileUpload.toDomElement().getElementsByTagName("input")[0];
                        var fileToLoad = inputFile.files[0];
                        new GameFramework.FileHelper().loadFileAsBinaryString(fileToLoad, callback, null // contextForCallback
                        );
                    }, null);
                    var venueMessageReadyToLoad = controlMessageReadyToLoad.toVenue();
                    var controlMessageCancelled = controlBuilder.message(universe, size, GameFramework.DataBinding.fromContext("No file specified."), () => // acknowlege
                     {
                        var venueNext = controlBuilder.game(universe, size, universe.venueCurrent).toVenue();
                        venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                        universe.venueNext = venueNext;
                    }, false //?
                    );
                    var venueMessageCancelled = controlMessageCancelled.toVenue();
                    venueFileUpload.venueNextIfFileSpecified = venueMessageReadyToLoad;
                    venueFileUpload.venueNextIfCancelled = venueMessageCancelled;
                    universe.venueNext = venueFileUpload;
                };
                var back = () => {
                    var venueNext = venueToReturnTo;
                    venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
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
                    var venueNext = controlConfirm.toControls();
                    venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                    universe.venueNext = venueNext;
                };
                var saveToLocalStorageOverwritingSlotSelected = () => {
                    deleteSaveSelectedConfirm();
                    saveToLocalStorageAsNewSlot();
                };
                var returnValue = new GameFramework.ControlContainer("containerSaveStates", GameFramework.Coords.create(), // pos
                sizeBase.clone(), // size
                // children
                [
                    new GameFramework.ControlLabel("labelProfileName", GameFramework.Coords.fromXY(100, 10), // pos
                    GameFramework.Coords.fromXY(120, fontHeight), // size
                    true, // isTextCentered
                    "Profile: " + universe.profile.name, fontHeight),
                    new GameFramework.ControlLabel("labelChooseASave", GameFramework.Coords.fromXY(100, 20), // pos
                    GameFramework.Coords.fromXY(150, 25), // size
                    true, // isTextCentered
                    "Choose a State to " + (isLoadNotSave ? "Restore" : "Overwrite") + ":", fontHeight),
                    new GameFramework.ControlList("listSaveStates", GameFramework.Coords.fromXY(10, 35), // pos
                    GameFramework.Coords.fromXY(110, 75), // size
                    new GameFramework.DataBinding(universe.profile, (c) => c.saveStates, null), // items
                    GameFramework.DataBinding.fromGet((c) => {
                        var timeSaved = c.timeSaved;
                        return (timeSaved == null ? "-" : timeSaved.toStringYYYY_MM_DD_HH_MM_SS());
                    }), // bindingForOptionText
                    fontHeight, new GameFramework.DataBinding(universe.profile, (c) => c.saveStateSelected(), (c, v) => { c.saveStateNameSelected = v.name; }), // bindingForOptionSelected
                    GameFramework.DataBinding.fromGet((c) => c), // value
                    null, (isLoadNotSave ? loadSelectedSlotFromLocalStorage : saveToLocalStorageOverwritingSlotSelected), // confirm
                    null),
                    new GameFramework.ControlButton("buttonNew", GameFramework.Coords.fromXY(10, 120), // pos
                    GameFramework.Coords.fromXY(25, buttonHeightBase), // size
                    "New", fontHeight, true, // hasBorder
                    true, // isEnabled
                    (isLoadNotSave ? loadNewWorld : saveToLocalStorageAsNewSlot), // click
                    null, null),
                    new GameFramework.ControlButton("buttonSelect", GameFramework.Coords.fromXY(40, 120), // pos
                    GameFramework.Coords.fromXY(25, buttonHeightBase), // size
                    (isLoadNotSave ? "Load" : "Save"), fontHeight, true, // hasBorder
                    // isEnabled
                    new GameFramework.DataBinding(universe.profile, (c) => (c.saveStateNameSelected != null), null), (isLoadNotSave ? loadSelectedSlotFromLocalStorage : saveToLocalStorageOverwritingSlotSelected), // click
                    null, null),
                    new GameFramework.ControlButton("buttonFile", GameFramework.Coords.fromXY(70, 120), // pos
                    GameFramework.Coords.fromXY(25, buttonHeightBase), // size
                    "File", fontHeight, true, // hasBorder
                    // isEnabled
                    new GameFramework.DataBinding(universe.profile, (c) => (c.saveStateNameSelected != null), null), (isLoadNotSave ? loadFromFile : saveToFilesystem), // click
                    null, null),
                    new GameFramework.ControlButton("buttonDelete", GameFramework.Coords.fromXY(100, 120), // pos
                    GameFramework.Coords.fromXY(20, buttonHeightBase), // size
                    "X", fontHeight, true, // hasBorder
                    // isEnabled
                    new GameFramework.DataBinding(universe.profile, (c) => (c.saveStateNameSelected != null), null), deleteSaveSelected, // click
                    null, null),
                    new GameFramework.ControlVisual("visualSnapshot", GameFramework.Coords.fromXY(130, 35), visualThumbnailSize, new GameFramework.DataBinding(universe.profile, (c) => {
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
                    new GameFramework.ControlLabel("labelPlaceName", GameFramework.Coords.fromXY(130, 80), // pos
                    GameFramework.Coords.fromXY(120, buttonHeightBase), // size
                    false, // isTextCentered
                    new GameFramework.DataBinding(universe.profile, (c) => {
                        var saveState = c.saveStateSelected();
                        return (saveState == null ? "" : saveState.placeName);
                    }, null), fontHeight),
                    new GameFramework.ControlLabel("labelTimePlaying", GameFramework.Coords.fromXY(130, 90), // pos
                    GameFramework.Coords.fromXY(120, buttonHeightBase), // size
                    false, // isTextCentered
                    new GameFramework.DataBinding(universe.profile, (c) => {
                        var saveState = c.saveStateSelected();
                        return (saveState == null ? "" : saveState.timePlayingAsString);
                    }, null), fontHeight),
                    new GameFramework.ControlLabel("labelDateSaved", GameFramework.Coords.fromXY(130, 100), // pos
                    GameFramework.Coords.fromXY(120, buttonHeightBase), // size
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
                    new GameFramework.ControlLabel("labelTimeSaved", GameFramework.Coords.fromXY(130, 110), // pos
                    GameFramework.Coords.fromXY(120, buttonHeightBase), // size
                    false, // isTextCentered
                    new GameFramework.DataBinding(universe.profile, (c) => {
                        var saveState = c.saveStateSelected();
                        return (saveState == null ? "" : saveState.timeSaved.toStringHH_MM_SS());
                    }, null), fontHeight),
                    new GameFramework.ControlButton("buttonBack", GameFramework.Coords.fromXY(sizeBase.x - 10 - 25, sizeBase.y - 10 - 15), // pos
                    GameFramework.Coords.fromXY(25, 15), // size
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
                var returnValue = new GameFramework.ControlContainer("containerProfileNew", GameFramework.Coords.create(), // pos
                sizeBase.clone(), // size
                // children
                [
                    new GameFramework.ControlLabel("labelName", GameFramework.Coords.fromXY(100, 40), // pos
                    GameFramework.Coords.fromXY(100, 20), // size
                    true, // isTextCentered
                    "Profile Name:", fontHeight),
                    new GameFramework.ControlTextBox("textBoxName", GameFramework.Coords.fromXY(50, 50), // pos
                    GameFramework.Coords.fromXY(100, 20), // size
                    new GameFramework.DataBinding(universe.profile, (c) => { return c.name; }, (c, v) => { c.name = v; }), // text
                    fontHeight, null, // charCountMax
                    new GameFramework.DataBinding(true, null, null) // isEnabled
                    ),
                    new GameFramework.ControlButton("buttonCreate", GameFramework.Coords.fromXY(50, 80), // pos
                    GameFramework.Coords.fromXY(45, buttonHeightBase), // size
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
                        var venueNext = Profile.toControlSaveStateLoad(universe, null, universe.venueCurrent).toVenue();
                        venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                        universe.venueNext = venueNext;
                    }, null, null),
                    new GameFramework.ControlButton("buttonCancel", GameFramework.Coords.fromXY(105, 80), // pos
                    GameFramework.Coords.fromXY(45, buttonHeightBase), // size
                    "Cancel", fontHeight, true, // hasBorder
                    true, // isEnabled
                    () => // click
                     {
                        var venueNext = Profile.toControlProfileSelect(universe, null, universe.venueCurrent).toVenue();
                        venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
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
                    var venueNext = Profile.toControlProfileNew(universe, null).toVenue();
                    venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                    universe.venueNext = venueNext;
                };
                var select = () => {
                    var venueControls = universe.venueCurrent;
                    var controlRootAsContainer = venueControls.controlRoot;
                    var listProfiles = controlRootAsContainer.childrenByName.get("listProfiles");
                    var profileSelected = listProfiles.itemSelected(null);
                    universe.profile = profileSelected;
                    if (profileSelected != null) {
                        var venueNext = Profile.toControlSaveStateLoad(universe, null, universe.venueCurrent).toVenue();
                        venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                        universe.venueNext = venueNext;
                    }
                };
                var skip = () => {
                    var messageAsDataBinding = new GameFramework.DataBinding(null, // Will be set below.
                    (c) => "Generating world...", null);
                    var venueMessage = GameFramework.VenueMessage.fromMessage(messageAsDataBinding);
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
                        var venueNext = universe.world.toVenue();
                        venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                        universe.venueNext = venueNext;
                    });
                    messageAsDataBinding.contextSet(venueTask);
                    universe.venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueTask, universe.venueCurrent);
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
                        var venueNext = controlConfirm.toVenue();
                        venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                        universe.venueNext = venueNext;
                    }
                };
                var returnValue = GameFramework.ControlContainer.from4("containerProfileSelect", GameFramework.Coords.create(), // pos
                sizeBase.clone(), // size
                // children
                [
                    new GameFramework.ControlLabel("labelSelectAProfile", GameFramework.Coords.fromXY(100, 40), // pos
                    GameFramework.Coords.fromXY(100, 25), // size
                    true, // isTextCentered
                    "Select a Profile:", fontHeight),
                    new GameFramework.ControlList("listProfiles", GameFramework.Coords.fromXY(30, 50), // pos
                    GameFramework.Coords.fromXY(140, 40), // size
                    GameFramework.DataBinding.fromContext(profiles), // items
                    GameFramework.DataBinding.fromGet((c) => c.name), // bindingForItemText
                    fontHeight, new GameFramework.DataBinding(universe, (c) => { return c.profile; }, (c, v) => { c.profile = v; }), // bindingForOptionSelected
                    GameFramework.DataBinding.fromGet((c) => c), // value
                    null, // bindingForIsEnabled
                    select, // confirm
                    null // widthInItems
                    ),
                    GameFramework.ControlButton.from8("buttonNew", GameFramework.Coords.fromXY(30, 95), // pos
                    GameFramework.Coords.fromXY(35, buttonHeightBase), // size
                    "New", fontHeight, true, // hasBorder
                    true, // isEnabled
                    create // click
                    ),
                    GameFramework.ControlButton.from8("buttonSelect", GameFramework.Coords.fromXY(70, 95), // pos
                    GameFramework.Coords.fromXY(35, buttonHeightBase), // size
                    "Select", fontHeight, true, // hasBorder
                    // isEnabled
                    new GameFramework.DataBinding(universe, (c) => { return (c.profile != null); }, null), select // click
                    ),
                    GameFramework.ControlButton.from8("buttonSkip", GameFramework.Coords.fromXY(110, 95), // pos
                    GameFramework.Coords.fromXY(35, buttonHeightBase), // size
                    "Skip", fontHeight, true, // hasBorder
                    true, // isEnabled
                    skip),
                    GameFramework.ControlButton.from8("buttonDelete", GameFramework.Coords.fromXY(150, 95), // pos
                    GameFramework.Coords.fromXY(20, buttonHeightBase), // size
                    "X", fontHeight, true, // hasBorder
                    true, // isEnabled
                    deleteProfile // click
                    ),
                    GameFramework.ControlButton.from8("buttonBack", GameFramework.Coords.fromXY(sizeBase.x - 10 - 25, sizeBase.y - 10 - 20), // pos
                    GameFramework.Coords.fromXY(25, 20), // size
                    "Back", fontHeight, true, // hasBorder
                    true, // isEnabled
                    () => // click
                     {
                        var venueNext = venuePrev;
                        venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                        universe.venueNext = venueNext;
                    }),
                ]);
                returnValue.scalePosAndSize(scaleMultiplier);
                return returnValue;
            }
        }
        GameFramework.Profile = Profile;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
