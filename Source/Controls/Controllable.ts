
namespace ThisCouldBeBetter.GameFramework
{

export class Controllable extends EntityPropertyBase<Controllable>
{
	_toControl:
	(
		uwpe: UniverseWorldPlaceEntities,
		size: Coords,
		controlTypeName: string
	) => ControlBase;

	constructor
	(
		toControl:
		(
			uwpe: UniverseWorldPlaceEntities,
			size: Coords,
			controlTypeName: string
		) => ControlBase
	)
	{
		super();

		this.toControl = toControl;
	}

	static fromToControl
	(
		toControl:
		(
			uwpe: UniverseWorldPlaceEntities,
			size: Coords,
			controlTypeName: string
		) => ControlBase
	): Controllable
	{
		return new Controllable(toControl);
	}

	static of(entity: Entity): Controllable
	{
		return entity.propertyByName(Controllable.name) as Controllable;
	}

	toControl
	(
		uwpe: UniverseWorldPlaceEntities,
		size: Coords,
		controlTypeName: string
	): ControlBase
	{
		var control =
			(this._toControl == null)
			? ControlNone.create()
			: this._toControl(uwpe, size, controlTypeName);

		return control;
	}

	// Clonable.

	clone(): Controllable { return this; }
}

}
