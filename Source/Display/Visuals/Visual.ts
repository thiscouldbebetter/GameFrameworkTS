
namespace ThisCouldBeBetter.GameFramework
{

export interface Visual extends Transformable
{
	draw(uwpe: UniverseWorldPlaceEntities, display: Display): any;

	clone(): Visual;
	overwriteWith(x: Visual): Visual;
}

}
