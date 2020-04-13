
class Device
{
	constructor(name, initialize, update, use)
	{
		this.name = name;
		this.initialize = initialize;
		this.update = update;
		this.use = use;
	}

	// static methods

	static gun()
	{
		var returnValue = new Device
		(
			"Gun",
			function initialize(u, w, p, entity)
			{
				var device = entity.device;
				device.ticksToCharge = 10;
				device.tickLastUsed = 0;
			},
			function update(u, w, p, e)
			{
				// todo
			},
			function use(universe, world, place, entityUser, entityDevice)
			{
				var device = entityDevice.device;
				var tickCurrent = world.timerTicksSoFar;
				var ticksSinceUsed = tickCurrent - this.tickLastUsed;
				if (ticksSinceUsed < device.ticksToCharge)
				{
					return;
				}

				var userAsItemHolder = entityUser.itemHolder;
				var hasAmmo = userAsItemHolder.hasItemWithDefnNameAndQuantity("Ammo", 1);
				if (hasAmmo == false)
				{
					return;
				}

				userAsItemHolder.itemSubtractDefnNameAndQuantity("Ammo", 1);

				device.tickLastUsed = tickCurrent;

				var userLoc = entityUser.locatable.loc;
				var userPos = userLoc.pos;
				var userVel = userLoc.vel;
				var userSpeed = userVel.magnitude();
				if (userSpeed == 0) { return; }

				var projectileColor = "Cyan";
				var projectileDimension = 1.5;
				var projectileVisual = new VisualGroup
				([
					new VisualEllipse
					(
						projectileDimension * 2, // semimajorAxis,
						projectileDimension, // semiminorAxis,
						0, // rotationInTurns,
						projectileColor // colorFill
					),
					new VisualOffset
					(
						new VisualText("Projectile", projectileColor),
						new Coords(0, projectileDimension * 2)
					)
				]);

				var userDirection = userVel.clone().normalize();
				var userRadius = entityUser.collidable.collider.radius;
				var projectilePos = userPos.clone().add
				(
					userDirection.clone().multiplyScalar(userRadius + projectileDimension).double()
				);
				var projectileOri = new Orientation
				(
					userVel.clone().normalize()
				);
				var projectileLoc = new Location(projectilePos, projectileOri);
				projectileLoc.vel.overwriteWith(userVel).clearZ().double();

				var projectileCollider =
					new Sphere(new Coords(0, 0), projectileDimension);

				var projectileCollide = function(universe, world, place, entityProjectile, entityOther)
				{
					var killable = entityOther.killable;
					if (killable != null)
					{
						killable.damageApply
						(
							universe, world, place, entityProjectile, entityOther
						);
						entityProjectile.killable.integrity = 0;
					}
				};

				var visualExplosion = new VisualCircle(8, "Red");
				var killable = new Killable
				(
					1, // integrityMax
					null, // damageApply
					function die(universe, world, place, entityKillable)
					{
						var entityExplosion = new Entity
						(
							"Explosion",
							[
								new Ephemeral(8),
								new Drawable(visualExplosion),
								new DrawableCamera(),
								entityKillable.locatable
							]
						);
						place.entitiesToSpawn.push(entityExplosion);
					}
				);

				var projectileEntity = new Entity
				(
					"Projectile",
					[
						new Damager(10),
						new Ephemeral(32),
						killable,
						new Locatable( projectileLoc ),
						new Collidable
						(
							projectileCollider,
							[ Killable.name ],
							projectileCollide
						),
						new Drawable(projectileVisual),
						new DrawableCamera()
					]
				);

				place.entitiesToSpawn.push(projectileEntity);
			}
		);

		return returnValue;
	};

	// clonable

	clone()
	{
		return new Device(this.name, this.initialize, this.update, this.use);
	};
}
