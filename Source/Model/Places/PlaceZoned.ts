
class PlaceZoned extends Place
{
	entityToFollowName: string;
	zones: Zone[];

	zoneCentral: Zone;
	zoneCentralAndNeighbors: Zone[];
	zonesByName: Map<string, Zone>;

	constructor(name: string, defnName: string, entityToFollowName: string, zones: Zone[])
	{
		super
		(
			name,
			defnName,
			null, // size
			[] // entities
		);

		this.entityToFollowName = entityToFollowName;
		this.zones = zones;
		this.zonesByName = ArrayHelper.addLookupsByName(this.zones);
	}

	// Place implementation.

	initialize(universe: Universe, world: World)
	{
		var zone0 = this.zones[0];
		this.entitiesToSpawn.push(...zone0.entities);
		super.initialize(universe, world);
	}

	updateForTimerTick(universe: Universe, world: World)
	{
		var entityToFollow = this.entitiesByName.get(this.entityToFollowName);
		var entityToFollowPos = entityToFollow.locatable().loc.pos;
		var zoneCentralCurrent =
			this.zones.filter(zone => zone.bounds.containsPoint(entityToFollowPos))[0];
		if (zoneCentralCurrent != null && zoneCentralCurrent != this.zoneCentral)
		{
			this.zoneCentral = zoneCentralCurrent;
			var zonesNeighboringZoneCentral = this.zoneCentral.zonesAdjacentNames.map
			(
				zoneName => this.zonesByName.get(zoneName)
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
							this.entitiesToSpawn.push(entity);
						}
					)
				}
			);

			this.zoneCentralAndNeighbors = zoneCentralAndNeighborsNext;
		}

		super.updateForTimerTick(universe, world);
	}
}

class Zone
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
