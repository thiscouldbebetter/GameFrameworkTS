
class VisualBar implements Visual
{
	size: Coords;
	color: Color;
	amountCurrent: DataBinding<Entity, number>;
	amountMax: DataBinding<Entity, number>;

	_drawPos: Coords;
	_sizeCurrent: Coords;
	_sizeHalf: Coords

	constructor
	(
		size: Coords, color: Color, amountCurrent: DataBinding<Entity, number>,
		amountMax: DataBinding<Entity, number>
	)
	{
		this.size = size;
		this.color = color;
		this.amountCurrent = amountCurrent;
		this.amountMax = amountMax;

		this._drawPos = new Coords(0, 0, 0);
		this._sizeCurrent = this.size.clone();
		this._sizeHalf = this.size.clone().half();
	}

	draw(universe: Universe, world: World, display: Display, entity: Entity)
	{
		var pos = this._drawPos.overwriteWith(entity.locatable().loc.pos).subtract(this._sizeHalf);
		var _amountCurrent: number = this.amountCurrent.contextSet(entity).get() as number;
		var _amountMax: number = this.amountMax.contextSet(entity).get() as number;
		var fractionCurrent: number = _amountCurrent / _amountMax as number;
		if (fractionCurrent < 1)
		{
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

			display.drawRectangle
			(
				pos, this.size, null, colorForBorder.systemColor(), null
			);

			pos.add(this._sizeHalf);
			var remainingOverMax = _amountCurrent + "/" + _amountMax;
			display.drawText
			(
				remainingOverMax,
				this.size.y, // fontHeightInPixels
				pos, 
				colorForBorder.systemColor(),
				"Black", // colorOutline,
				false, // areColorsReversed
				true, // isCentered
				null, // widthMaxInPixels
			);
		}
	};

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
