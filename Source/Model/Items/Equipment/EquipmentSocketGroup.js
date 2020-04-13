
class EquipmentSocketGroup
{
	constructor(defnGroup)
	{
		this.defnGroup = defnGroup;
		this.sockets = [];

		var socketDefns = this.defnGroup.socketDefns;

		for (var i = 0; i < socketDefns.length; i++)
		{
			var socketDefn = socketDefns[i];

			var socket = new EquipmentSocket(socketDefn.name, null);

			this.sockets.push(socket);
		};

		this.sockets.addLookups(x => x.defnName);
	}
}
