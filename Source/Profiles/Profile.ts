
namespace ThisCouldBeBetter.GameFramework
{

export class Profile
{
	name: string;
	saveStates: SaveState[];
	saveStateNameSelected: string;

	constructor(name: string, saveStates: SaveState[])
	{
		this.name = name;
		this.saveStates = saveStates;
		this.saveStateNameSelected = null;
	}

	static anonymous(): Profile
	{
		var now = DateTime.now();
		var nowAsString = now.toStringMMDD_HHMM_SS();
		var profileName = "Anon-" + nowAsString;
		var profile = new Profile(profileName, []);
		return profile;
	}

	saveStateSelected(): SaveState
	{
		return this.saveStates.filter(x => x.name == this.saveStateNameSelected)[0];
	}

	// controls

	static toControlSaveStateLoad
	(
		universe: Universe, size: Coords, venuePrev: Venue
	): ControlBase
	{
		var isLoadNotSave = true;
		return Profile.toControlSaveStateLoadOrSave(universe, size, venuePrev, isLoadNotSave);
	}

	static toControlSaveStateSave
	(
		universe: Universe, size: Coords, venuePrev: Venue
	): ControlBase
	{
		var isLoadNotSave = false;
		return Profile.toControlSaveStateLoadOrSave(universe, size, venuePrev, isLoadNotSave);
	}

	static toControlSaveStateLoadOrSave
	(
		universe: Universe, size: Coords, venuePrev: Venue, isLoadNotSave: boolean
	): ControlBase
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var controlBuilder = universe.controlBuilder;
		var sizeBase = controlBuilder.sizeBase;
		var scaleMultiplier = size.clone().divide(sizeBase);
		var fontHeight = controlBuilder.fontHeightInPixelsBase;
		var buttonHeightBase = controlBuilder.buttonHeightBase;

		var visualThumbnailSize = Coords.fromXY(60, 45);

		var venueToReturnTo = universe.venueCurrent;

		var loadNewWorld = () =>
		{
			var world = universe.worldCreate();
			universe.world = world;
			var venueNext: Venue = controlBuilder.worldDetail
			(
				universe, size, universe.venueCurrent
			).toVenue();
			venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
			universe.venueNext = venueNext;
		};

		var loadSelectedSlotFromLocalStorage = () =>
		{
			var saveStateNameSelected = universe.profile.saveStateNameSelected;
			if (saveStateNameSelected != null)
			{
				var messageAsDataBinding = DataBinding.fromContextAndGet
				(
					null, // Will be set below.
					(c: VenueTask) => "Loading game..."
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
						return universe.storageHelper.load(saveStateNameSelected);
					},
					(universe: Universe, saveStateSelected: SaveState) => // done
					{
						var worldSelected = saveStateSelected.world;
						universe.world = worldSelected;
						var venueNext: Venue = worldSelected.toVenue();
						venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					}
				);

				messageAsDataBinding.contextSet(venueTask);

				universe.venueNext = VenueFader.fromVenuesToAndFrom(venueTask, universe.venueCurrent);
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
			var timePlayingAsString = world.timePlayingAsStringShort(universe);

			var displaySize = universe.display.sizeInPixels;
			var displayFull = Display2D.fromSizeAndIsInvisible(displaySize, true);
			displayFull.initialize(universe);
			place.draw(universe, world, displayFull);
			var imageSnapshotFull = displayFull.toImage();

			var imageSizeThumbnail = visualThumbnailSize.clone();
			var displayThumbnail = Display2D.fromSizeAndIsInvisible
			(
				imageSizeThumbnail, true
			);
			displayThumbnail.initialize(universe);
			displayThumbnail.drawImageScaled
			(
				imageSnapshotFull, Coords.Instances().Zeroes, imageSizeThumbnail
			);
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
				wasSaveSuccessful
				? "Game saved successfully."
				: "Save failed due to errors."
			);

			var controlMessage = universe.controlBuilder.message
			(
				universe,
				size,
				DataBinding.fromContext(message),
				() => // acknowledge
				{
					var venueNext: Venue = universe.controlBuilder.game
					(
						universe, null, universe.venueCurrent
					).toVenue();
					venueNext = VenueFader.fromVenuesToAndFrom
					(
						venueNext, universe.venueCurrent
					);
					universe.venueNext = venueNext;
				},
				false
			);

			var venueNext: Venue = controlMessage.toVenue();
			venueNext = VenueFader.fromVenuesToAndFrom
			(
				venueNext, universe.venueCurrent
			);
			universe.venueNext = venueNext;
		}

		var saveToLocalStorageAsNewSlot = () =>
		{
			var messageAsDataBinding = DataBinding.fromContextAndGet
			(
				null, // context - Set below.
				(c: VenueTask) => "Saving game..."
			);

			var venueMessage = VenueMessage.fromMessage
			(
				messageAsDataBinding
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

			universe.venueNext = VenueFader.fromVenuesToAndFrom(venueTask, universe.venueCurrent);
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

					var controlMessage = universe.controlBuilder.message
					(
						universe,
						size,
						DataBinding.fromContext(message),
						() => // acknowledge
						{
							var venueNext: Venue = universe.controlBuilder.game
							(
								universe, null, universe.venueCurrent
							).toVenue();
							venueNext = VenueFader.fromVenuesToAndFrom
							(
								venueNext, universe.venueCurrent
							);
							universe.venueNext = venueNext;
						},
						null
					);

					var venueMessage = controlMessage.toVenue();
					universe.venueNext = VenueFader.fromVenuesToAndFrom(venueMessage, universe.venueCurrent);
				}
			);

			universe.venueNext = VenueFader.fromVenuesToAndFrom(venueTask, universe.venueCurrent);
		};

		var loadFromFile = () => // click
		{
			var venueFileUpload = new VenueFileUpload(null, null);

			var controlMessageReadyToLoad = controlBuilder.message
			(
				universe,
				size,
				DataBinding.fromContext("Ready to load from file..."),
				() => // acknowledge
				{
					var callback = (fileContentsAsString: string) =>
					{
						var worldAsStringCompressed = fileContentsAsString;
						var compressor = universe.storageHelper.compressor;
						var worldSerialized = compressor.decompressString(worldAsStringCompressed);
						var worldDeserialized = universe.serializer.deserialize(worldSerialized);
						universe.world = worldDeserialized;

						var venueNext: Venue = universe.controlBuilder.game
						(
							universe, size, universe.venueCurrent
						).toVenue();
						venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
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
			);

			var venueMessageReadyToLoad = controlMessageReadyToLoad.toVenue();

			var controlMessageCancelled = controlBuilder.message
			(
				universe,
				size,
				DataBinding.fromContext("No file specified."),
				() => // acknowlege
				{
					var venueNext: Venue = controlBuilder.game(universe, size, universe.venueCurrent).toVenue();
					venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
					universe.venueNext = venueNext;
				},
				false //?
			);

			var venueMessageCancelled = controlMessageCancelled.toVenue();

			venueFileUpload.venueNextIfFileSpecified = venueMessageReadyToLoad;
			venueFileUpload.venueNextIfCancelled = venueMessageCancelled;

			universe.venueNext = venueFileUpload;
		};

		var back = () =>
		{
			var venueNext = venueToReturnTo;
			venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
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
		};

		var deleteSaveSelected = () =>
		{
			var saveStateSelected = universe.profile.saveStateSelected();

			if (saveStateSelected == null)
			{
				return;
			}

			var controlConfirm = universe.controlBuilder.confirmAndReturnToVenue
			(
				universe,
				size,
				"Delete save state \""
					+ saveStateSelected.timeSaved.toStringYYYY_MM_DD_HH_MM_SS()
					+ "\"?",
				universe.venueCurrent,
				deleteSaveSelectedConfirm,
				null // cancel
			);

			var venueNext: Venue = controlConfirm.toVenue();
			venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
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
			Coords.create(), // pos
			sizeBase.clone(), // size
			// children
			[
				new ControlLabel
				(
					"labelProfileName",
					Coords.fromXY(100, 10), // pos
					Coords.fromXY(120, fontHeight), // size
					true, // isTextCentered
					"Profile: " + universe.profile.name,
					fontHeight
				),

				new ControlLabel
				(
					"labelChooseASave",
					Coords.fromXY(100, 20), // pos
					Coords.fromXY(150, 25), // size
					true, // isTextCentered
					"Choose a State to " + (isLoadNotSave ? "Restore" : "Overwrite") + ":",
					fontHeight
				),

				ControlList.from10
				(
					"listSaveStates",
					Coords.fromXY(10, 35), // pos
					Coords.fromXY(110, 75), // size
					DataBinding.fromContextAndGet
					(
						universe.profile,
						(c: Profile) => c.saveStates
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
						(c: Profile, v: SaveState) => c.saveStateNameSelected = v.name
					), // bindingForOptionSelected
					DataBinding.fromGet( (c: string) => c ), // value
					null,
					(isLoadNotSave ? loadSelectedSlotFromLocalStorage: saveToLocalStorageOverwritingSlotSelected) // confirm
				),

				ControlButton.from8
				(
					"buttonNew",
					Coords.fromXY(10, 120), // pos
					Coords.fromXY(25, buttonHeightBase), // size
					"New",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					(isLoadNotSave ? loadNewWorld : saveToLocalStorageAsNewSlot) // click
				),

				new ControlButton
				(
					"buttonSelect",
					Coords.fromXY(40, 120), // pos
					Coords.fromXY(25, buttonHeightBase), // size
					(isLoadNotSave ? "Load" : "Save"),
					fontHeight,
					true, // hasBorder
					// isEnabled
					DataBinding.fromContextAndGet
					(
						universe.profile,
						(c: Profile) => (c.saveStateNameSelected != null)
					),
					(isLoadNotSave ? loadSelectedSlotFromLocalStorage : saveToLocalStorageOverwritingSlotSelected), // click
					null, null
				),

				ControlButton.from8
				(
					"buttonFile",
					Coords.fromXY(70, 120), // pos
					Coords.fromXY(25, buttonHeightBase), // size
					"File",
					fontHeight,
					true, // hasBorder
					// isEnabled
					DataBinding.fromContextAndGet
					(
						universe.profile,
						(c: Profile) => (c.saveStateNameSelected != null),
					),
					(isLoadNotSave ? loadFromFile : saveToFilesystem) // click
				),

				ControlButton.from8
				(
					"buttonDelete",
					Coords.fromXY(100, 120), // pos
					Coords.fromXY(20, buttonHeightBase), // size
					"X",
					fontHeight,
					true, // hasBorder
					// isEnabled
					DataBinding.fromContextAndGet
					(
						universe.profile,
						(c: Profile) => (c.saveStateNameSelected != null)
					),
					deleteSaveSelected // click
				),

				ControlVisual.from5
				(
					"visualSnapshot",
					Coords.fromXY(130, 35),
					visualThumbnailSize,
					DataBinding.fromContextAndGet
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
						}
					),
					Color.byName("White")
				),

				new ControlLabel
				(
					"labelPlaceName",
					Coords.fromXY(130, 80), // pos
					Coords.fromXY(120, buttonHeightBase), // size
					false, // isTextCentered
					DataBinding.fromContextAndGet
					(
						universe.profile,
						(c: Profile) =>
						{
							var saveState = c.saveStateSelected();
							return (saveState == null ? "" : saveState.placeName);
						}
					),
					fontHeight
				),

				new ControlLabel
				(
					"labelTimePlaying",
					Coords.fromXY(130, 90), // pos
					Coords.fromXY(120, buttonHeightBase), // size
					false, // isTextCentered
					DataBinding.fromContextAndGet
					(
						universe.profile,
						(c: Profile) =>
						{
							var saveState = c.saveStateSelected();
							return (saveState == null ? "" : saveState.timePlayingAsString);
						}
					),
					fontHeight
				),

				new ControlLabel
				(
					"labelDateSaved",
					Coords.fromXY(130, 100), // pos
					Coords.fromXY(120, buttonHeightBase), // size
					false, // isTextCentered
					DataBinding.fromContextAndGet
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
						}
					),
					fontHeight
				),

				new ControlLabel
				(
					"labelTimeSaved",
					Coords.fromXY(130, 110), // pos
					Coords.fromXY(120, buttonHeightBase), // size
					false, // isTextCentered
					DataBinding.fromContextAndGet
					(
						universe.profile,
						(c: Profile) =>
						{
							var saveState = c.saveStateSelected();
							return (saveState == null ? "" : saveState.timeSaved.toStringHH_MM_SS());
						}
					),
					fontHeight
				),

				ControlButton.from8
				(
					"buttonBack",
					Coords.fromXY
					(
						sizeBase.x - 10 - 25, sizeBase.y - 10 - 15
					), // pos
					Coords.fromXY(25, 15), // size
					"Back",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					back // click
				),
			],
			null, null
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}

	static toControlProfileNew(universe: Universe, size: Coords): ControlBase
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var controlBuilder = universe.controlBuilder;
		var sizeBase = controlBuilder.sizeBase;
		var scaleMultiplier = size.clone().divide(sizeBase);
		var fontHeight = controlBuilder.fontHeightInPixelsBase;
		var buttonHeightBase = controlBuilder.buttonHeightBase;

		var returnValue = ControlContainer.from4
		(
			"containerProfileNew",
			Coords.create(), // pos
			sizeBase.clone(), // size
			// children
			[
				new ControlLabel
				(
					"labelName",
					Coords.fromXY(100, 40), // pos
					Coords.fromXY(100, 20), // size
					true, // isTextCentered
					"Profile Name:",
					fontHeight
				),

				new ControlTextBox
				(
					"textBoxName",
					Coords.fromXY(50, 50), // pos
					Coords.fromXY(100, 20), // size
					new DataBinding
					(
						universe.profile,
						(c: Profile) => c.name,
						(c: Profile, v: string) => c.name = v
					), // text
					fontHeight,
					null, // charCountMax
					DataBinding.fromTrue() // isEnabled
				),

				ControlButton.from8
				(
					"buttonCreate",
					Coords.fromXY(50, 80), // pos
					Coords.fromXY(45, buttonHeightBase), // size
					"Create",
					fontHeight,
					true, // hasBorder
					// isEnabled
					DataBinding.fromContextAndGet
					(
						universe.profile,
						(c: Profile) => { return c.name.length > 0; }
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
						var venueNext: Venue = Profile.toControlSaveStateLoad
						(
							universe, null, universe.venueCurrent
						).toVenue();
						venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					}
				),

				ControlButton.from8
				(
					"buttonCancel",
					Coords.fromXY(105, 80), // pos
					Coords.fromXY(45, buttonHeightBase), // size
					"Cancel",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var venueNext: Venue = Profile.toControlProfileSelect
						(
							universe, null, universe.venueCurrent
						).toVenue();
						venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					}
				),
			]
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}

	static toControlProfileSelect
	(
		universe: Universe, size: Coords, venuePrev: Venue
	): ControlBase
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var controlBuilder = universe.controlBuilder;
		var sizeBase = controlBuilder.sizeBase;
		var scaleMultiplier = size.clone().divide(sizeBase);
		var fontHeight = controlBuilder.fontHeightInPixelsBase;
		var buttonHeightBase = controlBuilder.buttonHeightBase;

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
			var venueNext: Venue = Profile.toControlProfileNew(universe, null).toVenue();
			venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
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
				var venueNext: Venue = Profile.toControlSaveStateLoad
				(
					universe, null, universe.venueCurrent
				).toVenue();
				venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
				universe.venueNext = venueNext;
			}
		};

		var deleteProfileConfirm = () =>
		{
			var profileSelected = universe.profile;

			var storageHelper = universe.storageHelper;
			storageHelper.delete(profileSelected.name);
			var profileNames = storageHelper.load("ProfileNames");
			ArrayHelper.remove(profileNames, profileSelected.name);
			storageHelper.save("ProfileNames", profileNames);
		};

		var deleteProfile = () =>
		{
			var profileSelected = universe.profile;
			if (profileSelected != null)
			{
				var controlConfirm = universe.controlBuilder.confirmAndReturnToVenue
				(
					universe,
					size,
					"Delete profile \""
						+ profileSelected.name
						+ "\"?",
					universe.venueCurrent,
					deleteProfileConfirm,
					null // cancel
				);

				var venueNext: Venue = controlConfirm.toVenue();
				venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
				universe.venueNext = venueNext;
			}
		};

		var returnValue = ControlContainer.from4
		(
			"containerProfileSelect",
			Coords.create(), // pos
			sizeBase.clone(), // size
			// children
			[
				new ControlLabel
				(
					"labelSelectAProfile",
					Coords.fromXY(100, 40), // pos
					Coords.fromXY(100, 25), // size
					true, // isTextCentered
					"Select a Profile:",
					fontHeight
				),

				new ControlList
				(
					"listProfiles",
					Coords.fromXY(30, 50), // pos
					Coords.fromXY(140, 40), // size
					DataBinding.fromContext(profiles), // items
					DataBinding.fromGet( (c: Profile) => c.name ), // bindingForItemText
					fontHeight,
					new DataBinding
					(
						universe,
						(c: Universe) => c.profile,
						(c: Universe, v: Profile) => c.profile = v
					), // bindingForOptionSelected
					DataBinding.fromGet( (c: Profile) => c ), // value
					null, // bindingForIsEnabled
					select, // confirm
					null // widthInItems
				),

				ControlButton.from8
				(
					"buttonNew",
					Coords.fromXY(30, 95), // pos
					Coords.fromXY(35, buttonHeightBase), // size
					"New",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					create // click
				),

				ControlButton.from8
				(
					"buttonSelect",
					Coords.fromXY(70, 95), // pos
					Coords.fromXY(35, buttonHeightBase), // size
					"Select",
					fontHeight,
					true, // hasBorder
					// isEnabled
					DataBinding.fromContextAndGet
					(
						universe,
						(c: Universe) => { return (c.profile != null); }
					),
					select // click
				),

				ControlButton.from8
				(
					"buttonSkip",
					Coords.fromXY(110, 95), // pos
					Coords.fromXY(35, buttonHeightBase), // size
					"Skip",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					// click
					() =>
					{
						universe.venueNext = Profile.venueWorldGenerate(universe);
					}
				),

				ControlButton.from8
				(
					"buttonDelete",
					Coords.fromXY(150, 95), // pos
					Coords.fromXY(20, buttonHeightBase), // size
					"X",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					deleteProfile // click
				),

				ControlButton.from8
				(
					"buttonBack",
					Coords.fromXY(sizeBase.x - 10 - 25, sizeBase.y - 10 - 20), // pos
					Coords.fromXY(25, 20), // size
					"Back",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var venueNext = venuePrev;
						venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					}
				),
			]
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}

	static venueWorldGenerate(universe: Universe): Venue
	{
		var messageAsDataBinding = DataBinding.fromGet
		(
			(c: VenueTask) => "Generating world...",
		);

		var venueMessage =
			VenueMessage.fromMessage(messageAsDataBinding);

		var venueTask = new VenueTask
		(
			venueMessage,
			() => universe.worldCreate(), // perform
			(universe: Universe, world: World) => // done
			{
				universe.world = world;

				var profile = Profile.anonymous();
				universe.profile = profile;

				var venueNext: Venue = universe.world.toVenue();
				venueNext = VenueFader.fromVenuesToAndFrom
				(
					venueNext, universe.venueCurrent
				);
				universe.venueNext = venueNext;
			}
		);

		messageAsDataBinding.contextSet(venueTask);

		var returnValue =
			VenueFader.fromVenuesToAndFrom(venueTask, universe.venueCurrent);

		return returnValue;
	}

}

}
