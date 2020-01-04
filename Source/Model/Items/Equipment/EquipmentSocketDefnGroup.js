
function EquipmentSocketDefnGroup(name, socketDefns)
{
	this.name = name;
	this.socketDefns = socketDefns.addLookupsByName();
}
