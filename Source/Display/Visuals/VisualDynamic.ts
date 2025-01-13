
namespace ThisCouldBeBetter.GameFramework
{

export class VisualDynamic implements Visual<VisualDynamic>
{
	methodForVisual: (uwpe: UniverseWorldPlaceEntities) => VisualBase;

	constructor(methodForVisual: (uwpe: UniverseWorldPlaceEntities) => VisualBase)
	{
		this.methodForVisual = methodForVisual;
	}

	// Visual.

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		// Do nothing.
	}

	initializeIsComplete(uwpe: UniverseWorldPlaceEntities): boolean
	{
		var visual = this.methodForVisual.call(this, uwpe);
		var visualIsInitialized = visual.initializeIsComplete(uwpe);
		return visualIsInitialized;
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var visual = this.methodForVisual.call(this, uwpe);
		visual.draw(uwpe, display);
	}

	// Clonable.

	clone(): VisualDynamic
	{
		return this; // todo
	}

	overwriteWith(other: VisualDynamic): VisualDynamic
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualDynamic
	{
		return this; // todo
	}
}

}
