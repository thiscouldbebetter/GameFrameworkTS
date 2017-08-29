
function VisualDynamic(methodForVisual)
{
	this.methodForVisual = methodForVisual;
}

{
	VisualDynamic.prototype.drawToDisplayForDrawableAndLoc = function(display, drawable, loc)
	{
		var visual = this.methodForVisual.call(this, drawable);
		visual.drawToDisplayForDrawableAndLoc(display, drawable, loc);
	}
}
