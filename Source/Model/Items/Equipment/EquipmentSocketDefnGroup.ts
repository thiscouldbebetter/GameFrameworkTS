
class EquipmentSocketDefnGroup
{
	constructor(name, socketDefns)
	{
		this.name = name;
		this.socketDefns = socketDefns.addLookupsByName();
	}
}
