
namespace ThisCouldBeBetter.GameFramework
{

export class VisualDynamic implements Visual
{
	methodForVisual: (uwpe: UniverseWorldPlaceEntities) => Visual;

	constructor(methodForVisual: (uwpe: UniverseWorldPlaceEntities) => Visual)
	{
		this.methodForVisual = methodForVisual;
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var visual = this.methodForVisual.call(this, uwpe);
		visual.draw(uwpe, display);
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
