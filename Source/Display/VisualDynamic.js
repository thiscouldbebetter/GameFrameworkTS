
function VisualDynamic(methodForVisual)
{
	this.methodForVisual = methodForVisual;
}

{
	VisualDynamic.prototype.draw = function(universe, display, drawable, loc)
	{
		var visual = this.methodForVisual.call(this, drawable);
		visual.draw(universe, display, drawable, loc);
	}
}
