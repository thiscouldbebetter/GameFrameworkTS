
class EquipmentSocketDefnGroup
{
	name: string;
	socketDefns: EquipmentSocketDefn[];
	socketDefnsByName: any;

	constructor(name: string, socketDefns: EquipmentSocketDefn[])
	{
		this.name = name;
		this.socketDefns = socketDefns;
		this.socketDefnsByName = ArrayHelper.addLookupsByName(this.socketDefns);
	}
}
