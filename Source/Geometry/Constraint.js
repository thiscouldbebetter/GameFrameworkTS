
function Constraint(defnName, target)
{
	this.defnName = defnName;
	this.target = target;
}
{
	Constraint.prototype.constrain = function(universe, world, place, entity)
	{
		var constraintDefn = this.defn(world);
		constraintDefn.constrain(universe, world, place, entity, this.target);
	}

	Constraint.prototype.defn = function(world)
	{
		return world.defns.constraintDefns[this.defnName];
	}
}
