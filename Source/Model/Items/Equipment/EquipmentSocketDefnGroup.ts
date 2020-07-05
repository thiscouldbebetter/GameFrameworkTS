
class EquipmentSocketDefnGroup
{
	name: string;
	socketDefns: EquipmentSocketDefn[];
	socketDefnsByName: any;

	constructor(name, socketDefns)
	{
		this.name = name;
		this.socketDefns = socketDefns;
		this.socketDefnsByName = ArrayHelper.addLookupsByName(this.socketDefns);
	}
}
