
class Arc
{
	constructor(shell, wedge)
	{
		this.shell = shell;
		this.wedge = wedge;

		this._collider = new ShapeGroupAll
		([
			this.shell,
			this.wedge
		]);
	}

	collider()
	{
		return this._collider;
	};

	// cloneable

	clone()
	{
		return new Arc(this.shell.clone(), this.wedge.clone());
	};

	overwriteWith(other)
	{
		this.shell.overwriteWith(other.shell);
		this.wedge.overwriteWith(other.wedge);
		return this;
	};

	// transformable

	coordsGroupToTranslate()
	{
		return [ this.shell.sphereOuter.center, this.wedge.vertex ];
	}
}
