
class CameraTests extends TestFixture
{
	_camera: Camera;

	constructor()
	{
		super(CameraTests.name);
		this._camera = Camera.default();
	}

	tests(): ( ()=>void )[]
	{
		var tests =
		[
			this.coordsTransformViewToWorld,
			this.coordsTransformWorldToView,
			this.drawEntitiesInView,
			this.entitiesInViewSort,
			this.toEntity,

			this.finalize,
			this.initialize,
			this.updateForTimerTick,
		];

		return tests;
	}

	coordsTransformViewToWorld(): void
	{
		var viewCoords = Coords.fromXY(0, 0);
		var ignoreZFalse = false;
		var worldCoords =
			this._camera.coordsTransformViewToWorld(viewCoords, ignoreZFalse);
		var worldCoordsExpected =
			// new Coords(0, -200, -300); // todo
			new Coords(-200, -150, -150);
		Assert.areEqual(worldCoordsExpected, worldCoords);
	}

	coordsTransformWorldToView(): void
	{
		var worldCoords = Coords.zeroes();
		var viewCoords =
			this._camera.coordsTransformWorldToView(worldCoords);
		var viewCoordsExpected = new Coords(200, 150, 150); // todo
		Assert.areEqual(viewCoordsExpected, viewCoords);
	}

	drawEntitiesInView(): void
	{
		/*
		universe: Universe, world: World, place: Place,
		cameraEntity: Entity, display: Display
		*/
		Assert.isTrue(true); // todo
	}

	entitiesInViewSort(): void
	{
		var entityNear = new Entity
		(
			"EntityNear", [ Locatable.fromPos(Coords.zeroes() ) ]
		);

		var entityFar = new Entity
		(
			"EntityFar", [ Locatable.fromPos(new Coords(0, 0, 100) ) ]
		);

		var entitiesToSort = [ entityNear, entityFar ];

		var entitiesSorted =
			this._camera.entitiesInViewSort(ArrayHelper.clone(entitiesToSort) as Entity[]);

		Assert.areNumbersEqual(entitiesToSort.length, entitiesSorted.length);
		// todo - No sorting yet.
		Assert.isTrue(ArrayHelper.areEqual(entitiesToSort, entitiesSorted) );
	}

	toEntity()
	{
		var cameraAsEntity = this._camera.toEntity();
		Assert.areStringsEqual(Camera.name, cameraAsEntity.name);
		Assert.isNotNull(Camera.of(cameraAsEntity));
	}

	// EntityProperty.

	finalize(): void
	{
		this._camera.finalize(null);
	}

	initialize(): void
	{
		this._camera.initialize(null);
	}

	updateForTimerTick(): void
	{
		this._camera.updateForTimerTick(null);
	}
}
