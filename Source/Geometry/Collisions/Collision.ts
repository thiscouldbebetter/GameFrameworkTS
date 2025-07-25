
namespace ThisCouldBeBetter.GameFramework
{

export class Collision //
{
	pos: Coords;
	distanceToCollision: number;
	colliders: Shape[];
	collidersByName: Map<string, Shape>;
	entitiesColliding: Entity[];

	normals: Coords[];
	isActive: boolean;

	constructor
	(
		pos: Coords,
		distanceToCollision: number,
		colliders: Shape[],
		entitiesColliding: Entity[]
	)
	{
		this.pos = pos || Coords.create();
		this.distanceToCollision = distanceToCollision;
		this.colliders = colliders || new Array<Shape>();
		this.entitiesColliding = entitiesColliding || new Array<Entity>();

		this.collidersByName = new Map<string, Shape>();
		this.normals = [ Coords.create(), Coords.create() ];

		this.isActive = false;
	}

	static create(): Collision
	{
		return new Collision
		(
			null, null, null, null
		);
	}

	static fromEntitiesColliding(entityColliding: Entity, entityCollidedWith: Entity): Collision
	{
		var entitiesColliding = [ entityColliding, entityCollidedWith ];
		return new Collision(null, null, null, entitiesColliding);
	}

	static fromPosAndDistance(pos: Coords, distance: number): Collision
	{
		return new Collision(pos, distance, null, null);
	}

	clear(): Collision
	{
		this.isActive = false;
		ArrayHelper.clear(this.entitiesColliding);
		ArrayHelper.clear(this.colliders);
		this.normals.forEach(x => x.clear());
		this.collidersByName.clear();
		this.distanceToCollision = null;
		return this;
	}

	entityCollidableAdd(entity: Entity): Collision
	{
		return this.entityCollidingAdd(entity);
	}

	entityCollidingAdd(entity: Entity): Collision
	{
		this.entitiesColliding.push(entity);
		return this;
	}

	entityIsInvolved(entityToCheck: Entity): boolean
	{
		return (this.entitiesColliding.indexOf(entityToCheck) >= 0);
	}

	toString(): string
	{
		return this.entitiesColliding.map(x => x.name).join("+");
	}

	// Equatable.

	equals(other: Collision): boolean
	{
		var returnValue =
		(
			this.isActive == other.isActive
			&&
			(
				this.isActive == false
				||
				(
					this.pos.equals(other.pos)
					&& this.distanceToCollision == other.distanceToCollision
					&& ArrayHelper.equals(this.colliders, other.colliders)
				)
			)
		);

		return returnValue;
	}

	// Clonable.

	clone(): Collision
	{
		var returnValue = new Collision
		(
			this.pos.clone(),
			this.distanceToCollision,
			this.colliders.map(x => x),
			this.entitiesColliding.map(x => x)
		);

		// hack
		returnValue.collidersByName = this.collidersByName;
		returnValue.normals = ArrayHelper.clone(this.normals);
		returnValue.isActive = this.isActive;

		return returnValue;
	}
}

}
