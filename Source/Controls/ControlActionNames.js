
class ControlActionNames
{
	// Do nothing.
}
{
	function ControlActionNames_Instances()
	{
		this.ControlCancel = "ControlCancel";
		this.ControlConfirm = "ControlConfirm";
		this.ControlDecrement = "ControlDecrement";
		this.ControlIncrement = "ControlIncrement";
		this.ControlNext = "ControlNext";
		this.ControlPrev = "ControlPrev";
	}

	ControlActionNames.Instances = function()
	{
		if (ControlActionNames._instances == null)
		{
			ControlActionNames._instances = new ControlActionNames_Instances();
		}

		return ControlActionNames._instances;
	};
}
