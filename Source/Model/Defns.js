
function Defns(constraintDefns, placeDefns)
{
	this.constraintDefns = constraintDefns.addLookupsByName();
	this.placeDefns = placeDefns.addLookupsByName();
}
