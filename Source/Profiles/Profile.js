"use strict";
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
        var visualThumbnailSize = new Coords(60, 45, 0);
        var venueToReturnTo = universe.venueCurrent;
        var loadNewWorld = () => {
            var world = World.create(universe);
            universe.world = world;
            var venueNext = new VenueControls(controlBuilder.worldDetail(universe, size, universe.venueCurrent), false);
            venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
            universe.venueNext = venueNext;
        };
        var loadSelectedSlotFromLocalStorage = () => {
            var saveStateNameSelected = universe.profile.saveStateNameSelected;
            if (saveStateNameSelected != null) {
                var messageAsDataBinding = new DataBinding(null, // Will be set below.
                (c) => "Loading game...", null);
                var venueMessage = new VenueMessage(messageAsDataBinding, null, null, null, null);
                var venueTask = new VenueTask(venueMessage, () => // perform
                 {
                    return universe.storageHelper.load(saveStateNameSelected);
                }, (universe, saveStateSelected) => // done
                 {
                    var worldSelected = saveStateSelected.world;
                    universe.world = worldSelected;
                    var venueNext = new VenueWorld(worldSelected);
                    venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
                    universe.venueNext = venueNext;
                });
                messageAsDataBinding.contextSet(venueTask);
                universe.venueNext = new VenueFader(venueTask, universe.venueCurrent, null, null);
            }
        };
        var saveToLocalStorage = (saveState) => {
            var profile = universe.profile;
            var world = universe.world;
            var now = DateTime.now();
            world.dateSaved = now;
            var nowAsString = now.toStringYYYYMMDD_HHMM_SS();
            var place = world.placeCurrent;
            var placeName = place.name;
            var timePlayingAsString = world.timePlayingAsStringShort(universe);
            var displaySize = universe.display.sizeInPixels;
            var displayFull = new Display2D([displaySize], null, null, null, null, true); // isInvisible
            displayFull.initialize(universe);
            place.draw(universe, world, displayFull);
            var imageSnapshotFull = displayFull.toImage();
            var imageSizeThumbnail = visualThumbnailSize.clone();
            var displayThumbnail = new Display2D([imageSizeThumbnail], null, null, null, null, true);
            displayThumbnail.initialize(universe);
            displayThumbnail.drawImageScaled(imageSnapshotFull, Coords.Instances().Zeroes, imageSizeThumbnail);
            var imageThumbnailFromDisplay = displayThumbnail.toImage();
            var imageThumbnailAsDataUrl = imageThumbnailFromDisplay.systemImage.toDataURL();
            var imageThumbnail = new Image2("Snapshot", imageThumbnailAsDataUrl).unload();
            var saveStateName = "Save-" + nowAsString;
            var saveState = new SaveState(saveStateName, placeName, timePlayingAsString, now, imageThumbnail, world);
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
            var controlMessage = universe.controlBuilder.message(universe, size, new DataBinding(message, null, null), () => // acknowledge
             {
                var venueNext = new VenueControls(universe.controlBuilder.game(universe, null, universe.venueCurrent), false);
                venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
                universe.venueNext = venueNext;
            }, false);
            var venueNext = new VenueControls(controlMessage, false);
            venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
            universe.venueNext = venueNext;
        };
        var saveToLocalStorageAsNewSlot = () => {
            var messageAsDataBinding = new DataBinding(null, // context - Set below.
            (c) => "Saving game...", null);
            var venueMessage = new VenueMessage(messageAsDataBinding, null, null, null, null);
            var venueTask = new VenueTask(venueMessage, saveToLocalStorage, (universe, result) => // done
             {
                saveToLocalStorageDone(result);
            });
            messageAsDataBinding.contextSet(venueTask);
            universe.venueNext = new VenueFader(venueTask, universe.venueCurrent, null, null);
        };
        var saveToFilesystem = () => {
            var venueMessage = VenueMessage.fromText("Saving game...");
            var venueTask = new VenueTask(venueMessage, () => // perform
             {
                var world = universe.world;
                world.dateSaved = DateTime.now();
                var worldSerialized = universe.serializer.serialize(world, null);
                var compressor = universe.storageHelper.compressor;
                var worldCompressedAsBytes = compressor.compressStringToBytes(worldSerialized);
                return worldCompressedAsBytes;
            }, (universe, worldCompressedAsBytes) => // done
             {
                var wasSaveSuccessful = (worldCompressedAsBytes != null);
                var message = (wasSaveSuccessful ? "Save ready: choose location on dialog." : "Save failed due to errors.");
                new FileHelper().saveBytesToFileWithName(worldCompressedAsBytes, universe.world.name + ".json.lzw");
                var controlMessage = universe.controlBuilder.message(universe, size, new DataBinding(message, null, null), () => // acknowledge
                 {
                    var venueNext = new VenueControls(universe.controlBuilder.game(universe, null, universe.venueCurrent), false);
                    venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
                    universe.venueNext = venueNext;
                }, null);
                var venueMessage = new VenueControls(controlMessage, false);
                universe.venueNext = new VenueFader(venueMessage, universe.venueCurrent, null, null);
            });
            universe.venueNext = new VenueFader(venueTask, universe.venueCurrent, null, null);
        };
        var loadFromFile = () => // click
         {
            var venueFileUpload = new VenueFileUpload(null, null);
            var controlMessageReadyToLoad = universe.controlBuilder.message(universe, size, new DataBinding("Ready to load from file...", null, null), () => // acknowledge
             {
                function callback(fileContentsAsString) {
                    var worldAsStringCompressed = fileContentsAsString;
                    var compressor = universe.storageHelper.compressor;
                    var worldSerialized = compressor.decompressString(worldAsStringCompressed);
                    var worldDeserialized = universe.serializer.deserialize(worldSerialized);
                    universe.world = worldDeserialized;
                    var venueNext = new VenueControls(universe.controlBuilder.game(universe, size, universe.venueCurrent), false);
                    venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
                    universe.venueNext = venueNext;
                }
                var inputFile = venueFileUpload.toDomElement().getElementsByTagName("input")[0];
                var fileToLoad = inputFile.files[0];
                new FileHelper().loadFileAsBinaryString(fileToLoad, callback, null // contextForCallback
                );
            }, null);
            var venueMessageReadyToLoad = new VenueControls(controlMessageReadyToLoad, false);
            var controlMessageCancelled = universe.controlBuilder.message(universe, size, new DataBinding("No file specified.", null, null), () => // acknowlege
             {
                var venueNext = new VenueControls(universe.controlBuilder.game(universe, size, universe.venueCurrent), false);
                venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
                universe.venueNext = venueNext;
            }, false //?
            );
            var venueMessageCancelled = new VenueControls(controlMessageCancelled, false);
            venueFileUpload.venueNextIfFileSpecified = venueMessageReadyToLoad;
            venueFileUpload.venueNextIfCancelled = venueMessageCancelled;
            universe.venueNext = venueFileUpload;
        };
        var back = () => {
            var venueNext = venueToReturnTo;
            venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
            universe.venueNext = venueNext;
        };
        var deleteSaveSelectedConfirm = () => {
            var saveStateSelected = universe.profile.saveStateSelected();
            var storageHelper = universe.storageHelper;
            storageHelper.delete(saveStateSelected.name);
            var profile = universe.profile;
            ArrayHelper.remove(profile.saveStates, saveStateSelected);
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
            var venueNext = new VenueControls(controlConfirm, false);
            venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
            universe.venueNext = venueNext;
        };
        var saveToLocalStorageOverwritingSlotSelected = () => {
            deleteSaveSelectedConfirm();
            saveToLocalStorageAsNewSlot();
        };
        var returnValue = new ControlContainer("containerSaveStates", new Coords(0, 0, 0), // pos
        sizeBase.clone(), // size
        // children
        [
            new ControlLabel("labelProfileName", new Coords(100, 10, 0), // pos
            new Coords(120, fontHeight, 0), // size
            true, // isTextCentered
            "Profile: " + universe.profile.name, fontHeight),
            new ControlLabel("labelChooseASave", new Coords(100, 20, 0), // pos
            new Coords(150, 25, 0), // size
            true, // isTextCentered
            "Choose a State to " + (isLoadNotSave ? "Restore" : "Overwrite") + ":", fontHeight),
            new ControlList("listSaveStates", new Coords(10, 35, 0), // pos
            new Coords(110, 75, 0), // size
            new DataBinding(universe.profile, (c) => c.saveStates, null), // items
            DataBinding.fromGet((c) => {
                var timeSaved = c.timeSaved;
                return (timeSaved == null ? "-" : timeSaved.toStringYYYY_MM_DD_HH_MM_SS());
            }), // bindingForOptionText
            fontHeight, new DataBinding(universe.profile, (c) => c.saveStateSelected(), (c, v) => { c.saveStateNameSelected = v.name; }), // bindingForOptionSelected
            DataBinding.fromGet((c) => c), // value
            null, (isLoadNotSave ? loadSelectedSlotFromLocalStorage : saveToLocalStorageOverwritingSlotSelected), // confirm
            null),
            new ControlButton("buttonNew", new Coords(10, 120, 0), // pos
            new Coords(25, buttonHeightBase, 0), // size
            "New", fontHeight, true, // hasBorder
            true, // isEnabled
            (isLoadNotSave ? loadNewWorld : saveToLocalStorageAsNewSlot), // click
            null, null),
            new ControlButton("buttonSelect", new Coords(40, 120, 0), // pos
            new Coords(25, buttonHeightBase, 0), // size
            (isLoadNotSave ? "Load" : "Save"), fontHeight, true, // hasBorder
            // isEnabled
            new DataBinding(universe.profile, (c) => (c.saveStateNameSelected != null), null), (isLoadNotSave ? loadSelectedSlotFromLocalStorage : saveToLocalStorageOverwritingSlotSelected), // click
            null, null),
            new ControlButton("buttonFile", new Coords(70, 120, 0), // pos
            new Coords(25, buttonHeightBase, 0), // size
            "File", fontHeight, true, // hasBorder
            // isEnabled
            new DataBinding(universe.profile, (c) => (c.saveStateNameSelected != null), null), (isLoadNotSave ? loadFromFile : saveToFilesystem), // click
            null, null),
            new ControlButton("buttonDelete", new Coords(100, 120, 0), // pos
            new Coords(20, buttonHeightBase, 0), // size
            "X", fontHeight, true, // hasBorder
            // isEnabled
            new DataBinding(universe.profile, (c) => (c.saveStateNameSelected != null), null), deleteSaveSelected, // click
            null, null),
            new ControlVisual("visualSnapshot", new Coords(130, 35, 0), visualThumbnailSize, new DataBinding(universe.profile, (c) => {
                var saveState = c.saveStateSelected();
                var saveStateImageSnapshot = (saveState == null
                    ? null
                    : saveState.imageSnapshot.load());
                var returnValue = (saveStateImageSnapshot == null || saveStateImageSnapshot.isLoaded == false
                    ? new VisualNone()
                    : new VisualImageImmediate(saveStateImageSnapshot, true) // isScaled
                );
                return returnValue;
            }, null), Color.byName("White"), null // colorBorder
            ),
            new ControlLabel("labelPlaceName", new Coords(130, 80, 0), // pos
            new Coords(120, buttonHeightBase, 0), // size
            false, // isTextCentered
            new DataBinding(universe.profile, (c) => {
                var saveState = c.saveStateSelected();
                return (saveState == null ? "" : saveState.placeName);
            }, null), fontHeight),
            new ControlLabel("labelTimePlaying", new Coords(130, 90, 0), // pos
            new Coords(120, buttonHeightBase, 0), // size
            false, // isTextCentered
            new DataBinding(universe.profile, (c) => {
                var saveState = c.saveStateSelected();
                return (saveState == null ? "" : saveState.timePlayingAsString);
            }, null), fontHeight),
            new ControlLabel("labelDateSaved", new Coords(130, 100, 0), // pos
            new Coords(120, buttonHeightBase, 0), // size
            false, // isTextCentered
            new DataBinding(universe.profile, (c) => {
                var saveState = c.saveStateSelected();
                var returnValue = (saveState == null
                    ? ""
                    :
                        (saveState.timeSaved == null
                            ? ""
                            : saveState.timeSaved.toStringYYYY_MM_DD()));
                return returnValue;
            }, null), fontHeight),
            new ControlLabel("labelTimeSaved", new Coords(130, 110, 0), // pos
            new Coords(120, buttonHeightBase, 0), // size
            false, // isTextCentered
            new DataBinding(universe.profile, (c) => {
                var saveState = c.saveStateSelected();
                return (saveState == null ? "" : saveState.timeSaved.toStringHH_MM_SS());
            }, null), fontHeight),
            new ControlButton("buttonBack", new Coords(sizeBase.x - 10 - 25, sizeBase.y - 10 - 15, 0), // pos
            new Coords(25, 15, 0), // size
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
        var returnValue = new ControlContainer("containerProfileNew", new Coords(0, 0, 0), // pos
        sizeBase.clone(), // size
        // children
        [
            new ControlLabel("labelName", new Coords(100, 40, 0), // pos
            new Coords(100, 20, 0), // size
            true, // isTextCentered
            "Profile Name:", fontHeight),
            new ControlTextBox("textBoxName", new Coords(50, 50, 0), // pos
            new Coords(100, 20, 0), // size
            new DataBinding(universe.profile, (c) => { return c.name; }, (c, v) => { c.name = v; }), // text
            fontHeight, null, // charCountMax
            new DataBinding(true, null, null) // isEnabled
            ),
            new ControlButton("buttonCreate", new Coords(50, 80, 0), // pos
            new Coords(45, buttonHeightBase, 0), // size
            "Create", fontHeight, true, // hasBorder
            // isEnabled
            new DataBinding(universe.profile, (c) => { return c.name.length > 0; }, null), () => // click
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
                var venueNext = new VenueControls(Profile.toControlSaveStateLoad(universe, null, universe.venueCurrent), false);
                venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
                universe.venueNext = venueNext;
            }, null, null),
            new ControlButton("buttonCancel", new Coords(105, 80, 0), // pos
            new Coords(45, buttonHeightBase, 0), // size
            "Cancel", fontHeight, true, // hasBorder
            true, // isEnabled
            () => // click
             {
                var venueNext = new VenueControls(Profile.toControlProfileSelect(universe, null, universe.venueCurrent), false);
                venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
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
            var venueNext = new VenueControls(Profile.toControlProfileNew(universe, null), false);
            venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
            universe.venueNext = venueNext;
        };
        var select = () => {
            var venueControls = universe.venueCurrent;
            var controlRootAsContainer = venueControls.controlRoot;
            var listProfiles = controlRootAsContainer.childrenByName.get("listProfiles");
            var profileSelected = listProfiles.itemSelected(null);
            universe.profile = profileSelected;
            if (profileSelected != null) {
                var venueNext = new VenueControls(Profile.toControlSaveStateLoad(universe, null, universe.venueCurrent), false);
                venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
                universe.venueNext = venueNext;
            }
        };
        var skip = () => {
            var messageAsDataBinding = new DataBinding(null, // Will be set below.
            (c) => "Generating world...", null);
            var venueMessage = new VenueMessage(messageAsDataBinding, null, null, null, null);
            var venueTask = new VenueTask(venueMessage, () => //perform
             {
                return World.create(universe);
            }, (universe, world) => // done
             {
                universe.world = world;
                var now = DateTime.now();
                var nowAsString = now.toStringMMDD_HHMM_SS();
                var profileName = "Anon-" + nowAsString;
                var profile = new Profile(profileName, []);
                universe.profile = profile;
                var venueNext = new VenueWorld(universe.world);
                venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
                universe.venueNext = venueNext;
            });
            messageAsDataBinding.contextSet(venueTask);
            universe.venueNext = new VenueFader(venueTask, universe.venueCurrent, null, null);
        };
        var deleteProfileConfirm = () => {
            var profileSelected = universe.profile;
            var storageHelper = universe.storageHelper;
            storageHelper.delete(profileSelected.name);
            var profileNames = storageHelper.load("ProfileNames");
            ArrayHelper.remove(profileNames, profileSelected.name);
            storageHelper.save("ProfileNames", profileNames);
        };
        var deleteProfile = () => {
            var profileSelected = universe.profile;
            if (profileSelected != null) {
                var controlConfirm = universe.controlBuilder.confirmAndReturnToVenue(universe, size, "Delete profile \""
                    + profileSelected.name
                    + "\"?", universe.venueCurrent, deleteProfileConfirm, null // cancel
                );
                var venueNext = new VenueControls(controlConfirm, false);
                venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
                universe.venueNext = venueNext;
            }
        };
        var returnValue = new ControlContainer("containerProfileSelect", new Coords(0, 0, 0), // pos
        sizeBase.clone(), // size
        // children
        [
            new ControlLabel("labelSelectAProfile", new Coords(100, 40, 0), // pos
            new Coords(100, 25, 0), // size
            true, // isTextCentered
            "Select a Profile:", fontHeight),
            new ControlList("listProfiles", new Coords(30, 50, 0), // pos
            new Coords(140, 40, 0), // size
            DataBinding.fromContext(profiles), // items
            DataBinding.fromGet((c) => c.name), // bindingForItemText
            fontHeight, new DataBinding(universe, (c) => { return c.profile; }, (c, v) => { c.profile = v; }), // bindingForOptionSelected
            DataBinding.fromGet((c) => c), // value
            null, // bindingForIsEnabled
            select, // confirm
            null // widthInItems
            ),
            new ControlButton("buttonNew", new Coords(30, 95, 0), // pos
            new Coords(35, buttonHeightBase, 0), // size
            "New", fontHeight, true, // hasBorder
            true, // isEnabled
            create, // click
            null, null),
            new ControlButton("buttonSelect", new Coords(70, 95, 0), // pos
            new Coords(35, buttonHeightBase, 0), // size
            "Select", fontHeight, true, // hasBorder
            // isEnabled
            new DataBinding(universe, (c) => { return (c.profile != null); }, null), select, // click
            null, null),
            new ControlButton("buttonSkip", new Coords(110, 95, 0), // pos
            new Coords(35, buttonHeightBase, 0), // size
            "Skip", fontHeight, true, // hasBorder
            true, // isEnabled
            skip, // click
            null, null),
            new ControlButton("buttonDelete", new Coords(150, 95, 0), // pos
            new Coords(20, buttonHeightBase, 0), // size
            "X", fontHeight, true, // hasBorder
            true, // isEnabled
            deleteProfile, // click
            null, null),
            new ControlButton("buttonBack", new Coords(sizeBase.x - 10 - 25, sizeBase.y - 10 - 20, 0), // pos
            new Coords(25, 20, 0), // size
            "Back", fontHeight, true, // hasBorder
            true, // isEnabled
            () => // click
             {
                var venueNext = venuePrev;
                venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
                universe.venueNext = venueNext;
            }, null, null),
        ], null, null);
        returnValue.scalePosAndSize(scaleMultiplier);
        return returnValue;
    }
}
