
namespace ThisCouldBeBetter.GameFramework
{

export class SoundFromFile implements Sound
{
	name: string;
	sourcePath: string;

	constructor(name: string, sourcePath: string)
	{
		this.name = name;
		this.sourcePath = sourcePath;
	}

	static fromNameAndSourcePath
	(
		name: string, sourcePath: string
	): SoundFromFile
	{
		return new SoundFromFile(name, sourcePath);
	}

	// Sound

	domElement(universe: Universe): HTMLAudioElement
	{
		return new Audio(this.sourcePath);
	}

	// Loadable.

	isLoaded: boolean;
	load(uwpe: UniverseWorldPlaceEntities, callback: (result: Loadable) => void): Loadable
	{
		return this;
	}
	unload(uwpe: UniverseWorldPlaceEntities): Loadable { throw new Error("todo - SoundFromFile.unload()") }
}

}