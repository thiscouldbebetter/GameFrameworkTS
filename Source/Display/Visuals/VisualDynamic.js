
function VisualDynamic(methodForVisual)
{
	this.methodForVisual = methodForVisual;
}

{
	VisualDynamic.prototype.draw = function(universe, world, display, drawable)
	{
		var visual = this.methodForVisual.call(this, world, drawable);
		visual.draw(universe, world, display, drawable);
	}
}
