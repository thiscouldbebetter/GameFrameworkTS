
function PlaceDefn(name, actions, inputToActionMappings)
{
	this.name = name;
	this.actions = actions.addLookupsByName();
	this.inputToActionMappingsDefault = inputToActionMappings;
	this.inputToActionMappings = this.inputToActionMappingsDefault.clone();
	this.inputToActionMappingsRestoreDefaults();
}

{
	PlaceDefn.prototype.inputToActionMappingsRestoreDefaults = function()
	{
		this.inputToActionMappings.overwriteWith
		(
			this.inputToActionMappingsDefault
		).addLookups
		(
			function(x) { return x.inputName; }
		);

		this._inputToActionMappingSelected = this.inputToActionMappings[0];
	};
}
