
namespace ThisCouldBeBetter.GameFramework
{

export class MapCellCollidable implements MapCell
{
	isBlocking: boolean;

	constructor()
	{
		this.isBlocking = false;
	}

	clone(): MapCellCollidable { throw new Error("todo"); }
	overwriteWith(other: MapCellCollidable): MapCellCollidable { throw new Error("todo"); }
}

}