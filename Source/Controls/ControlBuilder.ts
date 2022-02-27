
namespace ThisCouldBeBetter.GameFramework
{

export class ControlBuilder
{
	styles: ControlStyle[];
	stylesByName: Map<string,ControlStyle>;
	venueTransitionalFromTo: (vFrom: Venue, vTo: Venue) => Venue;

	buttonHeightBase: number;
	buttonHeightSmallBase: number;
	fontBase: FontNameAndHeight;
	fontHeightInPixelsBase: number;
	sizeBase: Coords;

	_zeroes: Coords;
	_scaleMultiplier: Coords;

	constructor
	(
		styles: Array<ControlStyle>,
		venueTransitionalFromTo: (vFrom: Venue, vTo: Venue) => Venue
	)
	{
		this.styles = styles || ControlStyle.Instances()._All;
		this.venueTransitionalFromTo =
			venueTransitionalFromTo || this.venueFaderFromTo;

		this.stylesByName = ArrayHelper.addLookupsByName(this.styles);

		this.fontBase = FontNameAndHeight.default();
		this.fontHeightInPixelsBase = this.fontBase.heightInPixels;
		this.buttonHeightBase = this.fontHeightInPixelsBase * 2;
		this.buttonHeightSmallBase = this.fontHeightInPixelsBase * 1.5;
		this.sizeBase = new Coords(200, 150, 1);

		// Helper variables.

		this._zeroes = Coords.create();
		this._scaleMultiplier = Coords.create();
	}

	static default(): ControlBuilder
	{
		return new ControlBuilder(null, null);
	}

	static fromStyles(styles: ControlStyle[]): ControlBuilder
	{
		return new ControlBuilder( styles, null);
	}

	styleByName(styleName: string): ControlStyle
	{
		return this.stylesByName.get(styleName);
	}

	styleDefault(): ControlStyle
	{
		return this.styles[0];
	}

	venueFaderFromTo(vFrom: Venue, vTo: Venue): VenueFader
	{
		if (vTo.constructor.name == VenueFader.name)
		{
			vTo = (vTo as VenueFader).venueToFadeTo();
		}
		var returnValue = VenueFader.fromVenuesToAndFrom(vTo, vFrom);
		return returnValue;
	}

	// Controls.

	choice
	(
		universe: Universe,
		size: Coords,
		message: DataBinding<any, string>,
		optionNames: Array<string>,
		optionFunctions: Array<()=>void>,
		showMessageOnly: boolean,
		fontNameAndHeight: FontNameAndHeight,
		buttonPosY: number
	): ControlBase
	{
		size = size || universe.display.sizeDefault();
		showMessageOnly = showMessageOnly || false;
		fontNameAndHeight = fontNameAndHeight || this.fontBase;
		var fontHeight = fontNameAndHeight.heightInPixels;

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);
		var containerSizeScaled = size.clone().clearZ().divide(scaleMultiplier);

		var numberOfOptions = optionNames.length;

		if (showMessageOnly && numberOfOptions == 1)
		{
			numberOfOptions = 0; // Is a single option really an option?
		}

		var labelPosY = Math.round
		(
			size.y * (numberOfOptions == 0 ? .5 : (1/3) ) - fontHeight * 2 // hack
		);

		var buttonPosY = buttonPosY || Math.round
		(
			this.sizeBase.y * (numberOfOptions > 0 ? (2 / 3) : 1)
		);

		var marginSize = Coords.oneOneZero().multiplyScalar(fontHeight);
		var labelMessage = new ControlLabel
		(
			"labelMessage",
			marginSize,
			Coords.fromXY
			(
				containerSizeScaled.x - marginSize.x * 2,
				labelPosY
			),
			true, // isTextCenteredHorizontally
			true, // isTextCenteredVertically
			message,
			fontNameAndHeight
		);

		var childControls: ControlBase[] = [ labelMessage ];

		if (showMessageOnly == false)
		{
			var buttonWidth = 55;
			var buttonSize = Coords.fromXY(buttonWidth, fontHeight * 2);
			var spaceBetweenButtons = 5;
			var buttonMarginLeftRight =
				(
					this.sizeBase.x
					- (buttonWidth * numberOfOptions)
					- (spaceBetweenButtons * (numberOfOptions - 1))
				) / 2;

			for (var i = 0; i < numberOfOptions; i++)
			{
				var optionName = optionNames[i];

				var button = ControlButton.from8
				(
					"button" + optionName,
					Coords.fromXY
					(
						buttonMarginLeftRight + i * (buttonWidth + spaceBetweenButtons),
						buttonPosY
					), // pos
					buttonSize.clone(),
					optionName,
					fontNameAndHeight,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					optionFunctions[i]
				);

				childControls.push(button);
			}
		}

		var display = universe.display;
		var displaySize = display.sizeDefault().clone().clearZ().divide(scaleMultiplier);
		var containerPosScaled = displaySize.clone().subtract(containerSizeScaled).half();
		var actions = null;
		if (numberOfOptions <= 1)
		{
			var acknowledge = optionFunctions[0];
			var controlActionNames = ControlActionNames.Instances();
			actions =
			[
				new Action( controlActionNames.ControlCancel, acknowledge ),
				new Action( controlActionNames.ControlConfirm, acknowledge ),
			];
		}

		var controlContainer = new ControlContainer
		(
			"containerChoice",
			containerPosScaled,
			containerSizeScaled,
			childControls,
			actions,
			null //?
		);

		controlContainer.scalePosAndSize(scaleMultiplier);

		var returnValue: ControlBase = null;

		if (showMessageOnly)
		{
			returnValue = new ControlContainerTransparent(controlContainer);
		}
		else
		{
			returnValue = controlContainer;
		}

		return returnValue;
	}

	choice5
	(
		universe: Universe,
		size: Coords,
		message: DataBinding<any, string>,
		optionNames: Array<string>,
		optionFunctions: Array<()=>void>
	): ControlBase
	{
		return this.choice
		(
			universe, size, message, optionNames,
			optionFunctions, null, null, null
		);
	}

	choiceList<TContext, TItem>
	(
		universe: Universe,
		size: Coords,
		message: string,
		options: DataBinding<TContext,TItem[]>,
		bindingForOptionText: DataBinding<TItem,string>,
		buttonSelectText: string,
		select: (u: Universe, itemSelected: TItem) => void
	): ControlBase
	{
		// todo - Variable sizes.

		size = size || universe.display.sizeDefault();

		var marginWidth = 10;
		var marginSize = Coords.fromXY(1, 1).multiplyScalar(marginWidth);
		var fontHeight = 20;
		var font = FontNameAndHeight.fromHeightInPixels(fontHeight);
		var labelSize = Coords.fromXY(size.x - marginSize.x * 2, fontHeight);
		var buttonSize = Coords.fromXY(labelSize.x, fontHeight * 2);
		var listSize = Coords.fromXY
		(
			labelSize.x,
			size.y - labelSize.y - buttonSize.y - marginSize.y * 4
		);

		var listOptions = ControlList.from8
		(
			"listOptions",
			Coords.fromXY(marginSize.x, labelSize.y + marginSize.y * 2),
			listSize,
			options,
			bindingForOptionText,
			font,
			null, // bindingForItemSelected
			null // bindingForItemValue
		);

		var returnValue = ControlContainer.from4
		(
			"containerChoice",
			Coords.create(),
			size,
			[
				new ControlLabel
				(
					"labelMessage",
					Coords.fromXY(size.x / 2, marginSize.y + fontHeight / 2),
					labelSize,
					true, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext(message),
					font
				),

				listOptions,

				new ControlButton
				(
					"buttonSelect",
					Coords.fromXY(marginSize.x, size.y - marginSize.y - buttonSize.y),
					buttonSize,
					buttonSelectText,
					font,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled,
					() => // click
					{
						var itemSelected = listOptions.itemSelected();
						if (itemSelected != null)
						{
							select(universe, itemSelected);
						}
					},
					false // canBeHeldDown
				),
			]
		);

		return returnValue;
	}

	confirm
	(
		universe: Universe,
		size: Coords,
		message: string,
		confirm: () => void,
		cancel: () => void
	): ControlBase
	{
		return this.choice
		(
			universe,
			size,
			DataBinding.fromContext(message),
			["Confirm", "Cancel"],
			[confirm, cancel],
			null, // showMessageOnly
			null, // fontHeight
			null // buttonPosY
		);
	}

	confirmAndReturnToVenue
	(
		universe: Universe, size: Coords, message: string,
		venuePrev: Venue, confirm: () => void, cancel: () => void
	): ControlBase
	{
		var confirmThenReturnToVenuePrev = () =>
		{
			confirm();
			universe.venueTransitionTo(venuePrev);
		}

		var cancelThenReturnToVenuePrev = () =>
		{
			if (cancel != null)
			{
				cancel();
			}
			universe.venueTransitionTo(venuePrev);
		}

		return this.choice
		(
			universe,
			size,
			DataBinding.fromContext(message),
			["Confirm", "Cancel"],
			[confirmThenReturnToVenuePrev, cancelThenReturnToVenuePrev],
			null, // showMessageOnly
			null, // fontHeight
			null // buttonPosY
		);
	}

	game(universe: Universe, size: Coords, venuePrev: Venue): ControlBase
	{
		var controlBuilder = this;

		if (size == null)
		{
			size = universe.display.sizeDefault().clone();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var font = this.fontBase;

		var buttonHeight = this.buttonHeightBase;
		var padding = 5;
		var rowHeight = buttonHeight + padding;
		var rowCount = 5;
		var buttonsAllHeight = rowCount * buttonHeight + (rowCount - 1) * padding;
		var margin = (this.sizeBase.y - buttonsAllHeight) / 2;

		var buttonSize = Coords.fromXY(40, buttonHeight);
		var posX = (this.sizeBase.x - buttonSize.x) / 2;

		var row0PosY = margin;
		var row1PosY = row0PosY + rowHeight;
		var row2PosY = row1PosY + rowHeight;
		var row3PosY = row2PosY + rowHeight;
		var row4PosY = row3PosY + rowHeight;

		var back = () =>
		{
			universe.venueTransitionTo(venuePrev);
		}

		var returnValue = new ControlContainer
		(
			"containerStorage",
			this._zeroes, // pos
			this.sizeBase.clone(),
			// children
			[
				ControlButton.from8
				(
					"buttonSave",
					Coords.fromXY(posX, row0PosY), // pos
					buttonSize.clone(),
					"Save",
					font,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						var venueNext = Profile.toControlSaveStateSave
						(
							universe, size, universe.venueCurrent
						).toVenue();
						universe.venueTransitionTo(venueNext);
					}
				),

				ControlButton.from8
				(
					"buttonLoad",
					Coords.fromXY(posX, row1PosY), // pos
					buttonSize.clone(),
					"Load",
					font,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						var venueNext = Profile.toControlSaveStateLoad
						(
							universe, null, universe.venueCurrent
						).toVenue();
						universe.venueTransitionTo(venueNext);
					}
				),

				ControlButton.from8
				(
					"buttonAbout",
					Coords.fromXY(posX, row2PosY), // pos
					buttonSize.clone(),
					"About",
					font,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						var venueCurrent = universe.venueCurrent;
						var venueNext = new VenueMessage
						(
							DataBinding.fromContext(universe.name + "\nv" + universe.version),
							() => // acknowledge
							{
								universe.venueTransitionTo(venueCurrent);
							},
							universe.venueCurrent, // venuePrev
							size,
							false
						);
						universe.venueTransitionTo(venueNext);
					}
				),

				ControlButton.from8
				(
					"buttonQuit",
					Coords.fromXY(posX, row3PosY), // pos
					buttonSize.clone(),
					"Quit",
					font,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						var controlConfirm = universe.controlBuilder.confirm
						(
							universe,
							size,
							"Are you sure you want to quit?",
							() => // confirm
							{
								universe.reset();
								var venueNext =
									controlBuilder.title(universe, null).toVenue();
								universe.venueTransitionTo(venueNext);
							},
							() => // cancel
							{
								var venueNext = venuePrev;
								universe.venueTransitionTo(venueNext);
							}
						);

						var venueNext: Venue = controlConfirm.toVenue();
						universe.venueTransitionTo(venueNext);
					}
				),

				ControlButton.from8
				(
					"buttonBack",
					Coords.fromXY(posX, row4PosY), // pos
					buttonSize.clone(),
					"Back",
					font,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					back // click
				),
			],

			[ new Action("Back", back) ],

			[ new ActionToInputsMapping( "Back", [ "Escape" ], true ) ],

		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}

	gameAndSettings1(universe: Universe): ControlBase
	{
		return this.gameAndSettings(universe, null, universe.venueCurrent, true);
	}

	gameAndSettings
	(
		universe: Universe, size: Coords, venuePrev: Venue, includeResumeButton: boolean
	): ControlBase
	{
		var controlBuilder = this;

		if (size == null)
		{
			size = universe.display.sizeDefault().clone();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var font = this.fontBase;

		var buttonWidth = 40;
		var buttonHeight = this.buttonHeightBase;
		var padding = 5;
		var rowCount = (includeResumeButton ? 3 : 2);
		var rowHeight = buttonHeight + padding;
		var buttonsAllHeight = rowCount * buttonHeight + (rowCount - 1) * padding;
		var margin = Coords.fromXY
		(
			(this.sizeBase.x - buttonWidth) / 2,
			(this.sizeBase.y - buttonsAllHeight) / 2
		);

		var row0PosY = margin.y;
		var row1PosY = row0PosY + rowHeight;
		var row2PosY = row1PosY + rowHeight;

		var returnValue = new ControlContainer
		(
			"Game",
			this._zeroes.clone(), // pos
			this.sizeBase.clone(),
			// children
			[
				ControlButton.from8
				(
					"buttonGame",
					Coords.fromXY(margin.x, row0PosY), // pos
					Coords.fromXY(buttonWidth, buttonHeight), // size
					"Game",
					font,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						var venueNext =
							controlBuilder.game(universe, null, universe.venueCurrent).toVenue();
						universe.venueTransitionTo(venueNext);
					}
				),

				ControlButton.from8
				(
					"buttonSettings",
					Coords.fromXY(margin.x, row1PosY), // pos
					Coords.fromXY(buttonWidth, buttonHeight), // size
					"Settings",
					font,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						var venueNext = controlBuilder.settings
						(
							universe, null, universe.venueCurrent
						).toVenue();
						universe.venueTransitionTo(venueNext);
					}
				),
			],
			[], // actions
			[] // mappings
		);

		if (includeResumeButton)
		{
			var back = () =>
			{
				universe.venueTransitionTo(venuePrev);
			};

			var buttonResume = ControlButton.from8
			(
				"buttonResume",
				Coords.fromXY(margin.x, row2PosY), // pos
				Coords.fromXY(buttonWidth, buttonHeight), // size
				"Resume",
				this.fontBase,
				true, // hasBorder
				DataBinding.fromTrue(), // isEnabled
				back
			);

			returnValue.children.push(buttonResume);

			returnValue.actions.push(new Action("Back", back));

			returnValue._actionToInputsMappings.push
			(
				new ActionToInputsMapping( "Back", [ "Escape" ], true )
			);
		}

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}

	inputs(universe: Universe, size: Coords, venuePrev: Venue): ControlBase
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var font = this.fontBase;

		var world = universe.world;

		// hack - Should do ALL placeDefns, not just the current one.
		var placeCurrent = world.placeCurrent;
		var placeDefn = placeCurrent.defn(world);

		var returnValue = ControlContainer.from4
		(
			"containerGameControls",
			this._zeroes, // pos
			this.sizeBase.clone(), // size
			// children
			[
				new ControlLabel
				(
					"labelActions",
					Coords.fromXY(100, 15), // pos
					Coords.fromXY(100, 20), // size
					true, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("Actions:"),
					font
				),

				ControlList.from8
				(
					"listActions",
					Coords.fromXY(50, 25), // pos
					Coords.fromXY(100, 40), // size
					DataBinding.fromGet
					(
						(c: PlaceDefn) => placeDefn.actionToInputsMappingsEdited
					), // items
					DataBinding.fromGet
					(
						(c: ActionToInputsMapping) => c.actionName
					), // bindingForItemText
					font,
					new DataBinding
					(
						placeDefn,
						(c: PlaceDefn) => c.actionToInputsMappingSelected,
						(c: PlaceDefn, v: ActionToInputsMapping) => { c.actionToInputsMappingSelected = v; }
					), // bindingForItemSelected
					DataBinding.fromGet( (c: ActionToInputsMapping) => c ) // bindingForItemValue
				),

				new ControlLabel
				(
					"labelInput",
					Coords.fromXY(100, 70), // pos
					Coords.fromXY(100, 15), // size
					true, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("Inputs:"),
					font
				),

				new ControlLabel
				(
					"infoInput",
					Coords.fromXY(100, 80), // pos
					Coords.fromXY(200, 15), // size
					true, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContextAndGet
					(
						placeDefn,
						(c: PlaceDefn) =>
						{
							var i = c.actionToInputsMappingSelected;
							return (i == null ? "-" : i.inputNames.join(", "));
						}
					), // text
					font
				),

				ControlButton.from8
				(
					"buttonClear",
					Coords.fromXY(25, 90), // pos
					Coords.fromXY(45, 15), // size
					"Clear",
					font,
					true, // hasBorder
					DataBinding.fromContextAndGet
					(
						placeDefn,
						(c: PlaceDefn) => { return c.actionToInputsMappingSelected != null}
					), // isEnabled
					() => // click
					{
						var mappingSelected = placeDefn.actionToInputsMappingSelected;
						if (mappingSelected != null)
						{
							mappingSelected.inputNames.length = 0;
						}
					}
				),

				ControlButton.from8
				(
					"buttonAdd",
					Coords.fromXY(80, 90), // pos
					Coords.fromXY(45, 15), // size
					"Add",
					font,
					true, // hasBorder
					DataBinding.fromContextAndGet
					(
						placeDefn,
						(c: PlaceDefn) => (c.actionToInputsMappingSelected != null)
					), // isEnabled
					() => // click
					{
						var mappingSelected = placeDefn.actionToInputsMappingSelected;
						if (mappingSelected != null)
						{
							var venueInputCapture = new VenueInputCapture
							(
								universe.venueCurrent,
								(inputCaptured: Input) =>
								{
									var inputName = inputCaptured.name;
									mappingSelected.inputNames.push(inputName);
								}
							);
							universe.venueNext = venueInputCapture
						}
					}
				),

				ControlButton.from8
				(
					"buttonRestoreDefault",
					Coords.fromXY(135, 90), // pos
					Coords.fromXY(45, 15), // size
					"Default",
					font,
					true, // hasBorder
					DataBinding.fromContextAndGet
					(
						placeDefn,
						(c: PlaceDefn) => (c.actionToInputsMappingSelected != null)
					), // isEnabled
					() => // click
					{
						var mappingSelected = placeDefn.actionToInputsMappingSelected;
						if (mappingSelected != null)
						{
							var mappingDefault = placeDefn.actionToInputsMappingsDefault.filter
							(
								(x: ActionToInputsMapping) => (x.actionName == mappingSelected.actionName)
							)[0];
							mappingSelected.inputNames = mappingDefault.inputNames.slice();
						}
					}
				),

				ControlButton.from8
				(
					"buttonRestoreDefaultsAll",
					Coords.fromXY(50, 110), // pos
					Coords.fromXY(100, 15), // size
					"Default All",
					font,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() =>
					{
						var venueInputs = universe.venueCurrent;
						var controlConfirm = universe.controlBuilder.confirmAndReturnToVenue
						(
							universe,
							size,
							"Are you sure you want to restore defaults?",
							venueInputs,
							() => // confirm
							{
								placeDefn.actionToInputsMappingsRestoreDefaults();
							},
							null // cancel
						);
						var venueNext = controlConfirm.toVenue();
						universe.venueTransitionTo(venueNext);
					}
				),

				ControlButton.from8
				(
					"buttonCancel",
					Coords.fromXY(50, 130), // pos
					Coords.fromXY(45, 15), // size
					"Cancel",
					font,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						universe.venueTransitionTo(venuePrev);
					}
				),

				ControlButton.from8
				(
					"buttonSave",
					Coords.fromXY(105, 130), // pos
					Coords.fromXY(45, 15), // size
					"Save",
					font,
					true, // hasBorder
					// isEnabled
					DataBinding.fromContextAndGet
					(
						placeDefn,
						(c: PlaceDefn) =>
						{
							var mappings = c.actionToInputsMappingsEdited;
							var doAnyActionsLackInputs = mappings.some
							(
								(x: ActionToInputsMapping) => (x.inputNames.length == 0)
							);
							return (doAnyActionsLackInputs == false);
						}
					),
					() => // click
					{
						placeDefn.actionToInputsMappingsSave();
						universe.venueTransitionTo(venuePrev);
					}
				)
			]
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}

	message
	(
		universe: Universe,
		size: Coords,
		message: DataBinding<any, string>,
		acknowledge: () => void,
		showMessageOnly: boolean,
		fontNameAndHeight: FontNameAndHeight
	): ControlBase
	{
		var optionNames = [];
		var optionFunctions = [];

		if (acknowledge != null)
		{
			optionNames.push("Acknowledge");
			optionFunctions.push(acknowledge);
		}

		return this.choice
		(
			universe,
			size,
			message,
			optionNames,
			optionFunctions,
			showMessageOnly,
			fontNameAndHeight,
			null // buttonPosY
		);
	}

	message4
	(
		universe: Universe,
		size: Coords,
		message: DataBinding<any, string>,
		acknowledge: () => void
	)
	{
		return this.message(universe, size, message, acknowledge, null, null);
	}


	opening(universe: Universe, size: Coords): ControlBase
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var fontHeight = this.fontHeightInPixelsBase;

		var goToVenueNext = () =>
		{
			universe.soundHelper.soundsAllStop(universe);

			var venueNext = this.producer(universe, size).toVenue();
			universe.venueTransitionTo(venueNext);
		};

		var visual: VisualBase = new VisualGroup
		([
			new VisualImageScaled
			(
				size, new VisualImageFromLibrary("Titles_Opening")
			)
			// Note: Sound won't work on the opening screen,
			// because the user has to interact somehow
			// before the browser will play sound.
		]);

		var controlActionNames = ControlActionNames.Instances();

		var returnValue = new ControlContainer
		(
			"containerOpening",
			this._zeroes, // pos
			this.sizeBase.clone(), // size
			// children
			[
				new ControlVisual
				(
					"imageOpening",
					this._zeroes.clone(),
					this.sizeBase.clone(), // size
					DataBinding.fromContext(visual),
					null, null // colors
				),

				ControlButton.from8
				(
					"buttonNext",
					Coords.fromXY(75, 120), // pos
					Coords.fromXY(50, fontHeight * 2), // size
					"Next",
					FontNameAndHeight.fromHeightInPixels(fontHeight * 2),
					false, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					goToVenueNext // click
				)
			], // end children

			[
				new Action( controlActionNames.ControlCancel, goToVenueNext ),
				new Action( controlActionNames.ControlConfirm, goToVenueNext )
			],

			null
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}

	producer(universe: Universe, size: Coords): ControlBase
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var fontHeight = this.fontHeightInPixelsBase;

		var goToVenueNext = () =>
		{
			universe.soundHelper.soundsAllStop(universe);

			var venueTitle = this.title(universe, size).toVenue();
			universe.venueTransitionTo(venueTitle);
		};

		var visual: VisualBase = new VisualGroup
		([
			new VisualImageScaled
			(
				size, new VisualImageFromLibrary("Titles_Producer")
			),
			new VisualSound("Music_Producer", false) // repeat
		]);

		var controlActionNames = ControlActionNames.Instances();

		var returnValue = new ControlContainer
		(
			"containerProducer",
			this._zeroes, // pos
			this.sizeBase.clone(), // size
			// children
			[
				new ControlVisual
				(
					"imageProducer",
					this._zeroes.clone(),
					this.sizeBase.clone(), // size
					DataBinding.fromContext(visual),
					null, null // colors
				),

				ControlButton.from8
				(
					"buttonNext",
					Coords.fromXY(75, 120), // pos
					Coords.fromXY(50, fontHeight * 2), // size
					"Next",
					FontNameAndHeight.fromHeightInPixels(fontHeight * 2),
					false, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					goToVenueNext // click
				)
			], // end children

			[
				new Action( controlActionNames.ControlCancel, goToVenueNext ),
				new Action( controlActionNames.ControlConfirm, goToVenueNext )
			],

			null
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}

	settings(universe: Universe, size: Coords, venuePrev: Venue): ControlBase
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var font = this.fontBase;

		var buttonHeight = this.buttonHeightBase;
		var margin = 15;
		var padding = 5;
		var labelPadding = 3;

		var rowHeight = buttonHeight + padding;
		var row0PosY = margin;
		var row1PosY = row0PosY + rowHeight / 2;
		var row2PosY = row1PosY + rowHeight;
		var row3PosY = row2PosY + rowHeight;
		var row4PosY = row3PosY + rowHeight;

		var back = () =>
		{
			universe.venueTransitionTo(venuePrev);
		};

		var returnValue = new ControlContainer
		(
			"containerSettings",
			this._zeroes, // pos
			this.sizeBase.clone(),
			// children
			[
				new ControlLabel
				(
					"labelMusicVolume",
					Coords.fromXY(30, row1PosY + labelPadding), // pos
					Coords.fromXY(75, buttonHeight), // size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("Music:"),
					font
				),

				new ControlSelect
				(
					"selectMusicVolume",
					Coords.fromXY(70, row1PosY), // pos
					Coords.fromXY(30, buttonHeight), // size
					new DataBinding
					(
						universe.soundHelper,
						(c: SoundHelper) => c.musicVolume,
						(c: SoundHelper, v: number) => c.musicVolume = v
					), // valueSelected
					DataBinding.fromContextAndGet
					(
						universe.soundHelper,
						(c: SoundHelper) => c.controlSelectOptionsVolume()
					), // options
					DataBinding.fromGet
					(
						(c: ControlSelectOption<number>) => c.value
					), // bindingForOptionValues,
					DataBinding.fromGet
					(
						(c: ControlSelectOption<number>) => c.text
					), // bindingForOptionText
					font
				),

				new ControlLabel
				(
					"labelSoundVolume",
					Coords.fromXY(105, row1PosY + labelPadding), // pos
					Coords.fromXY(75, buttonHeight), // size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("Sound:"),
					font
				),

				new ControlSelect
				(
					"selectSoundVolume",
					Coords.fromXY(140, row1PosY), // pos
					Coords.fromXY(30, buttonHeight), // size
					new DataBinding
					(
						universe.soundHelper,
						(c: SoundHelper) => c.soundVolume,
						(c: SoundHelper, v: number) => { c.soundVolume = v; }
					), // valueSelected
					DataBinding.fromContextAndGet
					(
						universe.soundHelper,
						(c: SoundHelper) => c.controlSelectOptionsVolume()
					), // options
					DataBinding.fromGet
					(
						(c: ControlSelectOption<number>) => c.value
					), // bindingForOptionValues,
					DataBinding.fromGet
					(
						(c: ControlSelectOption<number>) => c.text
					), // bindingForOptionText
					font
				),

				new ControlLabel
				(
					"labelDisplaySize",
					Coords.fromXY(30, row2PosY + labelPadding), // pos
					Coords.fromXY(75, buttonHeight), // size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("Display:"),
					font
				),

				new ControlSelect<Display, Coords, Coords>
				(
					"selectDisplaySize",
					Coords.fromXY(70, row2PosY), // pos
					Coords.fromXY(65, buttonHeight), // size
					DataBinding.fromContextAndGet
					(
						universe.display,
						(c: Display) => c.sizeInPixels
					), // valueSelected
					// options
					DataBinding.fromContextAndGet
					(
						universe.display,
						(c: Display) => c.sizesAvailable
					),
					DataBinding.fromGet( (c: Coords) => c ), // bindingForOptionValues,
					DataBinding.fromGet( (c: Coords) => c.toStringXY() ), // bindingForOptionText
					font
				),

				ControlButton.from8
				(
					"buttonDisplaySizeChange",
					Coords.fromXY(140, row2PosY), // pos
					Coords.fromXY(30, buttonHeight), // size
					"Change",
					font,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						var venueControls = universe.venueCurrent as VenueControls;
						var controlRootAsContainer =
							venueControls.controlRoot as ControlContainer;
						var selectDisplaySizeAsControl =
							controlRootAsContainer.childrenByName.get("selectDisplaySize");
						var selectDisplaySize =
							selectDisplaySizeAsControl as ControlSelect<Coords, Coords, Coords>;
						var displaySizeSpecified = selectDisplaySize.optionSelected();

						var displayAsDisplay = universe.display;
						var display = displayAsDisplay as Display2D;
						var platformHelper = universe.platformHelper;
						platformHelper.platformableRemove(display);
						display.sizeInPixels = displaySizeSpecified;
						display.canvas = null; // hack
						display.initialize(universe);
						platformHelper.initialize(universe);

						var venueNext = universe.controlBuilder.settings
						(
							universe, null, universe.venueCurrent
						).toVenue();
						universe.venueTransitionTo(venueNext);
					}
				),

				ControlButton.from8
				(
					"buttonInputs",
					Coords.fromXY(70, row3PosY), // pos
					Coords.fromXY(65, buttonHeight), // size
					"Inputs",
					font,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						var venueCurrent = universe.venueCurrent;
						var controlGameControls =
							universe.controlBuilder.inputs(universe, size, venueCurrent);
						var venueNext = controlGameControls.toVenue();
						universe.venueTransitionTo(venueNext);
					}
				),

				ControlButton.from8
				(
					"buttonDone",
					Coords.fromXY(70, row4PosY), // pos
					Coords.fromXY(65, buttonHeight), // size
					"Done",
					font,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					back // click
				),
			],

			[ new Action("Back", back) ],

			[ new ActionToInputsMapping( "Back", [ "Escape" ], true ) ],

		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}

	slideshow
	(
		universe: Universe, size: Coords,
		imageNamesAndMessagesForSlides: string[][],
		venueAfterSlideshow: Venue
	): ControlBase
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var controlsForSlides = new Array<ControlBase>();

		var nextDefn = (slideIndexNext: number) => // click
		{
			var venueNext;
			if (slideIndexNext < controlsForSlides.length)
			{
				var controlForSlideNext = controlsForSlides[slideIndexNext];
				venueNext = controlForSlideNext.toVenue();
			}
			else
			{
				venueNext = venueAfterSlideshow;
			}
			universe.venueTransitionTo(venueNext);
		};

		var skip = () =>
		{
			universe.venueTransitionTo(venueAfterSlideshow);
		};

		for (var i = 0; i < imageNamesAndMessagesForSlides.length; i++)
		{
			var imageNameAndMessage = imageNamesAndMessagesForSlides[i];
			var imageName = imageNameAndMessage[0];
			var message = imageNameAndMessage[1];

			var next = nextDefn.bind(this, i + 1);

			var containerSlide = new ControlContainer
			(
				"containerSlide_" + i,
				this._zeroes, // pos
				this.sizeBase.clone(), // size
				// children
				[
					new ControlVisual
					(
						"imageSlide",
						this._zeroes,
						this.sizeBase.clone(), // size
						DataBinding.fromContext
						(
							new VisualImageScaled
							(
								this.sizeBase.clone().multiply(scaleMultiplier), // sizeToDrawScaled
								new VisualImageFromLibrary(imageName)
							) as VisualBase
						),
						null, null // colorBackground, colorBorder
					),

					new ControlLabel
					(
						"labelSlideText",
						Coords.fromXY(0, this.fontHeightInPixelsBase), // pos
						Coords.fromXY
						(
							this.sizeBase.x,
							this.fontHeightInPixelsBase
						), // size
						true, // isTextCenteredHorizontally
						false, // isTextCenteredVertically
						DataBinding.fromContext(message),
						this.fontBase
					),

					ControlButton.from8
					(
						"buttonNext",
						Coords.fromXY(75, 120), // pos
						Coords.fromXY(50, 40), // size
						"Next",
						this.fontBase,
						false, // hasBorder
						DataBinding.fromTrue(), // isEnabled
						next
					)
				],

				[
					new Action( ControlActionNames.Instances().ControlCancel, skip ),
					new Action( ControlActionNames.Instances().ControlConfirm, next )
				],

				null

			);

			containerSlide.scalePosAndSize(scaleMultiplier);

			controlsForSlides.push(containerSlide);
		}

		return controlsForSlides[0];
	}

	title(universe: Universe, size: Coords): ControlBase
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var fontHeight = this.fontHeightInPixelsBase;

		var start = () =>
		{
			var venueMessage = VenueMessage.fromText("Loading profiles...");

			var venueTask = new VenueTask
			(
				venueMessage,
				() =>
					Profile.toControlProfileSelect(universe, null, universe.venueCurrent),
				(result: ControlBase) => // done
				{
					var venueProfileSelect = result.toVenue();
					universe.venueTransitionTo(venueProfileSelect);
				}
			);

			universe.venueTransitionTo(venueTask);
		};

		var visual: VisualBase = new VisualGroup
		([
			new VisualImageScaled
			(
				size, new VisualImageFromLibrary("Titles_Title")
			),
			new VisualSound("Music_Title", true) // isMusic
		]);

		var returnValue = new ControlContainer
		(
			"containerTitle",
			this._zeroes, // pos
			this.sizeBase.clone(), // size
			// children
			[
				ControlVisual.from4
				(
					"imageTitle",
					this._zeroes.clone(),
					this.sizeBase.clone(), // size
					DataBinding.fromContext(visual)
				),

				ControlButton.from8
				(
					"buttonStart",
					Coords.fromXY(75, 120), // pos
					Coords.fromXY(50, fontHeight * 2), // size
					"Start",
					FontNameAndHeight.fromHeightInPixels(fontHeight * 2),
					false, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					start // click
				)
			], // end children

			[
				new Action( ControlActionNames.Instances().ControlCancel, start ),
				new Action( ControlActionNames.Instances().ControlConfirm, start )
			],

			null
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}

	worldDetail(universe: Universe, size: Coords, venuePrev: Venue): ControlBase
	{
		var controlBuilder = this;

		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var sizeBase = this.sizeBase;
		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(sizeBase);

		var font = this.fontBase;

		var world = universe.world;

		var dateCreated = world.dateCreated;
		var dateSaved = world.dateSaved;

		var returnValue = ControlContainer.from4
		(
			"containerWorldDetail",
			this._zeroes, // pos
			sizeBase.clone(), // size
			// children
			[
				new ControlLabel
				(
					"labelProfileName",
					Coords.fromXY(0, 40), // pos
					Coords.fromXY(sizeBase.x, 20), // size
					true, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext
					(
						"Profile: " + universe.profile.name
					),
					font
				),
				new ControlLabel
				(
					"labelWorldName",
					Coords.fromXY(0, 55), // pos
					Coords.fromXY(sizeBase.x, 25), // size
					true, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("World: " + world.name),
					font
				),
				new ControlLabel
				(
					"labelStartDate",
					Coords.fromXY(0, 70), // pos
					Coords.fromXY(sizeBase.x, 25), // size
					true, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext
					(
						"Started: " + dateCreated.toStringTimestamp()
					),
					font
				),
				new ControlLabel
				(
					"labelSavedDate",
					Coords.fromXY(0, 85), // pos
					Coords.fromXY(sizeBase.x, 25), // size
					true, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext
					(
						"Saved: "
						+ (dateSaved == null ? "[never]" : dateSaved.toStringTimestamp())
					),
					font
				),

				ControlButton.from8
				(
					"buttonStart",
					Coords.fromXY(50, 100), // pos
					Coords.fromXY(100, this.buttonHeightBase), // size
					"Start",
					font,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						var world = universe.world;
						var venueWorld = world.toVenue();
						var venueNext;
						if (world.dateSaved != null)
						{
							venueNext = venueWorld;
						}
						else
						{
							var textInstructions =
								universe.mediaLibrary.textStringGetByName("Instructions");
							var instructions = textInstructions.value;
							var controlInstructions = controlBuilder.message4
							(
								universe,
								size,
								DataBinding.fromContext(instructions),
								() => // acknowledge
								{
									universe.venueTransitionTo(venueWorld);
								}
							);

							var venueInstructions =
								controlInstructions.toVenue();

							var venueMovie = new VenueVideo
							(
								"Movie", // videoName
								venueInstructions // fader implicit
							);

							venueNext = venueMovie;
						}

						universe.venueTransitionTo(venueNext);
					}
				),

				ControlButton.from8
				(
					"buttonBack",
					Coords.fromXY(10, 10), // pos
					Coords.fromXY(15, 15), // size
					"<",
					font,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						universe.venueTransitionTo(venuePrev);
					}
				),

				ControlButton.from8
				(
					"buttonDelete",
					Coords.fromXY(180, 10), // pos
					Coords.fromXY(15, 15), // size
					"x",
					font,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						var saveState = universe.profile.saveStateSelected();
						var saveStateName = saveState.name;

						var controlConfirm = universe.controlBuilder.confirmAndReturnToVenue
						(
							universe,
							size,
							"Delete save \""
								+ saveStateName
								+ "\"?",
							universe.venueCurrent,
							() => // confirm
							{
								var storageHelper = universe.storageHelper;

								var profile = universe.profile;

								var saveStates = profile.saveStates;
								ArrayHelper.remove(saveStates, saveState);
								storageHelper.save(profile.name, profile);

								universe.world = null;
								storageHelper.delete(saveStateName);
							},
							null // cancel
						);

						var venueNext = controlConfirm.toVenue();
						universe.venueTransitionTo(venueNext);

						universe.venueNext = venueNext;
					}
				),
			] // end children
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}

	worldLoad(universe: Universe, size: Coords): ControlBase
	{
		var controlBuilder = this;

		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var font = this.fontBase;

		var confirm = () =>
		{
			var storageHelper = universe.storageHelper;

			var messageAsDataBinding = DataBinding.fromContextAndGet
			(
				null, // Will be set below.
				(c: VenueTask<SaveStateBase>) => "Loading game..."
			);

			var venueMessage = VenueMessage.fromMessage
			(
				messageAsDataBinding
			);

			var venueTask = new VenueTask
			(
				venueMessage,
				() => // perform
				{
					var profile = universe.profile;
					var saveStateSelected = profile.saveStateSelected;
					return storageHelper.load<SaveStateBase>(saveStateSelected.name);
				},
				(saveStateReloaded: SaveStateBase) => // done
				{
					universe.world = saveStateReloaded.toWorld(universe);
					var venueNext = universe.controlBuilder.worldLoad
					(
						universe, null
					).toVenue();
					universe.venueTransitionTo(venueNext);
				}
			);

			messageAsDataBinding.contextSet(venueTask);

			universe.venueTransitionTo(venueTask);
		};

		var cancel = () =>
		{
			var venueNext = controlBuilder.worldLoad(universe, null).toVenue();
			universe.venueTransitionTo(venueNext);
		};

		var loadFile = () =>
		{
			var venueFileUpload = new VenueFileUpload(null, null);

			var acknowledge = () =>
			{
				var callback = (fileContentsAsString: string) =>
				{
					var worldAsStringCompressed =
						fileContentsAsString;
					var compressor =
						universe.storageHelper.compressor;
					var worldSerialized =
						compressor.decompressString(worldAsStringCompressed);
					var worldCreator = universe.worldCreator;
					var worldBlank = worldCreator.worldCreate(universe, worldCreator);
					var worldDeserialized = worldBlank.fromStringJson(worldSerialized, universe);
					universe.world = worldDeserialized;

					var venueNext = controlBuilder.game
					(
						universe, size, universe.venueCurrent
					).toVenue();
					universe.venueTransitionTo(venueNext);
				}

				var inputFile = venueFileUpload.toDomElement().getElementsByTagName("input")[0];
				var fileToLoad = inputFile.files[0];
				new FileHelper().loadFileAsBinaryString
				(
					fileToLoad,
					callback,
					null // contextForCallback
				);
			};

			var controlMessageReadyToLoad =
				universe.controlBuilder.message4
				(
					universe,
					size,
					DataBinding.fromContext("Ready to load from file..."),
					acknowledge
				);

			var venueMessageReadyToLoad =
				controlMessageReadyToLoad.toVenue();

			var controlMessageCancelled = universe.controlBuilder.message4
			(
				universe,
				size,
				DataBinding.fromContext("No file specified."),
				() => // acknowlege
				{
					var venueNext = controlBuilder.game
					(
						universe, size, universe.venueCurrent
					).toVenue();
					universe.venueTransitionTo(venueNext);
				}
			);

			var venueMessageCancelled = controlMessageCancelled.toVenue();

			venueFileUpload.venueNextIfFileSpecified = venueMessageReadyToLoad;
			venueFileUpload.venueNextIfCancelled = venueMessageCancelled;

			universe.venueNext = venueFileUpload;
		};


		var returnValue = ControlContainer.from4
		(
			"containerWorldLoad",
			this._zeroes, // pos
			this.sizeBase.clone(), // size
			// children
			[
				new ControlLabel
				(
					"labelProfileName",
					Coords.fromXY(100, 25), // pos
					Coords.fromXY(120, 25), // size
					true, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext
					(
						"Profile: " + universe.profile.name
					),
					font
				),

				new ControlLabel
				(
					"labelSelectASave",
					Coords.fromXY(100, 40), // pos
					Coords.fromXY(100, 25), // size
					true, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("Select a Save:"),
					font
				),

				ControlList.from8
				(
					"listSaveStates",
					Coords.fromXY(30, 50), // pos
					Coords.fromXY(140, 50), // size
					DataBinding.fromContextAndGet
					(
						universe.profile,
						(c: Profile) => c.saveStates
					), // items
					DataBinding.fromGet( (c: SaveStateBase) => c.name ), // bindingForOptionText
					font,
					new DataBinding
					(
						universe.profile,
						(c: Profile) => c.saveStateSelected(),
						(c: Profile, v: SaveStateBase) =>
							c.saveStateNameSelected = v.name
					), // bindingForOptionSelected
					DataBinding.fromGet( (v: SaveStateBase) => v.name ), // value
				),

				ControlButton.from8
				(
					"buttonLoadFromServer",
					Coords.fromXY(30, 105), // pos
					Coords.fromXY(40, this.buttonHeightBase), // size
					"Load",
					font,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						var controlConfirm = universe.controlBuilder.confirm
						(
							universe, size, "Abandon the current game?",
							confirm, cancel
						);
						var venueConfirm = controlConfirm.toVenue();
						universe.venueTransitionTo(venueConfirm);
					}
				),

				ControlButton.from8
				(
					"buttonLoadFromFile",
					Coords.fromXY(80, 105), // pos
					Coords.fromXY(40, this.buttonHeightBase), // size
					"Load File",
					font,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					loadFile
				),

				ControlButton.from8
				(
					"buttonReturn",
					Coords.fromXY(130, 105), // pos
					Coords.fromXY(40, this.buttonHeightBase), // size
					"Return",
					font,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						var venueGame = controlBuilder.game
						(
							universe, size, universe.venueCurrent
						).toVenue();
						universe.venueTransitionTo(venueGame);
					}
				),
			]
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}
}

}
