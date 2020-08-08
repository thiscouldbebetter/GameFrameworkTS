
class ControlBuilder
{
	buttonHeightBase: number;
	buttonHeightSmallBase: number;
	fontHeightInPixelsBase: number;
	styles: ControlStyle[];
	stylesByName: Map<string,ControlStyle>;
	sizeBase: Coords;

	_zeroes: Coords;
	_scaleMultiplier: Coords;

	constructor(styles: Array<ControlStyle>)
	{
		this.styles = styles;
		this.stylesByName = ArrayHelper.addLookupsByName(styles);

		this.fontHeightInPixelsBase = 10;
		this.buttonHeightBase = this.fontHeightInPixelsBase * 2;
		this.buttonHeightSmallBase = this.fontHeightInPixelsBase * 1.5;
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

		var buttonHeight = this.buttonHeightBase;
		var padding = 5;
		var rowHeight = buttonHeight + padding;
		var rowCount = 5;
		var buttonsAllHeight = rowCount * buttonHeight + (rowCount - 1) * padding;
		var margin = (this.sizeBase.y - buttonsAllHeight) / 2;

		var buttonSize = new Coords(60, buttonHeight, 0);
		var posX = (this.sizeBase.x - buttonSize.x) / 2;

		var row0PosY = margin;
		var row1PosY = row0PosY + rowHeight;
		var row2PosY = row1PosY + rowHeight;
		var row3PosY = row2PosY + rowHeight;
		var row4PosY = row3PosY + rowHeight;

		var back = () =>
		{
			var venueNext: Venue = new VenueControls
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
							universe.controlBuilder.saveStateSave(universe, size)
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
							universe.controlBuilder.saveStateLoad(universe, null)
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

		var buttonHeight = this.buttonHeightBase;
		var padding = 5;
		var rowCount = 3;
		var rowHeight = buttonHeight + padding;
		var buttonsAllHeight = rowCount * buttonHeight + (rowCount - 1) * padding;
		var margin = (this.sizeBase.y - buttonsAllHeight) / 2;

		var row0PosY = margin;
		var row1PosY = row0PosY + rowHeight;
		var row2PosY = row1PosY + rowHeight;

		var back = () =>
		{
			var venueNext: any = new VenueWorld(universe.world);
			venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
			universe.venueNext = venueNext;
		};

		var returnValue = new ControlContainer
		(
			"Game",
			this._zeroes, // pos
			this.sizeBase.clone(),
			// children
			[
				new ControlButton
				(
					"buttonGame",
					new Coords(70, row0PosY, 0), // pos
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
					new Coords(70, row1PosY, 0), // pos
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
					new Coords(70, row2PosY, 0), // pos
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
		var placeDefn = world.defn.placeDefnsByName().get(placeCurrentDefnName);
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
					new Coords(100, 20, 0), // size
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
					DataBinding.fromGet( (c: ActionToInputsMapping) => c ), // bindingForItemValue
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

	saveStateLoad(universe: Universe, size: Coords)
	{
		var isLoadNotSave = true;
		return this.saveStateLoadOrSave(universe, size, isLoadNotSave);
	}

	saveStateSave(universe: Universe, size: Coords)
	{
		var isLoadNotSave = false;
		return this.saveStateLoadOrSave(universe, size, isLoadNotSave);
	}

	saveStateLoadOrSave(universe: Universe, size: Coords, isLoadNotSave: boolean)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var fontHeight = this.fontHeightInPixelsBase;
		var visualThumbnailSize = new Coords(60, 45, 0);

		var venueToReturnTo = universe.venueCurrent;

		var loadNewWorld = () =>
		{
			var world = World.create(universe);
			universe.world = world;
			var venueNext: Venue = new VenueControls
			(
				universe.controlBuilder.worldDetail(universe, size)
			);
			venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
			universe.venueNext = venueNext;
		};

		var loadSelectedSlotFromLocalStorage = () =>
		{
			var saveStateNameSelected = universe.profile.saveStateNameSelected;
			if (saveStateNameSelected != null)
			{
				var messageAsDataBinding = new DataBinding
				(
					null, // Will be set below.
					(c: VenueTask) => "Loading game...",
					null
				);

				var venueMessage = new VenueMessage
				(
					messageAsDataBinding, null, null, null, null
				);

				var venueTask = new VenueTask
				(
					venueMessage,
					() => // perform
					{
						return universe.storageHelper.load(saveStateNameSelected);
					},
					(universe: Universe, saveStateSelected: SaveState) => // done
					{
						var worldSelected = saveStateSelected.world;
						universe.world = worldSelected;
						var venueNext: Venue = new VenueWorld(worldSelected);
						venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
						universe.venueNext = venueNext;
					}
				);

				messageAsDataBinding.contextSet(venueTask);

				universe.venueNext = new VenueFader(venueTask, universe.venueCurrent, null, null)
			}
		};

		var saveToLocalStorage = (saveState: SaveState) =>
		{
			var profile = universe.profile;
			var world = universe.world;
			var now = DateTime.now();
			world.dateSaved = now;

			var nowAsString = now.toStringYYYYMMDD_HHMM_SS();
			var place = world.placeCurrent;
			var placeName = place.name;
			var timePlayingAsString = world.timePlayingAsString(universe, true); // isShort

			var displaySize = universe.display.sizeInPixels;
			var displayFull = new Display2D([ displaySize ], null, null, null, null, true); // isInvisible
			displayFull.initialize(universe);
			place.draw(universe, world, displayFull);
			var imageSnapshotFull = displayFull.toImage();

			var imageSizeThumbnail = visualThumbnailSize.clone();
			var displayThumbnail = new Display2D([ imageSizeThumbnail ], null, null, null, null, true);
			displayThumbnail.initialize(universe);
			displayThumbnail.drawImageScaled(imageSnapshotFull, Coords.Instances().Zeroes, imageSizeThumbnail);
			var imageThumbnailFromDisplay = displayThumbnail.toImage();
			var imageThumbnailAsDataUrl = imageThumbnailFromDisplay.systemImage.toDataURL();
			var imageThumbnail = new Image2("Snapshot", imageThumbnailAsDataUrl).unload();

			var saveStateName = "Save-" + nowAsString;
			var saveState = new SaveState
			(
				saveStateName,
				placeName,
				timePlayingAsString,
				now,
				imageThumbnail,
				world
			);

			var storageHelper = universe.storageHelper;

			var wasSaveSuccessful;
			try
			{
				storageHelper.save(saveStateName, saveState);
				if (profile.saveStates.some(x => x.name == saveStateName) == false)
				{
					saveState.unload();
					profile.saveStates.push(saveState);
					storageHelper.save(profile.name, profile);
				}
				var profileNames = storageHelper.load("ProfileNames");
				if (profileNames.indexOf(profile.name) == -1)
				{
					profileNames.push(profile.name);
					storageHelper.save("ProfileNames", profileNames);
				}

				wasSaveSuccessful = true;
			}
			catch (ex)
			{
				wasSaveSuccessful = false;
			}

			return wasSaveSuccessful;
		};

		var saveToLocalStorageDone = (wasSaveSuccessful: boolean) =>
		{
			var message =
			(
				wasSaveSuccessful ? "Game saved successfully." : "Save failed due to errors."
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

		var saveToLocalStorageAsNewSlot = () =>
		{
			var messageAsDataBinding = new DataBinding
			(
				null, // context - Set below.
				(c: VenueTask) => "Saving game...",
				null
			);

			var venueMessage = new VenueMessage
			(
				messageAsDataBinding,
				null, null, null, null
			);

			var venueTask = new VenueTask
			(
				venueMessage,
				saveToLocalStorage,
				(universe: Universe, result: any) => // done
				{
					saveToLocalStorageDone(result);
				}
			);
			messageAsDataBinding.contextSet(venueTask);

			universe.venueNext = new VenueFader(venueTask, universe.venueCurrent, null, null);
		};

		var saveToFilesystem = () =>
		{
			var venueMessage = VenueMessage.fromText("Saving game...");

			var venueTask = new VenueTask
			(
				venueMessage,
				() => // perform
				{
					var world = universe.world;

					world.dateSaved = DateTime.now();
					var worldSerialized = universe.serializer.serialize(world, null);

					var compressor = universe.storageHelper.compressor;
					var worldCompressedAsBytes = compressor.compressStringToBytes(worldSerialized);

					return worldCompressedAsBytes;
				},
				(universe: Universe, worldCompressedAsBytes: number[]) => // done
				{
					var wasSaveSuccessful = (worldCompressedAsBytes != null);
					var message =
					(
						wasSaveSuccessful ? "Save ready: choose location on dialog." : "Save failed due to errors."
					);

					new FileHelper().saveBytesToFileWithName
					(
						worldCompressedAsBytes, universe.world.name + ".json.lzw"
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

		var loadFromFile = () => // click
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
							var worldAsStringCompressed = fileContentsAsString;
							var compressor = universe.storageHelper.compressor;
							var worldSerialized = compressor.decompressString(worldAsStringCompressed);
							var worldDeserialized = universe.serializer.deserialize(worldSerialized);
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
						new FileHelper().loadFileAsBinaryString
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
		};

		var back = () =>
		{
			var venueNext = venueToReturnTo;
			venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
			universe.venueNext = venueNext;
		};

		var deleteSaveSelectedConfirm = () =>
		{
			var saveStateSelected = universe.profile.saveStateSelected();

			var storageHelper = universe.storageHelper;
			storageHelper.delete(saveStateSelected.name);
			var profile = universe.profile;
			ArrayHelper.remove(profile.saveStates, saveStateSelected);
			storageHelper.save(profile.name, profile);

			var venueNext: Venue = new VenueControls
			(
				universe.controlBuilder.saveStateLoad(universe, size)
			);
			venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
			universe.venueNext = venueNext;
		};

		var deleteSaveSelected = () =>
		{
			var saveStateSelected = universe.profile.saveStateSelected();

			if (saveStateSelected == null)
			{
				return;
			}

			var controlConfirm = universe.controlBuilder.confirm
			(
				universe,
				size,
				"Delete save state \""
					+ saveStateSelected.timeSaved.toStringYYYY_MM_DD_HH_MM_SS()
					+ "\"?",
				deleteSaveSelectedConfirm,
				() => // cancel
				{
					var venueNext: any = new VenueControls
					(
						universe.controlBuilder.saveStateLoad(universe, size)
					);
					venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
					universe.venueNext = venueNext;
				}
			);

			var venueNext: any = new VenueControls(controlConfirm);
			venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
			universe.venueNext = venueNext;
		};

		var saveToLocalStorageOverwritingSlotSelected = () =>
		{
			deleteSaveSelectedConfirm();
			saveToLocalStorageAsNewSlot();
		};

		var returnValue = new ControlContainer
		(
			"containerSaveStates",
			this._zeroes, // pos
			this.sizeBase.clone(), // size
			// children
			[
				new ControlLabel
				(
					"labelProfileName",
					new Coords(100, 10, 0), // pos
					new Coords(120, fontHeight, 0), // size
					true, // isTextCentered
					"Profile: " + universe.profile.name,
					fontHeight
				),

				new ControlLabel
				(
					"labelChooseASave",
					new Coords(100, 20, 0), // pos
					new Coords(150, 25, 0), // size
					true, // isTextCentered
					"Choose a State to " + (isLoadNotSave ? "Restore" : "Overwrite") + ":",
					fontHeight
				),

				new ControlList
				(
					"listSaveStates",
					new Coords(10, 35, 0), // pos
					new Coords(110, 75, 0), // size
					new DataBinding
					(
						universe.profile,
						(c: Profile) => c.saveStates,
						null
					), // items
					DataBinding.fromGet
					(
						(c: SaveState) => 
						{
							var timeSaved = c.timeSaved;
							return (timeSaved == null ? "-" : timeSaved.toStringYYYY_MM_DD_HH_MM_SS() )
						}
					), // bindingForOptionText
					fontHeight,
					new DataBinding
					(
						universe.profile,
						(c: Profile) => c.saveStateSelected(),
						(c: Profile, v: SaveState) => { c.saveStateNameSelected = v.name; }
					), // bindingForOptionSelected
					DataBinding.fromGet( (c: string) => c ), // value
					null,
					(isLoadNotSave ? loadSelectedSlotFromLocalStorage: saveToLocalStorageOverwritingSlotSelected), // confirm
					null
				),

				new ControlButton
				(
					"buttonNew",
					new Coords(10, 120, 0), // pos
					new Coords(25, this.buttonHeightBase, 0), // size
					"New",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					(isLoadNotSave ? loadNewWorld : saveToLocalStorageAsNewSlot), // click
					null, null
				),

				new ControlButton
				(
					"buttonSelect",
					new Coords(40, 120, 0), // pos
					new Coords(25, this.buttonHeightBase, 0), // size
					(isLoadNotSave ? "Load" : "Save"),
					fontHeight,
					true, // hasBorder
					// isEnabled
					new DataBinding
					(
						universe.profile,
						(c: Profile) => (c.saveStateNameSelected != null),
						null
					),
					(isLoadNotSave ? loadSelectedSlotFromLocalStorage : saveToLocalStorageOverwritingSlotSelected), // click
					null, null
				),

				new ControlButton
				(
					"buttonFile",
					new Coords(70, 120, 0), // pos
					new Coords(25, this.buttonHeightBase, 0), // size
					"File",
					fontHeight,
					true, // hasBorder
					// isEnabled
					new DataBinding
					(
						universe.profile,
						(c: Profile) => (c.saveStateNameSelected != null),
						null
					),
					(isLoadNotSave ? loadFromFile : saveToFilesystem), // click
					null, null
				),

				new ControlButton
				(
					"buttonDelete",
					new Coords(100, 120, 0), // pos
					new Coords(20, this.buttonHeightBase, 0), // size
					"X",
					fontHeight,
					true, // hasBorder
					// isEnabled
					new DataBinding
					(
						universe.profile,
						(c: Profile) => (c.saveStateNameSelected != null),
						null
					),
					deleteSaveSelected, // click
					null, null
				),

				new ControlVisual
				(
					"visualSnapshot",
					new Coords(130, 35, 0),
					visualThumbnailSize,
					new DataBinding
					(
						universe.profile,
						(c: Profile) =>
						{
							var saveState = c.saveStateSelected();
							var saveStateImageSnapshot =
							(
								saveState == null
								? null
								: saveState.imageSnapshot.load()
							);
							var returnValue =
							(
								saveStateImageSnapshot == null || saveStateImageSnapshot.isLoaded == false
								? new VisualNone()
								: new VisualImageImmediate(saveStateImageSnapshot, true) // isScaled
							);
							return returnValue;
						},
						null
					),
					Color.byName("White")
				),

				new ControlLabel
				(
					"labelPlaceName",
					new Coords(130, 80, 0), // pos
					new Coords(120, this.buttonHeightBase, 0), // size
					false, // isTextCentered
					new DataBinding
					(
						universe.profile,
						(c: Profile) =>
						{
							var saveState = c.saveStateSelected();
							return (saveState == null ? "" : saveState.placeName);
						},
						null
					),
					fontHeight
				),

				new ControlLabel
				(
					"labelTimePlaying",
					new Coords(130, 90, 0), // pos
					new Coords(120, this.buttonHeightBase, 0), // size
					false, // isTextCentered
					new DataBinding
					(
						universe.profile,
						(c: Profile) =>
						{
							var saveState = c.saveStateSelected();
							return (saveState == null ? "" : saveState.timePlayingAsString);
						},
						null
					),
					fontHeight
				),

				new ControlLabel
				(
					"labelDateSaved",
					new Coords(130, 100, 0), // pos
					new Coords(120, this.buttonHeightBase, 0), // size
					false, // isTextCentered
					new DataBinding
					(
						universe.profile,
						(c: Profile) =>
						{
							var saveState = c.saveStateSelected();
							var returnValue =
							(
								saveState == null
								? ""
								: 
								(
									saveState.timeSaved == null
									? ""
									: saveState.timeSaved.toStringYYYY_MM_DD()
								)
							);
							return returnValue;
						},
						null
					),
					fontHeight
				),

				new ControlLabel
				(
					"labelTimeSaved",
					new Coords(130, 110, 0), // pos
					new Coords(120, this.buttonHeightBase, 0), // size
					false, // isTextCentered
					new DataBinding
					(
						universe.profile,
						(c: Profile) =>
						{
							var saveState = c.saveStateSelected();
							return (saveState == null ? "" : saveState.timeSaved.toStringHH_MM_SS());
						},
						null
					),
					fontHeight
				),

				new ControlButton
				(
					"buttonBack",
					new Coords(this.sizeBase.x - 10 - 25, this.sizeBase.y - 10 - 15, 0), // pos
					new Coords(25, 15, 0), // size
					"Back",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					back, // click
					null, null
				),
			],
			null, null
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	};

	profileNew(universe: Universe, size: Coords)
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
					new Coords(100, 20, 0), // size
					true, // isTextCentered
					"Profile Name:",
					fontHeight
				),

				new ControlTextBox
				(
					"textBoxName",
					new Coords(50, 50, 0), // pos
					new Coords(100, 20, 0), // size
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
					new Coords(45, this.buttonHeightBase, 0), // size
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

						var storageHelper = universe.storageHelper;

						var profile = new Profile(profileName, []);
						var profileNames = storageHelper.load("ProfileNames");
						if (profileNames == null)
						{
							profileNames = [];
						}
						profileNames.push(profileName);
						storageHelper.save("ProfileNames", profileNames);
						storageHelper.save(profileName, profile); 

						universe.profile = profile;
						var venueNext: any = new VenueControls
						(
							universe.controlBuilder.saveStateLoad(universe, null)
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
					new Coords(45, this.buttonHeightBase, 0), // size
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

		var storageHelper = universe.storageHelper;
		var profileNames = storageHelper.load("ProfileNames") as Array<string>;
		if (profileNames == null)
		{
			profileNames = [];
			storageHelper.save("ProfileNames", profileNames);
		}
		var profiles = profileNames.map(x => storageHelper.load(x));

		var create = () =>
		{
			universe.profile = new Profile("", null);
			var venueNext: any = new VenueControls
			(
				universe.controlBuilder.profileNew(universe, null)
			);
			venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
			universe.venueNext = venueNext;
		};

		var select = () =>
		{
			var venueControls = universe.venueCurrent as VenueControls;
			var controlRootAsContainer = venueControls.controlRoot as ControlContainer;
			var listProfiles =
				controlRootAsContainer.childrenByName.get("listProfiles") as ControlList;
			var profileSelected = listProfiles.itemSelected(null);
			universe.profile = profileSelected;
			if (profileSelected != null)
			{
				var venueNext: any = new VenueControls
				(
					universe.controlBuilder.saveStateLoad(universe, null)
				);
				venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
				universe.venueNext = venueNext;
			}
		};

		var skip = () =>
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
					return World.create(universe);
				},
				(universe: Universe, world: World) => // done
				{
					universe.world = world;

					var now = DateTime.now();
					var nowAsString = now.toStringMMDD_HHMM_SS();
					var profileName = "Anon-" + nowAsString;
					var profile = new Profile(profileName, []);
					universe.profile = profile;

					var venueNext: any = new VenueWorld(universe.world);
					venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
					universe.venueNext = venueNext;
				}
			);

			messageAsDataBinding.contextSet(venueTask);

			universe.venueNext = new VenueFader(venueTask, universe.venueCurrent, null, null)

		};

		var deleteProfileConfirm = () =>
		{
			var profileSelected = universe.profile;

			var storageHelper = universe.storageHelper;
			storageHelper.delete(profileSelected.name);
			var profileNames = storageHelper.load("ProfileNames");
			ArrayHelper.remove(profileNames, profileSelected.name);
			storageHelper.save("ProfileNames", profileNames);

			var venueNext: Venue = new VenueControls
			(
				universe.controlBuilder.profileSelect(universe, size)
			);
			venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
			universe.venueNext = venueNext;
		};

		var deleteProfile = () =>
		{
			var profileSelected = universe.profile;
			if (profileSelected != null)
			{
				var controlConfirm = universe.controlBuilder.confirm
				(
					universe,
					size,
					"Delete profile \""
						+ profileSelected.name
						+ "\"?",
					deleteProfileConfirm,
					() => // cancel
					{
						var venueNext: any = new VenueControls
						(
							universe.controlBuilder.profileSelect(universe, size)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
						universe.venueNext = venueNext;
					}
				);

				var venueNext: any = new VenueControls(controlConfirm);
				venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
				universe.venueNext = venueNext;
			}
		};

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
					new Coords(30, 50, 0), // pos
					new Coords(140, 40, 0), // size
					DataBinding.fromContext(profiles), // items
					DataBinding.fromGet( (c: Profile) => c.name ), // bindingForItemText
					fontHeight,
					new DataBinding
					(
						universe,
						(c: Universe) => { return c.profile; },
						(c: Universe, v: Profile) => { c.profile = v; }
					), // bindingForOptionSelected
					DataBinding.fromGet( (c: Profile) => c ), // value
					null, // bindingForIsEnabled
					select, // confirm
					null // widthInItems
				),

				new ControlButton
				(
					"buttonNew",
					new Coords(30, 95, 0), // pos
					new Coords(35, this.buttonHeightBase, 0), // size
					"New",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					create, // click
					null, null
				),

				new ControlButton
				(
					"buttonSelect",
					new Coords(70, 95, 0), // pos
					new Coords(35, this.buttonHeightBase, 0), // size
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
					select, // click
					null, null
				),

				new ControlButton
				(
					"buttonSkip",
					new Coords(110, 95, 0), // pos
					new Coords(35, this.buttonHeightBase, 0), // size
					"Skip",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					skip, // click
					null, null
				),

				new ControlButton
				(
					"buttonDelete",
					new Coords(150, 95, 0), // pos
					new Coords(20, this.buttonHeightBase, 0), // size
					"X",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					deleteProfile, // click
					null, null
				),

				new ControlButton
				(
					"buttonBack",
					new Coords(this.sizeBase.x - 10 - 25, this.sizeBase.y - 10 - 15, 0), // pos
					new Coords(25, 15, 0), // size
					"Back",
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
					new Coords(70, row1PosY, 0), // pos
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
					DataBinding.fromGet( (c: ControlSelectOption) => c.value ), // bindingForOptionValues,
					DataBinding.fromGet( (c: ControlSelectOption) => c.text ), // bindingForOptionText
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
					new Coords(65, buttonHeight, 0), // size
					universe.display.sizeInPixels, // valueSelected
					// options
					universe.display.sizesAvailable,
					DataBinding.fromGet( (c: Coords) => c ), // bindingForOptionValues,
					DataBinding.fromGet( (c: Coords) => c.toStringXY() ), // bindingForOptionText
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
						new DataBinding<any, Visual>
						(
							new VisualImageFromLibrary(imageName),
							null, null
						),
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
						function(slideIndexNext: number)
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
					new DataBinding
					(
						new VisualImageScaled(new VisualImageFromLibrary("Title"), size),
						null, null
					),
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
					new Coords(100, 20, 0), // size
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
					new Coords(100, this.buttonHeightBase, 0), // size
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
							universe.controlBuilder.saveStateLoad(universe, null)
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
						var saveState = universe.profile.saveStateSelected();
						var saveStateName = saveState.name;

						var controlConfirm = universe.controlBuilder.confirm
						(
							universe,
							size,
							"Delete save \""
								+ saveStateName
								+ "\"?",
							() => // confirm
							{
								var storageHelper = universe.storageHelper;

								var profile = universe.profile;

								var saveStates = profile.saveStates;
								ArrayHelper.remove(saveStates, saveState);
								storageHelper.save(profile.name, profile);

								universe.world = null;
								storageHelper.delete(saveStateName);

								var venueNext: any = new VenueControls
								(
									universe.controlBuilder.saveStateLoad(universe, null)
								);
								venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
								universe.venueNext = venueNext;
							},
							() => // cancel
							{
								var venueNext: any = new VenueControls
								(
									universe.controlBuilder.saveStateLoad(universe, null)
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
			var storageHelper = universe.storageHelper;

			var messageAsDataBinding = new DataBinding
			(
				null, // Will be set below.
				(c: VenueTask) => "Loading game...",
				null
			);

			var venueMessage = new VenueMessage
			(
				messageAsDataBinding, null, null, null, null
			);

			var venueTask = new VenueTask
			(
				venueMessage,
				() => // perform
				{
					var profile = universe.profile;
					var saveStateSelected = profile.saveStateSelected;
					return storageHelper.load(saveStateSelected.name);
				},
				(universe: Universe, saveStateReloaded: SaveState) => // done
				{
					universe.world = saveStateReloaded.world;
					var venueNext: any = new VenueControls
					(
						universe.controlBuilder.worldLoad(universe, null)
					);
					venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
					universe.venueNext = venueNext;
				}
			);

			messageAsDataBinding.contextSet(venueTask);

			universe.venueNext = new VenueFader(venueTask, universe.venueCurrent, null, null)
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
					"labelSelectASave",
					new Coords(100, 40, 0), // pos
					new Coords(100, 25, 0), // size
					true, // isTextCentered
					"Select a Save:",
					fontHeight
				),

				new ControlList
				(
					"listSaveStates",
					new Coords(30, 50, 0), // pos
					new Coords(140, 50, 0), // size
					new DataBinding
					(
						universe.profile,
						(c: Profile) => c.saveStates,
						null
					), // items
					DataBinding.fromGet( (c: SaveState) => c.name ), // bindingForOptionText
					fontHeight,
					new DataBinding
					(
						universe.profile,
						(c: Profile) => c.saveStateSelected(),
						(c: Profile, v: SaveState) => { c.saveStateNameSelected = v.name; }
					), // bindingForOptionSelected
					DataBinding.fromGet( (c: string) => c ), // value
					null, null, null
				),

				new ControlButton
				(
					"buttonLoadFromServer",
					new Coords(30, 105, 0), // pos
					new Coords(40, this.buttonHeightBase, 0), // size
					"Load",
					fontHeight,
					true, // hasBorder
					new DataBinding(true, null, null), // isEnabled
					() => // click
					{
						var controlConfirm = universe.controlBuilder.confirm
						(
							universe, size, "Abandon the current game?", 
							confirm, cancel
						);
						var venueConfirm = new VenueControls(controlConfirm);
						universe.venueNext = new VenueFader(venueConfirm, universe.venueCurrent, null, null);
					},
					null, null
				),

				new ControlButton
				(
					"buttonLoadFromFile",
					new Coords(80, 105, 0), // pos
					new Coords(40, this.buttonHeightBase, 0), // size
					"Load File",
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
										var worldAsStringCompressed = fileContentsAsString;
										var compressor = universe.storageHelper.compressor;
										var worldSerialized = compressor.decompressString(worldAsStringCompressed);
										var worldDeserialized = universe.serializer.deserialize(worldSerialized);
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
									new FileHelper().loadFileAsBinaryString
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
					new Coords(130, 105, 0), // pos
					new Coords(40, this.buttonHeightBase, 0), // size
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
}
