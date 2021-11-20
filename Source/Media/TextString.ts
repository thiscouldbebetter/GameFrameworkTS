
namespace ThisCouldBeBetter.GameFramework
{

export class TextString implements MediaItemBase
{
	name: string;
	sourcePath: string;

	value: string;

	constructor(name: string, sourcePath: string)
	{
		this.name = name;
		this.sourcePath = sourcePath;

		this.load();
	}

	// static methods

	static fromString(name: string, value: string)
	{
		var returnValue = new TextString
		(
			name, null // sourcePath
		);

		returnValue.value = value;

		return returnValue;
	}

	// instance methods

	isLoaded: boolean;

	load(): void
	{
		var text = this;

		var xmlHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.open("GET", this.sourcePath);
		xmlHttpRequest.onreadystatechange = () =>
		{
			text.value = xmlHttpRequest.responseText;
			text.isLoaded = true;
		};
		xmlHttpRequest.send();

		/*
		fetch(this.sourcePath).then
		(
			response => response.json()
		).then
		(
			data =>
			{
				text.value = data;
				text.isLoaded = true;
			}
		);
		*/
	}

	unload(): void {}
}

}
