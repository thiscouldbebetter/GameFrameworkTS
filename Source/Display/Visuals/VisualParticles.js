"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualParticles {
            constructor(name, ticksToGenerate, particlesPerTick, particleTicksToLiveGet, particleVelocityGet, transformToApplyEachTick, particleVisual) {
                this.name = name;
                this.ticksToGenerate = ticksToGenerate;
                this.particlesPerTick = particlesPerTick;
                this.particleTicksToLiveGet = particleTicksToLiveGet;
                this.particleVelocityGet = particleVelocityGet;
                this.transformToApplyEachTick = transformToApplyEachTick;
                this.particleVisual = particleVisual;
                this.ticksSoFar = 0;
                this.particleEntities = [];
            }
            // Visual.
            initialize(uwpe) {
                // Do nothing.
            }
            initializeIsComplete(uwpe) {
                return true; // todo
            }
            draw(uwpe, display) {
                if (this.ticksSoFar < this.ticksToGenerate || this.ticksToGenerate == null) {
                    var particleCountThisTick;
                    if (this.particlesPerTick >= 1) {
                        particleCountThisTick = this.particlesPerTick;
                    }
                    else {
                        var ticksPerParticle = 1 / this.particlesPerTick;
                        particleCountThisTick = (this.ticksSoFar % ticksPerParticle == 0 ? 1 : 0);
                    }
                    var entity = uwpe.entity;
                    for (var i = 0; i < particleCountThisTick; i++) {
                        var entityGeneratingLoc = GameFramework.Locatable.of(entity).loc;
                        var particleName = "Particle" + this.name + "-" + this.ticksSoFar + "-" + i;
                        var particleLoc = entityGeneratingLoc.clone();
                        var particleVel = this.particleVelocityGet();
                        particleLoc.vel.overwriteWith(particleVel);
                        var particleTicksToLive = this.particleTicksToLiveGet();
                        var entityParticle = new GameFramework.Entity(particleName, [
                            GameFramework.Drawable.fromVisual(this.particleVisual.clone()),
                            new GameFramework.Ephemeral(particleTicksToLive, null),
                            new GameFramework.Locatable(particleLoc)
                        ]);
                        this.particleEntities.push(entityParticle);
                    }
                    this.ticksSoFar++;
                }
                var uwpeForParticles = uwpe.clone();
                this.particleEntities.forEach(particleEntity => {
                    var loc = GameFramework.Locatable.of(particleEntity).loc;
                    loc.pos.add(loc.vel);
                    var ephemeral = GameFramework.Ephemeral.of(particleEntity);
                    if (ephemeral.ticksToLive <= 0) {
                        GameFramework.ArrayHelper.remove(this.particleEntities, particleEntity);
                    }
                    else {
                        ephemeral.ticksToLive--;
                        var particleVisual = GameFramework.Drawable.of(particleEntity).visual;
                        particleVisual.draw(uwpeForParticles.entitySet(particleEntity), display);
                        this.transformToApplyEachTick.transform(particleVisual);
                    }
                });
            }
            // Clonable.
            clone() {
                return this; // todo
            }
            overwriteWith(other) {
                return this; // todo
            }
            // Transformable.
            transform(transformToApply) {
                return this; // todo
            }
        }
        GameFramework.VisualParticles = VisualParticles;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
