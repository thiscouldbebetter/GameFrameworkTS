
namespace ThisCouldBeBetter.GameFramework
{

export class DebugSettings
{
	settingValuesByName: Map<string, string>;

	constructor
	(
		settingValuesByName: Map<string, string>
	)
	{
		this.settingValuesByName = settingValuesByName;
	}

	static fromString(stringToParse: string): DebugSettings
	{
		var settingValuesByName = new Map();

		if (stringToParse != null)
		{
			var settingsAsStrings: string[] =
				stringToParse.split("|");
			var settingNameValuePairs =
				settingsAsStrings.map(x => x.split(":") );
			for (var i = 0; i < settingNameValuePairs.length; i++)
			{
				var settingNameAndValue = settingNameValuePairs[i];
				var settingName = settingNameAndValue[0];
				var settingValue = settingNameAndValue[1] || settingName;
				settingValuesByName.set(settingName, settingValue);
			}
		}
		return new DebugSettings(settingValuesByName);
	}

	settingValueByName(name: string): string
	{
		return this.settingValuesByName.get(name);
	}

	// Particular settings.

	drawColliders(): boolean
	{
		return (this.settingValueByName("DrawColliders") != null);
	}

	localStorageClear(): boolean
	{
		return (this.settingValueByName("LocalStorageClear") != null);
	}

	skipOpening(): boolean
	{
		return (this.settingValueByName("SkipOpening") != null);
	}
}

}