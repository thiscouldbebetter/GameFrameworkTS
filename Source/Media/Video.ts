
class Video
{
	name: string;
	sourcePath: string;

	domElement: any;
	isFinished: boolean;

	_size: Coords;

	constructor(name: string, sourcePath: string)
	{
		this.name = name;
		this.sourcePath = sourcePath;

		this._size = null;
	}

	toDomElement(platformHelper: PlatformHelper)
	{
		if (this.domElement == null)
		{
			this.domElement = document.createElement("video");
		}

		this.domElement.src = this.sourcePath;
		this.domElement.video = this;
		this.domElement.autoplay = true;
		this.domElement.onended = this.stop.bind(this, platformHelper);

		var displaySize = this._size;
		this.domElement.width = displaySize.x;
		this.domElement.height = displaySize.y;

		return this.domElement;
	};

	play(universe: Universe)
	{
		this.isFinished = false;
		this._size = universe.display.sizeInPixels;
		universe.platformHelper.platformableAdd(this);
	};

	stop(platformHelper: PlatformHelper)
	{
		platformHelper.platformableRemove(this);
		this.isFinished = true;
	};
}
