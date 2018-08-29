
function ControlBuilder(styles)
{
	this.styles = styles.addLookups("name");

	this.fontHeightInPixelsBase = 10;
	this.sizeBase = new Coords(200, 150, 1);

	// Helper variables.

	this.sizeMultiplier = new Coords();
}
{
	ControlBuilder.prototype.choice = function
	(
		universe, size, message, optionNames, optionFunctions
	)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault;
		}

		var sizeMultiplier = this.sizeMultiplier.overwriteWith(size).divide(this.sizeBase);

		var labelMessage = new ControlLabel
		(
			"labelMessage",
			new Coords(100, 65).multiply(sizeMultiplier), // pos
			new Coords(200, 25).multiply(sizeMultiplier), // size
			true, // isTextCentered
			message,
			this.fontHeightInPixelsBase * sizeMultiplier.y
		);

		var childControls = [ labelMessage ];

		var numberOfOptions = optionNames.length;

		var buttonWidth = 55;
		var buttonSize = new Coords(buttonWidth, 25).multiply(sizeMultiplier);
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
				).multiply(sizeMultiplier), // pos
				buttonSize,
				optionNames[i],
				this.fontHeightInPixelsBase * sizeMultiplier.y,
				true, // hasBorder
				true, // isEnabled
				optionFunctions[i],
				universe // context
			);

			childControls.push(button);
		}

		var containerSizeScaled = size.clone().clearZ();
		var display = universe.display;
		var displaySize = display.sizeDefault.clone().clearZ();
		var containerPosScaled = displaySize.clone().subtract(containerSizeScaled).half();

		var returnValue = new ControlContainer
		(
			"containerChoice",
			containerPosScaled,
			containerSizeScaled,
			childControls
		);

		return returnValue;

	}

	ControlBuilder.prototype.configure = function(universe, size)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault;
		}

		var sizeMultiplier = this.sizeMultiplier.overwriteWith(size).divide(this.sizeBase);

		var returnValue = new ControlContainer
		(
			"containerConfigure",
			new Coords(0, 0).multiply(sizeMultiplier), // pos
			new Coords(200, 150).multiply(sizeMultiplier), // size
			// children
			[
				new ControlButton
				(
					"buttonSave",
					new Coords(30, 15).multiply(sizeMultiplier), // pos
					new Coords(65, 25).multiply(sizeMultiplier), // size
					"Save",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
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
					new Coords(105, 15).multiply(sizeMultiplier), // pos
					new Coords(65, 25).multiply(sizeMultiplier), // size
					"Load",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
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

				new ControlLabel
				(
					"labelMusicVolume",
					new Coords(30, 50).multiply(sizeMultiplier), // pos
					new Coords(75, 25).multiply(sizeMultiplier), // size
					false, // isTextCentered
					"Music:",
					this.fontHeightInPixelsBase * sizeMultiplier.y
				),

				new ControlSelect
				(
					"selectMusicVolume",
					new Coords(65, 45).multiply(sizeMultiplier), // pos
					new Coords(30, 25).multiply(sizeMultiplier), // size

					// valueSelected
					new DataBinding
					(
						universe.soundHelper,
						"musicVolume"
					),

					// options
					SoundHelper.controlSelectOptionsVolume(),

					"value", // bindingExpressionForOptionValues,
					"text", // bindingExpressionForOptionText
					this.fontHeightInPixelsBase * sizeMultiplier.y
				),

				new ControlLabel
				(
					"labelSoundVolume",
					new Coords(105, 50).multiply(sizeMultiplier), // pos
					new Coords(75, 25).multiply(sizeMultiplier), // size
					false, // isTextCentered
					"Sound:",
					this.fontHeightInPixelsBase * sizeMultiplier.y
				),

				new ControlSelect
				(
					"selectSoundVolume",
					new Coords(140, 45).multiply(sizeMultiplier), // pos
					new Coords(30, 25).multiply(sizeMultiplier), // size

					// valueSelected
					new DataBinding
					(
						universe.soundHelper,
						"soundVolume"
					),

					// options
					SoundHelper.controlSelectOptionsVolume(),

					"value", // bindingExpressionForOptionValues,
					"text", // bindingExpressionForOptionText
					this.fontHeightInPixelsBase * sizeMultiplier.y
				),

				new ControlLabel
				(
					"labelDisplaySize",
					new Coords(30, 80).multiply(sizeMultiplier), // pos
					new Coords(75, 25).multiply(sizeMultiplier), // size
					false, // isTextCentered
					"Display:",
					this.fontHeightInPixelsBase * sizeMultiplier.y
				),

				new ControlSelect
				(
					"selectDisplaySize",
					new Coords(70, 75).multiply(sizeMultiplier), // pos
					new Coords(60, 25).multiply(sizeMultiplier), // size
					universe.display.sizeInPixels, // valueSelected
					// options
					universe.display.sizesAvailable,
					null, // bindingExpressionForOptionValues,
					"toStringXY()", // bindingExpressionForOptionText
					this.fontHeightInPixelsBase * sizeMultiplier.y
				),

				new ControlButton
				(
					"buttonDisplaySizeChange",
					new Coords(140, 75).multiply(sizeMultiplier), // pos
					new Coords(30, 25).multiply(sizeMultiplier), // size
					"Change",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var controlRoot = universe.venueCurrent.controlRoot;
						var selectDisplaySize = controlRoot.children["selectDisplaySize"];
						var displaySizeSpecified = selectDisplaySize.optionSelected().value;

						var display = universe.display;
						display.sizeInPixels = displaySizeSpecified;
						display.initialize(universe);

						var venueNext = new VenueControls
						(
							universe.controlBuilder.configure(universe)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),

				new ControlButton
				(
					"buttonResume",
					new Coords(30, 105).multiply(sizeMultiplier), // pos
					new Coords(65, 25).multiply(sizeMultiplier), // size
					"Resume",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var world = universe.world;
						var venueNext = new VenueWorld(world);
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),

				new ControlButton
				(
					"buttonQuit",
					new Coords(105, 105).multiply(sizeMultiplier), // pos
					new Coords(65, 25).multiply(sizeMultiplier), // size
					"Quit",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
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
									universe.controlBuilder.configure(universe)
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

		return returnValue;
	}

	ControlBuilder.prototype.confirm = function(universe, size, message, confirm, cancel)
	{
		return this.choice
		(
			universe, size, message, ["Confirm", "Cancel"], [confirm, cancel]
		);
	}

	ControlBuilder.prototype.message = function(universe, size, message, acknowledge)
	{
		return this.choice
		(
			universe, size, message, ["Acknowledge"], [acknowledge]
		);

	}

	/*
	ControlBuilder.prototype.message = function(universe, size, message, acknowledge)
	{
		var display = universe.display;
		var displaySize = display.sizeDefault.clone().clearZ();

		if (size == null)
		{
			size = displaySize;
		}

		var sizeMultiplier = this.sizeMultiplier.overwriteWith(displaySize).divide(this.sizeBase);
		var containerSizeScaled = size.clone().clearZ();
		var containerPosScaled = displaySize.clone().subtract(containerSizeScaled).half();
		var fontHeightInPixelsScaled = this.fontHeightInPixelsBase * sizeMultiplier.y;
		var textAcknowledge = "Acknowledge";
		var textWidth = display.textWidthForFontHeight(textAcknowledge, fontHeightInPixelsScaled);
		var buttonSizeScaled = new Coords(textWidth * 1.25, fontHeightInPixelsScaled * 2);
		var containerSizeHalfScaled = containerSizeScaled.clone().half();

		var childControls = [];

		var messageAsLines = message.split("\n");
		var messageHeight = messageAsLines.length * fontHeightInPixelsScaled;
		var ySpaceBetweenControls = (containerSizeScaled.y - messageHeight - buttonSizeScaled.y) / 3;

		for (var i = 0; i < messageAsLines.length; i++)
		{
			var messageLine = messageAsLines[i];

			var labelMessageLine = new ControlLabel
			(
				"labelMessageLine" + i,
				new Coords
				(
					containerSizeHalfScaled.x,
					ySpaceBetweenControls
					+ fontHeightInPixelsScaled * (i + .5)
				), // pos
				new Coords(containerSizeScaled.x, fontHeightInPixelsScaled), // size
				true, // isTextCentered
				messageLine,
				fontHeightInPixelsScaled
			);

			childControls.push(labelMessageLine);
		}

		var buttonPosScaled = new Coords
		(
			(containerSizeScaled.x - buttonSizeScaled.x) / 2,
			2 * ySpaceBetweenControls + messageHeight
		);

		var buttonAcknowledge = new ControlButton
		(
			"buttonAcknowledge",
			buttonPosScaled,
			buttonSizeScaled,
			textAcknowledge,
			fontHeightInPixelsScaled,
			true, // hasBorder
			true, // isEnabled
			acknowledge,
			universe // context
		);

		childControls.push(buttonAcknowledge);

		var returnValue = new ControlContainer
		(
			"containerConfirm",
			containerPosScaled,
			containerSizeScaled,
			childControls
		);

		return returnValue;
	}
	*/

	ControlBuilder.prototype.profileDetail = function(universe, size)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault;
		}

		var sizeMultiplier = this.sizeMultiplier.overwriteWith(size).divide(this.sizeBase);

		var returnValue = new ControlContainer
		(
			"containerProfileDetail",
			new Coords(0, 0).multiply(sizeMultiplier), // pos
			new Coords(200, 150).multiply(sizeMultiplier), // size
			// children
			[
				new ControlLabel
				(
					"labelProfileName",
					new Coords(100, 25).multiply(sizeMultiplier), // pos
					new Coords(120, 25).multiply(sizeMultiplier), // size
					true, // isTextCentered
					"Profile: " + universe.profile.name,
					this.fontHeightInPixelsBase * sizeMultiplier.y
				),

				new ControlLabel
				(
					"labelSelectAWorld",
					new Coords(100, 40).multiply(sizeMultiplier), // pos
					new Coords(100, 25).multiply(sizeMultiplier), // size
					true, // isTextCentered
					"Select a World:",
					this.fontHeightInPixelsBase * sizeMultiplier.y
				),

				new ControlList
				(
					"listWorlds",
					new Coords(25, 50).multiply(sizeMultiplier), // pos
					new Coords(150, 50).multiply(sizeMultiplier), // size
					new DataBinding
					(
						universe.profile.worlds,
						null
					),
					"name",
					this.fontHeightInPixelsBase * sizeMultiplier.y
				),

				new ControlButton
				(
					"buttonNew",
					new Coords(50, 110).multiply(sizeMultiplier), // pos
					new Coords(45, 25).multiply(sizeMultiplier), // size
					"New",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
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
					new Coords(105, 110).multiply(sizeMultiplier), // pos
					new Coords(45, 25).multiply(sizeMultiplier), // size
					"Select",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
					true, // hasBorder
					// isEnabled
					new DataBinding
					(
						function()
						{
							var controlRoot = universe.venueCurrent.controlRoot;
							if (controlRoot == null)
							{
								return false;
							}
							else
							{
								return controlRoot.children["listWorlds"].itemSelected() != null;
							}
						},
						"call()"
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
					new Coords(10, 10).multiply(sizeMultiplier), // pos
					new Coords(15, 15).multiply(sizeMultiplier), // size
					"<",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
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
					new Coords(180, 10).multiply(sizeMultiplier), // pos
					new Coords(15, 15).multiply(sizeMultiplier), // size
					"x",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
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

		return returnValue;
	}

	ControlBuilder.prototype.profileNew = function(universe, size)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault;
		}

		var sizeMultiplier = this.sizeMultiplier.overwriteWith(size).divide(this.sizeBase);

		return new ControlContainer
		(
			"containerProfileNew",
			new Coords(0, 0).multiply(sizeMultiplier), // pos
			new Coords(200, 150).multiply(sizeMultiplier), // size
			// children
			[
				new ControlLabel
				(
					"labelName",
					new Coords(100, 40).multiply(sizeMultiplier), // pos
					new Coords(100, 25).multiply(sizeMultiplier), // size
					true, // isTextCentered
					"Profile Name:",
					this.fontHeightInPixelsBase * sizeMultiplier.y
				),

				new ControlTextBox
				(
					"textBoxName",
					new Coords(50, 50).multiply(sizeMultiplier), // pos
					new Coords(100, 25).multiply(sizeMultiplier), // size
					"", // text
					this.fontHeightInPixelsBase * sizeMultiplier.y
				),

				new ControlButton
				(
					"buttonCreate",
					new Coords(50, 80).multiply(sizeMultiplier), // pos
					new Coords(45, 25).multiply(sizeMultiplier), // size
					"Create",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
					true, // hasBorder
					// isEnabled
					new DataBinding
					(
						function()
						{
							var controlRoot = universe.venueCurrent.controlRoot;
							if (controlRoot == null)
							{
								return false;
							}
							else
							{
								return controlRoot.children["textBoxName"].text().length > 0;
							}
						},
						"call()"
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
					new Coords(105, 80).multiply(sizeMultiplier), // pos
					new Coords(45, 25).multiply(sizeMultiplier), // size
					"Cancel",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
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
	}

	ControlBuilder.prototype.profileSelect = function(universe, size)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault;
		}

		var sizeMultiplier = this.sizeMultiplier.overwriteWith(size).divide(this.sizeBase);

		var profiles = universe.profileHelper.profiles();

		var returnValue = new ControlContainer
		(
			"containerProfileSelect",
			new Coords(0, 0).multiply(sizeMultiplier), // pos
			new Coords(200, 150).multiply(sizeMultiplier), // size
			// children
			[
				new ControlLabel
				(
					"labelSelectAProfile",
					new Coords(100, 40).multiply(sizeMultiplier), // pos
					new Coords(100, 25).multiply(sizeMultiplier), // size
					true, // isTextCentered
					"Select a Profile:",
					this.fontHeightInPixelsBase * sizeMultiplier.y
				),

				new ControlList
				(
					"listProfiles",
					new Coords(50, 50).multiply(sizeMultiplier), // pos
					new Coords(100, 40).multiply(sizeMultiplier), // size
					new DataBinding
					(
						profiles,
						null
					),
					"name",
					this.fontHeightInPixelsBase * sizeMultiplier.y
				),

				new ControlButton
				(
					"buttonNew",
					new Coords(50, 95).multiply(sizeMultiplier), // pos
					new Coords(30, 25).multiply(sizeMultiplier), // size
					"New",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
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
					new Coords(85, 95).multiply(sizeMultiplier), // pos
					new Coords(30, 25).multiply(sizeMultiplier), // size
					"Select",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
					true, // hasBorder
					// isEnabled
					new DataBinding
					(
						function()
						{
							var controlRoot = universe.venueCurrent.controlRoot;
							if (controlRoot == null)
							{
								return false;
							}
							else
							{
								return controlRoot.children["listProfiles"].itemSelected() != null;
							}
						},
						"call()"
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
					new Coords(120, 95).multiply(sizeMultiplier), // pos
					new Coords(30, 25).multiply(sizeMultiplier), // size
					"Skip",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var world = World.new(universe);
						var now = DateTime.now();
						var nowAsString = now.toStringMMDD_HHMM_SS();
						var profileName = "Anon-" + nowAsString;
						var profile = new Profile(profileName, [ world ]);
						universe.profile = profile;
						universe.world = world;
						var venueNext = new VenueWorld(universe.world);
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),

				new ControlButton
				(
					"buttonBack",
					new Coords(10, 10).multiply(sizeMultiplier), // pos
					new Coords(15, 15).multiply(sizeMultiplier), // size
					"<",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
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
					new Coords(180, 10).multiply(sizeMultiplier), // pos
					new Coords(15, 15).multiply(sizeMultiplier), // size
					"x",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
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

		return returnValue;
	}

	ControlBuilder.prototype.title = function(universe, size)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault;
		}

		var sizeMultiplier = this.sizeMultiplier.overwriteWith(size).divide(this.sizeBase);

		var returnValue = new ControlContainer
		(
			"containerTitle",
			new Coords(0, 0).multiply(sizeMultiplier), // pos
			new Coords(200, 150).multiply(sizeMultiplier), // size
			// children
			[
				new ControlImage
				(
					"imageTitle",
					new Coords(0, 0).multiply(sizeMultiplier),
					new Coords(200, 150).multiply(sizeMultiplier), // size
					universe.mediaLibrary.imageGetByName("Title")
				),

				new ControlButton
				(
					"buttonStart",
					new Coords(75, 100).multiply(sizeMultiplier), // pos
					new Coords(50, 40).multiply(sizeMultiplier), // size
					"Start",
					this.fontHeightInPixelsBase * sizeMultiplier.y * 2,
					false, // hasBorder
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
				)
			]
		);

		return returnValue;
	}

	ControlBuilder.prototype.worldDetail = function(universe, size)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault;
		}

		var sizeMultiplier = this.sizeMultiplier.overwriteWith(size).divide(this.sizeBase);

		var world = universe.world;

		var dateCreated = world.dateCreated;
		var dateSaved = world.dateSaved;

		var returnValue = new ControlContainer
		(
			"containerWorldDetail",
			new Coords(0, 0).multiply(sizeMultiplier), // pos
			new Coords(200, 150).multiply(sizeMultiplier), // size
			// children
			[
				new ControlLabel
				(
					"labelProfileName",
					new Coords(100, 40).multiply(sizeMultiplier), // pos
					new Coords(100, 25).multiply(sizeMultiplier), // size
					true, // isTextCentered
					"Profile: " + universe.profile.name,
					this.fontHeightInPixelsBase * sizeMultiplier.y
				),
				new ControlLabel
				(
					"labelWorldName",
					new Coords(100, 55).multiply(sizeMultiplier), // pos
					new Coords(150, 25).multiply(sizeMultiplier), // size
					true, // isTextCentered
					"World: " + world.name,
					this.fontHeightInPixelsBase * sizeMultiplier.y
				),
				new ControlLabel
				(
					"labelStartDate",
					new Coords(100, 70).multiply(sizeMultiplier), // pos
					new Coords(150, 25).multiply(sizeMultiplier), // size
					true, // isTextCentered
					"Started:" + dateCreated.toStringTimestamp(),
					this.fontHeightInPixelsBase * sizeMultiplier.y
				),
				new ControlLabel
				(
					"labelSavedDate",
					new Coords(100, 85).multiply(sizeMultiplier), // pos
					new Coords(150, 25).multiply(sizeMultiplier), // size
					true, // isTextCentered
					"Saved:" + (dateSaved == null ? "[never]" : dateSaved.toStringTimestamp()),
					this.fontHeightInPixelsBase * sizeMultiplier.y
				),

				new ControlButton
				(
					"buttonStart",
					new Coords(50, 100).multiply(sizeMultiplier), // pos
					new Coords(100, 25).multiply(sizeMultiplier), // size
					"Start",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
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
					new Coords(10, 10).multiply(sizeMultiplier), // pos
					new Coords(15, 15).multiply(sizeMultiplier), // size
					"<",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
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
					new Coords(180, 10).multiply(sizeMultiplier), // pos
					new Coords(15, 15).multiply(sizeMultiplier), // size
					"x",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
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

		return returnValue;
	}

	ControlBuilder.prototype.worldLoad = function(universe, size)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault;
		}

		var sizeMultiplier = this.sizeMultiplier.overwriteWith(size).divide(this.sizeBase);

		var returnValue = new ControlContainer
		(
			"containerWorldLoad",
			new Coords(0, 0).multiply(sizeMultiplier), // pos
			new Coords(200, 150).multiply(sizeMultiplier), // size
			// children
			[
				new ControlButton
				(
					"buttonLoadFromServer",
					new Coords(30, 15).multiply(sizeMultiplier), // pos
					new Coords(140, 25).multiply(sizeMultiplier), // size
					"Reload from Local Storage",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var controlConfirm = universe.controlBuilder.confirm
						(
							universe,
							size,
							"Abandon the current game?",
							function confirm(universe)
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

							},
							function cancel(universe)
							{
								var venueNext = new VenueControls
								(
									universe.controlBuilder.worldLoad(universe)
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
					"buttonLoadFromFile",
					new Coords(30, 50).multiply(sizeMultiplier), // pos
					new Coords(140, 25).multiply(sizeMultiplier), // size
					"Load from File",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
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
											universe.controlBuilder.configure(universe)
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
										universe.controlBuilder.configure(universe)
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
					new Coords(30, 105).multiply(sizeMultiplier), // pos
					new Coords(140, 25).multiply(sizeMultiplier), // size
					"Return",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var venueNext = new VenueControls
						(
							universe.controlBuilder.configure(universe)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),

			]
		);

		return returnValue;
	}

	ControlBuilder.prototype.worldSave = function(universe, size)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault;
		}

		var sizeMultiplier = this.sizeMultiplier.overwriteWith(size).divide(this.sizeBase);

		var returnValue = new ControlContainer
		(
			"containerSave",
			new Coords(0, 0).multiply(sizeMultiplier), // pos
			new Coords(200, 150).multiply(sizeMultiplier), // size
			// children
			[
				new ControlButton
				(
					"buttonSaveToLocalStorage",
					new Coords(30, 15).multiply(sizeMultiplier), // pos
					new Coords(140, 25).multiply(sizeMultiplier), // size
					"Save to Local Storage",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var profile = universe.profile;
						var world = universe.world;

						world.dateSaved = DateTime.now();
						universe.profileHelper.profileSave
						(
							profile
						);

						var venueNext = new VenueControls
						(
							universe.controlBuilder.message
							(
								universe,
								size,
								"Profile saved to local storage.",
								function acknowledge(universe)
								{
									var venueNext = new VenueControls
									(
										universe.controlBuilder.configure(universe)
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
					"buttonSaveToFile",
					new Coords(30, 50).multiply(sizeMultiplier), // pos
					new Coords(140, 25).multiply(sizeMultiplier), // size
					"Save to File",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
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
										universe.controlBuilder.configure(universe)
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
					new Coords(30, 105).multiply(sizeMultiplier), // pos
					new Coords(140, 25).multiply(sizeMultiplier), // size
					"Return",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var venueNext = new VenueControls
						(
							universe.controlBuilder.configure(universe)
						);
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),
			]
		);

		return returnValue;
	}
}
