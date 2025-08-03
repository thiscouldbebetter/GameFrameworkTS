"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class EntityGenerator {
            constructor(entityToGenerate, ticksPerGenerationAsRange, entitiesPerGenerationAsRange, entitiesGeneratedMaxConcurrent, entitiesGeneratedMaxAllTime, entityPositionRangeAsBox, entitySpeedAsRange) {
                this.entityToGenerate = entityToGenerate;
                this.ticksPerGenerationAsRange =
                    ticksPerGenerationAsRange || GameFramework.RangeExtent.fromNumber(100);
                this.entitiesPerGenerationAsRange =
                    entitiesPerGenerationAsRange || GameFramework.RangeExtent.fromNumber(1);
                this.entitiesGeneratedMaxConcurrent =
                    entitiesGeneratedMaxConcurrent || 1;
                this.entitiesGeneratedMaxAllTime =
                    entitiesGeneratedMaxAllTime;
                this.entityPositionRangeAsBox =
                    entityPositionRangeAsBox;
                this.entitySpeedAsRange =
                    entitySpeedAsRange || GameFramework.RangeExtent.fromNumber(0);
                this.entitiesGeneratedAllTimeCount = 0;
                this.entitiesGeneratedActive = new Array();
                this.ticksUntilNextGeneration = 0;
            }
            static fromEntityTicksBatchMaxesAndPosBox(entityToGenerate, ticksPerGeneration, entitiesPerGeneration, entitiesGeneratedMaxConcurrent, entitiesGeneratedMaxAllTime, entityPositionRangeAsBox) {
                return new EntityGenerator(entityToGenerate, GameFramework.RangeExtent.fromNumber(ticksPerGeneration), GameFramework.RangeExtent.fromNumber(entitiesPerGeneration), entitiesGeneratedMaxConcurrent, entitiesGeneratedMaxAllTime, entityPositionRangeAsBox, null);
            }
            static of(entity) {
                return entity.propertyByName(EntityGenerator.name);
            }
            exhausted() {
                return (this.entitiesGeneratedAllTimeCount >= this.entitiesGeneratedMaxAllTime);
            }
            saturated() {
                return (this.entitiesGeneratedActive.length >= this.entitiesGeneratedMaxConcurrent);
            }
            toEntity() {
                return GameFramework.Entity.fromNameAndProperties(EntityGenerator.name, [this]);
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return EntityGenerator.name; }
            updateForTimerTick(uwpe) {
                if (this.exhausted()) {
                    return;
                }
                var place = uwpe.place;
                this.entitiesGeneratedActive =
                    this.entitiesGeneratedActive.filter(e => place.entityByName(e.name) != null);
                var saturated = this.saturated();
                if (saturated == false) {
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
                        var generatorLocatable = GameFramework.Locatable.of(entityForGenerator);
                        var entitiesToGenerateCount = Math.round(this.entitiesPerGenerationAsRange.random(randomizer));
                        for (var i = 0; i < entitiesToGenerateCount; i++) {
                            var entityGenerated = this.entityToGenerate.clone();
                            var entityGeneratedLoc = GameFramework.Locatable.of(entityGenerated).loc;
                            var entityGeneratedPos = entityGeneratedLoc.pos;
                            if (this.entityPositionRangeAsBox != null) {
                                entityGeneratedPos.overwriteWith(this.entityPositionRangeAsBox
                                    .pointRandom(randomizer));
                            }
                            else if (generatorLocatable == null) {
                                var placeSize = place.size();
                                entityGeneratedPos
                                    .randomize(randomizer)
                                    .multiply(placeSize);
                            }
                            else {
                                entityGeneratedLoc.overwriteWith(generatorLocatable.loc);
                            }
                            var entityGeneratedSpeed = this.entitySpeedAsRange.random(randomizer);
                            if (entityGeneratedSpeed > 0) {
                                var entityGeneratedVel = entityGeneratedLoc.vel;
                                GameFramework.Polar
                                    .create()
                                    .random(randomizer)
                                    .overwriteCoords(entityGeneratedVel)
                                    .multiplyScalar(entityGeneratedSpeed);
                            }
                            this.entitiesGeneratedActive.push(entityGenerated);
                            var uwpe2 = uwpe.clone().entitySet(entityGenerated);
                            place.entitySpawn(uwpe2);
                            this.entitiesGeneratedAllTimeCount++;
                        }
                    }
                }
            }
            // Clonable.
            clone() {
                return new EntityGenerator(this.entityToGenerate, this.ticksPerGenerationAsRange.clone(), this.entitiesPerGenerationAsRange.clone(), this.entitiesGeneratedMaxConcurrent, this.entitiesGeneratedMaxAllTime, this.entityPositionRangeAsBox == null ? null : this.entityPositionRangeAsBox.clone(), this.entitySpeedAsRange.clone());
            }
            overwriteWith(other) {
                this.entityToGenerate =
                    other.entityToGenerate; // todo
                this.ticksPerGenerationAsRange
                    .overwriteWith(other.ticksPerGenerationAsRange);
                this.entitiesPerGenerationAsRange
                    .overwriteWith(other.entitiesPerGenerationAsRange);
                this.entitiesGeneratedMaxConcurrent =
                    other.entitiesGeneratedMaxConcurrent;
                this.entitiesGeneratedMaxAllTime =
                    other.entitiesGeneratedMaxAllTime;
                this.entityPositionRangeAsBox
                    .overwriteWith(other.entityPositionRangeAsBox);
                this.entitySpeedAsRange.overwriteWith(other.entitySpeedAsRange);
                return this;
            }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.EntityGenerator = EntityGenerator;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
