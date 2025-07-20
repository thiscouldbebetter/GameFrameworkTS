
namespace ThisCouldBeBetter.GameFramework
{

export class ControlBuilder
{
	styles: ControlStyle[];
	venueTransitionalFromTo: (vFrom: Venue, vTo: Venue) => Venue;
	profileMenusAreIncluded: boolean;

	buttonHeightBase: number;
	buttonHeightSmallBase: number;
	fontBase: FontNameAndHeight;
	fontHeightInPixelsBase: number;
	sizeBase: Coords;
	stylesByName: Map<string, ControlStyle>;

	_zeroes: Coords;
	_scaleMultiplier: Coords;

	constructor
	(
		styles: Array<ControlStyle>,
		venueTransitionalFromTo: (vFrom: Venue, vTo: Venue) => Venue,
		profileMenusAreIncluded: boolean
	)
	{
		this.styles = styles || ControlStyle.Instances()._All;
		this.venueTransitionalFromTo =
			venueTransitionalFromTo || this.venueFaderFromTo;
		this.profileMenusAreIncluded = profileMenusAreIncluded || false;

		this.stylesByName = ArrayHelper.addLookupsByName(this.styles);

		this.fontBase = FontNameAndHeight.default();
		this.fontHeightInPixelsBase = this.fontBase.heightInPixels;
		this.buttonHeightBase = this.fontHeightInPixelsBase * 2;
		this.buttonHeightSmallBase = this.fontHeightInPixelsBase * 1.5;
		this.sizeBase = Coords.fromXYZ(200, 150, 1);

		// Helper variables.

		this._zeroes = Coords.create();
		this._scaleMultiplier = Coords.create();
	}

	static default(): ControlBuilder
	{
		return new ControlBuilder(null, null, true);
	}

	static fromStyle(style: ControlStyle): ControlBuilder
	{
		return ControlBuilder.fromStyles( [ style ] );
	}

	static fromStyles(styles: ControlStyle[]): ControlBuilder
	{
		return new ControlBuilder( styles, null, true);
	}

	profileMenusAreIncludedSet(value: boolean): ControlBuilder
	{
		this.profileMenusAreIncluded = value;
		return this;
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

		var labelMessageSizeY = Math.round
		(
			this.sizeBase.y * (numberOfOptions == 0 ? 1 : (2/3) )
		);

		buttonPosY = buttonPosY || Math.round
		(
			this.sizeBase.y * (numberOfOptions > 0 ? (2 / 3) : 1)
		);

		var labelMessagePos = Coords.fromXY(0, 0);
		var labelMessageSize = Coords.fromXY(this.sizeBase.x, labelMessageSizeY);

		var labelMessage = ControlLabel.fromPosSizeTextFontCentered
		(
			labelMessagePos,
			labelMessageSize,
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

				var button = ControlButton.fromPosSizeTextFontClick
				(
					Coords.fromXY
					(
						buttonMarginLeftRight + i * (buttonWidth + spaceBetweenButtons),
						buttonPosY
					), // pos
					buttonSize.clone(),
					optionName,
					fontNameAndHeight,
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
				Action.fromNameAndPerform(controlActionNames.ControlCancel, acknowledge),
				Action.fromNameAndPerform(controlActionNames.ControlConfirm, acknowledge),
			];
		}

		var controlContainer = ControlContainer.fromNamePosSizeChildrenAndActions
		(
			"containerChoice",
			containerPosScaled,
			containerSizeScaled,
			childControls,
			actions
		);

		controlContainer.scalePosAndSize(scaleMultiplier);

		var returnValue: ControlBase = null;

		if (showMessageOnly)
		{
			returnValue = ControlContainerTransparent.fromContainer(controlContainer);
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

		var labelMessage = ControlLabel.fromPosSizeTextFontCenteredHorizontally
		(
			Coords.fromXY(size.x / 2, marginSize.y + fontHeight / 2),
			labelSize,
			DataBinding.fromContext(message),
			font
		);

		var listOptions = ControlList.fromPosSizeItemsAndBindingForItemText
		(
			Coords.fromXY(marginSize.x, labelSize.y + marginSize.y * 2),
			listSize,
			options,
			bindingForOptionText
		);

		var buttonChoose = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY(marginSize.x, size.y - marginSize.y - buttonSize.y),
			buttonSize,
			buttonSelectText,
			font,
			() => this.choiceList_Choose(universe, listOptions, select)
		);

		var returnValue = ControlContainer.fromNamePosSizeChildren
		(
			"containerChoice",
			Coords.create(),
			size,
			[
				labelMessage,
				listOptions,
				buttonChoose
			]
		);

		return returnValue;
	}

	choiceList_Choose<TContext, TItem, TValue>
	(
		universe: Universe,
		listOptions: ControlList<TContext,TItem,TValue>,
		select: (u: Universe, itemSelected: TItem) => void
	): void
	{
		var itemSelected = listOptions.itemSelected();
		if (itemSelected != null)
		{
			select(universe, itemSelected);
		}
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
		return this.confirmForUniverseSizeMessageConfirmCancel
		(
			universe, size, message, confirm, cancel
		);
	}

	confirmForUniverseSizeMessageConfirmCancel
	(
		universe: Universe,
		size: Coords,
		message: string,
		confirm: () => void,
		cancel: () => void
	): ControlBase
	{
		if (cancel == null)
		{
			cancel = () => universe.venuePrevJumpTo();
		}

		var returnValue = this.choice
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

		return returnValue;
	}

	confirmAndReturnToVenue
	(
		universe: Universe,
		size: Coords,
		message: string,
		venuePrev: Venue,
		confirm: () => void,
		cancel: () => void
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

		var about = () => this.game_About(universe, size);

		var back = () => this.game_Back(universe, venuePrev);

		var quit = () => this.game_Quit(universe, size, venuePrev);

		var save = () => this.game_Save(universe, size);

		var buttonSave = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY(posX, row0PosY), // pos
			buttonSize.clone(),
			"Save",
			font,
			save
		);

		var buttonLoad = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY(posX, row1PosY), // pos
			buttonSize.clone(),
			"Load",
			font,
			() => this.game_Load(universe)
		);

		var buttonAbout = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY(posX, row2PosY), // pos
			buttonSize.clone(),
			"About",
			font,
			about
		);

		var buttonQuit = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY(posX, row3PosY), // pos
			buttonSize.clone(),
			"Quit",
			font,
			quit
		);

		var buttonBack = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY(posX, row4PosY), // pos
			buttonSize.clone(),
			"Back",
			font,
			back // click
		);

		var returnValue = ControlContainer.fromNamePosSizeChildrenActionsAndMappings
		(
			"containerStorage",
			this._zeroes, // pos
			this.sizeBase.clone(),
			// children
			[
				buttonSave,
				buttonLoad,
				buttonAbout,
				buttonQuit,
				buttonBack
			],

			[ Action.fromNameAndPerform("Back", back) ],

			[ new ActionToInputsMapping( "Back", [ Input.Instances().Escape.name ], true ) ],

		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}

	game_About(universe: Universe, size: Coords): void
	{
		var buildTime = _BuildRecord.buildTime();

		var buildTimeAsString =
			(buildTime == null)
			? "[unknown]"
			: buildTime.toISOString().split("T").join("@");

		var aboutTextAsLines =
		[
			universe.name,
			"Version: " + universe.version,
			"Built: " + buildTimeAsString
		];

		var aboutText = aboutTextAsLines.join("\n");

		var venueCurrent = universe.venueCurrent();

		var venueNext = VenueMessage.fromTextAcknowledgeAndSize
		(
			aboutText,
			() => // acknowledge
			{
				universe.venueTransitionTo(venueCurrent);
			},
			size
		);
		universe.venueTransitionTo(venueNext);
	}

	game_Back(universe: Universe, venueToReturnTo: Venue): void
	{
		universe.venueTransitionTo(venueToReturnTo);
	}

	game_Load(universe: Universe): void
	{
		var venueNext = Profile.toControlSaveStateLoad
		(
			universe, null, universe.venueCurrent()
		).toVenue();
		universe.venueTransitionTo(venueNext);
	}

	game_Quit(universe: Universe, size: Coords, venueToReturnTo: Venue): void
	{
		var controlConfirm = universe.controlBuilder.confirm
		(
			universe,
			size,
			"Are you sure you want to quit?",
			() => this.game_Quit_Confirm(universe),
			() => this.game_Quit_Cancel(universe, venueToReturnTo)
		);

		var venueNext: Venue = controlConfirm.toVenue();
		universe.venueTransitionTo(venueNext);
	}

	game_Quit_Cancel(universe: Universe, venueToReturnTo: Venue): void
	{
		var venueNext = venueToReturnTo;
		universe.venueTransitionTo(venueNext);
	};

	game_Quit_Confirm(universe: Universe): void
	{
		universe.reset();
		var venueNext =
			universe.controlBuilder.title(universe, null).toVenue();
		universe.venueTransitionTo(venueNext);
	}

	game_Save(universe: Universe, size: Coords): void
	{
		var venueNext = Profile.toControlSaveStateSave
		(
			universe, size, universe.venueCurrent()
		).toVenue();
		universe.venueTransitionTo(venueNext);
	};

	gameAndSettings1(universe: Universe): ControlBase
	{
		return this.gameAndSettings
		(
			universe,
			null, // size
			universe.venueCurrent(),
			true // includeResumeButton
		);
	}

	gameAndSettings
	(
		universe: Universe,
		size: Coords,
		venuePrev: Venue,
		includeResumeButton: boolean
	): ControlBase
	{

		if (size == null)
		{
			size = universe.display.sizeDefault().clone();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var font = this.fontBase;

		var buttonWidth = 50;
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
		var buttonSize = Coords.fromXY(buttonWidth, buttonHeight);

		var buttonGame = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY(margin.x, row0PosY), // pos
			buttonSize.clone(),
			"Game",
			font,
			() => this.gameAndSettings_TransitionToGameMenu(universe)
		);

		var buttonSettings = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY(margin.x, row1PosY), // pos
			buttonSize.clone(),
			"Settings",
			font,
			() => this.gameAndSettings_Settings(universe)
		);

		var children =
		[
			buttonGame,
			buttonSettings
		];

		var returnValue = ControlContainer.fromNamePosSizeChildren
		(
			"Game",
			this._zeroes.clone(), // pos
			this.sizeBase.clone(),
			children
		);

		if (includeResumeButton)
		{
			var buttonResume = ControlButton.fromPosSizeTextFontClick
			(
				Coords.fromXY(margin.x, row2PosY), // pos
				Coords.fromXY(buttonWidth, buttonHeight), // size
				"Resume",
				this.fontBase,
				() => this.gameAndSettings_Back(universe, venuePrev)
			);

			returnValue.children.push(buttonResume);

			returnValue.actions.push
			(
				Action.fromNameAndPerform
				(
					"Back",
					() => this.gameAndSettings_Back(universe, venuePrev)
				)
			);

			returnValue._actionToInputsMappings.push
			(
				new ActionToInputsMapping( "Back", [ Input.Instances().Escape.name ], true )
			);
		}

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}

	gameAndSettings_Back(universe: Universe, venuePrev: Venue): void
	{
		universe.venueTransitionTo(venuePrev);
	}

	gameAndSettings_Settings(universe: Universe): void
	{
		var venueNext = universe.controlBuilder.settings
		(
			universe, null, universe.venueCurrent()
		).toVenue();
		universe.venueTransitionTo(venueNext);
	}

	gameAndSettings_TransitionToGameMenu(universe: Universe): void
	{
		var venueNext = this.game
		(
			universe, null, universe.venueCurrent()
		).toVenue();
		universe.venueTransitionTo(venueNext);
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

		var labelActions = ControlLabel.fromPosSizeTextFontCenteredHorizontally
		(
			Coords.fromXY(100, 15), // pos
			Coords.fromXY(100, 20), // size
			DataBinding.fromContext("Actions:"),
			font
		);

		var listActions = ControlList.fromNamePosSizeItemsTextFontSelectedValue
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
			DataBinding.fromContextGetAndSet
			(
				placeDefn,
				(c: PlaceDefn) => c.actionToInputsMappingSelected,
				(c: PlaceDefn, v: ActionToInputsMapping) => { c.actionToInputsMappingSelected = v; }
			), // bindingForItemSelected
			DataBinding.fromGet( (c: ActionToInputsMapping) => c ) // bindingForItemValue
		);

		var labelInputs = ControlLabel.fromPosSizeTextFontCenteredHorizontally
		(
			Coords.fromXY(100, 70), // pos
			Coords.fromXY(100, 15), // size
			DataBinding.fromContext("Inputs:"),
			font
		);

		var labelInputNames = ControlLabel.fromPosSizeTextFontCenteredHorizontally
		(
			Coords.fromXY(100, 80), // pos
			Coords.fromXY(200, 15), // size
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
		);

		var buttonClear = ControlButton.fromPosSizeTextFontClick<PlaceDefn>
		(
			Coords.fromXY(25, 90), // pos
			Coords.fromXY(45, 15), // size
			"Clear",
			font,
			() => this.inputs_Clear(placeDefn)
		).isEnabledSet
		(
			DataBinding.fromContextAndGet<PlaceDefn, boolean>
			(
				placeDefn,
				(c: PlaceDefn) => (c.actionToInputsMappingSelected != null)
			)
		);

		var buttonAdd = ControlButton.fromPosSizeTextFontClick<PlaceDefn>
		(
			Coords.fromXY(80, 90), // pos
			Coords.fromXY(45, 15), // size
			"Add",
			font,
			() => this.inputs_Add(universe, placeDefn)
		).isEnabledSet
		(
			DataBinding.fromContextAndGet<PlaceDefn, boolean>
			(
				placeDefn,
				(c: PlaceDefn) => (c.actionToInputsMappingSelected != null)
			)
		);

		var buttonDefault = ControlButton.fromPosSizeTextFontClick<PlaceDefn>
		(
			Coords.fromXY(135, 90), // pos
			Coords.fromXY(45, 15), // size
			"Default",
			font,
			() => this.inputs_ResetSelectedToDefault(placeDefn)
		).isEnabledSet
		(
			DataBinding.fromContextAndGet
			(
				placeDefn,
				(c: PlaceDefn) => (c.actionToInputsMappingSelected != null)
			)
		);

		var buttonDefaultAll = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY(50, 110), // pos
			Coords.fromXY(100, 15), // size
			"Default All",
			font,
			() => this.inputs_ResetAllToDefault(universe, size, placeDefn)
		);

		var buttonCancel = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY(50, 130), // pos
			Coords.fromXY(45, 15), // size
			"Cancel",
			font,
			() => this.inputs_Cancel(universe, venuePrev)
		);

		var buttonSave = ControlButton.fromPosSizeTextFontClick<PlaceDefn>
		(
			Coords.fromXY(105, 130), // pos
			Coords.fromXY(45, 15), // size
			"Save",
			font,
			() => this.inputs_Save(universe, placeDefn, venuePrev)
		).isEnabledSet
		(
			DataBinding.fromContextAndGet<PlaceDefn, boolean>
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
			)
		);

		var returnValue = ControlContainer.fromNamePosSizeChildren
		(
			"containerGameControls",
			this._zeroes, // pos
			this.sizeBase.clone(), // size
			// children
			[
				labelActions,
				listActions,
				labelInputs,
				labelInputNames,
				buttonClear,
				buttonAdd,
				buttonDefault,
				buttonDefaultAll,
				buttonCancel,
				buttonSave
			]
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}

	inputs_Add(universe: Universe, placeDefn: PlaceDefn): void
	{
		var mappingSelected = placeDefn.actionToInputsMappingSelected;
		if (mappingSelected != null)
		{
			var venueInputCapture = VenueInputCapture.fromVenueToReturnToAndCapture
			(
				universe.venueCurrent(),
				(inputCaptured: Input) =>
				{
					var inputName = inputCaptured.name;
					mappingSelected.inputNames.push(inputName);
				}
			);
			universe.venueTransitionTo(venueInputCapture)
		}
	}

	inputs_Cancel(universe: Universe, venuePrev: Venue): void
	{
		universe.venueTransitionTo(venuePrev);
	}

	inputs_Clear(placeDefn: PlaceDefn): void
	{
		var mappingSelected =
			placeDefn.actionToInputsMappingSelected;
		if (mappingSelected != null)
		{
			mappingSelected.inputNames.length = 0;
		}
	}

	inputs_ResetAllToDefault(universe: Universe, size: Coords, placeDefn: PlaceDefn): void
	{
		var venueInputs = universe.venueCurrent();
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

	inputs_ResetSelectedToDefault(placeDefn: PlaceDefn): void
	{
		var mappingSelected = placeDefn.actionToInputsMappingSelected;
		if (mappingSelected != null)
		{
			var mappingDefault = placeDefn.actionToInputsMappingsDefault.filter
			(
				(x: ActionToInputsMapping) =>
					(x.actionName == mappingSelected.actionName)
			)[0];
			mappingSelected.inputNames = mappingDefault.inputNames.slice();
		}
	}

	inputs_Save(universe: Universe, placeDefn: PlaceDefn, venuePrev: Venue): void
	{
		placeDefn.actionToInputsMappingsSave();
		universe.venueTransitionTo(venuePrev);
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

		var returnValue = this.choice
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

		return returnValue;
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

		var visual: VisualBase = VisualGroup.fromChildren
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

		var imageOpening = ControlVisual.fromNamePosSizeVisual
		(
			"imageOpening",
			this._zeroes.clone(),
			this.sizeBase.clone(), // size
			DataBinding.fromContext(visual)
		);

		var goToVenueNext = () => this.opening_GoToVenueNext(universe, size);

		var buttonNext = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY(75, 120), // pos
			Coords.fromXY(50, fontHeight * 2), // size
			"Next",
			FontNameAndHeight.fromHeightInPixels(fontHeight * 2),
			goToVenueNext
		).hasBorderSet(false);

		var actions =
		[
			Action.fromNameAndPerform(controlActionNames.ControlCancel, goToVenueNext),
			Action.fromNameAndPerform(controlActionNames.ControlConfirm, goToVenueNext)
		];

		var returnValue = ControlContainer.fromNamePosSizeChildrenAndActions
		(
			"containerOpening",
			this._zeroes, // pos
			this.sizeBase.clone(), // size
			// children
			[
				imageOpening,
				buttonNext
			],
			actions
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}

	opening_GoToVenueNext(universe: Universe, size: Coords): void
	{
		universe.soundHelper.soundsAllStop(universe);

		var venueNext = this.producer(universe, size).toVenue();
		universe.venueTransitionTo(venueNext);
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

		var visual: VisualBase = VisualGroup.fromChildren
		([
			VisualImageScaled.fromSizeAndChild
			(
				size, new VisualImageFromLibrary("Titles_Producer")
			),
			VisualSound.fromSoundNameAndRepeat("Music_Producer", false) // repeat
		]);

		var controlActionNames = ControlActionNames.Instances();

		var imageProducer = ControlVisual.fromNamePosSizeVisual
		(
			"imageProducer",
			this._zeroes.clone(),
			this.sizeBase.clone(), // size
			DataBinding.fromContext(visual)
		);

		var goToVenueNext = () => this.producer_GoToVenueNext(universe, size);

		var buttonNext = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY(75, 120), // pos
			Coords.fromXY(50, fontHeight * 2), // size
			"Next",
			FontNameAndHeight.fromHeightInPixels(fontHeight * 2),
			goToVenueNext // click
		).hasBorderSet(false);

		var actions = 
		[
			Action.fromNameAndPerform(controlActionNames.ControlCancel, goToVenueNext ),
			Action.fromNameAndPerform(controlActionNames.ControlConfirm, goToVenueNext )
		];

		var returnValue = ControlContainer.fromNamePosSizeChildrenAndActions
		(
			"containerProducer",
			this._zeroes, // pos
			this.sizeBase.clone(), // size
			// children
			[
				imageProducer,
				buttonNext
			],
			actions
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}

	producer_GoToVenueNext(universe: Universe, size: Coords): void
	{
		universe.soundHelper.soundsAllStop(universe);

		var venueTitle = this.title(universe, size).toVenue();
		universe.venueTransitionTo(venueTitle);
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

		var labelMusic = ControlLabel.fromPosSizeTextFontUncentered
		(
			Coords.fromXY(30, row1PosY + labelPadding), // pos
			Coords.fromXY(75, buttonHeight), // size
			DataBinding.fromContext("Music:"),
			font
		);

		var selectMusicVolume = new ControlSelect
		(
			"selectMusicVolume",
			Coords.fromXY(70, row1PosY), // pos
			Coords.fromXY(30, buttonHeight), // size
			DataBinding.fromContextGetAndSet
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
		);

		var labelSound = ControlLabel.fromPosSizeTextFontUncentered
		(
			Coords.fromXY(105, row1PosY + labelPadding), // pos
			Coords.fromXY(75, buttonHeight), // size
			DataBinding.fromContext("Sound:"),
			font
		);

		var selectSoundVolume = new ControlSelect
		(
			"selectSoundVolume",
			Coords.fromXY(140, row1PosY), // pos
			Coords.fromXY(30, buttonHeight), // size
			DataBinding.fromContextGetAndSet
			(
				universe.soundHelper,
				(c: SoundHelper) => c.effectVolume,
				(c: SoundHelper, v: number) => { c.effectVolume = v; }
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
		);

		var labelDisplay = ControlLabel.fromPosSizeTextFontUncentered
		(
			Coords.fromXY(30, row2PosY + labelPadding), // pos
			Coords.fromXY(75, buttonHeight), // size
			DataBinding.fromContext("Display:"),
			font
		);

		var selectDisplaySize = new ControlSelect<Display, Coords, Coords>
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
		);

		var buttonChange = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY(140, row2PosY), // pos
			Coords.fromXY(30, buttonHeight), // size
			"Change",
			font,
			() => this.settings_Change(universe)
		);

		var buttonInputs = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY(70, row3PosY), // pos
			Coords.fromXY(65, buttonHeight), // size
			"Inputs",
			font,
			() => // click
			{
				var venueCurrent = universe.venueCurrent();
				var controlGameControls =
					universe.controlBuilder.inputs(universe, size, venueCurrent);
				var venueNext = controlGameControls.toVenue();
				universe.venueTransitionTo(venueNext);
			}
		);

		var buttonDone = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY(70, row4PosY), // pos
			Coords.fromXY(65, buttonHeight), // size
			"Done",
			font,
			back // click
		);

		var returnValue = ControlContainer.fromNamePosSizeChildrenActionsAndMappings
		(
			"containerSettings",
			this._zeroes, // pos
			this.sizeBase.clone(),
			// children
			[
				labelMusic,
				selectMusicVolume,
				labelSound,
				selectSoundVolume,
				labelDisplay,
				selectDisplaySize,
				buttonChange,
				buttonInputs,
				buttonDone
			],

			[ Action.fromNameAndPerform("Back", back) ],

			[ new ActionToInputsMapping( "Back", [ Input.Instances().Escape.name ], true ) ],

		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}

	settings_Change(universe: Universe): void
	{
		var venueControls = universe.venueCurrent() as VenueControls;
		var controlRootAsContainer =
			venueControls.controlRoot as ControlContainer;
		var selectDisplaySizeAsControl =
			controlRootAsContainer.childByName("selectDisplaySize");
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
			universe, null, universe.venueCurrent()
		).toVenue();
		universe.venueTransitionTo(venueNext);
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

		var controlsForSlides: ControlBase[] = [];

		var skip = () =>
		{
			universe.venueTransitionTo(venueAfterSlideshow);
		};

		for (var i = 0; i < imageNamesAndMessagesForSlides.length; i++)
		{
			var imageNameAndMessage = imageNamesAndMessagesForSlides[i];
			var imageName = imageNameAndMessage[0];
			var message = imageNameAndMessage[1];

			var next =
				() =>
					this.slideshow_NextDefn.bind // Does this work?  Check history if not.
					(
						universe, controlsForSlides, i + 1, venueAfterSlideshow
					);

			var imageSlide = ControlVisual.fromNamePosSizeVisual
			(
				"imageSlide",
				this._zeroes,
				this.sizeBase.clone(), // size
				DataBinding.fromContext
				(
					VisualImageScaled.fromSizeAndChild
					(
						this.sizeBase.clone().multiply(scaleMultiplier), // sizeToDrawScaled
						VisualImageFromLibrary.fromImageName(imageName)
					) as VisualBase
				)
			);

			var labelSlideText = ControlLabel.fromPosSizeTextFontCenteredHorizontally
			(
				Coords.fromXY(0, this.fontHeightInPixelsBase), // pos
				Coords.fromXY
				(
					this.sizeBase.x,
					this.fontHeightInPixelsBase
				), // size
				DataBinding.fromContext(message),
				this.fontBase
			);

			var buttonNext = ControlButton.fromPosSizeTextFontClick
			(
				Coords.fromXY(75, 120), // pos
				Coords.fromXY(50, 40), // size
				"Next",
				this.fontBase,
				next
			);

			var controlActionNames = ControlActionNames.Instances();
			var actions =
			[
				Action.fromNameAndPerform(controlActionNames.ControlCancel, skip),
				Action.fromNameAndPerform(controlActionNames.ControlConfirm, next)
			];

			var containerSlide = ControlContainer.fromNamePosSizeChildrenAndActions
			(
				"containerSlide_" + i,
				this._zeroes, // pos
				this.sizeBase.clone(), // size
				// children
				[
					imageSlide,
					labelSlideText,
					buttonNext
				],
				actions
			);

			containerSlide.scalePosAndSize(scaleMultiplier);

			controlsForSlides.push(containerSlide);
		}

		return controlsForSlides[0];
	}

	slideshow_NextDefn
	(
		universe: Universe,
		controlsForSlides: ControlBase[],
		slideIndexNext: number,
		venueAfterSlideshow: Venue
	): void
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

		var visual: VisualBase = VisualGroup.fromChildren
		([
			VisualImageScaled.fromSizeAndChild
			(
				size, VisualImageFromLibrary.fromImageName("Titles_Title")
			),
			VisualSound.fromSoundNameAndRepeat("Music_Title", true)
		]);

		var imageTitle = ControlVisual.fromNamePosSizeVisual
		(
			"imageTitle",
			this._zeroes.clone(),
			this.sizeBase.clone(), // size
			DataBinding.fromContext(visual)
		);

		var buttonStart = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY(75, 120), // pos
			Coords.fromXY(50, fontHeight * 2), // size
			"Start",
			FontNameAndHeight.fromHeightInPixels(fontHeight * 2),
			() => this.title_Start(universe)
		).hasBorderSet(false);

		var controlActionNames = ControlActionNames.Instances();
		var actions =
		[
			Action.fromNameAndPerform
			(
				controlActionNames.ControlCancel,
				() => this.title_Start(universe)
			),
			Action.fromNameAndPerform
			(
				controlActionNames.ControlConfirm,
				() => this.title_Start(universe)
			)
		];

		var returnValue = ControlContainer.fromNamePosSizeChildrenAndActions
		(
			"containerTitle",
			this._zeroes,
			this.sizeBase.clone(),
			// children
			[
				imageTitle,
				buttonStart
			],
			actions
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}

	title_Start(universe: Universe): void
	{
		var venueNext: Venue;

		if (this.profileMenusAreIncluded)
		{
			var venueMessage = VenueMessage.fromTextNoButtons("Loading profiles...");

			venueNext = VenueTask.fromVenueInnerPerformAndDone
			(
				venueMessage,
				() =>
					Profile.toControlProfileSelect(universe, null, universe.venueCurrent() ),
				(result: ControlBase) => // done
				{
					var venueProfileSelect = result.toVenue();
					universe.venueTransitionTo(venueProfileSelect);
				}
			);
		}
		else
		{
			venueNext = universe.worldCreator.venueWorldGenerate(universe);
		}

		universe.venueTransitionTo(venueNext);

	}

	worldDetail(universe: Universe, size: Coords, venuePrev: Venue): ControlBase
	{
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

		var labelProfileName = ControlLabel.fromPosSizeTextFontCenteredHorizontally
		(
			Coords.fromXY(0, 40), // pos
			Coords.fromXY(sizeBase.x, 20), // size
			DataBinding.fromContext
			(
				"Profile: " + universe.profile.name
			),
			font
		);

		var labelWorldName = ControlLabel.fromPosSizeTextFontCenteredHorizontally
		(
			Coords.fromXY(0, 55), // pos
			Coords.fromXY(sizeBase.x, 25), // size
			DataBinding.fromContext("World: " + world.name),
			font
		);

		var labelStartDate = ControlLabel.fromPosSizeTextFontCenteredHorizontally
		(
			Coords.fromXY(0, 70), // pos
			Coords.fromXY(sizeBase.x, 25), // size
			DataBinding.fromContext
			(
				"Started: " + dateCreated.toStringTimestamp()
			),
			font
		);

		var labelSavedDate = ControlLabel.fromPosSizeTextFontCenteredHorizontally
		(
			Coords.fromXY(0, 85), // pos
			Coords.fromXY(sizeBase.x, 25), // size
			DataBinding.fromContext
			(
				"Saved: "
				+ (dateSaved == null ? "[never]" : dateSaved.toStringTimestamp())
			),
			font
		);

		var buttonStart = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY(50, 100), // pos
			Coords.fromXY(100, this.buttonHeightBase), // size
			"Start",
			font,
			() => this.worldDetail_Start(universe, size)
		);

		var buttonBack = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY(10, 10), // pos
			Coords.fromXY(15, 15), // size
			"<",
			font,
			() => // click
			{
				universe.venueTransitionTo(venuePrev);
			}
		);

		var buttonDelete = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY(180, 10), // pos
			Coords.fromXY(15, 15), // size
			"x",
			font,
			() => this.worldDetail_DeleteSaveStateSelected(universe, size)
		);

		var returnValue = ControlContainer.fromNamePosSizeChildren
		(
			"containerWorldDetail",
			this._zeroes, // pos
			sizeBase.clone(), // size
			// children
			[
				labelProfileName,
				labelWorldName,
				labelStartDate,
				labelSavedDate,
				buttonStart,
				buttonBack,
				buttonDelete
			]
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}

	worldDetail_DeleteSaveStateSelected(universe: Universe, size: Coords): void
	{
		var saveState = universe.profile.saveStateSelected();

		var controlConfirm = universe.controlBuilder.confirmAndReturnToVenue
		(
			universe,
			size,
			"Delete save \""
				+ saveState.name
				+ "\"?",
			universe.venueCurrent(),
			() => this.worldDetail_DeleteSaveStateSelected_Confirm(universe, saveState),
			null // cancel
		);

		var venueNext = controlConfirm.toVenue();
		universe.venueTransitionTo(venueNext);
	}

	worldDetail_DeleteSaveStateSelected_Confirm
	(
		universe: Universe, saveState: SaveStateBase
	): void
	{
		var storageHelper = universe.storageHelper;

		var profile = universe.profile;

		var saveStates = profile.saveStates;
		ArrayHelper.remove(saveStates, saveState);
		storageHelper.save(profile.name, profile);

		universe.worldSet(null);
		storageHelper.delete(saveState.name);
	}

	worldDetail_Start(universe: Universe, size: Coords): void
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
			var controlInstructions = universe.controlBuilder.message4
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

			var venueMovie = VenueVideo.fromVideoNameAndVenueNext
			(
				"Movie", // videoName
				venueInstructions // fader implicit
			);

			venueNext = venueMovie;
		}

		universe.venueTransitionTo(venueNext);
	}

	worldLoad(universe: Universe, size: Coords): ControlBase
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var font = this.fontBase;

		var labelProfileName = ControlLabel.fromPosSizeTextFontCenteredHorizontally
		(
			Coords.fromXY(100, 25), // pos
			Coords.fromXY(120, 25), // size
			DataBinding.fromContext
			(
				"Profile: " + universe.profile.name
			),
			font
		);

		var labelSelectASave = ControlLabel.fromPosSizeTextFontCenteredHorizontally
		(
			Coords.fromXY(100, 40), // pos
			Coords.fromXY(100, 25), // size
			DataBinding.fromContext("Select a Save:"),
			font
		);

		var listSaveStates = ControlList.fromNamePosSizeItemsTextFontSelectedValue
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
			DataBinding.fromContextGetAndSet
			(
				universe.profile,
				(c: Profile) => c.saveStateSelected(),
				(c: Profile, v: SaveStateBase) =>
					c.saveStateNameSelected = v.name
			), // bindingForOptionSelected
			DataBinding.fromGet( (v: SaveStateBase) => v.name ), // value
		);

		var buttonLoadFromServer = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY(30, 105), // pos
			Coords.fromXY(40, this.buttonHeightBase), // size
			"Load",
			font,
			() => this.worldLoad_LoadFromServer(universe, size)
		);

		var venueFileUpload = VenueFileUpload.create();

		var buttonLoadFromFile = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY(80, 105), // pos
			Coords.fromXY(40, this.buttonHeightBase), // size
			"Load File",
			font,
			() => this.worldLoad_LoadFile(universe, size, venueFileUpload)
		);

		var buttonReturn = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY(130, 105), // pos
			Coords.fromXY(40, this.buttonHeightBase), // size
			"Return",
			font,
			() => this.worldLoad_Return(universe, size)
		);

		var returnValue = ControlContainer.fromNamePosSizeChildren
		(
			"containerWorldLoad",
			this._zeroes, // pos
			this.sizeBase.clone(), // size
			// children
			[
				labelProfileName,
				labelSelectASave,
				listSaveStates,
				buttonLoadFromServer,
				buttonLoadFromFile,
				buttonReturn
			]
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}

	worldLoad_Cancel(universe: Universe): void
	{
		var venueNext = universe.controlBuilder.worldLoad(universe, null).toVenue();
		universe.venueTransitionTo(venueNext);
	}

	worldLoad_Confirm(universe: Universe): void
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

		var venueTask = VenueTask.fromVenueInnerPerformAndDone
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
				var world = saveStateReloaded.toWorld(universe);
				universe.worldSet(world);
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

	worldLoad_LoadFile
	(
		universe: Universe,
		size: Coords,
		venueFileUpload: VenueFileUpload
	): void
	{
		var controlMessageReadyToLoad =
			universe.controlBuilder.message4
			(
				universe,
				size,
				DataBinding.fromContext("Ready to load from file..."),
				() => this.worldLoad_LoadFile_Acknowledge(universe, size, venueFileUpload)
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
				var venueNext = universe.controlBuilder.game
				(
					universe, size, universe.venueCurrent()
				).toVenue();
				universe.venueTransitionTo(venueNext);
			}
		);

		var venueMessageCancelled = controlMessageCancelled.toVenue();

		venueFileUpload.venueNextIfFileSpecified = venueMessageReadyToLoad;
		venueFileUpload.venueNextIfCancelled = venueMessageCancelled;

		universe.venueTransitionTo(venueFileUpload);
	}

	worldLoad_LoadFile_Acknowledge
	(
		universe: Universe, size: Coords, venueFileUpload: VenueFileUpload
	): void
	{
		var inputFile = venueFileUpload.toDomElement().getElementsByTagName("input")[0];
		var fileToLoad = inputFile.files[0];
		new FileHelper().loadFileAsBinaryString
		(
			fileToLoad,
			(fileContentsAsString: string) =>
				this.worldLoad_LoadFile_Acknowledge_Callback
				(
					universe, size, fileContentsAsString
				),
			null // contextForCallback
		);
	}

	worldLoad_LoadFile_Acknowledge_Callback
	(
		universe: Universe, size: Coords, fileContentsAsString: string
	): void
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
		universe.worldSet(worldDeserialized);

		var venueNext = universe.controlBuilder.game
		(
			universe, size, universe.venueCurrent()
		).toVenue();
		universe.venueTransitionTo(venueNext);
	}

	worldLoad_LoadFromServer(universe: Universe, size: Coords): void
	{
		var controlConfirm = universe.controlBuilder.confirm
		(
			universe, size, "Abandon the current game?",
			() => this.worldLoad_Confirm(universe),
			() => this.worldLoad_Cancel(universe)
		);
		var venueConfirm = controlConfirm.toVenue();
		universe.venueTransitionTo(venueConfirm);
	}

	worldLoad_Return(universe: Universe, size: Coords): void
	{
		var venueGame = universe.controlBuilder.game
		(
			universe, size, universe.venueCurrent()
		).toVenue();
		universe.venueTransitionTo(venueGame);
	}

}

}
