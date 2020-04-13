
class StorageHelper
{
	constructor(propertyNamePrefix, serializer)
	{
		this.propertyNamePrefix = propertyNamePrefix;
		if (this.propertyNamePrefix == null)
		{
			this.propertyNamePrefix = "";
		}

		this.serializer = serializer;
	}

	load(propertyName)
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
	};

	save(propertyName, valueToSave)
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
	};
}
