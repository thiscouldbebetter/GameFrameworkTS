namespace ThisCouldBeBetter.GameFramework
{

export class ArrayHelper
{
	static add(array: any[], element: any)
	{
		array.push(element);
		return array;
	}

	static addMany(array: any[], elements: any[])
	{
		for (var i = 0; i < elements.length; i++)
		{
			var element = elements[i];
			array.push(element);
		}
		return array;
	}

	static addLookups<K, E>(array: E[], getKeyForElement: (e: E) => K ): Map<K, E>
	{
		var returnLookup = new Map<K, E>();
		for (var i = 0; i < array.length; i++)
		{
			var element = array[i];
			var key = getKeyForElement(element);
			returnLookup.set(key, element);
		}
		return returnLookup;
	}

	static addLookupsByName<E extends Namable>(array: E[]): Map<string,E>
	{
		return ArrayHelper.addLookups(array, (element: E) => element.name);
	}

	static addLookupsMultiple<K, E>(array: any, getKeysForElement: (e:E) => Array<K> ): Map<K, E>
	{
		var returnLookup = new Map<K, E>();
		for (var i = 0; i < array.length; i++)
		{
			var element = array[i];
			var keys = getKeysForElement(element);
			for (var k = 0; k < keys.length; k++)
			{
				var key = keys[k];
				returnLookup.set(key, element);
			}
		}
		return returnLookup;
	}

	static append(array: any, other: any)
	{
		for (var i = 0; i < other.length; i++)
		{
			var element = other[i];
			array.push(element);
		}
		return array;
	}

	static areEqual(array0: any[], array1: any[]): boolean
	{
		var areArraysEqual = true;

		if (array0.length != array1.length)
		{
			areArraysEqual = false;
		}
		else
		{
			for (var i = 0; i < array0.length; i++)
			{
				var element0 = array0[i];
				var element1 = array1[i];
				if (element0 == element1)
				{
					// Do nothing.
				}
				else if
				(
					element0.equals != null
					&& element1.equals != null
					&& element0.equals(element1)
				)
				{
					// Do nothing.
				}
				else
				{
					var element0AsJson = JSON.stringify(element0);
					var element1AsJson = JSON.stringify(element1);
					if (element0AsJson != element1AsJson)
					{
						areArraysEqual = false;
						break;
					}
				}
			}
		}

		return areArraysEqual;
	}

	static clear(array: any)
	{
		array.length = 0;
		return array;
	}

	static clone(array: any)
	{
		var returnValue: any = null;

		if (array != null)
		{
			returnValue = [];

			for (var i = 0; i < array.length; i++)
			{
				var element = array[i];
				var elementCloned = element.clone();
				returnValue.push(elementCloned);
			}
		}

		return returnValue;
	}

	static concatenateAll(arrays: any)
	{
		var childrenConcatenated: any = [];

		for (var i = 0; i < arrays.length; i++)
		{
			var childArray = arrays[i];
			childrenConcatenated = childrenConcatenated.concat(childArray);
		}

		return childrenConcatenated;
	}

	static contains(array: any, elementToFind: any)
	{
		return (array.indexOf(elementToFind) >= 0);
	}

	static equals(array: any[], other: any[])
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
	}

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
	}

	static insertElementAt(array: any[], element: any, index: number)
	{
		array.splice(index, 0, element);
		return array;
	}

	static intersectArrays(array0: any[], array1: any[]): any[]
	{
		var elementsInBothArrays = new Array<any>();

		for (var i = 0; i < array0.length; i++)
		{
			var element = array0[i];

			var isElementInArray1 = (array1.indexOf(element) >= 0);
			if (isElementInArray1)
			{
				elementsInBothArrays.push(element);
			}
		}
		return elementsInBothArrays;
	}

	static overwriteWith(array: any[], other: any[])
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
	}

	static prepend(array: any, other: any)
	{
		for (var i = 0; i < other.length; i++)
		{
			var element = other[i];
			array.splice(0, 0, element);
		}
		return array;
	}

	static random(array: any, randomizer: Randomizer)
	{
		return array[ Math.floor(randomizer.getNextRandom() * array.length) ];
	}

	static remove(array: any, elementToRemove: any)
	{
		var indexToRemoveAt = array.indexOf(elementToRemove);
		if (indexToRemoveAt >= 0)
		{
			array.splice(indexToRemoveAt, 1);
		}
		return array;
	}

	static removeAt(array: any, index: number)
	{
		array.splice(index, 1);
		return array;
	}
}

}
