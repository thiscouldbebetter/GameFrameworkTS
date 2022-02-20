
namespace ThisCouldBeBetter.GameFramework
{

export class MapLocated implements ShapeBase
{
	map: MapOfCells<any>;
	loc: Disposition;

	box: Box;

	constructor(map: MapOfCells<any>, loc: Disposition)
	{
		this.map = map;
		this.loc = loc;

		this.box = new Box(this.loc.pos, this.map.size);
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

	// Equatable

	equals(other: ShapeBase): boolean { return false; } // todo

	// translatable

	coordsGroupToTranslate(): Coords[]
	{
		return [ this.loc.pos ];
	}

	// ShapeBase.

	collider(): ShapeBase { return null; }

	locate(loc: Disposition): ShapeBase
	{
		return ShapeHelper.Instance().applyLocationToShapeDefault(loc, this);
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

	toBox(boxOut: Box): Box { throw new Error("Not implemented!"); }

	// Transformable.

	transform(transformToApply: TransformBase): MapLocated
	{
		throw new Error("Not implemented!");
	}
}

}
