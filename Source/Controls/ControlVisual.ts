
namespace ThisCouldBeBetter.GameFramework
{

export class ControlVisual extends ControlBase
{
	visual: DataBinding<any,Visual>;
	colorBackground: Color;
	colorBorder: Color;

	_drawPos: Coords;
	_locatable: Locatable;
	_locatableEntity: Entity;
	_sizeHalf: Coords;

	constructor(
		name: string, pos: Coords, size: Coords,
		visual: DataBinding<any, Visual>, colorBackground: Color,
		colorBorder: Color
	)
	{
		super(name, pos, size, null);
		this.visual = visual;
		this.colorBackground = colorBackground;
		this.colorBorder = colorBorder;

		// Helper variables.
		this._drawPos = Coords.blank();
		this._locatable = new Locatable(new Disposition(this._drawPos, null, null));
		this._locatableEntity = new Entity
		(
			"_drawableEntity",
			[
				this._locatable,
				new Drawable(new VisualNone(), null)
			]
		);
		this._sizeHalf = Coords.blank();
	}

	actionHandle(actionName: string, universe: Universe): boolean
	{
		return false;
	}

	isEnabled()
	{
		return false;
	}

	mouseClick(x: Coords): boolean
	{
		return false;
	}

	scalePosAndSize(scaleFactors: Coords)
	{
		this.pos.multiply(scaleFactors);
		this.size.multiply(scaleFactors);
		this._sizeHalf.multiply(scaleFactors);
		return this;
	}

	// drawable

	draw(universe: Universe, display: Display, drawLoc: Disposition, style: ControlStyle)
	{
		var visualToDraw = this.visual.get();
		if (visualToDraw != null)
		{
			var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
			var style = style || this.style(universe);

			var colorFill = this.colorBackground || Color.Instances()._Transparent;
			var colorBorder = this.colorBorder || style.colorBorder;
			display.drawRectangle
			(
				drawPos, this.size,
				Color.systemColorGet(colorFill),
				Color.systemColorGet(colorBorder),
				null
			);

			var locatableEntity = this._locatableEntity;
			locatableEntity.locatable().loc.pos.overwriteWith(drawPos);
			drawPos.add(this._sizeHalf.overwriteWith(this.size).half());
			var world = universe.world;
			var place = (world == null ? null : world.placeCurrent);
			visualToDraw.draw(universe, world, place, locatableEntity, display);
		}
	}
}

}
