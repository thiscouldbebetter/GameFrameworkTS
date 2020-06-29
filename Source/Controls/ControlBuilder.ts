
class ControlBuilder
{
	constructor(styles)
	{
		this.styles = styles.addLookupsByName();

		this.fontHeightInPixelsBase = 10;
		this.sizeBase = new Coords(200, 150, 1);

		// Helper variables.

		this._zeroes = new Coords(0, 0, 0);
		this._scaleMultiplier = new Coords();
	}

	choice
	(
		universe, size, message, optionNames, optionFunctions, showMessageOnly
	)
	{
		size = size || universe.display.sizeDefault();
		showMessageOnly = showMessageOnly || false;

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);
		var fontHeight = this.fontHeightInPixelsBase;

		var numberOfLinesInMessageMinusOne = message.split("\n").length - 1;
		var labelSize = new Coords
		(
			200, fontHeight * numberOfLinesInMessageMinusOne
		);

		var numberOfOptions = optionNames.length;

		if (showMessageOnly && numberOfOptions == 1)
		{
			numberOfOptions = 0; // Is a single option really an option?
		}

		var labelPosYBase = (numberOfOptions > 0 ? 65 : 75); // hack

		var labelPos = new Coords
		(
			100, labelPosYBase - fontHeight * (numberOfLinesInMessageMinusOne / 4),
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

		var childControls = [ labelMessage ];

		if (showMessageOnly == false)
		{
			var buttonWidth = 55;
			var buttonSize = new Coords(buttonWidth, fontHeight * 2);
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
						100
					), // pos
					buttonSize.clone(),
					optionNames[i],
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					optionFunctions[i],
					universe // context
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

		var returnValue = new ControlContainer
		(
			"containerChoice",
			containerPosScaled,
			containerSizeScaled,
			childControls,
			actions
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
		universe, size, message, options, bindingForOptionText, buttonSelectText, select
	)
	{
		// todo - Variable sizes.

		var marginWidth = 10;
		var marginSize = new Coords(1, 1).multiplyScalar(marginWidth);
		var fontHeight = 20;
		var labelSize = new Coords(size.x - marginSize.x * 2, fontHeight);
		var buttonSize = new Coords(labelSize.x, fontHeight * 2);
		var listSize = new Coords
		(
			labelSize.x,
			size.y - labelSize.y - buttonSize.y - marginSize.y * 4
		);

		var listOptions = new ControlList
		(
			"listOptions",
			new Coords(marginSize.x, labelSize.y + marginSize.y * 2),
			listSize,
			options,
			bindingForOptionText,
			fontHeight,
			null, // bindingForItemSelected
			null // bindingForItemValue
		);

		var returnValue = new ControlContainer
		(
			"containerChoice",
			new Coords(0, 0),
			size,
			[
				new ControlLabel
				(
					"labelMessage",
					new Coords(size.x / 2, marginSize.y + fontHeight / 2),
					labelSize,
					true, // isTextCentered
					message,
					fontHeight
				),

				listOptions,

				new ControlButton
				(
					"buttonSelect",
					new Coords(marginSize.x, size.y - marginSize.y - buttonSize.y),
					buttonSize,
					buttonSelectText,
					fontHeight,
					true, // hasBorder
					true, // isEnabled,
					function click(universe)
					{
						var itemSelected = listOptions.itemSelected();
						if (itemSelected != null)
						{
							select(universe, itemSelected);
						}
					},
					universe, // context
					false // canBeHeldDown
				),
			]
		);

		return returnValue;
	};

	confirm(universe, size, message, confirm, cancel)
	{
		return this.choice
		(
			universe, size, message, ["Confirm", "Cancel"], [confirm, cancel]
		);
	};

	game(universe, size)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault().clone();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var fontHeight = this.fontHeightInPixelsBase;

		var buttonHeight = 20;
		var buttonSize = new Coords(60, buttonHeight);
		var margin = 15;
		var padding = 5;
		var labelPadding = 3;

		var posX = 70;
		var rowHeight = buttonHeight + padding;
		var row0PosY = margin;
		var row1PosY = row0PosY + rowHeight;
		var row2PosY = row1PosY + rowHeight;
		var row3PosY = row2PosY + rowHeight;
		var row4PosY = row3PosY + rowHeight;

		var back = function()
		{
			var venueNext = new VenueControls
			(
				universe.controlBuilder.gameAndSettings(universe, size)
			);
			venueNext = new VenueFader(venueNext, universe.venueCurrent);
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
					new Coords(posX, row0PosY), // pos
					buttonSize.clone(),
					"Save",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var venueNext = new VenueControls
						(
							universe.controlBuilder.worldSave(universe)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),

				new ControlButton
				(
					"buttonLoad",
					new Coords(posX, row1PosY), // pos
					buttonSize.clone(),
					"Load",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var venueNext = new VenueControls
						(
							universe.controlBuilder.worldLoad(universe)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),

				new ControlButton
				(
					"buttonAbout",
					new Coords(posX, row2PosY), // pos
					buttonSize.clone(),
					"About",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var venueCurrent = universe.venueCurrent;
						var venueNext = new VenueMessage
						(
							universe.name + "\nv" + universe.version,
							function acknowledge(universe)
							{
								universe.venueNext = new VenueFader(venueCurrent);
							},
							universe.venueCurrent, // venuePrev
							size
						);
						venueNext = new VenueFader(venueNext, venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),

				new ControlButton
				(
					"buttonQuit",
					new Coords(posX, row3PosY), // pos
					buttonSize.clone(),
					"Quit",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var controlConfirm = universe.controlBuilder.confirm
						(
							universe,
							size,
							"Are you sure you want to quit?",
							function confirm(universe)
							{
								universe.reset();
								var venueNext = new VenueControls
								(
									universe.controlBuilder.title(universe)
								);
								venueNext = new VenueFader(venueNext, universe.venueCurrent);
								universe.venueNext = venueNext;
							},
							function cancel(universe)
							{
								var venueNext = new VenueControls
								(
									universe.controlBuilder.gameAndSettings(universe, size)
								);
								venueNext = new VenueFader(venueNext, universe.venueCurrent);
								universe.venueNext = venueNext;
							}
						);

						var venueNext = new VenueControls(controlConfirm);
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),

				new ControlButton
				(
					"buttonBack",
					new Coords(posX, row4PosY), // pos
					buttonSize.clone(),
					"Back",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					back
				),
			],

			[ new Action("Back", back) ],

			[ new ActionToInputsMapping( "Back", [ universe.inputHelper.inputNames.Escape ], true ) ],

		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	};

	gameAndSettings(universe, size)
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
		var labelPadding = 3;

		var rowHeight = buttonHeight + padding;
		var row0PosY = margin;
		var row1PosY = row0PosY + rowHeight;
		var row2PosY = row1PosY + rowHeight;
		var row3PosY = row2PosY + rowHeight;
		var row4PosY = row3PosY + rowHeight;

		var back = function()
		{
			var venueNext = new VenueWorld(universe.world);
			venueNext = new VenueFader(venueNext, universe.venueCurrent);
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
					new Coords(70, row1PosY), // pos
					new Coords(60, buttonHeight), // size
					"Game",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var venueNext = new VenueControls
						(
							universe.controlBuilder.game(universe, size)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),

				new ControlButton
				(
					"buttonSettings",
					new Coords(70, row2PosY), // pos
					new Coords(60, buttonHeight), // size
					"Settings",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var venueNext = new VenueControls
						(
							universe.controlBuilder.settings(universe)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),

				new ControlButton
				(
					"buttonResume",
					new Coords(70, row3PosY), // pos
					new Coords(60, buttonHeight), // size
					"Resume",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					back,
				),
			],

			[ new Action("Back", back) ],

			[ new ActionToInputsMapping( "Back", [ universe.inputHelper.inputNames.Escape ], true ) ],

		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	};

	inputs (universe, size, venuePrev)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var fontHeight = this.fontHeightInPixelsBase;

		var profiles = universe.profileHelper.profiles();

		var world = universe.world;
		var placeCurrentDefnName = "Demo"; // hack
		var placeDefn = world.defns.placeDefns[placeCurrentDefnName];
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
					new Coords(100, 15), // pos
					new Coords(100, 25), // size
					true, // isTextCentered
					"Actions:",
					fontHeight
				),

				new ControlList
				(
					"listActions",
					new Coords(50, 25), // pos
					new Coords(100, 40), // size
					new DataBinding(placeDefn.actionToInputsMappingsEdited), // items
					new DataBinding(null, function get(c) { return c.actionName; }), // bindingForItemText
					fontHeight,
					new DataBinding
					(
						placeDefn,
						function get(c) { return c.actionToInputsMappingSelected; },
						function set(c, v) { c.actionToInputsMappingSelected = v; }
					), // bindingForItemSelected
					new DataBinding(null, function(c) { return c; } ), // bindingForItemValue
				),

				new ControlLabel
				(
					"labelInput",
					new Coords(100, 70), // pos
					new Coords(100, 15), // size
					true, // isTextCentered
					"Inputs:",
					fontHeight
				),

				new ControlLabel
				(
					"infoInput",
					new Coords(100, 80), // pos
					new Coords(200, 15), // size
					true, // isTextCentered
					new DataBinding
					(
						placeDefn,
						function get(c)
						{
							var i = c.actionToInputsMappingSelected;
							return (i == null ? "-" : i.inputNames.join(", "));
						}
					), // text
					fontHeight
				),

				new ControlButton
				(
					"buttonClear",
					new Coords(25, 90), // pos
					new Coords(45, 15), // size
					"Clear",
					fontHeight,
					true, // hasBorder
					new DataBinding
					(
						placeDefn,
						function get(c) { return c.actionToInputsMappingSelected != null}
					), // isEnabled
					function click(universe)
					{
						var mappingSelected = placeDefn.actionToInputsMappingSelected;
						if (mappingSelected != null)
						{
							mappingSelected.inputNames.length = 0;
						}
					},
					universe // context
				),

				new ControlButton
				(
					"buttonAdd",
					new Coords(80, 90), // pos
					new Coords(45, 15), // size
					"Add",
					fontHeight,
					true, // hasBorder
					new DataBinding
					(
						placeDefn,
						function get(c) { return c.actionToInputsMappingSelected != null}
					), // isEnabled
					function click(universe)
					{
						var mappingSelected = placeDefn.actionToInputsMappingSelected;
						if (mappingSelected != null)
						{
							var venueInputCapture = new VenueInputCapture
							(
								universe.venueCurrent,
								function(inputCaptured)
								{
									var inputName = inputCaptured.name;
									mappingSelected.inputNames.push(inputName);
								}
							);
							universe.venueNext = venueInputCapture
						}
					},
					universe // context
				),

				new ControlButton
				(
					"buttonRestoreDefault",
					new Coords(135, 90), // pos
					new Coords(45, 15), // size
					"Default",
					fontHeight,
					true, // hasBorder
					new DataBinding
					(
						placeDefn,
						function get(c) { return c.actionToInputsMappingSelected != null}
					), // isEnabled
					function click(universe)
					{
						var mappingSelected = placeDefn.actionToInputsMappingSelected;
						if (mappingSelected != null)
						{
							var mappingDefault = placeDefn.actionToInputsMappingsDefault.filter
							(
								function(x) { return x.actionName == mappingSelected.actionName }
							)[0];
							mappingSelected.inputNames = mappingDefault.inputNames.slice();
						}
					},
					universe // context
				),

				new ControlButton
				(
					"buttonRestoreDefaultsAll",
					new Coords(50, 110), // pos
					new Coords(100, 15), // size
					"Default All",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var venueInputs = universe.venueCurrent;
						var controlConfirm = universe.controlBuilder.confirm
						(
							universe,
							size,
							"Are you sure you want to restore defaults?",
							function confirm(universe)
							{
								placeDefn.actionToInputsMappingsRestoreDefaults();
								var venueNext = venueInputs;
								venueNext = new VenueFader(venueNext, universe.venueCurrent);
								universe.venueNext = venueNext;
							},
							function cancel(universe)
							{
								var venueNext = venueInputs;
								venueNext = new VenueFader(venueNext, universe.venueCurrent);
								universe.venueNext = venueNext;
							}
						);
						var venueNext = new VenueControls(controlConfirm);
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),

				new ControlButton
				(
					"buttonCancel",
					new Coords(50, 130), // pos
					new Coords(45, 15), // size
					"Cancel",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var venueNext = venuePrev;
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),

				new ControlButton
				(
					"buttonSave",
					new Coords(105, 130), // pos
					new Coords(45, 15), // size
					"Save",
					fontHeight,
					true, // hasBorder
					// isEnabled
					new DataBinding
					(
						placeDefn,
						function get(c)
						{
							var mappings = c.actionToInputsMappingsEdited;
							var doAnyActionsLackInputs = mappings.some
							(
								function(x) { return x.inputNames.length == 0; }
							);
							return (doAnyActionsLackInputs == false);
						}
					),
					function click(universe)
					{
						placeDefn.actionToInputsMappingsSave();
						var venueNext = venuePrev;
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				)
			]
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	};

	message (universe, size, message, acknowledge, showMessageOnly)
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

	profileDetail (universe, size)
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
					new Coords(100, 25), // pos
					new Coords(120, 25), // size
					true, // isTextCentered
					"Profile: " + universe.profile.name,
					fontHeight
				),

				new ControlLabel
				(
					"labelSelectAWorld",
					new Coords(100, 40), // pos
					new Coords(100, 25), // size
					true, // isTextCentered
					"Select a World:",
					fontHeight
				),

				new ControlList
				(
					"listWorlds",
					new Coords(25, 50), // pos
					new Coords(150, 50), // size
					new DataBinding
					(
						universe.profile.worlds,
						function get(c) { return c; }
					),
					new DataBinding(null, function get(c) { return c.name; } ), // bindingForOptionText
					fontHeight,
					new DataBinding
					(
						universe,
						function get(c) { return c.worldSelected; },
						function set(c, v) { c.worldSelected = v; }
					), // bindingForOptionSelected
					new DataBinding(null, function get(c) { return c; }) // value
				),

				new ControlButton
				(
					"buttonNew",
					new Coords(50, 110), // pos
					new Coords(45, 25), // size
					"New",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var world = World.new(universe);

						var profile = universe.profile;
						profile.worlds.push(world);

						universe.profileHelper.profileSave
						(
							profile
						);

						universe.world = world;
						var venueNext = new VenueControls
						(
							universe.controlBuilder.worldDetail(universe)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),

				new ControlButton
				(
					"buttonSelect",
					new Coords(105, 110), // pos
					new Coords(45, 25), // size
					"Select",
					fontHeight,
					true, // hasBorder
					// isEnabled
					new DataBinding
					(
						universe,
						function get(c) { return (c.worldSelected != null); }
					),
					function click(universe)
					{
						var listWorlds = this.parent.children["listWorlds"];
						var worldSelected = listWorlds.itemSelected();
						if (worldSelected != null)
						{
							universe.world = worldSelected;
							var venueNext = new VenueControls
							(
								universe.controlBuilder.worldDetail(universe)
							);
							venueNext = new VenueFader(venueNext, universe.venueCurrent);
							universe.venueNext = venueNext;
						}
					},
					universe // context
				),

				new ControlButton
				(
					"buttonBack",
					new Coords(10, 10), // pos
					new Coords(15, 15), // size
					"<",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var venueNext = new VenueControls
						(
							universe.controlBuilder.profileSelect(universe)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),

				new ControlButton
				(
					"buttonDelete",
					new Coords(180, 10), // pos
					new Coords(15, 15), // size
					"x",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var profile = universe.profile;

						var controlConfirm = universe.controlBuilder.confirm
						(
							universe,
							size,
							"Delete profile \""
								+ profile.name
								+ "\"?",
							function confirm(universe)
							{
								var profile = universe.profile;
								universe.profileHelper.profileDelete
								(
									profile
								);

								var venueNext = new VenueControls
								(
									universe.controlBuilder.profileSelect(universe)
								);
								venueNext = new VenueFader(venueNext, universe.venueCurrent);
								universe.venueNext = venueNext;
							},
							function cancel(universe)
							{
								var venueNext = new VenueControls
								(
									universe.controlBuilder.profileDetail(universe)
								);
								venueNext = new VenueFader(venueNext, universe.venueCurrent);
								universe.venueNext = venueNext;
							}
						);

						var venueNext = new VenueControls(controlConfirm);
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),
			]
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	};

	profileNew (universe, size)
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
					new Coords(100, 40), // pos
					new Coords(100, 25), // size
					true, // isTextCentered
					"Profile Name:",
					fontHeight
				),

				new ControlTextBox
				(
					"textBoxName",
					new Coords(50, 50), // pos
					new Coords(100, 25), // size
					new DataBinding
					(
						universe.profileSelected,
						function get(c) { return c.name; },
						function set(c, v) { c.name = v; },
					), // text
					fontHeight
				),

				new ControlButton
				(
					"buttonCreate",
					new Coords(50, 80), // pos
					new Coords(45, 25), // size
					"Create",
					fontHeight,
					true, // hasBorder
					// isEnabled
					new DataBinding
					(
						universe,
						function get(c) { return c.profileSelected.name.length > 0; }
					),
					function click(universe)
					{
						var textBoxName = this.parent.children["textBoxName"];
						var profileName = textBoxName.text();
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
						var venueNext = new VenueControls
						(
							universe.controlBuilder.profileDetail(universe)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),

				new ControlButton
				(
					"buttonCancel",
					new Coords(105, 80), // pos
					new Coords(45, 25), // size
					"Cancel",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var venueNext = new VenueControls
						(
							universe.controlBuilder.profileSelect(universe)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),
			]
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	};

	profileSelect (universe, size)
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
					new Coords(100, 40), // pos
					new Coords(100, 25), // size
					true, // isTextCentered
					"Select a Profile:",
					fontHeight
				),

				new ControlList
				(
					"listProfiles",
					new Coords(35, 50), // pos
					new Coords(130, 40), // size
					new DataBinding(profiles, function get(c) { return c; } ), // items
					new DataBinding(null, function get(c) { return c.name; } ), // bindingForItemText
					fontHeight,
					new DataBinding
					(
						universe,
						function get(c) { return c.profileSelected; },
						function set(c, v) { c.profileSelected = v; }
					), // bindingForOptionSelected
					new DataBinding(null, function get(c) { return c; }) // value
				),

				new ControlButton
				(
					"buttonNew",
					new Coords(35, 95), // pos
					new Coords(40, 25), // size
					"New",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						universe.profileSelected = new Profile("");
						var venueNext = new VenueControls
						(
							universe.controlBuilder.profileNew(universe)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),

				new ControlButton
				(
					"buttonSelect",
					new Coords(80, 95), // pos
					new Coords(40, 25), // size
					"Select",
					fontHeight,
					true, // hasBorder
					// isEnabled
					new DataBinding
					(
						universe,
						function get(c) { return (c.profileSelected != null); }
					),
					function click(universe)
					{
						var listProfiles = this.parent.children["listProfiles"];
						var profileSelected = listProfiles.itemSelected();
						universe.profile = profileSelected;
						var venueNext = new VenueControls
						(
							universe.controlBuilder.profileDetail(universe)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),

				new ControlButton
				(
					"buttonSkip",
					new Coords(125, 95), // pos
					new Coords(40, 25), // size
					"Skip",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					function click()
					{
						var venueNext = new VenueMessage("Working...");

						venueNext = new VenueTask
						(
							venueNext,
							function perform()
							{
								return World.new(universe);
							},
							function done(universe, world)
							{
								universe.world = world;

								var now = DateTime.now();
								var nowAsString = now.toStringMMDD_HHMM_SS();
								var profileName = "Anon-" + nowAsString;
								var profile = new Profile(profileName, [ world ]);
								universe.profile = profile;

								var venueNext = new VenueWorld(universe.world);
								venueNext = new VenueFader(venueNext, universe.venueCurrent);
								universe.venueNext = venueNext;
							}
						);

						venueNext = new VenueFader(venueNext, universe.venueCurrent);

						universe.venueNext = venueNext;

					} // end click
				),

				new ControlButton
				(
					"buttonBack",
					new Coords(10, 10), // pos
					new Coords(15, 15), // size
					"<",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var venueNext = new VenueControls
						(
							universe.controlBuilder.title(universe)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),

				new ControlButton
				(
					"buttonDelete",
					new Coords(180, 10), // pos
					new Coords(15, 15), // size
					"x",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var profile = universe.profile;

						var controlConfirm = universe.controlBuilder.confirm
						(
							universe,
							size,
							"Delete all profiles?",
							function confirm(universe)
							{
								universe.profileHelper.profilesAllDelete();
								var venueNext = new VenueControls
								(
									universe.controlBuilder.profileSelect(universe)
								);
								venueNext = new VenueFader(venueNext, universe.venueCurrent);
								universe.venueNext = venueNext;
							},
							function cancel(universe)
							{
								var venueNext = new VenueControls
								(
									universe.controlBuilder.profileSelect(universe)
								);
								venueNext = new VenueFader(venueNext, universe.venueCurrent);
								universe.venueNext = venueNext;
							}
						);

						var venueNext = new VenueControls(controlConfirm);
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),
			]
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	};

	settings (universe, size)
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
			var venueNext = new VenueControls(control);
			venueNext = new VenueFader(venueNext, universe.venueCurrent);
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
					new Coords(30, row1PosY + labelPadding), // pos
					new Coords(75, buttonHeight), // size
					false, // isTextCentered
					"Music:",
					fontHeight
				),

				new ControlSelect
				(
					"selectMusicVolume",
					new Coords(65, row1PosY), // pos
					new Coords(30, buttonHeight), // size
					new DataBinding
					(
						universe.soundHelper,
						function get(c) { return c.musicVolume; },
						function set(c, v) { c.musicVolume = v; }
					), // valueSelected
					SoundHelper.controlSelectOptionsVolume(), // options
					new DataBinding
					(
						null, function get(c) { return c.value; }
					), // bindingForOptionValues,
					new DataBinding
					(
						null, function get(c) { return c.text; }
					), // bindingForOptionText
					fontHeight
				),

				new ControlLabel
				(
					"labelSoundVolume",
					new Coords(105, row1PosY + labelPadding), // pos
					new Coords(75, buttonHeight), // size
					false, // isTextCentered
					"Sound:",
					fontHeight
				),

				new ControlSelect
				(
					"selectSoundVolume",
					new Coords(140, row1PosY), // pos
					new Coords(30, buttonHeight), // size
					new DataBinding
					(
						universe.soundHelper,
						function get(c) { return c.soundVolume; },
						function set(c, v) { c.soundVolume = v; }
					), // valueSelected
					SoundHelper.controlSelectOptionsVolume(), // options
					new DataBinding(null, function get(c) { return c.value; } ), // bindingForOptionValues,
					new DataBinding(null, function get(c) { return c.text; } ), // bindingForOptionText
					fontHeight
				),

				new ControlLabel
				(
					"labelDisplaySize",
					new Coords(30, row2PosY + labelPadding), // pos
					new Coords(75, buttonHeight), // size
					false, // isTextCentered
					"Display:",
					fontHeight
				),

				new ControlSelect
				(
					"selectDisplaySize",
					new Coords(70, row2PosY), // pos
					new Coords(60, buttonHeight), // size
					universe.display.sizeInPixels, // valueSelected
					// options
					universe.display.sizesAvailable,
					new DataBinding(null, function get(c) { return c; } ), // bindingForOptionValues,
					new DataBinding(null, function get(c) { return c.toStringXY(); } ), // bindingForOptionText
					fontHeight
				),

				new ControlButton
				(
					"buttonDisplaySizeChange",
					new Coords(140, row2PosY), // pos
					new Coords(30, buttonHeight), // size
					"Change",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var controlRoot = universe.venueCurrent.controlRoot;
						var selectDisplaySize = controlRoot.children["selectDisplaySize"];
						var displaySizeSpecified = selectDisplaySize.optionSelected();

						var display = universe.display;
						var platformHelper = universe.platformHelper;
						platformHelper.platformableRemove(display);
						display.sizeInPixels = displaySizeSpecified;
						display.canvas = null; // hack
						display.initialize(universe);
						platformHelper.initialize(universe);

						var venueNext = new VenueControls
						(
							universe.controlBuilder.settings(universe)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),

				new ControlButton
				(
					"buttonInputs",
					new Coords(70, row3PosY), // pos
					new Coords(65, buttonHeight), // size
					"Inputs",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var venueCurrent = universe.venueCurrent;
						var controlGameControls =
							universe.controlBuilder.inputs(universe, size, venueCurrent);
						var venueNext = new VenueControls(controlGameControls);
						venueNext = new VenueFader(venueNext, venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),

				new ControlButton
				(
					"buttonDone",
					new Coords(70, row4PosY), // pos
					new Coords(65, buttonHeight), // size
					"Done",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					back,
				),
			],

			[ new Action("Back", back) ],

			[ new ActionToInputsMapping( "Back", [ universe.inputHelper.inputNames.Escape ], true ) ],

		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	};

	slideshow (universe, size, imageNamesAndMessagesForSlides, venueAfterSlideshow)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var controlsForSlides = [];

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
						new VisualImageFromLibrary(imageName, size),
					),

					new ControlLabel
					(
						"labelSlideText",
						new Coords(100, this.fontHeightInPixelsBase * 2), // pos
						this.sizeBase.clone(), // size
						true, // isTextCentered,
						message,
						this.fontHeightInPixelsBase * 2
					),

					new ControlButton
					(
						"buttonNext",
						new Coords(75, 120), // pos
						new Coords(50, 40), // size
						"Next",
						this.fontHeightInPixelsBase,
						false, // hasBorder
						true, // isEnabled
						function click(slideIndexNext, universe)
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
							venueNext = new VenueFader(venueNext, universe.venueCurrent);
							universe.venueNext = venueNext;
						}.bind(this, i + 1),
						universe // context
					)
				]
			);

			containerSlide.scalePosAndSize(scaleMultiplier);

			controlsForSlides.push(containerSlide);
		}

		return controlsForSlides[0];
	};

	title (universe, size)
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
			var venueNext = new VenueControls
			(
				universe.controlBuilder.profileSelect(universe)
			);
			venueNext = new VenueFader(venueNext, universe.venueCurrent);
			universe.venueNext = venueNext;
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
					new VisualImageScaled(new VisualImageFromLibrary("Title"), size)
				),

				new ControlButton
				(
					"buttonStart",
					new Coords(75, 100), // pos
					new Coords(50, 40), // size
					"Start",
					fontHeight * 2,
					false, // hasBorder
					true, // isEnabled
					start
				)
			], // end children

			[
				new Action( ControlActionNames.Instances().ControlCancel, start ),
				new Action( ControlActionNames.Instances().ControlConfirm, start )
			]
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	};

	worldDetail (universe, size)
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
					new Coords(100, 40), // pos
					new Coords(100, 25), // size
					true, // isTextCentered
					"Profile: " + universe.profile.name,
					fontHeight
				),
				new ControlLabel
				(
					"labelWorldName",
					new Coords(100, 55), // pos
					new Coords(150, 25), // size
					true, // isTextCentered
					"World: " + world.name,
					fontHeight
				),
				new ControlLabel
				(
					"labelStartDate",
					new Coords(100, 70), // pos
					new Coords(150, 25), // size
					true, // isTextCentered
					"Started:" + dateCreated.toStringTimestamp(),
					fontHeight
				),
				new ControlLabel
				(
					"labelSavedDate",
					new Coords(100, 85), // pos
					new Coords(150, 25), // size
					true, // isTextCentered
					"Saved:" + (dateSaved == null ? "[never]" : dateSaved.toStringTimestamp()),
					fontHeight
				),

				new ControlButton
				(
					"buttonStart",
					new Coords(50, 100), // pos
					new Coords(100, 25), // size
					"Start",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
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
								instructions,
								function acknowledge(universe)
								{
									universe.venueNext = new VenueFader
									(
										venueWorld, universe.venueCurrent
									);
								}
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

						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),

				new ControlButton
				(
					"buttonBack",
					new Coords(10, 10), // pos
					new Coords(15, 15), // size
					"<",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var venueNext = new VenueControls
						(
							universe.controlBuilder.profileDetail(universe)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),

				new ControlButton
				(
					"buttonDelete",
					new Coords(180, 10), // pos
					new Coords(15, 15), // size
					"x",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var profile = universe.profile;
						var world = universe.world;

						var controlConfirm = universe.controlBuilder.confirm
						(
							universe,
							size,
							"Delete world \""
								+ world.name
								+ "\"?",
							function confirm(universe)
							{
								var profile = universe.profile;
								var world = universe.world;
								var worlds = profile.worlds;

								worlds.remove(world);
								universe.world = null;

								universe.profileHelper.profileSave
								(
									profile
								);

								var venueNext = new VenueControls
								(
									universe.controlBuilder.profileDetail(universe)
								);
								venueNext = new VenueFader(venueNext, universe.venueCurrent);
								universe.venueNext = venueNext;
							},
							function cancel(universe)
							{
								var venueNext = new VenueControls
								(
									universe.controlBuilder.worldDetail(universe)
								);
								venueNext = new VenueFader(venueNext, universe.venueCurrent);
								universe.venueNext = venueNext;
							}
						);

						var venueNext = new VenueControls(controlConfirm);
						venueNext = new VenueFader(venueNext, universe.venueCurrent);

						universe.venueNext = venueNext;
					},
					universe // context
				),
			]
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	};

	worldLoad (universe, size)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var fontHeight = this.fontHeightInPixelsBase;

		var confirm = function(universe)
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

			var venueNext = new VenueControls
			(
				universe.controlBuilder.worldLoad(universe)
			);
			venueNext = new VenueFader(venueNext, universe.venueCurrent);
			universe.venueNext = venueNext;

			if (worldToReload == null)
			{
				venueNext = new VenueControls
				(
					universe.controlBuilder.message
					(
						universe,
						size,
						"No save exists to reload!",
						function acknowledge(universe)
						{
							var venueNext = new VenueControls
							(
								universe.controlBuilder.worldLoad(universe)
							);
							venueNext = new VenueFader(venueNext, universe.venueCurrent);
							universe.venueNext = venueNext;
						}
					)
				);
				venueNext = new VenueFader(venueNext, universe.venueCurrent);
				universe.venueNext = venueNext;
			}
			else
			{
				universe.world = worldReloaded;
			}
		};

		var cancel = function(universe)
		{
			var venueNext = new VenueControls
			(
				universe.controlBuilder.worldLoad(universe)
			);
			venueNext = new VenueFader(venueNext, universe.venueCurrent);
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
					new Coords(30, 15), // pos
					new Coords(140, 25), // size
					"Reload from Local Storage",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var controlConfirm = universe.controlBuilder.confirm
						(
							universe,
							size,
							"Abandon the current game?",
							confirm,
							cancel
						);

						var venueNext = new VenueControls(controlConfirm);
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),

				new ControlButton
				(
					"buttonLoadFromFile",
					new Coords(30, 50), // pos
					new Coords(140, 25), // size
					"Load from File",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var profile = universe.profile;
						var world = universe.world;

						var venueFileUpload = new VenueFileUpload(null);

						var venueMessageReadyToLoad = new VenueControls
						(
							universe.controlBuilder.message
							(
								universe,
								size,
								"Ready to load from file...",
								function acknowledge(universe)
								{
									function callback(fileContentsAsString)
									{
										var worldAsJSON = fileContentsAsString;
										var worldDeserialized = universe.serializer.deserialize(worldAsJSON);
										universe.world = worldDeserialized;

										var venueNext = new VenueControls
										(
											universe.controlBuilder.game(universe, size)
										);
										venueNext = new VenueFader(venueNext, universe.venueCurrent);
										universe.venueNext = venueNext;
									}

									var inputFile = venueFileUpload.domElement.getElementsByTagName("input")[0];
									var fileToLoad = inputFile.files[0];
									new FileHelper().loadFileAsText
									(
										fileToLoad,
										callback,
										null // contextForCallback
									);

								}
							)
						);

						var venueMessageCancelled = new VenueControls
						(
							universe.controlBuilder.message
							(
								universe,
								size,
								"No file specified.",
								function acknowledge(universe)
								{
									var venueNext = new VenueControls
									(
										universe.controlBuilder.game(universe, size)
									);
									venueNext = new VenueFader(venueNext, universe.venueCurrent);
									universe.venueNext = venueNext;
								}
							)
						);

						venueFileUpload.venueNextIfFileSpecified = venueMessageReadyToLoad;
						venueFileUpload.venueNextIfCancelled = venueMessageCancelled;

						universe.venueNext = venueFileUpload;
					},
					universe // context
				),

				new ControlButton
				(
					"buttonReturn",
					new Coords(30, 105), // pos
					new Coords(140, 25), // size
					"Return",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var venueNext = new VenueControls
						(
							universe.controlBuilder.game(universe, size)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),

			]
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	};

	worldSave(universe, size)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var fontHeight = this.fontHeightInPixelsBase;

		var saveToLocalStorage = function()
		{
			var profile = universe.profile;
			var world = universe.world;

			world.dateSaved = DateTime.now();
			var wasSaveSuccessful = universe.profileHelper.profileSave
			(
				profile
			);

			var message =
			(
				wasSaveSuccessful ? "Profile saved to local storage." : "Save failed due to errors."
			);

			var venueNext = new VenueControls
			(
				universe.controlBuilder.message
				(
					universe,
					size,
					message,
					function acknowledge(universe)
					{
						var venueNext = new VenueControls
						(
							universe.controlBuilder.game(universe)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					}
				)
			);
			venueNext = new VenueFader(venueNext, universe.venueCurrent);
			universe.venueNext = venueNext;
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
					new Coords(30, 15), // pos
					new Coords(140, 25), // size
					"Save to Local Storage",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					saveToLocalStorage
				),

				new ControlButton
				(
					"buttonSaveToFile",
					new Coords(30, 50), // pos
					new Coords(140, 25), // size
					"Save to File",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var profile = universe.profile;
						var world = universe.world;

						world.dateSaved = DateTime.now();
						var worldSerialized = universe.serializer.serialize(world);

						new FileHelper().saveTextStringToFileWithName
						(
							worldSerialized,
							world.name + ".json"
						);

						var venueNext = new VenueControls
						(
							universe.controlBuilder.message
							(
								universe,
								size,
								"Save must be completed manually.",
								function acknowledge(universe)
								{
									var venueNext = new VenueControls
									(
										universe.controlBuilder.game(universe)
									);
									venueNext = new VenueFader(venueNext, universe.venueCurrent);
									universe.venueNext = venueNext;
								}
							)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),

				new ControlButton
				(
					"buttonReturn",
					new Coords(30, 105), // pos
					new Coords(140, 25), // size
					"Return",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var venueNext = new VenueControls
						(
							universe.controlBuilder.game(universe)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),
			] // end children
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	};
}
