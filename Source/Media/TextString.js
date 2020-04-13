
class TextString
{
	constructor(name, sourcePath)
	{
		this.name = name;
		this.sourcePath = sourcePath;

		this.load();
	}

	// static methods

	static fromString(name, value)
	{
		var returnValue = new
		(
			name, null // sourcePath
		);

		returnValue.value = value;

		return returnValue;
	};

	// instance methods

	load()
	{
		var text = this;

		var xmlHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.open("GET", this.sourcePath);
		xmlHttpRequest.onreadystatechange = function()
		{
			text.value = xmlHttpRequest.responseText;
			text.isLoaded = true;
		};
		xmlHttpRequest.send();
	};
}
