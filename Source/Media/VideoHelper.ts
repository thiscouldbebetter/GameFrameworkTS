
namespace ThisCouldBeBetter.GameFramework
{

export class VideoHelper
{
	videos: Video[];
	videosByName: Map<string, Video>;

	constructor(videos: Video[])
	{
		this.videos = videos;
		this.videosByName = ArrayHelper.addLookupsByName(this.videos);
	}
}

}
