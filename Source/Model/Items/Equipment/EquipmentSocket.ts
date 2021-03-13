
namespace ThisCouldBeBetter.GameFramework
{

export class EquipmentSocket
{
	defnName: string;
	itemEntityEquipped: Entity;

	constructor(defnName: string, itemEntityEquipped: Entity)
	{
		this.defnName = defnName;
		this.itemEntityEquipped = itemEntityEquipped;
	}

	defn(defnGroup: EquipmentSocketDefnGroup)
	{
		return defnGroup.socketDefnsByName.get(this.defnName);
	}

	toString(world: World)
	{
		var itemEntityEquippedAsString =
		(
			this.itemEntityEquipped == null
			? " [empty] "
			: this.itemEntityEquipped.item().toString(world)
		);
		var returnValue = this.defnName + ": " + itemEntityEquippedAsString;
		return returnValue;
	}
}

}
