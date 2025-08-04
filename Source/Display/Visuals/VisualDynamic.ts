
namespace ThisCouldBeBetter.GameFramework
{

export class VisualDynamic implements Visual<VisualDynamic>
{
	_visualGet: (uwpe: UniverseWorldPlaceEntities) => VisualBase;

	constructor(visualGet: (uwpe: UniverseWorldPlaceEntities) => VisualBase)
	{
		this._visualGet = visualGet;
	}

	static fromVisualGet(visualGet: (uwpe: UniverseWorldPlaceEntities) => VisualBase): VisualDynamic
	{
		return new VisualDynamic(visualGet);
	}

	visualGet(uwpe: UniverseWorldPlaceEntities): VisualBase
	{
		return this._visualGet(uwpe);
	}

	// Visual.

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		// Do nothing.
	}

	initializeIsComplete(uwpe: UniverseWorldPlaceEntities): boolean
	{
		var visual = this.visualGet(uwpe);
		var visualIsInitialized = visual.initializeIsComplete(uwpe);
		return visualIsInitialized;
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var visual = this.visualGet(uwpe);
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
