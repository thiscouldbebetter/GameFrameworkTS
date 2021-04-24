
namespace ThisCouldBeBetter.GameFramework
{

export class Controllable implements EntityProperty
{
	toControl: any;

	constructor(toControl: any)
	{
		this.toControl = toControl;
	}

	// EntityProperty.

	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void {}
}

}
