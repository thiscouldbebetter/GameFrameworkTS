"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class EntityGenerator extends GameFramework.EntityPropertyBase {
            constructor(name, entityToGenerate, ticksPerGenerationAsRange, entitiesPerGenerationAsRange, entitiesToGenerateMaxConcurrent, entitiesToGenerateMaxAllTime, entityPositionRangeAsBox, entitySpeedAsRange, windDown) {
                super();
                this.name = name;
                this.entityToGenerate = entityToGenerate;
                this.ticksPerGenerationAsRange =
                    ticksPerGenerationAsRange || GameFramework.RangeExtent.fromNumber(100);
                this.entitiesPerGenerationAsRange =
                    entitiesPerGenerationAsRange || GameFramework.RangeExtent.fromNumber(1);
                this.entitiesToGenerateMaxConcurrent =
                    entitiesToGenerateMaxConcurrent || 1;
                this.entitiesToGenerateMaxAllTime =
                    entitiesToGenerateMaxAllTime;
                this.entityPositionRangeAsBox =
                    entityPositionRangeAsBox;
                this.entitySpeedAsRange =
                    entitySpeedAsRange || GameFramework.RangeExtent.fromNumber(0);
                this._windDown = windDown;
                this.entitiesGeneratedAllTimeCount = 0;
                this.entitiesGeneratedActive = new Array();
                this.ticksUntilNextGeneration = null;
                this.windDownHasBeenRun = false;
            }
            static fromNameEntityTicksBatchMaxesAndPosBox(name, entityToGenerate, ticksPerGeneration, entitiesPerGeneration, entitiesToGenerateMaxConcurrent, entitiesToGenerateMaxAllTime, entityPositionRangeAsBox) {
                return new EntityGenerator(name, entityToGenerate, GameFramework.RangeExtent.fromNumber(ticksPerGeneration), GameFramework.RangeExtent.fromNumber(entitiesPerGeneration), entitiesToGenerateMaxConcurrent, entitiesToGenerateMaxAllTime, entityPositionRangeAsBox, null, // entitySpeedAsRange
                null // windDown
                );
            }
            static of(entity) {
                return entity.propertyByName(EntityGenerator.name);
            }
            exhaust() {
                this.entitiesToGenerateMaxAllTime = 0;
            }
            exhausted() {
                var isExhausted = this.entitiesToGenerateMaxAllTime != null
                    && this.entitiesGeneratedAllTimeCount >= this.entitiesToGenerateMaxAllTime;
                return isExhausted;
            }
            saturated() {
                return (this.entitiesGeneratedActive.length >= this.entitiesToGenerateMaxConcurrent);
            }
            toEntity() {
                return GameFramework.Entity.fromNameAndProperties(this.name, [this]);
            }
            windDown(uwpe) {
                if (this._windDown != null) {
                    this._windDown.call(this, uwpe);
                }
                this.windDownHasBeenRun = true;
            }
            windDownSet(value) {
                this._windDown = value;
                return this;
            }
            // EntityProperty.
            updateForTimerTick(uwpe) {
                if (this.inactivated()) {
                    return;
                }
                if (this.exhausted()) {
                    if (this.windDownHasBeenRun == false) {
                        this.windDown(uwpe);
                    }
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
                return new EntityGenerator(this.name, this.entityToGenerate, this.ticksPerGenerationAsRange.clone(), this.entitiesPerGenerationAsRange.clone(), this.entitiesToGenerateMaxConcurrent, this.entitiesToGenerateMaxAllTime, this.entityPositionRangeAsBox == null ? null : this.entityPositionRangeAsBox.clone(), this.entitySpeedAsRange.clone(), this._windDown);
            }
            overwriteWith(other) {
                this.entityToGenerate =
                    other.entityToGenerate; // todo
                this.ticksPerGenerationAsRange
                    .overwriteWith(other.ticksPerGenerationAsRange);
                this.entitiesPerGenerationAsRange
                    .overwriteWith(other.entitiesPerGenerationAsRange);
                this.entitiesToGenerateMaxConcurrent =
                    other.entitiesToGenerateMaxConcurrent;
                this.entitiesToGenerateMaxAllTime =
                    other.entitiesToGenerateMaxAllTime;
                this.entityPositionRangeAsBox
                    .overwriteWith(other.entityPositionRangeAsBox);
                this.entitySpeedAsRange.overwriteWith(other.entitySpeedAsRange);
                return this;
            }
        }
        GameFramework.EntityGenerator = EntityGenerator;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
