
function Defns(constraintDefns, itemDefns, placeDefns)
{
	this.constraintDefns = constraintDefns.addLookupsByName();
	this.itemDefns = itemDefns.addLookupsByName();
	this.placeDefns = placeDefns.addLookupsByName();
}
