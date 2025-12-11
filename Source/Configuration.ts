
class Configuration
{
	contentDirectoryPath: string;
	displaySizesAvailable: Coords[];
	displaySizeInitialIndex: number;

	constructor()
	{
		this.contentDirectoryPath = "../Content/";
		this.displaySizesAvailable = null;
		this.displaySizeInitialIndex = null;
	}

	static _instance: Configuration;

	static Instance(): Configuration
	{
		if (this._instance == null)
		{
			this._instance = new Configuration();
		}
		return this._instance;
	}
}