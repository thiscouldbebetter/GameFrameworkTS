
function TextString(name, sourcePath)
{
	this.name = name;
	this.sourcePath = sourcePath;

	this.load();
}
{
	// static methods

	TextString.fromString = function(name, value)
	{
		var returnValue = new
		(
			name, null // sourcePath
		);

		returnValue.value = value;

		return returnValue;
	}

	// instance methods

	TextString.prototype.load = function()
	{
		var text = this;

		var xmlHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.open("GET", this.sourcePath);
		xmlHttpRequest.onreadystatechange = function()
		{
			text.value = xmlHttpRequest.responseText;
			text.isLoaded = true;
		}
		xmlHttpRequest.send();
	}
}
