
class Vehicle extends EntityProperty
{
	accelerationPerTick: number;
	speedMax: number;
	steeringAngleInTurns: number;

	entityOccupant: Entity;
	steeringDirection: number;

	constructor
	(
		accelerationPerTick: number, speedMax: number, steeringAngleInTurns: number
	)
	{
		super();
		this.accelerationPerTick = accelerationPerTick;
		this.speedMax = speedMax;
		this.steeringAngleInTurns = steeringAngleInTurns;

		this.entityOccupant = null;
		this.steeringDirection = 0;
	}

	updateForTimerTick(universe: Universe, world: World, place: Place, entityVehicle: Entity)
	{
		if (this.entityOccupant != null)
		{
			var placeDefn = place.defn(world);
			var actionsByName = placeDefn.actionsByName;
			var inputHelper = universe.inputHelper;
			var actionsToPerform = inputHelper.actionsFromInput
			(
				actionsByName, placeDefn.actionToInputsMappingsByInputName
			);

			var vehicle = entityVehicle.propertiesByName.get(Vehicle.name) as Vehicle;
			vehicle.steeringDirection = 0;

			var vehicleLoc = entityVehicle.locatable().loc;
			var vehicleOrientation = vehicleLoc.orientation;
			var vehicleForward = vehicleOrientation.forward;
			var vehicleVel = vehicleLoc.vel;

			for (var i = 0; i < actionsToPerform.length; i++)
			{
				var action = actionsToPerform[i];
				var actionName = action.name;

				// todo
				if (actionName == "MoveUp")
				{
					vehicleLoc.vel.add
					(
						vehicleForward.clone().multiplyScalar
						(
							this.accelerationPerTick
						)
					);
				}
				else if (actionName == "MoveLeft")
				{
					vehicle.steeringDirection = -1;
				}
				else if (actionName == "MoveRight")
				{
					vehicle.steeringDirection = 1;
				}
			}

			var vehicleHeadingInTurns = vehicleForward.headingInTurns();
			vehicleHeadingInTurns +=
				vehicle.steeringDirection * vehicle.steeringAngleInTurns;
			vehicleHeadingInTurns = NumberHelper.wrapToRangeMinMax
			(
				vehicleHeadingInTurns, 0, 1
			);
			vehicleForward.fromHeadingInTurns(vehicleHeadingInTurns);

			var vehicleSpeed = vehicleVel.magnitude();
			vehicleVel.overwriteWith
			(
				vehicleForward
			).normalize().multiplyScalar
			(
				vehicleSpeed
			).trimToMagnitudeMax
			(
				this.speedMax
			);
		}
	}
}
