namespace ThisCouldBeBetter.GameFramework
{

export class WorldCreator
{
	worldCreate: (u: Universe, wc: WorldCreator) => World;
	toControl: (u: Universe, wc: WorldCreator) => ControlBase;
	settings: any;

	constructor
	(
		worldCreate: (u: Universe, wc: WorldCreator) => World,
		toControl: (u: Universe, wc: WorldCreator) => ControlBase,
		settings: any
	)
	{
		this.worldCreate = worldCreate;
		this.toControl = toControl;
		this.settings = settings;
	}

	static fromWorldCreate
	(
		worldCreate: (u: Universe, wc: WorldCreator) => World
	): WorldCreator
	{
		return new WorldCreator(worldCreate, null, null);
	}

	static toControlDemo
	(
		universe: Universe, worldCreator: WorldCreator
	): ControlBase
	{
		var size = universe.display.sizeInPixels;
		var margin = 8;
		var fontNameAndHeight = FontNameAndHeight.default();
		var fontHeightInPixels = fontNameAndHeight.heightInPixels;
		var controlHeight = fontHeightInPixels + margin;
		var buttonSize =
			Coords.fromXY(4, 1).multiplyScalar(controlHeight);

		var returnControl = ControlContainer.from4
		(
			"containerWorldCreator",
			Coords.zeroes(), // pos
			size,
			[
				new ControlLabel
				(
					"labelWorldCreationSettings",
					Coords.fromXY(margin, margin), // pos
					Coords.fromXY(size.x - margin * 2, controlHeight),
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("World Creation Settings"),
					fontNameAndHeight
				),

				new ControlLabel
				(
					"labelWorldName",
					Coords.fromXY(margin, margin * 2 + controlHeight), // pos
					Coords.fromXY(size.x - margin * 2, controlHeight),
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("World Name:"),
					fontNameAndHeight
				),

				new ControlTextBox
				(
					"textBoxWorldName",
					Coords.fromXY(margin * 8, margin * 2 + controlHeight), // pos
					Coords.fromXY(margin * 12, controlHeight), // size
					new DataBinding
					(
						worldCreator,
						(c: WorldCreator) => c.settings.name || "",
						(c: WorldCreator, v: string) => c.settings.name = v
					), // text
					fontNameAndHeight,
					64, // charCountMax
					DataBinding.fromTrue() // isEnabled
				),

				new ControlButton
				(
					"buttonCreate",
					Coords.fromXY
					(
						size.x - margin - buttonSize.x,
						size.y - margin - buttonSize.y
					),
					buttonSize,
					"Create",
					fontNameAndHeight,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() =>
						universe.venueTransitionTo
						(
							worldCreator.venueWorldGenerate(universe)
						),
					false // canBeHeldDown
				)
			]
		);

		return returnControl;
	}

	// Instance methods.

	toVenue(universe: Universe): Venue
	{
		var returnVenue: Venue;

		if (this.toControl == null)
		{
			returnVenue = this.venueWorldGenerate(universe);
		}
		else
		{
			var controlRoot = this.toControl(universe, this);
			returnVenue = controlRoot.toVenue();
		}

		return returnVenue;
	}

	venueWorldGenerate(universe: Universe): Venue
	{
		var messageAsDataBinding = DataBinding.fromGet
		(
			(c: VenueTask<World>) => "Generating world...",
		);

		var venueMessage =
			VenueMessage.fromMessage(messageAsDataBinding);

		var venueTask = new VenueTask
		(
			venueMessage,
			() => universe.worldCreator.worldCreate(universe, universe.worldCreator), // perform
			(world: World) => // done
			{
				universe.world = world;

				var venueNext = universe.world.toVenue();
				universe.venueTransitionTo(venueNext);
			}
		);

		messageAsDataBinding.contextSet(venueTask);

		var returnValue =
			universe.controlBuilder.venueTransitionalFromTo(universe.venueCurrent, venueTask);

		return returnValue;
	}

}

}