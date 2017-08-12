
function StorageHelper()
{}
{
	StorageHelper.load = function(propertyName)
	{
		var returnValue;

		var returnValueAsString = localStorage.getItem
		(
			propertyName
		);

		if (returnValueAsString == null)
		{
			returnValue = null;
		}
		else
		{
			returnValue = Globals.Instance.serializer.deserialize
			(
				returnValueAsString
			);
		}

		return returnValue;
	}

	StorageHelper.save = function(propertyName, valueToSave)
	{
		var valueToSaveSerialized = Globals.Instance.serializer.serialize
		(
			valueToSave
		);

		localStorage.setItem
		(
			propertyName, 
			valueToSaveSerialized
		);
	}
}
