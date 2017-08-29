
function StringExtensions()
{
	// extension class
}

{
	String.prototype.padLeft = function
	(
		lengthAfterPadding,
		characterToPadWith
	)
	{
		var stringToPad = this;

		while (stringToPad.length < lengthAfterPadding)
		{
			stringToPad = characterToPadWith + stringToPad;
		}

		return stringToPad;
	}
}
