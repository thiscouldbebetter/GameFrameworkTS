"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class JournalKeeper {
            constructor(journal) {
                this.journal = journal;
            }
            static of(entity) {
                return entity.propertyByName(JournalKeeper.name);
            }
            // Clonable.
            clone() { return this; }
            overwriteWith(other) { return this; }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return JournalKeeper.name; }
            updateForTimerTick(uwpe) { }
            // Equatable
            equals(other) { return false; } // todo
            // Controls.
            toControl(universe, size, entityJournalKeeper, venuePrev, includeTitleAndDoneButton) {
                var world = universe.world;
                var journalKeeper = JournalKeeper.of(entityJournalKeeper);
                this.statusMessage = "Read and edit journal entries.";
                if (size == null) {
                    size = universe.display.sizeDefault().clone();
                }
                var sizeBase = new GameFramework.Coords(200, 135, 1);
                var fontHeight = 10;
                var fontHeightSmall = fontHeight * .6;
                var fontHeightLarge = fontHeight * 1.5;
                var fontSmall = GameFramework.FontNameAndHeight.fromHeightInPixels(fontHeightSmall);
                var fontLarge = GameFramework.FontNameAndHeight.fromHeightInPixels(fontHeightLarge);
                var back = () => universe.venueTransitionTo(venuePrev);
                var buttonSize = GameFramework.Coords.fromXY(20, 10);
                var entrySelectedDelete = () => {
                    var controlConfirm = universe.controlBuilder.confirmAndReturnToVenue(universe, universe.display.sizeInPixels, // size
                    "Are you sure you want to delete this entry?", universe.venueCurrent(), () => // confirm
                     {
                        var journal = journalKeeper.journal;
                        var entryToDelete = journalKeeper.journalEntrySelected;
                        GameFramework.ArrayHelper.remove(journal.entries, entryToDelete);
                        journalKeeper.journalEntrySelected = null;
                    }, null // cancel
                    );
                    var venueNext = controlConfirm.toVenue();
                    universe.venueTransitionTo(venueNext);
                };
                var entrySelectedEdit = () => {
                    journalKeeper.isJournalEntrySelectedEditable = true;
                };
                var entrySelectedLock = () => {
                    journalKeeper.isJournalEntrySelectedEditable = false;
                };
                var childControls = [
                    GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(10, 5), // pos
                    GameFramework.Coords.fromXY(70, 25), // size
                    GameFramework.DataBinding.fromContext("Journal Entries:"), fontSmall),
                    GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(65, 5), // pos
                    GameFramework.Coords.fromXY(30, 8), // size
                    "New", fontSmall, () => {
                        var journal = journalKeeper.journal;
                        var entryNew = new GameFramework.JournalEntry(world.timerTicksSoFar, "-", // title
                        "");
                        journal.entries.push(entryNew);
                    }).isEnabledSet(GameFramework.DataBinding.fromTrueWithContext(this) // Is this necessary?
                    ),
                    new GameFramework.ControlList("listEntries", GameFramework.Coords.fromXY(10, 15), // pos
                    GameFramework.Coords.fromXY(85, 110), // size
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => c.journal.entries), // items
                    GameFramework.DataBinding.fromGet((c) => c.toString(universe)), // bindingForItemText
                    fontSmall, new GameFramework.DataBinding(this, (c) => c.journalEntrySelected, (c, v) => {
                        c.journalEntrySelected = v;
                        c.isJournalEntrySelectedEditable = false;
                    }), // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                    GameFramework.DataBinding.fromTrue(), // isEnabled
                    (universe) => // confirm
                     {
                        // todo
                    }, null),
                    GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(105, 5), // pos
                    GameFramework.Coords.fromXY(100, 15), // size
                    GameFramework.DataBinding.fromContext("Entry Selected:"), fontSmall),
                    GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(146, 5), // pos
                    GameFramework.Coords.fromXY(15, 8), // size
                    "Lock", fontSmall, entrySelectedLock).isEnabledSet(GameFramework.DataBinding.fromContextAndGet(this, (c) => (c.journalEntrySelected != null
                        && c.isJournalEntrySelectedEditable))),
                    GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(164, 5), // pos
                    GameFramework.Coords.fromXY(15, 8), // size
                    "Edit", fontSmall, entrySelectedEdit).isEnabledSet(GameFramework.DataBinding.fromContextAndGet(this, (c) => (c.journalEntrySelected != null
                        && c.isJournalEntrySelectedEditable == false))),
                    GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(182, 5), // pos
                    GameFramework.Coords.fromXY(8, 8), // size
                    "X", fontSmall, entrySelectedDelete).isEnabledSet(GameFramework.DataBinding.fromContextAndGet(this, (c) => (c.journalEntrySelected != null))),
                    GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(105, 15), // pos
                    GameFramework.Coords.fromXY(100, 15), // size
                    GameFramework.DataBinding.fromContext("Time Recorded:"), fontSmall),
                    GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(145, 15), // pos
                    GameFramework.Coords.fromXY(100, 15), // size
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => {
                        var entry = c.journalEntrySelected;
                        return (entry == null ? "-" : entry.timeRecordedAsStringH_M_S(universe));
                    }), fontSmall),
                    new GameFramework.ControlTextBox("textTitle", GameFramework.Coords.fromXY(105, 25), // pos
                    GameFramework.Coords.fromXY(85, 10), // size
                    new GameFramework.DataBinding(this, (c) => {
                        var j = c.journalEntrySelected;
                        return (j == null ? "" : j.title);
                    }, (c, v) => {
                        var journalEntry = c.journalEntrySelected;
                        if (journalEntry != null) {
                            journalEntry.title = v;
                        }
                    }), // text
                    fontSmall, 32, // charCountMax
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => (c.journalEntrySelected != null && c.isJournalEntrySelectedEditable)) // isEnabled
                    ),
                    new GameFramework.ControlTextarea("textareaEntryBody", GameFramework.Coords.fromXY(105, 40), // pos
                    GameFramework.Coords.fromXY(85, 70), // size
                    new GameFramework.DataBinding(this, (c) => {
                        var j = c.journalEntrySelected;
                        return (j == null ? "" : j.body);
                    }, (c, v) => {
                        var journalEntry = c.journalEntrySelected;
                        if (journalEntry != null) {
                            journalEntry.body = v;
                        }
                    }), // text
                    fontSmall, GameFramework.DataBinding.fromContextAndGet(this, (c) => (c.journalEntrySelected != null && c.isJournalEntrySelectedEditable)) // isEnabled
                    ),
                    GameFramework.ControlLabel.fromPosSizeTextFontCenteredHorizontally(GameFramework.Coords.fromXY(150, 120), // pos
                    GameFramework.Coords.fromXY(200, 15), // size
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => {
                        return c.statusMessage;
                    }), // text
                    fontSmall)
                ];
                var returnValue = new GameFramework.ControlContainer("Notes", GameFramework.Coords.create(), // pos
                sizeBase.clone(), // size
                childControls, [
                    new GameFramework.Action("Back", back),
                ], [
                    new GameFramework.ActionToInputsMapping("Back", [GameFramework.Input.Instances().Escape.name], true),
                ]);
                if (includeTitleAndDoneButton) {
                    childControls.splice(0, // indexToInsertAt
                    0, GameFramework.ControlLabel.fromPosSizeTextFontCenteredHorizontally(GameFramework.Coords.fromXY(100, -5), // pos
                    GameFramework.Coords.fromXY(100, 25), // size
                    GameFramework.DataBinding.fromContext("Journal"), fontLarge));
                    childControls.push(GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(170, 115), // pos
                    buttonSize.clone(), "Done", fontSmall, back // click
                    ));
                    var titleHeight = GameFramework.Coords.fromXY(0, 15);
                    sizeBase.add(titleHeight);
                    returnValue.size.add(titleHeight);
                    returnValue.shiftChildPositions(titleHeight);
                }
                var scaleMultiplier = size.clone().divide(sizeBase);
                returnValue.scalePosAndSize(scaleMultiplier);
                return returnValue;
            }
        }
        GameFramework.JournalKeeper = JournalKeeper;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
