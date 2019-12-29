
function MapLocated(map, loc)
{
	this.map = map;
	this.loc = loc;

	this.box = new Box(this.loc.pos, this.map.size);
}

{
	// cloneable

	MapLocated.prototype.clone = function()
	{
		return new MapLocated(this.map, this.loc.clone());
	};

	MapLocated.prototype.overwriteWith = function(other)
	{
		this.loc.overwriteWith(other.loc);
	};

	// translatable

	MapLocated.prototype.coordsGroupToTranslate = function()
	{
		return [ this.loc.pos ];
	};
}
