"use strict";
class VideoHelper {
    constructor(videos) {
        this.videos = videos;
        this.videosByName = ArrayHelper.addLookupsByName(this.videos);
    }
}
