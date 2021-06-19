
namespace ThisCouldBeBetter.GameFramework
{

export class VisualBar implements Visual
{
	abbreviation: string;
	size: Coords;
	color: Color;
	amountCurrent: DataBinding<Entity, number>;
	amountThreshold: DataBinding<Entity, number>;
	amountMax: DataBinding<Entity, number>;
	fractionBelowWhichToShow: number;
	colorForBorderAsValueBreakGroup: ValueBreakGroup;
	text: DataBinding<any, string>;

	_drawPos: Coords;
	_sizeCurrent: Coords;
	_sizeHalf: Coords

	constructor
	(
		abbreviation: string,
		size: Coords,
		color: Color,
		amountCurrent: DataBinding<Entity, number>,
		amountThreshold: DataBinding<Entity, number>,
		amountMax: DataBinding<Entity, number>,
		fractionBelowWhichToShow: number,
		colorForBorderAsValueBreakGroup: ValueBreakGroup,
		text: DataBinding<any, string>
	)
	{
		this.abbreviation = abbreviation;
		this.size = size;
		this.color = color;
		this.amountCurrent = amountCurrent;
		this.amountThreshold = amountThreshold;
		this.amountMax = amountMax;
		this.fractionBelowWhichToShow = fractionBelowWhichToShow;
		this.colorForBorderAsValueBreakGroup = colorForBorderAsValueBreakGroup;
		this.text = text;

		this._drawPos = Coords.create();
		this._sizeCurrent = this.size.clone();
		this._sizeHalf = this.size.clone().half();
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): any
	{
		var wasVisible = false;

		var entity = uwpe.entity;
		var pos = this._drawPos.overwriteWith
		(
			entity.locatable().loc.pos
		).subtract(this._sizeHalf);
		var _amountCurrent: number =
			this.amountCurrent.contextSet(entity).get() as number;
		var _amountMax: number =
			this.amountMax.contextSet(entity).get() as number;
		var fractionCurrent = _amountCurrent / _amountMax;

		var shouldShow =
		(
			this.fractionBelowWhichToShow == null
			|| fractionCurrent < this.fractionBelowWhichToShow
		);

		if (shouldShow)
		{
			wasVisible = true;

			var widthCurrent = fractionCurrent * this.size.x;
			this._sizeCurrent.x = widthCurrent;
			display.drawRectangle
			(
				pos, this._sizeCurrent, this.color, null, null
			);

			var colorForBorder: Color = null;
			if (this.colorForBorderAsValueBreakGroup == null)
			{
				colorForBorder = Color.Instances().White;
			}
			else
			{
				colorForBorder =
					this.colorForBorderAsValueBreakGroup.valueAtPosition(fractionCurrent);
			}

			if (this.amountThreshold != null)
			{
				var thresholdFraction = this.amountThreshold.contextSet(entity).get() as number;
				this._sizeCurrent.x = thresholdFraction * this.size.x;
				display.drawRectangle
				(
					this._sizeCurrent, // pos
					new Coords(1, this.size.y, 0), // size
					this.color, null, null
				)
			}

			display.drawRectangle
			(
				pos, this.size, null, colorForBorder, null
			);

			pos.add(this._sizeHalf);

			var text: string;
			if (this.text == null)
			{
				var remainingOverMax = Math.round(_amountCurrent) + "/" + _amountMax;
				text = (this.abbreviation == null ? "" : (this.abbreviation + ":")) + remainingOverMax;
			}
			else
			{
				text = this.text.get();
			}
			display.drawText
			(
				text,
				this.size.y, // fontHeightInPixels
				pos,
				colorForBorder,
				Color.byName("Black"), // colorOutline,
				false, // areColorsReversed
				true, // isCentered
				null, // widthMaxInPixels
			);
		}

		return wasVisible;
	}

	// Clonable.

	clone(): Visual
	{
		return this; // todo
	}

	overwriteWith(other: Visual): Visual
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: Transform): Transformable
	{
		return this; // todo
	}
}

}
