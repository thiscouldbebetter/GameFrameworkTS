"use strict";
class PlaceZoned extends Place {
    constructor(name, defnName, size, entityToFollowName, zoneStartName, zoneGetByName, zoneAtPos) {
        super(name, defnName, size, [] // entities
        );
        this.entityToFollowName = entityToFollowName;
        this.zoneStartName = zoneStartName;
        this.zoneGetByName = zoneGetByName;
        this.zoneAtPos = zoneAtPos;
        this.zoneCentralAndNeighbors = [];
    }
    // Place implementation.
    initialize(universe, world) {
        var zoneStart = this.zoneGetByName(this.zoneStartName);
        this.entitiesToSpawn.push(...zoneStart.entities);
        super.initialize(universe, world);
    }
    updateForTimerTick(universe, world) {
        var entityToFollow = this.entitiesByName.get(this.entityToFollowName);
        var entityToFollowPos = entityToFollow.locatable().loc.pos;
        var zoneCentralCurrent = this.zoneAtPos(entityToFollowPos);
        if (zoneCentralCurrent != null && zoneCentralCurrent != this.zoneCentral) {
            this.zoneCentral = zoneCentralCurrent;
            var zonesNeighboringZoneCentral = this.zoneCentral.zonesAdjacentNames.map(zoneName => this.zoneGetByName(zoneName));
            var zoneCentralAndNeighborsNext = [this.zoneCentral];
            zoneCentralAndNeighborsNext.push(...zonesNeighboringZoneCentral);
            var zoneCentralAndNeighborsPrev = this.zoneCentralAndNeighbors;
            var zonesToFinalize = zoneCentralAndNeighborsPrev.filter(x => zoneCentralAndNeighborsNext.indexOf(x) == -1);
            var zonesToInitialize = zoneCentralAndNeighborsNext.filter(x => zoneCentralAndNeighborsPrev.indexOf(x) == -1);
            zonesToFinalize.forEach(zone => {
                zone.entities.forEach(entity => {
                    entity.locatable().loc.pos.subtract(zone.bounds.min());
                    this.entitiesToRemove.push(entity);
                });
            });
            zonesToInitialize.forEach(zone => {
                zone.entities.forEach(entity => {
                    entity.locatable().loc.pos.add(zone.bounds.min());
                    this.entitiesToSpawn.push(entity);
                });
            });
            this.zoneCentralAndNeighbors = zoneCentralAndNeighborsNext;
        }
        super.updateForTimerTick(universe, world);
    }
}
class Zone {
    constructor(name, bounds, zonesAdjacentNames, entities) {
        this.name = name;
        this.bounds = bounds;
        this.zonesAdjacentNames = zonesAdjacentNames;
        this.entities = entities;
    }
}
