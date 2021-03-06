"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ConversationRun {
            constructor(defn, quit, entityPlayer, entityTalker) {
                this.defn = defn;
                this.quit = quit;
                this.entityPlayer = entityPlayer;
                this.entityTalker = entityTalker;
                var talkNodeStart = this.defn.talkNodes[0];
                this.scopeCurrent = new GameFramework.ConversationScope(null, // parent
                talkNodeStart, 
                // talkNodesForOptions
                []);
                this.talkNodesForTranscript = [];
                this.variablesByName = new Map();
                this.next(null);
                // Abbreviate for scripts.
                this.p = this.entityPlayer;
                this.t = this.entityTalker;
                this.vars = this.variablesByName;
            }
            // instance methods
            next(universe) {
                var responseSelected = this.scopeCurrent.talkNodeForOptionSelected;
                if (responseSelected != null) {
                    var talkNodePrompt = this.scopeCurrent.talkNodeCurrent;
                    talkNodePrompt.activate(this, this.scopeCurrent);
                    responseSelected.activate(this, this.scopeCurrent);
                    this.scopeCurrent.talkNodeForOptionSelected = null;
                }
                this.update(universe);
            }
            update(universe) {
                this.scopeCurrent.update(universe, this);
            }
            variableByName(variableName) {
                return this.variablesByName.get(variableName);
            }
            variableSet(variableName, variableValue) {
                this.variablesByName.set(variableName, variableValue);
            }
            // controls
            toControl(size, universe) {
                var conversationRun = this;
                var conversationDefn = conversationRun.defn;
                var venueToReturnTo = universe.venueCurrent;
                var fontHeight = 15;
                var fontHeightShort = fontHeight; // todo
                var marginWidth = 15;
                var labelHeight = fontHeight;
                var buttonHeight = 20;
                var marginSize = new GameFramework.Coords(1, 1, 0).multiplyScalar(marginWidth);
                var buttonSize = new GameFramework.Coords(2, 1, 0).multiplyScalar(buttonHeight);
                var portraitSize = new GameFramework.Coords(4, 4, 0).multiplyScalar(buttonHeight);
                var listSize = new GameFramework.Coords(size.x - marginSize.x * 3 - buttonSize.x, size.y - portraitSize.y - marginSize.y * 4, 0);
                var next = () => {
                    conversationRun.next(universe);
                };
                var back = () => {
                    var venueNext = venueToReturnTo;
                    venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                    universe.venueNext = venueNext;
                };
                var viewLog = () => {
                    var venueCurrent = universe.venueCurrent;
                    var transcriptAsControl = conversationRun.toControlTranscript(size, universe, venueCurrent);
                    var venueNext = transcriptAsControl.toVenue();
                    venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                    universe.venueNext = venueNext;
                };
                var returnValue = new GameFramework.ControlContainer("containerConversation", GameFramework.Coords.create(), // pos
                size, 
                // children
                [
                    new GameFramework.ControlVisual("visualPortrait", marginSize.clone(), portraitSize, // size
                    GameFramework.DataBinding.fromContext(conversationDefn.visualPortrait), GameFramework.Color.byName("Black"), // colorBackground
                    null // colorBorder
                    ),
                    new GameFramework.ControlLabel("labelSpeaker", new GameFramework.Coords(marginSize.x * 2 + portraitSize.x, marginSize.y + portraitSize.y / 2 - labelHeight / 2, 0), // pos
                    size, // size
                    false, // isTextCentered
                    GameFramework.DataBinding.fromContextAndGet(conversationRun, (c) => c.scopeCurrent.displayTextCurrent), fontHeight),
                    new GameFramework.ControlLabel("labelResponse", new GameFramework.Coords(marginSize.x, marginSize.y * 2 + portraitSize.y - fontHeight / 2, 0), size, // size
                    false, // isTextCentered
                    "Response:", fontHeight),
                    GameFramework.ControlList.from10("listResponses", new GameFramework.Coords(marginSize.x, marginSize.y * 3 + portraitSize.y, 0), listSize, 
                    // items
                    GameFramework.DataBinding.fromContextAndGet(conversationRun, (c) => c.scopeCurrent.talkNodesForOptionsActive()), 
                    // bindingForItemText
                    new GameFramework.DataBinding(null, // context
                    (c) => { return c.text; }, null), fontHeightShort, new GameFramework.DataBinding(conversationRun, (c) => c.scopeCurrent.talkNodeForOptionSelected, (c, v) => c.scopeCurrent.talkNodeForOptionSelected = v), // bindingForItemSelected
                    new GameFramework.DataBinding(null, null, null), // bindingForItemValue
                    GameFramework.DataBinding.fromTrue(), // isEnabled
                    (universe) => // confirm
                     {
                        next();
                    }),
                    GameFramework.ControlButton.from8("buttonNext", GameFramework.Coords.fromXY(size.x - marginSize.x - buttonSize.x, size.y - marginSize.y * 3 - buttonSize.y * 3), buttonSize.clone(), "Next", fontHeight, true, // hasBorder
                    true, // isEnabled
                    next // click
                    ),
                    GameFramework.ControlButton.from8("buttonTranscript", new GameFramework.Coords(size.x - marginSize.x - buttonSize.x, size.y - marginSize.y * 2 - buttonSize.y * 2, 0), buttonSize.clone(), "Log", fontHeight, true, // hasBorder
                    true, // isEnabled
                    viewLog // click
                    ),
                    GameFramework.ControlButton.from8("buttonDone", GameFramework.Coords.fromXY(size.x - marginSize.x - buttonSize.x, size.y - marginSize.y - buttonSize.y), buttonSize.clone(), "Done", fontHeight, true, // hasBorder
                    true, // isEnabled
                    back // click
                    ),
                ], // children
                [
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
                var conversationDefn = conversationRun.defn;
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
                    GameFramework.ControlButton.from8("buttonBack", marginSize, // pos
                    GameFramework.Coords.fromXY(1, 1).multiplyScalar(buttonHeight), // size
                    "<", fontHeight, true, // hasBorder
                    true, // isEnabled
                    (universe) => // click
                     {
                        var venueNext = venueToReturnTo;
                        venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                        universe.venueNext = venueNext;
                    }),
                    new GameFramework.ControlLabel("labelTranscript", GameFramework.Coords.fromXY(size.x / 2, marginSize.y), // pos
                    size, // size
                    true, // isTextCentered
                    "Transcript", fontHeight),
                    GameFramework.ControlList.from6("listEntries", GameFramework.Coords.fromXY((size.x - listSize.x) / 2, marginSize.y * 2 + labelHeight), listSize, 
                    // items
                    GameFramework.DataBinding.fromContextAndGet(conversationRun, (c) => c.talkNodesForTranscript), GameFramework.DataBinding.fromGet((c) => c.textForTranscript(conversationDefn)), // bindingForItemText
                    fontHeightShort),
                ]);
                return returnValue;
            }
        }
        GameFramework.ConversationRun = ConversationRun;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
