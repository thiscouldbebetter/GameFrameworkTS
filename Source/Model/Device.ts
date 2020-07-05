
class Device
{
	name: string;
	initialize: any;
	update: any;
	use: any;

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
				var device = entity.device();
				device.ticksToCharge = 10;
				device.tickLastUsed = 0;
			},
			function update(u, w, p, e)
			{
				// todo
			},
			function use(universe, world, place, entityUser, entityDevice)
			{
				var device = entityDevice.device();
				var tickCurrent = world.timerTicksSoFar;
				var ticksSinceUsed = tickCurrent - this.tickLastUsed;
				if (ticksSinceUsed < device.ticksToCharge)
				{
					return;
				}

				var userAsItemHolder = entityUser.itemHolder();
				var hasAmmo = userAsItemHolder.hasItemWithDefnNameAndQuantity("Ammo", 1);
				if (hasAmmo == false)
				{
					return;
				}

				userAsItemHolder.itemSubtractDefnNameAndQuantity("Ammo", 1);

				device.tickLastUsed = tickCurrent;

				var userLoc = entityUser.locatable().loc;
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
						projectileColor, // colorFill
						null
					),
					new VisualOffset
					(
						new VisualText("Projectile", projectileColor, null),
						new Coords(0, 0 - projectileDimension * 3, 0)
					)
				]);

				var userDirection = userVel.clone().normalize();
				var userRadius = entityUser.collidable().collider.radius;
				var projectilePos = userPos.clone().add
				(
					userDirection.clone().multiplyScalar(userRadius + projectileDimension).double()
				);
				var projectileOri = new Orientation
				(
					userVel.clone().normalize(), null
				);
				var projectileLoc = new Disposition(projectilePos, projectileOri, null);
				projectileLoc.vel.overwriteWith(userVel).clearZ().double();

				var projectileCollider =
					new Sphere(new Coords(0, 0, 0), projectileDimension);

				var projectileCollide = function(universe, world, place, entityProjectile, entityOther)
				{
					var killable = entityOther.killable();
					if (killable != null)
					{
						killable.damageApply
						(
							universe, world, place, entityProjectile, entityOther
						);
						entityProjectile.killable().integrity = 0;
					}
				};

				var visualExplosion = new VisualCircle(8, "Red", null);
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
								new Ephemeral(8, null),
								new Drawable(visualExplosion, null),
								new DrawableCamera(),
								entityKillable.locatable()
							]
						);
						place.entitiesToSpawn.push(entityExplosion);
					},
					null
				);

				var projectileEntity = new Entity
				(
					"Projectile",
					[
						new Damager(10),
						new Ephemeral(32, null),
						killable,
						new Locatable( projectileLoc ),
						new Collidable
						(
							projectileCollider,
							[ Killable.name ],
							projectileCollide
						),
						new Drawable(projectileVisual, null),
						new DrawableCamera()
					]
				);

				place.entitiesToSpawn.push(projectileEntity);
			}
		);

		return returnValue;
	}

	static sword()
	{
		var returnValue = new Device
		(
			"Sword",
			function initialize(u, w, p, entity)
			{
				var device = entity.device();
				device.ticksToCharge = 10;
				device.tickLastUsed = 0;
			},
			function update(u, w, p, e)
			{
				// todo
			},
			function use(universe, world, place, entityUser, entityDevice)
			{
				var device = entityDevice.device();
				var tickCurrent = world.timerTicksSoFar;
				var ticksSinceUsed = tickCurrent - this.tickLastUsed;
				if (ticksSinceUsed < device.ticksToCharge)
				{
					return;
				}

				var userAsItemHolder = entityUser.itemHolder();

				device.tickLastUsed = tickCurrent;

				var userLoc = entityUser.locatable().loc;
				var userPos = userLoc.pos;
				var userVel = userLoc.vel;
				var userSpeed = userVel.magnitude();
				if (userSpeed == 0) { return; }

				var projectileDimension = 1.5;

				var projectileVisual = entityDevice.drawable().visual;

				var userDirection = userVel.clone().normalize();
				var userRadius = entityUser.collidable().collider.radius;
				var projectilePos = userPos.clone().add
				(
					userDirection.clone().multiplyScalar(userRadius + projectileDimension).double()
				);
				var projectileOri = new Orientation
				(
					userVel.clone().normalize(), null
				);
				var projectileLoc = new Disposition(projectilePos, projectileOri, null);
				projectileLoc.vel.overwriteWith(userVel).clearZ().double();

				var projectileCollider =
					new Sphere(new Coords(0, 0, 0), projectileDimension);

				var projectileCollide = function(universe, world, place, entityProjectile, entityOther)
				{
					var killable = entityOther.killable();
					if (killable != null)
					{
						killable.damageApply
						(
							universe, world, place, entityProjectile, entityOther
						);
						entityProjectile.killable().integrity = 0;
					}
				};

				var visualExplosion = new VisualCircle(8, "Red", null);
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
								new Ephemeral(8, null),
								new Drawable(visualExplosion, null),
								new DrawableCamera(),
								entityKillable.locatable()
							]
						);
						place.entitiesToSpawn.push(entityExplosion);
					},
					null
				);

				var projectileEntity = new Entity
				(
					"Projectile",
					[
						new Damager(10),
						new Ephemeral(4, null),
						killable,
						new Locatable( projectileLoc ),
						new Collidable
						(
							projectileCollider,
							[ Killable.name ],
							projectileCollide
						),
						new Drawable(projectileVisual, null),
						new DrawableCamera()
					]
				);

				place.entitiesToSpawn.push(projectileEntity);
			}
		);

		return returnValue;
	}

	// clonable

	clone()
	{
		return new Device(this.name, this.initialize, this.update, this.use);
	};
}
