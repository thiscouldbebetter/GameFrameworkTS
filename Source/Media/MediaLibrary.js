"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class MediaLibrary {
            constructor(images, sounds, videos, fonts, textStrings) {
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
            }
            static default() {
                return MediaLibrary.fromFilePaths([]);
            }
            static fromFilePaths(mediaFilePaths) {
                var images = new Array();
                var sounds = new Array();
                var videos = new Array();
                var fonts = new Array();
                var textStrings = new Array();
                var imageTypeDirectoryNameAndArray = [GameFramework.Image2, "Images", images];
                var soundTypeDirectoryNameAndArray = [GameFramework.Sound, "Audio", sounds];
                var textStringTypeDirectoryNameAndArray = [GameFramework.TextString, "Text", textStrings];
                var typesDirectoryNamesAndArraysByFileExtension = new Map([
                    ["jpg", imageTypeDirectoryNameAndArray],
                    ["png", imageTypeDirectoryNameAndArray],
                    ["svg", imageTypeDirectoryNameAndArray],
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
                var returnValue = new MediaLibrary(images, sounds, videos, fonts, textStrings);
                return returnValue;
            }
            static fromFileNamesByCategory(contentPath, imageFileNames, effectFileNames, musicFileNames, videoFileNames, fontFileNames, textStringFileNames) {
                var mediaTypesPathsAndFileNames = [
                    [GameFramework.Image2, "Images", imageFileNames],
                    [GameFramework.Sound, "Audio/Effects", effectFileNames],
                    [GameFramework.Sound, "Audio/Music", musicFileNames],
                    [GameFramework.Video, "Video", videoFileNames],
                    [GameFramework.Font, "Fonts", fontFileNames],
                    [GameFramework.TextString, "Text", textStringFileNames],
                ];
                var mediaCollectionsByPath = new Map();
                for (var t = 0; t < mediaTypesPathsAndFileNames.length; t++) {
                    var mediaTypePathAndFileNames = mediaTypesPathsAndFileNames[t];
                    var mediaType = mediaTypePathAndFileNames[0];
                    var mediaPath = mediaTypePathAndFileNames[1];
                    var mediaFileNames = mediaTypePathAndFileNames[2];
                    var mediaCollection = [];
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
                var returnValue = new MediaLibrary(images, sounds, videos, fonts, textStrings);
                return returnValue;
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
            waitForItemToLoad(collectionName, itemName, callback) {
                var itemToLoad = this.collectionsByName.get(collectionName).get(itemName);
                this.timer = setInterval(this.waitForItemToLoad_TimerTick.bind(this, itemToLoad, callback), 100 // milliseconds
                );
            }
            waitForItemToLoad_TimerTick(itemToLoad, callback) {
                if (itemToLoad.isLoaded) {
                    clearInterval(this.timer);
                    callback();
                }
            }
            waitForItemsAllToLoad(callback) {
                this.timer = setInterval(this.waitForItemsAllToLoad_TimerTick.bind(this, callback), 100 // milliseconds
                );
            }
            waitForItemsAllToLoad_TimerTick(callback) {
                if (this.areAllItemsLoaded()) {
                    clearInterval(this.timer);
                    callback();
                }
            }
            // accessors
            imagesAdd(images) {
                for (var i = 0; i < images.length; i++) {
                    var image = images[i];
                    if (this.imagesByName.get(image.name) == null) {
                        this.images.push(image);
                        this.imagesByName.set(image.name, image);
                    }
                }
            }
            fontGetByName(name) {
                return this.fontsByName.get(name);
            }
            imageGetByName(name) {
                return this.imagesByName.get(name);
            }
            soundGetByName(name) {
                return this.soundsByName.get(name);
            }
            textStringGetByName(name) {
                return this.textStringsByName.get(name);
            }
            videoGetByName(name) {
                return this.videosByName.get(name);
            }
        }
        GameFramework.MediaLibrary = MediaLibrary;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
