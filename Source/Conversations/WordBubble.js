"use strict";
class WordBubble {
    constructor(visualForPortrait, statements) {
        this.visualForPortrait = visualForPortrait;
        this.statements = statements;
        this.statementIndexCurrent = 0;
    }
    statementCurrent() {
        return this.statements[this.statementIndexCurrent];
    }
    statementAdvance(universe) {
        this.statementIndexCurrent++;
        if (this.statementIndexCurrent >= this.statements.length) {
            var venue = universe.venueCurrent; // ?
            universe.venueNext = venue.children[0];
        }
    }
    // Controllable.
    toControl(universe) {
        var size = universe.display.sizeInPixels;
        var sizeBase = size.clone();
        var margin = 8;
        var marginSize = new Coords(1, 1, 0).multiplyScalar(margin);
        var containerSize = new Coords(sizeBase.x - margin * 2, (sizeBase.y - margin * 4) / 3, 0);
        var portraitSize = new Coords(1, 1, 0).multiplyScalar(containerSize.y - margin * 2);
        var wordPaneSize = new Coords(containerSize.x - portraitSize.x - margin * 3, portraitSize.y, 0);
        var fontHeight = margin;
        var buttonSize = new Coords(3, 1.2, 0).multiplyScalar(fontHeight);
        var wordBubble = this;
        var containerWordBubble = new ControlContainer("containerWordBubble", new Coords(margin, sizeBase.y - margin - containerSize.y, 0), // pos
        containerSize, 
        // children
        [
            new ControlVisual("visualPortrait", marginSize, portraitSize, // size
            this.visualForPortrait, "Black" // colorBackground
            ),
            new ControlLabel("labelSlideText", new Coords(portraitSize.x + margin, 0, 0).add(marginSize), wordPaneSize, // size
            false, // isTextCentered,
            new DataBinding(this, (c) => c.statementCurrent(), null), fontHeight),
            new ControlButton("buttonNext", new Coords(containerSize.x - marginSize.x - buttonSize.x, containerSize.y - marginSize.y - buttonSize.y, 0), buttonSize, "Next", fontHeight, true, // hasBorder
            true, // isEnabled
            () => wordBubble.statementAdvance(universe), null, null)
        ], null, null);
        return containerWordBubble;
    }
}
