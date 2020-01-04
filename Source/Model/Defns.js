
function Defns(itemDefns, placeDefns)
{
	this.itemDefns = itemDefns.addLookupsByName();
	this.placeDefns = placeDefns.addLookupsByName();
}
