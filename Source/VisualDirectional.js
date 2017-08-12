
function VisualDirectional(visualsForDirections)
{
	this.visualsForDirections = visualsForDirections;
	this.numberOfDirections = this.visualsForDirections.length;
}

{
	VisualDirectional.prototype.drawToDisplayAtLoc = function(display, loc, entity)
	{
		var headingInCycles = loc.heading;
		var direction = Math.round(headingInCycles * numberOfDirections - .5);
		var visualForDirection = this.visualsForDirections[direction];
		visualForDirection.drawToDisplayAtLoc(display, loc, entity);
	}
}
