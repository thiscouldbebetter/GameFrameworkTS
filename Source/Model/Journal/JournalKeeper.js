"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class JournalKeeper extends GameFramework.EntityProperty {
            constructor(journal) {
                super();
                this.journal = journal;
            }
            // Controls.
            toControl(universe, size, entityJournalKeeper, venuePrev, includeTitleAndDoneButton) {
                var world = universe.world;
                var journalKeeper = entityJournalKeeper.journalKeeper();
                this.statusMessage = "Read and edit journal entries.";
                if (size == null) {
                    size = universe.display.sizeDefault().clone();
                }
                var sizeBase = new GameFramework.Coords(200, 135, 1);
                var fontHeight = 10;
                var fontHeightSmall = fontHeight * .6;
                var fontHeightLarge = fontHeight * 1.5;
                var back = () => {
                    var venueNext = venuePrev;
                    venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                    universe.venueNext = venueNext;
                };
                var buttonSize = new GameFramework.Coords(20, 10, 0);
                var childControls = [
                    new GameFramework.ControlLabel("labelJournalEntries", new GameFramework.Coords(10, 5, 0), // pos
                    new GameFramework.Coords(70, 25, 0), // size
                    false, // isTextCentered
                    "Journal Entries:", fontHeightSmall),
                    new GameFramework.ControlButton("buttonEntryNew", new GameFramework.Coords(65, 5, 0), // pos
                    new GameFramework.Coords(30, 8, 0), // size
                    "New", fontHeightSmall, true, // hasBorder,
                    new GameFramework.DataBinding(this, (c) => true, // todo
                    null), // isEnabled
                    () => {
                        var journal = journalKeeper.journal;
                        var entryNew = new GameFramework.JournalEntry(world.timerTicksSoFar, "-", // title
                        "");
                        journal.entries.push(entryNew);
                    }, // click
                    null, // context
                    false),
                    new GameFramework.ControlList("listEntries", new GameFramework.Coords(10, 15, 0), // pos
                    new GameFramework.Coords(85, 110, 0), // size
                    new GameFramework.DataBinding(this.journal.entries, null, null), // items
                    new GameFramework.DataBinding(null, (c) => c.toString(universe), null), // bindingForItemText
                    fontHeightSmall, new GameFramework.DataBinding(this, (c) => c.journalEntrySelected, (c, v) => {
                        c.journalEntrySelected = v;
                        c.isJournalEntrySelectedEditable = false;
                    }), // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                    GameFramework.DataBinding.fromContext(true), // isEnabled
                    (universe) => // confirm
                     {
                        // todo
                    }, null),
                    new GameFramework.ControlLabel("labelEntrySelected", new GameFramework.Coords(105, 5, 0), // pos
                    new GameFramework.Coords(100, 15, 0), // size
                    false, // isTextCentered
                    "Entry Selected:", fontHeightSmall),
                    new GameFramework.ControlButton("buttonEntrySelectedEdit", new GameFramework.Coords(146, 5, 0), // pos
                    new GameFramework.Coords(15, 8, 0), // size
                    "Lock", fontHeightSmall, true, // hasBorder,
                    new GameFramework.DataBinding(this, (c) => (c.journalEntrySelected != null
                        && c.isJournalEntrySelectedEditable), null), // isEnabled
                    () => {
                        journalKeeper.isJournalEntrySelectedEditable = false;
                    }, // click
                    null, // context
                    false),
                    new GameFramework.ControlButton("buttonEntrySelectedEdit", new GameFramework.Coords(164, 5, 0), // pos
                    new GameFramework.Coords(15, 8, 0), // size
                    "Edit", fontHeightSmall, true, // hasBorder,
                    new GameFramework.DataBinding(this, (c) => (c.journalEntrySelected != null
                        && c.isJournalEntrySelectedEditable == false), null), // isEnabled
                    () => {
                        journalKeeper.isJournalEntrySelectedEditable = true;
                    }, // click
                    null, // context
                    false),
                    new GameFramework.ControlButton("buttonEntrySelectedDelete", new GameFramework.Coords(182, 5, 0), // pos
                    new GameFramework.Coords(8, 8, 0), // size
                    "X", fontHeightSmall, true, // hasBorder,
                    new GameFramework.DataBinding(this, (c) => c.journalEntrySelected != null, // todo
                    null), // isEnabled
                    () => {
                        var controlConfirm = universe.controlBuilder.confirmAndReturnToVenue(universe, universe.display.sizeInPixels, // size
                        "Are you sure you want to delete this entry?", universe.venueCurrent, () => // confirm
                         {
                            var journal = journalKeeper.journal;
                            var entryToDelete = journalKeeper.journalEntrySelected;
                            GameFramework.ArrayHelper.remove(journal.entries, entryToDelete);
                            journalKeeper.journalEntrySelected = null;
                        }, null // cancel
                        );
                        var venueNext = new GameFramework.VenueControls(controlConfirm, false);
                        venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                        universe.venueNext = venueNext;
                    }, // click
                    null, // context
                    false // canBeHeldDown
                    ),
                    new GameFramework.ControlLabel("labelEntrySelectedTimeRecorded", new GameFramework.Coords(105, 15, 0), // pos
                    new GameFramework.Coords(100, 15, 0), // size
                    false, // isTextCentered
                    new GameFramework.DataBinding("Time Recorded:", null, null), fontHeightSmall),
                    new GameFramework.ControlLabel("labelEntrySelectedTimeRecorded", new GameFramework.Coords(145, 15, 0), // pos
                    new GameFramework.Coords(100, 15, 0), // size
                    false, // isTextCentered
                    new GameFramework.DataBinding(this, (c) => {
                        var entry = c.journalEntrySelected;
                        return (entry == null ? "-" : entry.timeRecordedAsStringH_M_S(universe));
                    }, null), fontHeightSmall),
                    new GameFramework.ControlTextBox("textTitle", new GameFramework.Coords(105, 25, 0), // pos
                    new GameFramework.Coords(85, 10, 0), // size
                    new GameFramework.DataBinding(this, (c) => {
                        var j = c.journalEntrySelected;
                        return (j == null ? "" : j.title);
                    }, (c, v) => {
                        var journalEntry = c.journalEntrySelected;
                        if (journalEntry != null) {
                            journalEntry.title = v;
                        }
                    }), // text
                    fontHeightSmall, 32, // charCountMax
                    new GameFramework.DataBinding(this, (c) => (c.journalEntrySelected != null && c.isJournalEntrySelectedEditable), null) // isEnabled
                    ),
                    new GameFramework.ControlTextarea("textareaEntryBody", new GameFramework.Coords(105, 40, 0), // pos
                    new GameFramework.Coords(85, 70, 0), // size
                    new GameFramework.DataBinding(this, (c) => {
                        var j = c.journalEntrySelected;
                        return (j == null ? "" : j.body);
                    }, (c, v) => {
                        var journalEntry = c.journalEntrySelected;
                        if (journalEntry != null) {
                            journalEntry.body = v;
                        }
                    }), // text
                    fontHeightSmall, new GameFramework.DataBinding(this, (c) => {
                        return (c.journalEntrySelected != null && c.isJournalEntrySelectedEditable);
                    }, null) // isEnabled
                    ),
                    new GameFramework.ControlLabel("infoStatus", new GameFramework.Coords(150, 120, 0), // pos
                    new GameFramework.Coords(200, 15, 0), // size
                    true, // isTextCentered
                    new GameFramework.DataBinding(this, (c) => {
                        return c.statusMessage;
                    }, null), // text
                    fontHeightSmall)
                ];
                var returnValue = new GameFramework.ControlContainer("Notes", GameFramework.Coords.blank(), // pos
                sizeBase.clone(), // size
                childControls, [
                    new GameFramework.Action("Back", back),
                ], [
                    new GameFramework.ActionToInputsMapping("Back", [GameFramework.Input.Names().Escape], true),
                ]);
                if (includeTitleAndDoneButton) {
                    childControls.splice(0, // indexToInsertAt
                    0, new GameFramework.ControlLabel("labelTitle", new GameFramework.Coords(100, -5, 0), // pos
                    new GameFramework.Coords(100, 25, 0), // size
                    true, // isTextCentered
                    "Journal", fontHeightLarge));
                    childControls.push(new GameFramework.ControlButton("buttonDone", new GameFramework.Coords(170, 115, 0), // pos
                    buttonSize.clone(), "Done", fontHeightSmall, true, // hasBorder
                    true, // isEnabled
                    back, // click
                    null, null));
                    var titleHeight = new GameFramework.Coords(0, 15, 0);
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
