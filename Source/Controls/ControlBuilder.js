"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ControlBuilder {
            constructor(styles, venueTransitionalFromTo, profileMenusAreIncluded) {
                this.styles = styles || GameFramework.ControlStyle.Instances()._All;
                this.venueTransitionalFromTo =
                    venueTransitionalFromTo || this.venueFaderFromTo;
                this.profileMenusAreIncluded = profileMenusAreIncluded || false;
                this.stylesByName = GameFramework.ArrayHelper.addLookupsByName(this.styles);
                this.fontBase = GameFramework.FontNameAndHeight.default();
                this.fontHeightInPixelsBase = this.fontBase.heightInPixels;
                this.buttonHeightBase = this.fontHeightInPixelsBase * 2;
                this.buttonHeightSmallBase = this.fontHeightInPixelsBase * 1.5;
                this.sizeBase = GameFramework.Coords.fromXYZ(200, 150, 1);
                // Helper variables.
                this._zeroes = GameFramework.Coords.create();
                this._scaleMultiplier = GameFramework.Coords.create();
            }
            static default() {
                return new ControlBuilder(null, null, false);
            }
            static fromStyle(style) {
                return ControlBuilder.fromStyles([style]);
            }
            static fromStyles(styles) {
                return new ControlBuilder(styles, null, true);
            }
            profileMenusAreIncludedSet(value) {
                this.profileMenusAreIncluded = value;
                return this;
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
                var labelMessage = GameFramework.ControlLabel.fromPosSizeTextFontCentered(labelMessagePos, labelMessageSize, message, fontNameAndHeight);
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
                        var button = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(buttonMarginLeftRight + i * (buttonWidth + spaceBetweenButtons), buttonPosY), // pos
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
                            GameFramework.Action.fromNameAndPerform(controlActionNames.ControlCancel, acknowledge),
                            GameFramework.Action.fromNameAndPerform(controlActionNames.ControlConfirm, acknowledge),
                        ];
                }
                var controlContainer = GameFramework.ControlContainer.fromNamePosSizeChildrenAndActions("containerChoice", containerPosScaled, containerSizeScaled, childControls, actions);
                controlContainer.scalePosAndSize(scaleMultiplier);
                var returnValue = null;
                if (showMessageOnly) {
                    returnValue = GameFramework.ControlContainerTransparent.fromContainer(controlContainer);
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
                var labelMessage = GameFramework.ControlLabel.fromPosSizeTextFontCenteredHorizontally(GameFramework.Coords.fromXY(size.x / 2, marginSize.y + fontHeight / 2), labelSize, GameFramework.DataBinding.fromContext(message), font);
                var listOptions = GameFramework.ControlList.fromPosSizeItemsAndBindingForItemText(GameFramework.Coords.fromXY(marginSize.x, labelSize.y + marginSize.y * 2), listSize, options, bindingForOptionText);
                var buttonChoose = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(marginSize.x, size.y - marginSize.y - buttonSize.y), buttonSize, buttonSelectText, font, () => this.choiceList_Choose(universe, listOptions, select));
                var returnValue = GameFramework.ControlContainer.fromNamePosSizeAndChildren("containerChoice", GameFramework.Coords.create(), size, [
                    labelMessage,
                    listOptions,
                    buttonChoose
                ]);
                return returnValue;
            }
            choiceList_Choose(universe, listOptions, select) {
                var itemSelected = listOptions.itemSelected();
                if (itemSelected != null) {
                    select(universe, itemSelected);
                }
            }
            confirm(universe, size, message, confirm, cancel) {
                return this.confirmForUniverseSizeMessageConfirmCancel(universe, size, message, confirm, cancel);
            }
            confirmForUniverseSizeMessageConfirmCancel(universe, size, message, confirm, cancel) {
                if (cancel == null) {
                    cancel = () => universe.venuePrevJumpTo();
                }
                var returnValue = this.choice(universe, size, GameFramework.DataBinding.fromContext(message), ["Confirm", "Cancel"], [confirm, cancel], null, // showMessageOnly
                null, // fontHeight
                null // buttonPosY
                );
                return returnValue;
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
                var about = () => this.game_About(universe, size);
                var back = () => this.game_Back(universe, venuePrev);
                var quit = () => this.game_Quit(universe, size, venuePrev);
                var save = () => this.game_Save(universe, size);
                var buttonSave = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(posX, row0PosY), // pos
                buttonSize.clone(), "Save", font, save);
                var buttonLoad = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(posX, row1PosY), // pos
                buttonSize.clone(), "Load", font, () => this.game_Load(universe));
                var buttonAbout = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(posX, row2PosY), // pos
                buttonSize.clone(), "About", font, about);
                var buttonQuit = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(posX, row3PosY), // pos
                buttonSize.clone(), "Quit", font, quit);
                var buttonBack = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(posX, row4PosY), // pos
                buttonSize.clone(), "Back", font, back // click
                );
                var returnValue = GameFramework.ControlContainer.fromNamePosSizeChildrenActionsAndMappings("containerStorage", this._zeroes, // pos
                this.sizeBase.clone(), 
                // children
                [
                    buttonSave,
                    buttonLoad,
                    buttonAbout,
                    buttonQuit,
                    buttonBack
                ], [GameFramework.Action.fromNameAndPerform("Back", back)], [new GameFramework.ActionToInputsMapping("Back", [GameFramework.Input.Instances().Escape.name], true)]);
                returnValue.scalePosAndSize(scaleMultiplier);
                return returnValue;
            }
            game_About(universe, size) {
                var buildTime = _BuildRecord.buildTime();
                var buildTimeAsString = (buildTime == null)
                    ? "[unknown]"
                    : buildTime.toISOString().split("T").join("@");
                var aboutTextAsLines = [
                    universe.name,
                    "Version: " + universe.version,
                    "Built: " + buildTimeAsString
                ];
                var aboutText = aboutTextAsLines.join("\n");
                var venueCurrent = universe.venueCurrent();
                var venueNext = GameFramework.VenueMessage.fromTextAcknowledgeAndSize(aboutText, () => // acknowledge
                 {
                    universe.venueTransitionTo(venueCurrent);
                }, size);
                universe.venueTransitionTo(venueNext);
            }
            game_Back(universe, venueToReturnTo) {
                universe.venueTransitionTo(venueToReturnTo);
            }
            game_Load(universe) {
                var venueNext = GameFramework.Profile.toControlSaveStateLoad(universe, null, universe.venueCurrent()).toVenue();
                universe.venueTransitionTo(venueNext);
            }
            game_Quit(universe, size, venueToReturnTo) {
                var controlConfirm = universe.controlBuilder.confirm(universe, size, "Are you sure you want to quit?", () => this.game_Quit_Confirm(universe), () => this.game_Quit_Cancel(universe, venueToReturnTo));
                var venueNext = controlConfirm.toVenue();
                universe.venueTransitionTo(venueNext);
            }
            game_Quit_Cancel(universe, venueToReturnTo) {
                var venueNext = venueToReturnTo;
                universe.venueTransitionTo(venueNext);
            }
            ;
            game_Quit_Confirm(universe) {
                universe.reset();
                var venueNext = universe.controlBuilder.title(universe, null).toVenue();
                universe.venueTransitionTo(venueNext);
            }
            game_Save(universe, size) {
                var venueNext = GameFramework.Profile.toControlSaveStateSave(universe, size, universe.venueCurrent()).toVenue();
                universe.venueTransitionTo(venueNext);
            }
            ;
            gameAndSettings1(universe) {
                return this.gameAndSettings(universe, null, // size
                universe.venueCurrent(), true // includeResumeButton
                );
            }
            gameAndSettings(universe, size, venuePrev, includeResumeButton) {
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
                var buttonGame = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(margin.x, row0PosY), // pos
                buttonSize.clone(), "Game", font, () => this.gameAndSettings_TransitionToGameMenu(universe));
                var buttonSettings = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(margin.x, row1PosY), // pos
                buttonSize.clone(), "Settings", font, () => this.gameAndSettings_Settings(universe));
                var children = [
                    buttonGame,
                    buttonSettings
                ];
                var returnValue = GameFramework.ControlContainer.fromNamePosSizeAndChildren("Game", this._zeroes.clone(), // pos
                this.sizeBase.clone(), children);
                if (includeResumeButton) {
                    var buttonResume = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(margin.x, row2PosY), // pos
                    GameFramework.Coords.fromXY(buttonWidth, buttonHeight), // size
                    "Resume", this.fontBase, () => this.gameAndSettings_Back(universe, venuePrev));
                    returnValue.children.push(buttonResume);
                    returnValue.actions.push(GameFramework.Action.fromNameAndPerform("Back", () => this.gameAndSettings_Back(universe, venuePrev)));
                    returnValue._actionToInputsMappings.push(new GameFramework.ActionToInputsMapping("Back", [GameFramework.Input.Instances().Escape.name], true));
                }
                returnValue.scalePosAndSize(scaleMultiplier);
                return returnValue;
            }
            gameAndSettings_Back(universe, venuePrev) {
                universe.venueTransitionTo(venuePrev);
            }
            gameAndSettings_Settings(universe) {
                var venueNext = universe.controlBuilder.settings(universe, null, universe.venueCurrent()).toVenue();
                universe.venueTransitionTo(venueNext);
            }
            gameAndSettings_TransitionToGameMenu(universe) {
                var venueNext = this.game(universe, null, universe.venueCurrent()).toVenue();
                universe.venueTransitionTo(venueNext);
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
                var labelActions = GameFramework.ControlLabel.fromPosSizeTextFontCenteredHorizontally(GameFramework.Coords.fromXY(25, 10), // pos
                GameFramework.Coords.fromXY(150, 20), // size
                GameFramework.DataBinding.fromContext("Actions:"), font);
                var listActions = GameFramework.ControlList.fromNamePosSizeItemsTextFontSelectedValue("listActions", GameFramework.Coords.fromXY(25, 25), // pos
                GameFramework.Coords.fromXY(150, 40), // size
                GameFramework.DataBinding.fromGet((c) => placeDefn.actionToInputsMappingsEdited), // items
                GameFramework.DataBinding.fromGet((c) => c.actionName), // bindingForItemText
                font, GameFramework.DataBinding.fromContextGetAndSet(placeDefn, (c) => c.actionToInputsMappingSelected, (c, v) => { c.actionToInputsMappingSelected = v; }), // bindingForItemSelected
                GameFramework.DataBinding.fromGet((c) => c) // bindingForItemValue
                );
                var labelInputs = GameFramework.ControlLabel.fromPosSizeTextFontCenteredHorizontally(GameFramework.Coords.fromXY(25, 65), // pos
                GameFramework.Coords.fromXY(150, 20), // size
                GameFramework.DataBinding.fromContext("Inputs for Selected Action:"), font);
                var labelInputNames = GameFramework.ControlLabel.fromPosSizeTextFontCenteredHorizontally(GameFramework.Coords.fromXY(25, 75), // pos
                GameFramework.Coords.fromXY(150, 25), // size
                GameFramework.DataBinding.fromContextAndGet(placeDefn, (c) => {
                    var i = c.actionToInputsMappingSelected;
                    return (i == null ? "-" : i.inputNames.join(", "));
                }), // text
                font);
                var buttonClear = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(25, 90), // pos
                GameFramework.Coords.fromXY(45, 15), // size
                "Clear", font, () => this.inputs_Clear(placeDefn)).isEnabledSet(GameFramework.DataBinding.fromContextAndGet(placeDefn, (c) => (c.actionToInputsMappingSelected != null)));
                var buttonAdd = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(80, 90), // pos
                GameFramework.Coords.fromXY(45, 15), // size
                "Add", font, () => this.inputs_Add(universe, placeDefn)).isEnabledSet(GameFramework.DataBinding.fromContextAndGet(placeDefn, (c) => (c.actionToInputsMappingSelected != null)));
                var buttonDefault = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(135, 90), // pos
                GameFramework.Coords.fromXY(45, 15), // size
                "Default", font, () => this.inputs_ResetSelectedToDefault(placeDefn)).isEnabledSet(GameFramework.DataBinding.fromContextAndGet(placeDefn, (c) => (c.actionToInputsMappingSelected != null)));
                var buttonDefaultAll = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(50, 110), // pos
                GameFramework.Coords.fromXY(100, 15), // size
                "Default All", font, () => this.inputs_ResetAllToDefault(universe, size, placeDefn));
                var buttonCancel = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(50, 130), // pos
                GameFramework.Coords.fromXY(45, 15), // size
                "Cancel", font, () => this.inputs_Cancel(universe, venuePrev));
                var buttonSave = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(105, 130), // pos
                GameFramework.Coords.fromXY(45, 15), // size
                "Save", font, () => this.inputs_Save(universe, placeDefn, venuePrev)).isEnabledSet(GameFramework.DataBinding.fromContextAndGet(placeDefn, (c) => {
                    var mappings = c.actionToInputsMappingsEdited;
                    var doAnyActionsLackInputs = mappings.some((x) => (x.inputNames.length == 0));
                    return (doAnyActionsLackInputs == false);
                }));
                var returnValue = GameFramework.ControlContainer.fromNamePosSizeAndChildren("containerGameControls", this._zeroes, // pos
                this.sizeBase.clone(), // size
                // children
                [
                    labelActions,
                    listActions,
                    labelInputs,
                    labelInputNames,
                    buttonClear,
                    buttonAdd,
                    buttonDefault,
                    buttonDefaultAll,
                    buttonCancel,
                    buttonSave
                ]);
                returnValue.scalePosAndSize(scaleMultiplier);
                return returnValue;
            }
            inputs_Add(universe, placeDefn) {
                var mappingSelected = placeDefn.actionToInputsMappingSelected;
                if (mappingSelected != null) {
                    var venueInputCapture = GameFramework.VenueInputCapture.fromVenueToReturnToAndCapture(universe.venueCurrent(), (inputCaptured) => {
                        var inputName = inputCaptured.name;
                        mappingSelected.inputNames.push(inputName);
                    });
                    universe.venueTransitionTo(venueInputCapture);
                }
            }
            inputs_Cancel(universe, venuePrev) {
                universe.venueTransitionTo(venuePrev);
            }
            inputs_Clear(placeDefn) {
                var mappingSelected = placeDefn.actionToInputsMappingSelected;
                if (mappingSelected != null) {
                    mappingSelected.inputNames.length = 0;
                }
            }
            inputs_ResetAllToDefault(universe, size, placeDefn) {
                var venueInputs = universe.venueCurrent();
                var controlConfirm = universe.controlBuilder.confirmAndReturnToVenue(universe, size, "Are you sure you want to restore defaults?", venueInputs, () => // confirm
                 {
                    placeDefn.actionToInputsMappingsRestoreDefaults();
                }, null // cancel
                );
                var venueNext = controlConfirm.toVenue();
                universe.venueTransitionTo(venueNext);
            }
            inputs_ResetSelectedToDefault(placeDefn) {
                var mappingSelected = placeDefn.actionToInputsMappingSelected;
                if (mappingSelected != null) {
                    var mappingDefault = placeDefn.actionToInputsMappingsDefault.filter((x) => (x.actionName == mappingSelected.actionName))[0];
                    mappingSelected.inputNames = mappingDefault.inputNames.slice();
                }
            }
            inputs_Save(universe, placeDefn, venuePrev) {
                placeDefn.actionToInputsMappingsSave();
                universe.venueTransitionTo(venuePrev);
            }
            message(universe, size, message, acknowledge, showMessageOnly, fontNameAndHeight) {
                var optionNames = [];
                var optionFunctions = [];
                if (acknowledge != null) {
                    optionNames.push("Acknowledge");
                    optionFunctions.push(acknowledge);
                }
                var returnValue = this.choice(universe, size, message, optionNames, optionFunctions, showMessageOnly, fontNameAndHeight, null // buttonPosY
                );
                return returnValue;
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
                var visual = GameFramework.VisualGroup.fromChildren([
                    new GameFramework.VisualImageScaled(size, new GameFramework.VisualImageFromLibrary("Titles_Opening"))
                    // Note: Sound won't work on the opening screen,
                    // because the user has to interact somehow
                    // before the browser will play sound.
                ]);
                var controlActionNames = GameFramework.ControlActionNames.Instances();
                var imageOpening = GameFramework.ControlVisual.fromNamePosSizeAndVisual("imageOpening", this._zeroes.clone(), this.sizeBase.clone(), // size
                GameFramework.DataBinding.fromContext(visual));
                var goToVenueNext = () => this.opening_GoToVenueNext(universe, size);
                var buttonNext = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(75, 120), // pos
                GameFramework.Coords.fromXY(50, fontHeight * 2), // size
                "Next", GameFramework.FontNameAndHeight.fromHeightInPixels(fontHeight * 2), goToVenueNext).hasBorderSet(false);
                var actions = [
                    GameFramework.Action.fromNameAndPerform(controlActionNames.ControlCancel, goToVenueNext),
                    GameFramework.Action.fromNameAndPerform(controlActionNames.ControlConfirm, goToVenueNext)
                ];
                var returnValue = GameFramework.ControlContainer.fromNamePosSizeChildrenAndActions("containerOpening", this._zeroes, // pos
                this.sizeBase.clone(), // size
                // children
                [
                    imageOpening,
                    buttonNext
                ], actions);
                returnValue.scalePosAndSize(scaleMultiplier);
                return returnValue;
            }
            opening_GoToVenueNext(universe, size) {
                universe.soundHelper.soundsAllStop(universe);
                var venueNext = this.producer(universe, size).toVenue();
                universe.venueTransitionTo(venueNext);
            }
            producer(universe, size) {
                if (size == null) {
                    size = universe.display.sizeDefault();
                }
                var scaleMultiplier = this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);
                var fontHeight = this.fontHeightInPixelsBase;
                var visual = GameFramework.VisualGroup.fromChildren([
                    GameFramework.VisualImageScaled.fromSizeAndChild(size, new GameFramework.VisualImageFromLibrary("Titles_Producer")),
                    GameFramework.VisualSound.fromSoundNameAndRepeat("Music_Producer", false) // repeat
                ]);
                var controlActionNames = GameFramework.ControlActionNames.Instances();
                var imageProducer = GameFramework.ControlVisual.fromNamePosSizeAndVisual("imageProducer", this._zeroes.clone(), this.sizeBase.clone(), // size
                GameFramework.DataBinding.fromContext(visual));
                var goToVenueNext = () => this.producer_GoToVenueNext(universe, size);
                var buttonNext = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(75, 120), // pos
                GameFramework.Coords.fromXY(50, fontHeight * 2), // size
                "Next", GameFramework.FontNameAndHeight.fromHeightInPixels(fontHeight * 2), goToVenueNext // click
                ).hasBorderSet(false);
                var actions = [
                    GameFramework.Action.fromNameAndPerform(controlActionNames.ControlCancel, goToVenueNext),
                    GameFramework.Action.fromNameAndPerform(controlActionNames.ControlConfirm, goToVenueNext)
                ];
                var returnValue = GameFramework.ControlContainer.fromNamePosSizeChildrenAndActions("containerProducer", this._zeroes, // pos
                this.sizeBase.clone(), // size
                // children
                [
                    imageProducer,
                    buttonNext
                ], actions);
                returnValue.scalePosAndSize(scaleMultiplier);
                return returnValue;
            }
            producer_GoToVenueNext(universe, size) {
                universe.soundHelper.soundsAllStop(universe);
                var venueTitle = this.title(universe, size).toVenue();
                universe.venueTransitionTo(venueTitle);
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
                var labelMusic = GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(30, row1PosY + labelPadding), // pos
                GameFramework.Coords.fromXY(75, buttonHeight), // size
                GameFramework.DataBinding.fromContext("Music:"), font);
                var selectMusicVolume = new GameFramework.ControlSelect("selectMusicVolume", GameFramework.Coords.fromXY(70, row1PosY), // pos
                GameFramework.Coords.fromXY(30, buttonHeight), // size
                GameFramework.DataBinding.fromContextGetAndSet(universe.soundHelper, (c) => c.musicVolume, (c, v) => c.musicVolume = v), // valueSelected
                GameFramework.DataBinding.fromContextAndGet(universe.soundHelper, (c) => c.controlSelectOptionsVolume()), // options
                GameFramework.DataBinding.fromGet((c) => c.value), // bindingForOptionValues,
                GameFramework.DataBinding.fromGet((c) => c.text), // bindingForOptionText
                font);
                var labelSound = GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(105, row1PosY + labelPadding), // pos
                GameFramework.Coords.fromXY(75, buttonHeight), // size
                GameFramework.DataBinding.fromContext("Sound:"), font);
                var selectSoundVolume = new GameFramework.ControlSelect("selectSoundVolume", GameFramework.Coords.fromXY(140, row1PosY), // pos
                GameFramework.Coords.fromXY(30, buttonHeight), // size
                GameFramework.DataBinding.fromContextGetAndSet(universe.soundHelper, (c) => c.effectVolume, (c, v) => { c.effectVolume = v; }), // valueSelected
                GameFramework.DataBinding.fromContextAndGet(universe.soundHelper, (c) => c.controlSelectOptionsVolume()), // options
                GameFramework.DataBinding.fromGet((c) => c.value), // bindingForOptionValues,
                GameFramework.DataBinding.fromGet((c) => c.text), // bindingForOptionText
                font);
                var labelDisplay = GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(30, row2PosY + labelPadding), // pos
                GameFramework.Coords.fromXY(75, buttonHeight), // size
                GameFramework.DataBinding.fromContext("Display:"), font);
                var selectDisplaySize = new GameFramework.ControlSelect("selectDisplaySize", GameFramework.Coords.fromXY(70, row2PosY), // pos
                GameFramework.Coords.fromXY(65, buttonHeight), // size
                GameFramework.DataBinding.fromContextAndGet(universe.display, (c) => c.sizeInPixels), // valueSelected
                // options
                GameFramework.DataBinding.fromContextAndGet(universe.display, (c) => c.sizesAvailable), GameFramework.DataBinding.fromGet((c) => c), // bindingForOptionValues,
                GameFramework.DataBinding.fromGet((c) => c.toStringXY()), // bindingForOptionText
                font);
                var buttonChange = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(140, row2PosY), // pos
                GameFramework.Coords.fromXY(30, buttonHeight), // size
                "Change", font, () => this.settings_Change(universe));
                var buttonInputs = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(70, row3PosY), // pos
                GameFramework.Coords.fromXY(65, buttonHeight), // size
                "Inputs", font, () => // click
                 {
                    var venueCurrent = universe.venueCurrent();
                    var controlGameControls = universe.controlBuilder.inputs(universe, size, venueCurrent);
                    var venueNext = controlGameControls.toVenue();
                    universe.venueTransitionTo(venueNext);
                });
                var buttonDone = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(70, row4PosY), // pos
                GameFramework.Coords.fromXY(65, buttonHeight), // size
                "Done", font, back // click
                );
                var returnValue = GameFramework.ControlContainer.fromNamePosSizeChildrenActionsAndMappings("containerSettings", this._zeroes, // pos
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
                ], [GameFramework.Action.fromNameAndPerform("Back", back)], [new GameFramework.ActionToInputsMapping("Back", [GameFramework.Input.Instances().Escape.name], true)]);
                returnValue.scalePosAndSize(scaleMultiplier);
                return returnValue;
            }
            settings_Change(universe) {
                var venueControls = universe.venueCurrent();
                var controlRootAsContainer = venueControls.controlRoot;
                var selectDisplaySizeAsControl = controlRootAsContainer.childByName("selectDisplaySize");
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
            }
            slideshow(universe, size, imageNamesAndMessagesForSlides, venueAfterSlideshow) {
                if (size == null) {
                    size = universe.display.sizeDefault();
                }
                var scaleMultiplier = this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);
                var controlsForSlides = [];
                var skip = () => {
                    universe.venueTransitionTo(venueAfterSlideshow);
                };
                for (var i = 0; i < imageNamesAndMessagesForSlides.length; i++) {
                    var imageNameAndMessage = imageNamesAndMessagesForSlides[i];
                    var imageName = imageNameAndMessage[0];
                    var message = imageNameAndMessage[1];
                    var next = () => this.slideshow_NextDefn.bind // Does this work?  Check history if not.
                    (universe, controlsForSlides, i + 1, venueAfterSlideshow);
                    var imageSlide = GameFramework.ControlVisual.fromNamePosSizeAndVisual("imageSlide", this._zeroes, this.sizeBase.clone(), // size
                    GameFramework.DataBinding.fromContext(GameFramework.VisualImageScaled.fromSizeAndChild(this.sizeBase.clone().multiply(scaleMultiplier), // sizeToDrawScaled
                    GameFramework.VisualImageFromLibrary.fromImageName(imageName))));
                    var labelSlideText = GameFramework.ControlLabel.fromPosSizeTextFontCenteredHorizontally(GameFramework.Coords.fromXY(0, this.fontHeightInPixelsBase), // pos
                    GameFramework.Coords.fromXY(this.sizeBase.x, this.fontHeightInPixelsBase), // size
                    GameFramework.DataBinding.fromContext(message), this.fontBase);
                    var buttonNext = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(75, 120), // pos
                    GameFramework.Coords.fromXY(50, 40), // size
                    "Next", this.fontBase, next);
                    var controlActionNames = GameFramework.ControlActionNames.Instances();
                    var actions = [
                        GameFramework.Action.fromNameAndPerform(controlActionNames.ControlCancel, skip),
                        GameFramework.Action.fromNameAndPerform(controlActionNames.ControlConfirm, next)
                    ];
                    var containerSlide = GameFramework.ControlContainer.fromNamePosSizeChildrenAndActions("containerSlide_" + i, this._zeroes, // pos
                    this.sizeBase.clone(), // size
                    // children
                    [
                        imageSlide,
                        labelSlideText,
                        buttonNext
                    ], actions);
                    containerSlide.scalePosAndSize(scaleMultiplier);
                    controlsForSlides.push(containerSlide);
                }
                return controlsForSlides[0];
            }
            slideshow_NextDefn(universe, controlsForSlides, slideIndexNext, venueAfterSlideshow) {
                var venueNext;
                if (slideIndexNext < controlsForSlides.length) {
                    var controlForSlideNext = controlsForSlides[slideIndexNext];
                    venueNext = controlForSlideNext.toVenue();
                }
                else {
                    venueNext = venueAfterSlideshow;
                }
                universe.venueTransitionTo(venueNext);
            }
            title(universe, size) {
                if (size == null) {
                    size = universe.display.sizeDefault();
                }
                var scaleMultiplier = this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);
                var fontHeight = this.fontHeightInPixelsBase;
                var visual = GameFramework.VisualGroup.fromChildren([
                    GameFramework.VisualImageScaled.fromSizeAndChild(size, GameFramework.VisualImageFromLibrary.fromImageName("Titles_Title")),
                    GameFramework.VisualSound.fromSoundNameAndRepeat("Music_Title", true)
                ]);
                var imageTitle = GameFramework.ControlVisual.fromNamePosSizeAndVisual("imageTitle", this._zeroes.clone(), this.sizeBase.clone(), // size
                GameFramework.DataBinding.fromContext(visual));
                var buttonStart = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(75, 120), // pos
                GameFramework.Coords.fromXY(50, fontHeight * 2), // size
                "Start", GameFramework.FontNameAndHeight.fromHeightInPixels(fontHeight * 2), () => this.title_Start(universe)).hasBorderSet(false);
                var controlActionNames = GameFramework.ControlActionNames.Instances();
                var actions = [
                    GameFramework.Action.fromNameAndPerform(controlActionNames.ControlCancel, () => this.title_Start(universe)),
                    GameFramework.Action.fromNameAndPerform(controlActionNames.ControlConfirm, () => this.title_Start(universe))
                ];
                var returnValue = GameFramework.ControlContainer.fromNamePosSizeChildrenAndActions("containerTitle", this._zeroes, this.sizeBase.clone(), 
                // children
                [
                    imageTitle,
                    buttonStart
                ], actions);
                returnValue.scalePosAndSize(scaleMultiplier);
                return returnValue;
            }
            title_Start(universe) {
                var venueNext;
                if (this.profileMenusAreIncluded) {
                    var venueMessage = GameFramework.VenueMessage.fromTextNoButtons("Loading profiles...");
                    venueNext = GameFramework.VenueTask.fromVenueInnerPerformAndDone(venueMessage, () => GameFramework.Profile.toControlProfileSelect(universe, null, universe.venueCurrent()), (result) => // done
                     {
                        var venueProfileSelect = result.toVenue();
                        universe.venueTransitionTo(venueProfileSelect);
                    });
                }
                else {
                    venueNext = universe.worldCreator.venueWorldGenerate(universe);
                }
                universe.venueTransitionTo(venueNext);
            }
            worldDetail(universe, size, venuePrev) {
                if (size == null) {
                    size = universe.display.sizeDefault();
                }
                var sizeBase = this.sizeBase;
                var scaleMultiplier = this._scaleMultiplier.overwriteWith(size).divide(sizeBase);
                var font = this.fontBase;
                var world = universe.world;
                var dateCreated = world.dateCreated;
                var dateSaved = world.dateSaved;
                var labelProfileName = GameFramework.ControlLabel.fromPosSizeTextFontCenteredHorizontally(GameFramework.Coords.fromXY(0, 40), // pos
                GameFramework.Coords.fromXY(sizeBase.x, 20), // size
                GameFramework.DataBinding.fromContext("Profile: " + universe.profile.name), font);
                var labelWorldName = GameFramework.ControlLabel.fromPosSizeTextFontCenteredHorizontally(GameFramework.Coords.fromXY(0, 55), // pos
                GameFramework.Coords.fromXY(sizeBase.x, 25), // size
                GameFramework.DataBinding.fromContext("World: " + world.name), font);
                var labelStartDate = GameFramework.ControlLabel.fromPosSizeTextFontCenteredHorizontally(GameFramework.Coords.fromXY(0, 70), // pos
                GameFramework.Coords.fromXY(sizeBase.x, 25), // size
                GameFramework.DataBinding.fromContext("Started: " + dateCreated.toStringTimestamp()), font);
                var labelSavedDate = GameFramework.ControlLabel.fromPosSizeTextFontCenteredHorizontally(GameFramework.Coords.fromXY(0, 85), // pos
                GameFramework.Coords.fromXY(sizeBase.x, 25), // size
                GameFramework.DataBinding.fromContext("Saved: "
                    + (dateSaved == null ? "[never]" : dateSaved.toStringTimestamp())), font);
                var buttonStart = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(50, 100), // pos
                GameFramework.Coords.fromXY(100, this.buttonHeightBase), // size
                "Start", font, () => this.worldDetail_Start(universe, size));
                var buttonBack = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(10, 10), // pos
                GameFramework.Coords.fromXY(15, 15), // size
                "<", font, () => // click
                 {
                    universe.venueTransitionTo(venuePrev);
                });
                var buttonDelete = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(180, 10), // pos
                GameFramework.Coords.fromXY(15, 15), // size
                "x", font, () => this.worldDetail_DeleteSaveStateSelected(universe, size));
                var returnValue = GameFramework.ControlContainer.fromNamePosSizeAndChildren("containerWorldDetail", this._zeroes, // pos
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
            worldDetail_DeleteSaveStateSelected(universe, size) {
                var saveState = universe.profile.saveStateSelected();
                var controlConfirm = universe.controlBuilder.confirmAndReturnToVenue(universe, size, "Delete save \""
                    + saveState.name
                    + "\"?", universe.venueCurrent(), () => this.worldDetail_DeleteSaveStateSelected_Confirm(universe, saveState), null // cancel
                );
                var venueNext = controlConfirm.toVenue();
                universe.venueTransitionTo(venueNext);
            }
            worldDetail_DeleteSaveStateSelected_Confirm(universe, saveState) {
                var storageHelper = universe.storageHelper;
                var profile = universe.profile;
                var saveStates = profile.saveStates;
                GameFramework.ArrayHelper.remove(saveStates, saveState);
                storageHelper.save(profile.name, profile);
                universe.worldSet(null);
                storageHelper.delete(saveState.name);
            }
            worldDetail_Start(universe, size) {
                var world = universe.world;
                var venueWorld = world.toVenue();
                var venueNext;
                if (world.dateSaved != null) {
                    venueNext = venueWorld;
                }
                else {
                    var textInstructions = universe.mediaLibrary.textStringGetByName("Instructions");
                    var instructions = textInstructions.value;
                    var controlInstructions = universe.controlBuilder.message4(universe, size, GameFramework.DataBinding.fromContext(instructions), () => // acknowledge
                     {
                        universe.venueTransitionTo(venueWorld);
                    });
                    var venueInstructions = controlInstructions.toVenue();
                    var venueMovie = GameFramework.VenueVideo.fromVideoNameAndVenueNext("Movie", // videoName
                    venueInstructions // fader implicit
                    );
                    venueNext = venueMovie;
                }
                universe.venueTransitionTo(venueNext);
            }
            worldLoad(universe, size) {
                if (size == null) {
                    size = universe.display.sizeDefault();
                }
                var scaleMultiplier = this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);
                var font = this.fontBase;
                var labelProfileName = GameFramework.ControlLabel.fromPosSizeTextFontCenteredHorizontally(GameFramework.Coords.fromXY(100, 25), // pos
                GameFramework.Coords.fromXY(120, 25), // size
                GameFramework.DataBinding.fromContext("Profile: " + universe.profile.name), font);
                var labelSelectASave = GameFramework.ControlLabel.fromPosSizeTextFontCenteredHorizontally(GameFramework.Coords.fromXY(100, 40), // pos
                GameFramework.Coords.fromXY(100, 25), // size
                GameFramework.DataBinding.fromContext("Select a Save:"), font);
                var listSaveStates = GameFramework.ControlList.fromNamePosSizeItemsTextFontSelectedValue("listSaveStates", GameFramework.Coords.fromXY(30, 50), // pos
                GameFramework.Coords.fromXY(140, 50), // size
                GameFramework.DataBinding.fromContextAndGet(universe.profile, (c) => c.saveStates), // items
                GameFramework.DataBinding.fromGet((c) => c.name), // bindingForOptionText
                font, GameFramework.DataBinding.fromContextGetAndSet(universe.profile, (c) => c.saveStateSelected(), (c, v) => c.saveStateNameSelected = v.name), // bindingForOptionSelected
                GameFramework.DataBinding.fromGet((v) => v.name));
                var buttonLoadFromServer = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(30, 105), // pos
                GameFramework.Coords.fromXY(40, this.buttonHeightBase), // size
                "Load", font, () => this.worldLoad_LoadFromServer(universe, size));
                var venueFileUpload = GameFramework.VenueFileUpload.create();
                var buttonLoadFromFile = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(80, 105), // pos
                GameFramework.Coords.fromXY(40, this.buttonHeightBase), // size
                "Load File", font, () => this.worldLoad_LoadFile(universe, size, venueFileUpload));
                var buttonReturn = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(130, 105), // pos
                GameFramework.Coords.fromXY(40, this.buttonHeightBase), // size
                "Return", font, () => this.worldLoad_Return(universe, size));
                var returnValue = GameFramework.ControlContainer.fromNamePosSizeAndChildren("containerWorldLoad", this._zeroes, // pos
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
            worldLoad_Cancel(universe) {
                var venueNext = universe.controlBuilder.worldLoad(universe, null).toVenue();
                universe.venueTransitionTo(venueNext);
            }
            worldLoad_Confirm(universe) {
                var storageHelper = universe.storageHelper;
                var messageAsDataBinding = GameFramework.DataBinding.fromContextAndGet(null, // Will be set below.
                (c) => "Loading game...");
                var venueMessage = GameFramework.VenueMessage.fromMessage(messageAsDataBinding);
                var venueTask = GameFramework.VenueTask.fromVenueInnerPerformAndDone(venueMessage, () => // perform
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
            }
            ;
            worldLoad_LoadFile(universe, size, venueFileUpload) {
                var controlMessageReadyToLoad = universe.controlBuilder.message4(universe, size, GameFramework.DataBinding.fromContext("Ready to load from file..."), () => this.worldLoad_LoadFile_Acknowledge(universe, size, venueFileUpload));
                var venueMessageReadyToLoad = controlMessageReadyToLoad.toVenue();
                var controlMessageCancelled = universe.controlBuilder.message4(universe, size, GameFramework.DataBinding.fromContext("No file specified."), () => // acknowlege
                 {
                    var venueNext = universe.controlBuilder.game(universe, size, universe.venueCurrent()).toVenue();
                    universe.venueTransitionTo(venueNext);
                });
                var venueMessageCancelled = controlMessageCancelled.toVenue();
                venueFileUpload.venueNextIfFileSpecified = venueMessageReadyToLoad;
                venueFileUpload.venueNextIfCancelled = venueMessageCancelled;
                universe.venueTransitionTo(venueFileUpload);
            }
            worldLoad_LoadFile_Acknowledge(universe, size, venueFileUpload) {
                var inputFile = venueFileUpload.toDomElement().getElementsByTagName("input")[0];
                var fileToLoad = inputFile.files[0];
                new GameFramework.FileHelper().loadFileAsBinaryString(fileToLoad, (fileContentsAsString) => this.worldLoad_LoadFile_Acknowledge_Callback(universe, size, fileContentsAsString), null // contextForCallback
                );
            }
            worldLoad_LoadFile_Acknowledge_Callback(universe, size, fileContentsAsString) {
                var worldAsStringCompressed = fileContentsAsString;
                var compressor = universe.storageHelper.compressor;
                var worldSerialized = compressor.decompressString(worldAsStringCompressed);
                var worldCreator = universe.worldCreator;
                var worldBlank = worldCreator.worldCreate(universe, worldCreator);
                var worldDeserialized = worldBlank.fromStringJson(worldSerialized, universe);
                universe.worldSet(worldDeserialized);
                var venueNext = universe.controlBuilder.game(universe, size, universe.venueCurrent()).toVenue();
                universe.venueTransitionTo(venueNext);
            }
            worldLoad_LoadFromServer(universe, size) {
                var controlConfirm = universe.controlBuilder.confirm(universe, size, "Abandon the current game?", () => this.worldLoad_Confirm(universe), () => this.worldLoad_Cancel(universe));
                var venueConfirm = controlConfirm.toVenue();
                universe.venueTransitionTo(venueConfirm);
            }
            worldLoad_Return(universe, size) {
                var venueGame = universe.controlBuilder.game(universe, size, universe.venueCurrent()).toVenue();
                universe.venueTransitionTo(venueGame);
            }
        }
        GameFramework.ControlBuilder = ControlBuilder;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
