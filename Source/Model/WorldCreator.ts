namespace ThisCouldBeBetter.GameFramework
{

export class WorldCreator
{
	worldCreate: (u: Universe) => World;
	toControl: (u: Universe, wc: WorldCreator) => ControlBase

	constructor
	(
		worldCreate: (u: Universe) => World,
		toControl: (u: Universe, wc: WorldCreator) => ControlBase,
	)
	{
		this.worldCreate = worldCreate;
		this.toControl = toControl;
	}

	static fromWorldCreate
	(
		worldCreate: (u: Universe) => World
	): WorldCreator
	{
		return new WorldCreator(worldCreate, null);
	}

	static toControlDemo
	(
		universe: Universe, worldCreator: WorldCreator
	): ControlBase
	{
		var size = universe.display.sizeInPixels;
		var margin = 8;
		var fontHeightInPixels = 10;
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
					"labelWorldCreation Settings",
					Coords.fromXY(margin, margin), // pos
					Coords.fromXY(size.x - margin * 2, controlHeight),
					false, // isTextCentered
					DataBinding.fromContext("World Creation Settings"),
					fontHeightInPixels
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
					fontHeightInPixels,
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
			() => universe.worldCreate(), // perform
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