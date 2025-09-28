
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
		var profileName = "";
		var profile = new Profile(profileName, []);
		return profile;
	}

	static blank(): Profile
	{
		return new Profile("", []);
	}

	saveStateSelected(): SaveStateBase
	{
		var returnValue = this.saveStates.filter
		(
			x => x.name == this.saveStateNameSelected
		)[0];
		return returnValue;
	}

	// controls

	static toControlSaveStateLoad
	(
		universe: Universe, size: Coords, venuePrev: Venue
	): ControlBase
	{
		var isLoadNotSave = true;
		var returnValue = Profile.toControlSaveStateLoadOrSave
		(
			universe, size, venuePrev, isLoadNotSave
		);
		return returnValue;
	}

	static toControlSaveStateSave
	(
		universe: Universe, size: Coords, venuePrev: Venue
	): ControlBase
	{
		var isLoadNotSave = false;
		var returnValue = Profile.toControlSaveStateLoadOrSave
		(
			universe, size, venuePrev, isLoadNotSave
		);
		return returnValue;
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

		var margin = 8;
		var controlBuilder = universe.controlBuilder;
		var sizeBase = controlBuilder.sizeBase;
		var scaleMultiplier = size.clone().divide(sizeBase);
		var fontHeight = controlBuilder.fontHeightInPixelsBase;
		var fontNameAndHeight = new FontNameAndHeight(null, fontHeight);
		var buttonHeightBase = controlBuilder.buttonHeightBase;
		var buttonSize = Coords.fromXY(1.5, 1).multiplyScalar(buttonHeightBase);
		var colors = Color.Instances();

		var visualThumbnailSize =
			Profile.toControlSaveStateLoadOrSave_ThumbnailSize();

		var venueToReturnTo = universe.venueCurrent();

		var back = () => universe.venueTransitionTo(venueToReturnTo);

		var saveToLocalStorageOverwritingSlotSelected = () =>
		{
			Profile.toControlSaveStateLoadOrSave_DeleteSaveSelected_Confirm(universe);
			Profile.toControlSaveStateLoadOrSave_SaveToLocalStorageAsNewSlot
			(
				universe, size, venueToReturnTo
			);
		};

		var labelProfileName = ControlLabel.fromPosSizeTextFontCenteredHorizontally
		(
			Coords.fromXY(margin, margin), // pos
			Coords.fromXY(sizeBase.x, fontHeight), // size
			DataBinding.fromContext
			(
				"Profile: " + universe.profile.name
			),
			fontNameAndHeight
		);

		var labelChooseAState = ControlLabel.fromPosSizeTextFontCenteredHorizontally
		(
			Coords.fromXY(margin, margin * 2), // pos
			Coords.fromXY(sizeBase.x, 25), // size
			DataBinding.fromContext
			(
				"Choose a State to "
				+ (isLoadNotSave ? "Restore" : "Overwrite") + ":"
			),
			fontNameAndHeight
		);

		var listPosY = margin * 4;

		var listSize = Coords.fromXY
		(
			sizeBase.x - margin * 3 - visualThumbnailSize.x,
			sizeBase.y - margin * 6 - buttonSize.y
		);

		var listSaveStates = ControlList.from10
		(
			"listSaveStates",
			Coords.fromXY(margin, listPosY), // pos
			listSize,
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
					var timeSavedAsString =
						timeSaved == null
						? "-"
						: timeSaved.toStringYYYY_MM_DD_HH_MM_SS();
					return timeSavedAsString;
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
		);

		var buttonPosY = sizeBase.y - margin - buttonSize.y;

		var buttonNew = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY(margin, buttonPosY), // pos
			buttonSize.clone(),
			"New",
			fontNameAndHeight,
			(
				isLoadNotSave
				? () => Profile.toControlSaveStateLoadOrSave_LoadNewWorld(universe, size)
				: () =>
					Profile.toControlSaveStateLoadOrSave_SaveToLocalStorageAsNewSlot
					(
						universe, size, venueToReturnTo
					)
			) // click
		);

		var buttonSelect = ControlButton.fromPosSizeTextFontClick<Profile>
		(
			Coords.fromXY
			(
				margin * 2 + buttonSize.x,
				buttonPosY
			), // pos
			buttonSize.clone(),
			(isLoadNotSave ? "Load" : "Save"),
			fontNameAndHeight,
			(
				isLoadNotSave
				? () => Profile.toControlSaveStateLoadOrSave_LoadSelectedSlotFromLocalStorage(universe)
				: saveToLocalStorageOverwritingSlotSelected
			)
		).isEnabledSet
		(
			DataBinding.fromContextAndGet
			(
				universe.profile,
				(c: Profile) => (c.saveStateNameSelected != null)
			)
		);

		var buttonFile = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY
			(
				margin * 3 + buttonSize.x * 2,
				buttonPosY
			), // pos
			buttonSize.clone(),
			"File",
			fontNameAndHeight,
			(
				isLoadNotSave
				? () => Profile.toControlSaveStateLoadOrSave_LoadFromFile(universe, size, venuePrev)
				: () => Profile.toControlSaveStateLoadOrSave_SaveToFilesystem(universe, size)
			) // click
		);

		var deleteSaveStateSelected = () =>
		{
			Profile.toControlSaveStateLoadOrSave_DeleteSaveSelected(universe, size);
		};

		var buttonDelete = ControlButton.fromPosSizeTextFontClick<Profile>
		(
			Coords.fromXY(margin * 4 + buttonSize.x * 3, buttonPosY), // pos
			buttonSize.clone(),
			"Delete",
			fontNameAndHeight,
			deleteSaveStateSelected
		).isEnabledSet
		(
			DataBinding.fromContextAndGet<Profile, boolean>
			(
				universe.profile,
				(c: Profile) => (c.saveStateNameSelected != null)
			)
		);

		var imagePosX = margin * 2 + listSize.x;

		var visualSnapshot = ControlVisual.fromNamePosSizeVisualAndColorBackground
		(
			"visualSnapshot",
			Coords.fromXY(imagePosX, listPosY),
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
						: saveState.imageSnapshot.load(null, null)
					);
					var returnValue: Visual =
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
			colors.White
		);

		var labelSize = Coords.fromXY(120, buttonHeightBase);

		var labelPlaceName = ControlLabel.fromPosSizeTextFontUncentered
		(
			Coords.fromXY
			(
				imagePosX,
				listPosY + visualThumbnailSize.y + margin
			), // pos
			labelSize.clone(),
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
		);

		var labelTimePlaying = ControlLabel.fromPosSizeTextFontUncentered
		(
			Coords.fromXY
			(
				imagePosX,
				90
			), // pos
			labelSize.clone(), // size
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
		);

		var labelTimeSavedYMD = ControlLabel.fromPosSizeTextFontUncentered
		(
			Coords.fromXY(imagePosX, 100), // pos
			labelSize.clone(),
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
		);

		var labelTimeSavedHMS = ControlLabel.fromPosSizeTextFontUncentered
		(
			Coords.fromXY(imagePosX, 110), // pos
			labelSize.clone(),
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
		);

		var buttonBack = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY
			(
				sizeBase.x - margin - buttonSize.x, buttonPosY
			), // pos
			buttonSize.clone(),
			"Back",
			fontNameAndHeight,
			back // click
		);

		var childControls = 
		[
			labelProfileName,
			labelChooseAState,
			listSaveStates,
			buttonNew,
			buttonSelect,
			buttonFile,
			buttonDelete,
			visualSnapshot,
			labelPlaceName,
			labelTimePlaying,
			labelTimeSavedYMD,
			labelTimeSavedHMS,
			buttonBack
		];

		var returnValue = ControlContainer.fromNamePosSizeAndChildren
		(
			"containerSaveStates",
			Coords.create(), // pos
			sizeBase.clone(), // size
			childControls
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
				universe.venueCurrent(),
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
		universe: Universe, size: Coords, venueToReturnTo: Venue
	): void
	{
		var venueFileUpload = new VenueFileUpload(null, null);

		var controlBuilder = universe.controlBuilder;
		var controlMessageReadyToLoad = controlBuilder.messageFromUniverseSizeTextAndAcknowledge
		(
			universe,
			size,
			DataBinding.fromContext("Ready to load from file..."),
			() =>
				Profile.toControlSaveStateLoadOrSave_LoadFromFile_Acknowledge
				(
					universe, size, venueFileUpload, venueToReturnTo
				)
		);

		var venueMessageReadyToLoad = controlMessageReadyToLoad.toVenue();

		var controlMessageCancelled = controlBuilder.messageFromUniverseSizeTextAndAcknowledge
		(
			universe,
			size,
			DataBinding.fromContext("No file specified."),
			() => // acknowlege
			{
				var control = controlBuilder.game(universe, size, venueToReturnTo);
				var venueNext = control.toVenue();
				universe.venueTransitionTo(venueNext);
			}
		);

		var venueMessageCancelled = controlMessageCancelled.toVenue();

		venueFileUpload.venueNextIfFileSpecified = venueMessageReadyToLoad;
		venueFileUpload.venueNextIfCancelled = venueMessageCancelled;

		universe.venueTransitionTo(venueFileUpload);
	};

	static toControlSaveStateLoadOrSave_LoadFromFile_Acknowledge
	(
		universe: Universe,
		size: Coords,
		venueFileUpload: VenueFileUpload,
		venueToReturnTo: Venue
	): void
	{
		var callback = (fileContentsAsString: string) =>
		{
			var saveStateAsStringCompressed = fileContentsAsString;
			var compressor = universe.storageHelper.compressor;
			var saveStateSerialized =
				compressor.decompressString(saveStateAsStringCompressed);
			var serializer = universe.serializer;
			var saveState = serializer.deserialize(saveStateSerialized);
			universe.world = saveState.toWorld(universe);

			var venueNext = universe.controlBuilder.game
			(
				universe, size, venueToReturnTo
			).toVenue();
			universe.venueTransitionTo(venueNext);
		}

		var domElement = venueFileUpload.toDomElement();
		var inputFile = domElement.getElementsByTagName("input")[0];
		var fileToLoad = inputFile.files[0];
		new FileHelper().loadFileAsBinaryString
		(
			fileToLoad,
			callback,
			null // contextForCallback
		);
	}

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
			universe, size, universe.venueCurrent()
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

		var saveState = world.toSaveState(universe);

		var storageHelper = universe.storageHelper;

		var errorMessageFromSave;
		try
		{
			var saveStateName = saveState.name;

			storageHelper.save(saveStateName, saveState);

			var profileHasSaveStateWithName =
				profile.saveStates.some(x => x.name == saveStateName);
			if (profileHasSaveStateWithName == false)
			{
				saveState.unload();
				profile.saveStates.push(saveState);
				storageHelper.save(profile.name, profile);
			}

			var profileNames =
				storageHelper.load<string[]>(Profile.StorageKeyProfileNames);

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
		errorMessageFromSave: string,
		venueToReturnTo: Venue
	): void
	{
		var message =
		(
			errorMessageFromSave == null
			? "Game saved successfully."
			: "Save failed due to errors:\n" + errorMessageFromSave
		);

		var controlBuilder = universe.controlBuilder;
		var controlMessage = controlBuilder.messageFromUniverseSizeTextAndAcknowledge
		(
			universe,
			size,
			DataBinding.fromContext(message),
			() => // acknowledge
			{
				var venueNext: Venue = universe.controlBuilder.game
				(
					universe, null, venueToReturnTo
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

		var saveDo =
			() =>
				Profile.toControlSaveStateLoadOrSave_SaveToFilesystem_Do(universe);

		var venueToReturnTo = universe.venuePrev();

		var saveDone =
			(worldCompressedAsBytes: number[]) =>
				Profile.toControlSaveStateLoadOrSave_SaveToFilesystem_Done
				(
					worldCompressedAsBytes, universe, size, venueToReturnTo
				);

		var venueTask = new VenueTask
		(
			venueMessage, saveDo, saveDone
		);

		universe.venueTransitionTo(venueTask);
	}

	static toControlSaveStateLoadOrSave_SaveToFilesystem_Do
	(
		universe: Universe
	): number[]
	{
		var world = universe.world;

		var worldAsSaveState = world.toSaveState(universe);

		var serializer = universe.serializer;
		var saveStateSerialized =
			serializer.serializeWithoutFormatting(worldAsSaveState);

		var compressor = universe.storageHelper.compressor;
		var worldCompressedAsBytes =
			compressor.compressStringToBytes(saveStateSerialized);

		return worldCompressedAsBytes;
	}

	static toControlSaveStateLoadOrSave_SaveToFilesystem_Done
	(
		saveStateCompressedAsBytes: number[],
		universe: Universe,
		size: Coords,
		venueToReturnTo: Venue
	): void
	{
		var wasSaveSuccessful = (saveStateCompressedAsBytes != null);
		var message =
		(
			wasSaveSuccessful
			? "Save ready: choose location on dialog."
			: "Save failed due to errors."
		);

		var fileNameStem = universe.saveFileNameStem();
		var fileName = fileNameStem + ".json.lzw";

		new FileHelper().saveBytesToFileWithName
		(
			saveStateCompressedAsBytes, fileName
		);

		var controlBuilder = universe.controlBuilder;
		var controlMessage = controlBuilder.messageFromUniverseSizeTextAndAcknowledge
		(
			universe,
			size,
			DataBinding.fromContext(message),
			() => // acknowledge
			{
				var venueNext = universe.controlBuilder.game
				(
					universe, null, venueToReturnTo
				).toVenue();
				universe.venueTransitionTo(venueNext);
			}
		);

		var venueMessage = controlMessage.toVenue();
		universe.venueTransitionTo(venueMessage);
	}

	static toControlSaveStateLoadOrSave_SaveToLocalStorageAsNewSlot
	(
		universe: Universe, size: Coords, venueToReturnTo: Venue
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
					universe, size, errorMessageFromSave, venueToReturnTo
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

		var cancel = () => // click
		{
			var venueNext = Profile.toControlProfileSelect
			(
				universe, null, universe.venueCurrent()
			).toVenue();
			universe.venueTransitionTo(venueNext);
		};

		var returnValue = ControlContainer.fromNamePosSizeAndChildren
		(
			"containerProfileNew",
			Coords.create(), // pos
			sizeBase.clone(), // size
			// children
			[
				ControlLabel.fromPosSizeTextFontCentered
				(
					Coords.fromXY(50, 35), // pos
					Coords.fromXY(100, 15), // size
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

				ControlButton.fromPosSizeTextFontClick<Profile>
				(
					Coords.fromXY(50, 80), // pos
					Coords.fromXY(45, buttonHeightBase), // size
					"Create",
					fontNameAndHeight,
					() => this.toControlProfileNew_Create(universe)
				).isEnabledSet
				(
					DataBinding.fromContextAndGet
					(
						universe.profile,
						(c: Profile) => { return c.name.length > 0; }
					),
				),

				ControlButton.fromPosSizeTextFontClick
				(
					Coords.fromXY(105, 80), // pos
					Coords.fromXY(45, buttonHeightBase), // size
					"Cancel",
					fontNameAndHeight,
					cancel
				),
			]
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}

	static toControlProfileNew_Create(universe: Universe): void
	{
		var venueControls = universe.venueCurrent() as VenueControls;
		var controlRootAsContainer = venueControls.controlRoot as ControlContainer;
		var textBoxName =
			controlRootAsContainer.childByName("textBoxName") as ControlTextBox<any>;
		var profileName = textBoxName.text();
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

		universe.profileSet(profile);
		var venueNext: Venue = Profile.toControlSaveStateLoad
		(
			universe, null, universe.venueCurrent()
		).toVenue();
		universe.venueTransitionTo(venueNext);
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
		var profileNames =
			storageHelper.load(Profile.StorageKeyProfileNames) as Array<string>;
		if (profileNames == null)
		{
			profileNames = [];
			storageHelper.save(Profile.StorageKeyProfileNames, profileNames);
		}
		var profiles =
			profileNames.map(x => storageHelper.load<Profile>(x));

		var labelSelectAProfile = ControlLabel.fromPosSizeTextFontCentered
		(
			Coords.fromXY(30, 35), // pos
			Coords.fromXY(140, 15), // size
			DataBinding.fromContext("Select a Profile:"),
			fontNameAndHeight
		);

		var listProfiles = new ControlList<Universe, Profile, string>
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
			DataBinding.fromContextGetAndSet
			(
				universe,
				(c: Universe) => c.profile,
				(c: Universe, v: Profile) => c.profileSet(v)
			), // bindingForOptionSelected
			DataBinding.fromGet( (c: Profile) => c.name ), // value
			null, // bindingForIsEnabled
			() => this.toControlProfileSelect_Select(universe), // confirm
			null // widthInItems
		);

		var buttonNew = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY(30, 95), // pos
			Coords.fromXY(35, buttonHeightBase), // size
			"New",
			fontNameAndHeight,
			() => this.toControlProfileSelect_Create(universe)
		);

		var buttonSelect = ControlButton.fromPosSizeTextFontClick<Universe>
		(
			Coords.fromXY(70, 95), // pos
			Coords.fromXY(35, buttonHeightBase), // size
			"Select",
			fontNameAndHeight,
			() => this.toControlProfileSelect_Select(universe)
		).isEnabledSet
		(
			DataBinding.fromContextAndGet
			(
				universe,
				(c: Universe) => { return (c.profile != null); }
			)
		);

		var buttonSkip = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY(110, 95), // pos
			Coords.fromXY(35, buttonHeightBase), // size
			"Skip",
			fontNameAndHeight,
			() => this.toControlProfileSelect_Skip(universe)
		);

		var buttonDelete = ControlButton.fromPosSizeTextFontClick<Universe>
		(
			Coords.fromXY(150, 95), // pos
			Coords.fromXY(20, buttonHeightBase), // size
			"X",
			fontNameAndHeight,
			() => this.toControlProfileSelect_DeleteProfile(universe, size) // click
		).isEnabledSet
		(
			DataBinding.fromContextAndGet
			(
				universe,
				(c: Universe) => { return (c.profile != null); }
			)
		);

		var buttonBack = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY
			(
				sizeBase.x - 10 - 25,
				sizeBase.y - 10 - 20
			), // pos
			Coords.fromXY(25, 20), // size
			"Back",
			fontNameAndHeight,
			() => // click
			{
				universe.venueTransitionTo(venuePrev);
			}
		);

		var returnValue = ControlContainer.fromNamePosSizeAndChildren
		(
			"containerProfileSelect",
			Coords.create(), // pos
			sizeBase.clone(), // size
			// children
			[
				labelSelectAProfile,
				listProfiles,
				buttonNew,
				buttonSelect,
				buttonSkip,
				buttonDelete,
				buttonBack
			]
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}

	static toControlProfileSelect_Create(universe: Universe): void
	{
		var profile = Profile.blank();
		universe.profileSet(profile);
		var venueNext = Profile.toControlProfileNew(universe, null).toVenue();
		universe.venueTransitionTo(venueNext);
	}

	static toControlProfileSelect_DeleteProfile(universe: Universe, size: Coords): void
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
				universe.venueCurrent(),
				() => this.toControlProfileSelect_DeleteProfile_Confirm(universe),
				null // cancel
			);

			var venueNext = controlConfirm.toVenue();
			universe.venueTransitionTo(venueNext);
		}
	};

	static toControlProfileSelect_DeleteProfile_Confirm(universe: Universe): void
	{
		var profileSelected = universe.profile;

		var storageHelper = universe.storageHelper;
		storageHelper.delete(profileSelected.name);
		var profileNames =
			storageHelper.load<string[]>(Profile.StorageKeyProfileNames);
		ArrayHelper.remove(profileNames, profileSelected.name);
		storageHelper.save(Profile.StorageKeyProfileNames, profileNames);
	}

	static toControlProfileSelect_Select(universe: Universe): void
	{
		var venueControls =
			universe.venueCurrent() as VenueControls;
		var controlRootAsContainer =
			venueControls.controlRoot as ControlContainer;
		var listProfiles =
			controlRootAsContainer.childByName("listProfiles") as ControlList<Universe, Profile, string>;
		var profileSelected = listProfiles.itemSelected();
		universe.profileSet(profileSelected);
		if (profileSelected != null)
		{
			var venueNext = Profile.toControlSaveStateLoad
			(
				universe, null, universe.venueCurrent()
			).toVenue();
			universe.venueTransitionTo(venueNext);
		}
	}

	static toControlProfileSelect_Skip(universe: Universe): void
	{
		var profile = Profile.anonymous();
		universe.profileSet(profile);
		var venueNext = universe.worldCreator.toVenue(universe);
		universe.venueTransitionTo(venueNext)
	}

}

}
