
namespace ThisCouldBeBetter.GameFramework
{

export interface Constraint
{
	constrain: (uwpe: UniverseWorldPlaceEntities) => void;
}

export class Constraint_None implements Constraint
{
	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		// Do nothing.
	}
}

}
