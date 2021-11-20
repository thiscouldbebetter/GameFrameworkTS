
namespace ThisCouldBeBetter.GameFramework
{

export class VisualRotate implements Visual<VisualRotate>
{
	child: VisualBase;

	constructor(child: VisualBase)
	{
		this.child = child;
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var entity = uwpe.entity;

		display.stateSave();

		var entityLoc = entity.locatable().loc;

		var rotationInTurns = entityLoc.orientation.forward.headingInTurns();
		display.rotateTurnsAroundCenter
		(
			rotationInTurns, entityLoc.pos
		);

		this.child.draw(uwpe, display);

		display.stateRestore();
	}

	// Clonable.

	clone(): VisualRotate
	{
		return this; // todo
	}

	overwriteWith(other: VisualRotate): VisualRotate
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualRotate
	{
		return this; // todo
	}
}

}
