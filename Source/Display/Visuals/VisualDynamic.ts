
namespace ThisCouldBeBetter.GameFramework
{

export class VisualDynamic extends VisualBase<VisualDynamic>
{
	_visualGet: (uwpe: UniverseWorldPlaceEntities) => Visual;

	constructor(visualGet: (uwpe: UniverseWorldPlaceEntities) => Visual)
	{
		super();

		this._visualGet = visualGet;
	}

	static fromVisualGet(visualGet: (uwpe: UniverseWorldPlaceEntities) => Visual): VisualDynamic
	{
		return new VisualDynamic(visualGet);
	}

	visualGet(uwpe: UniverseWorldPlaceEntities): Visual
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
