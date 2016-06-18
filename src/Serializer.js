
function Serializer(knownTypes)
{
	this.knownTypes = knownTypes;

	for (var i = 0; i < this.knownTypes.length; i++)
	{
		var knownType = this.knownTypes[i];
		this.knownTypes[knownType.name] = knownType;
	}
}

{
	Serializer.prototype.deleteClassNameRecursively = function(objectToDeleteClassNameOn)
	{
		var className = objectToDeleteClassNameOn.constructor.name;
		if (this.knownTypes[className] != null)
		{
			delete objectToDeleteClassNameOn.className;

			for (var childPropertyName in objectToDeleteClassNameOn)
			{
				var childProperty = objectToDeleteClassNameOn[childPropertyName];
				this.deleteClassNameRecursively(childProperty);
			}
		}
		else if (className == "Array")
		{
			for (var i = 0; i < objectToDeleteClassNameOn.length; i++)
			{
				var element = objectToDeleteClassNameOn[i];
				this.deleteClassNameRecursively(element);
			}
		}
	}

	Serializer.prototype.deserialize = function(stringToDeserialize)
	{
		var objectDeserialized = JSON.parse(stringToDeserialize);

		this.setPrototypeRecursively(objectDeserialized);

		this.deleteClassNameRecursively(objectDeserialized);

		return objectDeserialized;
	}

	Serializer.prototype.serialize = function(objectToSerialize)
	{
		this.setClassNameRecursively(objectToSerialize);

		var returnValue = JSON.stringify(objectToSerialize);

		this.deleteClassNameRecursively(objectToSerialize);

		return returnValue;
	}

	Serializer.prototype.setClassNameRecursively = function(objectToSetClassNameOn)
	{
		var className = objectToSetClassNameOn.constructor.name;
		
		if (this.knownTypes[className] != null)
		{
			for (var childPropertyName in objectToSetClassNameOn)
			{
				var childProperty = objectToSetClassNameOn[childPropertyName];
				this.setClassNameRecursively(childProperty);
			}

			objectToSetClassNameOn.className = className;
		}
		else if (className == "Array")
		{
			for (var i = 0; i < objectToSetClassNameOn.length; i++)
			{
				var element = objectToSetClassNameOn[i];
				this.setClassNameRecursively(element);
			}
		}
	}

	Serializer.prototype.setPrototypeRecursively = function(objectToSetPrototypeOn)
	{
		var className = objectToSetPrototypeOn.className;
		var typeOfObjectToSetPrototypeOn = this.knownTypes[className];

		if (typeOfObjectToSetPrototypeOn != null)
		{
			objectToSetPrototypeOn.__proto__ = typeOfObjectToSetPrototypeOn.prototype;
	
			for (var childPropertyName in objectToSetPrototypeOn)
			{
				var childProperty = objectToSetPrototypeOn[childPropertyName];
				this.setPrototypeRecursively(childProperty);
			}
		}
		else if (objectToSetPrototypeOn.constructor.name == "Array")
		{
			for (var i = 0; i < objectToSetPrototypeOn.length; i++)
			{
				var element = objectToSetPrototypeOn[i];
				this.setPrototypeRecursively(element);
			}
		}
	}
}
