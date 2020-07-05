
class VideoHelper
{
	videos: Video[];
	videosByName: any;

	constructor(videos)
	{
		this.videos = videos;
		this.videosByName = ArrayHelper.addLookupsByName(this.videos);
	}
}
