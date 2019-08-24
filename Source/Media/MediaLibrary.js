
function MediaLibrary(images, sounds, videos, fonts, textStrings)
{
	this.images = images.addLookupsByName();
	this.sounds = sounds.addLookupsByName();
	this.videos = videos.addLookupsByName();
	this.fonts = fonts.addLookupsByName();
	this.textStrings = textStrings.addLookupsByName();

	this.collectionsAll =
	[
		this.images,
		this.sounds,
		this.videos,
		this.fonts,
		this.textStrings
	];

	this.collectionsAll["Images"] = this.images;
	this.collectionsAll["Sounds"] = this.sounds;
	this.collectionsAll["Videos"] = this.videos;
	this.collectionsAll["Fonts"] = this.fonts;
	this.collectionsAll["TextStrings"] = this.textStrings;
}

{
	MediaLibrary.fromFileNames = function(
		contentPath, imageFileNames, effectFileNames, musicFileNames, videoFileNames, fontFileNames, textStringFileNames
	)
	{
		var mediaTypesPathsAndFileNames =
		[
			[ Image, "Images", imageFileNames ],
			[ Sound, "Audio/Effects", effectFileNames ],
			[ Sound, "Audio/Music", musicFileNames ],
			[ Video, "Videos", videoFileNames ],
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
		var videos = mediaCollections["Videos"];
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

	MediaLibrary.prototype.areAllItemsLoaded = function()
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

	MediaLibrary.prototype.waitForItemToLoad = function(collectionName, itemName, callback)
	{
		var itemToLoad = this.collections[collectionName][itemName];
		this.timer = setInterval
		(
			this.waitForItemToLoad_TimerTick.bind(this, itemToLoad, callback),
			100 // milliseconds
		);
	};

	MediaLibrary.prototype.waitForItemToLoad_TimerTick = function(itemToLoad, callback)
	{
		if (itemToLoad.isLoaded == true)
		{
			clearInterval(this.timer);
			callback.call();
		}
	};

	MediaLibrary.prototype.waitForItemsAllToLoad = function(callback)
	{
		this.timer = setInterval
		(
			this.waitForItemsAllToLoad_TimerTick.bind(this, callback),
			100 // milliseconds
		);
	};

	MediaLibrary.prototype.waitForItemsAllToLoad_TimerTick = function(callback)
	{
		if (this.areAllItemsLoaded() == true)
		{
			clearInterval(this.timer);
			callback.call();
		}
	};

	// accessors

	MediaLibrary.prototype.imagesAdd = function(images)
	{
		for (var i = 0; i < images.length; i++)
		{
			var image = images[i];
			if (this.images[image.name] == null)
			{
				this.images.push(image);
				this.images[image.name] = image;
			}
		}
	};

	MediaLibrary.prototype.fontGetByName = function(name)
	{
		return this.fonts[name];
	};

	MediaLibrary.prototype.imageGetByName = function(name)
	{
		return this.images[name];
	};

	MediaLibrary.prototype.soundGetByName = function(name)
	{
		return this.sounds[name];
	};

	MediaLibrary.prototype.textStringGetByName = function(name)
	{
		return this.textStrings[name];
	};

	MediaLibrary.prototype.videoGetByName = function(name)
	{
		return this.videos[name];
	};
}
