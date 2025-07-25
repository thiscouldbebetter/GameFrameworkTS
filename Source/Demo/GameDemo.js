"use strict";
class GameDemo {
    constructor(contentDirectoryPath) {
        this.contentDirectoryPath = contentDirectoryPath;
    }
    main() {
        var ticksPerSecond = 20;
        var mediaFilePaths = this.mediaFilePathsBuild();
        var worldCreator = WorldCreator.fromWorldCreate(WorldDemo.create);
        var universe = Universe.fromNameTicksPerSecondMediaFilePathsAndWorldCreator("Game Framework Demo Game", ticksPerSecond, mediaFilePaths, worldCreator);
        universe.profileHelper
            .profilesMultipleAreAllowedSet(true)
            .gameCanBeSavedSet(true);
        universe.initializeAndStart();
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
        var title = (a) => imageTitlesDirectoryPath + a;
        var effect = (a) => soundEffectDirectoryPath + a;
        var image = (a) => imageDirectoryPath + a;
        var music = (a) => soundMusicDirectoryPath + a;
        var video = (a) => videoDirectoryPath + a;
        var font = (a) => fontDirectoryPath + a;
        var text = (a) => textStringDirectoryPath + a;
        var mediaFilePaths = [
            title("Opening.png"),
            title("Producer.png"),
            title("Title.png"),
            image("Anvil.svg"),
            image("Car.png"),
            image("Friendly.png"),
            image("Grass.svg"),
            image("Grain.svg"),
            image("Pillow.svg"),
            image("Terrain-Sand.png"),
            image("Zap.svg"),
            effect("Sound.wav"),
            effect("Clang.wav"),
            music("_Default.mp3"),
            music("Producer.wav"),
            music("Title.mp3"),
            video("Movie.webm"),
            font("Font.ttf"),
            text("Conversation.json"),
            text("Conversation_psv.txt"),
            text("Instructions.txt"),
        ];
        return mediaFilePaths;
    }
}
