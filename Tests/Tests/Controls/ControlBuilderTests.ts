
class ControlBuilderTests extends TestFixture
{
	_controlBuilder: ControlBuilder;
	_universe: Universe;

	constructor()
	{
		super(ControlBuilderTests.name);
		this._universe = new MockEnvironment().universe;
		this._controlBuilder = this._universe.controlBuilder;
	}

	tests(): ( ()=>void )[]
	{
		var tests =
		[
			//this.styleByName,
			//this.styleDefault,

			this.choice,
			this.choiceList,
			this.confirm,
			this.confirmAndReturnToVenue,
			this.game,
			this.gameAndSettings,
			this.gameAndSettings1,
			this.inputs,
			this.opening,
			this.settings,
			this.slideshow,
			this.title,
			this.worldDetail,
			this.worldLoad
		];

		return tests;
	}

	// Tests.

	styleByName(): void
	{
		var styleName = "Default";
		var style = this._controlBuilder.styleByName(styleName);
		Assert.isNotNull(style);
	}

	styleDefault(): void
	{
		var style = this._controlBuilder.styleDefault();
		Assert.isNotNull(style);
	}

	// Controls.

	choice(): void
	{
		var controlChoice = this._controlBuilder.choice
		(
			this._universe,
			null, // size,
			DataBinding.fromContext("[message]"),
			[ "[option1]", "[option2]" ], // optionNames
			[ () => {}, () => {} ], // optionFunctions
			true, // showMessageOnly
			FontNameAndHeight.default(),
			null // buttonPosY
		);
		Assert.isNotNull(controlChoice);
	}

	choiceList(): void
	{
		var controlChoiceList = this._controlBuilder.choiceList
		(
			this._universe,
			null, // size
			"[message]",
			DataBinding.fromContext
			([
				"[option1]", "[option2]"
			]), // options
			DataBinding.fromGet( (c) => c ),
			"[buttonSelectText]",
			(u: Universe, optionSelected: any) => {} // select
		);
		Assert.isNotNull(controlChoiceList);
	}

	confirm(): void
	{
		var controlConfirm = this._controlBuilder.confirm
		(
			this._universe,
			null, // size
			"[message]",
			() => {}, // confirm
			() => {} // cancel
		);
		Assert.isNotNull(controlConfirm);
	}

	confirmAndReturnToVenue(): void
	{
		var controlConfirm = this._controlBuilder.confirm
		(
			this._universe,
			null, // size
			"[message]",
			() => {}, // confirm
			() => {} // cancel
		);
		Assert.isNotNull(controlConfirm);
	}

	game(): void
	{
		var controlGame = this._controlBuilder.game
		(
			this._universe,
			null, // size
			null // venuePrev
		);
		Assert.isNotNull(controlGame);
	}

	gameAndSettings(): void
	{
		var controlGameAndSettings = this._controlBuilder.gameAndSettings
		(
			this._universe,
			null, // size
			null, // venuePrev
			true // includeResumeButton
		);
		Assert.isNotNull(controlGameAndSettings);
	}

	gameAndSettings1(): void
	{
		var controlGameAndSettings = this._controlBuilder.gameAndSettings1
		(
			this._universe,
		);
		Assert.isNotNull(controlGameAndSettings);
	}

	inputs(): void
	{
		var controlInputs = this._controlBuilder.inputs
		(
			this._universe,
			null, // size
			null // venuePrev
		);
		Assert.isNotNull(controlInputs);
	}

	message(): void
	{
		var controlMessage = this._controlBuilder.message
		(
			this._universe,
			null, // size
			DataBinding.fromContext("[message]"),
			() => {}, // acknowledge
			false, // showMessageOnly
			FontNameAndHeight.default()
		);
		Assert.isNotNull(controlMessage);
	}

	opening(): void
	{
		var controlOpening = this._controlBuilder.opening
		(
			this._universe,
			null // size
		);
		Assert.isNotNull(controlOpening);
	}

	settings(): void // universe: Universe, size: Coords, venuePrev: Venue)
	{
		var controlSettings = this._controlBuilder.settings
		(
			this._universe,
			null, // size
			null, // venuePrev
		);
		Assert.isNotNull(controlSettings);
	}

	slideshow(): void
	{
		var controlSlideshow = this._controlBuilder.slideshow
		(
			this._universe,
			null, // size
			[
				[ "[imageName]", "[message]"]
			],
			null // venueAfterSlideshow
		)
		Assert.isNotNull(controlSlideshow);
	}

	title(): void
	{
		var controlTitle = this._controlBuilder.title
		(
			this._universe,
			null // size
		);
		Assert.isNotNull(controlTitle);
	}

	worldDetail(): void
	{
		var controlWorldDetail = this._controlBuilder.worldDetail
		(
			this._universe,
			null, // size
			null // venuePrev
		);
		Assert.isNotNull(controlWorldDetail);
	}

	worldLoad(): void
	{
		var controlWorldLoad = this._controlBuilder.worldLoad
		(
			this._universe,
			null // size
		);
		Assert.isNotNull(controlWorldLoad);
	}
}
