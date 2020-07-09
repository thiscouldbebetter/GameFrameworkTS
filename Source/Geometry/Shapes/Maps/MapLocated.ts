
class MapLocated
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
	};

	overwriteWith(other: MapLocated)
	{
		this.loc.overwriteWith(other.loc);
	};

	// translatable

	coordsGroupToTranslate()
	{
		return [ this.loc.pos ];
	};
}
