"use strict";
class GameStub {
    constructor(contentDirectoryPath) {
        this.contentDirectoryPath = contentDirectoryPath;
    }
    main() {
        // It may be necessary to clear local storage to prevent errors on
        // deserialization of existing saved items after the schema changes.
        // localStorage.clear();
        var mediaFilePaths = this.mediaFilePathsBuild();
        var mediaLibrary = MediaLibrary.fromFilePaths(mediaFilePaths);
        var displaySizesAvailable = [
            new Coords(400, 300, 1),
            new Coords(640, 480, 1),
            new Coords(800, 600, 1),
            new Coords(1200, 900, 1),
            // Wrap.
            new Coords(200, 150, 1),
        ];
        var display = new Display2D(displaySizesAvailable, "Font", // fontName
        10, // fontHeightInPixels
        Color.byName("Gray"), Color.byName("White"), // colorFore, colorBack
        null);
        var timerHelper = new TimerHelper(20);
        var controlBuilder = ControlBuilder.default();
        var universe = Universe.create("Game", "0.0.0-20210407-0000", // version
        timerHelper, display, mediaLibrary, controlBuilder, () => new WorldGame());
        universe.initialize(() => { universe.start(); });
    }
    mediaFilePathsBuild() {
        var contentDirectoryPath = this.contentDirectoryPath;
        var fontDirectoryPath = contentDirectoryPath + "Fonts/";
        var imageDirectoryPath = contentDirectoryPath + "Images/";
        var soundEffectDirectoryPath = contentDirectoryPath + "Audio/Effects/";
        var soundMusicDirectoryPath = contentDirectoryPath + "Audio/Music/";
        var textStringDirectoryPath = contentDirectoryPath + "Text/";
        var videoDirectoryPath = contentDirectoryPath + "Video/";
        var mediaFilePaths = [
            imageDirectoryPath + "Opening.png",
            imageDirectoryPath + "Title.png",
            soundEffectDirectoryPath + "Sound.wav",
            soundMusicDirectoryPath + "Music.mp3",
            soundMusicDirectoryPath + "Title.mp3",
            videoDirectoryPath + "Movie.webm",
            fontDirectoryPath + "Font.ttf",
            textStringDirectoryPath + "Instructions.txt",
        ];
        return mediaFilePaths;
    }
}
