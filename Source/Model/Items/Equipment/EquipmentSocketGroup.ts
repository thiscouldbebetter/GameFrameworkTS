
namespace ThisCouldBeBetter.GameFramework
{

export class EquipmentSocketGroup
{
	defnGroup: EquipmentSocketDefnGroup;
	sockets: EquipmentSocket[];
	socketsByDefnName: Map<string, EquipmentSocket>;

	constructor(defnGroup: EquipmentSocketDefnGroup)
	{
		this.defnGroup = defnGroup;
		this.sockets = [];

		var socketDefns = this.defnGroup.socketDefns;

		for (var i = 0; i < socketDefns.length; i++)
		{
			var socketDefn = socketDefns[i];

			var socket = new EquipmentSocket(socketDefn.name, null);

			this.sockets.push(socket);
		}

		this.socketsByDefnName = ArrayHelper.addLookups
		(
			this.sockets, (x: EquipmentSocket) => x.defnName
		);
	}
}

}
