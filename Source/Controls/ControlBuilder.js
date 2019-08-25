
function ControlBuilder(styles)
{
	this.styles = styles.addLookupsByName();

	this.fontHeightInPixelsBase = 10;
	this.sizeBase = new Coords(200, 150, 1);

	// Helper variables.

	this._zeroes = new Coords(0, 0, 0);
	this._scaleMultiplier = new Coords();
}
{
	ControlBuilder.prototype.choice = function
	(
		universe, size, message, optionNames, optionFunctions
	)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);
		var fontHeight = this.fontHeightInPixelsBase;

		var numberOfLinesInMessageMinusOne = message.split("\n").length - 1;
		var labelSize = new Coords
		(
			200, fontHeight * numberOfLinesInMessageMinusOne
		);

		var labelPos = new Coords
		(
			100, 65 - fontHeight * (numberOfLinesInMessageMinusOne / 4),
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

		var numberOfOptions = optionNames.length;

		var buttonWidth = 55;
		var buttonSize = new Coords(buttonWidth, fontHeight);
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

		var containerSizeScaled = size.clone().clearZ().divide(scaleMultiplier);
		var display = universe.display;
		var displaySize = display.sizeDefault().clone().clearZ().divide(scaleMultiplier);
		var containerPosScaled = displaySize.clone().subtract(containerSizeScaled).half();

		var returnValue = new ControlContainer
		(
			"containerChoice",
			containerPosScaled,
			containerSizeScaled,
			childControls
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	};

	ControlBuilder.prototype.choiceList = function
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
			Coords.Instances().Zeroes,
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

	ControlBuilder.prototype.configure = function(universe, size)
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
			"containerConfigure",
			this._zeroes, // pos
			this.sizeBase.clone(),
			// children
			[
				new ControlButton
				(
					"buttonSave",
					new Coords(30, 15), // pos
					new Coords(65, 25), // size
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
					new Coords(105, 15), // pos
					new Coords(65, 25), // size
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

				new ControlLabel
				(
					"labelMusicVolume",
					new Coords(30, 50), // pos
					new Coords(75, 25), // size
					false, // isTextCentered
					"Music:",
					fontHeight
				),

				new ControlSelect
				(
					"selectMusicVolume",
					new Coords(65, 45), // pos
					new Coords(30, 25), // size
					new DataBinding(universe.soundHelper, "musicVolume"), // valueSelected
					SoundHelper.controlSelectOptionsVolume(), // options
					new DataBinding(null, "value"), // bindingForOptionValues,
					new DataBinding(null, "text"), // bindingForOptionText
					fontHeight
				),

				new ControlLabel
				(
					"labelSoundVolume",
					new Coords(105, 50), // pos
					new Coords(75, 25), // size
					false, // isTextCentered
					"Sound:",
					fontHeight
				),

				new ControlSelect
				(
					"selectSoundVolume",
					new Coords(140, 45), // pos
					new Coords(30, 25), // size
					new DataBinding(universe.soundHelper, "soundVolume"), // valueSelected
					SoundHelper.controlSelectOptionsVolume(), // options
					new DataBinding(null, "value"), // bindingForOptionValues,
					new DataBinding(null, "text"), // bindingForOptionText
					fontHeight
				),

				new ControlLabel
				(
					"labelDisplaySize",
					new Coords(30, 80), // pos
					new Coords(75, 25), // size
					false, // isTextCentered
					"Display:",
					fontHeight
				),

				new ControlSelect
				(
					"selectDisplaySize",
					new Coords(70, 75), // pos
					new Coords(60, 25), // size
					universe.display.sizeInPixels, // valueSelected
					// options
					universe.display.sizesAvailable,
					new DataBinding(), // bindingForOptionValues,
					new DataBinding(null, "toStringXY()"), // bindingForOptionText
					fontHeight
				),

				new ControlButton
				(
					"buttonDisplaySizeChange",
					new Coords(140, 75), // pos
					new Coords(30, 25), // size
					"Change",
					fontHeight,
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

						universe.platformHelper.initialize(universe);

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
					new Coords(30, 105), // pos
					new Coords(65, 25), // size
					"Resume",
					fontHeight,
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
					new Coords(105, 105), // pos
					new Coords(65, 25), // size
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

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	};

	ControlBuilder.prototype.confirm = function(universe, size, message, confirm, cancel)
	{
		return this.choice
		(
			universe, size, message, ["Confirm", "Cancel"], [confirm, cancel]
		);
	};

	ControlBuilder.prototype.message = function(universe, size, message, acknowledge)
	{
		return this.choice
		(
			universe, size, message, ["Acknowledge"], [acknowledge]
		);
	};

	ControlBuilder.prototype.profileDetail = function(universe, size)
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
						null
					),
					new DataBinding(null, "name"), // bindingForOptionText
					fontHeight
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

	ControlBuilder.prototype.profileNew = function(universe, size)
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
					"", // text
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

	ControlBuilder.prototype.profileSelect = function(universe, size)
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
					new Coords(50, 50), // pos
					new Coords(100, 40), // size
					new DataBinding(profiles),
					new DataBinding(null, "name"),
					fontHeight
				),

				new ControlButton
				(
					"buttonNew",
					new Coords(50, 95), // pos
					new Coords(30, 25), // size
					"New",
					fontHeight,
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
					new Coords(85, 95), // pos
					new Coords(30, 25), // size
					"Select",
					fontHeight,
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
					new Coords(120, 95), // pos
					new Coords(30, 25), // size
					"Skip",
					fontHeight,
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

	ControlBuilder.prototype.slideshow = function(universe, size, imageNamesAndMessagesForSlides, venueAfterSlideshow)
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

	ControlBuilder.prototype.title = function(universe, size)
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

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	};

	ControlBuilder.prototype.worldDetail = function(universe, size)
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

	ControlBuilder.prototype.worldLoad = function(universe, size)
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
							universe.controlBuilder.configure(universe)
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

	ControlBuilder.prototype.worldSave = function(universe, size)
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
							universe.controlBuilder.configure(universe)
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
}
