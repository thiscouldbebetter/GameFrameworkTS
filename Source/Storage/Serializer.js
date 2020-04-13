
class Serializer
{
	deserialize(stringToDeserialize)
	{
		var nodeRoot = JSON.parse(stringToDeserialize);
		nodeRoot.__proto__ = SerializerNode.prototype;
		nodeRoot.prototypesAssign();
		var returnValue = nodeRoot.unwrap([]);

		return returnValue;
	};

	serialize(objectToSerialize, prettyPrint)
	{
		var nodeRoot = new SerializerNode(objectToSerialize);

		nodeRoot.wrap([], []);

		var nodeRootSerialized = JSON.stringify
		(
			nodeRoot,
			null, // ?
			(prettyPrint == true ? 4 : null) // pretty-print indent size
		);

		return nodeRootSerialized;
	};
}

class SerializerNode
{
	constructor(objectWrapped)
	{
		this.t = null; // objectWrappedTypeName
		this.id = null; // id
		this.r = null; // isReference

		this.o = objectWrapped;
	}

	wrap
	(
		objectsAlreadyWrapped, objectIndexToNodeLookup
	)
	{
		var objectWrapped = this.o;
		if (objectWrapped != null)
		{
			var typeName = objectWrapped.constructor.name;

			var objectIndexExisting =
				objectsAlreadyWrapped.indexOf(objectWrapped);

			if (objectIndexExisting >= 0)
			{
				var nodeForObjectExisting = objectIndexToNodeLookup[objectIndexExisting];
				this.id = nodeForObjectExisting.id;
				this.r = true; // isReference
				this.o = null; // objectWrapped
			}
			else
			{
				this.r = false; // isReference
				var objectIndex = objectsAlreadyWrapped.length;
				this.id = objectIndex;
				objectsAlreadyWrapped.push(objectWrapped);
				objectIndexToNodeLookup[objectIndex] = this;

				this.t = typeName;

				if (typeName == Function.name)
				{
					this.o = objectWrapped.toString();
				}
				else
				{
					var children = {};
					this.c = children;

					for (var propertyName in objectWrapped)
					{
						if (objectWrapped.__proto__[propertyName] == null)
						{
							var propertyValue = objectWrapped[propertyName];

							if (propertyValue == null)
							{
								child = null;
							}
							else
							{
								var propertyValueTypeName = propertyValue.constructor.name;

								if
								(
									propertyValueTypeName == Boolean.name
									|| propertyValueTypeName == Number.name
									|| propertyValueTypeName == String.name
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

							children[propertyName] = child;
						}
					}

					delete this.o;

					for (var childName in children)
					{
						var child = children[childName];
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

	}; // end method

	prototypesAssign()
	{
		var children = this.c;
		if (children != null)
		{
			for (var childName in children)
			{
				var child = children[childName];
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
	};

	unwrap(nodesAlreadyProcessed)
	{
		var isReference = this.r;
		if (isReference == true)
		{
			var nodeExisting = nodesAlreadyProcessed[this.id];
			this.o = nodeExisting.o; // objectWrapped
		}
		else
		{
			nodesAlreadyProcessed[this.id] = this;
			var typeName = this.t;
			if (typeName == null)
			{
				// Value is null.  Do nothing.
			}
			else if (typeName == Array.name)
			{
				this.o = [];
			}
			else if (typeName == Function.name)
			{
				this.o = eval("(" + this.o + ")");
			}
			else if
			(
				typeName == Boolean.name
				|| typeName == Number.name
				|| typeName == String.name
			)
			{
				// Primitive types. Do nothing.
			}
			else
			{
				this.o = {};
				var objectWrappedType = eval("(" + typeName + ")");
				this.o.__proto__ = objectWrappedType.prototype;
			}

			var children = this.c;
			if (children != null)
			{
				for (var childName in children)
				{
					var child = children[childName];

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

					this.o[childName] = child;
				}
			}

		}

		return this.o; // objectWrapped
	};
}
