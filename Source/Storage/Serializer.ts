
class Serializer
{
	deserialize(stringToDeserialize: string)
	{
		var nodeRoot = JSON.parse(stringToDeserialize);
		var typeNames = nodeRoot["typeNames"];
		nodeRoot.__proto__ = SerializerNode.prototype;
		nodeRoot.prototypesAssign();
		var returnValue = nodeRoot.unwrap(typeNames, []);

		return returnValue;
	};

	serialize(objectToSerialize: any, prettyPrint: boolean)
	{
		var nodeRoot: any = new SerializerNode(objectToSerialize);

		var typeNames = new Array<string>();
		nodeRoot.wrap(typeNames, new Map<string, number>(), [], []);

		nodeRoot["typeNames"] = typeNames; 

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
	t: number;
	i: number;
	r: number;
	o: any;
	c: any; // todo - Map<string, any> - Tricky.

	constructor(objectWrapped: any)
	{
		this.o = objectWrapped;
	}

	wrap(typeNamesSoFar: string[], typeIdsByName: Map<string, number>, objectsAlreadyWrapped: any, objectIndexToNodeLookup: any)
	{
		var objectWrapped = this.o;
		if (objectWrapped != null)
		{
			var typeName = objectWrapped.constructor.name;

			if (typeIdsByName.has(typeName) == false)
			{
				typeIdsByName.set(typeName, typeNamesSoFar.length);
				typeNamesSoFar.push(typeName);
			}

			var typeId = typeIdsByName.get(typeName);

			var objectIndexExisting =
				objectsAlreadyWrapped.indexOf(objectWrapped);

			if (objectIndexExisting >= 0)
			{
				var nodeForObjectExisting = objectIndexToNodeLookup[objectIndexExisting];
				this.i = nodeForObjectExisting.i;
				this.r = 1; // isReference
				delete this.o; // objectWrapped
			}
			else
			{
				// this.r = 0; // isReference
				var objectIndex = objectsAlreadyWrapped.length;
				this.i = objectIndex;
				objectsAlreadyWrapped.push(objectWrapped);
				objectIndexToNodeLookup[objectIndex] = this;

				this.t = typeId;

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
						var objectWrappedAsObject: any = {};
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
									typeNamesSoFar,
									typeIdsByName,
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

	unwrap(typeNames: string[], nodesAlreadyProcessed: any)
	{
		var isReference = (this.r == 1);
		if (isReference)
		{
			var nodeExisting = nodesAlreadyProcessed[this.i];
			this.o = nodeExisting.o; // objectWrapped
		}
		else
		{
			nodesAlreadyProcessed[this.i] = this;
			var typeId = this.t;
			var typeName = typeNames[typeId];
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
								typeNames, nodesAlreadyProcessed
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
