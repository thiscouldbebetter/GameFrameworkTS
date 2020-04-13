
class PlaceDefn
{
	constructor(name, actions, actionToInputsMappings)
	{
		this.name = name;
		this.actions = actions.addLookupsByName();
		this.actionToInputsMappingsDefault = actionToInputsMappings;
		this.actionToInputsMappings = this.actionToInputsMappingsDefault.clone();
		this.actionToInputsMappingsEdited = this.actionToInputsMappings.clone();

		this.actionToInputsMappings.addLookupsMultiple(x => x.inputNames);
	}

	actionToInputsMappingsEdit()
	{
		this.actionToInputsMappingsEdited.overwriteWith
		(
			this.actionToInputsMappings
		).clearLookups();

		this.actionToInputsMappingSelected = null;
	};

	actionToInputsMappingsRestoreDefaults()
	{
		this.actionToInputsMappingsEdited.overwriteWith
		(
			this.actionToInputsMappingsDefault
		);
	};

	actionToInputsMappingsSave()
	{
		this.actionToInputsMappings =
			this.actionToInputsMappingsEdited.clone().addLookupsMultiple
			(
				x => x.inputNames
			);
	};
}
