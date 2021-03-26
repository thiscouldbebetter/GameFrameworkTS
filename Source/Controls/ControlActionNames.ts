
namespace ThisCouldBeBetter.GameFramework
{

export class ControlActionNames_Instances
{
	ControlCancel: string;
	ControlConfirm: string;
	ControlDecrement: string;
	ControlIncrement: string;
	ControlNext: string;
	ControlPrev: string;

	constructor()
	{
		this.ControlCancel = "ControlCancel";
		this.ControlConfirm = "ControlConfirm";
		this.ControlDecrement = "ControlDecrement";
		this.ControlIncrement = "ControlIncrement";
		this.ControlNext = "ControlNext";
		this.ControlPrev = "ControlPrev";
	}
}

export class ControlActionNames
{
	static _instances: ControlActionNames_Instances;

	static Instances()
	{
		if (ControlActionNames._instances == null)
		{
			ControlActionNames._instances = new ControlActionNames_Instances();
		}

		return ControlActionNames._instances;
	}
}

}
