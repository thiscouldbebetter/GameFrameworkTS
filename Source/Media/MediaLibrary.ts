
namespace ThisCouldBeBetter.GameFramework
{

export interface MediaItemBase extends Loadable
{}

export class MediaLibrary
{
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

	timerHandle: number;

	constructor
	(
		images: Image2[], sounds: Sound[], videos: Video[],
		fonts: Font[], textStrings: TextString[]
	)
	{
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
	}

	static default()
	{
		return MediaLibrary.fromFilePaths([]);
	}

	static fromFilePaths(mediaFilePaths: string[]): MediaLibrary
	{
		var images = new Array<Image2>();
		var sounds = new Array<Sound>();
		var videos = new Array<Video>();
		var fonts = new Array<Font>();
		var textStrings = new Array<TextString>();

		var imageTypeDirectoryNameAndArray = [ Image2, "Images", images ];
		var soundTypeDirectoryNameAndArray = [ Sound, "Audio", sounds ];
		var textStringTypeDirectoryNameAndArray = [ TextString, "Text", textStrings ];

		var typesDirectoryNamesAndArraysByFileExtension = new Map<string,Array<any>>
		([
			[ "jpg", imageTypeDirectoryNameAndArray ],
			[ "png", imageTypeDirectoryNameAndArray ],
			[ "svg", imageTypeDirectoryNameAndArray ],

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
			mediaArray.push(mediaObject);
		}

		var returnValue = new MediaLibrary
		(
			images, sounds, videos, fonts, textStrings
		);

		return returnValue;
	}

	static fromFileNamesByCategory
	(
		contentPath: string, imageFileNames: string[], effectFileNames: string[],
		musicFileNames: string[], videoFileNames: string[], fontFileNames: string[],
		textStringFileNames: string[]
	): MediaLibrary
	{
		var mediaTypesPathsAndFileNames: [any, string, string[] ][] =
		[
			[ Image2, "Images", imageFileNames ],
			[ Sound, "Audio/Effects", effectFileNames ],
			[ Sound, "Audio/Music", musicFileNames ],
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
			images, sounds, videos, fonts, textStrings
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

	waitForItemToLoad
	(
		collectionName: string, itemName: string, callback: ()=>void
	): void
	{
		var itemToLoad = this.collectionsByName.get(collectionName).get(itemName);
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

	waitForItemsAllToLoad(callback: ()=>void): void
	{
		this.timerHandle = setInterval
		(
			this.waitForItemsAllToLoad_TimerTick.bind(this, callback),
			100 // milliseconds
		);
	}

	waitForItemsAllToLoad_TimerTick(callback: ()=>void)
	{
		if (this.areAllItemsLoaded())
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

	fontGetByName(name: string): Font
	{
		return this.fontsByName.get(name);
	}

	imageGetByName(name: string): Image2
	{
		return this.imagesByName.get(name);
	}

	soundGetByName(name: string): Sound
	{
		return this.soundsByName.get(name);
	}

	textStringGetByName(name: string): TextString
	{
		return this.textStringsByName.get(name);
	}

	videoGetByName(name: string): Video
	{
		return this.videosByName.get(name);
	}
}

}
