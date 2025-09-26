"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualParticles extends GameFramework.VisualBase {
            constructor(name, ticksToGenerate, particlesPerTick, particleTicksToLiveGet, particleVelocityGet, transformToApplyEachTick, particleVisual) {
                super();
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
                var particlesAreStillBeingGenerated = this.ticksToGenerate == null
                    || this.ticksSoFar < this.ticksToGenerate;
                var emitterEntity = uwpe.entity;
                if (particlesAreStillBeingGenerated) {
                    this.draw_ParticlesGenerate(uwpe);
                }
                this.particleEntities.forEach(particleEntity => this.draw_ParticlesUpdate(uwpe, display, emitterEntity, particleEntity));
                uwpe.entitySet(emitterEntity);
            }
            draw_ParticlesGenerate(uwpe) {
                var particleCountThisTick;
                if (this.particlesPerTick >= 1) {
                    particleCountThisTick = this.particlesPerTick;
                }
                else {
                    var ticksPerParticle = 1 / this.particlesPerTick;
                    particleCountThisTick = (this.ticksSoFar % ticksPerParticle == 0 ? 1 : 0);
                }
                for (var i = 0; i < particleCountThisTick; i++) {
                    var particleName = "Particle" + this.name + "-" + this.ticksSoFar + "-" + i;
                    var particleDispRelativeToEmitter = GameFramework.Disposition.create();
                    var particleVel = this.particleVelocityGet();
                    particleDispRelativeToEmitter.vel.overwriteWith(particleVel);
                    var particleTicksToLive = this.particleTicksToLiveGet();
                    var entityParticle = GameFramework.Entity.fromNameAndProperties(particleName, [
                        GameFramework.Drawable.fromVisual(this.particleVisual.clone()),
                        GameFramework.Ephemeral.fromTicksToLive(particleTicksToLive),
                        GameFramework.Locatable.fromDisposition(particleDispRelativeToEmitter)
                    ]);
                    this.particleEntities.push(entityParticle);
                }
                this.ticksSoFar++;
            }
            draw_ParticlesUpdate(uwpe, display, emitterEntity, particleEntity) {
                var ephemeral = GameFramework.Ephemeral.of(particleEntity);
                var ephemeralIsExpired = ephemeral.isExpired();
                if (ephemeralIsExpired) {
                    GameFramework.ArrayHelper.remove(this.particleEntities, particleEntity);
                }
                else {
                    var particleDispRelativeToEmitter = GameFramework.Locatable.of(particleEntity).loc;
                    var particlePosRelativeToEmitter = particleDispRelativeToEmitter.pos;
                    particlePosRelativeToEmitter.add(particleDispRelativeToEmitter.vel);
                    var emitterPos = GameFramework.Locatable.of(emitterEntity).loc.pos;
                    var particlePosAbsolute = particlePosRelativeToEmitter.add(emitterPos);
                    var particleVisual = GameFramework.Drawable.of(particleEntity).visual;
                    uwpe.entitySet(particleEntity);
                    particleVisual.draw(uwpe, display);
                    this.transformToApplyEachTick.transform(particleVisual);
                    particlePosRelativeToEmitter =
                        particlePosAbsolute.subtract(emitterPos);
                }
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
