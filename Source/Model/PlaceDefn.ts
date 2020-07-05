
class PlaceDefn
{
	name: string;
	actions: Action[];
	actionsByName: any;
	actionToInputsMappings: ActionToInputsMapping[];
	actionToInputsMappingsByInputName: any;

	actionToInputsMappingSelected: ActionToInputsMapping;
	actionToInputsMappingsDefault: ActionToInputsMapping[];
	actionToInputsMappingsEdited: ActionToInputsMapping[];

	constructor(name, actions, actionToInputsMappings)
	{
		this.name = name;
		this.actions = actions;
		this.actionsByName = ArrayHelper.addLookupsByName(this.actions);
		this.actionToInputsMappingsDefault = actionToInputsMappings;
		this.actionToInputsMappings = ArrayHelper.clone(this.actionToInputsMappingsDefault);
		this.actionToInputsMappingsEdited = ArrayHelper.clone(this.actionToInputsMappings);

		this.actionToInputsMappingsByInputName = ArrayHelper.addLookupsMultiple
		(
			this.actionToInputsMappings, x => x.inputNames
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
	};

	actionToInputsMappingsRestoreDefaults()
	{
		ArrayHelper.overwriteWith
		(
			this.actionToInputsMappingsEdited,
			this.actionToInputsMappingsDefault
		);
	};

	actionToInputsMappingsSave()
	{
		this.actionToInputsMappings = ArrayHelper.clone
		(
			this.actionToInputsMappingsEdited
		);
		this.actionToInputsMappingsByInputName = ArrayHelper.addLookupsMultiple
		(
			this.actionToInputsMappings, x => x.inputNames
		);
	};
}
