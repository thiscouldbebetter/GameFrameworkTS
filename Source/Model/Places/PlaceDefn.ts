
namespace ThisCouldBeBetter.GameFramework
{

export class PlaceDefn
{
	name: string;
	actions: Action[];
	actionsByName: Map<string,Action>;
	actionToInputsMappings: ActionToInputsMapping[];
	propertyNamesToProcess: string[];
	_placeInitialize: (universe: Universe, world: World, place: Place) => void;
	_placeFinalize: (universe: Universe, world: World, place: Place) => void;

	actionToInputsMappingsByInputName: Map<string,ActionToInputsMapping>;
	actionToInputsMappingSelected: ActionToInputsMapping;
	actionToInputsMappingsDefault: ActionToInputsMapping[];
	actionToInputsMappingsEdited: ActionToInputsMapping[];

	constructor
	(
		name: string,
		actions: Action[],
		actionToInputsMappings: ActionToInputsMapping[],
		propertyNamesToProcess: string[],
		placeInitialize: (universe: Universe, world: World, place: Place) => void,
		placeFinalize: (universe: Universe, world: World, place: Place) => void
	)
	{
		this.name = name;
		this.actions = actions;
		this.actionsByName = ArrayHelper.addLookupsByName(this.actions);
		this.actionToInputsMappingsDefault = actionToInputsMappings;
		this.propertyNamesToProcess = propertyNamesToProcess;
		this._placeInitialize = placeInitialize;
		this._placeFinalize = placeFinalize;

		this.actionToInputsMappings = ArrayHelper.clone(this.actionToInputsMappingsDefault);
		this.actionToInputsMappingsEdited = ArrayHelper.clone(this.actionToInputsMappings);

		this.actionToInputsMappingsByInputName = ArrayHelper.addLookupsMultiple
		(
			this.actionToInputsMappings, (x: ActionToInputsMapping) => x.inputNames
		);
	}

	static default(): PlaceDefn
	{
		return new PlaceDefn
		(
			"Default", // name,
			[], // actions,
			[], // actionToInputsMappings,
			[], // propertyNamesToProcess,
			null, // placeInitialize
			null // placeFinalize
		);
	}

	static from4
	(
		name: string,
		actions: Action[],
		actionToInputsMappings: ActionToInputsMapping[],
		propertyNamesToProcess: string[]
	): PlaceDefn
	{
		return new PlaceDefn
		(
			name, actions, actionToInputsMappings, propertyNamesToProcess,
			null, null // placeInitialize, placeFinalize
		);
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

	placeFinalize(universe: Universe, world: World, place: Place): void
	{
		if (this._placeFinalize != null)
		{
			this._placeFinalize(universe, world, place);
		}
	}

	placeInitialize(universe: Universe, world: World, place: Place): void
	{
		if (this._placeInitialize != null)
		{
			this._placeInitialize(universe, world, place);
		}
	}
}

}
