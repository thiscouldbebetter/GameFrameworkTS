"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VenueLayered {
            constructor(children, colorToOverlayBetweenChildren) {
                this.children = children;
                this.colorToOverlayBetweenChildren = colorToOverlayBetweenChildren;
            }
            finalize(universe) { }
            finalizeIsComplete() { return true; }
            initialize(universe) {
                for (var i = 0; i < this.children.length; i++) {
                    var child = this.children[i];
                    if (child.initialize != null) {
                        child.initialize(universe);
                    }
                }
            }
            initializeIsComplete(universe) {
                var childrenAreInitialized = this.children.some(x => x.initializeIsComplete(universe) == false) == false;
                return childrenAreInitialized;
            }
            updateForTimerTick(universe) {
                var childTop = this.children[this.children.length - 1];
                childTop.updateForTimerTick(universe);
            }
            draw(universe) {
                for (var i = 0; i < this.children.length; i++) {
                    var child = this.children[i];
                    child.draw(universe);
                    if (this.colorToOverlayBetweenChildren != null) {
                        var display = universe.display;
                        display.drawRectangle(Coords.Instances().Zeroes, display.sizeInPixels, this.colorToOverlayBetweenChildren, null);
                    }
                }
            }
        }
        GameFramework.VenueLayered = VenueLayered;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
