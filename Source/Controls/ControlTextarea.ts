
class ControlTextarea
{
	constructor(name, pos, size, text, fontHeightInPixels, isEnabled)
	{
		this.name = name;
		this.pos = pos;
		this.size = size;
		this.text = text;
		this.fontHeightInPixels = fontHeightInPixels;
		this._isEnabled = isEnabled;

		this.lineSpacing = 1.2 * this.fontHeightInPixels; // hack

		this.isHighlighted = false;

		var scrollbarWidth = this.lineSpacing;
		this.scrollbar = new ControlScrollbar
		(
			new Coords(this.size.x - scrollbarWidth, 0), // pos
			new Coords(scrollbarWidth, this.size.y), // size
			this.fontHeightInPixels,
			this.lineSpacing, // itemHeight
			new DataBinding(this, (c) => c.textAsLines()),
			0 // sliderPosInItems
		);

		// Helper variables.
		this._drawPos = new Coords();
		this._drawLoc = new Location(this._drawPos);
		this._mouseClickPos = new Coords();
	}

	actionHandle(actionNameToHandle)
	{
		var wasActionHandled = false;
		var controlActionNames = ControlActionNames.Instances();
		if (actionNameToHandle == controlActionNames.ControlIncrement)
		{
			this.itemSelectedNextInDirection(1);
			wasActionHandled = true;
		}
		else if (actionNameToHandle == controlActionNames.ControlDecrement)
		{
			this.itemSelectedNextInDirection(-1);
			wasActionHandled = true;
		}
		else if (actionNameToHandle == controlActionNames.ControlConfirm)
		{
			if (this.confirm != null)
			{
				this.confirm();
				wasActionHandled = true;
			}
		}
		return wasActionHandled;
	};

	focusGain()
	{
		this.isHighlighted = true;
	};

	focusLose()
	{
		this.isHighlighted = false;
	};

	indexOfFirstLineVisible()
	{
		return this.scrollbar.sliderPosInItems();
	};

	indexOfLastLineVisible()
	{
		return this.indexOfFirstLineVisible() + Math.floor(this.scrollbar.windowSizeInItems) - 1;
	};

	indexOfLineSelected(valueToSet)
	{
		var returnValue = valueToSet;
		var lines = this.textAsLines();
		if (valueToSet == null)
		{
			returnValue = _indexOfLineSelected;
		}
		else
		{
			_indexOfLineSelected = valueToSet;
		}
		return returnValue;
	};

	isEnabled()
	{
		return (this._isEnabled.get());
	};

	textAsLines(display)
	{
		if (this._textAsLines == null)
		{
			this._textAsLines = [];

			var charWidthInPixels = this.fontHeightInPixels / 2; // hack
			var charsPerLine = Math.floor(this.size.x / charWidthInPixels);
			var textComplete = this.text;
			var textLength = textComplete.length;
			var i = 0;
			while (i < textLength)
			{
				var line = textComplete.substr(i, charsPerLine);
				this._textAsLines.push(line);
				i += charsPerLine;
			}
		}

		return this._textAsLines;
	};

	mouseClick(clickPos)
	{
		clickPos = this._mouseClickPos.overwriteWith(clickPos);

		if (clickPos.x - this.pos.x > this.size.x - this.scrollbar.handleSize.x)
		{
			if (clickPos.y - this.pos.y <= this.scrollbar.handleSize.y)
			{
				this.scrollbar.scrollUp();
			}
			else if (clickPos.y - this.pos.y >= this.scrollbar.size.y - this.scrollbar.handleSize.y)
			{
				this.scrollbar.scrollDown();
			}
			else
			{
				var clickPosRelativeToSlideInPixels = clickPos.subtract
				(
					this.scrollbar.pos
				).subtract
				(
					new Coords(0, this.scrollbar.handleSize.y)
				);

				// todo
			}
		}
		else
		{
			var offsetOfLineClicked = clickPos.y - this.pos.y;
			var indexOfLineClicked =
				this.indexOfFirstLineVisible()
				+ Math.floor
				(
					offsetOfLineClicked
					/ this.lineSpacing
				);

			var lines = this.textAsLines();
			if (indexOfLineClicked < lines.length)
			{
				this.indexOfLineSelected(indexOfLineClicked);
			}
		}

		return true; // wasActionHandled
	};

	mouseMove(movePos)
	{
		// Do nothing.
	};

	scalePosAndSize(scaleFactor)
	{
		this.pos.multiply(scaleFactor);
		this.size.multiply(scaleFactor);
		this.fontHeightInPixels *= scaleFactor.y;
		this.lineSpacing *= scaleFactor.y;
		this.scrollbar.scalePosAndSize(scaleFactor);
	};

	style(universe)
	{
		return universe.controlBuilder.styles[this.styleName == null ? "Default" : this.styleName];
	};

	// drawable

	draw(universe, display, drawLoc)
	{
		drawLoc = this._drawLoc.overwriteWith(drawLoc);
		var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);

		var style = this.style(universe);
		var colorFore = (this.isHighlighted ? style.colorFill : style.colorBorder);
		var colorBack = (this.isHighlighted ? style.colorBorder : style.colorFill);

		display.drawRectangle
		(
			drawPos,
			this.size,
			colorBack, // fill
			style.colorBorder, // border
			false // areColorsReversed
		);

		var itemSizeY = this.lineSpacing;
		var textMarginLeft = 2;
		var itemPosY = drawPos.y;

		var lines = this.textAsLines();

		if (lines == null)
		{
			return;
		}

		var numberOfLinesVisible = Math.floor(this.size.y / itemSizeY);
		var indexStart = this.indexOfFirstLineVisible();
		var indexEnd = indexStart + numberOfLinesVisible - 1;
		if (indexEnd >= lines.length)
		{
			indexEnd = lines.length - 1;
		}

		var drawPos2 = new Coords(drawPos.x + textMarginLeft, itemPosY);

		for (var i = indexStart; i <= indexEnd; i++)
		{
			var line = lines[i];

			display.drawText
			(
				line,
				this.fontHeightInPixels,
				drawPos2,
				colorFore,
				colorBack,
				false, // areColorsReversed
				false, // isCentered
				this.size.x // widthMaxInPixels
			);

			drawPos2.y += itemSizeY;
		}

		this.scrollbar.draw(universe, display, drawLoc);
	};
}
