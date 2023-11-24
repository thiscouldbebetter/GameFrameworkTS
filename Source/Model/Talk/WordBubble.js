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
                    var venue = universe.venueCurrent(); // ?
                    universe.venueNextSet(venue.children[0]);
                }
            }
            // Controllable.
            toControl(universe) {
                var size = universe.display.sizeInPixels;
                var sizeBase = size.clone();
                var margin = 8;
                var marginSize = GameFramework.Coords.fromXY(1, 1).multiplyScalar(margin);
                var containerSize = GameFramework.Coords.fromXY(sizeBase.x - margin * 2, (sizeBase.y - margin * 4) / 3);
                var portraitSize = GameFramework.Coords.fromXY(1, 1).multiplyScalar(containerSize.y - margin * 2);
                var wordPaneSize = GameFramework.Coords.fromXY(containerSize.x - portraitSize.x - margin * 3, portraitSize.y);
                var fontHeight = margin;
                var font = GameFramework.FontNameAndHeight.fromHeightInPixels(fontHeight);
                var buttonSize = GameFramework.Coords.fromXY(3, 1.2).multiplyScalar(fontHeight);
                var wordBubble = this;
                var containerWordBubble = GameFramework.ControlContainer.from4("containerWordBubble", GameFramework.Coords.fromXY(margin, sizeBase.y - margin - containerSize.y), // pos
                containerSize, 
                // children
                [
                    new GameFramework.ControlVisual("visualPortrait", marginSize, portraitSize, // size
                    GameFramework.DataBinding.fromContext(this.visualForPortrait), GameFramework.Color.byName("Black"), // colorBackground
                    null // colorBorder
                    ),
                    new GameFramework.ControlLabel("labelSlideText", GameFramework.Coords.fromXY(portraitSize.x + margin, 0).add(marginSize), wordPaneSize, // size
                    false, // isTextCenteredHorizontally
                    false, // isTextCenteredVertically
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => c.statementCurrent()), font),
                    GameFramework.ControlButton.from8("buttonNext", GameFramework.Coords.fromXY(containerSize.x - marginSize.x - buttonSize.x, containerSize.y - marginSize.y - buttonSize.y), buttonSize, "Next", font, true, // hasBorder
                    GameFramework.DataBinding.fromTrue(), // isEnabled
                    () => wordBubble.statementAdvance(universe))
                ]);
                return containerWordBubble;
            }
        }
        GameFramework.WordBubble = WordBubble;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
