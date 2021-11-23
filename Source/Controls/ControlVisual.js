"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ControlVisual extends GameFramework.ControlBase {
            constructor(name, pos, size, visual, colorBackground, colorBorder) {
                super(name, pos, size, null);
                this.visual = visual;
                this.colorBackground = colorBackground;
                this.colorBorder = colorBorder;
                // Helper variables.
                this._drawPos = GameFramework.Coords.create();
                this._entity = new GameFramework.Entity(this.name, [
                    new GameFramework.Audible(),
                    GameFramework.Locatable.fromPos(this._drawPos),
                    GameFramework.Drawable.fromVisual(new GameFramework.VisualNone())
                ]);
                this._sizeHalf = GameFramework.Coords.create();
            }
            static from4(name, pos, size, visual) {
                return new ControlVisual(name, pos, size, visual, null, null);
            }
            static from5(name, pos, size, visual, colorBackground) {
                return new ControlVisual(name, pos, size, visual, colorBackground, null);
            }
            actionHandle(actionName, universe) {
                return false;
            }
            isEnabled() {
                return false;
            }
            mouseClick(x) {
                return false;
            }
            scalePosAndSize(scaleFactors) {
                this.pos.multiply(scaleFactors);
                this.size.multiply(scaleFactors);
                this._sizeHalf.multiply(scaleFactors);
                return this;
            }
            // drawable
            draw(universe, display, drawLoc, style) {
                var visualToDraw = this.visual.get();
                if (visualToDraw != null) {
                    var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
                    var style = style || this.style(universe);
                    var colorFill = this.colorBackground || GameFramework.Color.Instances()._Transparent;
                    var colorBorder = this.colorBorder || style.colorBorder();
                    display.drawRectangle(drawPos, this.size, colorFill, colorBorder);
                    this._sizeHalf.overwriteWith(this.size).half();
                    drawPos.add(this._sizeHalf);
                    var entity = this._entity;
                    entity.locatable().loc.pos.overwriteWith(drawPos);
                    var world = universe.world;
                    var place = (world == null ? null : world.placeCurrent);
                    var uwpe = new GameFramework.UniverseWorldPlaceEntities(universe, world, place, entity, null);
                    visualToDraw.draw(uwpe, display);
                }
            }
        }
        GameFramework.ControlVisual = ControlVisual;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
