
namespace ThisCouldBeBetter.GameFramework
{

export class PlaceDefn
{
	name: string;
	actions: Action[];
	actionsByName: any;
	actionToInputsMappings: ActionToInputsMapping[];
	propertyNamesToProcess: string[];
	_placeInitialize: (universe: Universe, world: World, place: Place) => void;
	_placeFinalize: (universe: Universe, world: World, place: Place) => void;

	actionToInputsMappingsByInputName: any;
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

	actionToInputsMappingsEdit()
	{
		ArrayHelper.overwriteWith
		(
			this.actionToInputsMappingsEdited,
			this.actionToInputsMappings
		);

		this.actionToInputsMappingSelected = null;
	}

	actionToInputsMappingsRestoreDefaults()
	{
		ArrayHelper.overwriteWith
		(
			this.actionToInputsMappingsEdited,
			this.actionToInputsMappingsDefault
		);
	}

	actionToInputsMappingsSave()
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

	placeFinalize(universe: Universe, world: World, place: Place)
	{
		if (this._placeFinalize != null)
		{
			this._placeFinalize(universe, world, place);
		}
	}

	placeInitialize(universe: Universe, world: World, place: Place)
	{
		if (this._placeInitialize != null)
		{
			this._placeInitialize(universe, world, place);
		}
	}
}

}
