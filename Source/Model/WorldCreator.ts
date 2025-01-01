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

		var labelWorldCreationSettings = ControlLabel.fromPosSizeTextFontUncentered
		(
			Coords.fromXY(margin, margin), // pos
			Coords.fromXY(size.x - margin * 2, controlHeight),
			DataBinding.fromContext("World Creation Settings"),
			fontNameAndHeight
		);

		var labelWorldName = ControlLabel.fromPosSizeTextFontUncentered
		(
			Coords.fromXY(margin, margin * 2 + controlHeight), // pos
			Coords.fromXY(size.x - margin * 2, controlHeight),
			DataBinding.fromContext("World Name:"),
			fontNameAndHeight
		);

		var textWorldName = new ControlTextBox
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
		);

		var buttonCreate = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY
			(
				size.x - margin - buttonSize.x,
				size.y - margin - buttonSize.y
			),
			buttonSize,
			"Create",
			fontNameAndHeight,
			() =>
				universe.venueTransitionTo
				(
					worldCreator.venueWorldGenerate(universe)
				)
		);

		var returnControl = ControlContainer.fromNamePosSizeChildren
		(
			"containerWorldCreator",
			Coords.zeroes(), // pos
			size,
			[
				labelWorldCreationSettings,
				labelWorldName,
				textWorldName,
				buttonCreate
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

		var worldGeneratePerform = () =>
		{
			var worldCreator = universe.worldCreator;
			return worldCreator.worldCreate(universe, worldCreator);
		};

		var venueTask = new VenueTask
		(
			venueMessage,
			worldGeneratePerform,
			(world: World) => // done
			{
				universe.worldSet(world);

				var venueNext = universe.world.toVenue();
				universe.venueTransitionTo(venueNext);
			}
		);

		messageAsDataBinding.contextSet(venueTask);

		var returnValue =
			universe.controlBuilder.venueTransitionalFromTo
			(
				universe.venueCurrent(),
				venueTask
			);

		return returnValue;
	}

}

}