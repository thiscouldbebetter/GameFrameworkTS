"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ConversationRun {
            constructor(defn, quit, entityPlayer, entityTalker, contentsById) {
                this.defn = defn;
                this._quit = quit;
                this.entityPlayer = entityPlayer;
                this.entityTalker = entityTalker;
                this.contentsById = contentsById || new Map();
                var talkNodeStart = this.defn.talkNodes[0];
                this.scopeCurrent = new GameFramework.ConversationScope(null, // parent
                talkNodeStart, 
                // talkNodesForOptions
                []);
                this.talkNodesForTranscript = [];
                this.variablesByName = new Map();
                // Abbreviate for scripts.
                this.p = this.entityPlayer;
                this.t = this.entityTalker;
                this.vars = this.variablesByName;
            }
            // Instance methods.
            disable(talkNodeToDisableName) {
                this.enableOrDisable(talkNodeToDisableName, true);
            }
            enable(talkNodeToActivateName) {
                this.enableOrDisable(talkNodeToActivateName, false);
            }
            enableOrDisable(talkNodeToEnableOrDisableName, isDisabledValueToSet) {
                var conversationDefn = this.defn;
                var talkNodeToSet = conversationDefn.talkNodesByName.get(talkNodeToEnableOrDisableName);
                talkNodeToSet._isDisabled = () => isDisabledValueToSet;
            }
            goto(talkNodeNameNext, universe) {
                // This convenience method is tersely named for use in scripts.
                var scope = this.scopeCurrent;
                var nodeNext = this.defn.talkNodeByName(talkNodeNameNext);
                scope.talkNodeCurrentSet(nodeNext);
                this.talkNodeCurrentExecute(universe);
            }
            initialize(universe) {
                this.next(universe);
            }
            next(universe) {
                var scope = this.scopeCurrent;
                if (this.talkNodeCurrent() == null) {
                    // Do nothing.
                }
                else if (scope.isPromptingForResponse) {
                    var responseSelected = scope.talkNodeForOptionSelected;
                    if (responseSelected != null) {
                        scope.talkNodeForOptionSelected = null;
                        scope.isPromptingForResponse = false;
                        var talkNodePrompt = this.talkNodeCurrent();
                        var shouldClearOptions = talkNodePrompt.content;
                        if (shouldClearOptions) {
                            scope.talkNodesForOptions.length = 0;
                        }
                        var nameOfTalkNodeNext = responseSelected.next;
                        var talkNodeNext = this.defn.talkNodeByName(nameOfTalkNodeNext);
                        scope.talkNodeCurrentSet(talkNodeNext);
                        this.talkNodesForTranscript.push(responseSelected);
                        this.talkNodeCurrentExecute(universe);
                    }
                }
                else {
                    this.talkNodeCurrentExecute(universe);
                }
            }
            nextUntilPrompt(universe) {
                var prompt = GameFramework.TalkNodeDefn.Instances().Prompt.name;
                var quit = GameFramework.TalkNodeDefn.Instances().Quit.name;
                var nodeDefnName = this.talkNodeCurrent().defnName;
                if (nodeDefnName == prompt || this.scopeCurrent.isPromptingForResponse) {
                    this.next(universe);
                }
                var nodeCurrent = this.talkNodeCurrent();
                while (nodeCurrent.defnName != prompt && this.scopeCurrent.isPromptingForResponse == false) {
                    this.next(universe);
                    nodeCurrent = this.talkNodeCurrent();
                    if (nodeCurrent.defnName == quit) {
                        this.next(universe);
                        break;
                    }
                    nodeCurrent = this.talkNodeCurrent();
                }
            }
            nodesByPrefix(nodeNamePrefix) {
                // This convenience method is tersely named for use in scripts.
                var nodesStartingWithPrefix = this.defn.talkNodes.filter(x => x.name.startsWith(nodeNamePrefix));
                return nodesStartingWithPrefix;
            }
            optionSelectByNext(nextToMatch) {
                return this.scopeCurrent.optionSelectByNext(nextToMatch);
            }
            optionSelectNext() {
                return this.scopeCurrent.optionSelectNext();
            }
            optionsAvailable() {
                return this.scopeCurrent.talkNodesForOptions;
            }
            optionsAvailableAsStrings() {
                return this.optionsAvailable().map(x => x.content);
            }
            player() {
                // This convenience method is tersely named for use in scripts.
                return this.entityPlayer;
            }
            quit(universe) {
                var nodeNamedFinalize = this.defn.talkNodes.find(x => x.name == "Finalize");
                if (nodeNamedFinalize != null
                    && nodeNamedFinalize.isEnabled(universe, this)) {
                    this.scopeCurrent.talkNodeCurrentSet(nodeNamedFinalize);
                    this.scopeCurrent.talkNodeAdvance(universe, this);
                    while (this.scopeCurrent.talkNodeCurrent() != null) {
                        this.next(universe);
                    }
                    nodeNamedFinalize.disable();
                }
                this._quit();
            }
            scope() {
                // This convenience method is tersely named for use in scripts.
                return this.scopeCurrent;
            }
            talkNodeAdvance(universe) {
                this.scopeCurrent.talkNodeAdvance(universe, this);
            }
            talkNodeByName(nodeName) {
                return this.defn.talkNodeByName(nodeName);
            }
            talkNodeCurrent() {
                return this.scopeCurrent.talkNodeCurrent();
            }
            talkNodeCurrentExecute(universe) {
                this.scopeCurrent.talkNodeCurrentExecute(universe, this);
            }
            talkNodeCurrentSet(value) {
                this.scopeCurrent.talkNodeCurrentSet(value);
            }
            talkNodeGoToNext(universe) {
                return this.scopeCurrent.talkNodeGoToNext(universe, this);
            }
            talkNodeNext() {
                var nodeCurrent = this.talkNodeCurrent();
                var nodeNextName = nodeCurrent.next;
                var nodeNext = (nodeNextName == null
                    ? this.defn.talkNodes[this.defn.talkNodes.indexOf(nodeCurrent) + 1]
                    : this.talkNodeByName(nodeCurrent.next));
                return nodeNext;
            }
            talkNodePrev() {
                return this.scopeCurrent.talkNodePrev();
            }
            talker() {
                // This convenience method is tersely named for use in scripts.
                return this.entityTalker;
            }
            toVenue(universe) {
                return this.toControl(universe.display.sizeInPixels, universe).toVenue();
            }
            varGet(variableName) {
                // This convenience method is tersely named for use in scripts.
                return this.variableByName(variableName);
            }
            varSet(variableName, variableValue) {
                // This convenience method is tersely named for use in scripts.
                return this.variableSet(variableName, variableValue);
            }
            variableByName(variableName) {
                return this.variablesByName.get(variableName);
            }
            variableLoad(universe, variableName, variableExpression) {
                var scriptText = "( (u, cr) => " + variableExpression + ")";
                var scriptToRun = eval(scriptText);
                var variableValue = scriptToRun(universe, this);
                this.variableSet(variableName, variableValue);
            }
            variableSet(variableName, variableValue) {
                this.variablesByName.set(variableName, variableValue);
            }
            variableStore(universe, variableName, scriptExpression) {
                var variableValue = this.variableByName(variableName).toString();
                var scriptExpressionWithValue = scriptExpression.split("$value").join(variableValue);
                var scriptToRunAsString = "( (u, cr) => { " + scriptExpressionWithValue + "; } )";
                var scriptToRun = eval(scriptToRunAsString);
                scriptToRun(universe, this);
            }
            // controls
            toControl(size, universe) {
                return this.toControl_Layout_Default(size, universe);
            }
            toControl_Layout_Default(size, universe) {
                var fontHeight = 15;
                var marginWidth = 15;
                var marginSize = GameFramework.Coords.fromXY(1, 1).multiplyScalar(marginWidth);
                var buttonHeight = 20;
                var buttonSize = GameFramework.Coords.fromXY(2, 1).multiplyScalar(buttonHeight);
                var containerButtonsMarginSize = marginSize;
                var containerButtonsPos = GameFramework.Coords.fromXY(size.x - marginSize.x * 2 - buttonSize.x, size.y - marginSize.y * 4 - buttonSize.y * 3);
                var portraitSize = GameFramework.Coords.fromXY(4, 4).multiplyScalar(buttonHeight);
                var portraitPos = marginSize.clone();
                var labelSpeakerSize = GameFramework.Coords.fromXY(size.x - marginSize.x * 3 - portraitSize.x, portraitSize.y);
                var labelSpeakerPos = GameFramework.Coords.fromXY(marginSize.x * 2 + portraitSize.x, marginSize.y);
                var listSize = GameFramework.Coords.fromXY(size.x - marginSize.x * 3 - buttonSize.x, size.y - portraitSize.y - marginSize.y * 4);
                var listPos = GameFramework.Coords.fromXY(marginSize.x, marginSize.y * 2 + portraitSize.y + fontHeight);
                var returnValue = this.toControl_WithCoords(size, universe, fontHeight, marginSize, containerButtonsPos, containerButtonsMarginSize, buttonSize, portraitPos, portraitSize, labelSpeakerPos, labelSpeakerSize, false, // labelSpeakerIsCenteredHorizontally
                true, // labelSpeakerIsCenteredVertically
                listPos, listSize);
                return returnValue;
            }
            toControl_Layout_2(size, universe) {
                var fontHeight = 15;
                var marginWidth = 15;
                var marginSize = GameFramework.Coords.fromXY(1, 1).multiplyScalar(marginWidth);
                var portraitSize = GameFramework.Coords.fromXY(1, .44).multiplyScalar(size.x - marginSize.x * 2).round();
                var portraitPos = marginSize.clone();
                var labelSpeakerSize = portraitSize.clone().subtract(marginSize).subtract(marginSize);
                var labelSpeakerPos = portraitPos.clone().add(marginSize);
                var listSize = GameFramework.Coords.fromXY(portraitSize.x, size.y - portraitSize.y - fontHeight - marginSize.y * 3);
                var listPos = GameFramework.Coords.fromXY(marginSize.x, marginSize.y * 2 + portraitSize.y + fontHeight);
                var returnValue = this.toControl_WithCoords(size, universe, fontHeight, marginSize, null, // containerButtonsPos,
                null, // containerButtonsMarginSize,
                null, // buttonSize,
                portraitPos, portraitSize, labelSpeakerPos, labelSpeakerSize, true, // labelSpeakerIsCenteredHorizontally
                false, // labelSpeakerIsCenteredVertically
                listPos, listSize);
                return returnValue;
            }
            toControl_WithCoords(size, universe, fontHeight, marginSize, containerButtonsPos, containerButtonsMarginSize, buttonSize, portraitPos, portraitSize, labelSpeakerPos, labelSpeakerSize, labelSpeakerIsCenteredHorizontally, labelSpeakerIsCenteredVertically, listPos, listSize) {
                var fontHeightShort = fontHeight; // todo
                var conversationRun = this;
                var conversationDefn = conversationRun.defn;
                var next = () => {
                    conversationRun.next(universe);
                };
                var back = () => this.quit(universe);
                var viewLog = () => {
                    var venueCurrent = universe.venueCurrent;
                    var transcriptAsControl = conversationRun.toControlTranscript(size, universe, venueCurrent);
                    var venueNext = transcriptAsControl.toVenue();
                    universe.venueTransitionTo(venueNext);
                };
                var visualPortrait = conversationDefn.visualPortrait;
                if (visualPortrait.constructor.name.startsWith("VisualImage")) {
                    visualPortrait = new GameFramework.VisualImageScaled(visualPortrait, portraitSize);
                }
                var childControls = [
                    GameFramework.ControlButton.from8("buttonNextUnderPortrait", portraitPos, portraitSize, "Next", fontHeight, true, // hasBorder
                    GameFramework.DataBinding.fromTrue(), // isEnabled
                    next // click
                    ),
                    new GameFramework.ControlVisual("visualPortrait", portraitPos, portraitSize, GameFramework.DataBinding.fromContext(visualPortrait), GameFramework.Color.byName("Black"), // colorBackground
                    null // colorBorder
                    ),
                    new GameFramework.ControlLabel("labelSpeaker", labelSpeakerPos, labelSpeakerSize, labelSpeakerIsCenteredHorizontally, labelSpeakerIsCenteredVertically, GameFramework.DataBinding.fromContextAndGet(conversationRun, (c) => c.scopeCurrent.displayTextCurrent()), fontHeight),
                    new GameFramework.ControlLabel("labelResponse", GameFramework.Coords.fromXY(marginSize.x, marginSize.y * 2 + portraitSize.y - fontHeight / 2), size, // size
                    false, // isTextCenteredHorizontally
                    false, // isTextCenteredVertically
                    GameFramework.DataBinding.fromContext("Response:"), fontHeight),
                    GameFramework.ControlList.from10("listResponses", listPos, listSize, 
                    // items
                    GameFramework.DataBinding.fromContextAndGet(conversationRun, (c) => c.scopeCurrent.talkNodesForOptionsActive(universe, c)), 
                    // bindingForItemText
                    GameFramework.DataBinding.fromGet((c) => c.content), fontHeightShort, new GameFramework.DataBinding(conversationRun, (c) => c.scopeCurrent.talkNodeForOptionSelected, (c, v) => c.scopeCurrent.talkNodeForOptionSelected = v), // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c.name), // bindingForItemValue
                    GameFramework.DataBinding.fromTrue(), // isEnabled
                    (universe) => // confirm
                     {
                        next();
                    })
                ]; // children
                if (containerButtonsPos != null) {
                    var buttonNext = GameFramework.ControlButton.from8("buttonNext", GameFramework.Coords.fromXY(containerButtonsMarginSize.x, containerButtonsMarginSize.y), buttonSize.clone(), "Next", fontHeight, true, // hasBorder
                    GameFramework.DataBinding.fromTrue(), // isEnabled
                    next // click
                    );
                    var buttonTranscript = GameFramework.ControlButton.from8("buttonTranscript", GameFramework.Coords.fromXY(containerButtonsMarginSize.x, containerButtonsMarginSize.y * 2 + buttonSize.y), buttonSize.clone(), "Log", fontHeight, true, // hasBorder
                    GameFramework.DataBinding.fromTrue(), // isEnabled
                    viewLog // click
                    );
                    var buttons = [
                        buttonNext,
                        buttonTranscript
                    ];
                    if (this._quit != null) {
                        var buttonLeave = GameFramework.ControlButton.from8("buttonLeave", GameFramework.Coords.fromXY(containerButtonsMarginSize.x, containerButtonsMarginSize.y * 3 + buttonSize.y * 2), buttonSize.clone(), "Leave", fontHeight, true, // hasBorder
                        GameFramework.DataBinding.fromTrue(), // isEnabled
                        back // click
                        );
                        buttons.push(buttonLeave);
                    }
                    var containerButtonsSize = GameFramework.Coords.fromXY(buttonSize.x, buttonSize.y * (buttons.length) + marginSize.y * (buttons.length + 1));
                    var containerButtonsInner = GameFramework.ControlContainer.from4("containerButtons", containerButtonsPos, containerButtonsSize, 
                    // children
                    buttons);
                    containerButtonsInner.childrenLayOutWithSpacingVertically(marginSize);
                    var containerButtons = containerButtonsInner.toControlContainerTransparent();
                    childControls.push(containerButtons);
                }
                var returnValue = new GameFramework.ControlContainer("containerConversation", GameFramework.Coords.create(), // pos
                size, childControls, [
                    new GameFramework.Action("Back", back),
                    new GameFramework.Action("ViewLog", viewLog)
                ], [
                    new GameFramework.ActionToInputsMapping("Back", [GameFramework.Input.Names().Escape], true),
                    new GameFramework.ActionToInputsMapping("ViewLog", [GameFramework.Input.Names().Space], true)
                ]);
                returnValue.focusGain();
                return returnValue;
            }
            toControlTranscript(size, universe, venueToReturnTo) {
                var conversationRun = this;
                venueToReturnTo = universe.venueCurrent;
                var fontHeight = 20;
                var fontHeightShort = fontHeight * .6;
                var marginWidth = 25;
                var labelHeight = fontHeight;
                var buttonHeight = 25;
                var marginSize = GameFramework.Coords.fromXY(1, 1).multiplyScalar(marginWidth);
                var listSize = GameFramework.Coords.fromXY(size.x * .75, size.y - labelHeight - marginSize.y * 3);
                var returnValue = GameFramework.ControlContainer.from4("containerConversation", GameFramework.Coords.create(), // pos
                size, 
                // children
                [
                    new GameFramework.ControlLabel("labelTranscript", GameFramework.Coords.fromXY(0, marginSize.y), // pos
                    GameFramework.Coords.fromXY(size.x, fontHeight), // size
                    true, // isTextCenteredHorizontally
                    false, // isTextCenteredVertically
                    GameFramework.DataBinding.fromContext("Transcript"), fontHeight),
                    GameFramework.ControlButton.from8("buttonBack", marginSize, // pos
                    GameFramework.Coords.fromXY(1, 1).multiplyScalar(buttonHeight), // size
                    "<", fontHeight, true, // hasBorder
                    GameFramework.DataBinding.fromTrue(), // isEnabled
                    () => // click
                     {
                        universe.venueTransitionTo(venueToReturnTo);
                    }),
                    GameFramework.ControlList.from6("listEntries", GameFramework.Coords.fromXY((size.x - listSize.x) / 2, marginSize.y * 2 + labelHeight), listSize, 
                    // items
                    GameFramework.DataBinding.fromContextAndGet(conversationRun, (c) => c.talkNodesForTranscript), GameFramework.DataBinding.fromGet((c) => c.textForTranscript(conversationRun)), // bindingForItemText
                    fontHeightShort),
                ]);
                return returnValue;
            }
        }
        GameFramework.ConversationRun = ConversationRun;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
