
function PlaceDefn(name, actions, actionToInputsMappings)
{
	this.name = name;
	this.actions = actions.addLookupsByName();
	this.actionToInputsMappingsDefault = actionToInputsMappings;
	this.actionToInputsMappings = this.actionToInputsMappingsDefault.clone();
	this.actionToInputsMappingsEdited = this.actionToInputsMappings.clone();

	ActionToInputsMapping.addLookupsByInputNames(this.actionToInputsMappings);
}

{
	PlaceDefn.prototype.actionToInputsMappingsEdit = function()
	{
		this.actionToInputsMappingsEdited.overwriteWith
		(
			this.actionToInputsMappings
		).clearLookups();

		this.actionToInputsMappingSelected = null;
	};

	PlaceDefn.prototype.actionToInputsMappingsRestoreDefaults = function()
	{
		this.actionToInputsMappingsEdited.overwriteWith
		(
			this.actionToInputsMappingsDefault
		);
	};

	PlaceDefn.prototype.actionToInputsMappingsSave = function()
	{
		this.actionToInputsMappings = ActionToInputsMapping.addLookupsByInputNames
		(
			this.actionToInputsMappingsEdited.clone()
		);
	};
}
