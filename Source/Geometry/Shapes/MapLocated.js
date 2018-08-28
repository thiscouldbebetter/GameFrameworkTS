
function MapLocated(map, loc)
{
	this.map = map;
	this.loc = loc;

	this.bounds = new Bounds(this.loc.pos, this.map.size);
}