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
            draw(universe, world, place, entity, display) {
                if (this.ticksSoFar < this.ticksToGenerate || this.ticksToGenerate == null) {
                    var particleCountThisTick;
                    if (this.particlesPerTick >= 1) {
                        particleCountThisTick = this.particlesPerTick;
                    }
                    else {
                        var ticksPerParticle = 1 / this.particlesPerTick;
                        particleCountThisTick = (this.ticksSoFar % ticksPerParticle == 0 ? 1 : 0);
                    }
                    for (var i = 0; i < particleCountThisTick; i++) {
                        var entityGeneratingLoc = entity.locatable().loc;
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
                this.particleEntities.forEach(particleEntity => {
                    var loc = particleEntity.locatable().loc;
                    loc.pos.add(loc.vel);
                    var ephemeral = particleEntity.ephemeral();
                    if (ephemeral.ticksToLive <= 0) {
                        GameFramework.ArrayHelper.remove(this.particleEntities, particleEntity);
                    }
                    else {
                        ephemeral.ticksToLive--;
                        particleEntity.drawable().visual.draw(universe, world, place, particleEntity, display);
                        this.transformToApplyEachTick.transform(particleEntity.drawable().visual);
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
