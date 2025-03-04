
namespace ThisCouldBeBetter.GameFramework
{

export class VisualDeferred implements Visual<VisualDeferred>
{
	_visualGet: (uwpe: UniverseWorldPlaceEntities) => VisualBase;

	_visualCached: VisualBase;

	constructor
	(
		visualGet: (uwpe: UniverseWorldPlaceEntities) => VisualBase
	)
	{
		this._visualGet = visualGet;
	}

	visualGet(uwpe: UniverseWorldPlaceEntities): VisualBase
	{
		if (this._visualCached == null)
		{
			this._visualCached = this._visualGet(uwpe);
		}

		return this._visualCached;
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

	clone(): VisualDeferred
	{
		return new VisualDeferred(this._visualGet);
	}

	overwriteWith(other: VisualDeferred): VisualDeferred
	{
		this._visualGet = other._visualGet;
		return this;
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualDeferred
	{
		return this; // todo
	}
}

}
