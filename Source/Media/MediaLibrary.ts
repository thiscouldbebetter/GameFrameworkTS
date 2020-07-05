
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

	constructor(images, sounds, videos, fonts, textStrings)
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

	static fromFileNames(
		contentPath, imageFileNames, effectFileNames, musicFileNames, videoFileNames, fontFileNames, textStringFileNames
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

		var mediaCollections = {};

		for (var t = 0; t < mediaTypesPathsAndFileNames.length; t++)
		{
			var mediaTypePathAndFileNames = mediaTypesPathsAndFileNames[t];
			var mediaType = mediaTypePathAndFileNames[0];
			var mediaPath = mediaTypePathAndFileNames[1];
			var mediaFileNames = mediaTypePathAndFileNames[2];
			var mediaCollection = [];

			var filePathRoot = contentPath + mediaPath + "/";
			for (var i = 0; i < mediaFileNames.length; i++)
			{
				var fileName = mediaFileNames[i];
				var id = fileName.substr(0, fileName.indexOf("."));
				var filePath = filePathRoot + fileName;
				var mediaObject = new mediaType(id, filePath);
				mediaCollection.push(mediaObject);
			}

			mediaCollections[mediaPath] = mediaCollection;
		}

		var images = mediaCollections["Images"];
		var soundEffects = mediaCollections["Audio/Effects"];
		var soundMusics = mediaCollections["Audio/Music"];
		var videos = mediaCollections["Video"];
		var fonts = mediaCollections["Fonts"];
		var textStrings = mediaCollections["Text"];

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

	waitForItemToLoad(collectionName, itemName, callback)
	{
		var itemToLoad = this.collectionsByName[collectionName][itemName];
		this.timer = setInterval
		(
			this.waitForItemToLoad_TimerTick.bind(this, itemToLoad, callback),
			100 // milliseconds
		);
	};

	waitForItemToLoad_TimerTick(itemToLoad, callback)
	{
		if (itemToLoad.isLoaded)
		{
			clearInterval(this.timer);
			callback.call();
		}
	};

	waitForItemsAllToLoad(callback)
	{
		this.timer = setInterval
		(
			this.waitForItemsAllToLoad_TimerTick.bind(this, callback),
			100 // milliseconds
		);
	};

	waitForItemsAllToLoad_TimerTick(callback)
	{
		if (this.areAllItemsLoaded())
		{
			clearInterval(this.timer);
			callback.call();
		}
	};

	// accessors

	imagesAdd(images)
	{
		for (var i = 0; i < images.length; i++)
		{
			var image = images[i];
			if (this.images[image.name] == null)
			{
				this.images.push(image);
				this.imagesByName[image.name] = image;
			}
		}
	};

	fontGetByName(name)
	{
		return this.fontsByName[name];
	};

	imageGetByName(name)
	{
		return this.imagesByName[name];
	};

	soundGetByName(name)
	{
		return this.soundsByName[name];
	};

	textStringGetByName(name)
	{
		return this.textStringsByName[name];
	};

	videoGetByName(name)
	{
		return this.videosByName[name];
	};
}
