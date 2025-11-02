
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

	// Static methods.

	static fromNameAndSourcePath(name: string, sourcePath: string)
	{
		return new TextString(name, sourcePath);
	}

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
	): TextString
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
		}

		return this;
	}

	loadThen(callback: (result: Loadable) => void): void
	{
		this.load(null, callback);
	}


	unload(uwpe: UniverseWorldPlaceEntities): TextString { throw new Error("todo"); }
}

}
