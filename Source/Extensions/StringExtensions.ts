
function StringExtensions()
{
	// Extension class.
}

{
	String.prototype.lowercaseFirstCharacter = function()
	{
		return this.substr(0, 1).toLowerCase() + this.substr(1);
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
