"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ProjectileGeneration {
            constructor(radius, distanceInitial, speedRelativeToShooter, ticksToLive, damage, visual, projectileEntityInitialize) {
                this.radius = radius;
                this.distanceInitial = distanceInitial;
                this.speedRelativeToShooter = speedRelativeToShooter;
                this.ticksToLive = ticksToLive;
                this.damage = damage;
                this.visual = visual;
                this._projectileEntityInitialize = projectileEntityInitialize;
            }
            static fromRadiusDistanceSpeedTicksDamageAndVisual(radius, distanceInitial, speedRelativeToShooter, ticksToLive, damage, visual) {
                return new ProjectileGeneration(radius, distanceInitial, speedRelativeToShooter, ticksToLive, damage, visual, null // projectileEntityInitialize
                );
            }
            static fromRadiusDistanceSpeedTicksDamageVisualAndInit(radius, distanceInitial, speedRelativeToShooter, ticksToLive, damage, visual, projectileEntityInitialize) {
                return new ProjectileGeneration(radius, distanceInitial, speedRelativeToShooter, ticksToLive, damage, visual, projectileEntityInitialize);
            }
            static fromVisual(visual) {
                return new ProjectileGeneration(0, // radius
                0, // distanceInitial,
                0, // speedRelativeToShooter
                1, // ticksToLive
                null, // damage
                visual, null // projectileEntityInitialize
                );
            }
            projectileEntityInitialize(entity) {
                if (this._projectileEntityInitialize != null) {
                    this._projectileEntityInitialize(entity);
                }
            }
            toEntityFromEntityFiring(entityFiring) {
                var shooterLoc = GameFramework.Locatable.of(entityFiring).loc;
                var shooterPos = shooterLoc.pos;
                var shooterVel = shooterLoc.vel;
                var shooterSpeed = shooterVel.magnitude();
                var shooterOri = shooterLoc.orientation;
                var shooterForward = shooterOri.forward;
                var shotDistance = this.distanceInitial + this.radius;
                var shotOffset = shooterForward
                    .clone()
                    .multiplyScalar(shotDistance);
                var shotPos = shooterPos
                    .clone()
                    .add(shotOffset);
                var shotOri = GameFramework.Orientation.fromForward(shooterForward);
                var shotLoc = GameFramework.Disposition.fromPosAndOri(shotPos, shotOri);
                var shotSpeedAbsolute = this.speedRelativeToShooter + shooterSpeed;
                shotLoc.vel
                    .overwriteWith(shooterForward)
                    .multiplyScalar(shotSpeedAbsolute);
                var shotAudible = GameFramework.Audible.create();
                var shotCollider = GameFramework.Sphere.fromRadius(this.radius);
                var shotCollidable = GameFramework.Collidable.fromColliderPropertyNameToCollideWithAndCollide(shotCollider, GameFramework.Collidable.name, (uwpe) => this.collide(uwpe));
                var shotDamager = GameFramework.Damager.fromDamagePerHit(this.damage);
                var shotDrawable = GameFramework.Drawable.fromVisual(this.visual); // hack
                var shotEphemeral = GameFramework.Ephemeral.fromTicksToLive(this.ticksToLive);
                var shotKillable = GameFramework.Killable.fromIntegrityMax(1);
                var shotLocatable = GameFramework.Locatable.fromDisposition(shotLoc);
                var shotMovable = GameFramework.Movable.default();
                var shotEntity = GameFramework.Entity.fromNameAndProperties(entityFiring.name + "_Shot", [
                    shotAudible,
                    shotCollidable,
                    shotDamager,
                    shotDrawable,
                    shotEphemeral,
                    shotKillable,
                    shotLocatable,
                    shotMovable
                ]);
                this.projectileEntityInitialize(shotEntity);
                return shotEntity;
            }
            collide(uwpe) {
                var entityProjectile = uwpe.entity;
                var entityOther = uwpe.entity2;
                var targetKillable = GameFramework.Killable.of(entityOther);
                if (targetKillable != null) {
                    var damageToApply = GameFramework.Damager.of(entityProjectile).damagePerHit;
                    targetKillable.damageApply(uwpe, damageToApply);
                    var projectileKillable = GameFramework.Killable.of(entityProjectile);
                    if (projectileKillable != null) {
                        projectileKillable.kill();
                    }
                }
            }
        }
        GameFramework.ProjectileGeneration = ProjectileGeneration;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
