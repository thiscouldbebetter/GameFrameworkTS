"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ControlBuilder {
            constructor(styles, venueTransitionalFromTo) {
                this.styles = styles || GameFramework.ControlStyle.Instances()._All;
                this.venueTransitionalFromTo =
                    venueTransitionalFromTo || this.venueFaderFromTo;
                this.stylesByName = GameFramework.ArrayHelper.addLookupsByName(this.styles);
                this.fontBase = GameFramework.FontNameAndHeight.default();
                this.fontHeightInPixelsBase = this.fontBase.heightInPixels;
                this.buttonHeightBase = this.fontHeightInPixelsBase * 2;
                this.buttonHeightSmallBase = this.fontHeightInPixelsBase * 1.5;
                this.sizeBase = new GameFramework.Coords(200, 150, 1);
                // Helper variables.
                this._zeroes = GameFramework.Coords.create();
                this._scaleMultiplier = GameFramework.Coords.create();
            }
            static default() {
                return new ControlBuilder(null, null);
            }
            static fromStyle(style) {
                return ControlBuilder.fromStyles([style]);
            }
            static fromStyles(styles) {
                return new ControlBuilder(styles, null);
            }
            styleByName(styleName) {
                return this.stylesByName.get(styleName);
            }
            styleDefault() {
                return this.styles[0];
            }
            venueFaderFromTo(vFrom, vTo) {
                if (vTo.constructor.name == GameFramework.VenueFader.name) {
                    vTo = vTo.venueToFadeTo();
                }
                var returnValue = GameFramework.VenueFader.fromVenuesToAndFrom(vTo, vFrom);
                return returnValue;
            }
            // Controls.
            choice(universe, size, message, optionNames, optionFunctions, showMessageOnly, fontNameAndHeight, buttonPosY) {
                size = size || universe.display.sizeDefault();
                showMessageOnly = showMessageOnly || false;
                fontNameAndHeight = fontNameAndHeight || this.fontBase;
                var fontHeight = fontNameAndHeight.heightInPixels;
                var scaleMultiplier = this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);
                var containerSizeScaled = size.clone().clearZ().divide(scaleMultiplier);
                var numberOfOptions = optionNames.length;
                if (showMessageOnly && numberOfOptions == 1) {
                    numberOfOptions = 0; // Is a single option really an option?
                }
                var labelMessageSizeY = Math.round(this.sizeBase.y * (numberOfOptions == 0 ? 1 : (2 / 3)));
                buttonPosY = buttonPosY || Math.round(this.sizeBase.y * (numberOfOptions > 0 ? (2 / 3) : 1));
                var labelMessagePos = GameFramework.Coords.fromXY(0, 0);
                var labelMessageSize = GameFramework.Coords.fromXY(this.sizeBase.x, labelMessageSizeY);
                var labelMessage = GameFramework.ControlLabel.from4Centered(labelMessagePos, labelMessageSize, message, fontNameAndHeight);
                var childControls = [labelMessage];
                if (showMessageOnly == false) {
                    var buttonWidth = 55;
                    var buttonSize = GameFramework.Coords.fromXY(buttonWidth, fontHeight * 2);
                    var spaceBetweenButtons = 5;
                    var buttonMarginLeftRight = (this.sizeBase.x
                        - (buttonWidth * numberOfOptions)
                        - (spaceBetweenButtons * (numberOfOptions - 1))) / 2;
                    for (var i = 0; i < numberOfOptions; i++) {
                        var optionName = optionNames[i];
                        var button = GameFramework.ControlButton.from5(GameFramework.Coords.fromXY(buttonMarginLeftRight + i * (buttonWidth + spaceBetweenButtons), buttonPosY), // pos
                        buttonSize.clone(), optionName, fontNameAndHeight, optionFunctions[i]);
                        childControls.push(button);
                    }
                }
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
                var controlContainer = new GameFramework.ControlContainer("containerChoice", containerPosScaled, containerSizeScaled, childControls, actions, null //?
                );
                controlContainer.scalePosAndSize(scaleMultiplier);
                var returnValue = null;
                if (showMessageOnly) {
                    returnValue = new GameFramework.ControlContainerTransparent(controlContainer);
                }
                else {
                    returnValue = controlContainer;
                }
                return returnValue;
            }
            choice5(universe, size, message, optionNames, optionFunctions) {
                return this.choice(universe, size, message, optionNames, optionFunctions, null, null, null);
            }
            choiceList(universe, size, message, options, bindingForOptionText, buttonSelectText, select) {
                // todo - Variable sizes.
                size = size || universe.display.sizeDefault();
                var marginWidth = 10;
                var marginSize = GameFramework.Coords.fromXY(1, 1).multiplyScalar(marginWidth);
                var fontHeight = 20;
                var font = GameFramework.FontNameAndHeight.fromHeightInPixels(fontHeight);
                var labelSize = GameFramework.Coords.fromXY(size.x - marginSize.x * 2, fontHeight);
                var buttonSize = GameFramework.Coords.fromXY(labelSize.x, fontHeight * 2);
                var listSize = GameFramework.Coords.fromXY(labelSize.x, size.y - labelSize.y - buttonSize.y - marginSize.y * 4);
                var listOptions = GameFramework.ControlList.from8("listOptions", GameFramework.Coords.fromXY(marginSize.x, labelSize.y + marginSize.y * 2), listSize, options, bindingForOptionText, font, null, // bindingForItemSelected
                null // bindingForItemValue
                );
                var returnValue = GameFramework.ControlContainer.from4("containerChoice", GameFramework.Coords.create(), size, [
                    GameFramework.ControlLabel.from4CenteredHorizontally(GameFramework.Coords.fromXY(size.x / 2, marginSize.y + fontHeight / 2), labelSize, GameFramework.DataBinding.fromContext(message), font),
                    listOptions,
                    GameFramework.ControlButton.from5(GameFramework.Coords.fromXY(marginSize.x, size.y - marginSize.y - buttonSize.y), buttonSize, buttonSelectText, font, () => // click
                     {
                        var itemSelected = listOptions.itemSelected();
                        if (itemSelected != null) {
                            select(universe, itemSelected);
                        }
                    }),
                ]);
                return returnValue;
            }
            confirm(universe, size, message, confirm, cancel) {
                return this.confirmForUniverseSizeMessageConfirmCancel(universe, size, message, confirm, cancel);
            }
            confirmForUniverseSizeMessageConfirmCancel(universe, size, message, confirm, cancel) {
                if (cancel == null) {
                    cancel = () => universe.venuePrevJumpTo();
                }
                return this.choice(universe, size, GameFramework.DataBinding.fromContext(message), ["Confirm", "Cancel"], [confirm, cancel], null, // showMessageOnly
                null, // fontHeight
                null // buttonPosY
                );
            }
            confirmAndReturnToVenue(universe, size, message, venuePrev, confirm, cancel) {
                var confirmThenReturnToVenuePrev = () => {
                    confirm();
                    universe.venueTransitionTo(venuePrev);
                };
                var cancelThenReturnToVenuePrev = () => {
                    if (cancel != null) {
                        cancel();
                    }
                    universe.venueTransitionTo(venuePrev);
                };
                return this.choice(universe, size, GameFramework.DataBinding.fromContext(message), ["Confirm", "Cancel"], [confirmThenReturnToVenuePrev, cancelThenReturnToVenuePrev], null, // showMessageOnly
                null, // fontHeight
                null // buttonPosY
                );
            }
            game(universe, size, venuePrev) {
                if (size == null) {
                    size = universe.display.sizeDefault().clone();
                }
                var scaleMultiplier = this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);
                var font = this.fontBase;
                var buttonHeight = this.buttonHeightBase;
                var padding = 5;
                var rowHeight = buttonHeight + padding;
                var rowCount = 5;
                var buttonsAllHeight = rowCount * buttonHeight + (rowCount - 1) * padding;
                var margin = (this.sizeBase.y - buttonsAllHeight) / 2;
                var buttonSize = GameFramework.Coords.fromXY(40, buttonHeight);
                var posX = (this.sizeBase.x - buttonSize.x) / 2;
                var row0PosY = margin;
                var row1PosY = row0PosY + rowHeight;
                var row2PosY = row1PosY + rowHeight;
                var row3PosY = row2PosY + rowHeight;
                var row4PosY = row3PosY + rowHeight;
                var save = () => {
                    var venueNext = GameFramework.Profile.toControlSaveStateSave(universe, size, universe.venueCurrent()).toVenue();
                    universe.venueTransitionTo(venueNext);
                };
                var load = () => {
                    var venueNext = GameFramework.Profile.toControlSaveStateLoad(universe, null, universe.venueCurrent()).toVenue();
                    universe.venueTransitionTo(venueNext);
                };
                var about = () => {
                    var buildTime = _BuildRecord.buildTime();
                    var aboutTextAsLines = [
                        universe.name,
                        "Version: " + universe.version,
                        "Built: " + (buildTime == null ? "[unknown]" : buildTime.toISOString().split("T").join(" "))
                    ];
                    var aboutText = aboutTextAsLines.join("\n");
                    var venueCurrent = universe.venueCurrent();
                    var venueToReturnTo = universe.venueCurrent();
                    var venueNext = new GameFramework.VenueMessage(GameFramework.DataBinding.fromContext(aboutText), () => // acknowledge
                     {
                        universe.venueTransitionTo(venueCurrent);
                    }, venueToReturnTo, size, false);
                    universe.venueTransitionTo(venueNext);
                };
                var quit = () => ControlBuilder.game_Quit(universe, size, venuePrev);
                var back = () => ControlBuilder.game_Back(universe, venuePrev);
                var buttonSave = GameFramework.ControlButton.from5(GameFramework.Coords.fromXY(posX, row0PosY), // pos
                buttonSize.clone(), "Save", font, save);
                var buttonLoad = GameFramework.ControlButton.from5(GameFramework.Coords.fromXY(posX, row1PosY), // pos
                buttonSize.clone(), "Load", font, load);
                var buttonAbout = GameFramework.ControlButton.from5(GameFramework.Coords.fromXY(posX, row2PosY), // pos
                buttonSize.clone(), "About", font, about);
                var buttonQuit = GameFramework.ControlButton.from5(GameFramework.Coords.fromXY(posX, row3PosY), // pos
                buttonSize.clone(), "Quit", font, quit);
                var buttonBack = GameFramework.ControlButton.from5(GameFramework.Coords.fromXY(posX, row4PosY), // pos
                buttonSize.clone(), "Back", font, back // click
                );
                var returnValue = new GameFramework.ControlContainer("containerStorage", this._zeroes, // pos
                this.sizeBase.clone(), 
                // children
                [
                    buttonSave,
                    buttonLoad,
                    buttonAbout,
                    buttonQuit,
                    buttonBack
                ], [new GameFramework.Action("Back", back)], [new GameFramework.ActionToInputsMapping("Back", ["Escape"], true)]);
                returnValue.scalePosAndSize(scaleMultiplier);
                return returnValue;
            }
            static game_Back(universe, venueToReturnTo) {
                universe.venueTransitionTo(venueToReturnTo);
            }
            static game_Quit(universe, size, venueToReturnTo) {
                var controlConfirm = universe.controlBuilder.confirm(universe, size, "Are you sure you want to quit?", () => // confirm
                 {
                    universe.reset();
                    var venueNext = universe.controlBuilder.title(universe, null).toVenue();
                    universe.venueTransitionTo(venueNext);
                }, () => // cancel
                 {
                    var venueNext = venueToReturnTo;
                    universe.venueTransitionTo(venueNext);
                });
                var venueNext = controlConfirm.toVenue();
                universe.venueTransitionTo(venueNext);
            }
            gameAndSettings1(universe) {
                return this.gameAndSettings(universe, null, // size
                universe.venueCurrent(), true // includeResumeButton
                );
            }
            gameAndSettings(universe, size, venuePrev, includeResumeButton) {
                var controlBuilder = this;
                if (size == null) {
                    size = universe.display.sizeDefault().clone();
                }
                var scaleMultiplier = this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);
                var font = this.fontBase;
                var buttonWidth = 50;
                var buttonHeight = this.buttonHeightBase;
                var padding = 5;
                var rowCount = (includeResumeButton ? 3 : 2);
                var rowHeight = buttonHeight + padding;
                var buttonsAllHeight = rowCount * buttonHeight + (rowCount - 1) * padding;
                var margin = GameFramework.Coords.fromXY((this.sizeBase.x - buttonWidth) / 2, (this.sizeBase.y - buttonsAllHeight) / 2);
                var row0PosY = margin.y;
                var row1PosY = row0PosY + rowHeight;
                var row2PosY = row1PosY + rowHeight;
                var buttonSize = GameFramework.Coords.fromXY(buttonWidth, buttonHeight);
                var buttonGame = GameFramework.ControlButton.from5(GameFramework.Coords.fromXY(margin.x, row0PosY), // pos
                buttonSize.clone(), "Game", font, () => // click
                 {
                    var venueNext = controlBuilder.game(universe, null, universe.venueCurrent()).toVenue();
                    universe.venueTransitionTo(venueNext);
                });
                var buttonSettings = GameFramework.ControlButton.from5(GameFramework.Coords.fromXY(margin.x, row1PosY), // pos
                buttonSize.clone(), "Settings", font, () => // click
                 {
                    var venueNext = controlBuilder.settings(universe, null, universe.venueCurrent()).toVenue();
                    universe.venueTransitionTo(venueNext);
                });
                var returnValue = new GameFramework.ControlContainer("Game", this._zeroes.clone(), // pos
                this.sizeBase.clone(), 
                // children
                [
                    buttonGame,
                    buttonSettings
                ], [], // actions
                [] // mappings
                );
                if (includeResumeButton) {
                    var back = () => {
                        universe.venueTransitionTo(venuePrev);
                    };
                    var buttonResume = GameFramework.ControlButton.from5(GameFramework.Coords.fromXY(margin.x, row2PosY), // pos
                    GameFramework.Coords.fromXY(buttonWidth, buttonHeight), // size
                    "Resume", this.fontBase, back);
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
                var font = this.fontBase;
                var world = universe.world;
                // hack - Should do ALL placeDefns, not just the current one.
                var placeCurrent = world.placeCurrent;
                var placeDefn = placeCurrent.defn(world);
                var returnValue = GameFramework.ControlContainer.from4("containerGameControls", this._zeroes, // pos
                this.sizeBase.clone(), // size
                // children
                [
                    GameFramework.ControlLabel.from4CenteredHorizontally(GameFramework.Coords.fromXY(100, 15), // pos
                    GameFramework.Coords.fromXY(100, 20), // size
                    GameFramework.DataBinding.fromContext("Actions:"), font),
                    GameFramework.ControlList.from8("listActions", GameFramework.Coords.fromXY(50, 25), // pos
                    GameFramework.Coords.fromXY(100, 40), // size
                    GameFramework.DataBinding.fromGet((c) => placeDefn.actionToInputsMappingsEdited), // items
                    GameFramework.DataBinding.fromGet((c) => c.actionName), // bindingForItemText
                    font, new GameFramework.DataBinding(placeDefn, (c) => c.actionToInputsMappingSelected, (c, v) => { c.actionToInputsMappingSelected = v; }), // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c) // bindingForItemValue
                    ),
                    GameFramework.ControlLabel.from4CenteredHorizontally(GameFramework.Coords.fromXY(100, 70), // pos
                    GameFramework.Coords.fromXY(100, 15), // size
                    GameFramework.DataBinding.fromContext("Inputs:"), font),
                    GameFramework.ControlLabel.from4CenteredHorizontally(GameFramework.Coords.fromXY(100, 80), // pos
                    GameFramework.Coords.fromXY(200, 15), // size
                    GameFramework.DataBinding.fromContextAndGet(placeDefn, (c) => {
                        var i = c.actionToInputsMappingSelected;
                        return (i == null ? "-" : i.inputNames.join(", "));
                    }), // text
                    font),
                    GameFramework.ControlButton.from8("buttonClear", GameFramework.Coords.fromXY(25, 90), // pos
                    GameFramework.Coords.fromXY(45, 15), // size
                    "Clear", font, true, // hasBorder
                    GameFramework.DataBinding.fromContextAndGet(placeDefn, (c) => { return c.actionToInputsMappingSelected != null; }), // isEnabled
                    () => // click
                     {
                        var mappingSelected = placeDefn.actionToInputsMappingSelected;
                        if (mappingSelected != null) {
                            mappingSelected.inputNames.length = 0;
                        }
                    }),
                    GameFramework.ControlButton.from8("buttonAdd", GameFramework.Coords.fromXY(80, 90), // pos
                    GameFramework.Coords.fromXY(45, 15), // size
                    "Add", font, true, // hasBorder
                    GameFramework.DataBinding.fromContextAndGet(placeDefn, (c) => (c.actionToInputsMappingSelected != null)), // isEnabled
                    () => // click
                     {
                        var mappingSelected = placeDefn.actionToInputsMappingSelected;
                        if (mappingSelected != null) {
                            var venueInputCapture = new GameFramework.VenueInputCapture(universe.venueCurrent(), (inputCaptured) => {
                                var inputName = inputCaptured.name;
                                mappingSelected.inputNames.push(inputName);
                            });
                            universe.venueTransitionTo(venueInputCapture);
                        }
                    }),
                    GameFramework.ControlButton.from8("buttonRestoreDefault", GameFramework.Coords.fromXY(135, 90), // pos
                    GameFramework.Coords.fromXY(45, 15), // size
                    "Default", font, true, // hasBorder
                    GameFramework.DataBinding.fromContextAndGet(placeDefn, (c) => (c.actionToInputsMappingSelected != null)), // isEnabled
                    () => // click
                     {
                        var mappingSelected = placeDefn.actionToInputsMappingSelected;
                        if (mappingSelected != null) {
                            var mappingDefault = placeDefn.actionToInputsMappingsDefault.filter((x) => (x.actionName == mappingSelected.actionName))[0];
                            mappingSelected.inputNames = mappingDefault.inputNames.slice();
                        }
                    }),
                    GameFramework.ControlButton.from5(GameFramework.Coords.fromXY(50, 110), // pos
                    GameFramework.Coords.fromXY(100, 15), // size
                    "Default All", font, () => {
                        var venueInputs = universe.venueCurrent();
                        var controlConfirm = universe.controlBuilder.confirmAndReturnToVenue(universe, size, "Are you sure you want to restore defaults?", venueInputs, () => // confirm
                         {
                            placeDefn.actionToInputsMappingsRestoreDefaults();
                        }, null // cancel
                        );
                        var venueNext = controlConfirm.toVenue();
                        universe.venueTransitionTo(venueNext);
                    }),
                    GameFramework.ControlButton.from5(GameFramework.Coords.fromXY(50, 130), // pos
                    GameFramework.Coords.fromXY(45, 15), // size
                    "Cancel", font, () => // click
                     {
                        universe.venueTransitionTo(venuePrev);
                    }),
                    GameFramework.ControlButton.from8("buttonSave", GameFramework.Coords.fromXY(105, 130), // pos
                    GameFramework.Coords.fromXY(45, 15), // size
                    "Save", font, true, // hasBorder
                    // isEnabled
                    GameFramework.DataBinding.fromContextAndGet(placeDefn, (c) => {
                        var mappings = c.actionToInputsMappingsEdited;
                        var doAnyActionsLackInputs = mappings.some((x) => (x.inputNames.length == 0));
                        return (doAnyActionsLackInputs == false);
                    }), () => // click
                     {
                        placeDefn.actionToInputsMappingsSave();
                        universe.venueTransitionTo(venuePrev);
                    })
                ]);
                returnValue.scalePosAndSize(scaleMultiplier);
                return returnValue;
            }
            message(universe, size, message, acknowledge, showMessageOnly, fontNameAndHeight) {
                var optionNames = [];
                var optionFunctions = [];
                if (acknowledge != null) {
                    optionNames.push("Acknowledge");
                    optionFunctions.push(acknowledge);
                }
                return this.choice(universe, size, message, optionNames, optionFunctions, showMessageOnly, fontNameAndHeight, null // buttonPosY
                );
            }
            message4(universe, size, message, acknowledge) {
                return this.message(universe, size, message, acknowledge, null, null);
            }
            opening(universe, size) {
                if (size == null) {
                    size = universe.display.sizeDefault();
                }
                var scaleMultiplier = this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);
                var fontHeight = this.fontHeightInPixelsBase;
                var goToVenueNext = () => {
                    universe.soundHelper.soundsAllStop(universe);
                    var venueNext = this.producer(universe, size).toVenue();
                    universe.venueTransitionTo(venueNext);
                };
                var visual = new GameFramework.VisualGroup([
                    new GameFramework.VisualImageScaled(size, new GameFramework.VisualImageFromLibrary("Titles_Opening"))
                    // Note: Sound won't work on the opening screen,
                    // because the user has to interact somehow
                    // before the browser will play sound.
                ]);
                var controlActionNames = GameFramework.ControlActionNames.Instances();
                var returnValue = new GameFramework.ControlContainer("containerOpening", this._zeroes, // pos
                this.sizeBase.clone(), // size
                // children
                [
                    new GameFramework.ControlVisual("imageOpening", this._zeroes.clone(), this.sizeBase.clone(), // size
                    GameFramework.DataBinding.fromContext(visual), null, null // colors
                    ),
                    GameFramework.ControlButton.from8("buttonNext", GameFramework.Coords.fromXY(75, 120), // pos
                    GameFramework.Coords.fromXY(50, fontHeight * 2), // size
                    "Next", GameFramework.FontNameAndHeight.fromHeightInPixels(fontHeight * 2), false, // hasBorder
                    GameFramework.DataBinding.fromTrue(), // isEnabled
                    goToVenueNext // click
                    )
                ], // end children
                [
                    new GameFramework.Action(controlActionNames.ControlCancel, goToVenueNext),
                    new GameFramework.Action(controlActionNames.ControlConfirm, goToVenueNext)
                ], null);
                returnValue.scalePosAndSize(scaleMultiplier);
                return returnValue;
            }
            producer(universe, size) {
                if (size == null) {
                    size = universe.display.sizeDefault();
                }
                var scaleMultiplier = this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);
                var fontHeight = this.fontHeightInPixelsBase;
                var goToVenueNext = () => {
                    universe.soundHelper.soundsAllStop(universe);
                    var venueTitle = this.title(universe, size).toVenue();
                    universe.venueTransitionTo(venueTitle);
                };
                var visual = new GameFramework.VisualGroup([
                    new GameFramework.VisualImageScaled(size, new GameFramework.VisualImageFromLibrary("Titles_Producer")),
                    new GameFramework.VisualSound("Music_Producer", false) // repeat
                ]);
                var controlActionNames = GameFramework.ControlActionNames.Instances();
                var returnValue = new GameFramework.ControlContainer("containerProducer", this._zeroes, // pos
                this.sizeBase.clone(), // size
                // children
                [
                    new GameFramework.ControlVisual("imageProducer", this._zeroes.clone(), this.sizeBase.clone(), // size
                    GameFramework.DataBinding.fromContext(visual), null, null // colors
                    ),
                    GameFramework.ControlButton.from8("buttonNext", GameFramework.Coords.fromXY(75, 120), // pos
                    GameFramework.Coords.fromXY(50, fontHeight * 2), // size
                    "Next", GameFramework.FontNameAndHeight.fromHeightInPixels(fontHeight * 2), false, // hasBorder
                    GameFramework.DataBinding.fromTrue(), // isEnabled
                    goToVenueNext // click
                    )
                ], // end children
                [
                    new GameFramework.Action(controlActionNames.ControlCancel, goToVenueNext),
                    new GameFramework.Action(controlActionNames.ControlConfirm, goToVenueNext)
                ], null);
                returnValue.scalePosAndSize(scaleMultiplier);
                return returnValue;
            }
            settings(universe, size, venuePrev) {
                if (size == null) {
                    size = universe.display.sizeDefault();
                }
                var scaleMultiplier = this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);
                var font = this.fontBase;
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
                var back = () => {
                    universe.venueTransitionTo(venuePrev);
                };
                var labelMusic = GameFramework.ControlLabel.from4Uncentered(GameFramework.Coords.fromXY(30, row1PosY + labelPadding), // pos
                GameFramework.Coords.fromXY(75, buttonHeight), // size
                GameFramework.DataBinding.fromContext("Music:"), font);
                var selectMusicVolume = new GameFramework.ControlSelect("selectMusicVolume", GameFramework.Coords.fromXY(70, row1PosY), // pos
                GameFramework.Coords.fromXY(30, buttonHeight), // size
                new GameFramework.DataBinding(universe.soundHelper, (c) => c.musicVolume, (c, v) => c.musicVolume = v), // valueSelected
                GameFramework.DataBinding.fromContextAndGet(universe.soundHelper, (c) => c.controlSelectOptionsVolume()), // options
                GameFramework.DataBinding.fromGet((c) => c.value), // bindingForOptionValues,
                GameFramework.DataBinding.fromGet((c) => c.text), // bindingForOptionText
                font);
                var labelSound = GameFramework.ControlLabel.from4Uncentered(GameFramework.Coords.fromXY(105, row1PosY + labelPadding), // pos
                GameFramework.Coords.fromXY(75, buttonHeight), // size
                GameFramework.DataBinding.fromContext("Sound:"), font);
                var selectSoundVolume = new GameFramework.ControlSelect("selectSoundVolume", GameFramework.Coords.fromXY(140, row1PosY), // pos
                GameFramework.Coords.fromXY(30, buttonHeight), // size
                new GameFramework.DataBinding(universe.soundHelper, (c) => c.effectVolume, (c, v) => { c.effectVolume = v; }), // valueSelected
                GameFramework.DataBinding.fromContextAndGet(universe.soundHelper, (c) => c.controlSelectOptionsVolume()), // options
                GameFramework.DataBinding.fromGet((c) => c.value), // bindingForOptionValues,
                GameFramework.DataBinding.fromGet((c) => c.text), // bindingForOptionText
                font);
                var labelDisplay = GameFramework.ControlLabel.from4Uncentered(GameFramework.Coords.fromXY(30, row2PosY + labelPadding), // pos
                GameFramework.Coords.fromXY(75, buttonHeight), // size
                GameFramework.DataBinding.fromContext("Display:"), font);
                var selectDisplaySize = new GameFramework.ControlSelect("selectDisplaySize", GameFramework.Coords.fromXY(70, row2PosY), // pos
                GameFramework.Coords.fromXY(65, buttonHeight), // size
                GameFramework.DataBinding.fromContextAndGet(universe.display, (c) => c.sizeInPixels), // valueSelected
                // options
                GameFramework.DataBinding.fromContextAndGet(universe.display, (c) => c.sizesAvailable), GameFramework.DataBinding.fromGet((c) => c), // bindingForOptionValues,
                GameFramework.DataBinding.fromGet((c) => c.toStringXY()), // bindingForOptionText
                font);
                var change = () => // click
                 {
                    var venueControls = universe.venueCurrent();
                    var controlRootAsContainer = venueControls.controlRoot;
                    var selectDisplaySizeAsControl = controlRootAsContainer.childrenByName.get("selectDisplaySize");
                    var selectDisplaySize = selectDisplaySizeAsControl;
                    var displaySizeSpecified = selectDisplaySize.optionSelected();
                    var displayAsDisplay = universe.display;
                    var display = displayAsDisplay;
                    var platformHelper = universe.platformHelper;
                    platformHelper.platformableRemove(display);
                    display.sizeInPixels = displaySizeSpecified;
                    display.canvas = null; // hack
                    display.initialize(universe);
                    platformHelper.initialize(universe);
                    var venueNext = universe.controlBuilder.settings(universe, null, universe.venueCurrent()).toVenue();
                    universe.venueTransitionTo(venueNext);
                };
                var buttonChange = GameFramework.ControlButton.from5(GameFramework.Coords.fromXY(140, row2PosY), // pos
                GameFramework.Coords.fromXY(30, buttonHeight), // size
                "Change", font, change);
                var buttonInputs = GameFramework.ControlButton.from5(GameFramework.Coords.fromXY(70, row3PosY), // pos
                GameFramework.Coords.fromXY(65, buttonHeight), // size
                "Inputs", font, () => // click
                 {
                    var venueCurrent = universe.venueCurrent();
                    var controlGameControls = universe.controlBuilder.inputs(universe, size, venueCurrent);
                    var venueNext = controlGameControls.toVenue();
                    universe.venueTransitionTo(venueNext);
                });
                var buttonDone = GameFramework.ControlButton.from5(GameFramework.Coords.fromXY(70, row4PosY), // pos
                GameFramework.Coords.fromXY(65, buttonHeight), // size
                "Done", font, back // click
                );
                var returnValue = new GameFramework.ControlContainer("containerSettings", this._zeroes, // pos
                this.sizeBase.clone(), 
                // children
                [
                    labelMusic,
                    selectMusicVolume,
                    labelSound,
                    selectSoundVolume,
                    labelDisplay,
                    selectDisplaySize,
                    buttonChange,
                    buttonInputs,
                    buttonDone
                ], [new GameFramework.Action("Back", back)], [new GameFramework.ActionToInputsMapping("Back", ["Escape"], true)]);
                returnValue.scalePosAndSize(scaleMultiplier);
                return returnValue;
            }
            slideshow(universe, size, imageNamesAndMessagesForSlides, venueAfterSlideshow) {
                if (size == null) {
                    size = universe.display.sizeDefault();
                }
                var scaleMultiplier = this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);
                var controlsForSlides = new Array();
                var nextDefn = (slideIndexNext) => // click
                 {
                    var venueNext;
                    if (slideIndexNext < controlsForSlides.length) {
                        var controlForSlideNext = controlsForSlides[slideIndexNext];
                        venueNext = controlForSlideNext.toVenue();
                    }
                    else {
                        venueNext = venueAfterSlideshow;
                    }
                    universe.venueTransitionTo(venueNext);
                };
                var skip = () => {
                    universe.venueTransitionTo(venueAfterSlideshow);
                };
                for (var i = 0; i < imageNamesAndMessagesForSlides.length; i++) {
                    var imageNameAndMessage = imageNamesAndMessagesForSlides[i];
                    var imageName = imageNameAndMessage[0];
                    var message = imageNameAndMessage[1];
                    var next = nextDefn.bind(this, i + 1);
                    var imageSlide = new GameFramework.ControlVisual("imageSlide", this._zeroes, this.sizeBase.clone(), // size
                    GameFramework.DataBinding.fromContext(new GameFramework.VisualImageScaled(this.sizeBase.clone().multiply(scaleMultiplier), // sizeToDrawScaled
                    new GameFramework.VisualImageFromLibrary(imageName))), null, null // colorBackground, colorBorder
                    );
                    var labelSlideText = GameFramework.ControlLabel.from4CenteredHorizontally(GameFramework.Coords.fromXY(0, this.fontHeightInPixelsBase), // pos
                    GameFramework.Coords.fromXY(this.sizeBase.x, this.fontHeightInPixelsBase), // size
                    GameFramework.DataBinding.fromContext(message), this.fontBase);
                    var buttonNext = GameFramework.ControlButton.from5(GameFramework.Coords.fromXY(75, 120), // pos
                    GameFramework.Coords.fromXY(50, 40), // size
                    "Next", this.fontBase, next);
                    var containerSlide = new GameFramework.ControlContainer("containerSlide_" + i, this._zeroes, // pos
                    this.sizeBase.clone(), // size
                    // children
                    [
                        imageSlide,
                        labelSlideText,
                        buttonNext
                    ], [
                        new GameFramework.Action(GameFramework.ControlActionNames.Instances().ControlCancel, skip),
                        new GameFramework.Action(GameFramework.ControlActionNames.Instances().ControlConfirm, next)
                    ], null);
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
                var start = () => {
                    var venueMessage = GameFramework.VenueMessage.fromText("Loading profiles...");
                    var venueTask = new GameFramework.VenueTask(venueMessage, () => GameFramework.Profile.toControlProfileSelect(universe, null, universe.venueCurrent()), (result) => // done
                     {
                        var venueProfileSelect = result.toVenue();
                        universe.venueTransitionTo(venueProfileSelect);
                    });
                    universe.venueTransitionTo(venueTask);
                };
                var visual = new GameFramework.VisualGroup([
                    new GameFramework.VisualImageScaled(size, new GameFramework.VisualImageFromLibrary("Titles_Title")),
                    new GameFramework.VisualSound("Music_Title", true) // isMusic
                ]);
                var returnValue = new GameFramework.ControlContainer("containerTitle", this._zeroes, // pos
                this.sizeBase.clone(), // size
                // children
                [
                    GameFramework.ControlVisual.from4("imageTitle", this._zeroes.clone(), this.sizeBase.clone(), // size
                    GameFramework.DataBinding.fromContext(visual)),
                    GameFramework.ControlButton.from8("buttonStart", GameFramework.Coords.fromXY(75, 120), // pos
                    GameFramework.Coords.fromXY(50, fontHeight * 2), // size
                    "Start", GameFramework.FontNameAndHeight.fromHeightInPixels(fontHeight * 2), false, // hasBorder
                    GameFramework.DataBinding.fromTrue(), // isEnabled
                    start // click
                    )
                ], // end children
                [
                    new GameFramework.Action(GameFramework.ControlActionNames.Instances().ControlCancel, start),
                    new GameFramework.Action(GameFramework.ControlActionNames.Instances().ControlConfirm, start)
                ], null);
                returnValue.scalePosAndSize(scaleMultiplier);
                return returnValue;
            }
            worldDetail(universe, size, venuePrev) {
                var controlBuilder = this;
                if (size == null) {
                    size = universe.display.sizeDefault();
                }
                var sizeBase = this.sizeBase;
                var scaleMultiplier = this._scaleMultiplier.overwriteWith(size).divide(sizeBase);
                var font = this.fontBase;
                var world = universe.world;
                var dateCreated = world.dateCreated;
                var dateSaved = world.dateSaved;
                var labelProfileName = new GameFramework.ControlLabel("labelProfileName", GameFramework.Coords.fromXY(0, 40), // pos
                GameFramework.Coords.fromXY(sizeBase.x, 20), // size
                true, // isTextCenteredHorizontally
                false, // isTextCenteredVertically
                GameFramework.DataBinding.fromContext("Profile: " + universe.profile.name), font);
                var labelWorldName = new GameFramework.ControlLabel("labelWorldName", GameFramework.Coords.fromXY(0, 55), // pos
                GameFramework.Coords.fromXY(sizeBase.x, 25), // size
                true, // isTextCenteredHorizontally
                false, // isTextCenteredVertically
                GameFramework.DataBinding.fromContext("World: " + world.name), font);
                var labelStartDate = new GameFramework.ControlLabel("labelStartDate", GameFramework.Coords.fromXY(0, 70), // pos
                GameFramework.Coords.fromXY(sizeBase.x, 25), // size
                true, // isTextCenteredHorizontally
                false, // isTextCenteredVertically
                GameFramework.DataBinding.fromContext("Started: " + dateCreated.toStringTimestamp()), font);
                var labelSavedDate = new GameFramework.ControlLabel("labelSavedDate", GameFramework.Coords.fromXY(0, 85), // pos
                GameFramework.Coords.fromXY(sizeBase.x, 25), // size
                true, // isTextCenteredHorizontally
                false, // isTextCenteredVertically
                GameFramework.DataBinding.fromContext("Saved: "
                    + (dateSaved == null ? "[never]" : dateSaved.toStringTimestamp())), font);
                var start = () => // click
                 {
                    var world = universe.world;
                    var venueWorld = world.toVenue();
                    var venueNext;
                    if (world.dateSaved != null) {
                        venueNext = venueWorld;
                    }
                    else {
                        var textInstructions = universe.mediaLibrary.textStringGetByName("Instructions");
                        var instructions = textInstructions.value;
                        var controlInstructions = controlBuilder.message4(universe, size, GameFramework.DataBinding.fromContext(instructions), () => // acknowledge
                         {
                            universe.venueTransitionTo(venueWorld);
                        });
                        var venueInstructions = controlInstructions.toVenue();
                        var venueMovie = new GameFramework.VenueVideo("Movie", // videoName
                        venueInstructions // fader implicit
                        );
                        venueNext = venueMovie;
                    }
                    universe.venueTransitionTo(venueNext);
                };
                var buttonStart = GameFramework.ControlButton.from5(GameFramework.Coords.fromXY(50, 100), // pos
                GameFramework.Coords.fromXY(100, this.buttonHeightBase), // size
                "Start", font, start);
                var buttonBack = GameFramework.ControlButton.from8("buttonBack", GameFramework.Coords.fromXY(10, 10), // pos
                GameFramework.Coords.fromXY(15, 15), // size
                "<", font, true, // hasBorder
                GameFramework.DataBinding.fromTrue(), // isEnabled
                () => // click
                 {
                    universe.venueTransitionTo(venuePrev);
                });
                var buttonDelete = GameFramework.ControlButton.from8("buttonDelete", GameFramework.Coords.fromXY(180, 10), // pos
                GameFramework.Coords.fromXY(15, 15), // size
                "x", font, true, // hasBorder
                GameFramework.DataBinding.fromTrue(), // isEnabled
                () => // click
                 {
                    var saveState = universe.profile.saveStateSelected();
                    var saveStateName = saveState.name;
                    var controlConfirm = universe.controlBuilder.confirmAndReturnToVenue(universe, size, "Delete save \""
                        + saveStateName
                        + "\"?", universe.venueCurrent(), () => // confirm
                     {
                        var storageHelper = universe.storageHelper;
                        var profile = universe.profile;
                        var saveStates = profile.saveStates;
                        GameFramework.ArrayHelper.remove(saveStates, saveState);
                        storageHelper.save(profile.name, profile);
                        universe.worldSet(null);
                        storageHelper.delete(saveStateName);
                    }, null // cancel
                    );
                    var venueNext = controlConfirm.toVenue();
                    universe.venueTransitionTo(venueNext);
                });
                var returnValue = GameFramework.ControlContainer.from4("containerWorldDetail", this._zeroes, // pos
                sizeBase.clone(), // size
                // children
                [
                    labelProfileName,
                    labelWorldName,
                    labelStartDate,
                    labelSavedDate,
                    buttonStart,
                    buttonBack,
                    buttonDelete
                ]);
                returnValue.scalePosAndSize(scaleMultiplier);
                return returnValue;
            }
            worldLoad(universe, size) {
                var controlBuilder = this;
                if (size == null) {
                    size = universe.display.sizeDefault();
                }
                var scaleMultiplier = this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);
                var font = this.fontBase;
                var confirm = () => {
                    var storageHelper = universe.storageHelper;
                    var messageAsDataBinding = GameFramework.DataBinding.fromContextAndGet(null, // Will be set below.
                    (c) => "Loading game...");
                    var venueMessage = GameFramework.VenueMessage.fromMessage(messageAsDataBinding);
                    var venueTask = new GameFramework.VenueTask(venueMessage, () => // perform
                     {
                        var profile = universe.profile;
                        var saveStateSelected = profile.saveStateSelected;
                        return storageHelper.load(saveStateSelected.name);
                    }, (saveStateReloaded) => // done
                     {
                        var world = saveStateReloaded.toWorld(universe);
                        universe.worldSet(world);
                        var venueNext = universe.controlBuilder.worldLoad(universe, null).toVenue();
                        universe.venueTransitionTo(venueNext);
                    });
                    messageAsDataBinding.contextSet(venueTask);
                    universe.venueTransitionTo(venueTask);
                };
                var cancel = () => {
                    var venueNext = controlBuilder.worldLoad(universe, null).toVenue();
                    universe.venueTransitionTo(venueNext);
                };
                var loadFile = () => {
                    var venueFileUpload = new GameFramework.VenueFileUpload(null, null);
                    var acknowledge = () => {
                        var callback = (fileContentsAsString) => {
                            var worldAsStringCompressed = fileContentsAsString;
                            var compressor = universe.storageHelper.compressor;
                            var worldSerialized = compressor.decompressString(worldAsStringCompressed);
                            var worldCreator = universe.worldCreator;
                            var worldBlank = worldCreator.worldCreate(universe, worldCreator);
                            var worldDeserialized = worldBlank.fromStringJson(worldSerialized, universe);
                            universe.worldSet(worldDeserialized);
                            var venueNext = controlBuilder.game(universe, size, universe.venueCurrent()).toVenue();
                            universe.venueTransitionTo(venueNext);
                        };
                        var inputFile = venueFileUpload.toDomElement().getElementsByTagName("input")[0];
                        var fileToLoad = inputFile.files[0];
                        new GameFramework.FileHelper().loadFileAsBinaryString(fileToLoad, callback, null // contextForCallback
                        );
                    };
                    var controlMessageReadyToLoad = universe.controlBuilder.message4(universe, size, GameFramework.DataBinding.fromContext("Ready to load from file..."), acknowledge);
                    var venueMessageReadyToLoad = controlMessageReadyToLoad.toVenue();
                    var controlMessageCancelled = universe.controlBuilder.message4(universe, size, GameFramework.DataBinding.fromContext("No file specified."), () => // acknowlege
                     {
                        var venueNext = controlBuilder.game(universe, size, universe.venueCurrent()).toVenue();
                        universe.venueTransitionTo(venueNext);
                    });
                    var venueMessageCancelled = controlMessageCancelled.toVenue();
                    venueFileUpload.venueNextIfFileSpecified = venueMessageReadyToLoad;
                    venueFileUpload.venueNextIfCancelled = venueMessageCancelled;
                    universe.venueTransitionTo(venueFileUpload);
                };
                var labelProfileName = GameFramework.ControlLabel.from4CenteredHorizontally(GameFramework.Coords.fromXY(100, 25), // pos
                GameFramework.Coords.fromXY(120, 25), // size
                GameFramework.DataBinding.fromContext("Profile: " + universe.profile.name), font);
                var labelSelectASave = GameFramework.ControlLabel.from4CenteredHorizontally(GameFramework.Coords.fromXY(100, 40), // pos
                GameFramework.Coords.fromXY(100, 25), // size
                GameFramework.DataBinding.fromContext("Select a Save:"), font);
                var listSaveStates = GameFramework.ControlList.from8("listSaveStates", GameFramework.Coords.fromXY(30, 50), // pos
                GameFramework.Coords.fromXY(140, 50), // size
                GameFramework.DataBinding.fromContextAndGet(universe.profile, (c) => c.saveStates), // items
                GameFramework.DataBinding.fromGet((c) => c.name), // bindingForOptionText
                font, new GameFramework.DataBinding(universe.profile, (c) => c.saveStateSelected(), (c, v) => c.saveStateNameSelected = v.name), // bindingForOptionSelected
                GameFramework.DataBinding.fromGet((v) => v.name));
                var buttonLoadFromServer = GameFramework.ControlButton.from5(GameFramework.Coords.fromXY(30, 105), // pos
                GameFramework.Coords.fromXY(40, this.buttonHeightBase), // size
                "Load", font, () => // click
                 {
                    var controlConfirm = universe.controlBuilder.confirm(universe, size, "Abandon the current game?", confirm, cancel);
                    var venueConfirm = controlConfirm.toVenue();
                    universe.venueTransitionTo(venueConfirm);
                });
                var buttonLoadFromFile = GameFramework.ControlButton.from5(GameFramework.Coords.fromXY(80, 105), // pos
                GameFramework.Coords.fromXY(40, this.buttonHeightBase), // size
                "Load File", font, loadFile);
                var buttonReturn = GameFramework.ControlButton.from5(GameFramework.Coords.fromXY(130, 105), // pos
                GameFramework.Coords.fromXY(40, this.buttonHeightBase), // size
                "Return", font, () => // click
                 {
                    var venueGame = controlBuilder.game(universe, size, universe.venueCurrent()).toVenue();
                    universe.venueTransitionTo(venueGame);
                });
                var returnValue = GameFramework.ControlContainer.from4("containerWorldLoad", this._zeroes, // pos
                this.sizeBase.clone(), // size
                // children
                [
                    labelProfileName,
                    labelSelectASave,
                    listSaveStates,
                    buttonLoadFromServer,
                    buttonLoadFromFile,
                    buttonReturn
                ]);
                returnValue.scalePosAndSize(scaleMultiplier);
                return returnValue;
            }
        }
        GameFramework.ControlBuilder = ControlBuilder;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
