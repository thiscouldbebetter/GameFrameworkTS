
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
		this.load();
	}

	load(): void
	{
		var fontAsStyleElement = document.createElement("style");
		fontAsStyleElement.innerHTML = 
			"@font-face { "
			+ "font-family: '" + this.name + "';"
			+ "src: url('" + this.sourcePath + "');"; 
			+ "}";
		document.head.appendChild(fontAsStyleElement);
		this.isLoaded = true;
	}

	unload(): void {} // todo
}

}
