"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Playable extends GameFramework.EntityProperty {
            static toControlMenu(universe, size, entity, venuePrev) {
                var controlsForTabs = new Array();
                var fontHeight = 12;
                var labelSize = new GameFramework.Coords(300, fontHeight * 1.25, 0);
                var marginX = fontHeight;
                var timePlayingAsString = universe.world.timePlayingAsStringLong(universe);
                var controlsForStatusFields = [
                    new GameFramework.ControlLabel("labelProfile", new GameFramework.Coords(marginX, labelSize.y, 0), // pos
                    labelSize.clone(), false, // isTextCentered
                    "Profile: " + universe.profile.name, fontHeight),
                    new GameFramework.ControlLabel("labelTimePlaying", new GameFramework.Coords(marginX, labelSize.y * 2, 0), // pos
                    labelSize.clone(), false, // isTextCentered
                    "Time Playing: " + timePlayingAsString, fontHeight)
                ];
                var killable = entity.killable();
                if (killable != null) {
                    var labelHealth = new GameFramework.ControlLabel("labelHealth", new GameFramework.Coords(marginX, labelSize.y * 3, 0), // pos
                    labelSize.clone(), false, // isTextCentered
                    "Health: " + entity.killable().integrity + "/" + entity.killable().integrityMax, fontHeight);
                    controlsForStatusFields.push(labelHealth);
                }
                var tabButtonSize = new GameFramework.Coords(36, 20, 0);
                var tabPageSize = size.clone().subtract(new GameFramework.Coords(0, tabButtonSize.y + fontHeight, 0));
                var includeTitleAndDoneButtonFalse = false;
                var itemHolder = entity.itemHolder();
                if (itemHolder != null) {
                    var itemHolderAsControl = itemHolder.toControl(universe, tabPageSize, entity, venuePrev, includeTitleAndDoneButtonFalse);
                    controlsForTabs.push(itemHolderAsControl);
                }
                var equipmentUser = entity.equipmentUser();
                if (equipmentUser != null) {
                    var equipmentUserAsControl = equipmentUser.toControl(universe, tabPageSize, entity, venuePrev, includeTitleAndDoneButtonFalse);
                    controlsForTabs.push(equipmentUserAsControl);
                }
                var itemCrafter = entity.itemCrafter();
                if (itemCrafter != null) {
                    var crafterAsControl = itemCrafter.toControl(universe, tabPageSize, entity, entity, venuePrev, includeTitleAndDoneButtonFalse);
                    controlsForTabs.push(crafterAsControl);
                }
                var skillLearner = entity.skillLearner();
                if (skillLearner != null) {
                    var skillLearnerAsControl = skillLearner.toControl(universe, tabPageSize, entity, venuePrev, includeTitleAndDoneButtonFalse);
                    controlsForTabs.push(skillLearnerAsControl);
                    var labelExperience = new GameFramework.ControlLabel("labelExperience", new GameFramework.Coords(marginX, labelSize.y * 4, 0), // pos
                    labelSize.clone(), false, // isTextCentered
                    "Experience: " + entity.skillLearner().learningAccumulated, fontHeight);
                    controlsForStatusFields.push(labelExperience);
                }
                var journalKeeper = entity.journalKeeper();
                if (journalKeeper != null) {
                    var journalKeeperAsControl = journalKeeper.toControl(universe, tabPageSize, entity, venuePrev, includeTitleAndDoneButtonFalse);
                    controlsForTabs.push(journalKeeperAsControl);
                }
                var gameAndSettingsMenuAsControl = universe.controlBuilder.gameAndSettings(universe, tabPageSize, universe.venueCurrent, false // includeResumeButton
                );
                controlsForTabs.push(gameAndSettingsMenuAsControl);
                var statusAsControl = GameFramework.ControlContainer.from4("Status", GameFramework.Coords.create(), // pos
                size.clone().addDimensions(0, -32, 0), // size
                // children
                controlsForStatusFields);
                controlsForTabs.splice(0, 0, statusAsControl);
                var back = () => {
                    var venueNext = venuePrev;
                    venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                    universe.venueNext = venueNext;
                };
                var returnValue = new GameFramework.ControlTabbed("tabbedItems", GameFramework.Coords.create(), // pos
                size, tabButtonSize, controlsForTabs, fontHeight, back);
                return returnValue;
            }
            static toControlWorldOverlay(universe, size, entity) {
                var world = universe.world;
                var place = world.placeCurrent;
                var equipmentUser = entity.equipmentUser();
                var childControls = new Array();
                var entityDimension = 10; // todo
                var fontHeightInPixels = 10;
                var margin = 10;
                var worldDefn = world.defn;
                var playerVisualBarSize = new GameFramework.Coords(entityDimension * 4, entityDimension, 0);
                var killable = entity.killable();
                var playerVisualHealthBar = new GameFramework.VisualBar(null, // "H", // abbreviation
                playerVisualBarSize, GameFramework.Color.Instances().Red, new GameFramework.DataBinding(null, (c) => killable.integrity, null), null, // amountThreshold
                new GameFramework.DataBinding(null, (c) => killable.integrityMax, null), null, // fractionBelowWhichToShow
                null, // colorForBorderAsValueBreakGroup
                null // text
                );
                var playerVisualHealthIcon = worldDefn.itemDefnByName("Heart").visual;
                var playerVisualHealthBarPlusIcon = new GameFramework.VisualGroup([
                    playerVisualHealthBar,
                    new GameFramework.VisualOffset(playerVisualHealthIcon, new GameFramework.Coords(-playerVisualBarSize.x / 2 - playerVisualBarSize.y, 0, 0))
                ]);
                var starvable = entity.starvable();
                var playerVisualSatietyBar = new GameFramework.VisualBar(null, // "F", // abbreviation
                playerVisualBarSize, GameFramework.Color.Instances().Brown, new GameFramework.DataBinding(null, (c) => starvable.satiety, null), null, // amountThreshold
                new GameFramework.DataBinding(null, (c) => starvable.satietyMax, null), null, // fractionBelowWhichToShow
                null, // colorForBorderAsValueBreakGroup
                null // text
                );
                var playerVisualSatietyIcon = worldDefn.itemDefnByName("Bread").visual;
                var playerVisualSatietyBarPlusIcon = new GameFramework.VisualGroup([
                    playerVisualSatietyBar,
                    new GameFramework.VisualOffset(playerVisualSatietyIcon, new GameFramework.Coords(-playerVisualBarSize.x / 2 - playerVisualBarSize.y, 0, 0))
                ]);
                var tirable = entity.tirable();
                var playerVisualStaminaBar = new GameFramework.VisualBar(null, // "S", // abbreviation
                playerVisualBarSize, GameFramework.Color.Instances().Yellow, new GameFramework.DataBinding(null, (c) => tirable.stamina, null), new GameFramework.DataBinding(null, (c) => tirable.staminaMaxRemainingBeforeSleep, null), new GameFramework.DataBinding(null, (c) => tirable.staminaMaxAfterSleep, null), null, // fractionBelowWhichToShow
                null, // colorForBorderAsValueBreakGroup
                null // text
                );
                var playerVisualStaminaIcon = new GameFramework.VisualImageScaled(new GameFramework.VisualImageFromLibrary("Zap"), new GameFramework.Coords(1, 1, 0).multiplyScalar(playerVisualBarSize.y * 1.5));
                var playerVisualStaminaBarPlusIcon = new GameFramework.VisualGroup([
                    playerVisualStaminaBar,
                    new GameFramework.VisualOffset(playerVisualStaminaIcon, new GameFramework.Coords(-playerVisualBarSize.x / 2 - playerVisualBarSize.y, 0, 0))
                ]);
                var hoursPerDay = 24;
                var minutesPerHour = 60;
                var minutesPerDay = minutesPerHour * hoursPerDay;
                // var gameMinutesPerActualSecond = 1;
                var timerTicksPerGameDay = minutesPerDay * universe.timerHelper.ticksPerSecond;
                var ticksToHH_MM = (ticks) => {
                    var ticksIntoDay = world.timerTicksSoFar % timerTicksPerGameDay;
                    var fractionOfDay = ticksIntoDay / timerTicksPerGameDay;
                    var gameMinutesIntoDay = Math.round(fractionOfDay * minutesPerDay);
                    var gameHoursIntoDay = Math.floor(gameMinutesIntoDay / minutesPerHour);
                    var gameMinutesIntoHour = gameMinutesIntoDay % minutesPerHour;
                    var returnValue = GameFramework.StringHelper.padStart("" + gameHoursIntoDay, 2, "0")
                        + ":"
                        + GameFramework.StringHelper.padStart("" + gameMinutesIntoHour, 2, "0");
                    return returnValue;
                };
                var playerVisualTimeBar = new GameFramework.VisualBar(null, // "T", // abbreviation
                playerVisualBarSize, GameFramework.Color.Instances().Cyan, new GameFramework.DataBinding(null, (c) => world.timerTicksSoFar % timerTicksPerGameDay, null), null, // threshold
                new GameFramework.DataBinding(null, (c) => timerTicksPerGameDay, null), null, // fractionBelowWhichToShow
                null, // colorForBorderAsValueBreakGroup
                // text
                new GameFramework.DataBinding(world, (c) => ticksToHH_MM(c.timerTicksSoFar), null));
                var playerVisualTimeIcon = GameFramework.VisualBuilder.Instance().sun(playerVisualBarSize.y * .5);
                var playerVisualTimeBarPlusIcon = new GameFramework.VisualGroup([
                    playerVisualTimeBar,
                    new GameFramework.VisualOffset(playerVisualTimeIcon, new GameFramework.Coords(-playerVisualBarSize.x / 2 - playerVisualBarSize.y, 0, 0))
                ]);
                var childSpacing = new GameFramework.Coords(0, playerVisualBarSize.y * 2, 0);
                var playerVisualStatusInfo = new GameFramework.VisualGroup([
                    playerVisualHealthBarPlusIcon,
                    new GameFramework.VisualOffset(playerVisualSatietyBarPlusIcon, childSpacing),
                    new GameFramework.VisualOffset(playerVisualStaminaBarPlusIcon, childSpacing.clone().double()),
                    new GameFramework.VisualOffset(playerVisualTimeBarPlusIcon, childSpacing.clone().multiplyScalar(3))
                ]);
                var controlPlayerStatusInfo = GameFramework.ControlVisual.from4("visualPlayerStatusInfo", new GameFramework.Coords(5, 2, 0).multiplyScalar(playerVisualBarSize.y), // pos
                GameFramework.Coords.create(), // size
                GameFramework.DataBinding.fromContext(playerVisualStatusInfo));
                childControls.push(controlPlayerStatusInfo);
                // Selection.
                var selector = entity.selector();
                var controlSelectionSize = new GameFramework.Coords(playerVisualBarSize.x * 1.5, margin * 3, 0);
                var controlSelectionPos = new GameFramework.Coords(size.x - controlSelectionSize.x - margin, margin, 0);
                var controlSelection = selector.toControl(controlSelectionSize, controlSelectionPos);
                childControls.push(controlSelection);
                // Quick slots.
                var itemQuickSlotCount = 10;
                var buttonSize = new GameFramework.Coords(25, 25, 0);
                var buttonWidthAll = itemQuickSlotCount * buttonSize.x;
                var buttonMargin = (size.x - buttonWidthAll) / (itemQuickSlotCount + 1);
                var buttonPos = new GameFramework.Coords(buttonMargin, size.y - margin - buttonSize.y, 0);
                var useItemInQuickSlot = (slotNumber) => {
                    equipmentUser.useItemInSocketNumbered(universe, world, place, entity, slotNumber);
                };
                var buttonClicks = [
                    () => useItemInQuickSlot(0),
                    () => useItemInQuickSlot(1),
                    () => useItemInQuickSlot(2),
                    () => useItemInQuickSlot(3),
                    () => useItemInQuickSlot(4),
                    () => useItemInQuickSlot(5),
                    () => useItemInQuickSlot(6),
                    () => useItemInQuickSlot(7),
                    () => useItemInQuickSlot(8),
                    () => useItemInQuickSlot(9),
                ];
                for (var i = 0; i < itemQuickSlotCount; i++) {
                    var buttonText = "\n   " + i;
                    var button = new GameFramework.ControlButton("buttonItemQuickSlot" + i, buttonPos.clone(), buttonSize, buttonText, fontHeightInPixels, false, // hasBorder
                    true, // isEnabled,
                    buttonClicks[i], null, // context
                    false // canBeHeldDown
                    );
                    var visualItemInQuickSlot = GameFramework.ControlVisual.from4("visualItemInQuickSlot", buttonPos.clone(), buttonSize, new GameFramework.DataBinding(i, (c) => {
                        var returnValue = null;
                        var itemEntityEquipped = equipmentUser.itemEntityInSocketWithName("Item" + c);
                        if (itemEntityEquipped != null) {
                            var item = itemEntityEquipped.item();
                            returnValue = item.defn(world).visual;
                        }
                        return returnValue;
                    }, null));
                    childControls.push(visualItemInQuickSlot);
                    childControls.push(button);
                    buttonPos.x += buttonSize.x + buttonMargin;
                }
                var controlOverlayContainer = new GameFramework.ControlContainer("containerPlayer", GameFramework.Coords.create(), // pos,
                universe.display.sizeInPixels.clone(), childControls, null, null);
                var controlOverlayTransparent = new GameFramework.ControlContainerTransparent(controlOverlayContainer);
                controlOverlayTransparent.styleName = GameFramework.ControlStyle.Instances().Dark.name;
                return controlOverlayTransparent;
            }
        }
        GameFramework.Playable = Playable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
