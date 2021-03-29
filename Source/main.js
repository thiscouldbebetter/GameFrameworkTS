"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        function main() {
            // It may be necessary to clear local storage to prevent errors on
            // deserialization of existing saved items after the schema changes.
            // localStorage.clear();
            var mediaFilePaths = mediaFilePathsBuild();
            var mediaLibrary = GameFramework.MediaLibrary.fromFilePaths(mediaFilePaths);
            var displaySizesAvailable = [
                new GameFramework.Coords(400, 300, 1),
                new GameFramework.Coords(640, 480, 1),
                new GameFramework.Coords(800, 600, 1),
                new GameFramework.Coords(1200, 900, 1),
                // Wrap.
                new GameFramework.Coords(200, 150, 1),
            ];
            var display = new GameFramework.Display2D(displaySizesAvailable, "Font", // fontName
            10, // fontHeightInPixels
            GameFramework.Color.byName("Gray"), GameFramework.Color.byName("White"), // colorFore, colorBack
            null);
            var timerHelper = new GameFramework.TimerHelper(20);
            var controlBuilder = GameFramework.ControlBuilder.default();
            var universe = GameFramework.Universe.create("Game Framework Demo Game", "0.0.0-20200829-2200", // version
            timerHelper, display, mediaLibrary, controlBuilder, null // worldCreate
            );
            universe.initialize(function () { universe.start(); });
        }
        GameFramework.main = main;
        function mediaFilePathsBuild() {
            var contentDirectoryPath = "../Content/";
            var fontDirectoryPath = contentDirectoryPath + "Fonts/";
            var imageDirectoryPath = contentDirectoryPath + "Images/";
            var soundEffectDirectoryPath = contentDirectoryPath + "Audio/Effects/";
            var soundMusicDirectoryPath = contentDirectoryPath + "Audio/Music/";
            var textStringDirectoryPath = contentDirectoryPath + "Text/";
            var videoDirectoryPath = contentDirectoryPath + "Video/";
            var mediaFilePaths = [
                imageDirectoryPath + "Anvil.svg",
                imageDirectoryPath + "Car.png",
                imageDirectoryPath + "Friendly.png",
                imageDirectoryPath + "Grass.svg",
                imageDirectoryPath + "Grain.svg",
                imageDirectoryPath + "Opening.png",
                imageDirectoryPath + "Pillow.svg",
                imageDirectoryPath + "Terrain-Sand.png",
                imageDirectoryPath + "Title.png",
                imageDirectoryPath + "Zap.svg",
                soundEffectDirectoryPath + "Sound.wav",
                soundEffectDirectoryPath + "Clang.wav",
                soundMusicDirectoryPath + "Music.mp3",
                soundMusicDirectoryPath + "Title.mp3",
                videoDirectoryPath + "Movie.webm",
                fontDirectoryPath + "Font.ttf",
                textStringDirectoryPath + "Conversation.json",
                textStringDirectoryPath + "Instructions.txt",
            ];
            return mediaFilePaths;
        }
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
