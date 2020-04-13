class PlatformHelper
{
	// This class is meant to encapsulate interactions with the DOM ("Domain Object Model").

	platformableAdd(platformable)
	{
		var platformableAsDomElement = platformable.toDomElement(this);
		if (platformableAsDomElement != null)
		{
			this.divMain.appendChild(platformableAsDomElement);
		}
	};

	platformableHide(platformable)
	{
		platformable.toDomElement(this).style.display = "none";
	};

	platformableRemove(platformable)
	{
		this.divMain.removeChild(platformable.toDomElement(this));
	};

	platformableShow(platformable)
	{
		platformable.toDomElement(this).style.display = null;
	};

	initialize(universe)
	{
		var divMain = this.divMain;
		if (divMain == null)
		{
			var divMain = document.createElement("div");
			divMain.id = "divMain";
			divMain.style.position = "absolute";
			divMain.style.left = "50%";
			divMain.style.top = "50%";
			document.body.appendChild(divMain);
			this.divMain = divMain;
		}
		var display = universe.display;
		divMain.style.marginLeft = 0 - display.sizeInPixels.x / 2;
		divMain.style.marginTop = 0 - display.sizeInPixels.y / 2;
	};
}
