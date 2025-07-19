
namespace ThisCouldBeBetter.GameFramework
{

export class MapLocated implements ShapeBase
{
	map: MapOfCells<any>;
	loc: Disposition;

	box: BoxAxisAligned;

	_boxTransformed: BoxAxisAligned;

	constructor(map: MapOfCells<any>, loc: Disposition)
	{
		this.map = map;
		this.loc = loc;

		this.box = new BoxAxisAligned(this.loc.pos, this.map.size);

		// Helper variables.
		this._boxTransformed = BoxAxisAligned.create();
	}

	static fromMap(map: MapOfCells<any>): MapLocated
	{
		return new MapLocated(map, Disposition.default());
	}

	cellsInBox(box: BoxAxisAligned, cellsInBox: MapCell[]): MapCell[]
	{
		var boxTransformed =
			this._boxTransformed.overwriteWith(box);
		boxTransformed.center.subtract(this.loc.pos).add(this.map.sizeHalf);
		var returnCells =
			this.map.cellsInBox(boxTransformed, cellsInBox);
		return returnCells;
	}

	// cloneable

	clone(): MapLocated
	{
		return new MapLocated(this.map, this.loc.clone());
	}

	overwriteWith(other: MapLocated): MapLocated
	{
		this.loc.overwriteWith(other.loc);
		return this;
	}

	// Equatable.

	equals(other: ShapeBase): boolean { return false; } // todo

	// Transformable.

	coordsGroupToTransform(): Coords[]
	{
		return [ this.loc.pos ];
	}

	// ShapeBase.

	collider(): ShapeBase { return null; }

	containsPoint(pointToCheck: Coords): boolean
	{
		throw new Error("Not yet implemented!");
	}

	normalAtPos(posToCheck: Coords, normalOut: Coords): Coords
	{
		return normalOut.overwriteWith(posToCheck).subtract(this.loc.pos).normalize();
	}

	pointRandom(randomizer: Randomizer): Coords
	{
		return null; // todo
	}

	surfacePointNearPos(posToCheck: Coords, surfacePointOut: Coords)
	{
		return surfacePointOut.overwriteWith(posToCheck); // todo
	}

	toBoxAxisAligned(boxOut: BoxAxisAligned): BoxAxisAligned { throw new Error("Not implemented!"); }

	// Transformable.

	transform(transformToApply: TransformBase): MapLocated
	{
		transformToApply.transformCoords(this.loc.pos);
		return this;
	}
}

export class MapLocated2 extends MapLocated
{
	// hack - To allow different collision calculations.

	constructor(map: MapOfCells<any>, loc: Disposition)
	{
		super(map, loc);
	}

	static fromMap(map: MapOfCells<any>): MapLocated
	{
		return new MapLocated2(map, Disposition.default());
	}

	// Cloneable.

	clone(): MapLocated2
	{
		return new MapLocated2(this.map, this.loc.clone());
	}

	overwriteWith(other: MapLocated2): MapLocated2
	{
		this.loc.overwriteWith(other.loc);
		return this;
	}
}

}
