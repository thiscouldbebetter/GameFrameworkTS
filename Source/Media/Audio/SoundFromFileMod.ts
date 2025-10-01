
namespace ThisCouldBeBetter.GameFramework
{

export class SoundFromFileMod implements Sound
{
	name: string;
	sourceFilePath: string;

	timesToPlay: number;

	_binaryFileInner: BinaryFile;
	_binaryFileInnerLoadTimer: any;

	_soundInner: WavFileViewer.Sound;

	constructor(name: string, sourceFilePath: string)
	{
		this.name = name;
		this.sourceFilePath = sourceFilePath;

		this.isLoaded = false;
	}

	// Sound implementation.

	/*
	pause(universe: Universe): void
	{
		// todo
	}

	play(universe: Universe, volume: number): void
	{
		this._soundInner.play(); // todo - Use .playThenCallCallback()?
	}

	seek(offsetInSeconds: number): void
	{
		// todo
	}

	stop(universe: Universe): void
	{
		if (this._soundInner != null)
		{
			this._soundInner.stop(); // todo
		}
	}
	*/

	domElement(): HTMLAudioElement
	{
		return this._soundInner.domElement();
	}

	// Loadable.

	isLoaded: boolean;

	load(uwpe: UniverseWorldPlaceEntities): SoundFromFileMod
	{
		this._binaryFileInner =
			new BinaryFile(this.name, this.sourceFilePath);

		this._binaryFileInner.load
		(
			uwpe,
			this.load_binaryFileInnerLoaded.bind(this)
		);

		return this;
	}

	load_binaryFileInnerLoaded(result: Loadable): void
	{
		var soundFileAsBinaryFile = result as BinaryFile;
		var soundFileAsBytes = soundFileAsBinaryFile.bytes;

		var modFile = ThisCouldBeBetter.MusicTracker.ModFile.fromBytes
		(
			this.name, soundFileAsBytes
		);
		var modFileAsSong = ThisCouldBeBetter.MusicTracker.Song.fromModFile(modFile);

		this.isLoaded = true;

		this._soundInner = modFileAsSong.toSound();
	}

	unload(uwpe: UniverseWorldPlaceEntities): SoundFromFileMod
	{
		throw new Error("todo");
	}

}

}
