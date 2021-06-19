
namespace ThisCouldBeBetter.GameFramework
{

export class PlaceZoned extends Place
{
	entityToFollowName: string;
	zoneStartName: string;
	zoneGetByName: (zoneName: string) => Zone;
	zoneAtPos: (posToCheck: Coords) => Zone;

	zoneCentral: Zone;
	zoneCentralAndNeighbors: Zone[];

	constructor
	(
		name: string,
		defnName: string,
		size: Coords,
		entityToFollowName: string,
		zoneStartName: string,
		zoneGetByName: (zoneName: string) => Zone,
		zoneAtPos: (posToCheck: Coords) => Zone
	)
	{
		super
		(
			name,
			defnName,
			size,
			[] // entities
		);

		this.entityToFollowName = entityToFollowName;
		this.zoneStartName = zoneStartName;
		this.zoneGetByName = zoneGetByName;
		this.zoneAtPos = zoneAtPos;
		this.zoneCentralAndNeighbors = [];
	}

	// Place implementation.

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		var zoneStart = this.zoneGetByName(this.zoneStartName);
		this.entitiesToSpawnAdd(zoneStart.entities);
		super.initialize(uwpe);
	}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		var entityToFollow = this.entitiesByName.get(this.entityToFollowName);
		var entityToFollowPos = entityToFollow.locatable().loc.pos;
		var zoneCentralCurrent = this.zoneAtPos(entityToFollowPos);
		if (zoneCentralCurrent != null && zoneCentralCurrent != this.zoneCentral)
		{
			this.zoneCentral = zoneCentralCurrent;
			var zonesNeighboringZoneCentral = this.zoneCentral.zonesAdjacentNames.map
			(
				zoneName => this.zoneGetByName(zoneName)
			);
			var zoneCentralAndNeighborsNext = [ this.zoneCentral ];
			zoneCentralAndNeighborsNext.push(...zonesNeighboringZoneCentral);
			var zoneCentralAndNeighborsPrev = this.zoneCentralAndNeighbors;

			var zonesToFinalize = zoneCentralAndNeighborsPrev.filter
			(
				x => zoneCentralAndNeighborsNext.indexOf(x) == -1
			);
			var zonesToInitialize = zoneCentralAndNeighborsNext.filter
			(
				x => zoneCentralAndNeighborsPrev.indexOf(x) == -1
			);

			zonesToFinalize.forEach
			(
				zone =>
				{
					zone.entities.forEach
					(
						entity =>
						{
							entity.locatable().loc.pos.subtract(zone.bounds.min());
							this.entitiesToRemove.push(entity);
						}
					)
				}
			);

			zonesToInitialize.forEach
			(
				zone =>
				{
					zone.entities.forEach
					(
						entity =>
						{
							entity.locatable().loc.pos.add(zone.bounds.min());
							this.entityToSpawnAdd(entity);
						}
					)
				}
			);

			this.zoneCentralAndNeighbors = zoneCentralAndNeighborsNext;
		}

		super.updateForTimerTick(uwpe);
	}
}

export class Zone
{
	name: string;
	bounds: Box;
	zonesAdjacentNames: string[];
	entities: Entity[];

	constructor(name: string, bounds: Box, zonesAdjacentNames: string[], entities: Entity[])
	{
		this.name = name;
		this.bounds = bounds;
		this.zonesAdjacentNames = zonesAdjacentNames;
		this.entities = entities;
	}
}

}
