"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ControlBuilder {
            constructor(styles) {
                this.styles = styles;
                this.stylesByName = GameFramework.ArrayHelper.addLookupsByName(styles);
                this.fontHeightInPixelsBase = 10;
                this.buttonHeightBase = this.fontHeightInPixelsBase * 2;
                this.buttonHeightSmallBase = this.fontHeightInPixelsBase * 1.5;
                this.sizeBase = new GameFramework.Coords(200, 150, 1);
                // Helper variables.
                this._zeroes = GameFramework.Coords.blank();
                this._scaleMultiplier = GameFramework.Coords.blank();
            }
            choice(universe, size, message, optionNames, optionFunctions, showMessageOnly) {
                size = size || universe.display.sizeDefault();
                showMessageOnly = showMessageOnly || false;
                var scaleMultiplier = this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);
                var fontHeight = this.fontHeightInPixelsBase;
                var numberOfLinesInMessageMinusOne = message.get().split("\n").length - 1;
                var labelSize = new GameFramework.Coords(200, fontHeight * numberOfLinesInMessageMinusOne, 0);
                var numberOfOptions = optionNames.length;
                if (showMessageOnly && numberOfOptions == 1) {
                    numberOfOptions = 0; // Is a single option really an option?
                }
                var labelPosYBase = (numberOfOptions > 0 ? 65 : 75); // hack
                var labelPos = new GameFramework.Coords(100, labelPosYBase - fontHeight * (numberOfLinesInMessageMinusOne / 4), 0);
                var labelMessage = new GameFramework.ControlLabel("labelMessage", labelPos, labelSize, true, // isTextCentered
                message, fontHeight);
                var childControls = [labelMessage];
                if (showMessageOnly == false) {
                    var buttonWidth = 55;
                    var buttonSize = new GameFramework.Coords(buttonWidth, fontHeight * 2, 0);
                    var spaceBetweenButtons = 5;
                    var buttonMarginLeftRight = (this.sizeBase.x
                        - (buttonWidth * numberOfOptions)
                        - (spaceBetweenButtons * (numberOfOptions - 1))) / 2;
                    for (var i = 0; i < numberOfOptions; i++) {
                        var button = new GameFramework.ControlButton("buttonOption" + i, new GameFramework.Coords(buttonMarginLeftRight + i * (buttonWidth + spaceBetweenButtons), 100, 0), // pos
                        buttonSize.clone(), optionNames[i], fontHeight, true, // hasBorder
                        true, // isEnabled
                        optionFunctions[i], null, null);
                        childControls.push(button);
                    }
                }
                var containerSizeScaled = size.clone().clearZ().divide(scaleMultiplier);
                var display = universe.display;
                var displaySize = display.sizeDefault().clone().clearZ().divide(scaleMultiplier);
                var containerPosScaled = displaySize.clone().subtract(containerSizeScaled).half();
                var actions = null;
                if (numberOfOptions <= 1) {
                    var acknowledge = optionFunctions[0];
                    var controlActionNames = GameFramework.ControlActionNames.Instances();
                    actions =
                        [
                            new GameFramework.Action(controlActionNames.ControlCancel, acknowledge),
                            new GameFramework.Action(controlActionNames.ControlConfirm, acknowledge),
                        ];
                }
                var returnValue = new GameFramework.ControlContainer("containerChoice", containerPosScaled, containerSizeScaled, childControls, actions, null //?
                );
                returnValue.scalePosAndSize(scaleMultiplier);
                if (showMessageOnly) {
                    returnValue = new GameFramework.ControlContainerTransparent(returnValue);
                }
                return returnValue;
            }
            ;
            choiceList(universe, size, message, options, bindingForOptionText, buttonSelectText, select) {
                // todo - Variable sizes.
                var marginWidth = 10;
                var marginSize = new GameFramework.Coords(1, 1, 0).multiplyScalar(marginWidth);
                var fontHeight = 20;
                var labelSize = new GameFramework.Coords(size.x - marginSize.x * 2, fontHeight, 0);
                var buttonSize = new GameFramework.Coords(labelSize.x, fontHeight * 2, 0);
                var listSize = new GameFramework.Coords(labelSize.x, size.y - labelSize.y - buttonSize.y - marginSize.y * 4, 0);
                var listOptions = new GameFramework.ControlList("listOptions", new GameFramework.Coords(marginSize.x, labelSize.y + marginSize.y * 2, 0), listSize, options, bindingForOptionText, fontHeight, null, // bindingForItemSelected
                null, // bindingForItemValue
                null, null, null);
                var returnValue = new GameFramework.ControlContainer("containerChoice", GameFramework.Coords.blank(), size, [
                    new GameFramework.ControlLabel("labelMessage", new GameFramework.Coords(size.x / 2, marginSize.y + fontHeight / 2, 0), labelSize, true, // isTextCentered
                    message, fontHeight),
                    listOptions,
                    new GameFramework.ControlButton("buttonSelect", new GameFramework.Coords(marginSize.x, size.y - marginSize.y - buttonSize.y, 0), buttonSize, buttonSelectText, fontHeight, true, // hasBorder
                    true, // isEnabled,
                    () => // click
                     {
                        var itemSelected = listOptions.itemSelected(null);
                        if (itemSelected != null) {
                            select(universe, itemSelected);
                        }
                    }, universe, // context
                    false // canBeHeldDown
                    ),
                ], null, null);
                return returnValue;
            }
            confirm(universe, size, message, confirm, cancel) {
                return this.choice(universe, size, new GameFramework.DataBinding(message, null, null), ["Confirm", "Cancel"], [confirm, cancel], null);
            }
            confirmAndReturnToVenue(universe, size, message, venuePrev, confirm, cancel) {
                var confirmThenReturnToVenuePrev = () => {
                    confirm();
                    var venueNext = new GameFramework.VenueFader(venuePrev, universe.venueCurrent, null, null);
                    universe.venueNext = venueNext;
                };
                var cancelThenReturnToVenuePrev = () => {
                    if (cancel != null) {
                        cancel();
                    }
                    var venueNext = new GameFramework.VenueFader(venuePrev, universe.venueCurrent, null, null);
                    universe.venueNext = venueNext;
                };
                return this.choice(universe, size, new GameFramework.DataBinding(message, null, null), ["Confirm", "Cancel"], [confirmThenReturnToVenuePrev, cancelThenReturnToVenuePrev], null);
            }
            ;
            game(universe, size, venuePrev) {
                if (size == null) {
                    size = universe.display.sizeDefault().clone();
                }
                var scaleMultiplier = this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);
                var fontHeight = this.fontHeightInPixelsBase;
                var buttonHeight = this.buttonHeightBase;
                var padding = 5;
                var rowHeight = buttonHeight + padding;
                var rowCount = 5;
                var buttonsAllHeight = rowCount * buttonHeight + (rowCount - 1) * padding;
                var margin = (this.sizeBase.y - buttonsAllHeight) / 2;
                var buttonSize = new GameFramework.Coords(60, buttonHeight, 0);
                var posX = (this.sizeBase.x - buttonSize.x) / 2;
                var row0PosY = margin;
                var row1PosY = row0PosY + rowHeight;
                var row2PosY = row1PosY + rowHeight;
                var row3PosY = row2PosY + rowHeight;
                var row4PosY = row3PosY + rowHeight;
                var back = () => {
                    var venueNext = venuePrev;
                    venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                    universe.venueNext = venueNext;
                };
                var returnValue = new GameFramework.ControlContainer("containerStorage", this._zeroes, // pos
                this.sizeBase.clone(), 
                // children
                [
                    new GameFramework.ControlButton("buttonSave", new GameFramework.Coords(posX, row0PosY, 0), // pos
                    buttonSize.clone(), "Save", fontHeight, true, // hasBorder
                    true, // isEnabled
                    () => // click
                     {
                        var venueNext = new GameFramework.VenueControls(GameFramework.Profile.toControlSaveStateSave(universe, size, universe.venueCurrent), false);
                        venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                        universe.venueNext = venueNext;
                    }, null, null),
                    new GameFramework.ControlButton("buttonLoad", new GameFramework.Coords(posX, row1PosY, 0), // pos
                    buttonSize.clone(), "Load", fontHeight, true, // hasBorder
                    true, // isEnabled
                    () => // click
                     {
                        var venueNext = new GameFramework.VenueControls(GameFramework.Profile.toControlSaveStateLoad(universe, null, universe.venueCurrent), false);
                        venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                        universe.venueNext = venueNext;
                    }, null, null),
                    new GameFramework.ControlButton("buttonAbout", new GameFramework.Coords(posX, row2PosY, 0), // pos
                    buttonSize.clone(), "About", fontHeight, true, // hasBorder
                    true, // isEnabled
                    () => // click
                     {
                        var venueCurrent = universe.venueCurrent;
                        var venueNext = new GameFramework.VenueMessage(new GameFramework.DataBinding(universe.name + "\nv" + universe.version, null, null), () => // acknowledge
                         {
                            universe.venueNext = new GameFramework.VenueFader(venueCurrent, null, null, null);
                        }, universe.venueCurrent, // venuePrev
                        size, false);
                        venueNext = new GameFramework.VenueFader(venueNext, venueCurrent, null, null);
                        universe.venueNext = venueNext;
                    }, null, null),
                    new GameFramework.ControlButton("buttonQuit", new GameFramework.Coords(posX, row3PosY, 0), // pos
                    buttonSize.clone(), "Quit", fontHeight, true, // hasBorder
                    true, // isEnabled
                    () => // click
                     {
                        var controlConfirm = universe.controlBuilder.confirm(universe, size, "Are you sure you want to quit?", () => // confirm
                         {
                            universe.reset();
                            var venueNext = new GameFramework.VenueControls(universe.controlBuilder.title(universe, null), false);
                            venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                            universe.venueNext = venueNext;
                        }, () => // cancel
                         {
                            var venueNext = venuePrev;
                            venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                            universe.venueNext = venueNext;
                        });
                        var venueNext = new GameFramework.VenueControls(controlConfirm, false);
                        venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                        universe.venueNext = venueNext;
                    }, null, null),
                    new GameFramework.ControlButton("buttonBack", new GameFramework.Coords(posX, row4PosY, 0), // pos
                    buttonSize.clone(), "Back", fontHeight, true, // hasBorder
                    true, // isEnabled
                    back, // click
                    null, null),
                ], [new GameFramework.Action("Back", back)], [new GameFramework.ActionToInputsMapping("Back", ["Escape"], true)]);
                returnValue.scalePosAndSize(scaleMultiplier);
                return returnValue;
            }
            ;
            gameAndSettings(universe, size, venuePrev, includeResumeButton) {
                if (size == null) {
                    size = universe.display.sizeDefault().clone();
                }
                var scaleMultiplier = this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);
                var fontHeight = this.fontHeightInPixelsBase;
                var buttonWidth = 40;
                var buttonHeight = this.buttonHeightBase;
                var padding = 5;
                var rowCount = (includeResumeButton ? 3 : 2);
                var rowHeight = buttonHeight + padding;
                var buttonsAllHeight = rowCount * buttonHeight + (rowCount - 1) * padding;
                var margin = new GameFramework.Coords((this.sizeBase.x - buttonWidth) / 2, (this.sizeBase.y - buttonsAllHeight) / 2, 0);
                var row0PosY = margin.y;
                var row1PosY = row0PosY + rowHeight;
                var row2PosY = row1PosY + rowHeight;
                var returnValue = new GameFramework.ControlContainer("Game", this._zeroes.clone(), // pos
                this.sizeBase.clone(), 
                // children
                [
                    new GameFramework.ControlButton("buttonGame", new GameFramework.Coords(margin.x, row0PosY, 0), // pos
                    new GameFramework.Coords(buttonWidth, buttonHeight, 0), // size
                    "Game", fontHeight, true, // hasBorder
                    true, // isEnabled
                    () => // click
                     {
                        var venueNext = new GameFramework.VenueControls(universe.controlBuilder.game(universe, null, universe.venueCurrent), false);
                        venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                        universe.venueNext = venueNext;
                    }, null, null),
                    new GameFramework.ControlButton("buttonSettings", new GameFramework.Coords(margin.x, row1PosY, 0), // pos
                    new GameFramework.Coords(buttonWidth, buttonHeight, 0), // size
                    "Settings", fontHeight, true, // hasBorder
                    true, // isEnabled
                    () => // click
                     {
                        var venueNext = new GameFramework.VenueControls(universe.controlBuilder.settings(universe, null, universe.venueCurrent), false);
                        venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                        universe.venueNext = venueNext;
                    }, null, null),
                ], [], // actions
                [] // mappings
                );
                if (includeResumeButton) {
                    var back = () => {
                        var venueNext = venuePrev;
                        venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                        universe.venueNext = venueNext;
                    };
                    var buttonResume = new GameFramework.ControlButton("buttonResume", new GameFramework.Coords(margin.x, row2PosY, 0), // pos
                    new GameFramework.Coords(buttonWidth, buttonHeight, 0), // size
                    "Resume", fontHeight, true, // hasBorder
                    true, // isEnabled
                    back, null, null);
                    returnValue.children.push(buttonResume);
                    returnValue.actions.push(new GameFramework.Action("Back", back));
                    returnValue._actionToInputsMappings.push(new GameFramework.ActionToInputsMapping("Back", ["Escape"], true));
                }
                returnValue.scalePosAndSize(scaleMultiplier);
                return returnValue;
            }
            inputs(universe, size, venuePrev) {
                if (size == null) {
                    size = universe.display.sizeDefault();
                }
                var scaleMultiplier = this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);
                var fontHeight = this.fontHeightInPixelsBase;
                var world = universe.world;
                var placeCurrentDefnName = "Demo"; // hack
                var placeDefn = world.defn.placeDefnsByName().get(placeCurrentDefnName);
                placeDefn.actionToInputsMappingsEdit();
                var returnValue = new GameFramework.ControlContainer("containerGameControls", this._zeroes, // pos
                this.sizeBase.clone(), // size
                // children
                [
                    new GameFramework.ControlLabel("labelActions", new GameFramework.Coords(100, 15, 0), // pos
                    new GameFramework.Coords(100, 20, 0), // size
                    true, // isTextCentered
                    "Actions:", fontHeight),
                    new GameFramework.ControlList("listActions", new GameFramework.Coords(50, 25, 0), // pos
                    new GameFramework.Coords(100, 40, 0), // size
                    new GameFramework.DataBinding(placeDefn.actionToInputsMappingsEdited, null, null), // items
                    new GameFramework.DataBinding(null, (c) => { return c.actionName; }, null), // bindingForItemText
                    fontHeight, new GameFramework.DataBinding(placeDefn, (c) => c.actionToInputsMappingSelected, (c, v) => { c.actionToInputsMappingSelected = v; }), // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                    null, null, null),
                    new GameFramework.ControlLabel("labelInput", new GameFramework.Coords(100, 70, 0), // pos
                    new GameFramework.Coords(100, 15, 0), // size
                    true, // isTextCentered
                    "Inputs:", fontHeight),
                    new GameFramework.ControlLabel("infoInput", new GameFramework.Coords(100, 80, 0), // pos
                    new GameFramework.Coords(200, 15, 0), // size
                    true, // isTextCentered
                    new GameFramework.DataBinding(placeDefn, (c) => {
                        var i = c.actionToInputsMappingSelected;
                        return (i == null ? "-" : i.inputNames.join(", "));
                    }, null), // text
                    fontHeight),
                    new GameFramework.ControlButton("buttonClear", new GameFramework.Coords(25, 90, 0), // pos
                    new GameFramework.Coords(45, 15, 0), // size
                    "Clear", fontHeight, true, // hasBorder
                    new GameFramework.DataBinding(placeDefn, (c) => { return c.actionToInputsMappingSelected != null; }, null), // isEnabled
                    () => // click
                     {
                        var mappingSelected = placeDefn.actionToInputsMappingSelected;
                        if (mappingSelected != null) {
                            mappingSelected.inputNames.length = 0;
                        }
                    }, null, null),
                    new GameFramework.ControlButton("buttonAdd", new GameFramework.Coords(80, 90, 0), // pos
                    new GameFramework.Coords(45, 15, 0), // size
                    "Add", fontHeight, true, // hasBorder
                    new GameFramework.DataBinding(placeDefn, (c) => { return c.actionToInputsMappingSelected != null; }, null), // isEnabled
                    () => // click
                     {
                        var mappingSelected = placeDefn.actionToInputsMappingSelected;
                        if (mappingSelected != null) {
                            var venueInputCapture = new GameFramework.VenueInputCapture(universe.venueCurrent, (inputCaptured) => {
                                var inputName = inputCaptured.name;
                                mappingSelected.inputNames.push(inputName);
                            });
                            universe.venueNext = venueInputCapture;
                        }
                    }, null, null),
                    new GameFramework.ControlButton("buttonRestoreDefault", new GameFramework.Coords(135, 90, 0), // pos
                    new GameFramework.Coords(45, 15, 0), // size
                    "Default", fontHeight, true, // hasBorder
                    new GameFramework.DataBinding(placeDefn, (c) => { return c.actionToInputsMappingSelected != null; }, null), // isEnabled
                    () => // click
                     {
                        var mappingSelected = placeDefn.actionToInputsMappingSelected;
                        if (mappingSelected != null) {
                            var mappingDefault = placeDefn.actionToInputsMappingsDefault.filter((x) => { return x.actionName == mappingSelected.actionName; })[0];
                            mappingSelected.inputNames = mappingDefault.inputNames.slice();
                        }
                    }, null, null),
                    new GameFramework.ControlButton("buttonRestoreDefaultsAll", new GameFramework.Coords(50, 110, 0), // pos
                    new GameFramework.Coords(100, 15, 0), // size
                    "Default All", fontHeight, true, // hasBorder
                    true, // isEnabled
                    () => {
                        var venueInputs = universe.venueCurrent;
                        var controlConfirm = universe.controlBuilder.confirmAndReturnToVenue(universe, size, "Are you sure you want to restore defaults?", venueInputs, () => // confirm
                         {
                            placeDefn.actionToInputsMappingsRestoreDefaults();
                        }, null // cancel
                        );
                        var venueNext = new GameFramework.VenueControls(controlConfirm, false);
                        venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                        universe.venueNext = venueNext;
                    }, null, null),
                    new GameFramework.ControlButton("buttonCancel", new GameFramework.Coords(50, 130, 0), // pos
                    new GameFramework.Coords(45, 15, 0), // size
                    "Cancel", fontHeight, true, // hasBorder
                    true, // isEnabled
                    () => // click
                     {
                        var venueNext = venuePrev;
                        venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                        universe.venueNext = venueNext;
                    }, null, null),
                    new GameFramework.ControlButton("buttonSave", new GameFramework.Coords(105, 130, 0), // pos
                    new GameFramework.Coords(45, 15, 0), // size
                    "Save", fontHeight, true, // hasBorder
                    // isEnabled
                    new GameFramework.DataBinding(placeDefn, (c) => {
                        var mappings = c.actionToInputsMappingsEdited;
                        var doAnyActionsLackInputs = mappings.some(function (x) { return x.inputNames.length == 0; });
                        return (doAnyActionsLackInputs == false);
                    }, null), () => // click
                     {
                        placeDefn.actionToInputsMappingsSave();
                        var venueNext = venuePrev;
                        venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                        universe.venueNext = venueNext;
                    }, null, null)
                ], null, null);
                returnValue.scalePosAndSize(scaleMultiplier);
                return returnValue;
            }
            ;
            message(universe, size, message, acknowledge, showMessageOnly) {
                var optionNames = [];
                var optionFunctions = [];
                if (acknowledge != null) {
                    optionNames.push("Acknowledge");
                    optionFunctions.push(acknowledge);
                }
                return this.choice(universe, size, message, optionNames, optionFunctions, showMessageOnly);
            }
            opening(universe, size) {
                if (size == null) {
                    size = universe.display.sizeDefault();
                }
                var scaleMultiplier = this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);
                var fontHeight = this.fontHeightInPixelsBase;
                var start = () => {
                    var title = this.title(universe, size);
                    var venueTitle = new GameFramework.VenueControls(title, false);
                    universe.venueNext =
                        new GameFramework.VenueFader(venueTitle, universe.venueCurrent, null, null);
                };
                var visual = new GameFramework.VisualGroup([
                    new GameFramework.VisualImageScaled(new GameFramework.VisualImageFromLibrary("Opening"), size)
                ]);
                var returnValue = new GameFramework.ControlContainer("containerOpening", this._zeroes, // pos
                this.sizeBase.clone(), // size
                // children
                [
                    new GameFramework.ControlVisual("imageOpening", this._zeroes.clone(), this.sizeBase.clone(), // size
                    new GameFramework.DataBinding(visual, null, null), null, null // colors
                    ),
                    new GameFramework.ControlButton("buttonStart", new GameFramework.Coords(75, 120, 0), // pos
                    new GameFramework.Coords(50, fontHeight * 2, 0), // size
                    "Start", fontHeight * 2, false, // hasBorder
                    true, // isEnabled
                    start, // click
                    null, null)
                ], // end children
                [
                    new GameFramework.Action(GameFramework.ControlActionNames.Instances().ControlCancel, start),
                    new GameFramework.Action(GameFramework.ControlActionNames.Instances().ControlConfirm, start)
                ], null);
                returnValue.scalePosAndSize(scaleMultiplier);
                return returnValue;
            }
            settings(universe, size, venuePrev) {
                if (size == null) {
                    size = universe.display.sizeDefault();
                }
                var scaleMultiplier = this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);
                var fontHeight = this.fontHeightInPixelsBase;
                var buttonHeight = this.buttonHeightBase;
                var margin = 15;
                var padding = 5;
                var labelPadding = 3;
                var rowHeight = buttonHeight + padding;
                var row0PosY = margin;
                var row1PosY = row0PosY + rowHeight / 2;
                var row2PosY = row1PosY + rowHeight;
                var row3PosY = row2PosY + rowHeight;
                var row4PosY = row3PosY + rowHeight;
                var back = function () {
                    var venueNext = venuePrev;
                    venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                    universe.venueNext = venueNext;
                };
                var returnValue = new GameFramework.ControlContainer("containerSettings", this._zeroes, // pos
                this.sizeBase.clone(), 
                // children
                [
                    new GameFramework.ControlLabel("labelMusicVolume", new GameFramework.Coords(30, row1PosY + labelPadding, 0), // pos
                    new GameFramework.Coords(75, buttonHeight, 0), // size
                    false, // isTextCentered
                    "Music:", fontHeight),
                    new GameFramework.ControlSelect("selectMusicVolume", new GameFramework.Coords(70, row1PosY, 0), // pos
                    new GameFramework.Coords(30, buttonHeight, 0), // size
                    new GameFramework.DataBinding(universe.soundHelper, (c) => { return c.musicVolume; }, (c, v) => { c.musicVolume = v; }), // valueSelected
                    GameFramework.SoundHelper.controlSelectOptionsVolume(), // options
                    new GameFramework.DataBinding(null, (c) => c.value, null), // bindingForOptionValues,
                    new GameFramework.DataBinding(null, (c) => { return c.text; }, null), // bindingForOptionText
                    fontHeight),
                    new GameFramework.ControlLabel("labelSoundVolume", new GameFramework.Coords(105, row1PosY + labelPadding, 0), // pos
                    new GameFramework.Coords(75, buttonHeight, 0), // size
                    false, // isTextCentered
                    "Sound:", fontHeight),
                    new GameFramework.ControlSelect("selectSoundVolume", new GameFramework.Coords(140, row1PosY, 0), // pos
                    new GameFramework.Coords(30, buttonHeight, 0), // size
                    new GameFramework.DataBinding(universe.soundHelper, (c) => c.soundVolume, (c, v) => { c.soundVolume = v; }), // valueSelected
                    GameFramework.SoundHelper.controlSelectOptionsVolume(), // options
                    GameFramework.DataBinding.fromGet((c) => c.value), // bindingForOptionValues,
                    GameFramework.DataBinding.fromGet((c) => c.text), // bindingForOptionText
                    fontHeight),
                    new GameFramework.ControlLabel("labelDisplaySize", new GameFramework.Coords(30, row2PosY + labelPadding, 0), // pos
                    new GameFramework.Coords(75, buttonHeight, 0), // size
                    false, // isTextCentered
                    "Display:", fontHeight),
                    new GameFramework.ControlSelect("selectDisplaySize", new GameFramework.Coords(70, row2PosY, 0), // pos
                    new GameFramework.Coords(65, buttonHeight, 0), // size
                    universe.display.sizeInPixels, // valueSelected
                    // options
                    universe.display.sizesAvailable, GameFramework.DataBinding.fromGet((c) => c), // bindingForOptionValues,
                    GameFramework.DataBinding.fromGet((c) => c.toStringXY()), // bindingForOptionText
                    fontHeight),
                    new GameFramework.ControlButton("buttonDisplaySizeChange", new GameFramework.Coords(140, row2PosY, 0), // pos
                    new GameFramework.Coords(30, buttonHeight, 0), // size
                    "Change", fontHeight, true, // hasBorder
                    true, // isEnabled
                    () => // click
                     {
                        var venueControls = universe.venueCurrent;
                        var controlRootAsContainer = venueControls.controlRoot;
                        var selectDisplaySize = controlRootAsContainer.childrenByName.get("selectDisplaySize");
                        var displaySizeSpecified = selectDisplaySize.optionSelected();
                        var display = universe.display;
                        var platformHelper = universe.platformHelper;
                        platformHelper.platformableRemove(display);
                        display.sizeInPixels = displaySizeSpecified;
                        display.canvas = null; // hack
                        display.initialize(universe);
                        platformHelper.initialize(universe);
                        var venueNext = new GameFramework.VenueControls(universe.controlBuilder.settings(universe, null, universe.venueCurrent), false);
                        venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                        universe.venueNext = venueNext;
                    }, null, null),
                    new GameFramework.ControlButton("buttonInputs", new GameFramework.Coords(70, row3PosY, 0), // pos
                    new GameFramework.Coords(65, buttonHeight, 0), // size
                    "Inputs", fontHeight, true, // hasBorder
                    true, // isEnabled
                    () => // click
                     {
                        var venueCurrent = universe.venueCurrent;
                        var controlGameControls = universe.controlBuilder.inputs(universe, size, venueCurrent);
                        var venueNext = new GameFramework.VenueControls(controlGameControls, false);
                        venueNext = new GameFramework.VenueFader(venueNext, venueCurrent, null, null);
                        universe.venueNext = venueNext;
                    }, null, null),
                    new GameFramework.ControlButton("buttonDone", new GameFramework.Coords(70, row4PosY, 0), // pos
                    new GameFramework.Coords(65, buttonHeight, 0), // size
                    "Done", fontHeight, true, // hasBorder
                    true, // isEnabled
                    back, // click
                    null, null),
                ], [new GameFramework.Action("Back", back)], [new GameFramework.ActionToInputsMapping("Back", ["Escape"], true)]);
                returnValue.scalePosAndSize(scaleMultiplier);
                return returnValue;
            }
            ;
            slideshow(universe, size, imageNamesAndMessagesForSlides, venueAfterSlideshow) {
                if (size == null) {
                    size = universe.display.sizeDefault();
                }
                var scaleMultiplier = this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);
                var controlsForSlides = [];
                for (var i = 0; i < imageNamesAndMessagesForSlides.length; i++) {
                    var imageNameAndMessage = imageNamesAndMessagesForSlides[i];
                    var imageName = imageNameAndMessage[0];
                    var message = imageNameAndMessage[1];
                    var containerSlide = new GameFramework.ControlContainer("containerSlide_" + i, this._zeroes, // pos
                    this.sizeBase.clone(), // size
                    // children
                    [
                        new GameFramework.ControlVisual("imageSlide", this._zeroes, this.sizeBase.clone(), // size
                        new GameFramework.DataBinding(new GameFramework.VisualImageFromLibrary(imageName), null, null), null, null),
                        new GameFramework.ControlLabel("labelSlideText", new GameFramework.Coords(100, this.fontHeightInPixelsBase * 2, 0), // pos
                        this.sizeBase.clone(), // size
                        true, // isTextCentered,
                        message, this.fontHeightInPixelsBase * 2),
                        new GameFramework.ControlButton("buttonNext", new GameFramework.Coords(75, 120, 0), // pos
                        new GameFramework.Coords(50, 40, 0), // size
                        "Next", this.fontHeightInPixelsBase, false, // hasBorder
                        true, // isEnabled
                        function (slideIndexNext) {
                            var venueNext;
                            if (slideIndexNext < controlsForSlides.length) {
                                var controlForSlideNext = controlsForSlides[slideIndexNext];
                                venueNext = new GameFramework.VenueControls(controlForSlideNext, false);
                            }
                            else {
                                venueNext = venueAfterSlideshow;
                            }
                            venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                            universe.venueNext = venueNext;
                        }.bind(this, i + 1), null, null)
                    ], null, null);
                    containerSlide.scalePosAndSize(scaleMultiplier);
                    controlsForSlides.push(containerSlide);
                }
                return controlsForSlides[0];
            }
            title(universe, size) {
                if (size == null) {
                    size = universe.display.sizeDefault();
                }
                var scaleMultiplier = this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);
                var fontHeight = this.fontHeightInPixelsBase;
                var start = function () {
                    var venueMessage = GameFramework.VenueMessage.fromText("Loading profiles...");
                    var venueTask = new GameFramework.VenueTask(venueMessage, () => // perform
                     {
                        var result = GameFramework.Profile.toControlProfileSelect(universe, null, universe.venueCurrent);
                        return result;
                    }, (universe, result) => // done
                     {
                        var venueProfileSelect = new GameFramework.VenueControls(result, false);
                        universe.venueNext =
                            new GameFramework.VenueFader(venueProfileSelect, universe.venueCurrent, null, null);
                    });
                    universe.venueNext =
                        new GameFramework.VenueFader(venueTask, universe.venueCurrent, null, null);
                };
                var visual = new GameFramework.VisualGroup([
                    new GameFramework.VisualImageScaled(new GameFramework.VisualImageFromLibrary("Title"), size)
                ]);
                var soundNameMusic = "Music_Title";
                visual.children.push(new GameFramework.VisualSound(soundNameMusic, true) // isMusic
                );
                var returnValue = new GameFramework.ControlContainer("containerTitle", this._zeroes, // pos
                this.sizeBase.clone(), // size
                // children
                [
                    new GameFramework.ControlVisual("imageTitle", this._zeroes.clone(), this.sizeBase.clone(), // size
                    new GameFramework.DataBinding(visual, null, null), null, null // colors
                    ),
                    new GameFramework.ControlButton("buttonStart", new GameFramework.Coords(75, 120, 0), // pos
                    new GameFramework.Coords(50, fontHeight * 2, 0), // size
                    "Start", fontHeight * 2, false, // hasBorder
                    true, // isEnabled
                    start, // click
                    null, null)
                ], // end children
                [
                    new GameFramework.Action(GameFramework.ControlActionNames.Instances().ControlCancel, start),
                    new GameFramework.Action(GameFramework.ControlActionNames.Instances().ControlConfirm, start)
                ], null);
                returnValue.scalePosAndSize(scaleMultiplier);
                return returnValue;
            }
            ;
            worldDetail(universe, size, venuePrev) {
                if (size == null) {
                    size = universe.display.sizeDefault();
                }
                var scaleMultiplier = this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);
                var fontHeight = this.fontHeightInPixelsBase;
                var world = universe.world;
                var dateCreated = world.dateCreated;
                var dateSaved = world.dateSaved;
                var returnValue = new GameFramework.ControlContainer("containerWorldDetail", this._zeroes, // pos
                this.sizeBase.clone(), // size
                // children
                [
                    new GameFramework.ControlLabel("labelProfileName", new GameFramework.Coords(100, 40, 0), // pos
                    new GameFramework.Coords(100, 20, 0), // size
                    true, // isTextCentered
                    "Profile: " + universe.profile.name, fontHeight),
                    new GameFramework.ControlLabel("labelWorldName", new GameFramework.Coords(100, 55, 0), // pos
                    new GameFramework.Coords(150, 25, 0), // size
                    true, // isTextCentered
                    "World: " + world.name, fontHeight),
                    new GameFramework.ControlLabel("labelStartDate", new GameFramework.Coords(100, 70, 0), // pos
                    new GameFramework.Coords(150, 25, 0), // size
                    true, // isTextCentered
                    "Started:" + dateCreated.toStringTimestamp(), fontHeight),
                    new GameFramework.ControlLabel("labelSavedDate", new GameFramework.Coords(100, 85, 0), // pos
                    new GameFramework.Coords(150, 25, 0), // size
                    true, // isTextCentered
                    "Saved:" + (dateSaved == null ? "[never]" : dateSaved.toStringTimestamp()), fontHeight),
                    new GameFramework.ControlButton("buttonStart", new GameFramework.Coords(50, 100, 0), // pos
                    new GameFramework.Coords(100, this.buttonHeightBase, 0), // size
                    "Start", fontHeight, true, // hasBorder
                    true, // isEnabled
                    () => // click
                     {
                        var world = universe.world;
                        var venueWorld = new GameFramework.VenueWorld(world);
                        var venueNext;
                        if (world.dateSaved != null) {
                            venueNext = venueWorld;
                        }
                        else {
                            var textInstructions = universe.mediaLibrary.textStringGetByName("Instructions");
                            var instructions = textInstructions.value;
                            var controlInstructions = universe.controlBuilder.message(universe, size, new GameFramework.DataBinding(instructions, null, null), () => // acknowledge
                             {
                                universe.venueNext = new GameFramework.VenueFader(venueWorld, universe.venueCurrent, null, null);
                            }, false);
                            var venueInstructions = new GameFramework.VenueControls(controlInstructions, false);
                            var venueMovie = new GameFramework.VenueVideo("Movie", // videoName
                            venueInstructions // fader implicit
                            );
                            venueNext = venueMovie;
                        }
                        venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                        universe.venueNext = venueNext;
                    }, null, null),
                    new GameFramework.ControlButton("buttonBack", new GameFramework.Coords(10, 10, 0), // pos
                    new GameFramework.Coords(15, 15, 0), // size
                    "<", fontHeight, true, // hasBorder
                    true, // isEnabled
                    () => // click
                     {
                        var venueNext = venuePrev;
                        venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                        universe.venueNext = venueNext;
                    }, null, null),
                    new GameFramework.ControlButton("buttonDelete", new GameFramework.Coords(180, 10, 0), // pos
                    new GameFramework.Coords(15, 15, 0), // size
                    "x", fontHeight, true, // hasBorder
                    true, // isEnabled
                    () => // click
                     {
                        var saveState = universe.profile.saveStateSelected();
                        var saveStateName = saveState.name;
                        var controlConfirm = universe.controlBuilder.confirmAndReturnToVenue(universe, size, "Delete save \""
                            + saveStateName
                            + "\"?", universe.venueCurrent, () => // confirm
                         {
                            var storageHelper = universe.storageHelper;
                            var profile = universe.profile;
                            var saveStates = profile.saveStates;
                            GameFramework.ArrayHelper.remove(saveStates, saveState);
                            storageHelper.save(profile.name, profile);
                            universe.world = null;
                            storageHelper.delete(saveStateName);
                        }, null // cancel
                        );
                        var venueNext = new GameFramework.VenueControls(controlConfirm, false);
                        venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                        universe.venueNext = venueNext;
                    }, null, null),
                ], // end children
                null, null);
                returnValue.scalePosAndSize(scaleMultiplier);
                return returnValue;
            }
            ;
            worldLoad(universe, size) {
                if (size == null) {
                    size = universe.display.sizeDefault();
                }
                var scaleMultiplier = this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);
                var fontHeight = this.fontHeightInPixelsBase;
                var confirm = () => {
                    var storageHelper = universe.storageHelper;
                    var messageAsDataBinding = new GameFramework.DataBinding(null, // Will be set below.
                    (c) => "Loading game...", null);
                    var venueMessage = new GameFramework.VenueMessage(messageAsDataBinding, null, null, null, null);
                    var venueTask = new GameFramework.VenueTask(venueMessage, () => // perform
                     {
                        var profile = universe.profile;
                        var saveStateSelected = profile.saveStateSelected;
                        return storageHelper.load(saveStateSelected.name);
                    }, (universe, saveStateReloaded) => // done
                     {
                        universe.world = saveStateReloaded.world;
                        var venueNext = new GameFramework.VenueControls(universe.controlBuilder.worldLoad(universe, null), false);
                        venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                        universe.venueNext = venueNext;
                    });
                    messageAsDataBinding.contextSet(venueTask);
                    universe.venueNext = new GameFramework.VenueFader(venueTask, universe.venueCurrent, null, null);
                };
                var cancel = () => {
                    var venueNext = new GameFramework.VenueControls(universe.controlBuilder.worldLoad(universe, null), false);
                    venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                    universe.venueNext = venueNext;
                };
                var returnValue = new GameFramework.ControlContainer("containerWorldLoad", this._zeroes, // pos
                this.sizeBase.clone(), // size
                // children
                [
                    new GameFramework.ControlLabel("labelProfileName", new GameFramework.Coords(100, 25, 0), // pos
                    new GameFramework.Coords(120, 25, 0), // size
                    true, // isTextCentered
                    "Profile: " + universe.profile.name, fontHeight),
                    new GameFramework.ControlLabel("labelSelectASave", new GameFramework.Coords(100, 40, 0), // pos
                    new GameFramework.Coords(100, 25, 0), // size
                    true, // isTextCentered
                    "Select a Save:", fontHeight),
                    new GameFramework.ControlList("listSaveStates", new GameFramework.Coords(30, 50, 0), // pos
                    new GameFramework.Coords(140, 50, 0), // size
                    new GameFramework.DataBinding(universe.profile, (c) => c.saveStates, null), // items
                    GameFramework.DataBinding.fromGet((c) => c.name), // bindingForOptionText
                    fontHeight, new GameFramework.DataBinding(universe.profile, (c) => c.saveStateSelected(), (c, v) => { c.saveStateNameSelected = v.name; }), // bindingForOptionSelected
                    GameFramework.DataBinding.fromGet((c) => c), // value
                    null, null, null),
                    new GameFramework.ControlButton("buttonLoadFromServer", new GameFramework.Coords(30, 105, 0), // pos
                    new GameFramework.Coords(40, this.buttonHeightBase, 0), // size
                    "Load", fontHeight, true, // hasBorder
                    new GameFramework.DataBinding(true, null, null), // isEnabled
                    () => // click
                     {
                        var controlConfirm = universe.controlBuilder.confirm(universe, size, "Abandon the current game?", confirm, cancel);
                        var venueConfirm = new GameFramework.VenueControls(controlConfirm, false);
                        universe.venueNext = new GameFramework.VenueFader(venueConfirm, universe.venueCurrent, null, null);
                    }, null, null),
                    new GameFramework.ControlButton("buttonLoadFromFile", new GameFramework.Coords(80, 105, 0), // pos
                    new GameFramework.Coords(40, this.buttonHeightBase, 0), // size
                    "Load File", fontHeight, true, // hasBorder
                    true, // isEnabled
                    () => // click
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
                    }, null, null),
                    new GameFramework.ControlButton("buttonReturn", new GameFramework.Coords(130, 105, 0), // pos
                    new GameFramework.Coords(40, this.buttonHeightBase, 0), // size
                    "Return", fontHeight, true, // hasBorder
                    true, // isEnabled
                    () => // click
                     {
                        var venueGame = new GameFramework.VenueControls(universe.controlBuilder.game(universe, size, universe.venueCurrent), false);
                        universe.venueNext = new GameFramework.VenueFader(venueGame, universe.venueCurrent, null, null);
                    }, null, null),
                ], null, null);
                returnValue.scalePosAndSize(scaleMultiplier);
                return returnValue;
            }
        }
        GameFramework.ControlBuilder = ControlBuilder;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
