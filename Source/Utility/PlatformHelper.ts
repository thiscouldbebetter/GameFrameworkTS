
namespace ThisCouldBeBetter.GameFramework
{

export class PlatformHelper
{
	// This class is meant to encapsulate interactions with the DOM ("Domain Object Model").

	static create(): PlatformHelper
	{
		return new PlatformHelper();
	}

	divDisplay: HTMLDivElement;

	platformableAdd(platformable: Platformable): void
	{
		var platformableAsDomElement = platformable.toDomElement(this);
		if (platformableAsDomElement != null)
		{
			this.divDisplay.appendChild(platformableAsDomElement);
		}
	}

	platformableHide(platformable: Platformable): void
	{
		platformable.toDomElement(this).style.display = "none";
	}

	platformableRemove(platformable: Platformable): void
	{
		var platformableAsDomElement = platformable.toDomElement(this);
		if (platformableAsDomElement != null)
		{
			if (platformableAsDomElement.parentElement == this.divDisplay)
			{
				this.divDisplay.removeChild(platformableAsDomElement);
			}
		}
	}

	platformableShow(platformable: Platformable): void
	{
		platformable.toDomElement(this).style.display = null;
	}

	initialize(universe: Universe): void
	{
		var divDisplay = this.divDisplay;
		if (divDisplay == null)
		{
			var d = document;
			var divDisplay = d.getElementById("divDisplay") as HTMLDivElement;
			if (divDisplay == null)
			{
				divDisplay = d.createElement("div");
				divDisplay.id = "divDisplay";
			}
			else
			{
				divDisplay.innerHTML = "";
			}
			divDisplay.style.position = "absolute";
			divDisplay.style.left = "50%";
			divDisplay.style.top = "50%";
			d.body.appendChild(divDisplay);
			this.divDisplay = divDisplay;
		}
		var display = universe.display;
		divDisplay.style.marginLeft = "" + (0 - display.sizeInPixels.x / 2);
		divDisplay.style.marginTop = "" + (0 - display.sizeInPixels.y / 2);
	}
}

export interface Platformable
{
	toDomElement: (ph: PlatformHelper) => HTMLElement;
}

}
