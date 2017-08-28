
function MediaLibrary(images, sounds, videos)
{
	this.images = images.addLookups("name");
	this.sounds = sounds.addLookups("name");
	this.videos = videos.addLookups("name");
}

{
	// accessors

	MediaLibrary.prototype.imagesAdd = function(images)
	{
		for (var i = 0; i < images.length; i++)
		{
			var image = images[i];
			if (this.images[image.name] == null)
			{
				this.images.push(image);
				this.images[image.name] = image;
			}
		}
	}

	MediaLibrary.prototype.imageGetByName = function(name)
	{
		return this.images[name];
	}

	MediaLibrary.prototype.soundGetByName = function(name)
	{
		return this.sounds[name];
	}

	MediaLibrary.prototype.videoGetByName = function(name)
	{
		return this.videos[name];
	}
}
