"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ProjectileGeneration {
            constructor(radius, distanceInitial, speed, ticksToLive, hit, damage, visual, projectileEntityInitialize) {
                this.radius = radius || 2;
                this.distanceInitial = distanceInitial || 3;
                this.speed = speed || 4;
                this.ticksToLive = ticksToLive || 20;
                this._hit = hit;
                this.damage = damage || GameFramework.Damage.fromAmount(1);
                ;
                this.visual =
                    visual ||
                        GameFramework.VisualGroup.fromChildren([
                            GameFramework.VisualSound.fromSoundName("Effects_Blip"),
                            GameFramework.VisualCircle.fromRadiusAndColorFill(this.radius, GameFramework.Color.Instances().Yellow)
                        ]);
                this._projectileEntityInitialize = projectileEntityInitialize;
            }
            static default() {
                var generation = new ProjectileGeneration(null, //radius
                null, // distanceInitial
                null, // speed
                null, // ticksToLive
                null, // hit
                null, // damage,
                null, // visual,
                null // init
                );
                return generation;
            }
            static fromRadiusDistanceSpeedTicksHitDamageAndVisual(radius, distanceInitial, speed, ticksToLive, hit, damage, visual) {
                return new ProjectileGeneration(radius, distanceInitial, speed, ticksToLive, hit, damage, visual, null // projectileEntityInitialize
                );
            }
            static fromRadiusDistanceSpeedTicksDamageVisualAndInit(radius, distanceInitial, speed, ticksToLive, damage, visual, projectileEntityInitialize) {
                return new ProjectileGeneration(radius, distanceInitial, speed, ticksToLive, null, // hit
                damage, visual, projectileEntityInitialize);
            }
            static fromRadiusDistanceSpeedTicksHitDamageVisualAndInit(radius, distanceInitial, speed, ticksToLive, hit, damage, visual, projectileEntityInitialize) {
                return new ProjectileGeneration(radius, distanceInitial, speed, ticksToLive, hit, damage, visual, projectileEntityInitialize);
            }
            static fromVisual(visual) {
                return new ProjectileGeneration(0, // radius
                0, // distanceInitial,
                0, // speed
                1, // ticksToLive
                null, // hit
                null, // damage
                visual, null // projectileEntityInitialize
                );
            }
            hit(uwpe) {
                var entityProjectile = uwpe.entity;
                var entityTarget = uwpe.entity2;
                var projectileKillable = GameFramework.Killable.of(entityProjectile);
                var targetKillable = GameFramework.Killable.of(entityTarget);
                var projectileIsAlive = projectileKillable != null
                    && projectileKillable.isAlive();
                if (targetKillable != null && projectileIsAlive) {
                    if (this._hit == null) {
                        ProjectileGeneration.hit_DamageTargetAndDestroySelf(uwpe);
                    }
                    else {
                        this._hit(uwpe);
                    }
                }
            }
            static hit_DamageTargetAndDestroySelf(uwpe) {
                var entityProjectile = uwpe.entity;
                var entityTarget = uwpe.entity2;
                var projectileKillable = GameFramework.Killable.of(entityProjectile);
                var targetKillable = GameFramework.Killable.of(entityTarget);
                var projectileDamager = GameFramework.Damager.of(entityProjectile);
                if (projectileDamager != null) {
                    var damageToApply = projectileDamager.damagePerHit;
                    targetKillable.damageApply(uwpe, damageToApply);
                }
                projectileKillable.kill();
            }
            projectileEntityInitialize(entity) {
                if (this._projectileEntityInitialize != null) {
                    this._projectileEntityInitialize(entity);
                }
            }
            range() {
                var range = this.distanceInitial
                    + this.speed * this.ticksToLive;
                return range;
            }
            toEntityFromEntityFiring(entityFiring) {
                var shooterLoc = GameFramework.Locatable.of(entityFiring).loc;
                var shooterPos = shooterLoc.pos;
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
                shotLoc.vel
                    .overwriteWith(shooterForward)
                    .multiplyScalar(this.speed);
                var shotAudible = GameFramework.Audible.create();
                // Shots may move so fast that they "pass through" targets
                // without ever colliding with them, so duplicate the collider
                // to make sure anything between the before and after points is hit.
                var colliderPartBeforeTransform = GameFramework.Sphere.fromRadius(this.radius);
                var shotDiameter = this.radius * 2;
                var colliderPartsCount = this.speed / shotDiameter;
                var colliderParts = [];
                for (var i = 0; i < colliderPartsCount; i++) {
                    var displacement = shooterForward
                        .clone()
                        .multiplyScalar(i * shotDiameter);
                    var transform = GameFramework.Transform_Translate.fromDisplacement(displacement);
                    var colliderPart = GameFramework.ShapeTransformed.fromTransformAndChild(transform, colliderPartBeforeTransform);
                    colliderParts.push(colliderPart);
                }
                var shotCollider = GameFramework.ShapeGroupAny.fromChildren(colliderParts);
                var shotCollidable = GameFramework.Collidable.fromColliderPropertyNameAndCollide(shotCollider, GameFramework.Collidable.name, (uwpe) => this.collide(uwpe));
                var shotDamager = GameFramework.Damager.fromDamagePerHit(this.damage);
                var shotDrawable = GameFramework.Drawable.fromVisual(this.visual); // hack
                var shotEphemeral = GameFramework.Ephemeral.fromTicksToLive(this.ticksToLive);
                var shotKillable = GameFramework.Killable.fromIntegrityMax(1);
                var shotLocatable = GameFramework.Locatable.fromDisposition(shotLoc);
                var shotMovable = GameFramework.Movable.fromSpeedMax(this.speed);
                var shotRelatable = GameFramework.Relatable.fromRelationshipNameAndEntityRelatedId("Originator", entityFiring.id);
                var shotEntity = GameFramework.Entity.fromNameAndProperties(entityFiring.name + "_Shot", [
                    shotAudible,
                    shotCollidable,
                    shotDamager,
                    shotDrawable,
                    shotEphemeral,
                    shotKillable,
                    shotLocatable,
                    shotMovable,
                    shotRelatable
                ]);
                this.projectileEntityInitialize(shotEntity);
                return shotEntity;
            }
            collide(uwpe) {
                var entityProjectile = uwpe.entity;
                var entityOther = uwpe.entity2;
                var entityProjectileRelatable = GameFramework.Relatable.of(entityProjectile);
                if (entityProjectileRelatable.entityRelatedId != entityOther.id) {
                    this.hit(uwpe);
                }
            }
        }
        GameFramework.ProjectileGeneration = ProjectileGeneration;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
