
namespace ThisCouldBeBetter.GameFramework
{

export class Playable extends EntityProperty
{
	static toControlMenu
	(
		universe: Universe, size: Coords, entity: Entity, venuePrev: Venue
	): ControlBase
	{
		var controlsForTabs = new Array<ControlBase>();

		var fontHeight = 12;
		var labelSize = Coords.fromXY(300, fontHeight * 1.25);
		var marginX = fontHeight;

		var timePlayingAsString =
			universe.world.timePlayingAsStringLong(universe);

		var controlsForStatusFields =
		[
			new ControlLabel
			(
				"labelProfile",
				Coords.fromXY(marginX, labelSize.y), // pos
				labelSize.clone(),
				false, // isTextCentered
				"Profile: " + universe.profile.name,
				fontHeight
			),

			new ControlLabel
			(
				"labelTimePlaying",
				Coords.fromXY(marginX, labelSize.y * 2), // pos
				labelSize.clone(),
				false, // isTextCentered
				"Time Playing: " + timePlayingAsString,
				fontHeight
			)
		];

		var killable = entity.killable();
		if (killable != null)
		{
			var labelHealth = new ControlLabel
			(
				"labelHealth",
				Coords.fromXY(marginX, labelSize.y * 3), // pos
				labelSize.clone(),
				false, // isTextCentered
				"Health: " + entity.killable().integrity + "/" + entity.killable().integrityMax,
				fontHeight
			);
			controlsForStatusFields.push(labelHealth);
		}

		var tabButtonSize = Coords.fromXY(36, 20);
		var tabPageSize = size.clone().subtract
		(
			Coords.fromXY(0, tabButtonSize.y + fontHeight)
		);

		var includeTitleAndDoneButtonFalse = false;

		var itemHolder = entity.itemHolder();
		if (itemHolder != null)
		{
			var itemHolderAsControl = itemHolder.toControl
			(
				universe, tabPageSize, entity, venuePrev, includeTitleAndDoneButtonFalse
			);
			controlsForTabs.push(itemHolderAsControl);
		}

		var equipmentUser = entity.equipmentUser();
		if (equipmentUser != null)
		{
			var equipmentUserAsControl = equipmentUser.toControl
			(
				universe, tabPageSize, entity, venuePrev, includeTitleAndDoneButtonFalse
			);
			controlsForTabs.push(equipmentUserAsControl);
		}

		var itemCrafter = entity.itemCrafter();
		if (itemCrafter != null)
		{
			var crafterAsControl = itemCrafter.toControl
			(
				universe, tabPageSize, entity, entity, venuePrev, includeTitleAndDoneButtonFalse
			);
			controlsForTabs.push(crafterAsControl);
		}

		var skillLearner = entity.skillLearner();
		if (skillLearner != null)
		{
			var skillLearnerAsControl = skillLearner.toControl
			(
				universe, tabPageSize, entity, venuePrev, includeTitleAndDoneButtonFalse
			);
			controlsForTabs.push(skillLearnerAsControl);

			var labelExperience = new ControlLabel
			(
				"labelExperience",
				Coords.fromXY(marginX, labelSize.y * 4), // pos
				labelSize.clone(),
				false, // isTextCentered
				"Experience: " + entity.skillLearner().learningAccumulated,
				fontHeight
			);
			controlsForStatusFields.push(labelExperience);
		}

		var journalKeeper = entity.journalKeeper();
		if (journalKeeper != null)
		{
			var journalKeeperAsControl = journalKeeper.toControl
			(
				universe, tabPageSize, entity, venuePrev, includeTitleAndDoneButtonFalse
			);
			controlsForTabs.push(journalKeeperAsControl);
		}

		var gameAndSettingsMenuAsControl = universe.controlBuilder.gameAndSettings
		(
			universe, tabPageSize, universe.venueCurrent, false // includeResumeButton
		);
		controlsForTabs.push(gameAndSettingsMenuAsControl);

		var statusAsControl = ControlContainer.from4
		(
			"Status",
			Coords.create(), // pos
			size.clone().addDimensions(0, -32, 0), // size
			// children
			controlsForStatusFields
		);
		controlsForTabs.splice(0, 0, statusAsControl);

		var back = () =>
		{
			var venueNext: Venue = venuePrev;
			venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
			universe.venueNext = venueNext;
		};

		var returnValue = new ControlTabbed
		(
			"tabbedItems",
			Coords.create(), // pos
			size,
			tabButtonSize,
			controlsForTabs,
			fontHeight,
			back
		);
		return returnValue;
	}

	static toControlWorldOverlay(universe: Universe, size: Coords, entity: Entity)
	{
		var world = universe.world;
		var place = world.placeCurrent;
		var equipmentUser = entity.equipmentUser();

		var childControls = new Array<ControlBase>();

		var entityDimension = 10; // todo
		var fontHeightInPixels = 10;
		var margin = 10;

		var worldDefn = world.defn;

		var playerVisualBarSize = Coords.fromXY(entityDimension * 4, entityDimension);

		var killable = entity.killable();
		var playerVisualHealthBar = new VisualBar
		(
			null, // "H", // abbreviation
			playerVisualBarSize,
			Color.Instances().Red,
			DataBinding.fromGet((c: Entity) => killable.integrity),
			null, // amountThreshold
			DataBinding.fromGet((c: Entity) => killable.integrityMax),
			null, // fractionBelowWhichToShow
			null, // colorForBorderAsValueBreakGroup
			null // text
		);

		var playerVisualHealthIcon = worldDefn.itemDefnByName("Heart").visual;

		var playerVisualHealthBarPlusIcon = new VisualGroup
		([
			playerVisualHealthBar,
			new VisualOffset
			(
				playerVisualHealthIcon,
				Coords.fromXY(-playerVisualBarSize.x / 2 - playerVisualBarSize.y, 0)
			)
		]);

		var starvable = entity.starvable();
		var playerVisualSatietyBar = new VisualBar
		(
			null, // "F", // abbreviation
			playerVisualBarSize,
			Color.Instances().Brown,
			DataBinding.fromGet((c: any) => starvable.satiety),
			null, // amountThreshold
			DataBinding.fromGet((c: any) => starvable.satietyMax),
			null, // fractionBelowWhichToShow
			null, // colorForBorderAsValueBreakGroup
			null // text
		);

		var playerVisualSatietyIcon = worldDefn.itemDefnByName("Bread").visual;

		var playerVisualSatietyBarPlusIcon = new VisualGroup
		([
			playerVisualSatietyBar,
			new VisualOffset
			(
				playerVisualSatietyIcon,
				Coords.fromXY(-playerVisualBarSize.x / 2 - playerVisualBarSize.y, 0)
			)
		]);

		var tirable = entity.tirable();
		var playerVisualStaminaBar = new VisualBar
		(
			null, // "S", // abbreviation
			playerVisualBarSize,
			Color.Instances().Yellow,
			DataBinding.fromGet( (c: any) => tirable.stamina),
			DataBinding.fromGet( (c: any) => tirable.staminaMaxRemainingBeforeSleep),
			DataBinding.fromGet( (c: any) => tirable.staminaMaxAfterSleep),
			null, // fractionBelowWhichToShow
			null, // colorForBorderAsValueBreakGroup
			null // text
		);

		var playerVisualStaminaIcon = new VisualImageScaled
		(
			new VisualImageFromLibrary("Zap"),
			Coords.fromXY(1, 1).multiplyScalar(playerVisualBarSize.y * 1.5)
		);

		var playerVisualStaminaBarPlusIcon = new VisualGroup
		([
			playerVisualStaminaBar,
			new VisualOffset
			(
				playerVisualStaminaIcon,
				Coords.fromXY(-playerVisualBarSize.x / 2 - playerVisualBarSize.y, 0)
			)
		]);

		var hoursPerDay = 24;
		var minutesPerHour = 60;
		var minutesPerDay = minutesPerHour * hoursPerDay;
		// var gameMinutesPerActualSecond = 1;
		var timerTicksPerGameDay =
			minutesPerDay * universe.timerHelper.ticksPerSecond;

		var ticksToHH_MM = (ticks: number) =>
		{
			var ticksIntoDay = world.timerTicksSoFar % timerTicksPerGameDay;
			var fractionOfDay = ticksIntoDay / timerTicksPerGameDay;
			var gameMinutesIntoDay = Math.round(fractionOfDay * minutesPerDay);
			var gameHoursIntoDay = Math.floor(gameMinutesIntoDay / minutesPerHour);
			var gameMinutesIntoHour = gameMinutesIntoDay % minutesPerHour;
			var returnValue =
				StringHelper.padStart("" + gameHoursIntoDay, 2, "0")
				+ ":"
				+ StringHelper.padStart("" + gameMinutesIntoHour, 2, "0");
			return returnValue;
		};

		var playerVisualTimeBar = new VisualBar
		(
			null, // "T", // abbreviation
			playerVisualBarSize,
			Color.Instances().Cyan,
			DataBinding.fromGet
			(
				(c: any) => world.timerTicksSoFar % timerTicksPerGameDay
			),
			null, // threshold
			DataBinding.fromGet
			(
				(c: any) => timerTicksPerGameDay
			),
			null, // fractionBelowWhichToShow
			null, // colorForBorderAsValueBreakGroup
			// text
			DataBinding.fromContextAndGet
			(
				world, (c: World) => ticksToHH_MM(c.timerTicksSoFar)
			)
		);

		var playerVisualTimeIcon = VisualBuilder.Instance().sun(playerVisualBarSize.y * .5);

		var playerVisualTimeBarPlusIcon = new VisualGroup
		([
			playerVisualTimeBar,
			new VisualOffset
			(
				playerVisualTimeIcon,
				Coords.fromXY(-playerVisualBarSize.x / 2 - playerVisualBarSize.y, 0)
			)
		]);

		var childSpacing = Coords.fromXY(0, playerVisualBarSize.y * 2);

		var playerVisualStatusInfo: Visual = new VisualGroup
		([
			playerVisualHealthBarPlusIcon,
			new VisualOffset
			(
				playerVisualSatietyBarPlusIcon,
				childSpacing
			),
			new VisualOffset
			(
				playerVisualStaminaBarPlusIcon,
				childSpacing.clone().double()
			),
			new VisualOffset
			(
				playerVisualTimeBarPlusIcon,
				childSpacing.clone().multiplyScalar(3)
			)
		]);

		var controlPlayerStatusInfo = ControlVisual.from4
		(
			"visualPlayerStatusInfo",
			Coords.fromXY(5, 2).multiplyScalar(playerVisualBarSize.y), // pos
			Coords.create(), // size
			DataBinding.fromContext(playerVisualStatusInfo)
		);

		childControls.push(controlPlayerStatusInfo);

		// Selection.

		var selector = entity.selector();

		var controlSelectionSize =
			Coords.fromXY(playerVisualBarSize.x * 1.5, margin * 3);

		var controlSelectionPos =
			Coords.fromXY(size.x - controlSelectionSize.x - margin, margin);

		var controlSelection =
			selector.toControl(controlSelectionSize, controlSelectionPos);

		childControls.push(controlSelection);

		// Quick slots.

		var itemQuickSlotCount = 10;

		var buttonSize = Coords.fromXY(25, 25);
		var buttonWidthAll = itemQuickSlotCount * buttonSize.x;
		var buttonMargin = (size.x - buttonWidthAll) / (itemQuickSlotCount + 1);

		var buttonPos = Coords.fromXY
		(
			buttonMargin, size.y - margin - buttonSize.y
		);

		var useItemInQuickSlot = (slotNumber: number) =>
		{
			equipmentUser.useItemInSocketNumbered
			(
				universe, world, place, entity, slotNumber
			);
		};
		var buttonClicks =
		[
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

		for (var i = 0; i < itemQuickSlotCount; i++)
		{
			var buttonText = "\n   " + i;

			var button = new ControlButton
			(
				"buttonItemQuickSlot" + i,
				buttonPos.clone(),
				buttonSize,
				buttonText,
				fontHeightInPixels,
				false, // hasBorder
				true, // isEnabled,
				buttonClicks[i],
				null, // context
				false // canBeHeldDown
			);

			var visualItemInQuickSlot = ControlVisual.from4
			(
				"visualItemInQuickSlot",
				buttonPos.clone(),
				buttonSize,
				DataBinding.fromContextAndGet
				(
					i,
					(c: number) =>
					{
						var returnValue = null;
						var itemEntityEquipped =
							equipmentUser.itemEntityInSocketWithName("Item" + c);
						if (itemEntityEquipped != null)
						{
							var item = itemEntityEquipped.item();
							returnValue = item.defn(world).visual;
						}
						return returnValue;
					}
				)
			);

			childControls.push(visualItemInQuickSlot);
			childControls.push(button);

			buttonPos.x += buttonSize.x + buttonMargin;
		} 

		var controlOverlayContainer = new ControlContainer
		(
			"containerPlayer",
			Coords.create(), // pos,
			universe.display.sizeInPixels.clone(),
			childControls,
			null, null
		);
		var controlOverlayTransparent
			= new ControlContainerTransparent(controlOverlayContainer);

		controlOverlayTransparent.styleName = ControlStyle.Instances().Dark.name;

		return controlOverlayTransparent;
	}

}

}
