
interface ShapeBase extends Clonable<ShapeBase>
{
	normalAtPos(posToCheck: Coords, normalOut: Coords): Coords;
}
