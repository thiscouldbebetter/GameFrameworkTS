"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ProjectileGeneration {
            constructor(radius, distanceInitial, speed, ticksToLive, damage, visual, projectileEntityInitialize) {
                this.radius = radius;
                this.distanceInitial = distanceInitial;
                this.speed = speed;
                this.ticksToLive = ticksToLive;
                this.damage = damage;
                this.visual = visual;
                this._projectileEntityInitialize = projectileEntityInitialize;
            }
            static fromRadiusDistanceSpeedTicksDamageAndVisual(radius, distanceInitial, speed, ticksToLive, damage, visual) {
                return new ProjectileGeneration(radius, distanceInitial, speed, ticksToLive, damage, visual, null // projectileEntityInitialize
                );
            }
            static fromRadiusDistanceSpeedTicksDamageVisualAndInit(radius, distanceInitial, speed, ticksToLive, damage, visual, projectileEntityInitialize) {
                return new ProjectileGeneration(radius, distanceInitial, speed, ticksToLive, damage, visual, projectileEntityInitialize);
            }
            static fromVisual(visual) {
                return new ProjectileGeneration(0, // radius
                0, // distanceInitial,
                0, // speed
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
                var shotCollidable = GameFramework.Collidable.fromColliderCollidesOnlyWithEntitiesHavingPropertyNamedAndCollide(shotCollider, GameFramework.Collidable.name, (uwpe) => this.collide(uwpe));
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
        }
        GameFramework.ProjectileGeneration = ProjectileGeneration;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
