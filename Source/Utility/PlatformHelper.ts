
namespace ThisCouldBeBetter.GameFramework
{

export class PlatformHelper
{
	// This class is meant to encapsulate interactions with the DOM ("Domain Object Model").

	divMain: any;

	platformableAdd(platformable: Platformable)
	{
		var platformableAsDomElement = platformable.toDomElement(this);
		if (platformableAsDomElement != null)
		{
			this.divMain.appendChild(platformableAsDomElement);
		}
	}

	platformableHide(platformable: Platformable)
	{
		platformable.toDomElement(this).style.display = "none";
	}

	platformableRemove(platformable: Platformable)
	{
		this.divMain.removeChild(platformable.toDomElement(this));
	}

	platformableShow(platformable: Platformable)
	{
		platformable.toDomElement(this).style.display = null;
	}

	initialize(universe: Universe)
	{
		var divMain = this.divMain;
		if (divMain == null)
		{
			divMain = document.createElement("div");
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
	}
}

export interface Platformable
{
	toDomElement: (ph: PlatformHelper) => any;
}

}
