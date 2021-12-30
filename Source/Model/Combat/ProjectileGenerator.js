"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ProjectileGenerator {
            constructor(name, projectileGenerations) {
                this.name = name;
                this.projectileGenerations = projectileGenerations;
            }
            static actionFire() {
                return new GameFramework.Action("Fire", 
                // perform
                (uwpe) => {
                    var place = uwpe.place;
                    var entityActor = uwpe.entity;
                    var projectileGenerator = entityActor.projectileGenerator();
                    var projectileEntities = projectileGenerator.projectileEntitiesFromEntityFiring(entityActor);
                    place.entitiesToSpawnAdd(projectileEntities);
                });
            }
            projectileEntitiesFromEntityFiring(entityFiring) {
                var returnValues = this.projectileGenerations.map(x => x.projectileEntityFromEntityFiring(entityFiring));
                return returnValues;
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            updateForTimerTick(uwpe) { }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.ProjectileGenerator = ProjectileGenerator;
        class ProjectileGeneration {
            constructor(radius, distanceInitial, speed, ticksToLive, damage, visual) {
                this.radius = radius;
                this.distanceInitial = distanceInitial;
                this.speed = speed;
                this.ticksToLive = ticksToLive;
                this.damage = damage;
                this.visual = visual;
            }
            static fromVisual(visual) {
                return new ProjectileGeneration(0, // radius
                0, // distanceInitial,
                0, // speed
                1, // ticksToLive
                null, // damage
                visual);
            }
            projectileEntityFromEntityFiring(entityFiring) {
                var userLoc = entityFiring.locatable().loc;
                var userPos = userLoc.pos;
                var userVel = userLoc.vel;
                var userSpeed = userVel.magnitude();
                var userOri = userLoc.orientation;
                var userForward = userOri.forward;
                var projectileCollider = new GameFramework.Sphere(GameFramework.Coords.create(), this.radius / 2);
                var projectilePos = userPos.clone().add(userForward.clone().multiplyScalar(this.distanceInitial + this.radius));
                var projectileOri = GameFramework.Orientation.fromForward(userForward);
                var projectileLoc = new GameFramework.Disposition(projectilePos, projectileOri, null);
                projectileLoc.vel.overwriteWith(userForward).multiplyScalar(userSpeed + this.speed);
                var projectileCollider = new GameFramework.Sphere(GameFramework.Coords.create(), this.radius);
                var projectileCollidable = new GameFramework.Collidable(false, // canCollideAgainWithoutSeparating
                0, projectileCollider, [GameFramework.Collidable.name], this.collide);
                var projectileDamager = GameFramework.Damager.fromDamagePerHit(this.damage);
                var projectileDrawable = GameFramework.Drawable.fromVisual(this.visual); // hack
                var projectileEphemeral = new GameFramework.Ephemeral(this.ticksToLive, null);
                var projectileKillable = GameFramework.Killable.fromIntegrityMax(1);
                var projectileLocatable = new GameFramework.Locatable(projectileLoc);
                var projectileMovable = GameFramework.Movable.default();
                var projectileEntity = new GameFramework.Entity(entityFiring.name + "_Projectile", [
                    new GameFramework.Audible(),
                    projectileCollidable,
                    projectileDamager,
                    projectileDrawable,
                    projectileEphemeral,
                    projectileKillable,
                    projectileLocatable,
                    projectileMovable
                ]);
                return projectileEntity;
            }
            collide(uwpe) {
                var entityProjectile = uwpe.entity;
                var entityOther = uwpe.entity2;
                var targetKillable = entityOther.killable();
                if (targetKillable != null) {
                    var damageToApply = entityProjectile.damager().damagePerHit;
                    targetKillable.damageApply(uwpe, damageToApply);
                    var projectileKillable = entityProjectile.killable();
                    if (projectileKillable != null) {
                        projectileKillable.kill();
                    }
                }
            }
        }
        GameFramework.ProjectileGeneration = ProjectileGeneration;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
