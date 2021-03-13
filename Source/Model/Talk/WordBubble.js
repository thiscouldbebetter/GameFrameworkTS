"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
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
                var marginSize = new GameFramework.Coords(1, 1, 0).multiplyScalar(margin);
                var containerSize = new GameFramework.Coords(sizeBase.x - margin * 2, (sizeBase.y - margin * 4) / 3, 0);
                var portraitSize = new GameFramework.Coords(1, 1, 0).multiplyScalar(containerSize.y - margin * 2);
                var wordPaneSize = new GameFramework.Coords(containerSize.x - portraitSize.x - margin * 3, portraitSize.y, 0);
                var fontHeight = margin;
                var buttonSize = new GameFramework.Coords(3, 1.2, 0).multiplyScalar(fontHeight);
                var wordBubble = this;
                var containerWordBubble = new GameFramework.ControlContainer("containerWordBubble", new GameFramework.Coords(margin, sizeBase.y - margin - containerSize.y, 0), // pos
                containerSize, 
                // children
                [
                    new GameFramework.ControlVisual("visualPortrait", marginSize, portraitSize, // size
                    GameFramework.DataBinding.fromContext(this.visualForPortrait), GameFramework.Color.byName("Black"), // colorBackground
                    null // colorBorder
                    ),
                    new GameFramework.ControlLabel("labelSlideText", new GameFramework.Coords(portraitSize.x + margin, 0, 0).add(marginSize), wordPaneSize, // size
                    false, // isTextCentered,
                    new GameFramework.DataBinding(this, (c) => c.statementCurrent(), null), fontHeight),
                    new GameFramework.ControlButton("buttonNext", new GameFramework.Coords(containerSize.x - marginSize.x - buttonSize.x, containerSize.y - marginSize.y - buttonSize.y, 0), buttonSize, "Next", fontHeight, true, // hasBorder
                    true, // isEnabled
                    () => wordBubble.statementAdvance(universe), null, null)
                ], null, null);
                return containerWordBubble;
            }
        }
        GameFramework.WordBubble = WordBubble;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
