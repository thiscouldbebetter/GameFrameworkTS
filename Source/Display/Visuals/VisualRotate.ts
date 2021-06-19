
namespace ThisCouldBeBetter.GameFramework
{

export class VisualRotate implements Visual
{
	child: Visual;

	constructor(child: Visual)
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

	clone(): Visual
	{
		return this; // todo
	}

	overwriteWith(other: Visual): Visual
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: Transform): Transformable
	{
		return this; // todo
	}
}

}
