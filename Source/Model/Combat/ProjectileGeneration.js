"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ProjectileGeneration {
            constructor(radius, distanceInitial, speed, ticksToLive, integrityMax, collideOnlyWithEntitiesHavingPropertiesNamed, damage, visual, projectileEntityInitialize, hit) {
                this.radius = radius || 2;
                this.distanceInitial = distanceInitial || 3;
                this.speed = speed || 4;
                this.ticksToLive = ticksToLive || 20;
                this.integrityMax = integrityMax || 1;
                this.collideOnlyWithEntitiesHavingPropertiesNamed =
                    collideOnlyWithEntitiesHavingPropertiesNamed
                        || [GameFramework.Collidable.name];
                this.damage = damage || GameFramework.Damage.fromAmount(1);
                ;
                this.visual =
                    visual ||
                        GameFramework.VisualGroup.fromChildren([
                            GameFramework.VisualSound.fromSoundName("Effects_Blip"),
                            GameFramework.VisualCircle.fromRadiusAndColorFill(this.radius, GameFramework.Color.Instances().Yellow)
                        ]);
                this._projectileEntityInitialize = projectileEntityInitialize;
                this._hit = hit;
            }
            static default() {
                var generation = new ProjectileGeneration(null, //radius
                null, // distanceInitial
                null, // speed
                null, // ticksToLive
                null, // integrityMax
                null, // propertiesToCollideWithNames
                null, // damage
                null, // visual
                null, // init
                null // hit
                );
                return generation;
            }
            static fromRadiusDistanceSpeedTicksIntegrityDamageVisualAndHit(radius, distanceInitial, speed, ticksToLive, integrityMax, damage, visual, hit) {
                return new ProjectileGeneration(radius, distanceInitial, speed, ticksToLive, integrityMax, null, // propertiesToCollideWithNames
                damage, visual, null, // projectileEntityInitialize
                hit);
            }
            static fromRadiusDistanceSpeedTicksIntegrityDamageVisualAndInit(radius, distanceInitial, speed, ticksToLive, integrityMax, damage, visual, projectileEntityInitialize) {
                return new ProjectileGeneration(radius, distanceInitial, speed, ticksToLive, integrityMax, null, // propertiesToCollideWithNames
                damage, visual, projectileEntityInitialize, null // hit
                );
            }
            static fromRadiusDistanceSpeedTicksIntegrityDamageVisualInitAndHit(radius, distanceInitial, speed, ticksToLive, integrityMax, damage, visual, projectileEntityInitialize, hit) {
                return new ProjectileGeneration(radius, distanceInitial, speed, ticksToLive, integrityMax, null, // propertiesToCollideWithNames
                damage, visual, projectileEntityInitialize, hit);
            }
            static fromVisual(visual) {
                return new ProjectileGeneration(0, // radius
                0, // distanceInitial,
                0, // speed
                1, // ticksToLive
                1, // integrityMax
                null, // propertiesToCollideWithNames
                null, // damage
                visual, null, // projectileEntityInitialize
                null // hit
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
                projectileKillable.integritySubtract(1);
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
                var shotDistance = this.distanceInitial;
                var offset = shooterForward
                    .clone()
                    .multiplyScalar(shotDistance);
                var pos = shooterPos
                    .clone()
                    .add(offset);
                var ori = GameFramework.Orientation.fromForward(shooterForward);
                var loc = GameFramework.Disposition.fromPosAndOri(pos, ori);
                loc.vel
                    .overwriteWith(shooterForward)
                    .multiplyScalar(this.speed);
                var audible = GameFramework.Audible.create();
                // Shots may move so fast that they "pass through" targets
                // without ever colliding with them, so duplicate the collider along the path
                // to make sure anything between the starting and ending points is hit.
                var colliderPartBeforeTransform = GameFramework.Sphere.fromRadius(this.radius);
                var diameter = this.radius * 2;
                var colliderPartsCount = this.speed / diameter;
                var colliderParts = [];
                for (var i = 0; i < colliderPartsCount; i++) {
                    var displacement = shooterForward
                        .clone()
                        .multiplyScalar(i * diameter);
                    var transform = GameFramework.Transform_Translate.fromDisplacement(displacement);
                    var colliderPart = GameFramework.ShapeTransformed.fromTransformAndChild(transform, colliderPartBeforeTransform);
                    colliderParts.push(colliderPart);
                }
                var collider = GameFramework.ShapeGroupAny.fromChildren(colliderParts);
                var collidable = GameFramework.Collidable.fromColliderPropertyNamesAndCollide(collider, this.collideOnlyWithEntitiesHavingPropertiesNamed, (uwpe) => this.collide(uwpe));
                var damager = GameFramework.Damager.fromDamagePerHit(this.damage);
                var drawable = GameFramework.Drawable.fromVisual(this.visual); // hack
                var ephemeral = GameFramework.Ephemeral.fromTicksToLive(this.ticksToLive);
                var killable = GameFramework.Killable.fromIntegrityMax(1);
                var locatable = GameFramework.Locatable.fromDisposition(loc);
                var movable = GameFramework.Movable.fromSpeedMax(this.speed);
                var relatable = GameFramework.Relatable.fromRelationshipNameAndEntityRelatedId("Originator", entityFiring.id);
                var shotEntity = GameFramework.Entity.fromNameAndProperties(entityFiring.name + "_Shot", [
                    audible,
                    collidable,
                    damager,
                    drawable,
                    ephemeral,
                    killable,
                    locatable,
                    movable,
                    relatable
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
            // Accessors.
            collideOnlyWithEntitiesHavingPropertiesNamedSet(values) {
                this.collideOnlyWithEntitiesHavingPropertiesNamed = values;
                return this;
            }
        }
        GameFramework.ProjectileGeneration = ProjectileGeneration;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
