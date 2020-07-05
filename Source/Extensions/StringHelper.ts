
class StringHelper
{
	// Static class.

	static lowercaseFirstCharacter(value)
	{
		return value.substr(0, 1).toLowerCase() + value.substr(1);
	};

	static padStart(stringToPad, lengthToPadTo, charToPadWith)
	{
		while (stringToPad.length < lengthToPadTo)
		{
			stringToPad = charToPadWith + stringToPad;
		}
		return stringToPad;
	};

	static replaceAll(stringToReplaceWithin, stringToBeReplaced, stringToReplaceWith)
	{
		return stringToReplaceWithin.split(stringToBeReplaced).join(stringToReplaceWith);
	};

	static toTitleCase(value)
	{
		return value.substr(0, 1).toUpperCase() + value.substr(1).toLowerCase();
	};
}
