
function MediaLibrary(images, sounds, videos)
{
	this.images = images.addLookups("name");
	this.sounds = sounds.addLookups("name");
	this.videos = videos.addLookups("name");
}

{	
	// accessors
	
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
