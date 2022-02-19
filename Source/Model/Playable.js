"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Playable {
            static toControlMenu(universe, size, entity, venuePrev) {
                var controlsForTabs = new Array();
                var fontHeight = 12;
                var labelSize = GameFramework.Coords.fromXY(300, fontHeight * 1.25);
                var marginX = fontHeight;
                var timePlayingAsString = universe.world.timePlayingAsStringLong(universe);
                var controlsForStatusFields = [
                    new GameFramework.ControlLabel("labelProfile", GameFramework.Coords.fromXY(marginX, labelSize.y), // pos
                    labelSize.clone(), false, // isTextCenteredHorizontally
                    false, // isTextCenteredVertically
                    GameFramework.DataBinding.fromContext("Profile: " + universe.profile.name), fontHeight),
                    new GameFramework.ControlLabel("labelTimePlaying", GameFramework.Coords.fromXY(marginX, labelSize.y * 2), // pos
                    labelSize.clone(), false, // isTextCenteredHorizontally
                    false, // isTextCenteredVertically
                    GameFramework.DataBinding.fromContext("Time Playing: " + timePlayingAsString), fontHeight)
                ];
                var killable = entity.killable();
                if (killable != null) {
                    var labelHealth = new GameFramework.ControlLabel("labelHealth", GameFramework.Coords.fromXY(marginX, labelSize.y * 3), // pos
                    labelSize.clone(), false, // isTextCenteredHorizontally
                    false, // isTextCenteredVertically
                    GameFramework.DataBinding.fromContext("Health: " + entity.killable().integrity
                        + "/" + entity.killable().integrityMax), fontHeight);
                    controlsForStatusFields.push(labelHealth);
                }
                var tabButtonSize = GameFramework.Coords.fromXY(36, 20);
                var tabPageSize = size.clone().subtract(GameFramework.Coords.fromXY(0, tabButtonSize.y + fontHeight));
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
                    var labelExperience = new GameFramework.ControlLabel("labelExperience", GameFramework.Coords.fromXY(marginX, labelSize.y * 4), // pos
                    labelSize.clone(), false, // isTextCenteredHorizontally
                    false, // isTextCenteredVertically
                    GameFramework.DataBinding.fromContext("Experience: "
                        + entity.skillLearner().learningAccumulated), fontHeight);
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
                var back = () => universe.venueTransitionTo(venuePrev);
                var returnValue = new GameFramework.ControlTabbed("tabbedItems", GameFramework.Coords.create(), // pos
                size, tabButtonSize, controlsForTabs, fontHeight, back, entity // context
                );
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
                var playerVisualBarSize = GameFramework.Coords.fromXY(entityDimension * 4, entityDimension);
                var killable = entity.killable();
                var playerVisualHealthBar = new GameFramework.VisualBar(null, // "H", // abbreviation
                playerVisualBarSize, GameFramework.Color.Instances().Red, GameFramework.DataBinding.fromGet((c) => killable.integrity), null, // amountThreshold
                GameFramework.DataBinding.fromGet((c) => killable.integrityMax), null, // fractionBelowWhichToShow
                null, // colorForBorderAsValueBreakGroup
                null // text
                );
                var playerVisualHealthIcon = worldDefn.itemDefnByName("Heart").visual;
                var playerVisualHealthBarPlusIcon = new GameFramework.VisualGroup([
                    playerVisualHealthBar,
                    new GameFramework.VisualOffset(GameFramework.Coords.fromXY(-playerVisualBarSize.x / 2 - playerVisualBarSize.y, 0), playerVisualHealthIcon)
                ]);
                var starvable = entity.starvable();
                var playerVisualSatietyBar = new GameFramework.VisualBar(null, // "F", // abbreviation
                playerVisualBarSize, GameFramework.Color.Instances().Brown, GameFramework.DataBinding.fromGet((c) => starvable.satiety), null, // amountThreshold
                GameFramework.DataBinding.fromGet((c) => starvable.satietyMax), null, // fractionBelowWhichToShow
                null, // colorForBorderAsValueBreakGroup
                null // text
                );
                var playerVisualSatietyIcon = worldDefn.itemDefnByName("Bread").visual;
                var playerVisualSatietyBarPlusIcon = new GameFramework.VisualGroup([
                    playerVisualSatietyBar,
                    new GameFramework.VisualOffset(GameFramework.Coords.fromXY(-playerVisualBarSize.x / 2 - playerVisualBarSize.y, 0), playerVisualSatietyIcon)
                ]);
                var tirable = entity.tirable();
                var playerVisualStaminaBar = new GameFramework.VisualBar(null, // "S", // abbreviation
                playerVisualBarSize, GameFramework.Color.Instances().Yellow, GameFramework.DataBinding.fromGet((c) => tirable.stamina), GameFramework.DataBinding.fromGet((c) => tirable.staminaMaxRemainingBeforeSleep), GameFramework.DataBinding.fromGet((c) => tirable.staminaMaxAfterSleep), null, // fractionBelowWhichToShow
                null, // colorForBorderAsValueBreakGroup
                null // text
                );
                var playerVisualStaminaIcon = new GameFramework.VisualImageScaled(GameFramework.Coords.fromXY(1, 1).multiplyScalar(playerVisualBarSize.y * 1.5), new GameFramework.VisualImageFromLibrary("Zap"));
                var playerVisualStaminaBarPlusIcon = new GameFramework.VisualGroup([
                    playerVisualStaminaBar,
                    new GameFramework.VisualOffset(GameFramework.Coords.fromXY(-playerVisualBarSize.x / 2 - playerVisualBarSize.y, 0), playerVisualStaminaIcon)
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
                playerVisualBarSize, GameFramework.Color.Instances().Cyan, GameFramework.DataBinding.fromContextAndGet(entity, (c) => world.timerTicksSoFar % timerTicksPerGameDay), null, // threshold
                GameFramework.DataBinding.fromContextAndGet(entity, (c) => timerTicksPerGameDay), null, // fractionBelowWhichToShow
                null, // colorForBorderAsValueBreakGroup
                // text
                GameFramework.DataBinding.fromContextAndGet(world, (c) => ticksToHH_MM(c.timerTicksSoFar)));
                var playerVisualTimeIcon = GameFramework.VisualBuilder.Instance().sun(playerVisualBarSize.y * .5);
                var playerVisualTimeBarPlusIcon = new GameFramework.VisualGroup([
                    playerVisualTimeBar,
                    new GameFramework.VisualOffset(GameFramework.Coords.fromXY(-playerVisualBarSize.x / 2 - playerVisualBarSize.y, 0), playerVisualTimeIcon)
                ]);
                var childSpacing = GameFramework.Coords.fromXY(0, playerVisualBarSize.y * 2);
                var playerVisualStatusInfo = new GameFramework.VisualGroup([
                    playerVisualHealthBarPlusIcon,
                    new GameFramework.VisualOffset(childSpacing, playerVisualSatietyBarPlusIcon),
                    new GameFramework.VisualOffset(childSpacing.clone().double(), playerVisualStaminaBarPlusIcon),
                    new GameFramework.VisualOffset(childSpacing.clone().multiplyScalar(3), playerVisualTimeBarPlusIcon)
                ]);
                var controlPlayerStatusInfo = GameFramework.ControlVisual.from4("visualPlayerStatusInfo", GameFramework.Coords.fromXY(5, 2).multiplyScalar(playerVisualBarSize.y), // pos
                GameFramework.Coords.create(), // size
                GameFramework.DataBinding.fromContext(playerVisualStatusInfo));
                childControls.push(controlPlayerStatusInfo);
                // Selection.
                var selector = entity.selector();
                var controlSelectionSize = GameFramework.Coords.fromXY(playerVisualBarSize.x * 1.5, margin * 3);
                var controlSelectionPos = GameFramework.Coords.fromXY(size.x - controlSelectionSize.x - margin, margin);
                var controlSelection = selector.toControl(controlSelectionSize, controlSelectionPos);
                childControls.push(controlSelection);
                // Quick slots.
                var itemQuickSlotCount = 10;
                var buttonSize = GameFramework.Coords.fromXY(25, 25);
                var buttonWidthAll = itemQuickSlotCount * buttonSize.x;
                var buttonMargin = (size.x - buttonWidthAll) / (itemQuickSlotCount + 1);
                var buttonPos = GameFramework.Coords.fromXY(buttonMargin, size.y - margin - buttonSize.y);
                var useItemInQuickSlot = (slotNumber) => {
                    var uwpe = new GameFramework.UniverseWorldPlaceEntities(universe, universe.world, place, entity, null);
                    equipmentUser.useItemInSocketNumbered(uwpe, slotNumber);
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
                    GameFramework.DataBinding.fromTrue(), // isEnabled,
                    buttonClicks[i], false // canBeHeldDown
                    );
                    var visualItemInQuickSlot = GameFramework.ControlVisual.from4("visualItemInQuickSlot", buttonPos.clone(), buttonSize, GameFramework.DataBinding.fromContextAndGet(i, (c) => {
                        var returnValue = null;
                        var itemEntityEquipped = equipmentUser.itemEntityInSocketWithName("Item" + c);
                        if (itemEntityEquipped != null) {
                            var item = itemEntityEquipped.item();
                            returnValue = item.defn(world).visual;
                        }
                        return returnValue;
                    }));
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
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            updateForTimerTick(uwpe) { }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Playable = Playable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
