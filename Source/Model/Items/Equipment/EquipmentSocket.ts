
namespace ThisCouldBeBetter.GameFramework
{

export class EquipmentSocket //
{
	defnName: string;
	itemEntityEquipped: Entity;

	constructor(defnName: string, itemEntityEquipped: Entity)
	{
		this.defnName = defnName;
		this.itemEntityEquipped = itemEntityEquipped;
	}

	defn(defnGroup: EquipmentSocketDefnGroup): EquipmentSocketDefn
	{
		return defnGroup.socketDefnsByName.get(this.defnName);
	}

	toString(world: World): string
	{
		var itemEntityEquippedAsString =
		(
			this.itemEntityEquipped == null
			? "[empty]"
			: Item.of(this.itemEntityEquipped).toString(world)
		);
		var returnValue = this.defnName + ": " + itemEntityEquippedAsString;
		return returnValue;
	}

	unequip(): void
	{
		this.itemEntityEquipped = null;
	}
}

}
