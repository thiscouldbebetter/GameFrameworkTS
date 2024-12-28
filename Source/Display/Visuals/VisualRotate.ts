
namespace ThisCouldBeBetter.GameFramework
{

export class VisualRotate implements Visual<VisualRotate>
{
	child: VisualBase;
	_rotationInTurnsGet: (uwpe: UniverseWorldPlaceEntities) => number;

	constructor
	(
		child: VisualBase,
		rotationInTurnsGet: (uwpe: UniverseWorldPlaceEntities) => number
	)
	{
		this.child = child;
		this._rotationInTurnsGet = rotationInTurnsGet;
	}

	static fromChild(child: VisualBase): VisualRotate
	{
		return new VisualRotate(child, null);
	}

	rotationInTurnsGet(uwpe: UniverseWorldPlaceEntities): number
	{
		var rotationInTurns = 0;
		if (this._rotationInTurnsGet == null)
		{
			var entity = uwpe.entity;
			var entityLoc = Locatable.of(entity).loc;
			rotationInTurns = entityLoc.orientation.forward.headingInTurns();
		}
		else
		{
			rotationInTurns = this._rotationInTurnsGet(uwpe);
		}
		return rotationInTurns;
	}

	// Visual.

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var entity = uwpe.entity;

		var entityLoc = Locatable.of(entity).loc;

		var rotationInTurns = this.rotationInTurnsGet(uwpe);

		display.stateSave();

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
