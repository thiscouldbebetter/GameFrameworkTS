
namespace ThisCouldBeBetter.GameFramework
{

export class StringHelper
{
	// Static class.

	static lowercaseFirstCharacter(value: string)
	{
		return value.substr(0, 1).toLowerCase() + value.substr(1);
	}

	static padEnd(stringToPad: string, lengthToPadTo: number, charToPadWith: string)
	{
		while (stringToPad.length < lengthToPadTo)
		{
			stringToPad = stringToPad + charToPadWith;
		}
		return stringToPad;
	}

	static padStart(stringToPad: string, lengthToPadTo: number, charToPadWith: string)
	{
		while (stringToPad.length < lengthToPadTo)
		{
			stringToPad = charToPadWith + stringToPad;
		}
		return stringToPad;
	}

	static spacesToUnderscores(stringToAlter: string): string
	{
		return StringHelper.replaceAll(stringToAlter, " ", "_");
	}

	static replaceAll(stringToReplaceWithin: string, stringToBeReplaced: string, stringToReplaceWith: string)
	{
		return stringToReplaceWithin.split(stringToBeReplaced).join(stringToReplaceWith);
	}

	static toTitleCase(value: string)
	{
		return value.substr(0, 1).toUpperCase() + value.substr(1).toLowerCase();
	}
}

}
