
function VisualDynamic(methodForVisual)
{
	this.methodForVisual = methodForVisual;
}

{
	VisualDynamic.prototype.draw = function(universe, world, display, drawable, entity)
	{
		var visual = this.methodForVisual.call(this, universe, world, drawable, entity);
		visual.draw(universe, world, display, drawable);
	}
}
