
class Serializer
{
	deserialize(stringToDeserialize: string)
	{
		var nodeRoot = JSON.parse(stringToDeserialize);
		nodeRoot.__proto__ = SerializerNode.prototype;
		nodeRoot.prototypesAssign();
		var returnValue = nodeRoot.unwrap([]);

		return returnValue;
	};

	serialize(objectToSerialize: any, prettyPrint: boolean)
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
	t: string;
	id: number;
	r: boolean;
	o: any;
	c: any; // todo - Map<string, any> - Tricky.

	constructor(objectWrapped: any)
	{
		this.t = null; // objectWrappedTypeName
		this.id = null; // id
		this.r = null; // isReference

		this.o = objectWrapped;
	}

	wrap(objectsAlreadyWrapped: any, objectIndexToNodeLookup: any)
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
					var children: any = {}; // new Map<string, any>();
					this.c = children;

					if (typeName == Map.name)
					{
						// Maps don't serialize well with JSON.stringify(),
						// so convert it to a generic object.
						var objectWrappedAsObject = {};
						for (var key of objectWrapped.keys())
						{
							var value = objectWrapped.get(key);
							objectWrappedAsObject[key] = value;
						}
						objectWrapped = objectWrappedAsObject;
					}

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
							if (childTypeName == SerializerNode.name)
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
					if (childTypeName == Object.name)
					{
						Object.setPrototypeOf(child, SerializerNode.prototype);
						child.prototypesAssign();
					}
				}
			}
		}
	};

	unwrap(nodesAlreadyProcessed: any)
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
			else if (typeName == Map.name)
			{
				this.o = new Map();
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
						if (child.constructor.name == SerializerNode.name)
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
