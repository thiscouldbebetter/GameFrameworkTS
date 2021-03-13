
namespace ThisCouldBeBetter.GameFramework
{

export interface Visual extends Transformable
{
	draw(universe: Universe, world: World, place: Place, entity: Entity, display: Display): any;

	clone(): Visual;
	overwriteWith(x: Visual): Visual;
}

}
