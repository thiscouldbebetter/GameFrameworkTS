
function Action(name, perform)
{
	this.name = name;
	this.perform = perform;
}
{
	Action.Instances = function()
	{
		if (Action._Instances == null)
		{
			Action._Instances = new Action_Instances();
		}
		return Action._Instances;
	};
	
	function Action_Instances()
	{
		this.DoNothing = new Action
		(
			"DoNothing", 
			function(actor)
			{
				// Do nothing.
			}
		)
	}
}
