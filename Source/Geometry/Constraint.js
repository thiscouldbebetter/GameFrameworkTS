
function Constraint(defnName, target)
{
	this.defnName = defnName;
	this.target = target;
}
{
	Constraint.prototype.constrain = function(context, constrainable)
	{
		this.defn().constrain(context, constrainable, this.target);
	}
	
	Constraint.prototype.defn = function()
	{
		return ConstraintDefn.Instances[this.defnName];
	}
}