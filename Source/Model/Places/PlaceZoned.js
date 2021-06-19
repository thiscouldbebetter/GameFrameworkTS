"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class PlaceZoned extends GameFramework.Place {
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
            initialize(uwpe) {
                var zoneStart = this.zoneGetByName(this.zoneStartName);
                this.entitiesToSpawnAdd(zoneStart.entities);
                super.initialize(uwpe);
            }
            updateForTimerTick(uwpe) {
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
                            this.entityToSpawnAdd(entity);
                        });
                    });
                    this.zoneCentralAndNeighbors = zoneCentralAndNeighborsNext;
                }
                super.updateForTimerTick(uwpe);
            }
        }
        GameFramework.PlaceZoned = PlaceZoned;
        class Zone {
            constructor(name, bounds, zonesAdjacentNames, entities) {
                this.name = name;
                this.bounds = bounds;
                this.zonesAdjacentNames = zonesAdjacentNames;
                this.entities = entities;
            }
        }
        GameFramework.Zone = Zone;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
