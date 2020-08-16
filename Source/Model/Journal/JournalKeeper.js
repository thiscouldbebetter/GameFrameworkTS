"use strict";
class JournalKeeper extends EntityProperty //<JournalKeeper>
 {
    constructor(journal) {
        super();
        this.journal = journal;
    }
    // Controls.
    toControl(universe, size, entityJournalKeeper, venuePrev, includeTitleAndDoneButton) {
        this.statusMessage = "Review journal entries.";
        if (size == null) {
            size = universe.display.sizeDefault().clone();
        }
        var sizeBase = new Coords(200, 135, 1);
        var fontHeight = 10;
        var fontHeightSmall = fontHeight * .6;
        var fontHeightLarge = fontHeight * 1.5;
        var back = () => {
            var venueNext = venuePrev;
            venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
            universe.venueNext = venueNext;
        };
        var buttonSize = new Coords(20, 10, 0);
        var childControls = [
            new ControlLabel("labelJournalEntries", new Coords(10, 5, 0), // pos
            new Coords(70, 25, 0), // size
            false, // isTextCentered
            "Journal Entries:", fontHeightSmall),
            new ControlList("listEntries", new Coords(10, 15, 0), // pos
            new Coords(85, 110, 0), // size
            new DataBinding(this.journal.entries, null, null), // items
            new DataBinding(null, (c) => c.toString(), null), // bindingForItemText
            fontHeightSmall, new DataBinding(this, (c) => c.journalEntrySelected, (c, v) => { c.journalEntrySelected = v; }), // bindingForItemSelected
            DataBinding.fromGet((c) => c), // bindingForItemValue
            DataBinding.fromContext(true), // isEnabled
            (universe) => // confirm
             {
                // todo
            }, null),
            new ControlLabel("labelEntrySelected", new Coords(105, 10, 0), // pos
            new Coords(100, 15, 0), // size
            false, // isTextCentered
            "Entry Selected:", fontHeightSmall),
            new ControlLabel("infoEntrySelected", new Coords(105, 20, 0), // pos
            new Coords(200, 15, 0), // size
            false, // isTextCentered
            new DataBinding(this, (c) => {
                var j = c.journalEntrySelected;
                return (j == null ? "-" : j.toString());
            }, null), // text
            fontHeightSmall),
            new ControlTextarea("textareaEntryBody", new Coords(105, 30, 0), // pos
            new Coords(85, 80, 0), // size
            new DataBinding(this, (c) => {
                var j = c.journalEntrySelected;
                return (j == null ? "" : j.body);
            }, null), // text
            fontHeightSmall, new DataBinding(false, null, null) // isEnabled
            ),
            new ControlLabel("infoStatus", new Coords(150, 120, 0), // pos
            new Coords(200, 15, 0), // size
            true, // isTextCentered
            new DataBinding(this, (c) => {
                return c.statusMessage;
            }, null), // text
            fontHeightSmall)
        ];
        var returnValue = new ControlContainer("Journal", new Coords(0, 0, 0), // pos
        sizeBase.clone(), // size
        childControls, [
            new Action("Back", back),
        ], [
            new ActionToInputsMapping("Back", [Input.Names().Escape], true),
        ]);
        if (includeTitleAndDoneButton) {
            childControls.splice(0, // indexToInsertAt
            0, new ControlLabel("labelTitle", new Coords(100, -5, 0), // pos
            new Coords(100, 25, 0), // size
            true, // isTextCentered
            "Journal", fontHeightLarge));
            childControls.push(new ControlButton("buttonDone", new Coords(170, 115, 0), // pos
            buttonSize.clone(), "Done", fontHeightSmall, true, // hasBorder
            true, // isEnabled
            back, // click
            null, null));
            var titleHeight = new Coords(0, 15, 0);
            sizeBase.add(titleHeight);
            returnValue.size.add(titleHeight);
            returnValue.shiftChildPositions(titleHeight);
        }
        var scaleMultiplier = size.clone().divide(sizeBase);
        returnValue.scalePosAndSize(scaleMultiplier);
        return returnValue;
    }
}
