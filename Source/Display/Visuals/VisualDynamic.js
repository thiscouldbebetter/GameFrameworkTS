
function VisualDynamic(methodForVisual)
{
	this.methodForVisual = methodForVisual;
}

{
	VisualDynamic.prototype.draw = function(universe, world, display, entity)
	{
		var visual = this.methodForVisual.call(this, universe, world, entity);
		visual.draw(universe, world, display, entity);
	};
}
