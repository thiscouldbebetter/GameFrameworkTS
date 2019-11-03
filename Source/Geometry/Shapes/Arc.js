
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
	};

	// cloneable

	Arc.prototype.clone = function()
	{
		return new Arc(this.shell.clone(), this.wedge.clone());
	};

	Arc.prototype.overwriteWith = function(other)
	{
		this.shell.overwriteWith(other.shell);
		this.wedge.overwriteWith(other.wedge);
		return this;
	};

	// transformable

	Arc.prototype.coordsGroupToTranslate = function()
	{
		return [ this.shell.sphereOuter.center, this.wedge.vertex ];
	}
}
