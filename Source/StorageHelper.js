
function StorageHelper(propertyNamePrefix, serializer)
{
	this.propertyNamePrefix = propertyNamePrefix;
	if (this.propertyNamePrefix == null)
	{
		this.propertyNamePrefix = ""; 
	}

	this.serializer = serializer;
}
{
	StorageHelper.prototype.load = function(propertyName)
	{
		var returnValue;

		var propertyNamePrefixed = 
			this.propertyNamePrefix + propertyName;

		var returnValueAsString = localStorage.getItem
		(
			propertyNamePrefixed
		);

		if (returnValueAsString == null)
		{
			returnValue = null;
		}
		else
		{
			returnValue = this.serializer.deserialize
			(
				returnValueAsString
			);
		}

		return returnValue;
	}

	StorageHelper.prototype.save = function(propertyName, valueToSave)
	{
		var valueToSaveSerialized = this.serializer.serialize
		(
			valueToSave
		);

		var propertyNamePrefixed = 
			this.propertyNamePrefix + propertyName;

		localStorage.setItem
		(
			propertyNamePrefixed, 
			valueToSaveSerialized
		);
	}
}
