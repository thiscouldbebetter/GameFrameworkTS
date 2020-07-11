
class ControlBuilder
{
	styles: ControlStyle[];
	stylesByName: Map<string,ControlStyle>;
	fontHeightInPixelsBase: number;
	sizeBase: Coords;

	_zeroes: Coords;
	_scaleMultiplier: Coords;

	constructor(styles: Array<ControlStyle>)
	{
		this.styles = styles;
		this.stylesByName = ArrayHelper.addLookupsByName(styles);

		this.fontHeightInPixelsBase = 10;
		this.sizeBase = new Coords(200, 150, 1);

		// Helper variables.

		this._zeroes = new Coords(0, 0, 0);
		this._scaleMultiplier = new Coords(0, 0, 0);
	}

	choice
	(
		universe: Universe, size: Coords, message: DataBinding<any, string>,
		optionNames: Array<string>, optionFunctions: Array<any>,
		showMessageOnly: boolean
	)
	{
		size = size || universe.display.sizeDefault();
		showMessageOnly = showMessageOnly || false;

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);
		var fontHeight = this.fontHeightInPixelsBase;

		var numberOfLinesInMessageMinusOne = message.get().split("\n").length - 1;
		var labelSize = new Coords
		(
			200, fontHeight * numberOfLinesInMessageMinusOne, 0
		);

		var numberOfOptions = optionNames.length;

		if (showMessageOnly && numberOfOptions == 1)
		{
			numberOfOptions = 0; // Is a single option really an option?
		}

		var labelPosYBase = (numberOfOptions > 0 ? 65 : 75); // hack

		var labelPos = new Coords
		(
			100, labelPosYBase - fontHeight * (numberOfLinesInMessageMinusOne / 4), 0
		);

		var labelMessage = new ControlLabel
		(
			"labelMessage",
			labelPos,
			labelSize,
			true, // isTextCentered
			message,
			fontHeight
		);

		var childControls: any[] = [ labelMessage ];

		if (showMessageOnly == false)
		{
			var buttonWidth = 55;
			var buttonSize = new Coords(buttonWidth, fontHeight * 2, 0);
			var spaceBetweenButtons = 5;
			var buttonMarginLeftRight =
				(
					this.sizeBase.x
					- (buttonWidth * numberOfOptions)
					- (spaceBetweenButtons * (numberOfOptions - 1))
				) / 2;

			for (var i = 0; i < numberOfOptions; i++)
			{
				var button = new ControlButton
				(
					"buttonOption" + i,
					new Coords
					(
						buttonMarginLeftRight + i * (buttonWidth + spaceBetweenButtons),
						100,
						0
					), // pos
					buttonSize.clone(),
					optionNames[i],
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					optionFunctions[i],
					null, null
				);

				childControls.push(button);
			}
		}

		var containerSizeScaled = size.clone().clearZ().divide(scaleMultiplier);
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

		var returnValue: any = new ControlContainer
		(
			"containerChoice",
			containerPosScaled,
			containerSizeScaled,
			childControls,
			actions,
			null //?
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		if (showMessageOnly)
		{
			returnValue = new ControlContainerTransparent(returnValue);
		}

		return returnValue;
	};

	choiceList
	(
		universe: Universe, size: Coords, message: string,
		options: any, bindingForOptionText: DataBinding<any,any>,
		buttonSelectText: string, select: any
	)
	{
		// todo - Variable sizes.

		var marginWidth = 10;
		var marginSize = new Coords(1, 1, 0).multiplyScalar(marginWidth);
		var fontHeight = 20;
		var labelSize = new Coords(size.x - marginSize.x * 2, fontHeight, 0);
		var buttonSize = new Coords(labelSize.x, fontHeight * 2, 0);
		var listSize = new Coords
		(
			labelSize.x,
			size.y - labelSize.y - buttonSize.y - marginSize.y * 4,
			0
		);

		var listOptions = new ControlList
		(
			"listOptions",
			new Coords(marginSize.x, labelSize.y + marginSize.y * 2, 0),
			listSize,
			options,
			bindingForOptionText,
			fontHeight,
			null, // bindingForItemSelected
			null, // bindingForItemValue
			null, null, null
		);

		var returnValue = new ControlContainer
		(
			"containerChoice",
			new Coords(0, 0, 0),
			size,
			[
				new ControlLabel
				(
					"labelMessage",
					new Coords(size.x / 2, marginSize.y + fontHeight / 2, 0),
					labelSize,
					true, // isTextCentered
					message,
					fontHeight
				),

				listOptions,

				new ControlButton
				(
					"buttonSelect",
					new Coords(marginSize.x, size.y - marginSize.y - buttonSize.y, 0),
					buttonSize,
					buttonSelectText,
					fontHeight,
					true, // hasBorder
					true, // isEnabled,
					() => // click
					{
						var itemSelected = listOptions.itemSelected(null);
						if (itemSelected != null)
						{
							select(universe, itemSelected);
						}
					},
					universe, // context
					false // canBeHeldDown
				),
			],
			null, null
		);

		return returnValue;
	};

	confirm(universe: Universe, size: Coords, message: string, confirm: () => void, cancel: () => void)
	{
		return this.choice
		(
			universe, size, new DataBinding(message, null, null), ["Confirm", "Cancel"], [confirm, cancel], null
		);
	};

	game(universe: Universe, size: Coords)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault().clone();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var fontHeight = this.fontHeightInPixelsBase;

		var buttonHeight = 20;
		var buttonSize = new Coords(60, buttonHeight, 0);
		var margin = 15;
		var padding = 5;

		var posX = 70;
		var rowHeight = buttonHeight + padding;
		var row0PosY = margin;
		var row1PosY = row0PosY + rowHeight;
		var row2PosY = row1PosY + rowHeight;
		var row3PosY = row2PosY + rowHeight;
		var row4PosY = row3PosY + rowHeight;

		var back = function()
		{
			var venueNext: any = new VenueControls
			(
				universe.controlBuilder.gameAndSettings(universe, size)
			);
			venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
			universe.venueNext = venueNext;
		};

		var returnValue = new ControlContainer
		(
			"containerStorage",
			this._zeroes, // pos
			this.sizeBase.clone(),
			// children
			[
				new ControlButton
				(
					"buttonSave",
					new Coords(posX, row0PosY, 0), // pos
					buttonSize.clone(),
					"Save",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var venueNext: Venue = new VenueControls
						(
							universe.controlBuilder.worldSave(universe, null)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
						universe.venueNext = venueNext;
					},
					null, null
				),

				new ControlButton
				(
					"buttonLoad",
					new Coords(posX, row1PosY, 0), // pos
					buttonSize.clone(),
					"Load",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var venueNext: any = new VenueControls
						(
							universe.controlBuilder.worldLoad(universe, null)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
						universe.venueNext = venueNext;
					},
					null, null
				),

				new ControlButton
				(
					"buttonAbout",
					new Coords(posX, row2PosY, 0), // pos
					buttonSize.clone(),
					"About",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var venueCurrent = universe.venueCurrent;
						var venueNext: any = new VenueMessage
						(
							new DataBinding(universe.name + "\nv" + universe.version, null, null),
							() => // acknowledge
							{
								universe.venueNext = new VenueFader(venueCurrent, null, null, null);
							},
							universe.venueCurrent, // venuePrev
							size,
							false
						);
						venueNext = new VenueFader(venueNext, venueCurrent, null, null);
						universe.venueNext = venueNext;
					},
					null, null
				),

				new ControlButton
				(
					"buttonQuit",
					new Coords(posX, row3PosY, 0), // pos
					buttonSize.clone(),
					"Quit",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
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
								var venueNext: any = new VenueControls
								(
									universe.controlBuilder.title(universe, null)
								);
								venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
								universe.venueNext = venueNext;
							},
							() => // cancel
							{
								var venueNext: any = new VenueControls
								(
									universe.controlBuilder.gameAndSettings(universe, size)
								);
								venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
								universe.venueNext = venueNext;
							}
						);

						var venueNext: any = new VenueControls(controlConfirm);
						venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
						universe.venueNext = venueNext;
					},
					null, null
				),

				new ControlButton
				(
					"buttonBack",
					new Coords(posX, row4PosY, 0), // pos
					buttonSize.clone(),
					"Back",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					back, // click
					null, null
				),
			],

			[ new Action("Back", back) ],

			[ new ActionToInputsMapping( "Back", [ "Escape" ], true ) ],

		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	};

	gameAndSettings(universe: Universe, size: Coords)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault().clone();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var fontHeight = this.fontHeightInPixelsBase;

		var buttonHeight = 20;
		var margin = 15;
		var padding = 5;

		var rowHeight = buttonHeight + padding;
		var row0PosY = margin;
		var row1PosY = row0PosY + rowHeight;
		var row2PosY = row1PosY + rowHeight;
		var row3PosY = row2PosY + rowHeight;

		var back = function()
		{
			var venueNext: any = new VenueWorld(universe.world);
			venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
			universe.venueNext = venueNext;
		};

		var returnValue = new ControlContainer
		(
			"containerGameAndSettings",
			this._zeroes, // pos
			this.sizeBase.clone(),
			// children
			[
				new ControlButton
				(
					"buttonGame",
					new Coords(70, row1PosY, 0), // pos
					new Coords(60, buttonHeight, 0), // size
					"Game",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var venueNext: any = new VenueControls
						(
							universe.controlBuilder.game(universe, size)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
						universe.venueNext = venueNext;
					},
					null, null
				),

				new ControlButton
				(
					"buttonSettings",
					new Coords(70, row2PosY, 0), // pos
					new Coords(60, buttonHeight, 0), // size
					"Settings",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var venueNext: any = new VenueControls
						(
							universe.controlBuilder.settings(universe, null)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
						universe.venueNext = venueNext;
					},
					null, null
				),

				new ControlButton
				(
					"buttonResume",
					new Coords(70, row3PosY, 0), // pos
					new Coords(60, buttonHeight, 0), // size
					"Resume",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					back,
					null, null
				),
			],

			[ new Action("Back", back) ],

			[ new ActionToInputsMapping( "Back", [ "Escape" ], true ) ],

		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	};

	inputs (universe: Universe, size: Coords, venuePrev: any)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var fontHeight = this.fontHeightInPixelsBase;

		var world = universe.world;
		var placeCurrentDefnName = "Demo"; // hack
		var placeDefn = world.defns.defnsByNameByTypeName.get(PlaceDefn.name).get(placeCurrentDefnName);
		placeDefn.actionToInputsMappingsEdit();

		var returnValue = new ControlContainer
		(
			"containerGameControls",
			this._zeroes, // pos
			this.sizeBase.clone(), // size
			// children
			[
				new ControlLabel
				(
					"labelActions",
					new Coords(100, 15, 0), // pos
					new Coords(100, 25, 0), // size
					true, // isTextCentered
					"Actions:",
					fontHeight
				),

				new ControlList
				(
					"listActions",
					new Coords(50, 25, 0), // pos
					new Coords(100, 40, 0), // size
					new DataBinding(placeDefn.actionToInputsMappingsEdited, null, null), // items
					new DataBinding
					(
						null,
						(c: ActionToInputsMapping) => { return c.actionName; },
						null
					), // bindingForItemText
					fontHeight,
					new DataBinding
					(
						placeDefn,
						(c: PlaceDefn) => c.actionToInputsMappingSelected,
						(c: PlaceDefn, v: ActionToInputsMapping) => { c.actionToInputsMappingSelected = v; }
					), // bindingForItemSelected
					new DataBinding(null, (c: ActionToInputsMapping) => c, null ), // bindingForItemValue
					null, null, null
				),

				new ControlLabel
				(
					"labelInput",
					new Coords(100, 70, 0), // pos
					new Coords(100, 15, 0), // size
					true, // isTextCentered
					"Inputs:",
					fontHeight
				),

				new ControlLabel
				(
					"infoInput",
					new Coords(100, 80, 0), // pos
					new Coords(200, 15, 0), // size
					true, // isTextCentered
					new DataBinding
					(
						placeDefn,
						(c: PlaceDefn) => 
						{
							var i = c.actionToInputsMappingSelected;
							return (i == null ? "-" : i.inputNames.join(", "));
						},
						null
					), // text
					fontHeight
				),

				new ControlButton
				(
					"buttonClear",
					new Coords(25, 90, 0), // pos
					new Coords(45, 15, 0), // size
					"Clear",
					fontHeight,
					true, // hasBorder
					new DataBinding
					(
						placeDefn,
						(c: PlaceDefn) => { return c.actionToInputsMappingSelected != null},
						null
					), // isEnabled
					() => // click
					{
						var mappingSelected = placeDefn.actionToInputsMappingSelected;
						if (mappingSelected != null)
						{
							mappingSelected.inputNames.length = 0;
						}
					},
					null, null
				),

				new ControlButton
				(
					"buttonAdd",
					new Coords(80, 90, 0), // pos
					new Coords(45, 15, 0), // size
					"Add",
					fontHeight,
					true, // hasBorder
					new DataBinding
					(
						placeDefn,
						(c: PlaceDefn) => { return c.actionToInputsMappingSelected != null},
						null
					), // isEnabled
					() => // click
					{
						var mappingSelected = placeDefn.actionToInputsMappingSelected;
						if (mappingSelected != null)
						{
							var venueInputCapture = new VenueInputCapture
							(
								universe.venueCurrent,
								(inputCaptured: any) =>
								{
									var inputName = inputCaptured.name;
									mappingSelected.inputNames.push(inputName);
								}
							);
							universe.venueNext = venueInputCapture
						}
					},
					null, null
				),

				new ControlButton
				(
					"buttonRestoreDefault",
					new Coords(135, 90, 0), // pos
					new Coords(45, 15, 0), // size
					"Default",
					fontHeight,
					true, // hasBorder
					new DataBinding
					(
						placeDefn,
						(c: PlaceDefn) => { return c.actionToInputsMappingSelected != null},
						null
					), // isEnabled
					() => // click
					{
						var mappingSelected = placeDefn.actionToInputsMappingSelected;
						if (mappingSelected != null)
						{
							var mappingDefault = placeDefn.actionToInputsMappingsDefault.filter
							(
								(x: ActionToInputsMapping) => { return x.actionName == mappingSelected.actionName }
							)[0];
							mappingSelected.inputNames = mappingDefault.inputNames.slice();
						}
					},
					null, null
				),

				new ControlButton
				(
					"buttonRestoreDefaultsAll",
					new Coords(50, 110, 0), // pos
					new Coords(100, 15, 0), // size
					"Default All",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() =>
					{
						var venueInputs = universe.venueCurrent;
						var controlConfirm = universe.controlBuilder.confirm
						(
							universe,
							size,
							"Are you sure you want to restore defaults?",
							() => // confirm
							{
								placeDefn.actionToInputsMappingsRestoreDefaults();
								var venueNext: any = venueInputs;
								venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
								universe.venueNext = venueNext;
							},
							() => // cancel
							{
								var venueNext: any = venueInputs;
								venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
								universe.venueNext = venueNext;
							}
						);
						var venueNext: any = new VenueControls(controlConfirm);
						venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
						universe.venueNext = venueNext;
					},
					null, null
				),

				new ControlButton
				(
					"buttonCancel",
					new Coords(50, 130, 0), // pos
					new Coords(45, 15, 0), // size
					"Cancel",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var venueNext: any = venuePrev;
						venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
						universe.venueNext = venueNext;
					},
					null, null
				),

				new ControlButton
				(
					"buttonSave",
					new Coords(105, 130, 0), // pos
					new Coords(45, 15, 0), // size
					"Save",
					fontHeight,
					true, // hasBorder
					// isEnabled
					new DataBinding
					(
						placeDefn,
						(c: PlaceDefn) => 
						{
							var mappings = c.actionToInputsMappingsEdited;
							var doAnyActionsLackInputs = mappings.some
							(
								function(x: ActionToInputsMapping) { return x.inputNames.length == 0; }
							);
							return (doAnyActionsLackInputs == false);
						},
						null
					),
					() => // click
					{
						placeDefn.actionToInputsMappingsSave();
						var venueNext: any = venuePrev;
						venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
						universe.venueNext = venueNext;
					},
					null, null
				)
			],
			null, null
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	};

	message(universe: Universe, size: Coords, message: DataBinding<any, string>, acknowledge: () => void, showMessageOnly: boolean)
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
			universe, size, message, optionNames, optionFunctions, showMessageOnly
		);
	};

	profileDetail (universe: Universe, size: Coords)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var fontHeight = this.fontHeightInPixelsBase;

		var returnValue = new ControlContainer
		(
			"containerProfileDetail",
			this._zeroes, // pos
			this.sizeBase.clone(), // size
			// children
			[
				new ControlLabel
				(
					"labelProfileName",
					new Coords(100, 25, 0), // pos
					new Coords(120, 25, 0), // size
					true, // isTextCentered
					"Profile: " + universe.profile.name,
					fontHeight
				),

				new ControlLabel
				(
					"labelSelectAWorld",
					new Coords(100, 40, 0), // pos
					new Coords(100, 25, 0), // size
					true, // isTextCentered
					"Select a World:",
					fontHeight
				),

				new ControlList
				(
					"listWorlds",
					new Coords(25, 50, 0), // pos
					new Coords(150, 50, 0), // size
					new DataBinding
					(
						universe.profile,
						(c: Profile) => c.worlds,
						null
					),
					new DataBinding(null, (c: World) => { return c.name; }, null), // bindingForOptionText
					fontHeight,
					new DataBinding
					(
						universe.profile,
						(c: Profile) => { return c.worldSelected; },
						(c: Profile, v: World) => { c.worldSelected = v; }
					), // bindingForOptionSelected
					new DataBinding(null, (c: World) => c, null), // value
					null, null, null
				),

				new ControlButton
				(
					"buttonNew",
					new Coords(50, 110, 0), // pos
					new Coords(45, 25, 0), // size
					"New",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var world = World.new(universe);

						var profile = universe.profile;
						profile.worlds.push(world);

						universe.profileHelper.profileSave
						(
							profile
						);

						universe.world = world;
						var venueNext: any = new VenueControls
						(
							universe.controlBuilder.worldDetail(universe, size)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
						universe.venueNext = venueNext;
					},
					null, null
				),

				new ControlButton
				(
					"buttonSelect",
					new Coords(105, 110, 0), // pos
					new Coords(45, 25, 0), // size
					"Select",
					fontHeight,
					true, // hasBorder
					// isEnabled
					new DataBinding
					(
						universe.profile,
						(c: Profile) => (c.worldSelected != null),
						null
					),
					() => // click
					{
						var worldSelected = universe.profile.worldSelected;
						if (worldSelected != null)
						{
							universe.world = worldSelected;
							var venueNext: Venue = new VenueControls
							(
								universe.controlBuilder.worldDetail(universe, size)
							);
							venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
							universe.venueNext = venueNext;
						}
					},
					null, null
				),

				new ControlButton
				(
					"buttonBack",
					new Coords(10, 10, 0), // pos
					new Coords(15, 15, 0), // size
					"<",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var venueNext: any = new VenueControls
						(
							universe.controlBuilder.profileSelect(universe, size)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
						universe.venueNext = venueNext;
					},
					null, null
				),

				new ControlButton
				(
					"buttonDelete",
					new Coords(180, 10, 0), // pos
					new Coords(15, 15, 0), // size
					"x",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var profile = universe.profile;

						var controlConfirm = universe.controlBuilder.confirm
						(
							universe,
							size,
							"Delete profile \""
								+ profile.name
								+ "\"?",
							() => // confirm
							{
								var profile = universe.profile;
								universe.profileHelper.profileDelete
								(
									profile
								);

								var venueNext: any = new VenueControls
								(
									universe.controlBuilder.profileSelect(universe, null)
								);
								venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
								universe.venueNext = venueNext;
							},
							() => // cancel
							{
								var venueNext: any = new VenueControls
								(
									universe.controlBuilder.profileDetail(universe, size)
								);
								venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
								universe.venueNext = venueNext;
							}
						);

						var venueNext: any = new VenueControls(controlConfirm);
						venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
						universe.venueNext = venueNext;
					},
					null, null
				),
			],
			null, null
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	};

	profileNew (universe: Universe, size: Coords)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var fontHeight = this.fontHeightInPixelsBase;

		var returnValue = new ControlContainer
		(
			"containerProfileNew",
			this._zeroes, // pos
			this.sizeBase.clone(), // size
			// children
			[
				new ControlLabel
				(
					"labelName",
					new Coords(100, 40, 0), // pos
					new Coords(100, 25, 0), // size
					true, // isTextCentered
					"Profile Name:",
					fontHeight
				),

				new ControlTextBox
				(
					"textBoxName",
					new Coords(50, 50, 0), // pos
					new Coords(100, 25, 0), // size
					new DataBinding
					(
						universe.profile,
						(c: Profile) => { return c.name; },
						(c: Profile, v: string) => { c.name = v; },
					), // text
					fontHeight,
					null
				),

				new ControlButton
				(
					"buttonCreate",
					new Coords(50, 80, 0), // pos
					new Coords(45, 25, 0), // size
					"Create",
					fontHeight,
					true, // hasBorder
					// isEnabled
					new DataBinding
					(
						universe.profile,
						(c: Profile) => { return c.name.length > 0; },
						null
					),
					() => // click
					{
						var venueControls = universe.venueCurrent as VenueControls;
						var controlRootAsContainer = venueControls.controlRoot as ControlContainer;
						var textBoxName = controlRootAsContainer.childrenByName.get("textBoxName") as ControlTextBox;
						var profileName = textBoxName.text(null, universe);
						if (profileName == "")
						{
							return;
						}

						var profile = new Profile(profileName, []);
						universe.profileHelper.profileAdd
						(
							profile
						);

						universe.profile = profile;
						var venueNext: any = new VenueControls
						(
							universe.controlBuilder.profileDetail(universe, null)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
						universe.venueNext = venueNext;
					},
					null, null
				),

				new ControlButton
				(
					"buttonCancel",
					new Coords(105, 80, 0), // pos
					new Coords(45, 25, 0), // size
					"Cancel",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var venueNext: any = new VenueControls
						(
							universe.controlBuilder.profileSelect(universe, null)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
						universe.venueNext = venueNext;
					},
					null, null
				),
			],
			null, null
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	};

	profileSelect(universe: Universe, size: Coords)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var fontHeight = this.fontHeightInPixelsBase;

		var profiles = universe.profileHelper.profiles();

		var returnValue = new ControlContainer
		(
			"containerProfileSelect",
			this._zeroes, // pos
			this.sizeBase.clone(), // size
			// children
			[
				new ControlLabel
				(
					"labelSelectAProfile",
					new Coords(100, 40, 0), // pos
					new Coords(100, 25, 0), // size
					true, // isTextCentered
					"Select a Profile:",
					fontHeight
				),

				new ControlList
				(
					"listProfiles",
					new Coords(35, 50, 0), // pos
					new Coords(130, 40, 0), // size
					new DataBinding(profiles, (c: Profile[]) => c, null ), // items
					new DataBinding(null, (c: Profile) => c.name, null ), // bindingForItemText
					fontHeight,
					new DataBinding
					(
						universe,
						(c: Universe) => { return c.profile; },
						(c: Universe, v: Profile) => { c.profile = v; }
					), // bindingForOptionSelected
					new DataBinding(null, (c: Profile) => c, null), // value
					null, null, null
				),

				new ControlButton
				(
					"buttonNew",
					new Coords(35, 95, 0), // pos
					new Coords(40, 25, 0), // size
					"New",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						universe.profile = new Profile("", null);
						var venueNext: any = new VenueControls
						(
							universe.controlBuilder.profileNew(universe, null)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
						universe.venueNext = venueNext;
					},
					null, null
				),

				new ControlButton
				(
					"buttonSelect",
					new Coords(80, 95, 0), // pos
					new Coords(40, 25, 0), // size
					"Select",
					fontHeight,
					true, // hasBorder
					// isEnabled
					new DataBinding
					(
						universe,
						(c: Universe) => { return (c.profile != null); },
						null
					),
					() => // click
					{
						var venueControls = universe.venueCurrent as VenueControls;
						var controlRootAsContainer = venueControls.controlRoot as ControlContainer;
						var listProfiles =
							controlRootAsContainer.childrenByName.get("listProfiles") as ControlList;
						var profileSelected = listProfiles.itemSelected(null);
						universe.profile = profileSelected;
						var venueNext: any = new VenueControls
						(
							universe.controlBuilder.profileDetail(universe, null)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
						universe.venueNext = venueNext;
					},
					null, null
				),

				new ControlButton
				(
					"buttonSkip",
					new Coords(125, 95, 0), // pos
					new Coords(40, 25, 0), // size
					"Skip",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var messageAsDataBinding = new DataBinding
						(
							null, // Will be set below.
							(c: VenueTask) => "Generating world...",
							null
						);

						var venueMessage = new VenueMessage
						(
							messageAsDataBinding, null, null, null, null
						);

						var venueTask = new VenueTask
						(
							venueMessage,
							() => //perform
							{
								return World.new(universe);
							},
							(universe: Universe, world: World) => // done
							{
								universe.world = world;

								var now = DateTime.now();
								var nowAsString = now.toStringMMDD_HHMM_SS();
								var profileName = "Anon-" + nowAsString;
								var profile = new Profile(profileName, [ world ]);
								universe.profile = profile;

								var venueNext: any = new VenueWorld(universe.world);
								venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
								universe.venueNext = venueNext;
							}
						);

						messageAsDataBinding.contextSet(venueTask);

						universe.venueNext = new VenueFader(venueTask, universe.venueCurrent, null, null)

					}, // end click
					null, null
				),

				new ControlButton
				(
					"buttonBack",
					new Coords(10, 10, 0), // pos
					new Coords(15, 15, 0), // size
					"<",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var venueNext: any = new VenueControls
						(
							universe.controlBuilder.title(universe, null)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
						universe.venueNext = venueNext;
					},
					null, null
				),

				new ControlButton
				(
					"buttonDelete",
					new Coords(180, 10, 0), // pos
					new Coords(15, 15, 0), // size
					"x",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var controlConfirm = universe.controlBuilder.confirm
						(
							universe,
							size,
							"Delete all profiles?",
							() => // confirm
							{
								universe.profileHelper.profilesAllDelete(null);
								var venueNext: any = new VenueControls
								(
									universe.controlBuilder.profileSelect(universe, null)
								);
								venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
								universe.venueNext = venueNext;
							},
							() => // cancel
							{
								var venueNext: any = new VenueControls
								(
									universe.controlBuilder.profileSelect(universe, null)
								);
								venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
								universe.venueNext = venueNext;
							}
						);

						var venueNext: any = new VenueControls(controlConfirm);
						venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
						universe.venueNext = venueNext;
					},
					null, null
				),
			],
			null, null
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	};

	settings(universe: Universe, size: Coords)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var fontHeight = this.fontHeightInPixelsBase;

		var buttonHeight = 20;
		var margin = 15;
		var padding = 5;
		var labelPadding = 3;

		var rowHeight = buttonHeight + padding;
		var row0PosY = margin;
		var row1PosY = row0PosY + rowHeight / 2;
		var row2PosY = row1PosY + rowHeight;
		var row3PosY = row2PosY + rowHeight;
		var row4PosY = row3PosY + rowHeight;

		var back = function()
		{
			var control = universe.controlBuilder.gameAndSettings(universe, size);
			var venueNext: any = new VenueControls(control);
			venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
			universe.venueNext = venueNext;
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
					new Coords(30, row1PosY + labelPadding, 0), // pos
					new Coords(75, buttonHeight, 0), // size
					false, // isTextCentered
					"Music:",
					fontHeight
				),

				new ControlSelect
				(
					"selectMusicVolume",
					new Coords(65, row1PosY, 0), // pos
					new Coords(30, buttonHeight, 0), // size
					new DataBinding
					(
						universe.soundHelper,
						(c: SoundHelper) => { return c.musicVolume; },
						(c: SoundHelper, v: number) => { c.musicVolume = v; }
					), // valueSelected
					SoundHelper.controlSelectOptionsVolume(), // options
					new DataBinding
					(
						null, (c: any) => c.value, null
					), // bindingForOptionValues,
					new DataBinding
					(
						null, (c: any) => { return c.text; }, null
					), // bindingForOptionText
					fontHeight
				),

				new ControlLabel
				(
					"labelSoundVolume",
					new Coords(105, row1PosY + labelPadding, 0), // pos
					new Coords(75, buttonHeight, 0), // size
					false, // isTextCentered
					"Sound:",
					fontHeight
				),

				new ControlSelect
				(
					"selectSoundVolume",
					new Coords(140, row1PosY, 0), // pos
					new Coords(30, buttonHeight, 0), // size
					new DataBinding
					(
						universe.soundHelper,
						(c: SoundHelper) => c.soundVolume,
						(c: SoundHelper, v: number) => { c.soundVolume = v; }
					), // valueSelected
					SoundHelper.controlSelectOptionsVolume(), // options
					new DataBinding(null, (c: ControlSelectOption) => c.value, null ), // bindingForOptionValues,
					new DataBinding(null, (c: ControlSelectOption) => { return c.text; }, null ), // bindingForOptionText
					fontHeight
				),

				new ControlLabel
				(
					"labelDisplaySize",
					new Coords(30, row2PosY + labelPadding, 0), // pos
					new Coords(75, buttonHeight, 0), // size
					false, // isTextCentered
					"Display:",
					fontHeight
				),

				new ControlSelect
				(
					"selectDisplaySize",
					new Coords(70, row2PosY, 0), // pos
					new Coords(60, buttonHeight, 0), // size
					universe.display.sizeInPixels, // valueSelected
					// options
					universe.display.sizesAvailable,
					new DataBinding(null, (c: Coords) => c, null ), // bindingForOptionValues,
					new DataBinding(null, (c: Coords) => { return c.toStringXY(); }, null ), // bindingForOptionText
					fontHeight
				),

				new ControlButton
				(
					"buttonDisplaySizeChange",
					new Coords(140, row2PosY, 0), // pos
					new Coords(30, buttonHeight, 0), // size
					"Change",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var venueControls = universe.venueCurrent as VenueControls;
						var controlRootAsContainer = venueControls.controlRoot as ControlContainer;
						var selectDisplaySize =
							controlRootAsContainer.childrenByName.get("selectDisplaySize") as ControlSelect;
						var displaySizeSpecified = selectDisplaySize.optionSelected();

						var display = universe.display as Display2D;
						var platformHelper = universe.platformHelper;
						platformHelper.platformableRemove(display);
						display.sizeInPixels = displaySizeSpecified;
						display.canvas = null; // hack
						display.initialize(universe);
						platformHelper.initialize(universe);

						var venueNext: any = new VenueControls
						(
							universe.controlBuilder.settings(universe, null)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
						universe.venueNext = venueNext;
					},
					null, null
				),

				new ControlButton
				(
					"buttonInputs",
					new Coords(70, row3PosY, 0), // pos
					new Coords(65, buttonHeight, 0), // size
					"Inputs",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var venueCurrent = universe.venueCurrent;
						var controlGameControls =
							universe.controlBuilder.inputs(universe, size, venueCurrent);
						var venueNext: any = new VenueControls(controlGameControls);
						venueNext = new VenueFader(venueNext, venueCurrent, null, null);
						universe.venueNext = venueNext;
					},
					null, null
				),

				new ControlButton
				(
					"buttonDone",
					new Coords(70, row4PosY, 0), // pos
					new Coords(65, buttonHeight, 0), // size
					"Done",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					back, // click
					null, null
				),
			],

			[ new Action("Back", back) ],

			[ new ActionToInputsMapping( "Back", [ "Escape" ], true ) ],

		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	};

	slideshow(universe: Universe, size: Coords, imageNamesAndMessagesForSlides: any, venueAfterSlideshow: any)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var controlsForSlides: any[] = [];

		for (var i = 0; i < imageNamesAndMessagesForSlides.length; i++)
		{
			var imageNameAndMessage = imageNamesAndMessagesForSlides[i];
			var imageName = imageNameAndMessage[0];
			var message = imageNameAndMessage[1];

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
						new VisualImageFromLibrary(imageName),
						null
					),

					new ControlLabel
					(
						"labelSlideText",
						new Coords(100, this.fontHeightInPixelsBase * 2, 0), // pos
						this.sizeBase.clone(), // size
						true, // isTextCentered,
						message,
						this.fontHeightInPixelsBase * 2
					),

					new ControlButton
					(
						"buttonNext",
						new Coords(75, 120, 0), // pos
						new Coords(50, 40, 0), // size
						"Next",
						this.fontHeightInPixelsBase,
						false, // hasBorder
						true, // isEnabled
						function click(slideIndexNext: number)
						{
							var venueNext;
							if (slideIndexNext < controlsForSlides.length)
							{
								var controlForSlideNext = controlsForSlides[slideIndexNext];
								venueNext = new VenueControls(controlForSlideNext);
							}
							else
							{
								venueNext = venueAfterSlideshow;
							}
							venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
							universe.venueNext = venueNext;
						}.bind(this, i + 1),
						null, null
					)
				],
				null, null
			);

			containerSlide.scalePosAndSize(scaleMultiplier);

			controlsForSlides.push(containerSlide);
		}

		return controlsForSlides[0];
	};

	title(universe: Universe, size: Coords)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var fontHeight = this.fontHeightInPixelsBase;

		var start = function()
		{
			var venueMessage = VenueMessage.fromText("Loading profiles...");

			var venueTask = new VenueTask
			(
				venueMessage,
				() => // perform
				{
					var result = universe.controlBuilder.profileSelect(universe, null);
					return result;
				},
				(universe: Universe, result: any) => // done
				{
					var venueProfileSelect = new VenueControls(result);

					universe.venueNext =
						new VenueFader(venueProfileSelect, universe.venueCurrent, null, null);
				}
			);

			universe.venueNext =
				new VenueFader(venueTask, universe.venueCurrent, null, null);
		};

		var returnValue = new ControlContainer
		(
			"containerTitle",
			this._zeroes, // pos
			this.sizeBase.clone(), // size
			// children
			[
				new ControlVisual
				(
					"imageTitle",
					this._zeroes,
					this.sizeBase.clone(), // size
					new VisualImageScaled(new VisualImageFromLibrary("Title"), size),
					null //?
				),

				new ControlButton
				(
					"buttonStart",
					new Coords(75, 100, 0), // pos
					new Coords(50, 40, 0), // size
					"Start",
					fontHeight * 2,
					false, // hasBorder
					true, // isEnabled
					start, // click
					null, null
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
	};

	worldDetail(universe: Universe, size: Coords)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var fontHeight = this.fontHeightInPixelsBase;

		var world = universe.world;

		var dateCreated = world.dateCreated;
		var dateSaved = world.dateSaved;

		var returnValue = new ControlContainer
		(
			"containerWorldDetail",
			this._zeroes, // pos
			this.sizeBase.clone(), // size
			// children
			[
				new ControlLabel
				(
					"labelProfileName",
					new Coords(100, 40, 0), // pos
					new Coords(100, 25, 0), // size
					true, // isTextCentered
					"Profile: " + universe.profile.name,
					fontHeight
				),
				new ControlLabel
				(
					"labelWorldName",
					new Coords(100, 55, 0), // pos
					new Coords(150, 25, 0), // size
					true, // isTextCentered
					"World: " + world.name,
					fontHeight
				),
				new ControlLabel
				(
					"labelStartDate",
					new Coords(100, 70, 0), // pos
					new Coords(150, 25, 0), // size
					true, // isTextCentered
					"Started:" + dateCreated.toStringTimestamp(),
					fontHeight
				),
				new ControlLabel
				(
					"labelSavedDate",
					new Coords(100, 85, 0), // pos
					new Coords(150, 25, 0), // size
					true, // isTextCentered
					"Saved:" + (dateSaved == null ? "[never]" : dateSaved.toStringTimestamp()),
					fontHeight
				),

				new ControlButton
				(
					"buttonStart",
					new Coords(50, 100, 0), // pos
					new Coords(100, 25, 0), // size
					"Start",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var world = universe.world;
						var venueWorld = new VenueWorld(world);
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
							var controlInstructions = universe.controlBuilder.message
							(
								universe,
								size,
								new DataBinding(instructions, null, null),
								() => // acknowledge
								{
									universe.venueNext = new VenueFader
									(
										venueWorld, universe.venueCurrent, null, null
									);
								},
								false
							);

							var venueInstructions =
								new VenueControls(controlInstructions);

							var venueMovie = new VenueVideo
							(
								"Movie", // videoName
								venueInstructions // fader implicit
							);

							venueNext = venueMovie;
						}

						venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
						universe.venueNext = venueNext;
					},
					null, null
				),

				new ControlButton
				(
					"buttonBack",
					new Coords(10, 10, 0), // pos
					new Coords(15, 15, 0), // size
					"<",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var venueNext: any = new VenueControls
						(
							universe.controlBuilder.profileDetail(universe, null)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
						universe.venueNext = venueNext;
					},
					null, null
				),

				new ControlButton
				(
					"buttonDelete",
					new Coords(180, 10, 0), // pos
					new Coords(15, 15, 0), // size
					"x",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var world = universe.world;

						var controlConfirm = universe.controlBuilder.confirm
						(
							universe,
							size,
							"Delete world \""
								+ world.name
								+ "\"?",
							() => // confirm
							{
								var profile = universe.profile;
								var world = universe.world;
								var worlds = profile.worlds;

								ArrayHelper.remove(worlds, world);
								universe.world = null;

								universe.profileHelper.profileSave
								(
									profile
								);

								var venueNext: any = new VenueControls
								(
									universe.controlBuilder.profileDetail(universe, null)
								);
								venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
								universe.venueNext = venueNext;
							},
							() => // cancel
							{
								var venueNext: any = new VenueControls
								(
									universe.controlBuilder.worldDetail(universe, null)
								);
								venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
								universe.venueNext = venueNext;
							}
						);

						var venueNext: any = new VenueControls(controlConfirm);
						venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);

						universe.venueNext = venueNext;
					},
					null, null
				),
			], // end children
			null, null
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	};

	worldLoad(universe: Universe, size: Coords)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var fontHeight = this.fontHeightInPixelsBase;

		var confirm = () =>
		{
			var profileOld = universe.profile;
			var profilesReloaded = universe.profileHelper.profiles();
			for (var i = 0; i < profilesReloaded.length; i++)
			{
				var profileReloaded = profilesReloaded[i];
				if (profileReloaded.name == profileOld.name)
				{
					universe.profile = profileReloaded;
					break;
				}
			}

			var worldOld = universe.world;
			var worldsReloaded = universe.profile.worlds;
			var worldToReload = null;
			for (var i = 0; i < worldsReloaded.length; i++)
			{
				var worldReloaded = worldsReloaded[i];
				if (worldReloaded.name == worldOld.name)
				{
					worldToReload = worldReloaded;
					break;
				}
			}

			var venueNext: any = new VenueControls
			(
				universe.controlBuilder.worldLoad(universe, null)
			);
			venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
			universe.venueNext = venueNext;

			if (worldToReload == null)
			{
				venueNext = new VenueControls
				(
					universe.controlBuilder.message
					(
						universe,
						size,
						new DataBinding("No save exists to reload!", null, null),
						() => // acknowledge
						{
							var venueNext: any = new VenueControls
							(
								universe.controlBuilder.worldLoad(universe, null)
							);
							venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
							universe.venueNext = venueNext;
						},
						false
					)
				);
				venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
				universe.venueNext = venueNext;
			}
			else
			{
				universe.world = worldReloaded;
			}
		};

		var cancel = () =>
		{
			var venueNext: any = new VenueControls
			(
				universe.controlBuilder.worldLoad(universe, null)
			);
			venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
			universe.venueNext = venueNext;
		};

		var returnValue = new ControlContainer
		(
			"containerWorldLoad",
			this._zeroes, // pos
			this.sizeBase.clone(), // size
			// children
			[
				new ControlButton
				(
					"buttonLoadFromServer",
					new Coords(30, 15, 0), // pos
					new Coords(140, 25, 0), // size
					"Reload from Local Storage",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var controlConfirm = universe.controlBuilder.confirm
						(
							universe,
							size,
							"Abandon the current game?",
							confirm,
							cancel
						);

						var venueConfirm = new VenueControls(controlConfirm);
						universe.venueNext = new VenueFader(venueConfirm, universe.venueCurrent, null, null);
					},
					null, null
				),

				new ControlButton
				(
					"buttonLoadFromFile",
					new Coords(30, 50, 0), // pos
					new Coords(140, 25, 0), // size
					"Load from File",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var venueFileUpload = new VenueFileUpload(null, null);

						var venueMessageReadyToLoad = new VenueControls
						(
							universe.controlBuilder.message
							(
								universe,
								size,
								new DataBinding("Ready to load from file...", null, null),
								() => // acknowledge
								{
									function callback(fileContentsAsString: string)
									{
										var worldAsJSON = fileContentsAsString;
										var worldDeserialized = universe.serializer.deserialize(worldAsJSON);
										universe.world = worldDeserialized;

										var venueNext: any = new VenueControls
										(
											universe.controlBuilder.game(universe, size)
										);
										venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
										universe.venueNext = venueNext;
									}

									var inputFile = venueFileUpload.toDomElement().getElementsByTagName("input")[0];
									var fileToLoad = inputFile.files[0];
									new FileHelper().loadFileAsText
									(
										fileToLoad,
										callback,
										null // contextForCallback
									);
								},
								null
							)
						);

						var venueMessageCancelled = new VenueControls
						(
							universe.controlBuilder.message
							(
								universe,
								size,
								new DataBinding("No file specified.", null, null),
								() => // acknowlege
								{
									var venueNext: any = new VenueControls
									(
										universe.controlBuilder.game(universe, size)
									);
									venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
									universe.venueNext = venueNext;
								},
								false //?
							)
						);

						venueFileUpload.venueNextIfFileSpecified = venueMessageReadyToLoad;
						venueFileUpload.venueNextIfCancelled = venueMessageCancelled;

						universe.venueNext = venueFileUpload;
					},
					null, null
				),

				new ControlButton
				(
					"buttonReturn",
					new Coords(30, 105, 0), // pos
					new Coords(140, 25, 0), // size
					"Return",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var venueGame = new VenueControls
						(
							universe.controlBuilder.game(universe, size)
						);
						universe.venueNext = new VenueFader(venueGame, universe.venueCurrent, null, null);
					},
					null, null
				),
			],
			null, null
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	};

	worldSave(universe: Universe, size: Coords)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var fontHeight = this.fontHeightInPixelsBase;

		var handleSaveToLocalStorage = (wasSaveSuccessful: boolean) =>
		{
			var message =
			(
				wasSaveSuccessful ? "Profile saved successfully." : "Save failed due to errors."
			);

			var venueNext: Venue = new VenueControls
			(
				universe.controlBuilder.message
				(
					universe,
					size,
					new DataBinding(message, null, null),
					() => // acknowledge
					{
						var venueNext: Venue = new VenueControls
						(
							universe.controlBuilder.game(universe, null)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
						universe.venueNext = venueNext;
					},
					false
				)
			);
			venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
			universe.venueNext = venueNext;
		}

		var saveToLocalStorage = () =>
		{
			var messageAsDataBinding = new DataBinding
			(
				null, // context - Set below.
				(c: VenueTask) => "Building record of game...",
				null
			);

			var venueMessage = new VenueMessage
			(
				messageAsDataBinding,
				null, null, null, null
			);

			var wasSaveSuccessful = false;

			var venueTask = new VenueTask
			(
				venueMessage,
				() => // perform
				{
					var profile = universe.profile;
					var world = universe.world;

					world.dateSaved = DateTime.now();
					wasSaveSuccessful = universe.profileHelper.profileSave
					(
						profile
					);

					return wasSaveSuccessful;
				},
				(universe: Universe, result: any) => // done
				{
					handleSaveToLocalStorage(result);
				}
			);
			messageAsDataBinding.contextSet(venueTask);

			universe.venueNext = new VenueFader(venueTask, universe.venueCurrent, null, null);
		};

		var saveToFilesystem = () =>
		{
			var venueMessage = VenueMessage.fromText("Building record of game...");

			var venueTask = new VenueTask
			(
				venueMessage,
				() => // perform
				{
					var world = universe.world;

					world.dateSaved = DateTime.now();
					var worldSerialized = universe.serializer.serialize(world, null);

					return worldSerialized;
				},
				(universe: Universe, worldSerialized: any) => // done
				{
					var wasSaveSuccessful = (worldSerialized != null);
					var message =
					(
						wasSaveSuccessful ? "Save ready: choose location on dialog." : "Save failed due to errors."
					);

					new FileHelper().saveTextStringToFileWithName
					(
						worldSerialized, universe.world.name + ".json"
					);

					var venueMessage = new VenueControls
					(
						universe.controlBuilder.message
						(
							universe,
							size,
							new DataBinding(message, null, null),
							() => // acknowledge
							{
								var venueNext: Venue = new VenueControls
								(
									universe.controlBuilder.game(universe, null)
								);
								venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
								universe.venueNext = venueNext;
							},
							null
						)
					);
					universe.venueNext = new VenueFader(venueMessage, universe.venueCurrent, null, null);
				}
			);

			universe.venueNext = new VenueFader(venueTask, universe.venueCurrent, null, null);
		};


		var returnValue = new ControlContainer
		(
			"containerSave",
			this._zeroes, // pos
			this.sizeBase.clone(), // size
			// children
			[
				new ControlButton
				(
					"buttonSaveToLocalStorage",
					new Coords(30, 15, 0), // pos
					new Coords(140, 25, 0), // size
					"Save to Local Storage",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					saveToLocalStorage,
					null, null
				),

				new ControlButton
				(
					"buttonSaveToFile",
					new Coords(30, 50, 0), // pos
					new Coords(140, 25, 0), // size
					"Save to File",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					saveToFilesystem, // click
					null, null
				),

				new ControlButton
				(
					"buttonReturn",
					new Coords(30, 105, 0), // pos
					new Coords(140, 25, 0), // size
					"Return",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var venueNext: any = new VenueControls
						(
							universe.controlBuilder.game(universe, null)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
						universe.venueNext = venueNext;
					},
					null, null
				),
			], // end children
			null, null
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	};
}
