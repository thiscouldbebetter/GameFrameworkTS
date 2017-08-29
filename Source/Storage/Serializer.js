
function Serializer()
{
	// do nothing
}
{
	Serializer.prototype.deserialize = function(stringToDeserialize)
	{
		var nodeRoot = JSON.parse(stringToDeserialize);
		nodeRoot.__proto__ = SerializerNode.prototype;
		nodeRoot.prototypesAssign();
		var returnValue = nodeRoot.unwrap([]);

		return returnValue;
	}

	Serializer.prototype.serialize = function(objectToSerialize)
	{
		var nodeRoot = new SerializerNode(objectToSerialize);

		nodeRoot.wrap([], []);

		var nodeRootSerialized = JSON.stringify
		(
			nodeRoot,
			null, // ?
			4 // pretty-print indent size
		);

		return nodeRootSerialized;
	}
}

function SerializerNode(objectWrapped)
{
	this.objectWrappedTypeName = null;
	this.id = null;
	this.isReference = null;

	this.objectWrapped = objectWrapped;
}
{
	SerializerNode.prototype.wrap = function
	(
		objectsAlreadyWrapped, objectIndexToNodeLookup
	)
	{
		if (this.objectWrapped != null)
		{
			var typeName = this.objectWrapped.constructor.name;

			var objectIndexExisting =
				objectsAlreadyWrapped.indexOf(this.objectWrapped);

			if (objectIndexExisting >= 0)
			{
				var nodeForObjectExisting = objectIndexToNodeLookup[objectIndexExisting];
				this.id = nodeForObjectExisting.id;
				this.isReference = true;
				this.objectWrapped = null;
			}
			else
			{
				this.isReference = false;
				var objectIndex = objectsAlreadyWrapped.length;
				this.id = objectIndex;
				objectsAlreadyWrapped.push(this.objectWrapped);
				objectIndexToNodeLookup[objectIndex] = this;

				this.objectWrappedTypeName = typeName;

				if (typeName == "Function")
				{
					this.objectWrapped = this.objectWrapped.toString();
				}
				else
				{
					this.children = {};

					for (var propertyName in this.objectWrapped)
					{
						if (this.objectWrapped.__proto__[propertyName] == null)
						{
							var propertyValue = this.objectWrapped[propertyName];

							if (propertyValue == null)
							{
								child = null;
							}
							else
							{
								var propertyValueTypeName = propertyValue.constructor.name;

								if
								(
									propertyValueTypeName == "Boolean"
									|| propertyValueTypeName == "Number"
									|| propertyValueTypeName == "String"
								)
								{
									child = propertyValue;
								}
								else
								{
									child = new SerializerNode
									(
										propertyValue
									);
								}

							}

							this.children[propertyName] = child;
						}
					}

					delete this.objectWrapped;

					for (var childName in this.children)
					{
						var child = this.children[childName];
						if (child != null)
						{
							var childTypeName = child.constructor.name;
							if (childTypeName == "SerializerNode")
							{
								child.wrap
								(
									objectsAlreadyWrapped,
									objectIndexToNodeLookup
								);
							}
						}
					}
				}
			}

		} // end if objectWrapped != null

		return this;

	} // end method

	SerializerNode.prototype.prototypesAssign = function()
	{
		if (this.children != null)
		{
			for (var childName in this.children)
			{
				var child = this.children[childName];
				if (child != null)
				{
					var childTypeName = child.constructor.name;
					if (childTypeName == "Object")
					{
						child.__proto__ = SerializerNode.prototype;
						child.prototypesAssign();
					}
				}
			}
		}
	}

	SerializerNode.prototype.unwrap = function(nodesAlreadyProcessed)
	{
		if (this.isReference == true)
		{
			var nodeExisting = nodesAlreadyProcessed[this.id];
			this.objectWrapped = nodeExisting.objectWrapped;
		}
		else
		{
			nodesAlreadyProcessed[this.id] = this;
			var typeName = this.objectWrappedTypeName;
			if (typeName == null)
			{
				// Value is null.  Do nothing.
			}
			else if (typeName == "Array")
			{
				this.objectWrapped = [];
			}
			else if (typeName == "Function")
			{
				this.objectWrapped = eval("(" + this.objectWrapped + ")");
			}
			else if
			(
				typeName == "Boolean"
				|| typeName == "Number"
				|| typeName == "String"
			)
			{
				// Primitive types. Do nothing.
			}
			else
			{
				this.objectWrapped = {};
				var objectWrappedType = eval("(" + typeName + ")");
				this.objectWrapped.__proto__ = objectWrappedType.prototype;
			}

			if (this.children != null)
			{
				for (var childName in this.children)
				{
					var child = this.children[childName];

					if (child != null)
					{
						if (child.constructor.name == "SerializerNode")
						{
							child = child.unwrap
							(
								nodesAlreadyProcessed
							);
						}
					}

					this.objectWrapped[childName] = child;
				}
			}

		}

		return this.objectWrapped;
	}
}