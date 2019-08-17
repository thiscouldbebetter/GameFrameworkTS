function PlatformHelper()
{
	// do nothing
}
{
	PlatformHelper.prototype.platformableAdd = function(platformable)
	{
		this.divMain.appendChild(platformable.toDomElement(this));
	};

	PlatformHelper.prototype.platformableHide = function(platformable)
	{
		platformable.toDomElement(this).style.display = "none";
	};

	PlatformHelper.prototype.platformableRemove = function(platformable)
	{
		this.divMain.removeChild(platformable.toDomElement(this));
	};

	PlatformHelper.prototype.platformableShow = function(platformable)
	{
		platformable.toDomElement(this).style.display = null;
	};

	PlatformHelper.prototype.keyAndMouseEventHandlersSet = function
	(
		keyDown, keyUp, mouseDown, mouseUp, mouseMove
	)
	{
		document.body.onkeydown = keyDown;
		document.body.onkeyup = keyUp;
		this.divMain.onmousedown = mouseDown;
		this.divMain.onmouseup = mouseUp;
		this.divMain.onmousemove = mouseMove;
	};

	PlatformHelper.prototype.initialize = function(universe)
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
