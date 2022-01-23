
namespace ThisCouldBeBetter.GameFramework
{

export interface Loadable
{
	isLoaded: boolean;
	load
	(
		uwpe: UniverseWorldPlaceEntities,
		callback: (result: Loadable) => void
	): void;
	unload(uwpe: UniverseWorldPlaceEntities): void;
}

}
