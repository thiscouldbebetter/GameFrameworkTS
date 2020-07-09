
class StorageHelper
{
	propertyNamePrefix: string;
	serializer: Serializer;

	constructor(propertyNamePrefix: string, serializer: Serializer)
	{
		this.propertyNamePrefix = propertyNamePrefix;
		if (this.propertyNamePrefix == null)
		{
			this.propertyNamePrefix = "";
		}

		this.serializer = serializer;
	}

	load(propertyName: string)
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

	save(propertyName: string, valueToSave: any)
	{
		var valueToSaveSerialized = this.serializer.serialize
		(
			valueToSave, false // pretty-print
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
