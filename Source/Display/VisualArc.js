
function VisualArc(arc, colorFill, colorBorder)
{
	this.arc = arc;
	this.colorFill = colorFill;
	this.colorBorder = colorBorder;
	
	// helper variables
	this.drawPos = new Coords();
}
{
	VisualArc.prototype.drawToDisplayForDrawableAndLoc = function(display, drawable, drawLoc)
	{
		var arc = this.arc;
		var shell = arc.shell;
		var wedge = arc.wedge;
		
		var drawPos = this.drawPos.overwriteWith
		(
			drawLoc.pos
		);
		
		display.drawArc
		(
			drawPos, // center
			shell.sphereInner.radius, shell.sphereOuter.radius, 
			wedge.angleInTurnsMin, wedge.angleInTurnsMax,
			this.colorFill, this.colorBorder
		);
	}
}