
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
	// internal classes
	
	function _ArrayWrapper(arrayToWrap)
	{
		this.arrayWrapped = arrayToWrap;
	}
	
	function _FunctionWrapper(functionBody)
	{
		this.functionBody = functionBody;
	}
	
	// methods
	
	Serializer.prototype.deserialize = function(stringToDeserialize)
	{
		var objectDeserialized = JSON.parse(stringToDeserialize);
		this.unwrapArraysRecursively(objectDeserialized);
		this.unwrapFunctionsRecursively(objectDeserialized);
		this.setPrototypeRecursively(objectDeserialized);
		this.deleteClassNameRecursively(objectDeserialized);

		return objectDeserialized;
	}

	Serializer.prototype.serialize = function(objectToSerialize)
	{
		this.wrapFunctionsRecursively(objectToSerialize);
		this.wrapArraysRecursively(objectToSerialize);		
		this.setClassNameRecursively(objectToSerialize);
		var returnValue = JSON.stringify(objectToSerialize);
		this.unwrapArraysRecursively(objectToSerialize);		
		this.unwrapFunctionsRecursively(objectToSerialize);
		this.deleteClassNameRecursively(objectToSerialize);

		return returnValue;
	}
	
	// class names
	
	Serializer.prototype.deleteClassNameRecursively = function(objectToDeleteClassNameOn)
	{
		if (objectToDeleteClassNameOn == null)
		{
			return; //throw "Unrecognized type!"
		}
		
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
			delete objectToDeleteClassNameOn.className;
			for (var i = 0; i < objectToDeleteClassNameOn.length; i++)
			{
				var element = objectToDeleteClassNameOn[i];
				this.deleteClassNameRecursively(element);
			}
		}
	}
	
	Serializer.prototype.setClassNameRecursively = function(objectToSetClassNameOn)
	{
		if (objectToSetClassNameOn == null)
		{
			return; // throw "Unrecognized type!"
		}
		var className = objectToSetClassNameOn.constructor.name;
		
		if (this.knownTypes[className] != null)
		{
			objectToSetClassNameOn.className = className;

			for (var childPropertyName in objectToSetClassNameOn)
			{
				var childProperty = objectToSetClassNameOn[childPropertyName];
				this.setClassNameRecursively(childProperty);
			}
		}
		else if (className == "Array")
		{
			for (var i = 0; i < objectToSetClassNameOn.length; i++)
			{
				var element = objectToSetClassNameOn[i];
				this.setClassNameRecursively(element);
			}
		}
		else if (className == "_ArrayWrapper")
		{
			objectToSetClassNameOn.className = className;

			var arrayWrapped = objectToSetClassNameOn.arrayWrapped;
			this.setClassNameRecursively(arrayWrapped);
		}
	}
	
	// prototypes
	
	Serializer.prototype.setPrototypeRecursively = function(objectToSetPrototypeOn)
	{
		if (objectToSetPrototypeOn == null)
		{
			return; // throw "Unrecognized type!"
		}
	
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

	// functions
	
	Serializer.prototype.unwrapFunctionsRecursively = function(objectToUnwrapFunctionsOn)
	{
		if (objectToUnwrapFunctionsOn == null)
		{
			return;
		}
				
		var className = objectToUnwrapFunctionsOn.className;
				
		if (this.knownTypes[className] != null)
		{
			for (var childPropertyName in objectToUnwrapFunctionsOn)
			{
				var childProperty = objectToUnwrapFunctionsOn[childPropertyName];
				if (childProperty != null)
				{
					var childPropertyIsFunctionWrapped = 
						(childProperty.className == "_FunctionWrapper");
						
					if (childPropertyIsFunctionWrapped == true)
					{
						var functionBodyAsString = "(" + childProperty.functionBody + ")";
						delete childProperty.functionBody;
						var functionBodyAsFunction = eval(functionBodyAsString);
						functionBodyAsFunction.__proto__ = Function.prototype;

						objectToUnwrapFunctionsOn[childPropertyName] = functionBodyAsFunction;
					}
					else
					{
						this.unwrapFunctionsRecursively(childProperty);
					}
				}
			}
		}
		else if (objectToUnwrapFunctionsOn.constructor.name == "Array")
		{
			for (var i = 0; i < objectToUnwrapFunctionsOn.length; i++)
			{
				var element = objectToUnwrapFunctionsOn[i];
				this.unwrapFunctionsRecursively(element);
			}
		}
	}
	
	Serializer.prototype.wrapFunctionsRecursively = function(objectToWrapFunctionsOn)
	{
		var className = objectToWrapFunctionsOn.constructor.name;
		if (this.knownTypes[className] != null)
		{
			for (var childPropertyName in objectToWrapFunctionsOn)
			{
				var childProperty = objectToWrapFunctionsOn[childPropertyName];
				if (childProperty != null)
				{
					if (childProperty.constructor.name == "Function")
					{
						if (objectToWrapFunctionsOn.__proto__[childPropertyName] == null)
						{
							childProperty = new _FunctionWrapper
							(
								childProperty.toString()
							);
							objectToWrapFunctionsOn[childPropertyName] = childProperty;
						}
					}
					else
					{
						this.wrapFunctionsRecursively(childProperty);
					}
				}
			}
		}
		else if (className == "Array")
		{
			for (var i = 0; i < objectToWrapFunctionsOn.length; i++)
			{
				var element = objectToWrapFunctionsOn[i];
				this.wrapFunctionsRecursively(element);
			}
		}
	}
	
	// arrays
	
	Serializer.prototype.unwrapArraysRecursively = function(objectToUnwrapArraysOn)
	{
		if (objectToUnwrapArraysOn == null)
		{
			return;
		}
				
		var className = objectToUnwrapArraysOn.className;
				
		if (this.knownTypes[className] != null)
		{
			for (var childPropertyName in objectToUnwrapArraysOn)
			{
				var childProperty = objectToUnwrapArraysOn[childPropertyName];
				if (childProperty != null)
				{
					var childPropertyIsArrayWrapped = 
						(childProperty.className == "_ArrayWrapper");
						
					if (childPropertyIsArrayWrapped == true)
					{
						var wrapper = childProperty;
						var arrayWrapped = wrapper.arrayWrapped;
						delete wrapper.arrayWrapped;
						for (var grandchildPropertyName in wrapper)
						{
							var grandchildProperty = wrapper[grandchildPropertyName];
							arrayWrapped[grandchildPropertyName] = grandchildProperty; 
							
						}
						
						childProperty = arrayWrapped;
						objectToUnwrapArraysOn[childPropertyName] = childProperty;
					}

					this.unwrapArraysRecursively(childProperty);
				}
			}
		}
		else if (objectToUnwrapArraysOn.constructor.name == "Array")
		{
			for (var i = 0; i < objectToUnwrapArraysOn.length; i++)
			{
				var element = objectToUnwrapArraysOn[i];
				this.unwrapArraysRecursively(element);
			}
		}
	}
		
	Serializer.prototype.wrapArraysRecursively = function(objectToWrapArraysOn)
	{
		var className = objectToWrapArraysOn.constructor.name;
		if (this.knownTypes[className] != null)
		{
			for (var childPropertyName in objectToWrapArraysOn)
			{
				var childProperty = objectToWrapArraysOn[childPropertyName];
				if (childProperty != null)
				{
					if (childProperty.constructor.name == "Array")
					{
						var arrayWrapped = childProperty;

						var wrapper = new _ArrayWrapper(arrayWrapped);
						
						objectToWrapArraysOn[childPropertyName] = wrapper;						
						
						for (var grandchildPropertyName in arrayWrapped)
						{
							if (arrayWrapped.__proto__[grandchildPropertyName] == null)
							{
								var grandchildProperty = arrayWrapped[grandchildPropertyName];
								wrapper[grandchildPropertyName] = grandchildProperty;
							}
						}
						
						this.wrapArraysRecursively(arrayWrapped);
					}
					else
					{
						this.wrapArraysRecursively(childProperty);
					}
				}
			}
		}
		else if (className == "Array")
		{
			for (var i = 0; i < objectToWrapArraysOn.length; i++)
			{
				var element = objectToWrapArraysOn[i];
				this.wrapArraysRecursively(element);
			}
		}
	}

} // end class Serializer
