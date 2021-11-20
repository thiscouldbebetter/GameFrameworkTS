
namespace ThisCouldBeBetter.GameFramework
{

export interface Loadable
{
	isLoaded: boolean;
	load(uwpe: UniverseWorldPlaceEntities): void;
	unload(uwpe: UniverseWorldPlaceEntities): void;
}

}
