
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

export class LoadableGroup implements Loadable
{
	isLoaded: boolean
	loadables: Loadable[];

	constructor(loadables: Loadable[])
	{
		this.loadables = loadables;
	}

	load
	(
		uwpe: UniverseWorldPlaceEntities,
		callback: (result: Loadable) => void
	): void
	{
		var group = this;

		this.loadables.forEach
		(
			loadableToLoad =>
			{
				loadableToLoad.load
				(
					uwpe,
					(resultChild: Loadable) =>
					{
						var areAnyLoadablesStillUnloaded =
							group.loadables.some(x => x.isLoaded == false);

						if (areAnyLoadablesStillUnloaded == false)
						{
							this.isLoaded = true;
							callback(this);
						}
					}
				)
			}
		);
	}

	unload(uwpe: UniverseWorldPlaceEntities): void
	{
		this.loadables.forEach(x => x.unload(uwpe));
		this.isLoaded = false;
	}

}

}
