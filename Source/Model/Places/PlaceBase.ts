
namespace ThisCouldBeBetter.GameFramework
{

export class PlaceBase implements Place, Loadable
{
	name: string;
	defnName: string;
	parentName: string;
	_size: Coords;
	_entities: Entity[];
	entitiesById: Map<number, Entity>;

	_entitiesByPropertyName: Map<string, Entity[]>;
	entitiesToSpawn: Entity[];
	entitiesToRemove: Entity[];
	isLoaded: boolean;

	constructor
	(
		name: string,
		defnName: string,
		parentName: string,
		size: Coords,
		entities: Entity[]
	)
	{
		this.name = name;
		this.defnName = defnName;
		this.parentName = parentName;
		this._size = size;
		entities = entities || [];

		this._entities = [];
		this.entitiesById = new Map<number, Entity>();

		this._entitiesByPropertyName = new Map<string, Entity[]>();
		this.entitiesToSpawn = [];
		this.entitiesToSpawnAdd(entities);
		this.entitiesToRemove = [];
		this.isLoaded = false;
	}

	static default(): Place
	{
		return new PlaceBase
		(
			"Default",
			PlaceDefn + "Default", // defnName,
			null, // parentName
			Coords.fromXY(1, 1).multiplyScalar(1000), // size
			null // entities
		);
	}

	static fromPlaceDefn(placeDefn: PlaceDefn): PlaceBase
	{
		return new PlaceBase
		(
			PlaceBase.name + "FromPlaceDefn" + placeDefn.name,
			placeDefn.name,
			null, // parentName
			Coords.fromXY(1, 1).multiplyScalar(1000), // size
			null // entities
		);
	}

	defn(world: World): PlaceDefn
	{
		return world.placeDefnByName(this.defnName);
	}

	placeParent(world: World): Place
	{
		return (this.parentName == null ? null : world.placeGetByName(this.parentName));
	}

	placesAncestors(world: World, placesInAncestry: Place[]): Place[]
	{
		var placeParent = this.placeParent(world);
		placeParent.placesAncestors(world, placesInAncestry);
		placesInAncestry.push(this);
		return placesInAncestry;
	}

	size(): Coords
	{
		return this._size;
	}

	// Drawing.

	draw(universe: Universe, world: World, display: Display): void
	{
		var uwpe = UniverseWorldPlaceEntities.fromUniverseWorldAndPlace
		(
			universe, world, this
		);
		var colorBlack = Color.Instances().Black;
		display.drawBackgroundWithColorsBackAndBorder(colorBlack, null);

		var cameraEntity = Camera.entityFromPlace(this);
		if (cameraEntity == null)
		{
			var drawables = Drawable.entitiesFromPlace(this);
			drawables.forEach
			(
				(x: Entity) =>
				{
					Drawable.of(x).updateForTimerTick(uwpe.entitySet(x) );
				}
			)
		}
		else
		{
			var camera = Camera.of(cameraEntity);
			camera.drawEntitiesInView(uwpe, cameraEntity, display);
		}
	}

	// Entities.

	entitiesAll(): Entity[]
	{
		return this._entities;
	}

	entitiesByPropertyName(propertyName: string): Entity[]
	{
		var returnValues = this._entitiesByPropertyName.get(propertyName);
		if (returnValues == null)
		{
			returnValues = [];
			this._entitiesByPropertyName.set(propertyName, returnValues);
		}

		return returnValues;
	}

	entitiesRemove(uwpe: UniverseWorldPlaceEntities): void
	{
		var uwpeEntityToRestore = uwpe.entity;

		for (var i = 0; i < this.entitiesToRemove.length; i++)
		{
			var entity = this.entitiesToRemove[i];
			uwpe.entitySet(entity);
			this.entityRemove(uwpe);
		}
		this.entitiesToRemove.length = 0;

		uwpe.entity = uwpeEntityToRestore;
	}

	entitiesToRemoveAdd(entitiesToRemove: Entity[]): void
	{
		this.entitiesToRemove.push(...entitiesToRemove);
	}

	entitiesToSpawnAdd(entitiesToSpawn: Entity[]): void
	{
		entitiesToSpawn.forEach(x => this.entityToSpawnAdd(x) );
	}

	entitiesSpawn(uwpe: UniverseWorldPlaceEntities): void
	{
		uwpe.placeSet(this);
		for (var i = 0; i < this.entitiesToSpawn.length; i++)
		{
			var entity = this.entitiesToSpawn[i];
			uwpe.entitySet(entity);
			this.entitySpawn(uwpe);
		}

		this.entitiesToSpawn.length = 0;
	}

	entityById(entityId: number): Entity
	{
		return this.entitiesById.get(entityId);
	}

	entityByName(entityName: string): Entity
	{
		return this._entities.find(x => x.name == entityName);
	}

	entityIsPresent(entity:Entity): boolean
	{
		return (this._entities.indexOf(entity) >= 0);
	}

	entityRemove(uwpe: UniverseWorldPlaceEntities): void
	{
		var entity = uwpe.entity;

		var entityProperties = entity.properties;
		for (var p = 0; p < entityProperties.length; p++)
		{
			var property = entityProperties[p];
			var propertyName = property.constructor.name;
			var entitiesWithProperty =
				this.entitiesByPropertyName(propertyName);
			ArrayHelper.remove(entitiesWithProperty, entity);
		}
		ArrayHelper.remove(this._entities, entity);
		this.entitiesById.delete(entity.id);

		var collisionTracker = CollisionTrackerBase.fromPlace(uwpe);
		collisionTracker.entityReset(entity);
	}

	entitySpawn(uwpe: UniverseWorldPlaceEntities): void
	{
		uwpe.placeSet(this);

		var entityToSpawn = uwpe.entity;

		var entityIsNotAlreadyPresent =
			(this._entities.indexOf(entityToSpawn) == -1);

		if (entityIsNotAlreadyPresent) // hack
		{
			if (entityToSpawn.name == null)
			{
				entityToSpawn.name = Entity.name;
			}

			this._entities.push(entityToSpawn);
			this.entitiesById.set(entityToSpawn.id, entityToSpawn);

			var placeDefn = this.defn(uwpe.world);

			var entityProperties = entityToSpawn.properties;
			for (var i = 0; i < entityProperties.length; i++)
			{
				var property = entityProperties[i];
				var propertyName = property.propertyName();
				var entitiesWithProperty =
					this.entitiesByPropertyName(propertyName);
				entitiesWithProperty.push(entityToSpawn);
			}

			var propertyNamesToProcess =
				placeDefn == null ? null : placeDefn.propertyNamesToProcess;

			if (propertyNamesToProcess == null)
			{
				entityToSpawn.initialize(uwpe);
			}
			else
			{
				for (var p = 0; p < propertyNamesToProcess.length; p++)
				{
					var propertyName = propertyNamesToProcess[p];
					var entityProperty =
						entityToSpawn.propertyByName(propertyName);
					if (entityProperty != null)
					{
						entityProperty.initialize(uwpe);
					}
				}
			}
		}
	}

	entitySpawn2(universe: Universe, world: World, entity: Entity): void
	{
		this.entitySpawn
		(
			new UniverseWorldPlaceEntities(universe, world, this, entity, null)
		);
	}

	entityToRemoveAdd(entityToRemove: Entity): void
	{
		this.entitiesToRemove.push(entityToRemove);
	}

	entityToSpawnAdd(entityToSpawn: Entity): void
	{
		this.entitiesToSpawn.push(entityToSpawn);
	}

	// EntityProperties.

	finalize(uwpe: UniverseWorldPlaceEntities): void
	{
		uwpe.placeSet(this);
		var universe = uwpe.universe;
		this.entitiesRemove(uwpe);
		universe.inputHelper.inputsRemoveAll();
		var entities = this._entities;
		for (var i = 0; i < entities.length; i++)
		{
			var entity = entities[i];
			entity.finalize(uwpe);
		}
	}

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		uwpe.placeSet(this);
		var world = uwpe.world;
		var placeDefn = this.defn(world);

		if (placeDefn == null)
		{
			this.entitiesSpawn(uwpe);
			this._entities.forEach
			(
				entity => entity.initialize(uwpe)
			)
		}
		else
		{
			placeDefn.placeInitialize(uwpe);
			this.entitiesSpawn(uwpe);
			var propertyNamesToProcess = placeDefn.propertyNamesToProcess;
			for (var p = 0; p < propertyNamesToProcess.length; p++)
			{
				var propertyName = propertyNamesToProcess[p];
				var entitiesWithProperty = this.entitiesByPropertyName(propertyName);
				if (entitiesWithProperty != null)
				{
					for (var i = 0; i < entitiesWithProperty.length; i++)
					{
						var entity = entitiesWithProperty[i];
						var entityProperty = entity.propertyByName(propertyName);
						uwpe.entitySet(entity);
						entityProperty.initialize(uwpe);
					}
				}
			}
		}
	}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		var world = uwpe.world;

		this.entitiesRemove(uwpe);

		this.entitiesSpawn(uwpe);

		uwpe.placeSet(this);

		var placeDefn = this.defn(world);
		if (placeDefn == null)
		{
			this._entities.forEach
			(
				entity => entity.updateForTimerTick(uwpe)
			)
		}
		else
		{
			var propertyNamesToProcess = placeDefn.propertyNamesToProcess;
			for (var p = 0; p < propertyNamesToProcess.length; p++)
			{
				var propertyName = propertyNamesToProcess[p];
				var entitiesWithProperty = this.entitiesByPropertyName(propertyName);
				if (entitiesWithProperty != null)
				{
					for (var i = 0; i < entitiesWithProperty.length; i++)
					{
						var entity = entitiesWithProperty[i];
						var entityProperty = entity.propertyByName(propertyName);
						uwpe.entitySet(entity);
						entityProperty.updateForTimerTick(uwpe);
					}
				}
			}
		}
	}

	// Loadable.

	load
	(
		uwpe: UniverseWorldPlaceEntities,
		callback: (placeLoaded: Loadable) => void
	): PlaceBase
	{
		if (this.isLoaded == false)
		{
			var loadables = LoadableProperty.entitiesFromPlace(this);
			uwpe.placeSet(this);
			loadables.forEach
			(
				x =>
				{
					var prop = LoadableProperty.of(x);
					prop.load(uwpe.entitySet(x), null); // todo
				}
			);
			this.isLoaded = true;
		}

		return this;
	}

	unload(uwpe: UniverseWorldPlaceEntities): PlaceBase
	{
		if (this.isLoaded)
		{
			var loadables = LoadableProperty.entitiesFromPlace(this);
			uwpe.placeSet(this);
			loadables.forEach(x => LoadableProperty.of(x).unload(uwpe.entitySet(x) ) );
			this.isLoaded = false;
		}

		return this;
	}

	// Controllable.

	toControl(universe: Universe, world: World): ControlBase
	{
		var player = Playable.entityFromPlace(this);
		var playerControllable = Controllable.of(player);
		var uwpe = new UniverseWorldPlaceEntities
		(
			universe, world, world.placeCurrent, player, null
		);
		var returnValue = playerControllable.toControl
		(
			uwpe, null, null
		);
		return returnValue;
	}

	// Equatable.

	equals(other: Place): boolean
	{
		return (this.name == other.name);
	}

}

}
