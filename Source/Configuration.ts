
class Configuration
{
	contentDirectoryPath: string;
	displaySizesAvailable: Coords[];

	constructor()
	{
		this.contentDirectoryPath = "../Content/";
		this.displaySizesAvailable = null;
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