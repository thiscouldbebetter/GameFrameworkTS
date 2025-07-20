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
                this._entity = GameFramework.Entity.fromNameAndProperties(this.name, [
                    new GameFramework.Audible(),
                    GameFramework.Locatable.fromPos(this._drawPos),
                    GameFramework.Drawable.fromVisual(new GameFramework.VisualNone())
                ]);
                this._entityPosToRestore = GameFramework.Coords.create();
                this._sizeHalf = GameFramework.Coords.create();
            }
            static fromNamePosSizeAndVisual(name, pos, size, visual) {
                return new ControlVisual(name, pos, size, visual, null, null);
            }
            static fromNamePosSizeVisualAndColorBackground(name, pos, size, visual, colorBackground) {
                return new ControlVisual(name, pos, size, visual, colorBackground, null);
            }
            static fromPosAndVisual(pos, visual) {
                return new ControlVisual(null, pos, null, visual, null, null);
            }
            static fromPosSizeAndVisual(pos, size, visual) {
                return new ControlVisual(null, pos, size, visual, null, null);
            }
            actionHandle(actionName, universe) {
                return false;
            }
            finalize(universe) {
                // todo - Implement Visual.finalize().
                /*
                var visualToDraw = this.visual.get();
                visualToDraw.finalize(UniverseWorldPlaceEntities.fromUniverse(universe) );
                */
            }
            initialize(universe) {
                var visualToDraw = this.visual.get();
                visualToDraw.initialize(GameFramework.UniverseWorldPlaceEntities.fromUniverse(universe));
            }
            initializeIsComplete(universe) {
                var visualToDraw = this.visual.get();
                var visualToDrawIsLoaded = visualToDraw.initializeIsComplete(GameFramework.UniverseWorldPlaceEntities.fromUniverse(universe));
                return visualToDrawIsLoaded;
            }
            isEnabled() {
                return false;
            }
            mouseClick(x) {
                return false;
            }
            scalePosAndSize(scaleFactors) {
                return super.scalePosAndSize(scaleFactors);
            }
            // drawable
            draw(universe, display, drawLoc, style) {
                var visualToDraw = this.visual.get();
                if (visualToDraw != null) {
                    var drawPos = this._drawPos
                        .overwriteWith(drawLoc.pos)
                        .add(this.pos);
                    if (this.size != null) {
                        var style = style || this.style(universe);
                        var colorFill = this.colorBackground || GameFramework.Color.Instances()._Transparent;
                        var colorBorder = this.colorBorder || style.colorBorder();
                        display.drawRectangle(drawPos, this.size, colorFill, colorBorder);
                        this._sizeHalf
                            .overwriteWith(this.size)
                            .half();
                        drawPos.add(this._sizeHalf);
                    }
                    var entity = this._entity;
                    var entityPos = GameFramework.Locatable.of(entity).loc.pos;
                    this._entityPosToRestore.overwriteWith(entityPos);
                    entityPos.overwriteWith(drawPos);
                    var world = universe.world;
                    var place = (world == null ? null : world.placeCurrent);
                    var uwpe = new GameFramework.UniverseWorldPlaceEntities(universe, world, place, entity, null);
                    visualToDraw.draw(uwpe, display);
                    entityPos.overwriteWith(this._entityPosToRestore);
                }
            }
        }
        GameFramework.ControlVisual = ControlVisual;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
