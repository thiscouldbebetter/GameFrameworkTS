"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class WorldCreator {
            constructor(worldCreate, toControl, settings) {
                this.worldCreate = worldCreate;
                this.toControl = toControl;
                this.settings = settings;
            }
            static fromWorldCreate(worldCreate) {
                return new WorldCreator(worldCreate, null, null);
            }
            static toControlDemo(universe, worldCreator) {
                var size = universe.display.sizeInPixels;
                var margin = 8;
                var fontHeightInPixels = 10;
                var controlHeight = fontHeightInPixels + margin;
                var buttonSize = GameFramework.Coords.fromXY(4, 1).multiplyScalar(controlHeight);
                var returnControl = GameFramework.ControlContainer.from4("containerWorldCreator", GameFramework.Coords.zeroes(), // pos
                size, [
                    new GameFramework.ControlLabel("labelWorldCreationSettings", GameFramework.Coords.fromXY(margin, margin), // pos
                    GameFramework.Coords.fromXY(size.x - margin * 2, controlHeight), false, // isTextCentered
                    GameFramework.DataBinding.fromContext("World Creation Settings"), fontHeightInPixels),
                    new GameFramework.ControlLabel("labelWorldName", GameFramework.Coords.fromXY(margin, margin * 2 + controlHeight), // pos
                    GameFramework.Coords.fromXY(size.x - margin * 2, controlHeight), false, // isTextCentered
                    GameFramework.DataBinding.fromContext("World Name:"), fontHeightInPixels),
                    new GameFramework.ControlTextBox("textBoxWorldName", GameFramework.Coords.fromXY(margin * 8, margin * 2 + controlHeight), // pos
                    GameFramework.Coords.fromXY(margin * 12, controlHeight), // size
                    new GameFramework.DataBinding(worldCreator, (c) => c.settings.name || "", (c, v) => c.settings.name = v), // text
                    fontHeightInPixels, 64, // charCountMax
                    GameFramework.DataBinding.fromTrue() // isEnabled
                    ),
                    new GameFramework.ControlButton("buttonCreate", GameFramework.Coords.fromXY(size.x - margin - buttonSize.x, size.y - margin - buttonSize.y), buttonSize, "Create", fontHeightInPixels, true, // hasBorder
                    GameFramework.DataBinding.fromTrue(), // isEnabled
                    () => universe.venueTransitionTo(worldCreator.venueWorldGenerate(universe)), false // canBeHeldDown
                    )
                ]);
                return returnControl;
            }
            // Instance methods.
            toVenue(universe) {
                var returnVenue;
                if (this.toControl == null) {
                    returnVenue = this.venueWorldGenerate(universe);
                }
                else {
                    var controlRoot = this.toControl(universe, this);
                    returnVenue = controlRoot.toVenue();
                }
                return returnVenue;
            }
            venueWorldGenerate(universe) {
                var messageAsDataBinding = GameFramework.DataBinding.fromGet((c) => "Generating world...");
                var venueMessage = GameFramework.VenueMessage.fromMessage(messageAsDataBinding);
                var venueTask = new GameFramework.VenueTask(venueMessage, () => universe.worldCreator.worldCreate(universe, universe.worldCreator), // perform
                (world) => // done
                 {
                    universe.world = world;
                    var venueNext = universe.world.toVenue();
                    universe.venueTransitionTo(venueNext);
                });
                messageAsDataBinding.contextSet(venueTask);
                var returnValue = universe.controlBuilder.venueTransitionalFromTo(universe.venueCurrent, venueTask);
                return returnValue;
            }
        }
        GameFramework.WorldCreator = WorldCreator;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));