
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
		return (this.settingValueByName(DebugSettings_Names.Instance().DrawColliders) != null);
	}

	localStorageClear(): boolean
	{
		return (this.settingValueByName(DebugSettings_Names.Instance().LocalStorageClear) != null);
	}

	placeToStartAt(): string
	{
		return (this.settingValueByName(DebugSettings_Names.Instance().PlaceToStartAt) );
	}

	skipOpening(): boolean
	{
		return (this.settingValueByName(DebugSettings_Names.Instance().SkipOpening) != null);
	}
}

export class DebugSettings_Names
{
	DrawColliders: string;
	LocalStorageClear: string;
	PlaceToStartAt: string;
	SkipOpening: string;

	constructor()
	{
		this.DrawColliders = "DrawColliders";
		this.LocalStorageClear = "LocalStorageClear";
		this.PlaceToStartAt = "PlaceToStartAt";
		this.SkipOpening = "SkipOpening";
	}

	static _instance: DebugSettings_Names;
	static Instance(): DebugSettings_Names
	{
		if (this._instance == null)
		{
			this._instance = new DebugSettings_Names();
		}
		return this._instance;
	}
}


}