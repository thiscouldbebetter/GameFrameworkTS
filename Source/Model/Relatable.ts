
namespace ThisCouldBeBetter.GameFramework
{

export class Relatable extends EntityPropertyBase<Relatable>
{
	relationshipName: string;
	entityRelatedId: number;

	constructor(relationshipName: string, entityRelatedId: number)
	{
		super();

		this.relationshipName = relationshipName;
		this.entityRelatedId = entityRelatedId;
	}

	static fromRelationshipNameAndEntityRelatedId
	(
		relationshipName: string, entityRelatedId: number
	): Relatable
	{
		return new Relatable(relationshipName, entityRelatedId);
	}

	static of(entity: Entity): Relatable
	{
		return entity.propertyByName(Relatable.name) as Relatable;
	}

	// Clonable.

	clone(): Relatable
	{
		return new Relatable(this.relationshipName, this.entityRelatedId);
	}

	overwriteWith(other: Relatable): Relatable
	{
		this.relationshipName = other.relationshipName;
		this.entityRelatedId = other.entityRelatedId;
		return this;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	propertyName(): string { return Relatable.name; }
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable.

	equals(other: Relatable)
	{
		var returnValue =
			this.relationshipName == other.relationshipName
			&& this.entityRelatedId == other.entityRelatedId;
		return returnValue;
	}
}

}
