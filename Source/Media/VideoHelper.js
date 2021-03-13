"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VideoHelper {
            constructor(videos) {
                this.videos = videos;
                this.videosByName = GameFramework.ArrayHelper.addLookupsByName(this.videos);
            }
        }
        GameFramework.VideoHelper = VideoHelper;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
