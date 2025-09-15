"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class MediaLibrary {
            constructor(contentDirectoryPath, images, sounds, videos, fonts, textStrings) {
                this.contentDirectoryPath = contentDirectoryPath;
                this.images = images || [];
                this.imagesByName = GameFramework.ArrayHelper.addLookupsByName(this.images);
                this.sounds = sounds || [];
                this.soundsByName = GameFramework.ArrayHelper.addLookupsByName(this.sounds);
                this.videos = videos || [];
                this.videosByName = GameFramework.ArrayHelper.addLookupsByName(this.videos);
                this.fonts = fonts || [];
                this.fontsByName = GameFramework.ArrayHelper.addLookupsByName(this.fonts);
                this.textStrings = textStrings || [];
                this.textStringsByName = GameFramework.ArrayHelper.addLookupsByName(this.textStrings);
                this.collectionsAll =
                    [
                        this.images,
                        this.sounds,
                        this.videos,
                        this.fonts,
                        this.textStrings
                    ];
                this.collectionsByName = new Map();
                this.collectionsByName.set("Images", this.imagesByName);
                this.collectionsByName.set("Sounds", this.soundsByName);
                this.collectionsByName.set("Videos", this.videosByName);
                this.collectionsByName.set("Fonts", this.fontsByName);
                this.collectionsByName.set("TextStrings", this.textStringsByName);
                this.shouldLoadAllItemsBeforehand = true;
                this.millisecondsPerCheckToSeeIfItemLoaded = 100;
            }
            static default() {
                return MediaLibrary.fromMediaFilePaths([]);
            }
            static fromMediaFilePaths(mediaFilePaths) {
                var contentDirectoryPath = Configuration.Instance().contentDirectoryPath;
                return MediaLibrary.fromContentDirectoryPathAndMediaFilePaths(contentDirectoryPath, mediaFilePaths);
            }
            static fromContentDirectoryPathAndMediaFilePaths(contentDirectoryPath, mediaFilePaths) {
                var images = new Array();
                var sounds = new Array();
                var videos = new Array();
                var fonts = new Array();
                var textStrings = new Array();
                var imageTypeDirectoryNameAndArray = [GameFramework.Image2, "Images", images];
                var soundTypeDirectoryNameAndArray = [GameFramework.SoundFromFile, "Audio", sounds];
                var textStringTypeDirectoryNameAndArray = [GameFramework.TextString, "Text", textStrings];
                var typesDirectoryNamesAndArraysByFileExtension = new Map([
                    ["jpg", imageTypeDirectoryNameAndArray],
                    ["png", imageTypeDirectoryNameAndArray],
                    ["svg", imageTypeDirectoryNameAndArray],
                    ["mod", [GameFramework.SoundFromFileMod, "Audio", sounds]],
                    ["mp3", soundTypeDirectoryNameAndArray],
                    ["wav", soundTypeDirectoryNameAndArray],
                    ["webm", [GameFramework.Video, "Video", videos]],
                    ["ttf", [GameFramework.Font, "Fonts", fonts]],
                    ["json", textStringTypeDirectoryNameAndArray],
                    ["txt", textStringTypeDirectoryNameAndArray],
                ]);
                for (var i = 0; i < mediaFilePaths.length; i++) {
                    var filePath = mediaFilePaths[i];
                    var fileExtension = filePath.substr(filePath.lastIndexOf(".") + 1);
                    var typeDirectoryNameAndArray = typesDirectoryNamesAndArraysByFileExtension.get(fileExtension);
                    var mediaType = typeDirectoryNameAndArray[0];
                    var mediaDirectoryName = typeDirectoryNameAndArray[1];
                    var mediaArray = typeDirectoryNameAndArray[2];
                    var filePathParts = filePath.split("/");
                    var filePathPartIndexForMediaType = filePathParts.indexOf(mediaDirectoryName);
                    filePathParts.splice(0, filePathPartIndexForMediaType + 1);
                    var fileName = filePathParts.join("_");
                    var fileStemAndExtension = fileName.split(".");
                    var fileStem = fileStemAndExtension[0];
                    var mediaObject = new mediaType(fileStem, filePath);
                    mediaArray.push(mediaObject);
                }
                var returnValue = new MediaLibrary(contentDirectoryPath, images, sounds, videos, fonts, textStrings);
                return returnValue;
            }
            static fromFileNamesByCategory(contentPath, imageFileNames, effectFileNames, musicFileNames, videoFileNames, fontFileNames, textStringFileNames) {
                var mediaTypesPathsAndFileNames = [
                    [GameFramework.Image2, "Images", imageFileNames],
                    [GameFramework.SoundFromFile, "Audio/Effects", effectFileNames],
                    [GameFramework.SoundFromFile, "Audio/Music", musicFileNames],
                    [GameFramework.Video, "Video", videoFileNames],
                    [GameFramework.Font, "Fonts", fontFileNames],
                    [GameFramework.TextString, "Text", textStringFileNames]
                ];
                var mediaCollectionsByPath = new Map();
                for (var t = 0; t < mediaTypesPathsAndFileNames.length; t++) {
                    var mediaTypePathAndFileNames = mediaTypesPathsAndFileNames[t];
                    var mediaType = mediaTypePathAndFileNames[0];
                    var mediaPath = mediaTypePathAndFileNames[1];
                    var mediaFileNames = mediaTypePathAndFileNames[2];
                    var mediaCollection = new Array();
                    var filePathRoot = contentPath + mediaPath + "/";
                    for (var i = 0; i < mediaFileNames.length; i++) {
                        var fileName = mediaFileNames[i];
                        var id = fileName.substr(0, fileName.indexOf("."));
                        var filePath = filePathRoot + fileName;
                        var mediaObject = new mediaType(id, filePath);
                        mediaCollection.push(mediaObject);
                    }
                    mediaCollectionsByPath.set(mediaPath, mediaCollection);
                }
                var images = mediaCollectionsByPath.get("Images");
                var soundEffects = mediaCollectionsByPath.get("Audio/Effects");
                var soundMusics = mediaCollectionsByPath.get("Audio/Music");
                var videos = mediaCollectionsByPath.get("Video");
                var fonts = mediaCollectionsByPath.get("Fonts");
                var textStrings = mediaCollectionsByPath.get("Text");
                var sounds = soundEffects.concat(soundMusics);
                var returnValue = new MediaLibrary(contentPath, images, sounds, videos, fonts, textStrings);
                return returnValue;
            }
            static loadOrUnloadCallbackIgnore(loadable) {
                // Do nothing.
            }
            // Instance methods.
            areAllItemsLoaded() {
                var areAllItemsLoadedSoFar = true;
                for (var c = 0; c < this.collectionsAll.length; c++) {
                    var collection = this.collectionsAll[c];
                    for (var i = 0; i < collection.length; i++) {
                        var item = collection[i];
                        if (item.isLoaded == false) {
                            areAllItemsLoadedSoFar = false;
                            break;
                        }
                    }
                    if (areAllItemsLoadedSoFar == false) {
                        break;
                    }
                }
                return areAllItemsLoadedSoFar;
            }
            itemsAll() {
                var returnValues = new Array();
                for (var c = 0; c < this.collectionsAll.length; c++) {
                    var collection = this.collectionsAll[c];
                    for (var i = 0; i < collection.length; i++) {
                        var item = collection[i];
                        returnValues.push(item);
                    }
                }
                return returnValues;
            }
            loadItemsBeforehandIfNecessary(callback) {
                if (this.shouldLoadAllItemsBeforehand) {
                    this.waitForItemsAllToLoad(callback);
                }
                else {
                    callback();
                }
            }
            shouldLoadAllItemsBeforehandSet(value) {
                this.shouldLoadAllItemsBeforehand = value;
                return this;
            }
            waitForItemToLoad(collectionName, itemName, callback) {
                var itemToLoad = this.collectionsByName
                    .get(collectionName)
                    .get(itemName);
                itemToLoad.load(null, MediaLibrary.loadOrUnloadCallbackIgnore);
                this.timerHandle = setInterval(this.waitForItemToLoad_TimerTick.bind(this, itemToLoad, callback), 100 // milliseconds
                );
            }
            waitForItemToLoad_TimerTick(itemToLoad, callback) {
                if (itemToLoad.isLoaded) {
                    clearInterval(this.timerHandle);
                    callback();
                }
            }
            waitForItemsAllToLoad(callback) {
                var itemsToLoad = this.itemsAll();
                this.waitForItemsToLoad(itemsToLoad, callback);
            }
            waitForItemsToLoad(itemsToLoad, callback) {
                itemsToLoad.forEach(x => x.load(null, MediaLibrary.loadOrUnloadCallbackIgnore));
                this.timerHandle = setInterval(this.waitForItemsToLoad_TimerTick.bind(this, itemsToLoad, callback), this.millisecondsPerCheckToSeeIfItemLoaded);
            }
            waitForItemsToLoad_TimerTick(itemsToLoad, callback) {
                var atLeastOneItemIsNotLoaded = itemsToLoad.some(x => x.isLoaded == false);
                if (atLeastOneItemIsNotLoaded == false) {
                    clearInterval(this.timerHandle);
                    callback();
                }
            }
            // accessors
            imageAdd(image) {
                if (this.imagesByName.has(image.name) == false) {
                    this.images.push(image);
                    this.imagesByName.set(image.name, image);
                }
                return this;
            }
            imagesAdd(images) {
                images.forEach(x => this.imageAdd(x));
                return this;
            }
            soundAdd(sound) {
                if (this.soundsByName.has(sound.name) == false) {
                    this.sounds.push(sound);
                    this.soundsByName.set(sound.name, sound);
                }
                return this;
            }
            soundsAdd(sounds) {
                sounds.forEach(x => this.soundAdd(x));
                return this;
            }
            fontGetByName(name) {
                var returnFont = this.fontsByName.get(name);
                if (returnFont == null) {
                    throw new Error("No font found with name: " + name);
                }
                return returnFont;
            }
            imageGetByName(name) {
                var returnImage = this.imagesByName.get(name);
                if (returnImage == null) {
                    throw new Error("No image found with name: " + name);
                }
                return returnImage;
            }
            soundGetByName(name) {
                var returnSound = this.soundsByName.get(name);
                if (returnSound == null) {
                    throw new Error("No sound found with name: " + name);
                }
                return returnSound;
            }
            textStringGetByName(name) {
                var returnTextString = this.textStringsByName.get(name);
                if (returnTextString == null) {
                    throw new Error("No text string found with name: " + name);
                }
                return returnTextString;
            }
            textStringWithNameExists(name) {
                return this.textStringsByName.has(name);
            }
            videoGetByName(name) {
                var returnVideo = this.videosByName.get(name);
                if (returnVideo == null) {
                    throw new Error("No video found with name: " + name);
                }
                return returnVideo;
            }
        }
        GameFramework.MediaLibrary = MediaLibrary;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
