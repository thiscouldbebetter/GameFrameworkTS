
function Serializer()
{
	// do nothing
}
{
	Serializer.prototype.deserialize = function(stringToDeserialize)
	{
		var nodeRoot = JSON.parse(stringToDeserialize);
		nodeRoot.__proto__ = SerializerNode.prototype;
		nodeRoot.processAfterDeserialization();
		var returnValue = nodeRoot.toObjectWrapped([]);

		return returnValue;
	}

	Serializer.prototype.serialize = function(objectToSerialize)
	{
		var nodeRoot = new SerializerNode(objectToSerialize);

		nodeRoot.prepareForSerialization([], []);

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
	SerializerNode.prototype.prepareForSerialization = function
	(
		objectsAlreadyWrapped, objectIndexToNodeLookup
	)
	{
		if (this.objectWrapped != null)
		{
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

				var typeName = this.objectWrapped.constructor.name;
				this.objectWrappedTypeName = typeName;
	
				if (typeName == "Function")
				{
					this.objectWrapped = this.objectWrapped.toString();
				}
				else if 
				(
					typeName == "Boolean"
					|| typeName == "Number"
					|| typeName == "String"
				)
				{
					// Primitive types.  
					delete this.isReference;
				}
				else
				{
					this.children = {};
	
					for (var propertyName in this.objectWrapped)
					{
						if (this.objectWrapped.__proto__[propertyName] == null)
						{
							var propertyValue = this.objectWrapped[propertyName];
					
							var child = new SerializerNode
							(
								propertyValue // objectWrapped
							);

							this.children[propertyName] = child;
						}
					}

					delete this.objectWrapped;

					for (var childName in this.children)
					{
						var child = this.children[childName];
						child.prepareForSerialization
						(
							objectsAlreadyWrapped,
							objectIndexToNodeLookup
						);
					}
				}
			}

		} // end if objectWrapped != null

		return this;		

	} // end method

	SerializerNode.prototype.processAfterDeserialization = function(serializer)
	{
		if (this.children != null)
		{
			for (var childName in this.children)
			{
				var child = this.children[childName];
				child.__proto__ = SerializerNode.prototype;
				child.processAfterDeserialization(serializer);
			}
		}
	}

	SerializerNode.prototype.toObjectWrapped = function(nodesAlreadyProcessed)
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
					var childAsObjectWrapped = child.toObjectWrapped
					(
						nodesAlreadyProcessed
					);
					this.objectWrapped[childName] = childAsObjectWrapped;
				}
			}

		}

		return this.objectWrapped;
	}
}