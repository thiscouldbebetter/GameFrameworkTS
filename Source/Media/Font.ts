
namespace ThisCouldBeBetter.GameFramework
{

export class Font implements MediaItemBase
{
	name: string;
	sourcePath: string;
	isLoaded: boolean;

	constructor(name: string, sourcePath: string)
	{
		this.name = name;
		this.sourcePath = sourcePath;

		this.isLoaded = false;
		//this.load();
	}

	id(): string
	{
		return Font.name + this.name;
	}

	load
	(
		uwpe: UniverseWorldPlaceEntities,
		callback: (result: Loadable) => void
	): Font
	{
		if (this.isLoaded == false)
		{
			var fontAsStyleElement = document.createElement("style");
			fontAsStyleElement.id = this.id();
			fontAsStyleElement.innerHTML = 
				"@font-face { "
				+ "font-family: '" + this.name + "';"
				+ "src: url('" + this.sourcePath + "');"; 
				+ "}";
			document.head.appendChild(fontAsStyleElement);
			this.isLoaded = true;
		}

		return this;
	}

	unload(uwpe: UniverseWorldPlaceEntities): Font
	{
		throw new Error("todo");
	}
}

}
