
function VisualDirectional(visualsForDirections)
{
	this.visualsForDirections = visualsForDirections;
	this.numberOfDirections = this.visualsForDirections.length;
}

{
	VisualDirectional.prototype.drawToDisplayForDrawableAndLoc = function(display, drawable, loc)
	{
		var headingInTurns = loc.headingInTurns();
		var direction = Math.round(headingInTurns * this.numberOfDirections - .5);
		var visualForDirection = this.visualsForDirections[direction];
		visualForDirection.drawToDisplayForDrawableAndLoc(display, drawable, loc);
	}
}
