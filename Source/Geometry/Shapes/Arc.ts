
class Arc implements ShapeBase
{
	shell: Shell;
	wedge: Wedge;

	_collider: ShapeGroupAll;

	constructor(shell: Shell, wedge: Wedge)
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

	overwriteWith(other: Arc)
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

	// Shape.

	normalAtPos(posToCheck: Coords, normalOut: Coords)
	{
		return this.shell.normalAtPos(posToCheck, normalOut);
	}
}
