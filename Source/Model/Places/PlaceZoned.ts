
namespace ThisCouldBeBetter.GameFramework
{

export class PlaceZoned extends Place
{
	entityToFollowName: string;
	zoneStartName: string;
	_zoneGetByName: (zoneName: string) => Zone;
	_zoneAtPos: (posToCheck: Coords) => Zone;

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
			null, // parentName
			size,
			null // entities
		);

		this.entityToFollowName = entityToFollowName;
		this.zoneStartName = zoneStartName;
		this._zoneGetByName = zoneGetByName;
		this._zoneAtPos = zoneAtPos;
		this.zoneCentralAndNeighbors = [];
	}

	zoneAtPos(pos: Coords): Zone
	{
		return this._zoneAtPos(pos);
	}

	zoneGetByName(name: string): Zone
	{
		return this._zoneGetByName(name);
	}

	zoneStart(): Zone
	{
		return this.zoneGetByName(this.zoneStartName);
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
		var zoneCentralPrev = this.zoneCentral;
		var zoneCentralNext = this.zoneAtPos(entityToFollowPos);
		var hasZoneChanged = (zoneCentralNext != zoneCentralPrev);

		if (hasZoneChanged)
		{
			if (zoneCentralNext != null)
			{
				var zonesNeighboringZoneCentralNext =
					zoneCentralNext.zonesAdjacentNames.map
					(
						zoneName => this.zoneGetByName(zoneName)
					);

				var zoneCentralAndNeighborsNext =
					[
						zoneCentralNext
					].concat
					(
						zonesNeighboringZoneCentralNext
					);

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
								var entityPos = entity.locatable().loc.pos;
								var zoneMin = zone.bounds.min();
								entityPos.subtract(zoneMin);
								this.entityToRemoveAdd(entity);
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
								var entityPos = entity.locatable().loc.pos;
								var zoneMin = zone.bounds.min();
								entityPos.add(zoneMin);
								this.entityToSpawnAdd(entity);
							}
						)
					}
				);

				this.zoneCentral = zoneCentralNext;
				this.zoneCentralAndNeighbors = zoneCentralAndNeighborsNext;
			}
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

	constructor
	(
		name: string,
		bounds: Box,
		zonesAdjacentNames: string[],
		entities: Entity[]
	)
	{
		this.name = name;
		this.bounds = bounds;
		this.zonesAdjacentNames = zonesAdjacentNames;
		this.entities = entities;
	}
}

}
