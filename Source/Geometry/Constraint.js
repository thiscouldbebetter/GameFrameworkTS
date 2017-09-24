
function Constraint(defnName, target)
{
	this.defnName = defnName;
	this.target = target;
}
{
	Constraint.prototype.constrain = function(universe, world, place, entity)
	{
		this.defn().constrain(universe, world, place, entity, this.target);
	}
	
	Constraint.prototype.defn = function()
	{
		return Globals.Instance.universe.world.constraintDefns[this.defnName];
	}
}
