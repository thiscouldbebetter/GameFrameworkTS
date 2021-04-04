
namespace ThisCouldBeBetter.GameFramework
{

export interface Constraint 
{
	constrain: (universe: Universe, world: World, place: Place, entity: Entity) => void;
}

export class Constraint_None implements Constraint
{
	constrain(universe: Universe, world: World, place: Place, entity: Entity)
	{
		// Do nothing.
	}
}

}
