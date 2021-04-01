
namespace ThisCouldBeBetter.GameFramework
{

export class Collision
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

	static create()
	{
		return new Collision
		(
			Coords.create(), 0, new Array<ShapeBase>(), new Array<Entity>()
		);
	}

	clear()
	{
		this.isActive = false;
		ArrayHelper.clear(this.entitiesColliding);
		ArrayHelper.clear(this.colliders);
		this.collidersByName.clear();
		return this;
	}

	equals(other: Collision)
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
