
function VisualDynamic(methodForVisual)
{
	this.methodForVisual = methodForVisual;
}

{
	VisualDynamic.prototype.drawToDisplayAtLoc = function(display, loc, entity)
	{
		var visual = this.methodForVisual.call(this, entity);
		visual.drawToDisplayAtLoc(display, loc, entity);
	}
}
