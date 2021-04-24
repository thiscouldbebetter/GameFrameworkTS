
namespace ThisCouldBeBetter.GameFramework
{

export class VisualRotate implements Visual
{
	child: Visual;

	constructor(child: Visual)
	{
		this.child = child;
	}

	draw(universe: Universe, world: World, place: Place, entity: Entity, display: Display)
	{
		display.stateSave();

		var entityLoc = entity.locatable().loc;

		var rotationInTurns = entityLoc.orientation.forward.headingInTurns();
		display.rotateTurnsAroundCenter
		(
			rotationInTurns, entityLoc.pos
		);

		this.child.draw(universe, world, place, entity, display);

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
