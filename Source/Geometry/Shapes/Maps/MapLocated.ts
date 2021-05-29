
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

	clone()
	{
		return new MapLocated(this.map, this.loc.clone());
	}

	overwriteWith(other: MapLocated)
	{
		this.loc.overwriteWith(other.loc);
		return this;
	}

	// translatable

	coordsGroupToTranslate()
	{
		return [ this.loc.pos ];
	}

	// Shape.

	locate(loc: Disposition): ShapeBase
	{
		return ShapeHelper.Instance().applyLocationToShapeDefault(loc, this);
	}

	normalAtPos(posToCheck: Coords, normalOut: Coords): Coords
	{
		return normalOut.overwriteWith(posToCheck).subtract(this.loc.pos).normalize();
	}

	surfacePointNearPos(posToCheck: Coords, surfacePointOut: Coords)
	{
		return surfacePointOut.overwriteWith(posToCheck); // todo
	}

	toBox(boxOut: Box): Box { throw new Error("Not implemented!"); }

	// Transformable.

	transform(transformToApply: Transform): Transformable
	{
		throw new Error("Not implemented!");
	}
}

}
