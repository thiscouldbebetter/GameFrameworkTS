
class Game
{
	name: string,
	contentDirectoryPath: string;

	constructor(name: string, contentDirectoryPath: string)
	{
		this.name = name;
		this.contentDirectoryPath = contentDirectoryPath;
	}

	start(): void
	{
		// It may be necessary to clear local storage to prevent errors on
		// deserialization of existing saved items after the schema changes.
		// localStorage.clear();

		var mediaFilePaths = this.mediaFilePathsBuild();

		var mediaLibrary =
			MediaLibrary.fromContentDirectoryPathAndMediaFilePaths
			(
				this.contentDirectoryPath, mediaFilePaths
			);

		var worldCreator = WorldCreator.fromWorldCreate
		(
			() => new WorldGame(this.name)
		);

		var universe = Universe.fromMediaLibraryAndWorldCreator
		(
			mediaLibrary,
			worldCreator
		);

		universe.initialize
		(
			() => { universe.start(); }
		);
	}

	mediaFilePathsBuild(): string[]
	{
		var contentDirectoryPath = this.contentDirectoryPath;

		var fontDirectoryPath = contentDirectoryPath + "Fonts/";
		var imageDirectoryPath = contentDirectoryPath + "Images/";
		var imageTitlesDirectoryPath = imageDirectoryPath + "Titles/";
		var soundEffectDirectoryPath = contentDirectoryPath + "Audio/Effects/";
		var soundMusicDirectoryPath = contentDirectoryPath + "Audio/Music/";
		var textStringDirectoryPath = contentDirectoryPath + "Text/";
		var videoDirectoryPath = contentDirectoryPath + "Video/";

		var mediaFilePaths =
		[
			imageTitlesDirectoryPath + "Opening.png",
			imageTitlesDirectoryPath + "Producer.png",
			imageTitlesDirectoryPath + "Title.png",

			soundEffectDirectoryPath + "Sound.wav",

			soundMusicDirectoryPath + "Music.mp3",
			soundMusicDirectoryPath + "Producer.mp3",
			soundMusicDirectoryPath + "Title.mp3",

			videoDirectoryPath + "Movie.webm",

			fontDirectoryPath + "Font.ttf",

			textStringDirectoryPath + "Instructions.txt",
		];

		return mediaFilePaths;
	}
}
