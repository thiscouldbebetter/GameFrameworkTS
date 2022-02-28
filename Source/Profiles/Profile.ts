
namespace ThisCouldBeBetter.GameFramework
{

export class Profile
{
	name: string;
	saveStates: SaveStateBase[];
	saveStateNameSelected: string;

	constructor(name: string, saveStates: SaveStateBase[])
	{
		this.name = name;
		this.saveStates = saveStates;
		this.saveStateNameSelected = null;
	}

	static StorageKeyProfileNames = "ProfileNames";

	static anonymous(): Profile
	{
		var now = DateTime.now();
		var nowAsString = now.toStringMMDD_HHMM_SS();
		var profileName = "Anon-" + nowAsString;
		var profile = new Profile(profileName, []);
		return profile;
	}

	saveStateSelected(): SaveStateBase
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
		universe: Universe,
		size: Coords,
		venuePrev: Venue,
		isLoadNotSave: boolean
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
		var fontNameAndHeight = new FontNameAndHeight(null, fontHeight);
		var buttonHeightBase = controlBuilder.buttonHeightBase;

		var visualThumbnailSize = Profile.toControlSaveStateLoadOrSave_ThumbnailSize();

		var venueToReturnTo = universe.venueCurrent;

		var back = () => universe.venueTransitionTo(venueToReturnTo);

		var saveToLocalStorageOverwritingSlotSelected = () =>
		{
			Profile.toControlSaveStateLoadOrSave_DeleteSaveSelected_Confirm(universe);
			Profile.toControlSaveStateLoadOrSave_SaveToLocalStorageAsNewSlot
			(
				universe, size
			);
		};

		var childControls = 
		[
			new ControlLabel
			(
				"labelProfileName",
				Coords.fromXY(10, 10), // pos
				Coords.fromXY(sizeBase.x, fontHeight), // size
				true, // isTextCenteredHorizontally
				false, // isTextCenteredVertically
				DataBinding.fromContext
				(
					"Profile: " + universe.profile.name
				),
				fontNameAndHeight
			),

			new ControlLabel
			(
				"labelChooseASave",
				Coords.fromXY(10, 20), // pos
				Coords.fromXY(sizeBase.x, 25), // size
				true, // isTextCenteredHorizontally
				false, // isTextCenteredVertically
				DataBinding.fromContext
				(
					"Choose a State to "
					+ (isLoadNotSave ? "Restore" : "Overwrite") + ":"
				),
				fontNameAndHeight
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
					(c: SaveStateBase) =>
					{
						var timeSaved = c.timeSaved;
						return (timeSaved == null ? "-" : timeSaved.toStringYYYY_MM_DD_HH_MM_SS() )
					}
				), // bindingForOptionText
				fontNameAndHeight,
				new DataBinding
				(
					universe.profile,
					(c: Profile) => c.saveStateSelected(),
					(c: Profile, v: SaveStateBase) => c.saveStateNameSelected = v.name
				), // bindingForOptionSelected
				DataBinding.fromGet( (v: SaveStateBase) => v.name ), // value
				null,
				(
					isLoadNotSave
					? Profile.toControlSaveStateLoadOrSave_LoadSelectedSlotFromLocalStorage
					: saveToLocalStorageOverwritingSlotSelected
				) // confirm
			),

			ControlButton.from8
			(
				"buttonNew",
				Coords.fromXY(10, 120), // pos
				Coords.fromXY(25, buttonHeightBase), // size
				"New",
				fontNameAndHeight,
				true, // hasBorder
				DataBinding.fromTrue(), // isEnabled
				(
					isLoadNotSave
					? () => Profile.toControlSaveStateLoadOrSave_LoadNewWorld(universe, size)
					: () =>
						Profile.toControlSaveStateLoadOrSave_SaveToLocalStorageAsNewSlot
						(
							universe, size
						)
				) // click
			),

			new ControlButton
			(
				"buttonSelect",
				Coords.fromXY(40, 120), // pos
				Coords.fromXY(25, buttonHeightBase), // size
				(isLoadNotSave ? "Load" : "Save"),
				fontNameAndHeight,
				true, // hasBorder
				// isEnabled
				DataBinding.fromContextAndGet
				(
					universe.profile,
					(c: Profile) => (c.saveStateNameSelected != null)
				),
				(
					isLoadNotSave
					? () => Profile.toControlSaveStateLoadOrSave_LoadSelectedSlotFromLocalStorage(universe)
					: saveToLocalStorageOverwritingSlotSelected
				), // click
				false // canBeHeldDown
			),

			ControlButton.from8
			(
				"buttonFile",
				Coords.fromXY(70, 120), // pos
				Coords.fromXY(25, buttonHeightBase), // size
				"File",
				fontNameAndHeight,
				true, // hasBorder
				// isEnabled
				DataBinding.fromContextAndGet
				(
					universe.profile,
					(c: Profile) => (c.saveStateNameSelected != null),
				),
				(
					isLoadNotSave
					? () => Profile.toControlSaveStateLoadOrSave_LoadFromFile(universe, size)
					: () => Profile.toControlSaveStateLoadOrSave_SaveToFilesystem(universe, size)
				) // click
			),

			ControlButton.from8
			(
				"buttonDelete",
				Coords.fromXY(100, 120), // pos
				Coords.fromXY(20, buttonHeightBase), // size
				"X",
				fontNameAndHeight,
				true, // hasBorder
				// isEnabled
				DataBinding.fromContextAndGet
				(
					universe.profile,
					(c: Profile) => (c.saveStateNameSelected != null)
				),
				() => Profile.toControlSaveStateLoadOrSave_DeleteSaveSelected(universe, size) // click
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
							: new VisualImageScaled
							(
								visualThumbnailSize.clone(),
								new VisualImageImmediate(saveStateImageSnapshot, true) // isScaled
							)
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
				false, // isTextCenteredHorizontally
				false, // isTextCenteredVertically
				DataBinding.fromContextAndGet
				(
					universe.profile,
					(c: Profile) =>
					{
						var saveState = c.saveStateSelected();
						return (saveState == null ? "" : saveState.placeName);
					}
				),
				fontNameAndHeight
			),

			new ControlLabel
			(
				"labelTimePlaying",
				Coords.fromXY(130, 90), // pos
				Coords.fromXY(120, buttonHeightBase), // size
				false, // isTextCenteredHorizontally
				false, // isTextCenteredVertically
				DataBinding.fromContextAndGet
				(
					universe.profile,
					(c: Profile) =>
					{
						var saveState = c.saveStateSelected();
						return (saveState == null ? "" : saveState.timePlayingAsString);
					}
				),
				fontNameAndHeight
			),

			new ControlLabel
			(
				"labelDateSaved",
				Coords.fromXY(130, 100), // pos
				Coords.fromXY(120, buttonHeightBase), // size
				false, // isTextCenteredHorizontally
				false, // isTextCenteredVertically
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
				fontNameAndHeight
			),

			new ControlLabel
			(
				"labelTimeSaved",
				Coords.fromXY(130, 110), // pos
				Coords.fromXY(120, buttonHeightBase), // size
				false, // isTextCenteredHorizontally
				false, // isTextCenteredVertically
				DataBinding.fromContextAndGet
				(
					universe.profile,
					(c: Profile) =>
					{
						var saveState = c.saveStateSelected();
						return (saveState == null ? "" : saveState.timeSaved.toStringHH_MM_SS());
					}
				),
				fontNameAndHeight
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
				fontNameAndHeight,
				true, // hasBorder
				DataBinding.fromTrue(), // isEnabled
				back // click
			),
		];

		var returnValue = new ControlContainer
		(
			"containerSaveStates",
			Coords.create(), // pos
			sizeBase.clone(), // size
			childControls,
			null, null
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}

	static toControlSaveStateLoadOrSave_DeleteSaveSelected
	(
		universe: Universe, size: Coords
	): void
	{
		var saveStateSelected = universe.profile.saveStateSelected();

		if (saveStateSelected != null)
		{
			var controlConfirm = universe.controlBuilder.confirmAndReturnToVenue
			(
				universe,
				size,
				"Delete save state \""
					+ saveStateSelected.timeSaved.toStringYYYY_MM_DD_HH_MM_SS()
					+ "\"?",
				universe.venueCurrent,
				() =>
					Profile.toControlSaveStateLoadOrSave_DeleteSaveSelected_Confirm(universe),
				null // cancel
			);

			var venueNext = controlConfirm.toVenue();
			universe.venueTransitionTo(venueNext);
		}
	}

	static toControlSaveStateLoadOrSave_DeleteSaveSelected_Confirm
	(
		universe: Universe
	): void
	{
		var saveStateSelected = universe.profile.saveStateSelected();

		var storageHelper = universe.storageHelper;
		storageHelper.delete(saveStateSelected.name);
		var profile = universe.profile;
		ArrayHelper.remove(profile.saveStates, saveStateSelected);
		storageHelper.save(profile.name, profile);
	};

	static toControlSaveStateLoadOrSave_LoadFromFile
	(
		universe: Universe, size: Coords
	): void
	{
		var venueFileUpload = new VenueFileUpload(null, null);

		var controlBuilder = universe.controlBuilder;
		var controlMessageReadyToLoad = controlBuilder.message4
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
					var worldCreator = universe.worldCreator;
					var worldBlank = worldCreator.worldCreate(universe, worldCreator);
					var worldDeserialized = worldBlank.fromStringJson(worldSerialized, universe);
					universe.world = worldDeserialized;

					var venueNext = universe.controlBuilder.game
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
			}
		);

		var venueMessageReadyToLoad = controlMessageReadyToLoad.toVenue();

		var controlMessageCancelled = controlBuilder.message4
		(
			universe,
			size,
			DataBinding.fromContext("No file specified."),
			() => // acknowlege
			{
				var venueNext=
					controlBuilder.game(universe, size, universe.venueCurrent).toVenue();
				universe.venueTransitionTo(venueNext);
			}
		);

		var venueMessageCancelled = controlMessageCancelled.toVenue();

		venueFileUpload.venueNextIfFileSpecified = venueMessageReadyToLoad;
		venueFileUpload.venueNextIfCancelled = venueMessageCancelled;

		universe.venueNext = venueFileUpload;
	};

	static toControlSaveStateLoadOrSave_LoadNewWorld
	(
		universe: Universe, size: Coords
	): void
	{
		var world = universe.worldCreate();
		universe.world = world;
		var controlBuilder = universe.controlBuilder;
		var venueNext = controlBuilder.worldDetail
		(
			universe, size, universe.venueCurrent
		).toVenue();
		universe.venueTransitionTo(venueNext);
	}

	static toControlSaveStateLoadOrSave_LoadSelectedSlotFromLocalStorage
	(
		universe: Universe
	): void
	{
		var saveStateNameSelected = universe.profile.saveStateNameSelected;
		if (saveStateNameSelected != null)
		{
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
					return universe.storageHelper.load<SaveStateBase>(saveStateNameSelected);
				},
				(saveStateSelected: SaveStateBase) => // done
				{
					var worldSelected = saveStateSelected.toWorld(universe);
					universe.world = worldSelected;
					var venueNext = worldSelected.toVenue();
					universe.venueTransitionTo(venueNext);
				}
			);

			messageAsDataBinding.contextSet(venueTask);

			universe.venueTransitionTo(venueTask);
		}
	}

	static toControlSaveStateLoadOrSave_SaveToLocalStorage
	(
		universe: Universe
	): string
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
		var imageSnapshotFull = displayFull.toImage(Profile.name);

		var imageSizeThumbnail = Profile.toControlSaveStateLoadOrSave_ThumbnailSize();
		var displayThumbnail = Display2D.fromSizeAndIsInvisible
		(
			imageSizeThumbnail, true
		);
		displayThumbnail.initialize(universe);
		displayThumbnail.drawImageScaled
		(
			imageSnapshotFull, Coords.Instances().Zeroes, imageSizeThumbnail
		);
		var imageThumbnailFromDisplay =
			displayThumbnail.toImage(SaveStateBase.name);
		var imageThumbnailAsDataUrl = imageThumbnailFromDisplay.systemImage.toDataURL();
		var imageThumbnail = new Image2("Snapshot", imageThumbnailAsDataUrl).unload();

		var saveStateName = "Save-" + nowAsString;
		var saveState = new SaveStateWorld
		(
			saveStateName,
			placeName,
			timePlayingAsString,
			now,
			imageThumbnail,
		).fromWorld
		(
			world
		);

		var storageHelper = universe.storageHelper;

		var errorMessageFromSave;
		try
		{
			storageHelper.save(saveStateName, saveState);

			if (profile.saveStates.some(x => x.name == saveStateName) == false)
			{
				saveState.unload();
				profile.saveStates.push(saveState);
				storageHelper.save(profile.name, profile);
			}

			var profileNames = storageHelper.load<string[]>(Profile.StorageKeyProfileNames);

			if (profileNames == null)
			{
				profileNames = new Array<string>();
				storageHelper.save(Profile.StorageKeyProfileNames, profileNames);
			}

			if (profileNames.indexOf(profile.name) == -1)
			{
				profileNames.push(profile.name);
				storageHelper.save(Profile.StorageKeyProfileNames, profileNames);
			}

			errorMessageFromSave = null;
		}
		catch (ex)
		{
			var exceptionTypeName = ex.constructor.name;
			var exceptionMessage = ex.message;

			if
			(
				exceptionTypeName == DOMException.name
				&& exceptionMessage.endsWith("exceeded the quota.")
			)
			{
				errorMessageFromSave = "Browser out of storage space."
			}
			else
			{
				errorMessageFromSave = "Unexpected error.";
			}
		}

		return errorMessageFromSave;
	}

	static toControlSaveStateLoadOrSave_SaveToLocalStorage_Done
	(
		universe: Universe,
		size: Coords,
		errorMessageFromSave: string
	): void
	{
		var message =
		(
			errorMessageFromSave == null
			? "Game saved successfully."
			: "Save failed due to errors:\n" + errorMessageFromSave
		);

		var controlMessage = universe.controlBuilder.message4
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
				universe.venueTransitionTo(venueNext);
			}
		);

		var venueNext = controlMessage.toVenue();
		universe.venueTransitionTo(venueNext);
	}

	static toControlSaveStateLoadOrSave_SaveToFilesystem
	(
		universe: Universe, size: Coords
	): void
	{
		var venueMessage = VenueMessage.fromText("Saving game...");

		var savePerform = () =>
		{
			var world = universe.world;

			world.dateSaved = DateTime.now();
			var worldSerialized = world.toStringJson(universe);

			var compressor = universe.storageHelper.compressor;
			var worldCompressedAsBytes = compressor.compressStringToBytes(worldSerialized);

			return worldCompressedAsBytes;
		};

		var saveDone = (worldCompressedAsBytes: number[]) => // done
		{
			var wasSaveSuccessful = (worldCompressedAsBytes != null);
			var message =
			(
				wasSaveSuccessful
				? "Save ready: choose location on dialog."
				: "Save failed due to errors."
			);

			new FileHelper().saveBytesToFileWithName
			(
				worldCompressedAsBytes, universe.world.name + ".json.lzw"
			);

			var controlMessage = universe.controlBuilder.message4
			(
				universe,
				size,
				DataBinding.fromContext(message),
				() => // acknowledge
				{
					var venueNext = universe.controlBuilder.game
					(
						universe, null, universe.venueCurrent
					).toVenue();
					universe.venueTransitionTo(venueNext);
				}
			);

			var venueMessage = controlMessage.toVenue();
			universe.venueTransitionTo(venueMessage);
		}

		var venueTask = new VenueTask(venueMessage, savePerform, saveDone);

		universe.venueTransitionTo(venueTask);
	}

	static toControlSaveStateLoadOrSave_SaveToLocalStorageAsNewSlot
	(
		universe: Universe, size: Coords
	): void
	{
		var messageAsDataBinding = DataBinding.fromContextAndGet
		(
			null, // context - Set below.
			(c: VenueTask<string>) => "Saving game..."
		);

		var venueMessage = VenueMessage.fromMessage
		(
			messageAsDataBinding
		);

		var perform = () =>
			Profile.toControlSaveStateLoadOrSave_SaveToLocalStorage(universe);

		var venueTask = new VenueTask
		(
			venueMessage,
			perform,
			(errorMessageFromSave: string) => // done
			{
				Profile.toControlSaveStateLoadOrSave_SaveToLocalStorage_Done
				(
					universe, size, errorMessageFromSave
				);
			}
		);
		messageAsDataBinding.contextSet(venueTask);

		universe.venueTransitionTo(venueTask);
	}

	static toControlSaveStateLoadOrSave_ThumbnailSize()
	{
		return Coords.fromXY(60, 45);
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
		var fontNameAndHeight = controlBuilder.fontBase;
		var buttonHeightBase = controlBuilder.buttonHeightBase;

		var create = () =>
		{
			var venueControls = universe.venueCurrent as VenueControls;
			var controlRootAsContainer = venueControls.controlRoot as ControlContainer;
			var textBoxName =
				controlRootAsContainer.childrenByName.get("textBoxName") as ControlTextBox<any>;
			var profileName = textBoxName.text(null);
			if (profileName == "")
			{
				return;
			}

			var storageHelper = universe.storageHelper;

			var profile = new Profile(profileName, []);
			var profileNames = storageHelper.load<string[]>(Profile.StorageKeyProfileNames);
			if (profileNames == null)
			{
				profileNames = [];
			}
			profileNames.push(profileName);
			storageHelper.save(Profile.StorageKeyProfileNames, profileNames);
			storageHelper.save(profileName, profile);

			universe.profile = profile;
			var venueNext: Venue = Profile.toControlSaveStateLoad
			(
				universe, null, universe.venueCurrent
			).toVenue();
			venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
			universe.venueNext = venueNext;
		};

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
					Coords.fromXY(50, 35), // pos
					Coords.fromXY(100, 15), // size
					true, // isTextCenteredHorizontally
					true, // isTextCenteredVertically
					DataBinding.fromContext("Profile Name:"),
					fontNameAndHeight
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
					fontNameAndHeight,
					null, // charCountMax
					DataBinding.fromTrue() // isEnabled
				),

				ControlButton.from8
				(
					"buttonCreate",
					Coords.fromXY(50, 80), // pos
					Coords.fromXY(45, buttonHeightBase), // size
					"Create",
					fontNameAndHeight,
					true, // hasBorder
					// isEnabled
					DataBinding.fromContextAndGet
					(
						universe.profile,
						(c: Profile) => { return c.name.length > 0; }
					),
					create
				),

				ControlButton.from8
				(
					"buttonCancel",
					Coords.fromXY(105, 80), // pos
					Coords.fromXY(45, buttonHeightBase), // size
					"Cancel",
					fontNameAndHeight,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						var venueNext = Profile.toControlProfileSelect
						(
							universe, null, universe.venueCurrent
						).toVenue();
						universe.venueTransitionTo(venueNext);
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
		var fontNameAndHeight = controlBuilder.fontBase;
		var buttonHeightBase = controlBuilder.buttonHeightBase;

		var storageHelper = universe.storageHelper;
		var profileNames = storageHelper.load(Profile.StorageKeyProfileNames) as Array<string>;
		if (profileNames == null)
		{
			profileNames = [];
			storageHelper.save(Profile.StorageKeyProfileNames, profileNames);
		}
		var profiles = profileNames.map(x => storageHelper.load<Profile>(x));

		var create = () =>
		{
			universe.profile = new Profile("", null);
			var venueNext = Profile.toControlProfileNew(universe, null).toVenue();
			universe.venueTransitionTo(venueNext);
		};

		var select = () =>
		{
			var venueControls = universe.venueCurrent as VenueControls;
			var controlRootAsContainer = venueControls.controlRoot as ControlContainer;
			var listProfiles =
				controlRootAsContainer.childrenByName.get("listProfiles") as ControlList<Universe, Profile, string>;
			var profileSelected = listProfiles.itemSelected();
			universe.profile = profileSelected;
			if (profileSelected != null)
			{
				var venueNext = Profile.toControlSaveStateLoad
				(
					universe, null, universe.venueCurrent
				).toVenue();
				universe.venueTransitionTo(venueNext);
			}
		};

		var deleteProfileConfirm = () =>
		{
			var profileSelected = universe.profile;

			var storageHelper = universe.storageHelper;
			storageHelper.delete(profileSelected.name);
			var profileNames =
				storageHelper.load<string[]>(Profile.StorageKeyProfileNames);
			ArrayHelper.remove(profileNames, profileSelected.name);
			storageHelper.save(Profile.StorageKeyProfileNames, profileNames);
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

				var venueNext = controlConfirm.toVenue();
				universe.venueTransitionTo(venueNext);
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
					Coords.fromXY(30, 35), // pos
					Coords.fromXY(140, 15), // size
					true, // isTextCenteredHorizontally
					true, // isTextCenteredVertically
					DataBinding.fromContext("Select a Profile:"),
					fontNameAndHeight
				),

				new ControlList<Universe, Profile, string>
				(
					"listProfiles",
					Coords.fromXY(30, 50), // pos
					Coords.fromXY(140, 40), // size
					DataBinding.fromGet
					(
						(c: Universe) => profiles
					), // items
					DataBinding.fromGet
					(
						(c: Profile) => c.name
					), // bindingForItemText
					fontNameAndHeight,
					new DataBinding
					(
						universe,
						(c: Universe) => c.profile,
						(c: Universe, v: Profile) => c.profile = v
					), // bindingForOptionSelected
					DataBinding.fromGet( (c: Profile) => c.name ), // value
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
					fontNameAndHeight,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					create // click
				),

				ControlButton.from8
				(
					"buttonSelect",
					Coords.fromXY(70, 95), // pos
					Coords.fromXY(35, buttonHeightBase), // size
					"Select",
					fontNameAndHeight,
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
					fontNameAndHeight,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					// click
					() =>
					{
						universe.profile = Profile.anonymous();
						universe.venueTransitionTo
						(
							universe.worldCreator.toVenue(universe)
						)
					}
				),

				ControlButton.from8
				(
					"buttonDelete",
					Coords.fromXY(150, 95), // pos
					Coords.fromXY(20, buttonHeightBase), // size
					"X",
					fontNameAndHeight,
					true, // hasBorder
					// isEnabled
					DataBinding.fromContextAndGet
					(
						universe,
						(c: Universe) => { return (c.profile != null); }
					),
					deleteProfile // click
				),

				ControlButton.from8
				(
					"buttonBack",
					Coords.fromXY
					(
						sizeBase.x - 10 - 25,
						sizeBase.y - 10 - 20
					), // pos
					Coords.fromXY(25, 20), // size
					"Back",
					fontNameAndHeight,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						universe.venueTransitionTo(venuePrev);
					}
				),
			]
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}
}

}
