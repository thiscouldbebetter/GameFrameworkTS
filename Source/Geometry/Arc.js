
function Arc(shell, wedge)
{
	this.shell = shell;
	this.wedge = wedge;
	
	this._collider = new ShapeGroupAll
	([
		this.shell,
		this.wedge
	]);
}
{
	Arc.prototype.collider = function()
	{
		return this._collider;
	}
}
