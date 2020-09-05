
class VisualBar implements Visual
{
	abbreviation: string;
	size: Coords;
	color: Color;
	amountCurrent: DataBinding<Entity, number>;
	amountThreshold: DataBinding<Entity, number>;
	amountMax: DataBinding<Entity, number>;
	fractionBelowWhichToShow: number;

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
		fractionBelowWhichToShow: number
	)
	{
		this.abbreviation = abbreviation;
		this.size = size;
		this.color = color;
		this.amountCurrent = amountCurrent;
		this.amountThreshold = amountThreshold;
		this.amountMax = amountMax;
		this.fractionBelowWhichToShow = fractionBelowWhichToShow;

		this._drawPos = new Coords(0, 0, 0);
		this._sizeCurrent = this.size.clone();
		this._sizeHalf = this.size.clone().half();
	}

	draw(universe: Universe, world: World, place: Place, entity: Entity, display: Display)
	{
		var wasVisible = false;

		var pos = this._drawPos.overwriteWith(entity.locatable().loc.pos).subtract(this._sizeHalf);
		var _amountCurrent: number = this.amountCurrent.contextSet(entity).get() as number;
		var _amountMax: number = this.amountMax.contextSet(entity).get() as number;
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
				pos, this._sizeCurrent, this.color.systemColor(), null, null
			);

			var colorForBorder: Color = null;
			var colors = Color.Instances();
			if (fractionCurrent < .33)
			{
				colorForBorder = colors.Red;
			}
			else if (fractionCurrent < .67)
			{
				colorForBorder = colors.Yellow;
			}
			else
			{
				colorForBorder = colors.White;
			}

			if (this.amountThreshold != null)
			{
				var thresholdFraction = this.amountThreshold.contextSet(entity).get() as number;
				this._sizeCurrent.x = thresholdFraction * this.size.x;
				display.drawRectangle
				(
					this._sizeCurrent, // pos
					new Coords(1, this.size.y, 0), // size
					this.color.systemColor(), null, null
				)
			}

			display.drawRectangle
			(
				pos, this.size, null, colorForBorder.systemColor(), null
			);

			pos.add(this._sizeHalf);
			var remainingOverMax = Math.round(_amountCurrent) + "/" + _amountMax;
			var text = (this.abbreviation == null ? "" : (this.abbreviation + ":")) + remainingOverMax;
			display.drawText
			(
				text,
				this.size.y, // fontHeightInPixels
				pos, 
				colorForBorder.systemColor(),
				"Black", // colorOutline,
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
