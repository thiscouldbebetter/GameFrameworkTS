
namespace ThisCouldBeBetter.GameFramework
{

export class Arc implements ShapeBase
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

	static default(): Arc
	{
		return new Arc(Shell.default(), Wedge.default() );
	}
	
	static fromShellAndWedge(shell: Shell, wedge: Wedge): Arc
	{
		return new Arc(shell, wedge);
	}

	center(): Coords
	{
		return this.shell.center();
	}

	collider(): ShapeGroupAll
	{
		return this._collider;
	}

	// cloneable

	clone(): Arc
	{
		return new Arc(this.shell.clone(), this.wedge.clone());
	}

	equals(other: Arc): boolean
	{
		var returnValue =
		(
			this.shell.equals(other.shell)
			&& this.wedge.equals(other.wedge)
		);

		return returnValue;
	}

	overwriteWith(other: Arc): Arc
	{
		this.shell.overwriteWith(other.shell);
		this.wedge.overwriteWith(other.wedge);
		return this;
	}

	// Transformable.

	coordsGroupToTranslate(): Coords[]
	{
		return [ this.shell.center(), this.wedge.vertex ];
	}

	// ShapeBase.

	locate(loc: Disposition): ShapeBase
	{
		var directionMin = this.wedge.directionMin;
		directionMin.overwriteWith(loc.orientation.forward);
		return ShapeHelper.Instance().applyLocationToShapeDefault(loc, this);
	}

	normalAtPos(posToCheck: Coords, normalOut: Coords): Coords
	{
		return this.shell.normalAtPos(posToCheck, normalOut);
	}

	surfacePointNearPos(posToCheck: Coords, surfacePointOut: Coords): Coords
	{
		return surfacePointOut.overwriteWith(posToCheck); // todo
	}

	toBox(boxOut: Box): Box
	{
		return this.shell.toBox(boxOut);
	}

	// Transformable.

	transform(transformToApply: Transform): Transformable
	{
		throw new Error("Not implemented!");
	}
}

}
