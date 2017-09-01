
function Action(name, perform)
{
	this.name = name;
	this.perform = perform;
}
{
	Action.Instances = new Action_Instances();
	
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
