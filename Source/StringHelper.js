
function StringHelper()
{
	// static class
}

{
	StringHelper.padStringLeft = function
	(
		stringToPad,
		lengthAfterPadding,
		characterToPadWith
	)
	{
		while (stringToPad.length < lengthAfterPadding)
		{
			stringToPad = characterToPadWith + stringToPad;
		}

		return stringToPad;
	}
}
