"use strict";
class GameDemo {
    constructor(configuration) {
        this.configuration = configuration;
    }
    static fromConfiguration(configuration) {
        return new GameDemo(configuration);
    }
    start() {
        var contentDirectoryPath = this.configuration.contentDirectoryPath;
        var manifestFileName = "Manifest.txt";
        MediaLibrary.mediaFilePathsReadFromContentDirectoryPathAndManifestFileNameThen(contentDirectoryPath, manifestFileName, this.start_MediaFilePathsLoaded);
    }
    start_MediaFilePathsLoaded(mediaFilePaths) {
        var ticksPerSecond = 20;
        var worldCreator = WorldCreator.fromWorldCreate(WorldDemo.create);
        var universe = Universe.fromNameTicksPerSecondMediaFilePathsAndWorldCreator("Game Framework Demo Game", ticksPerSecond, mediaFilePaths, worldCreator);
        universe.profileHelper
            .profilesMultipleAreAllowedSet(true)
            .gameCanBeSavedSet(true);
        universe.initializeAndStart();
    }
}
