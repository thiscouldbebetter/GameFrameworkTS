"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class WorldCreator {
            constructor(worldCreate, toControl, settings) {
                this.worldCreate = worldCreate;
                this.toControl = toControl;
                this.settings = settings || {};
            }
            static fromWorldCreate(worldCreate) {
                return new WorldCreator(worldCreate, null, null);
            }
            static toControlDemo(universe, worldCreator) {
                var size = universe.display.sizeInPixels;
                var margin = 8;
                var fontNameAndHeight = GameFramework.FontNameAndHeight.default();
                var fontHeightInPixels = fontNameAndHeight.heightInPixels;
                var controlHeight = fontHeightInPixels + margin;
                var buttonSize = GameFramework.Coords.fromXY(4, 1).multiplyScalar(controlHeight);
                var labelWorldCreationSettings = GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(margin, margin), // pos
                GameFramework.Coords.fromXY(size.x - margin * 2, controlHeight), GameFramework.DataBinding.fromContext("World Creation Settings"), fontNameAndHeight);
                var labelWorldName = GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(margin, margin * 2 + controlHeight), // pos
                GameFramework.Coords.fromXY(size.x - margin * 2, controlHeight), GameFramework.DataBinding.fromContext("World Name:"), fontNameAndHeight);
                var textWorldName = new GameFramework.ControlTextBox("textBoxWorldName", GameFramework.Coords.fromXY(margin * 8, margin * 2 + controlHeight), // pos
                GameFramework.Coords.fromXY(margin * 12, controlHeight), // size
                new GameFramework.DataBinding(worldCreator, (c) => c.settings.name || "", (c, v) => c.settings.name = v), // text
                fontNameAndHeight, 64, // charCountMax
                GameFramework.DataBinding.fromTrue() // isEnabled
                );
                var buttonCreate = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(size.x - margin - buttonSize.x, size.y - margin - buttonSize.y), buttonSize, "Create", fontNameAndHeight, () => universe.venueTransitionTo(worldCreator.venueWorldGenerate(universe)));
                var returnControl = GameFramework.ControlContainer.fromNamePosSizeAndChildren("containerWorldCreator", GameFramework.Coords.zeroes(), // pos
                size, [
                    labelWorldCreationSettings,
                    labelWorldName,
                    textWorldName,
                    buttonCreate
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
                var message = "Generating world...";
                var venueMessage = GameFramework.VenueMessage.fromTextNoButtons(message);
                var venueTask = GameFramework.VenueTask.fromVenueInnerPerformAndDone(venueMessage, () => this.venueWorldGenerate_Perform(universe), worldGenerated => this.venueWorldGenerate_Perform_Done(universe, worldGenerated));
                var returnValue = universe.controlBuilder.venueTransitionalFromTo(universe.venueCurrent(), venueTask);
                return returnValue;
            }
            venueWorldGenerate_Perform(universe) {
                var worldCreator = universe.worldCreator;
                return worldCreator.worldCreate(universe, worldCreator);
            }
            venueWorldGenerate_Perform_Done(universe, world) {
                universe.worldSet(world);
                var venueNext = universe.world.toVenue();
                universe.venueTransitionTo(venueNext);
            }
        }
        GameFramework.WorldCreator = WorldCreator;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
