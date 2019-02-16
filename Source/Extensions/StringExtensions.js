
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
	};

	String.prototype.replaceAll = function(stringToBeReplaced, stringToReplaceWith)
	{
		return this.split(stringToBeReplaced).join(stringToReplaceWith);
	};

	String.prototype.toTitleCase = function()
	{
		return this.substr(0, 1).toUpperCase() + this.substr(1).toLowerCase();
	};
}
