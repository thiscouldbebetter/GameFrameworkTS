
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

		//this.load(null, null);
	}

	// static methods

	static fromString(name: string, value: string)
	{
		var returnValue = new TextString
		(
			name, null // sourcePath
		);

		returnValue.value = value;
		returnValue.isLoaded = true;

		return returnValue;
	}

	// instance methods

	isLoaded: boolean;

	load
	(
		uwpe: UniverseWorldPlaceEntities,
		callback: (result: Loadable) => void
	): void
	{
		if (this.isLoaded)
		{
			if (callback != null)
			{
				callback(this);
			}
		}
		else
		{
			var text = this;

			var xmlHttpRequest = new XMLHttpRequest();
			xmlHttpRequest.open("GET", this.sourcePath);
			xmlHttpRequest.responseType = "text"; // Default?
			xmlHttpRequest.onloadend = () =>
			{
				text.value = xmlHttpRequest.responseText;
				text.isLoaded = true;
				if (callback != null)
				{
					callback(text);
				}
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
	}

	unload(uwpe: UniverseWorldPlaceEntities): void {}
}

}
