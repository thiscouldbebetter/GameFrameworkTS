
namespace ThisCouldBeBetter.GameFramework
{

export class Vehicle implements EntityProperty
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
		this.accelerationPerTick = accelerationPerTick;
		this.speedMax = speedMax;
		this.steeringAngleInTurns = steeringAngleInTurns;

		this.entityOccupant = null;
		this.steeringDirection = 0;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this.entityOccupant != null)
		{
			var universe = uwpe.universe;
			var world = uwpe.world;
			var place = uwpe.place;
			var entityVehicle = uwpe.entity;

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
			var vehicleRight = vehicleOrientation.right;
			var vehicleVel = vehicleLoc.vel;
			var vehicleSpeed = vehicleVel.magnitude();
			var isAccelerating = false;

			for (var i = 0; i < actionsToPerform.length; i++)
			{
				var action = actionsToPerform[i];
				var actionName = action.name;

				// todo
				if (actionName == "MoveUp")
				{
					isAccelerating = true;
				}
				else if (actionName == "MoveLeft")
				{
					vehicle.steeringDirection = -1;
				}
				else if (actionName == "MoveRight")
				{
					vehicle.steeringDirection = 1;
				}
				else if (actionName == "Use")
				{
					var occupantLoc = this.entityOccupant.locatable().loc;
					occupantLoc.pos.overwriteWith(vehicleLoc.pos);
					occupantLoc.vel.clear();
					place.entityToSpawnAdd(this.entityOccupant);
					this.entityOccupant = null;
				}
			}

			if (isAccelerating)
			{
				vehicleLoc.accel.overwriteWith
				(
					vehicleForward
				).multiplyScalar
				(
					this.accelerationPerTick
				);
			}

			if (vehicleSpeed > 0)
			{
				vehicleOrientation.forwardSet(vehicleVel.clone().normalize());

				var vehicleSpeedOverMax = vehicleSpeed / this.speedMax;

				var steeringFactor = .5;

				vehicleLoc.accel.add
				(
					vehicleRight.clone().multiplyScalar
					(
						vehicle.steeringDirection * steeringFactor * vehicleSpeedOverMax
					)
				);
			}

			vehicleVel.trimToMagnitudeMax
			(
				this.speedMax
			);
		}
	}
}

}
