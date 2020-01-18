
function VisualTransform(transformToApply, child)
{
	this.transformToApply = transformToApply;
	this.child = child;
}
{
	// Cloneable.

	VisualTransform.prototype.clone = function()
	{
		return new VisualTransform(this.transformToApply, this.child.clone());
	};

	VisualTransform.prototype.overwriteWith = function(other)
	{
		this.child.overwriteWith(other.child);
		return this;
	};

	// Transformable.

	VisualTransform.prototype.transform = function(transformToApply)
	{
		return this.child.transform(transformToApply);
	};

	// Visual.

	VisualTransform.prototype.draw = function(universe, world, display, entity)
	{
		this.child.transform(this.transformToApply);
		this.child.draw(universe, world, display, entity);
	};
}
