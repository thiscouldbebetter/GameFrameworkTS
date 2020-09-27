
interface ShapeBase extends Clonable<ShapeBase>
{
	normalAtPos(posToCheck: Coords, normalOut: Coords): Coords;
	surfacePointNearPos(posToCheck: Coords, surfacePointOut: Coords): Coords;
}
