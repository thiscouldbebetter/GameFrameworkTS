
namespace ThisCouldBeBetter.GameFramework
{

export class Collision //
{
	pos: Coords;
	distanceToCollision: number;
	colliders: ShapeBase[];
	collidersByName: Map<string,ShapeBase>;
	entitiesColliding: Entity[];

	normals: Coords[];
	isActive: boolean;

	constructor
	(
		pos: Coords,
		distanceToCollision: number,
		colliders: ShapeBase[],
		entitiesColliding: Entity[]
	)
	{
		this.pos = pos || Coords.create();
		this.distanceToCollision = distanceToCollision;
		this.colliders = colliders || new Array<ShapeBase>();
		this.entitiesColliding = entitiesColliding || new Array<Entity>();

		this.collidersByName = new Map<string,ShapeBase>();
		this.normals = [ Coords.create(), Coords.create() ];

		this.isActive = false;
	}

	static create(): Collision
	{
		return new Collision
		(
			Coords.create(), 0, new Array<ShapeBase>(), new Array<Entity>()
		);
	}

	static fromPosAndDistance(pos: Coords, distance: number): Collision
	{
		return new Collision(pos, distance, [], []);
	}

	clear(): Collision
	{
		this.isActive = false;
		ArrayHelper.clear(this.entitiesColliding);
		ArrayHelper.clear(this.colliders);
		ArrayHelper.clear(this.normals);
		this.collidersByName.clear();
		this.distanceToCollision = null;
		return this;
	}

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
}

}
