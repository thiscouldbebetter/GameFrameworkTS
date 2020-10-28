"use strict";
class Playable extends EntityProperty {
    static toControlMenu(universe, size, entity, venuePrev) {
        var controlsForTabs = new Array();
        var fontHeight = 12;
        var labelSize = new Coords(300, fontHeight * 1.25, 0);
        var marginX = fontHeight;
        var timePlayingAsString = universe.world.timePlayingAsStringLong(universe);
        var controlsForStatusFields = [
            new ControlLabel("labelProfile", new Coords(marginX, labelSize.y, 0), // pos
            labelSize.clone(), false, // isTextCentered
            "Profile: " + universe.profile.name, fontHeight),
            new ControlLabel("labelTimePlaying", new Coords(marginX, labelSize.y * 2, 0), // pos
            labelSize.clone(), false, // isTextCentered
            "Time Playing: " + timePlayingAsString, fontHeight)
        ];
        var killable = entity.killable();
        if (killable != null) {
            var labelHealth = new ControlLabel("labelHealth", new Coords(marginX, labelSize.y * 3, 0), // pos
            labelSize.clone(), false, // isTextCentered
            "Health: " + entity.killable().integrity + "/" + entity.killable().integrityMax, fontHeight);
            controlsForStatusFields.push(labelHealth);
        }
        var tabButtonSize = new Coords(36, 20, 0);
        var tabPageSize = size.clone().subtract(new Coords(0, tabButtonSize.y + fontHeight, 0));
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
            var labelExperience = new ControlLabel("labelExperience", new Coords(marginX, labelSize.y * 4, 0), // pos
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
        var statusAsControl = new ControlContainer("Status", new Coords(0, 0, 0), // pos
        size.clone().addDimensions(0, -32, 0), // size
        // children
        controlsForStatusFields, null, null);
        controlsForTabs.splice(0, 0, statusAsControl);
        var back = () => {
            var venueNext = venuePrev;
            venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
            universe.venueNext = venueNext;
        };
        var returnValue = new ControlTabbed("tabbedItems", new Coords(0, 0, 0), // pos
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
        var itemDefnsByName = world.defn.itemDefnsByName();
        var playerVisualBarSize = new Coords(entityDimension * 4, entityDimension, 0);
        var killable = entity.killable();
        var playerVisualHealthBar = new VisualBar(null, // "H", // abbreviation
        playerVisualBarSize, Color.Instances().Red, new DataBinding(null, (c) => killable.integrity, null), null, // amountThreshold
        new DataBinding(null, (c) => killable.integrityMax, null), null, // fractionBelowWhichToShow
        null, // colorForBorderAsValueBreakGroup
        null // text
        );
        var playerVisualHealthIcon = itemDefnsByName.get("Heart").visual;
        var playerVisualHealthBarPlusIcon = new VisualGroup([
            playerVisualHealthBar,
            new VisualOffset(playerVisualHealthIcon, new Coords(-playerVisualBarSize.x / 2 - playerVisualBarSize.y, 0, 0))
        ]);
        var starvable = entity.starvable();
        var playerVisualSatietyBar = new VisualBar(null, // "F", // abbreviation
        playerVisualBarSize, Color.Instances().Brown, new DataBinding(null, (c) => starvable.satiety, null), null, // amountThreshold
        new DataBinding(null, (c) => starvable.satietyMax, null), null, // fractionBelowWhichToShow
        null, // colorForBorderAsValueBreakGroup
        null // text
        );
        var playerVisualSatietyIcon = itemDefnsByName.get("Bread").visual;
        var playerVisualSatietyBarPlusIcon = new VisualGroup([
            playerVisualSatietyBar,
            new VisualOffset(playerVisualSatietyIcon, new Coords(-playerVisualBarSize.x / 2 - playerVisualBarSize.y, 0, 0))
        ]);
        var tirable = entity.tirable();
        var playerVisualStaminaBar = new VisualBar(null, // "S", // abbreviation
        playerVisualBarSize, Color.Instances().Yellow, new DataBinding(null, (c) => tirable.stamina, null), new DataBinding(null, (c) => tirable.staminaMaxRemainingBeforeSleep, null), new DataBinding(null, (c) => tirable.staminaMaxAfterSleep, null), null, // fractionBelowWhichToShow
        null, // colorForBorderAsValueBreakGroup
        null // text
        );
        var playerVisualStaminaIcon = new VisualImageScaled(new VisualImageFromLibrary("Zap"), new Coords(1, 1, 0).multiplyScalar(playerVisualBarSize.y * 1.5));
        var playerVisualStaminaBarPlusIcon = new VisualGroup([
            playerVisualStaminaBar,
            new VisualOffset(playerVisualStaminaIcon, new Coords(-playerVisualBarSize.x / 2 - playerVisualBarSize.y, 0, 0))
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
            var returnValue = StringHelper.padStart("" + gameHoursIntoDay, 2, "0")
                + ":"
                + StringHelper.padStart("" + gameMinutesIntoHour, 2, "0");
            return returnValue;
        };
        var playerVisualTimeBar = new VisualBar(null, // "T", // abbreviation
        playerVisualBarSize, Color.Instances().Cyan, new DataBinding(null, (c) => world.timerTicksSoFar % timerTicksPerGameDay, null), null, // threshold
        new DataBinding(null, (c) => timerTicksPerGameDay, null), null, // fractionBelowWhichToShow
        null, // colorForBorderAsValueBreakGroup
        // text
        new DataBinding(world, (c) => ticksToHH_MM(c.timerTicksSoFar), null));
        var playerVisualTimeIcon = VisualBuilder.Instance().sun(playerVisualBarSize.y * .5);
        var playerVisualTimeBarPlusIcon = new VisualGroup([
            playerVisualTimeBar,
            new VisualOffset(playerVisualTimeIcon, new Coords(-playerVisualBarSize.x / 2 - playerVisualBarSize.y, 0, 0))
        ]);
        var childSpacing = new Coords(0, playerVisualBarSize.y * 2, 0);
        var playerVisualStatusInfo = new VisualGroup([
            playerVisualHealthBarPlusIcon,
            new VisualOffset(playerVisualSatietyBarPlusIcon, childSpacing),
            new VisualOffset(playerVisualStaminaBarPlusIcon, childSpacing.clone().double()),
            new VisualOffset(playerVisualTimeBarPlusIcon, childSpacing.clone().multiplyScalar(3))
        ]);
        var controlPlayerStatusInfo = new ControlVisual("visualPlayerStatusInfo", new Coords(5, 2, 0).multiplyScalar(playerVisualBarSize.y), // pos
        new Coords(0, 0, 0), // size
        DataBinding.fromContext(playerVisualStatusInfo), null, null);
        childControls.push(controlPlayerStatusInfo);
        // Selection.
        var selector = entity.selector();
        var controlSelectionSize = new Coords(playerVisualBarSize.x * 1.5, margin * 3, 0);
        var controlSelectionPos = new Coords(size.x - controlSelectionSize.x - margin, margin, 0);
        var controlSelection = selector.toControl(controlSelectionSize, controlSelectionPos);
        childControls.push(controlSelection);
        // Quick slots.
        var itemQuickSlotCount = 10;
        var buttonSize = new Coords(25, 25, 0);
        var buttonWidthAll = itemQuickSlotCount * buttonSize.x;
        var buttonMargin = (size.x - buttonWidthAll) / (itemQuickSlotCount + 1);
        var buttonPos = new Coords(buttonMargin, size.y - margin - buttonSize.y, 0);
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
            var button = new ControlButton("buttonItemQuickSlot" + i, buttonPos.clone(), buttonSize, buttonText, fontHeightInPixels, false, // hasBorder
            true, // isEnabled,
            buttonClicks[i], null, // context
            false // canBeHeldDown
            );
            var visualItemInQuickSlot = new ControlVisual("visualItemInQuickSlot", buttonPos.clone(), buttonSize, new DataBinding(i, (c) => {
                var returnValue = null;
                var itemEntityEquipped = equipmentUser.itemEntityInSocketWithName("Item" + c);
                if (itemEntityEquipped != null) {
                    var item = itemEntityEquipped.item();
                    returnValue = item.defn(world).visual;
                }
                return returnValue;
            }, null), null, null // colorBackground, colorBorder
            );
            childControls.push(visualItemInQuickSlot);
            childControls.push(button);
            buttonPos.x += buttonSize.x + buttonMargin;
        }
        var controlOverlayContainer = new ControlContainer("containerPlayer", new Coords(0, 0, 0), // pos,
        universe.display.sizeInPixels.clone(), childControls, null, null);
        var controlOverlayTransparent = new ControlContainerTransparent(controlOverlayContainer);
        controlOverlayTransparent.styleName = ControlStyle.Instances().Dark.name;
        return controlOverlayTransparent;
    }
}
