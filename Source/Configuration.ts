
class Configuration
{
	contentDirectoryPath: string;

	constructor()
	{
		this.contentDirectoryPath = "../Content/";
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