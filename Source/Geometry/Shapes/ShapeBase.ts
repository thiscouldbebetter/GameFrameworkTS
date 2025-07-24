
namespace ThisCouldBeBetter.GameFramework
{

export class ShapeBase implements Shape
{
	throwNotImplementedError(): void
	{
		throw new Error("Should be implemented in subclass.");
	}

	collider(): Shape { return null; }
	containsPoint(pointToCheck: Coords): boolean { throw new Error("Should be implemented in subclass."); }
	drawToDisplayAtPos(display: Display, drawPos: Coords): void { throw new Error("Should be implemented in subclass."); }
	normalAtPos(posToCheck: Coords, normalOut: Coords): Coords { throw new Error("Should be implemented in subclass."); }
	pointRandom(randomizer: Randomizer): Coords { throw new Error("Should be implemented in subclass."); }
	surfacePointNearPos(posToCheck: Coords, surfacePointOut: Coords): Coords { throw new Error("Should be implemented in subclass."); }
	toBoxAxisAligned(boxOut: BoxAxisAligned): BoxAxisAligned { throw new Error("Should be implemented in subclass."); }

	// Clonable.
	clone(): Shape { throw new Error("Should be implemented in subclass."); }
	overwriteWith(other: Shape): Shape { throw new Error("Should be implemented in subclass."); }

	// Equatable.
	equals(other: Shape): boolean { throw new Error("Should be implemented in subclass."); }

	// Transformable.
	transform(transformToApply: TransformBase): Shape { throw new Error("Should be implemented in subclass."); }
}

}
