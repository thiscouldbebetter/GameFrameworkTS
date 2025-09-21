
namespace ThisCouldBeBetter.GameFramework
{

export class VisualWrapped extends VisualBase<VisualWrapped>
{
	sizeInWrappedInstances: Coords;
	child: Visual;

	_entityPosToRestore: Coords;
	_sizeInWrappedInstancesHalfRoundedDown: Coords;
	_wrapOffsetInPixels: Coords;
	_wrapOffsetInWraps: Coords;

	constructor(sizeInWrappedInstances: Coords, child: Visual)
	{
		super();

		this.sizeInWrappedInstances =
			sizeInWrappedInstances || Coords.ones();
		this.child = child;

		this._entityPosToRestore = Coords.create();
		this._sizeInWrappedInstancesHalfRoundedDown = Coords.create();
		this._wrapOffsetInPixels = Coords.create();
		this._wrapOffsetInWraps = Coords.create();
	}

	static fromSizeInWrappedInstancesAndChild
	(
		sizeInWrappedInstances: Coords, child: Visual
	): VisualWrapped
	{
		return new VisualWrapped(sizeInWrappedInstances, child);
	}

	sizeInWrappedInstancesHalfRoundedDown(): Coords
	{
		this._sizeInWrappedInstancesHalfRoundedDown
			.overwriteWith(this.sizeInWrappedInstances)
			.half()
			.floor();

		return this._sizeInWrappedInstancesHalfRoundedDown;
	}

	sizeInWrappedInstancesSet(value: Coords): VisualWrapped
	{
		this.sizeInWrappedInstances = value;
		return this;
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var sizeInWraps = this.sizeInWrappedInstances;

		var sizeInWrapsHalfRoundedDown =
			this.sizeInWrappedInstancesHalfRoundedDown();

		var place = uwpe.place;
		var wrapSizeInPixels = place.size();

		var entity = uwpe.entity;
		var entityPos = Locatable.of(entity).loc.pos;

		var wrapOffsetInWraps = this._wrapOffsetInWraps;
		var wrapOffsetInPixels = this._wrapOffsetInPixels;

		for (var z = 0; z < sizeInWraps.z; z++)
		{
			wrapOffsetInWraps.z =
				z - sizeInWrapsHalfRoundedDown.z;

			for (var y = 0; y < sizeInWraps.y; y++)
			{
				wrapOffsetInWraps.y =
					y - sizeInWrapsHalfRoundedDown.y;

				for (var x = 0; x < sizeInWraps.x; x++)
				{
					wrapOffsetInWraps.x =
						x - sizeInWrapsHalfRoundedDown.x;

					this._entityPosToRestore.overwriteWith(entityPos);

					wrapOffsetInPixels
						.overwriteWith(wrapOffsetInWraps)
						.multiply(wrapSizeInPixels);

					entityPos.add(wrapOffsetInPixels);
					this.child.draw(uwpe, uwpe.universe.display);

					entityPos.overwriteWith(this._entityPosToRestore);
				}
			}
		}
	}

	// Clonable.

	clone(): VisualWrapped
	{
		return this; // todo
	}

	overwriteWith(other: VisualWrapped): VisualWrapped
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualWrapped
	{
		return this; // todo
	}

}

}