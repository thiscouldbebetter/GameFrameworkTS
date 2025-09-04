
namespace ThisCouldBeBetter.GameFramework
{

export class PlaceDefn
{
	name: string;
	soundForMusicName: string;
	actions: Action[];
	actionsByName: Map<string,Action>;
	actionToInputsMappings: ActionToInputsMapping[];
	propertyNamesToProcess: string[];
	_placeInitialize: (uwpe: UniverseWorldPlaceEntities) => void;
	_placeFinalize: (uwpe: UniverseWorldPlaceEntities) => void;

	actionToInputsMappingsByInputName: Map<string,ActionToInputsMapping>;
	actionToInputsMappingSelected: ActionToInputsMapping;
	actionToInputsMappingsDefault: ActionToInputsMapping[];
	actionToInputsMappingsEdited: ActionToInputsMapping[];

	constructor
	(
		name: string,
		soundForMusicName: string,
		actions: Action[],
		actionToInputsMappings: ActionToInputsMapping[],
		propertyNamesToProcess: string[],
		placeInitialize: (uwpe: UniverseWorldPlaceEntities) => void,
		placeFinalize: (uwpe: UniverseWorldPlaceEntities) => void
	)
	{
		this.name = name || PlaceDefn.name + "Default";
		this.soundForMusicName = soundForMusicName;
		this.actions = actions || [];
		this.actionToInputsMappingsDefault = actionToInputsMappings || [];
		this.propertyNamesToProcess = propertyNamesToProcess;
		this._placeInitialize = placeInitialize;
		this._placeFinalize = placeFinalize;

		this.actionsByName =
			ArrayHelper.addLookupsByName(this.actions);

		this.actionToInputsMappings =
			ArrayHelper.clone(this.actionToInputsMappingsDefault);
		this.actionToInputsMappingsEdited =
			ArrayHelper.clone(this.actionToInputsMappings);

		this.actionToInputsMappingsByInputName = ArrayHelper.addLookupsMultiple
		(
			this.actionToInputsMappings,
			(x: ActionToInputsMapping) => x.inputNames
		);
	}

	static default(): PlaceDefn
	{
		return new PlaceDefn
		(
			null, // name,
			null, // soundForMusicName
			[], // actions,
			[], // actionToInputsMappings,
			[], // propertyNamesToProcess,
			null, // placeInitialize
			null // placeFinalize
		);
	}

	static fromNameAndPropertyNamesToProcess
	(
		name: string,
		propertyNamesToProcess: string[]
	)
	{
		return new PlaceDefn
		(
			name,
			null, // soundForMusicName
			[], // actions
			[], // actionToInputsMapping,
			propertyNamesToProcess,
			null, // placeInitialize
			null // placeFinalize
		);
	}

	static fromNameMusicActionsMappingsAndPropertyNames
	(
		name: string,
		soundForMusicName: string,
		actions: Action[],
		actionToInputsMappings: ActionToInputsMapping[],
		propertyNamesToProcess: string[]
	): PlaceDefn
	{
		return new PlaceDefn
		(
			name,
			soundForMusicName,
			actions,
			actionToInputsMappings,
			propertyNamesToProcess,
			null, null // placeInitialize, placeFinalize
		);
	}

	static fromPropertyNamesToProcess
	(
		propertyNamesToProcess: string[]
	)
	{
		return PlaceDefn.fromNameAndPropertyNamesToProcess(PlaceDefn.name, propertyNamesToProcess);
	}

	actionToInputsMappingsEdit(): void
	{
		ArrayHelper.overwriteWith
		(
			this.actionToInputsMappingsEdited,
			this.actionToInputsMappings
		);

		this.actionToInputsMappingSelected = null;
	}

	actionToInputsMappingsRestoreDefaults(): void
	{
		ArrayHelper.overwriteWith
		(
			this.actionToInputsMappingsEdited,
			this.actionToInputsMappingsDefault
		);
	}

	actionToInputsMappingsSave(): void
	{
		this.actionToInputsMappings = ArrayHelper.clone
		(
			this.actionToInputsMappingsEdited
		);
		this.actionToInputsMappingsByInputName = ArrayHelper.addLookupsMultiple
		(
			this.actionToInputsMappings, (x: ActionToInputsMapping) => x.inputNames
		);
	}

	placeFinalize(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this._placeFinalize != null)
		{
			this._placeFinalize(uwpe);
		}
	}

	placeInitialize(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this.soundForMusicName != null)
		{
			var universe = uwpe.universe;
			var soundHelper = universe.soundHelper;
			var soundPlaybackForMusicAlreadyPlaying = soundHelper.soundPlaybackForMusic;
			if
			(
				soundPlaybackForMusicAlreadyPlaying != null
				&& soundPlaybackForMusicAlreadyPlaying.sound.name != this.soundForMusicName
			)
			{
				soundPlaybackForMusicAlreadyPlaying.stop(uwpe);
				var mediaLibrary = universe.mediaLibrary;
				var sound = mediaLibrary.soundGetByName(this.soundForMusicName);
				var soundPlayback =
					SoundPlayback
						.fromSound(sound)
						.volumeAsFractionSet(universe.soundHelper.effectVolume);
				soundPlayback.startIfNotStartedYet(uwpe);
			}
		}

		if (this._placeInitialize != null)
		{
			this._placeInitialize(uwpe);
		}
	}
}

}
