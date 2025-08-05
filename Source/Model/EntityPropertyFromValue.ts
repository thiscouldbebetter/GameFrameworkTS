
namespace ThisCouldBeBetter.GameFramework
{

export class EntityPropertyFromValue<TValue>
	extends EntityPropertyBase<EntityPropertyFromValue<TValue>>
{
	value: TValue;

	constructor(value: TValue)
	{
		super();

		this.value = value;
	}

	static entityFromValue<TValue>(value: TValue): Entity
	{
		return new Entity
		(
			EntityPropertyFromValue.name,
			[ new EntityPropertyFromValue(value) ]
		);
	}

	static valueFromEntity<TValue>(entity: Entity): TValue
	{
		return (entity.properties[0] as EntityPropertyFromValue<TValue>).value;
	}

	// Clonable.

	clone(): EntityPropertyFromValue<TValue>
	{
		return new EntityPropertyFromValue(this.value)
	}

	overwriteWith
	(
		other: EntityPropertyFromValue<TValue>
	) : EntityPropertyFromValue<TValue>
	{
		this.value = other.value;
		return this;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	propertyName(): string { return EntityPropertyFromValue.name; }
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: EntityPropertyFromValue<TValue>): boolean
	{
		return this.value == other.value;
	}
}

}
