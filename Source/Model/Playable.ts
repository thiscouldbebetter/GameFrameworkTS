
namespace ThisCouldBeBetter.GameFramework
{

export class Playable implements EntityProperty<Playable>
{
	static create(): Playable
	{
		return new Playable();
	}

	static entityFromPlace(place: Place): Entity
	{
		return place.entitiesByPropertyName(Playable.name)[0];
	}

	static of(entity: Entity): Playable
	{
		return entity.propertyByName(Playable.name) as Playable;
	}

	static toControlMenu
	(
		universe: Universe, size: Coords, entity: Entity, venuePrev: Venue
	): ControlBase
	{
		var controlsForTabs = new Array<ControlBase>();

		var fontHeight = 12;
		var font = FontNameAndHeight.fromHeightInPixels(fontHeight);
		var labelSize = Coords.fromXY(300, fontHeight * 1.25);
		var marginX = fontHeight;

		var timePlayingAsString =
			universe.world.timePlayingAsStringLong(universe);

		var controlsForStatusFields =
		[
			ControlLabel.fromPosSizeTextFontUncentered
			(
				Coords.fromXY(marginX, labelSize.y), // pos
				labelSize.clone(),
				DataBinding.fromContext
				(
					"Profile: " + universe.profile.name
				),
				font
			),

			ControlLabel.fromPosSizeTextFontUncentered
			(
				Coords.fromXY(marginX, labelSize.y * 2), // pos
				labelSize.clone(),
				DataBinding.fromContext
				(
					"Time Playing: " + timePlayingAsString
				),
				font
			)
		];

		var killable = Killable.of(entity);
		if (killable != null)
		{
			var labelHealth = ControlLabel.fromPosSizeTextFontUncentered
			(
				Coords.fromXY(marginX, labelSize.y * 3), // pos
				labelSize.clone(),
				DataBinding.fromContext
				(
					"Health: " + Killable.of(entity).integrity
					+ "/" + Killable.of(entity).integrityMax
				),
				font
			);
			controlsForStatusFields.push(labelHealth);
		}

		var tabButtonSize = Coords.fromXY(36, 20);
		var tabPageSize = size.clone().subtract
		(
			Coords.fromXY(0, tabButtonSize.y + fontHeight)
		);

		var includeTitleAndDoneButtonFalse = false;

		var itemHolder = ItemHolder.of(entity);
		if (itemHolder != null)
		{
			var itemHolderAsControl = itemHolder.toControl
			(
				universe,
				tabPageSize,
				entity,
				venuePrev,
				includeTitleAndDoneButtonFalse
			);
			controlsForTabs.push(itemHolderAsControl);
		}

		var equipmentUser = EquipmentUser.of(entity);
		if (equipmentUser != null)
		{
			var equipmentUserAsControl = equipmentUser.toControl
			(
				universe, tabPageSize, entity, venuePrev, includeTitleAndDoneButtonFalse
			);
			controlsForTabs.push(equipmentUserAsControl);
		}

		var itemCrafter = ItemCrafter.of(entity);
		if (itemCrafter != null)
		{
			var crafterAsControl = itemCrafter.toControl
			(
				universe,
				tabPageSize,
				entity,
				entity,
				venuePrev,
				includeTitleAndDoneButtonFalse
			);
			controlsForTabs.push(crafterAsControl);
		}

		var skillLearner = SkillLearner.of(entity);
		if (skillLearner != null)
		{
			var skillLearnerAsControl = skillLearner.toControl
			(
				universe,
				tabPageSize,
				entity,
				venuePrev,
				includeTitleAndDoneButtonFalse
			);
			controlsForTabs.push(skillLearnerAsControl);

			var labelExperience = ControlLabel.fromPosSizeTextFontUncentered
			(
				Coords.fromXY(marginX, labelSize.y * 4), // pos
				labelSize.clone(),
				DataBinding.fromContext
				(
					"Experience: "
					+ SkillLearner.of(entity).learningAccumulated
				),
				font
			);
			controlsForStatusFields.push(labelExperience);
		}

		var journalKeeper = JournalKeeper.of(entity);
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
			universe, tabPageSize, universe.venueCurrent(), false // includeResumeButton
		);
		controlsForTabs.push(gameAndSettingsMenuAsControl);

		var statusAsControl = ControlContainer.fromNamePosSizeAndChildren
		(
			"Status",
			Coords.create(), // pos
			size.clone().addDimensions(0, -32, 0), // size
			// children
			controlsForStatusFields
		);
		controlsForTabs.splice(0, 0, statusAsControl);

		var back = () => universe.venueTransitionTo(venuePrev);

		var returnValue = new ControlTabbed<Entity>
		(
			"tabbedItems",
			Coords.create(), // pos
			size,
			tabButtonSize,
			controlsForTabs,
			font,
			back,
			entity // context
		);
		return returnValue;
	}

	static toControlWorldOverlay
	(
		universe: Universe, size: Coords, entity: Entity
	): ControlBase
	{
		var world = universe.world;
		var place = world.placeCurrent;
		var equipmentUser = EquipmentUser.of(entity);

		var childControls = new Array<ControlBase>();

		var entityDimension = 10; // todo
		var fontHeightInPixels = 10;
		var font = FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
		var margin = 10;

		var worldDefn = world.defn;

		var playerVisualBarSize = Coords.fromXY(entityDimension * 4, entityDimension);

		var killable = Killable.of(entity);
		var playerVisualHealthBar = VisualBar.fromSizeColorAndBindingsForValueAndMax
		(
			playerVisualBarSize,
			Color.Instances().Red,
			DataBinding.fromGet((c: Entity) => killable.integrity),
			DataBinding.fromGet((c: Entity) => killable.integrityMax)
		);

		var playerVisualHealthIcon = worldDefn.itemDefnByName("Heart").visual;

		var playerVisualHealthBarPlusIcon = VisualGroup.fromChildren
		([
			playerVisualHealthBar,
			VisualOffset.fromOffsetAndChild
			(
				Coords.fromXY(-playerVisualBarSize.x / 2 - playerVisualBarSize.y, 0),
				playerVisualHealthIcon
			)
		]);

		var starvable = Starvable.of(entity);
		var playerVisualSatietyBar = VisualBar.fromSizeColorAndBindingsForValueAndMax
		(
			playerVisualBarSize,
			Color.Instances().Brown,
			DataBinding.fromGet((c: Entity) => starvable.satiety),
			DataBinding.fromGet( (c: Entity) => starvable.satietyMax )
		);

		var playerVisualSatietyIcon =
			worldDefn.itemDefnByName("Bread").visual;

		var playerVisualSatietyBarPlusIcon = VisualGroup.fromChildren
		([
			playerVisualSatietyBar,
			VisualOffset.fromOffsetAndChild
			(
				Coords.fromXY
				(
					-playerVisualBarSize.x / 2 - playerVisualBarSize.y,
					0
				),
				playerVisualSatietyIcon
			)
		]);

		var tirable = Tirable.of(entity);
		var playerVisualStaminaBar = new VisualBar
		(
			null, // "S", // abbreviation
			playerVisualBarSize,
			Color.Instances().Yellow,
			DataBinding.fromGet
			(
				(c: Entity) => tirable.stamina
			),
			DataBinding.fromGet
			(
				(c: Entity) => tirable.staminaMaxRemainingBeforeSleep
			),
			DataBinding.fromGet
			(
				(c: Entity) => tirable.staminaMaxAfterSleep,
			),
			null, // fractionBelowWhichToShow
			null, // colorForBorderAsValueBreakGroup
			null // text
		);

		var playerVisualStaminaIcon = VisualImageScaled.fromSizeAndChild
		(
			Coords.fromXY(1, 1).multiplyScalar(playerVisualBarSize.y * 1.5),
			VisualImageFromLibrary.fromImageName("Zap")
		);

		var playerVisualStaminaBarPlusIcon = VisualGroup.fromChildren
		([
			playerVisualStaminaBar,
			VisualOffset.fromOffsetAndChild
			(
				Coords.fromXY
				(
					-playerVisualBarSize.x / 2 - playerVisualBarSize.y,
					0
				),
				playerVisualStaminaIcon
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
			DataBinding.fromContextAndGet
			(
				entity,
				(c: Entity) => world.timerTicksSoFar % timerTicksPerGameDay
			),
			null, // threshold
			DataBinding.fromContextAndGet
			(
				entity,
				(c: Entity) => timerTicksPerGameDay
			),
			null, // fractionBelowWhichToShow
			null, // colorForBorderAsValueBreakGroup
			// text
			DataBinding.fromContextAndGet
			(
				world, (c: World) => ticksToHH_MM(c.timerTicksSoFar)
			)
		);

		var playerVisualTimeIcon =
			VisualBuilder.Instance().sun(playerVisualBarSize.y * .5);

		var playerVisualTimeBarPlusIcon = VisualGroup.fromChildren
		([
			playerVisualTimeBar,
			VisualOffset.fromOffsetAndChild
			(
				Coords.fromXY(-playerVisualBarSize.x / 2 - playerVisualBarSize.y, 0),
				playerVisualTimeIcon
			)
		]);

		var childSpacing = Coords.fromXY(0, playerVisualBarSize.y * 2);

		var playerVisualStatusInfo: VisualBase = VisualGroup.fromChildren
		([
			playerVisualHealthBarPlusIcon,
			VisualOffset.fromOffsetAndChild
			(
				childSpacing,
				playerVisualSatietyBarPlusIcon
			),
			VisualOffset.fromOffsetAndChild
			(
				childSpacing.clone().double(),
				playerVisualStaminaBarPlusIcon
			),
			VisualOffset.fromOffsetAndChild
			(
				childSpacing.clone().multiplyScalar(3),
				playerVisualTimeBarPlusIcon
			)
		]);

		var controlPlayerStatusInfo = ControlVisual.fromNamePosSizeAndVisual
		(
			"visualPlayerStatusInfo",
			Coords.fromXY(5, 2).multiplyScalar(playerVisualBarSize.y), // pos
			Coords.create(), // size
			DataBinding.fromContext(playerVisualStatusInfo)
		);

		childControls.push(controlPlayerStatusInfo);

		// Selection.

		var selector = Selector.of(entity);

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
			var uwpe = new UniverseWorldPlaceEntities
			(
				universe, universe.world, place,
				entity, null
			);
			equipmentUser.useItemInSocketNumbered
			(
				uwpe, slotNumber
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

			var button = ControlButton.from9
			(
				"buttonItemQuickSlot" + i,
				buttonPos.clone(),
				buttonSize,
				buttonText,
				font,
				false, // hasBorder
				DataBinding.fromTrue(), // isEnabled,
				buttonClicks[i],
				false // canBeHeldDown
			);

			var visualItemInQuickSlot = ControlVisual.fromNamePosSizeAndVisual
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
							var item = Item.of(itemEntityEquipped);
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

		var controlOverlayContainer = ControlContainer.fromNamePosSizeAndChildren
		(
			"containerPlayer",
			Coords.create(), // pos,
			universe.display.sizeInPixels.clone(),
			childControls
		);
		var controlOverlayTransparent =
			ControlContainerTransparent.fromContainer(controlOverlayContainer);

		controlOverlayTransparent.styleName = ControlStyle.Instances().Dark.name;

		return controlOverlayTransparent;
	}

	// Clonable.

	clone(): Playable { return this; }
	overwriteWith(other: Playable): Playable { return this; }

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	propertyName(): string { return Playable.name; }
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: Playable): boolean { return false; } // todo
}

}
