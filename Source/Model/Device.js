"use strict";
class Device {
    constructor(name, initialize, update, use) {
        this.name = name;
        this.initialize = initialize;
        this.update = update;
        this.use = use;
    }
    // static methods
    static gun() {
        var returnValue = new Device("Gun", (u, w, p, entity) => // initialize
         {
            var device = entity.device();
            device.ticksToCharge = 10;
            device.tickLastUsed = 0;
        }, (u, w, p, e) => // update
         {
            // todo
        }, (u, world, p, entityUser, entityDevice) => // use
         {
            var device = entityDevice.device();
            var tickCurrent = world.timerTicksSoFar;
            var ticksSinceUsed = tickCurrent - device.tickLastUsed;
            if (ticksSinceUsed < device.ticksToCharge) {
                return;
            }
            var userAsItemHolder = entityUser.itemHolder();
            var hasAmmo = userAsItemHolder.hasItemWithDefnNameAndQuantity("Ammo", 1);
            if (hasAmmo == false) {
                return;
            }
            userAsItemHolder.itemSubtractDefnNameAndQuantity("Ammo", 1);
            device.tickLastUsed = tickCurrent;
            var userLoc = entityUser.locatable().loc;
            var userPos = userLoc.pos;
            var userVel = userLoc.vel;
            var userSpeed = userVel.magnitude();
            if (userSpeed == 0) {
                return;
            }
            var projectileColor = "Cyan";
            var projectileDimension = 1.5;
            var projectileVisual = new VisualGroup(new Array(new VisualEllipse(projectileDimension * 2, // semimajorAxis,
            projectileDimension, // semiminorAxis,
            0, // rotationInTurns,
            projectileColor, // colorFill
            null), new VisualOffset(new VisualText(new DataBinding("Projectile", null, null), projectileColor, null), new Coords(0, 0 - projectileDimension * 3, 0))));
            var userDirection = userVel.clone().normalize();
            var userRadius = entityUser.collidable().collider.radius;
            var projectilePos = userPos.clone().add(userDirection.clone().multiplyScalar(userRadius + projectileDimension).double());
            var projectileOri = new Orientation(userVel.clone().normalize(), null);
            var projectileLoc = new Disposition(projectilePos, projectileOri, null);
            projectileLoc.vel.overwriteWith(userVel).clearZ().double();
            var projectileCollider = new Sphere(new Coords(0, 0, 0), projectileDimension);
            var projectileCollide = (universe, world, place, entityProjectile, entityOther) => {
                var killable = entityOther.killable();
                if (killable != null) {
                    killable.damageApply(universe, world, place, entityProjectile, entityOther, null);
                    entityProjectile.killable().integrity = 0;
                }
            };
            var visualExplosion = new VisualCircle(8, "Red", null);
            var killable = new Killable(1, // integrityMax
            null, // damageApply
            (universe, world, place, entityKillable) => // die
             {
                var entityExplosion = new Entity("Explosion", [
                    new Ephemeral(8, null),
                    new Drawable(visualExplosion, null),
                    new DrawableCamera(),
                    entityKillable.locatable()
                ]);
                place.entitiesToSpawn.push(entityExplosion);
            }, null);
            var projectileEntity = new Entity("Projectile", [
                new Damager(10),
                new Ephemeral(32, null),
                killable,
                new Locatable(projectileLoc),
                new Collidable(projectileCollider, [Killable.name], projectileCollide),
                new Drawable(projectileVisual, null),
                new DrawableCamera()
            ]);
            p.entitiesToSpawn.push(projectileEntity);
        });
        return returnValue;
    }
    static sword() {
        var returnValue = new Device("Sword", (u, w, p, entity) => // initialize
         {
            var device = entity.device();
            device.ticksToCharge = 10;
            device.tickLastUsed = 0;
        }, (u, w, p, e) => // update
         {
            // todo
        }, (universe, world, place, entityUser, entityDevice) => // use
         {
            var device = entityDevice.device();
            var tickCurrent = world.timerTicksSoFar;
            var ticksSinceUsed = tickCurrent - device.tickLastUsed;
            if (ticksSinceUsed < device.ticksToCharge) {
                return;
            }
            device.tickLastUsed = tickCurrent;
            var userLoc = entityUser.locatable().loc;
            var userPos = userLoc.pos;
            var userVel = userLoc.vel;
            var userSpeed = userVel.magnitude();
            if (userSpeed == 0) {
                return;
            }
            var projectileDimension = 1.5;
            var projectileVisual = entityDevice.drawable().visual;
            var userDirection = userVel.clone().normalize();
            var userRadius = entityUser.collidable().collider.radius;
            var projectilePos = userPos.clone().add(userDirection.clone().multiplyScalar(userRadius + projectileDimension).double());
            var projectileOri = new Orientation(userVel.clone().normalize(), null);
            var projectileLoc = new Disposition(projectilePos, projectileOri, null);
            projectileLoc.vel.overwriteWith(userVel).clearZ().double();
            var projectileCollider = new Sphere(new Coords(0, 0, 0), projectileDimension);
            var projectileCollide = (universe, world, place, entityProjectile, entityOther) => {
                var killable = entityOther.killable();
                if (killable != null) {
                    killable.damageApply(universe, world, place, entityProjectile, entityOther, null);
                    entityProjectile.killable().integrity = 0;
                }
            };
            var visualExplosion = new VisualCircle(8, "Red", null);
            var killable = new Killable(1, // integrityMax
            null, // damageApply
            (universe, world, place, entityKillable) => // die
             {
                var entityExplosion = new Entity("Explosion", [
                    new Ephemeral(8, null),
                    new Drawable(visualExplosion, null),
                    new DrawableCamera(),
                    entityKillable.locatable()
                ]);
                place.entitiesToSpawn.push(entityExplosion);
            }, null);
            var projectileEntity = new Entity("Projectile", [
                new Damager(10),
                new Ephemeral(4, null),
                killable,
                new Locatable(projectileLoc),
                new Collidable(projectileCollider, [Killable.name], projectileCollide),
                new Drawable(projectileVisual, null),
                new DrawableCamera()
            ]);
            place.entitiesToSpawn.push(projectileEntity);
        });
        return returnValue;
    }
    // clonable
    clone() {
        return new Device(this.name, this.initialize, this.update, this.use);
    }
    ;
}
