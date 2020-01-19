
function VisualInvisible(child)
{
	this.child = child;
}

{
	// Cloneable.

	VisualInvisible.prototype.clone = function()
	{
		return new VisualInvisible(this.child.clone());
	};

	VisualInvisible.prototype.overwriteWith = function(other)
	{
		this.child.overwriteWith(other.child);
	};

	// Transformable.

	VisualInvisible.prototype.transform = function(transformToApply)
	{
		return transformToApply.transform(this.child);
	};

	// Visual.

	VisualInvisible.prototype.draw = function(universe, world, display, entity)
	{
		// Do nothing.
	};
}
