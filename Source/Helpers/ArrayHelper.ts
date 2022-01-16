namespace ThisCouldBeBetter.GameFramework
{

export class ArrayHelper
{
	static add<T>(array: T[], element: T): T[]
	{
		array.push(element);
		return array;
	}

	static addMany<T>(array: T[], elements: T[]): T[]
	{
		for (var i = 0; i < elements.length; i++)
		{
			var element = elements[i];
			array.push(element);
		}
		return array;
	}

	static addLookups<K, E>
	(
		array: E[], getKeyForElement: (e: E) => K
	): Map<K, E>
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

	static addLookupsMultiple<K, E>
	(
		array: E[], getKeysForElement: (e:E) => Array<K>
	): Map<K, E>
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

	static append<T>(array: T[], other: T[]): T[]
	{
		for (var i = 0; i < other.length; i++)
		{
			var element = other[i];
			array.push(element);
		}
		return array;
	}

	static areEqual<T extends Equatable<T>>
	(
		array0: T[], array1: T[]
	): boolean
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
				else if (element0.equals(element1))
				{
					// Do nothing.
				}
				else
				{
					areArraysEqual = false;
				}
			}
		}

		return areArraysEqual;
	}

	static areEqualNonEquatable<T>
	(
		array0: T[], array1: T[]
	): boolean
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

	static clear<T>(array: T[])
	{
		array.length = 0;
		return array;
	}

	static clone<T extends Clonable<T>>(array: T[])
	{
		var returnValues: T[] = null;

		if (array != null)
		{
			returnValues = new Array<T>();

			for (var i = 0; i < array.length; i++)
			{
				var element = array[i];
				var elementCloned = element.clone();
				returnValues.push(elementCloned);
			}
		}

		return returnValues;
	}

	static flattenArrayOfArrays<T>(arrayOfArrays: T[][]): T[]
	{
		var arrayFlattened = new Array<T>();

		for (var i = 0; i < arrayOfArrays.length; i++)
		{
			var childArray = arrayOfArrays[i];
			arrayFlattened =
				arrayFlattened.concat(childArray);
		}

		return arrayFlattened;
	}

	static contains<T>(array: T[], elementToFind: T): boolean
	{
		return (array.indexOf(elementToFind) >= 0);
	}

	static equals<T extends Equatable<T>>
	(
		array: T[], other: T[]
	): boolean
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

	static insertElementAfterOther<T>
	(
		array: T[], elementToInsert: T, other: T
	): T[]
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

	static insertElementAt<T>
	(
		array: T[], element: T, index: number
	): T[]
	{
		array.splice(index, 0, element);
		return array;
	}

	static intersectArrays<T>(array0: T[], array1: T[]): T[]
	{
		var elementsInBothArrays = new Array<T>();

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

	static overwriteWith<T extends Clonable<T>>
	(
		array: T[], other: T[]
	): T[]
	{
		for (var i = 0; i < array.length; i++)
		{
			var elementThis = array[i];
			var elementOther = other[i];
			elementThis.overwriteWith(elementOther);
		}

		return array;
	}

	static overwriteWithNonClonables<T>
	(
		array: T[], other: T[]
	): T[]
	{
		for (var i = 0; i < array.length; i++)
		{
			var elementOther = other[i];
			array[i] = elementOther;
		}

		return array;
	}

	static prepend<T>(array: T[], other: T[]): T[]
	{
		for (var i = 0; i < other.length; i++)
		{
			var element = other[i];
			array.splice(0, 0, element);
		}
		return array;
	}

	static random<T>(array: T[], randomizer: Randomizer): T
	{
		return array[ randomizer.integerLessThan(array.length) ];
	}

	static remove<T>(array: T[], elementToRemove: T): T[]
	{
		var indexToRemoveAt = array.indexOf(elementToRemove);
		if (indexToRemoveAt >= 0)
		{
			array.splice(indexToRemoveAt, 1);
		}
		return array;
	}

	static removeAt<T>(array: T[], index: number): T[]
	{
		array.splice(index, 1);
		return array;
	}
}

}
