
namespace ThisCouldBeBetter.GameFramework
{

export interface MediaItemBase extends Loadable, Namable
{}

export class MediaLibrary
{
	contentDirectoryPath: string;
	images: Image2[];
	sounds: Sound[];
	videos: Video[];
	fonts: Font[];
	textStrings: TextString[];

	imagesByName: Map<string, Image2>;
	soundsByName: Map<string, Sound>;
	videosByName: Map<string, Video>;
	fontsByName: Map<string, Font>;
	textStringsByName: Map<string, TextString>;

	collectionsAll: MediaItemBase[][];
	collectionsByName: Map<string, Map<string, MediaItemBase>>;

	shouldLoadAllItemsBeforehand: boolean;
	millisecondsPerCheckToSeeIfItemLoaded: number;
	timerHandle: number;

	constructor
	(
		contentDirectoryPath: string,
		images: Image2[],
		sounds: Sound[],
		videos: Video[],
		fonts: Font[],
		textStrings: TextString[]
	)
	{
		this.contentDirectoryPath = contentDirectoryPath;

		this.images = images || [];
		this.imagesByName = ArrayHelper.addLookupsByName(this.images);
		this.sounds = sounds || [];
		this.soundsByName = ArrayHelper.addLookupsByName(this.sounds);
		this.videos = videos || [];
		this.videosByName = ArrayHelper.addLookupsByName(this.videos);
		this.fonts = fonts || [];
		this.fontsByName = ArrayHelper.addLookupsByName(this.fonts);
		this.textStrings = textStrings || [];
		this.textStringsByName = ArrayHelper.addLookupsByName(this.textStrings);

		this.collectionsAll =
		[
			this.images,
			this.sounds,
			this.videos,
			this.fonts,
			this.textStrings
		];

		this.collectionsByName = new Map<string, Map<string, MediaItemBase> >();
		this.collectionsByName.set("Images", this.imagesByName);
		this.collectionsByName.set("Sounds", this.soundsByName);
		this.collectionsByName.set("Videos", this.videosByName);
		this.collectionsByName.set("Fonts", this.fontsByName);
		this.collectionsByName.set("TextStrings", this.textStringsByName);

		this.shouldLoadAllItemsBeforehand = true;
		this.millisecondsPerCheckToSeeIfItemLoaded = 100;
	}

	static default()
	{
		return MediaLibrary.fromMediaFilePaths([]);
	}

	static fromMediaFilePaths(mediaFilePaths: string[]): MediaLibrary
	{
		return MediaLibrary.fromContentDirectoryPathAndMediaFilePaths
		(
			"../Content/", mediaFilePaths
		);
	}

	static fromContentDirectoryPathAndMediaFilePaths
	(
		contentDirectoryPath: string,
		mediaFilePaths: string[]
	): MediaLibrary
	{
		var images = new Array<Image2>();
		var sounds = new Array<Sound>();
		var videos = new Array<Video>();
		var fonts = new Array<Font>();
		var textStrings = new Array<TextString>();

		var imageTypeDirectoryNameAndArray = [ Image2, "Images", images ];
		var soundTypeDirectoryNameAndArray = [ SoundFromFile, "Audio", sounds ];
		var textStringTypeDirectoryNameAndArray = [ TextString, "Text", textStrings ];

		var typesDirectoryNamesAndArraysByFileExtension = new Map<string,Array<any>>
		([
			[ "jpg", imageTypeDirectoryNameAndArray ],
			[ "png", imageTypeDirectoryNameAndArray ],
			[ "svg", imageTypeDirectoryNameAndArray ],

			[ "mod", [ SoundFromFileMod, "Audio", sounds ] ],

			[ "mp3", soundTypeDirectoryNameAndArray ],
			[ "wav", soundTypeDirectoryNameAndArray ],

			[ "webm", [ Video, "Video", videos ] ],

			[ "ttf", [ Font, "Fonts", fonts ] ],

			[ "json", textStringTypeDirectoryNameAndArray ],
			[ "txt", textStringTypeDirectoryNameAndArray ],
		]);

		for (var i = 0; i < mediaFilePaths.length; i++)
		{
			var filePath = mediaFilePaths[i];

			var fileExtension = filePath.substr(filePath.lastIndexOf(".") + 1);
			var typeDirectoryNameAndArray =
				typesDirectoryNamesAndArraysByFileExtension.get(fileExtension);
			var mediaType = typeDirectoryNameAndArray[0];
			var mediaDirectoryName = typeDirectoryNameAndArray[1];
			var mediaArray = typeDirectoryNameAndArray[2];

			var filePathParts = filePath.split("/");
			var filePathPartIndexForMediaType =
				filePathParts.indexOf(mediaDirectoryName);
			filePathParts.splice(0, filePathPartIndexForMediaType + 1);
			var fileName = filePathParts.join("_");
			var fileStemAndExtension = fileName.split(".");
			var fileStem = fileStemAndExtension[0];

			var mediaObject = new mediaType(fileStem, filePath);
			if (fileExtension == "mp3")
			{
				// hack
				(mediaObject as Sound).isRepeating = true;
			}
			mediaArray.push(mediaObject);
		}

		var returnValue = new MediaLibrary
		(
			contentDirectoryPath, images, sounds, videos, fonts, textStrings
		);

		return returnValue;
	}

	static fromFileNamesByCategory
	(
		contentPath: string,
		imageFileNames: string[],
		effectFileNames: string[],
		musicFileNames: string[],
		videoFileNames: string[],
		fontFileNames: string[],
		textStringFileNames: string[]
	): MediaLibrary
	{
		var mediaTypesPathsAndFileNames: [any, string, string[] ][] =
		[
			[ Image2, "Images", imageFileNames ],
			[ SoundFromFile, "Audio/Effects", effectFileNames ],
			[ SoundFromFile, "Audio/Music", musicFileNames ],
			[ Video, "Video", videoFileNames ],
			[ Font, "Fonts", fontFileNames ],
			[ TextString, "Text", textStringFileNames ]
		];

		var mediaCollectionsByPath = new Map<string, MediaItemBase[]>();

		for (var t = 0; t < mediaTypesPathsAndFileNames.length; t++)
		{
			var mediaTypePathAndFileNames = mediaTypesPathsAndFileNames[t];
			var mediaType: any = mediaTypePathAndFileNames[0];
			var mediaPath: string = mediaTypePathAndFileNames[1];
			var mediaFileNames: string[] = mediaTypePathAndFileNames[2];
			var mediaCollection = new Array<MediaItemBase>();

			var filePathRoot = contentPath + mediaPath + "/";
			for (var i = 0; i < mediaFileNames.length; i++)
			{
				var fileName: string = mediaFileNames[i];
				var id = fileName.substr(0, fileName.indexOf("."));
				var filePath = filePathRoot + fileName;
				var mediaObject = new mediaType(id, filePath);
				mediaCollection.push(mediaObject);
			}

			mediaCollectionsByPath.set(mediaPath, mediaCollection);
		}

		var images = mediaCollectionsByPath.get("Images") as Image2[];
		var soundEffects = mediaCollectionsByPath.get("Audio/Effects") as Sound[];
		var soundMusics = mediaCollectionsByPath.get("Audio/Music") as Sound[];
		var videos = mediaCollectionsByPath.get("Video") as Video[];
		var fonts = mediaCollectionsByPath.get("Fonts") as Font[];
		var textStrings = mediaCollectionsByPath.get("Text") as TextString[];

		var sounds = soundEffects.concat(soundMusics);

		var returnValue = new MediaLibrary
		(
			contentPath, images, sounds, videos, fonts, textStrings
		);

		return returnValue;
	}

	// Instance methods.

	areAllItemsLoaded(): boolean
	{
		var areAllItemsLoadedSoFar = true;

		for (var c = 0; c < this.collectionsAll.length; c++)
		{
			var collection = this.collectionsAll[c];
			for (var i = 0; i < collection.length; i++)
			{
				var item = collection[i];
				if (item.isLoaded == false)
				{
					areAllItemsLoadedSoFar = false;
					break;
				}
			}

			if (areAllItemsLoadedSoFar == false)
			{
				break;
			}
		}

		return areAllItemsLoadedSoFar;
	}

	itemsAll(): MediaItemBase[]
	{
		var returnValues = new Array<MediaItemBase>();

		for (var c = 0; c < this.collectionsAll.length; c++)
		{
			var collection = this.collectionsAll[c];
			for (var i = 0; i < collection.length; i++)
			{
				var item = collection[i];
				returnValues.push(item);
			}
		}

		return returnValues;
	}

	loadItemsBeforehandIfNecessary(callback: () => void): void
	{
		if (this.shouldLoadAllItemsBeforehand)
		{
			this.waitForItemsAllToLoad(callback);
		}
		else
		{
			callback();
		}
	}

	shouldLoadAllItemsBeforehandSet(value: boolean): MediaLibrary
	{
		this.shouldLoadAllItemsBeforehand = value;
		return this;
	}

	waitForItemToLoad
	(
		collectionName: string,
		itemName: string,
		callback: () => void
	): void
	{
		var itemToLoad =
			this.collectionsByName
				.get(collectionName)
				.get(itemName);

		itemToLoad.load(null, null);

		this.timerHandle = setInterval
		(
			this.waitForItemToLoad_TimerTick.bind(this, itemToLoad, callback),
			100 // milliseconds
		);
	}

	waitForItemToLoad_TimerTick
	(
		itemToLoad: MediaItemBase, callback: () => void
	): void
	{
		if (itemToLoad.isLoaded)
		{
			clearInterval(this.timerHandle);
			callback();
		}
	}

	waitForItemsAllToLoad(callback: () => void): void
	{
		var itemsToLoad = this.itemsAll();
		this.waitForItemsToLoad(itemsToLoad, callback);
	}

	waitForItemsToLoad
	(
		itemsToLoad: MediaItemBase[],
		callback: () => void
	): void
	{
		itemsToLoad.forEach(x => x.load(null, null));
		this.timerHandle = setInterval
		(
			this.waitForItemsToLoad_TimerTick.bind(this, itemsToLoad, callback),
			this.millisecondsPerCheckToSeeIfItemLoaded
		);
	}

	waitForItemsToLoad_TimerTick
	(
		itemsToLoad: MediaItemBase[],
		callback: () => void
	)
	{
		var atLeastOneItemIsNotLoaded =
			itemsToLoad.some(x => x.isLoaded == false);
		if (atLeastOneItemIsNotLoaded == false)
		{
			clearInterval(this.timerHandle);
			callback();
		}
	}

	// accessors

	imagesAdd(images: Image2[]): void
	{
		for (var i = 0; i < images.length; i++)
		{
			var image = images[i];
			if (this.imagesByName.get(image.name) == null)
			{
				this.images.push(image);
				this.imagesByName.set(image.name, image);
			}
		}
	}

	soundsAdd(sounds: Sound[]): void
	{
		for (var i = 0; i < sounds.length; i++)
		{
			var sound = sounds[i];
			if (this.soundsByName.get(sound.name) == null)
			{
				this.sounds.push(sound);
				this.soundsByName.set(sound.name, sound);
			}
		}
	}

	fontGetByName(name: string): Font
	{
		var returnFont = this.fontsByName.get(name);
		if (returnFont == null)
		{
			throw new Error("No font found with name: " + name);
		}
		return returnFont;
	}

	imageGetByName(name: string): Image2
	{
		var returnImage = this.imagesByName.get(name);
		if (returnImage == null)
		{
			throw new Error("No image found with name: " + name);
		}
		return returnImage;
	}

	soundGetByName(name: string): Sound
	{
		var returnSound = this.soundsByName.get(name);
		if (returnSound == null)
		{
			throw new Error("No sound found with name: " + name);
		}
		return returnSound;
	}

	textStringGetByName(name: string): TextString
	{
		var returnTextString = this.textStringsByName.get(name);
		if (returnTextString == null)
		{
			throw new Error("No text string found with name: " + name);
		}
		return returnTextString;
	}

	textStringWithNameExists(name: string): boolean
	{
		return this.textStringsByName.has(name);
	}

	videoGetByName(name: string): Video
	{
		var returnVideo = this.videosByName.get(name);
		if (returnVideo == null)
		{
			throw new Error("No video found with name: " + name);
		}
		return returnVideo;
	}
}

}
