
class MediaLibrary
{
	images: Image2[];
	sounds: Sound[];
	videos: Video[];
	fonts: Font[];
	textStrings: TextString[];

	imagesByName: any;
	soundsByName: any;
	videosByName: any;
	fontsByName: any;
	textStringsByName: any;

	collectionsAll: any;
	collectionsByName: any;

	timer: any;

	constructor(images: Image2[], sounds: Sound[], videos: Video[], fonts: Font[], textStrings: TextString[])
	{
		this.images = images;
		this.imagesByName = ArrayHelper.addLookupsByName(this.images);
		this.sounds = sounds;
		this.soundsByName = ArrayHelper.addLookupsByName(this.sounds);
		this.videos = videos;
		this.videosByName = ArrayHelper.addLookupsByName(this.videos);
		this.fonts = fonts;
		this.fontsByName = ArrayHelper.addLookupsByName(this.fonts);
		this.textStrings = textStrings;
		this.textStringsByName = ArrayHelper.addLookupsByName(this.textStrings);

		this.collectionsAll =
		[
			this.images,
			this.sounds,
			this.videos,
			this.fonts,
			this.textStrings
		];

		this.collectionsByName = {};
		this.collectionsByName["Images"] = this.images;
		this.collectionsByName["Sounds"] = this.sounds;
		this.collectionsByName["Videos"] = this.videos;
		this.collectionsByName["Fonts"] = this.fonts;
		this.collectionsByName["TextStrings"] = this.textStrings;
	}

	static fromFileNames
	(
		contentPath: string, imageFileNames: string[], effectFileNames: string[],
		musicFileNames: string[], videoFileNames: string[], fontFileNames: string[],
		textStringFileNames: string[]
	)
	{
		var mediaTypesPathsAndFileNames =
		[
			[ Image2, "Images", imageFileNames ],
			[ Sound, "Audio/Effects", effectFileNames ],
			[ Sound, "Audio/Music", musicFileNames ],
			[ Video, "Video", videoFileNames ],
			[ Font, "Fonts", fontFileNames ],
			[ TextString, "Text", textStringFileNames ],
		];

		var mediaCollectionsByPath = new Map<string, any>();

		for (var t = 0; t < mediaTypesPathsAndFileNames.length; t++)
		{
			var mediaTypePathAndFileNames: any = mediaTypesPathsAndFileNames[t];
			var mediaType: any = mediaTypePathAndFileNames[0];
			var mediaPath: string = mediaTypePathAndFileNames[1];
			var mediaFileNames: string[] = mediaTypePathAndFileNames[2];
			var mediaCollection: any = [];

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

		var images: any = mediaCollectionsByPath.get("Images");
		var soundEffects: any = mediaCollectionsByPath.get("Audio/Effects");
		var soundMusics: any = mediaCollectionsByPath.get("Audio/Music");
		var videos: any = mediaCollectionsByPath.get("Video");
		var fonts: any = mediaCollectionsByPath.get("Fonts");
		var textStrings: any = mediaCollectionsByPath.get("Text");

		var sounds = soundEffects.concat(soundMusics);

		var returnValue = new MediaLibrary
		(
			images, sounds, videos, fonts, textStrings
		);

		return returnValue;
	};

	// Instance methods.

	areAllItemsLoaded()
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
	};

	waitForItemToLoad(collectionName: string, itemName: string, callback: any)
	{
		var itemToLoad = this.collectionsByName[collectionName][itemName];
		this.timer = setInterval
		(
			this.waitForItemToLoad_TimerTick.bind(this, itemToLoad, callback),
			100 // milliseconds
		);
	};

	waitForItemToLoad_TimerTick(itemToLoad: any, callback: any)
	{
		if (itemToLoad.isLoaded)
		{
			clearInterval(this.timer);
			callback.call();
		}
	};

	waitForItemsAllToLoad(callback: any)
	{
		this.timer = setInterval
		(
			this.waitForItemsAllToLoad_TimerTick.bind(this, callback),
			100 // milliseconds
		);
	};

	waitForItemsAllToLoad_TimerTick(callback: any)
	{
		if (this.areAllItemsLoaded())
		{
			clearInterval(this.timer);
			callback.call();
		}
	};

	// accessors

	imagesAdd(images: Image2[])
	{
		for (var i = 0; i < images.length; i++)
		{
			var image = images[i];
			if (this.imagesByName[image.name] == null)
			{
				this.images.push(image);
				this.imagesByName[image.name] = image;
			}
		}
	};

	fontGetByName(name: string)
	{
		return this.fontsByName[name];
	};

	imageGetByName(name: string)
	{
		return this.imagesByName[name];
	};

	soundGetByName(name: string)
	{
		return this.soundsByName[name];
	};

	textStringGetByName(name: string)
	{
		return this.textStringsByName[name];
	};

	videoGetByName(name: string)
	{
		return this.videosByName[name];
	};
}
