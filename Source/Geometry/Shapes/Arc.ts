
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

	// cloneable

	clone(): Arc
	{
		return new Arc(this.shell.clone(), this.wedge.clone());
	}

	overwriteWith(other: Arc): Arc
	{
		this.shell.overwriteWith(other.shell);
		this.wedge.overwriteWith(other.wedge);
		return this;
	}

	// Equatable.

	equals(other: Arc): boolean
	{
		var returnValue =
		(
			this.shell.equals(other.shell)
			&& this.wedge.equals(other.wedge)
		);

		return returnValue;
	}

	// Transformable.

	coordsGroupToTransform(): Coords[]
	{
		return [ this.shell.center(), this.wedge.vertex ];
	}

	// ShapeBase.

	collider(): ShapeGroupAll
	{
		return this._collider;
	}

	containsPoint(pointToCheck: Coords): boolean
	{
		throw new Error("Not yet implemented!");
	}

	normalAtPos(posToCheck: Coords, normalOut: Coords): Coords
	{
		return this.shell.normalAtPos(posToCheck, normalOut);
	}

	pointRandom(randomizer: Randomizer): Coords
	{
		return null; // todo
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

	transform(transformToApply: TransformBase): Arc
	{
		throw new Error("Not implemented!");
	}
}

}
