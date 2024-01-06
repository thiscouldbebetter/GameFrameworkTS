
namespace ThisCouldBeBetter.GameFramework
{

export class ControlSoundScheme
{
	name: string;
	soundClickName: string;

	constructor
	(
		name: string,
		soundClickName: string
	)
	{
		this.name = name;
		this.soundClickName = soundClickName;
	}

	static _instances: ControlSoundScheme_Instances;
	static Instances(): ControlSoundScheme_Instances
	{
		if (ControlSoundScheme._instances == null)
		{
			ControlSoundScheme._instances = new ControlSoundScheme_Instances();
		}
		return ControlSoundScheme._instances;
	}

	static byName(soundSchemeName: string): ControlSoundScheme
	{
		return ControlSoundScheme.Instances()._AllByName.get(soundSchemeName);
	}

	clone(): ControlSoundScheme
	{
		return new ControlSoundScheme
		(
			this.name,
			this.soundClickName
		);
	}
}

export class ControlSoundScheme_Instances
{
	Default: ControlSoundScheme;
	Dark: ControlSoundScheme;

	_All: ControlSoundScheme[];
	_AllByName: Map<string, ControlSoundScheme>;

	constructor()
	{
		this.Default = new ControlSoundScheme
		(
			"Default", // name
			"Sound" // soundClickName
		);

		this._All =
		[
			this.Default
		];

		this._AllByName = ArrayHelper.addLookupsByName(this._All);
	}
}

}
