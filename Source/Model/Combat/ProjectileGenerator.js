"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ProjectileGenerator {
            constructor(name, radius, distanceInitial, speed, ticksToLive, damage, visual) {
                this.name = name;
                this.radius = radius;
                this.distanceInitial = distanceInitial;
                this.speed = speed;
                this.ticksToLive = ticksToLive;
                this.damage = damage;
                this.visual = visual;
            }
            static actionFire() {
                return new GameFramework.Action("Fire", 
                // perform
                (universe, world, place, entityActor) => {
                    var projectileGenerator = entityActor.projectileGenerator();
                    var projectileEntity = projectileGenerator.projectileFromEntity(entityActor);
                    place.entityToSpawnAdd(projectileEntity);
                });
            }
            projectileFromEntity(entityFiring) {
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
                var projectileCollidable = new GameFramework.Collidable(0, projectileCollider, [GameFramework.Collidable.name], this.collide);
                var projectileDamager = new GameFramework.Damager(this.damage);
                var projectileDrawable = GameFramework.Drawable.fromVisual(this.visual);
                var projectileEphemeral = new GameFramework.Ephemeral(this.ticksToLive, null);
                var projectileKillable = GameFramework.Killable.fromIntegrityMax(1);
                var projectileLocatable = new GameFramework.Locatable(projectileLoc);
                var projectileMovable = GameFramework.Movable.create();
                var projectileEntity = new GameFramework.Entity(this.name, [
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
            collide(universe, world, place, entityProjectile, entityOther) {
                var targetKillable = entityOther.killable();
                if (targetKillable != null) {
                    var damageToApply = entityProjectile.damager().damagePerHit;
                    targetKillable.damageApply(universe, world, place, entityProjectile, entityOther, damageToApply);
                    var projectileKillable = entityProjectile.killable();
                    if (projectileKillable != null) {
                        projectileKillable.kill();
                    }
                }
            }
            // EntityProperty.
            finalize(u, w, p, e) { }
            initialize(u, w, p, e) { }
            updateForTimerTick(u, w, p, e) { }
        }
        GameFramework.ProjectileGenerator = ProjectileGenerator;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
