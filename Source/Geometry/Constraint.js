
function Constraint(defnName, target)
{
	this.defnName = defnName;
	this.target = target;
}
{
	Constraint.prototype.constrain = function(universe, world, place, entity)
	{
		this.defn(universe).constrain(universe, world, place, entity, this.target);
	}

	Constraint.prototype.defn = function(universe)
	{
		return universe.world.constraintDefns[this.defnName];
	}
}
