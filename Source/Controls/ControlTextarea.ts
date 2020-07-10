
class ControlTextarea implements Control
{
	name: string;
	pos: Coords;
	size: Coords;
	text: any;
	fontHeightInPixels: number
	_isEnabled: DataBinding<any, string>;

	isHighlighted: boolean;
	lineSpacing: number;
	parent: Control;
	scrollbar: ControlScrollbar;
	styleName: string;

	_drawPos: Coords;
	_drawLoc: Disposition;
	_indexOfLineSelected: number;
	_mouseClickPos: Coords;
	_textAsLines: any;

	constructor(name: string, pos: Coords, size: Coords, text: any, fontHeightInPixels: number, isEnabled: DataBinding<any, string>)
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
			new Coords(this.size.x - scrollbarWidth, 0, 0), // pos
			new Coords(scrollbarWidth, this.size.y, 0), // size
			this.fontHeightInPixels,
			this.lineSpacing, // itemHeight
			new DataBinding(this, (c: ControlTextarea) => c.textAsLines(), null),
			0 // sliderPosInItems
		);

		// Helper variables.
		this._drawPos = new Coords(0, 0, 0);
		this._drawLoc = new Disposition(this._drawPos, null, null);
		this._mouseClickPos = new Coords(0, 0, 0);
	}

	actionHandle(actionNameToHandle: string, universe: Universe)
	{
		var wasActionHandled = false;
		var controlActionNames = ControlActionNames.Instances();
		if (actionNameToHandle == controlActionNames.ControlIncrement)
		{
			// todo
			// this.itemSelectedNextInDirection(1);
			wasActionHandled = true;
		}
		else if (actionNameToHandle == controlActionNames.ControlDecrement)
		{
			// todo
			// this.itemSelectedNextInDirection(-1);
			wasActionHandled = true;
		}
		else if (actionNameToHandle == controlActionNames.ControlConfirm)
		{
			// todo
			/*
			if (this.confirm != null)
			{
				this.confirm();
				wasActionHandled = true;
			}
			*/
			wasActionHandled = true;
		}
		return wasActionHandled;
	};

	actionToInputsMappings(): ActionToInputsMapping[]
	{
		return null; // todo
	}

	childWithFocus(): Control
	{
		return null;
	}

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

	indexOfLineSelected(valueToSet: number)
	{
		var returnValue = valueToSet;
		if (valueToSet == null)
		{
			returnValue = this._indexOfLineSelected;
		}
		else
		{
			this._indexOfLineSelected = valueToSet;
		}
		return returnValue;
	};

	isEnabled()
	{
		return (this._isEnabled.get());
	};

	textAsLines()
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

	mouseClick(clickPos: Coords)
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
				// todo

				/*
				var clickPosRelativeToSlideInPixels = clickPos.subtract
				(
					this.scrollbar.pos
				).subtract
				(
					new Coords(0, this.scrollbar.handleSize.y, 0)
				);
				*/
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

	mouseEnter() {}

	mouseExit() {}

	mouseMove(movePos: Coords)
	{
		// Do nothing.
	};

	scalePosAndSize(scaleFactor: Coords)
	{
		this.pos.multiply(scaleFactor);
		this.size.multiply(scaleFactor);
		this.fontHeightInPixels *= scaleFactor.y;
		this.lineSpacing *= scaleFactor.y;
		this.scrollbar.scalePosAndSize(scaleFactor);
	};

	style(universe: Universe)
	{
		return universe.controlBuilder.stylesByName.get(this.styleName == null ? "Default" : this.styleName);
	};

	// drawable

	draw(universe: Universe, display: Display, drawLoc: Disposition)
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

		var drawPos2 = new Coords(drawPos.x + textMarginLeft, itemPosY, 0);

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
