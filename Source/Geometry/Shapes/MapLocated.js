
class MapLocated
{
	constructor(map, loc)
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

	overwriteWith(other)
	{
		this.loc.overwriteWith(other.loc);
	};

	// translatable

	coordsGroupToTranslate()
	{
		return [ this.loc.pos ];
	};
}
