
namespace ThisCouldBeBetter.GameFramework
{

export interface ShapeBase
	extends Clonable<ShapeBase>, Equatable<ShapeBase>, Transformable<ShapeBase>
{
	collider(): ShapeBase;
	containsPoint(pointToCheck: Coords): boolean;
	normalAtPos(posToCheck: Coords, normalOut: Coords): Coords;
	pointRandom(randomizer: Randomizer): Coords;
	surfacePointNearPos(posToCheck: Coords, surfacePointOut: Coords): Coords;
	toBox(boxOut: Box): Box;
}

}
