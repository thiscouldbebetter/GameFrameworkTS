class ArrayHelper
{
	static add(array: any, element: any)
	{
		array.push(element);
		return array;
	};

	static addMany(array: any, elements: any)
	{
		for (var i = 0; i < elements.length; i++)
		{
			var element = elements[i];
			array.push(element);
		}
		return array;
	};

	static addLookups(array: any, getKeyForElement: any)
	{
		var returnLookup: any = {};
		for (var i = 0; i < array.length; i++)
		{
			var element = array[i];
			var key = getKeyForElement(element);
			returnLookup[key] = element;
		}
		return returnLookup;
	};

	static addLookupsByName(array: any)
	{
		return ArrayHelper.addLookups(array, (x:any) => x.name);
	};

	static addLookupsMultiple(array: any, getKeysForElement: any)
	{
		var returnLookup: any = {};
		for (var i = 0; i < array.length; i++)
		{
			var element = array[i];
			var keys = getKeysForElement(element);
			for (var k = 0; k < keys.length; k++)
			{
				var key = keys[k];
				returnLookup[key] = element;
			}
		}
		return returnLookup;
	};

	static append(array: any, other: any)
	{
		for (var i = 0; i < other.length; i++)
		{
			var element = other[i];
			array.push(element);
		}
		return array;
	};

	static clear(array: any)
	{
		array.length = 0;
		return array;
	};

	static clone(array: any)
	{
		var returnValue = [];

		for (var i = 0; i < array.length; i++)
		{
			var element = array[i];
			var elementCloned = element.clone();
			returnValue.push(elementCloned);
		}

		return returnValue;
	};

	static concatenateAll(arrays: any)
	{
		var childrenConcatenated: any = [];

		for (var i = 0; i < arrays.length; i++)
		{
			var childArray = arrays[i];
			childrenConcatenated = childrenConcatenated.concat(childArray);
		}

		return childrenConcatenated;
	};

	static contains(array: any, elementToFind: any)
	{
		return (array.indexOf(elementToFind) >= 0);
	};

	static equals(array: any, other: any)
	{
		var areEqualSoFar;

		if (array.length != other.length)
		{
			areEqualSoFar = false;
		}
		else
		{
			for (var i = 0; i < array.length; i++)
			{
				areEqualSoFar = array[i].equals(other[i]);
				if (areEqualSoFar == false)
				{
					break;
				}
			}
		}

		return areEqualSoFar;
	};

	static insertElementAfterOther(array: any, elementToInsert: any, other: any)
	{
		var index = array.indexOf(other);
		if (index >= 0)
		{
			array.splice(index + 1, 0, elementToInsert);
		}
		else
		{
			array.push(elementToInsert);
		}
		return array;
	};

	static insertElementAt(array: any, element: any, index: number)
	{
		array.splice(index, 0, element);
		return array;
	};

	static overwriteWith(array: any, other: any)
	{
		for (var i = 0; i < array.length; i++)
		{
			var elementThis = array[i];
			var elementOther = other[i];
			if (elementThis.overwriteWith == null)
			{
				array[i] = elementOther;
			}
			else
			{
				elementThis.overwriteWith(elementOther);
			}
		}

		return array;
	};

	static prepend(array: any, other: any)
	{
		for (var i = 0; i < other.length; i++)
		{
			var element = other[i];
			array.splice(0, 0, element);
		}
		return array;
	};

	static random(array: any, randomizer: Randomizer)
	{
		return array[ Math.floor(randomizer.getNextRandom() * array.length) ];
	};

	static remove(array: any, elementToRemove: any)
	{
		var indexToRemoveAt = array.indexOf(elementToRemove);
		if (indexToRemoveAt >= 0)
		{
			array.splice(indexToRemoveAt, 1);
		}
		return array;
	};

	static removeAt(array: any, index: number)
	{
		array.splice(index, 1);
		return array;
	};
}
