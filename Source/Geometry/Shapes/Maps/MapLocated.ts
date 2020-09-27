
class MapLocated implements ShapeBase
{
	map: MapOfCells;
	loc: Disposition;

	box: Box;

	constructor(map: MapOfCells, loc: Disposition)
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

	normalAtPos(posToCheck: Coords, normalOut: Coords): Coords
	{
		return normalOut.overwriteWith(posToCheck).subtract(this.loc.pos).normalize();
	}

	surfacePointNearPos(posToCheck: Coords, surfacePointOut: Coords)
	{
		return surfacePointOut.overwriteWith(posToCheck); // todo
	}
}
