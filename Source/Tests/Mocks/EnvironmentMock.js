"use strict";
class EnvironmentMock {
    universeCreate(universeCreated) {
        var configuration = Configuration.Instance();
        MediaLibrary.mediaFilePathsReadFromContentDirectoryPathAndManifestFileNameThen(configuration.contentDirectoryPath, "Manifest.txt", (mediaFilePaths) => this.universeBuild_MediaFilePathsLoaded(mediaFilePaths, universeCreated));
    }
    universeBuild_MediaFilePathsLoaded(mediaFilePaths, universeInitialized) {
        var mediaLibrary = MediaLibrary.fromMediaFilePaths(mediaFilePaths);
        var timerHelper = new TimerHelper(25);
        timerHelper.ticksSoFar = 0; // hack
        var display = DisplayMock.default();
        var soundHelper = new SoundHelperMock();
        var controlBuilder = ControlBuilder.default();
        var place = PlaceMock.create();
        var worldCreator = WorldCreator.fromWorldCreate((u, wc) => new WorldDemo(WorldDemo.name, DateTime.now(), null, // defn
        [place] // places
        ));
        var universe = new Universe("TestUniverse", "[version]", timerHelper, display, soundHelper, mediaLibrary, controlBuilder, ProfileHelper.minimal(), worldCreator);
        universe.initialize(() => {
            var uwpe = UniverseWorldPlaceEntities.fromUniverse(universe);
            universe.worldCreate().initialize(uwpe);
            universe.updateForTimerTick();
            universeInitialized(universe);
        });
    }
}
