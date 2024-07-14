"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class EntityGenerator {
            constructor(entityToGenerate, ticksPerGenerationAsRange, entitiesPerGenerationAsRange, entitiesGeneratedMax, entitySpeedAsRange) {
                this.entityToGenerate = entityToGenerate;
                this.ticksPerGenerationAsRange =
                    ticksPerGenerationAsRange || new GameFramework.RangeExtent(100, 100);
                this.entitiesPerGenerationAsRange =
                    entitiesPerGenerationAsRange || new GameFramework.RangeExtent(1, 1);
                this.entitiesGeneratedMax = entitiesGeneratedMax || 1;
                this.entitySpeedAsRange =
                    entitySpeedAsRange || new GameFramework.RangeExtent(0, 0);
                this.entitiesGenerated = new Array();
                this.ticksUntilNextGeneration = null;
            }
            toEntity() {
                return new GameFramework.Entity(EntityGenerator.name, [this]);
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return EntityGenerator.name; }
            updateForTimerTick(uwpe) {
                var place = uwpe.place;
                this.entitiesGenerated = this.entitiesGenerated.filter(e => place.entityByName(e.name) != null);
                if (this.entitiesGenerated.length < this.entitiesGeneratedMax) {
                    var randomizer = uwpe.universe.randomizer;
                    if (this.ticksUntilNextGeneration == null) {
                        this.ticksUntilNextGeneration = Math.round(this.ticksPerGenerationAsRange.random(randomizer));
                    }
                    if (this.ticksUntilNextGeneration > 0) {
                        this.ticksUntilNextGeneration--;
                    }
                    else {
                        this.ticksUntilNextGeneration = null;
                        var entityForGenerator = uwpe.entity;
                        var generatorLocatable = entityForGenerator.locatable();
                        var entitiesToGenerateCount = Math.round(this.entitiesPerGenerationAsRange.random(randomizer));
                        for (var i = 0; i < entitiesToGenerateCount; i++) {
                            var entityGenerated = this.entityToGenerate.clone();
                            var entityGeneratedLoc = entityGenerated.locatable().loc;
                            if (generatorLocatable == null) {
                                var placeSize = place.size();
                                entityGeneratedLoc.pos.randomize(randomizer).multiply(placeSize);
                            }
                            else {
                                entityGeneratedLoc.overwriteWith(generatorLocatable.loc);
                                var entityGeneratedSpeed = this.entitySpeedAsRange.random(randomizer);
                                if (entityGeneratedSpeed > 0) {
                                    var entityGeneratedVel = entityGeneratedLoc.vel;
                                    GameFramework.Polar.create().random(randomizer).toCoords(entityGeneratedVel).multiplyScalar(entityGeneratedSpeed);
                                }
                            }
                            this.entitiesGenerated.push(entityGenerated);
                            var uwpe2 = uwpe.clone().entitySet(entityGenerated);
                            place.entitySpawn(uwpe2);
                        }
                    }
                }
            }
            // Clonable.
            clone() {
                return new EntityGenerator(this.entityToGenerate, this.ticksPerGenerationAsRange.clone(), this.entitiesPerGenerationAsRange.clone(), this.entitiesGeneratedMax, this.entitySpeedAsRange.clone());
            }
            overwriteWith(other) {
                this.entityToGenerate = other.entityToGenerate; // todo
                this.ticksPerGenerationAsRange.overwriteWith(other.ticksPerGenerationAsRange);
                this.entitiesPerGenerationAsRange.overwriteWith(other.entitiesPerGenerationAsRange);
                this.entitiesGeneratedMax = other.entitiesGeneratedMax;
                this.entitySpeedAsRange.overwriteWith(other.entitySpeedAsRange);
                return this;
            }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.EntityGenerator = EntityGenerator;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
