"use strict";
class Game {
    constructor(contentDirectoryPath) {
        this.contentDirectoryPath = contentDirectoryPath;
    }
    main() {
        // It may be necessary to clear local storage to prevent errors on
        // deserialization of existing saved items after the schema changes.
        // localStorage.clear();
        var mediaFilePaths = this.mediaFilePathsBuild();
        var mediaLibrary = MediaLibrary.fromContentDirectoryPathAndMediaFilePaths("../Content/", mediaFilePaths);
        var worldCreator = WorldCreator.fromWorldCreate(() => new WorldGame());
        var universe = Universe.fromMediaLibraryAndWorldCreator(mediaLibrary, worldCreator);
        universe.initialize(() => { universe.start(); });
    }
    mediaFilePathsBuild() {
        var contentDirectoryPath = this.contentDirectoryPath;
        var fontDirectoryPath = contentDirectoryPath + "Fonts/";
        var imageDirectoryPath = contentDirectoryPath + "Images/";
        var imageTitlesDirectoryPath = imageDirectoryPath + "Titles/";
        var soundEffectDirectoryPath = contentDirectoryPath + "Audio/Effects/";
        var soundMusicDirectoryPath = contentDirectoryPath + "Audio/Music/";
        var textStringDirectoryPath = contentDirectoryPath + "Text/";
        var videoDirectoryPath = contentDirectoryPath + "Video/";
        var mediaFilePaths = [
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
