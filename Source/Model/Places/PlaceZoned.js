"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class PlaceZoned extends GameFramework.PlaceBase {
            constructor(name, defnName, size, entityToFollowName, zoneGetByName, zoneAtPos) {
                super(name, defnName, null, // parentName
                size, null // entities
                );
                this.entityToFollowName = entityToFollowName;
                this._zoneGetByName = zoneGetByName;
                this._zoneAtPos = zoneAtPos;
                this.zoneCentralAndNeighbors = [];
            }
            zoneAtPos(pos) {
                return this._zoneAtPos(pos);
            }
            zoneGetByName(name) {
                return this._zoneGetByName(name);
            }
            updateForTimerTick(uwpe) {
                super.updateForTimerTick(uwpe);
                var entityToFollow = this.entityByName(this.entityToFollowName);
                var entityToFollowPos = entityToFollow.locatable().loc.pos;
                var zoneCentralPrev = this.zoneCentral;
                var zoneCentralNext = this.zoneAtPos(entityToFollowPos);
                var hasZoneChanged = (zoneCentralNext != zoneCentralPrev);
                if (hasZoneChanged) {
                    if (zoneCentralNext != null) {
                        var zonesNeighboringZoneCentralNext = zoneCentralNext.zonesAdjacentNames.map(zoneName => this.zoneGetByName(zoneName));
                        var zoneCentralAndNeighborsNext = [
                            zoneCentralNext
                        ].concat(zonesNeighboringZoneCentralNext);
                        var zoneCentralAndNeighborsPrev = this.zoneCentralAndNeighbors;
                        var zonesToFinalize = zoneCentralAndNeighborsPrev.filter(x => zoneCentralAndNeighborsNext.indexOf(x) == -1);
                        var zonesToInitialize = zoneCentralAndNeighborsNext.filter(x => zoneCentralAndNeighborsPrev.indexOf(x) == -1);
                        zonesToFinalize.forEach(zone => {
                            zone.entities.forEach(entity => {
                                var entityPos = entity.locatable().loc.pos;
                                var zoneMin = zone.bounds.min();
                                entityPos.subtract(zoneMin);
                                this.entityToRemoveAdd(entity);
                            });
                        });
                        zonesToInitialize.forEach(zone => {
                            zone.entities.forEach(entity => {
                                var entityPos = entity.locatable().loc.pos;
                                var zoneMin = zone.bounds.min();
                                entityPos.add(zoneMin);
                                this.entityToSpawnAdd(entity);
                            });
                        });
                        this.zoneCentral = zoneCentralNext;
                        this.zoneCentralAndNeighbors = zoneCentralAndNeighborsNext;
                    }
                }
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
