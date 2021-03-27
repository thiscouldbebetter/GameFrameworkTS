
namespace ThisCouldBeBetter.GameFramework
{

export interface ShapeBase extends Clonable<ShapeBase>
{
	locate(loc: Disposition): ShapeBase;
	normalAtPos(posToCheck: Coords, normalOut: Coords): Coords;
	surfacePointNearPos(posToCheck: Coords, surfacePointOut: Coords): Coords;
	toBox(boxOut: Box): Box;
}

}
