"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Playable {
            static create() {
                return new Playable();
            }
            static entityFromPlace(place) {
                return place.entitiesByPropertyName(Playable.name)[0];
            }
            static of(entity) {
                return entity.propertyByName(Playable.name);
            }
            static toControlMenu(universe, size, entity, venuePrev) {
                var controlsForTabs = new Array();
                var fontHeight = 12;
                var font = GameFramework.FontNameAndHeight.fromHeightInPixels(fontHeight);
                var labelSize = GameFramework.Coords.fromXY(300, fontHeight * 1.25);
                var marginX = fontHeight;
                var timePlayingAsString = universe.world.timePlayingAsStringLong(universe);
                var controlsForStatusFields = [
                    GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(marginX, labelSize.y), // pos
                    labelSize.clone(), GameFramework.DataBinding.fromContext("Profile: " + universe.profile.name), font),
                    GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(marginX, labelSize.y * 2), // pos
                    labelSize.clone(), GameFramework.DataBinding.fromContext("Time Playing: " + timePlayingAsString), font)
                ];
                var killable = GameFramework.Killable.of(entity);
                if (killable != null) {
                    var labelHealth = GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(marginX, labelSize.y * 3), // pos
                    labelSize.clone(), GameFramework.DataBinding.fromContext("Health: " + GameFramework.Killable.of(entity).integrity
                        + "/" + GameFramework.Killable.of(entity).integrityMax), font);
                    controlsForStatusFields.push(labelHealth);
                }
                var tabButtonSize = GameFramework.Coords.fromXY(36, 20);
                var tabPageSize = size.clone().subtract(GameFramework.Coords.fromXY(0, tabButtonSize.y + fontHeight));
                var includeTitleAndDoneButtonFalse = false;
                var itemHolder = GameFramework.ItemHolder.of(entity);
                if (itemHolder != null) {
                    var itemHolderAsControl = itemHolder.toControl(universe, tabPageSize, entity, venuePrev, includeTitleAndDoneButtonFalse);
                    controlsForTabs.push(itemHolderAsControl);
                }
                var equipmentUser = GameFramework.EquipmentUser.of(entity);
                if (equipmentUser != null) {
                    var equipmentUserAsControl = equipmentUser.toControl(universe, tabPageSize, entity, venuePrev, includeTitleAndDoneButtonFalse);
                    controlsForTabs.push(equipmentUserAsControl);
                }
                var itemCrafter = GameFramework.ItemCrafter.of(entity);
                if (itemCrafter != null) {
                    var crafterAsControl = itemCrafter.toControl(universe, tabPageSize, entity, entity, venuePrev, includeTitleAndDoneButtonFalse);
                    controlsForTabs.push(crafterAsControl);
                }
                var skillLearner = GameFramework.SkillLearner.of(entity);
                if (skillLearner != null) {
                    var skillLearnerAsControl = skillLearner.toControl(universe, tabPageSize, entity, venuePrev, includeTitleAndDoneButtonFalse);
                    controlsForTabs.push(skillLearnerAsControl);
                    var labelExperience = GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(marginX, labelSize.y * 4), // pos
                    labelSize.clone(), GameFramework.DataBinding.fromContext("Experience: "
                        + GameFramework.SkillLearner.of(entity).learningAccumulated), font);
                    controlsForStatusFields.push(labelExperience);
                }
                var journalKeeper = GameFramework.JournalKeeper.of(entity);
                if (journalKeeper != null) {
                    var journalKeeperAsControl = journalKeeper.toControl(universe, tabPageSize, entity, venuePrev, includeTitleAndDoneButtonFalse);
                    controlsForTabs.push(journalKeeperAsControl);
                }
                var gameAndSettingsMenuAsControl = universe.controlBuilder.gameAndSettings(universe, tabPageSize, universe.venueCurrent(), false // includeResumeButton
                );
                controlsForTabs.push(gameAndSettingsMenuAsControl);
                var statusAsControl = GameFramework.ControlContainer.fromNamePosSizeAndChildren("Status", GameFramework.Coords.create(), // pos
                size.clone().addDimensions(0, -32, 0), // size
                // children
                controlsForStatusFields);
                controlsForTabs.splice(0, 0, statusAsControl);
                var back = () => universe.venueTransitionTo(venuePrev);
                var returnValue = new GameFramework.ControlTabbed("tabbedItems", GameFramework.Coords.create(), // pos
                size, tabButtonSize, controlsForTabs, font, back, entity // context
                );
                return returnValue;
            }
            static toControlWorldOverlay(universe, size, entity) {
                var world = universe.world;
                var place = world.placeCurrent;
                var equipmentUser = GameFramework.EquipmentUser.of(entity);
                var childControls = new Array();
                var entityDimension = 10; // todo
                var fontHeightInPixels = 10;
                var font = GameFramework.FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
                var margin = 10;
                var worldDefn = world.defn;
                var playerVisualBarSize = GameFramework.Coords.fromXY(entityDimension * 4, entityDimension);
                var killable = GameFramework.Killable.of(entity);
                var playerVisualHealthBar = GameFramework.VisualBar.fromSizeColorAndBindingsForValueAndMax(playerVisualBarSize, GameFramework.Color.Instances().Red, GameFramework.DataBinding.fromGet((c) => killable.integrity), GameFramework.DataBinding.fromGet((c) => killable.integrityMax));
                var playerVisualHealthIcon = worldDefn.itemDefnByName("Heart").visual;
                var playerVisualHealthBarPlusIcon = GameFramework.VisualGroup.fromChildren([
                    playerVisualHealthBar,
                    GameFramework.VisualOffset.fromOffsetAndChild(GameFramework.Coords.fromXY(-playerVisualBarSize.x / 2 - playerVisualBarSize.y, 0), playerVisualHealthIcon)
                ]);
                var starvable = GameFramework.Starvable.of(entity);
                var playerVisualSatietyBar = GameFramework.VisualBar.fromSizeColorAndBindingsForValueAndMax(playerVisualBarSize, GameFramework.Color.Instances().Brown, GameFramework.DataBinding.fromGet((c) => starvable.satiety), GameFramework.DataBinding.fromGet((c) => starvable.satietyMax));
                var playerVisualSatietyIcon = worldDefn.itemDefnByName("Bread").visual;
                var playerVisualSatietyBarPlusIcon = GameFramework.VisualGroup.fromChildren([
                    playerVisualSatietyBar,
                    GameFramework.VisualOffset.fromOffsetAndChild(GameFramework.Coords.fromXY(-playerVisualBarSize.x / 2 - playerVisualBarSize.y, 0), playerVisualSatietyIcon)
                ]);
                var tirable = GameFramework.Tirable.of(entity);
                var playerVisualStaminaBar = new GameFramework.VisualBar(null, // "S", // abbreviation
                playerVisualBarSize, GameFramework.Color.Instances().Yellow, GameFramework.DataBinding.fromGet((c) => tirable.stamina), GameFramework.DataBinding.fromGet((c) => tirable.staminaMaxRemainingBeforeSleep), GameFramework.DataBinding.fromGet((c) => tirable.staminaMaxAfterSleep), null, // fractionBelowWhichToShow
                null, // colorForBorderAsValueBreakGroup
                null // text
                );
                var playerVisualStaminaIcon = GameFramework.VisualImageScaled.fromSizeAndChild(GameFramework.Coords.fromXY(1, 1).multiplyScalar(playerVisualBarSize.y * 1.5), GameFramework.VisualImageFromLibrary.fromImageName("Zap"));
                var playerVisualStaminaBarPlusIcon = GameFramework.VisualGroup.fromChildren([
                    playerVisualStaminaBar,
                    GameFramework.VisualOffset.fromOffsetAndChild(GameFramework.Coords.fromXY(-playerVisualBarSize.x / 2 - playerVisualBarSize.y, 0), playerVisualStaminaIcon)
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
                var playerVisualTimeBarPlusIcon = GameFramework.VisualGroup.fromChildren([
                    playerVisualTimeBar,
                    GameFramework.VisualOffset.fromOffsetAndChild(GameFramework.Coords.fromXY(-playerVisualBarSize.x / 2 - playerVisualBarSize.y, 0), playerVisualTimeIcon)
                ]);
                var childSpacing = GameFramework.Coords.fromXY(0, playerVisualBarSize.y * 2);
                var playerVisualStatusInfo = GameFramework.VisualGroup.fromChildren([
                    playerVisualHealthBarPlusIcon,
                    GameFramework.VisualOffset.fromOffsetAndChild(childSpacing, playerVisualSatietyBarPlusIcon),
                    GameFramework.VisualOffset.fromOffsetAndChild(childSpacing.clone().double(), playerVisualStaminaBarPlusIcon),
                    GameFramework.VisualOffset.fromOffsetAndChild(childSpacing.clone().multiplyScalar(3), playerVisualTimeBarPlusIcon)
                ]);
                var controlPlayerStatusInfo = GameFramework.ControlVisual.fromNamePosSizeAndVisual("visualPlayerStatusInfo", GameFramework.Coords.fromXY(5, 2).multiplyScalar(playerVisualBarSize.y), // pos
                GameFramework.Coords.create(), // size
                GameFramework.DataBinding.fromContext(playerVisualStatusInfo));
                childControls.push(controlPlayerStatusInfo);
                // Selection.
                var selector = GameFramework.Selector.of(entity);
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
                    var button = GameFramework.ControlButton.from9("buttonItemQuickSlot" + i, buttonPos.clone(), buttonSize, buttonText, font, false, // hasBorder
                    GameFramework.DataBinding.fromTrue(), // isEnabled,
                    buttonClicks[i], false // canBeHeldDown
                    );
                    var visualItemInQuickSlot = GameFramework.ControlVisual.fromNamePosSizeAndVisual("visualItemInQuickSlot", buttonPos.clone(), buttonSize, GameFramework.DataBinding.fromContextAndGet(i, (c) => {
                        var returnValue = null;
                        var itemEntityEquipped = equipmentUser.itemEntityInSocketWithName("Item" + c);
                        if (itemEntityEquipped != null) {
                            var item = GameFramework.Item.of(itemEntityEquipped);
                            returnValue = item.defn(world).visual;
                        }
                        return returnValue;
                    }));
                    childControls.push(visualItemInQuickSlot);
                    childControls.push(button);
                    buttonPos.x += buttonSize.x + buttonMargin;
                }
                var controlOverlayContainer = GameFramework.ControlContainer.fromNamePosSizeAndChildren("containerPlayer", GameFramework.Coords.create(), // pos,
                universe.display.sizeInPixels.clone(), childControls);
                var controlOverlayTransparent = GameFramework.ControlContainerTransparent.fromContainer(controlOverlayContainer);
                controlOverlayTransparent.styleName = GameFramework.ControlStyle.Instances().Dark.name;
                return controlOverlayTransparent;
            }
            // Clonable.
            clone() { return this; }
            overwriteWith(other) { return this; }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return Playable.name; }
            updateForTimerTick(uwpe) { }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Playable = Playable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
