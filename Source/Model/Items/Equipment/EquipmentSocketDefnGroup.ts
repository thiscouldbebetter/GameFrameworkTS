
namespace ThisCouldBeBetter.GameFramework
{

export class EquipmentSocketDefnGroup
{
	name: string;
	socketDefns: EquipmentSocketDefn[];
	socketDefnsByName: Map<string, EquipmentSocketDefn>;

	constructor(name: string, socketDefns: EquipmentSocketDefn[])
	{
		this.name = name;
		this.socketDefns = socketDefns;
		this.socketDefnsByName = ArrayHelper.addLookupsByName(this.socketDefns);
	}
}

}
