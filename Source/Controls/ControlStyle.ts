
namespace ThisCouldBeBetter.GameFramework
{

export class ControlStyle
{
	name: string;
	colorScheme: ControlColorScheme;
	_drawBoxOfSizeAtPosWithColorsToDisplay:
		(size: Coords, pos: Coords, colorFill: Color, colorBorder: Color, isHighlighted: boolean, display: Display) => void;

	constructor
	(
		name: string,
		colorScheme: ControlColorScheme,
		drawBoxOfSizeAtPosWithColorsToDisplay:
			(size: Coords, pos: Coords, colorFill: Color, colorBorder: Color, isHighlighted: boolean, display: Display) => void
	)
	{
		this.name = name;
		this.colorScheme = colorScheme;
		this._drawBoxOfSizeAtPosWithColorsToDisplay = drawBoxOfSizeAtPosWithColorsToDisplay;
	}

	static _instances: ControlStyle_Instances;
	static Instances(): ControlStyle_Instances
	{
		if (ControlStyle._instances == null)
		{
			ControlStyle._instances = new ControlStyle_Instances();
		}
		return ControlStyle._instances;
	}

	static byName(styleName: string): ControlStyle
	{
		return ControlStyle.Instances()._AllByName.get(styleName);
	}

	clone(): ControlStyle
	{
		return new ControlStyle
		(
			this.name,
			this.colorScheme.clone(),
			this._drawBoxOfSizeAtPosWithColorsToDisplay
		);
	}

	drawBoxOfSizeAtPosWithColorsToDisplay
	(
		size: Coords, pos: Coords,
		colorFill: Color, colorBorder: Color,
		isHighlighted: boolean,
		display: Display
	): void
	{
		if (this._drawBoxOfSizeAtPosWithColorsToDisplay == null)
		{
			if (isHighlighted)
			{
				var temp = colorFill;
				colorFill = colorBorder;
				colorBorder = temp;
			}

			display.drawRectangle(pos, size, colorFill, colorBorder);
		}
		else
		{
			this._drawBoxOfSizeAtPosWithColorsToDisplay
			(
				size, pos, colorFill, colorBorder, isHighlighted, display
			);
		}
	}

	// Colors.

	colorBackground(): Color { return this.colorScheme.colorBackground; }

	colorBorder(): Color { return this.colorScheme.colorBorder; }

	colorDisabled(): Color { return this.colorScheme.colorDisabled; }

	colorFill(): Color { return this.colorScheme.colorFill; }
}

export class ControlStyle_Instances
{
	Default: ControlStyle;
	Dark: ControlStyle;
	Rounded: ControlStyle;

	_All: ControlStyle[];
	_AllByName: Map<string, ControlStyle>;

	constructor()
	{
		this.Default = new ControlStyle
		(
			"Default", // name
			ControlColorScheme.Instances().Default,
			null // drawBoxOfSizeAtPosToDisplay
		);

		this.Dark = new ControlStyle
		(
			"Dark", // name
			ControlColorScheme.Instances().Dark,
			null // drawBoxOfSizeAtPosToDisplay
		);
		
		var rounded = this.Default.clone();
		var cornerRadius = 5;
		rounded._drawBoxOfSizeAtPosWithColorsToDisplay =
			(
				size: Coords, pos: Coords,
				colorFill: Color, colorBorder: Color,
				isHighlighted: boolean,
				display: Display
			) =>
			{
				if (isHighlighted)
				{
					var temp = colorFill;
					colorFill = colorBorder;
					colorBorder = temp;
				}

				display.drawRectangleWithRoundedCorners
				(
					pos, size, colorFill, colorBorder, cornerRadius
				);
			};
		this.Rounded = rounded;
		
		this._All =
		[
			this.Default, this.Dark, this.Rounded
		];

		this._AllByName = ArrayHelper.addLookupsByName(this._All);
	}
}

}
