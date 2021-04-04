
namespace ThisCouldBeBetter.GameFramework
{

export class Place
{
	name: string;
	defnName: string;
	size: Coords;
	entities: Entity[];
	entitiesByName: Map<string, Entity>;

	_entitiesByPropertyName: Map<string, Entity[]>;
	entitiesToSpawn: Entity[];
	entitiesToRemove: Entity[];
	isLoaded: boolean;

	constructor(name: string, defnName: string, size: Coords, entities: Entity[])
	{
		this.name = name;
		this.defnName = defnName;
		this.size = size;
		this.entities = [];
		this.entitiesByName = new Map<string, Entity>();

		this._entitiesByPropertyName = new Map<string, Entity[]>();
		this.entitiesToSpawn = entities.slice();
		this.entitiesToRemove = [];
		this.isLoaded = false;
	}

	defn(world: World)
	{
		return world.defn.placeDefnByName(this.defnName);
	}

	draw(universe: Universe, world: World, display: Display)
	{
		var colorBlack = Color.byName("Black");
		display.drawBackground(colorBlack, colorBlack);

		var cameraEntity = this.camera();
		var camera = cameraEntity.camera();
		camera.drawEntitiesInView(universe, world, this, cameraEntity, display);
	}

	entitiesByPropertyName(propertyName: string)
	{
		var returnValues = this._entitiesByPropertyName.get(propertyName);
		if (returnValues == null)
		{
			returnValues = [];
			this._entitiesByPropertyName.set(propertyName, returnValues);
		}

		return returnValues;
	}

	entitiesRemove()
	{
		for (var i = 0; i < this.entitiesToRemove.length; i++)
		{
			var entity = this.entitiesToRemove[i];
			this.entityRemove(entity);
		}
		this.entitiesToRemove.length = 0;
	}

	entitiesToRemoveAdd(entitiesToRemove: Entity[]): void
	{
		this.entitiesToRemove.push(...entitiesToRemove);
	}

	entitiesToSpawnAdd(entitiesToSpawn: Entity[]): void
	{
		this.entitiesToSpawn.push(...entitiesToSpawn);
	}

	entitiesSpawn(universe: Universe, world: World)
	{
		for (var i = 0; i < this.entitiesToSpawn.length; i++)
		{
			var entity = this.entitiesToSpawn[i];
			this.entitySpawn(universe, world, entity);
		}

		this.entitiesToSpawn.length = 0;
	}

	entityRemove(entity: Entity)
	{
		var entityProperties = entity.properties;
		for (var p = 0; p < entityProperties.length; p++)
		{
			var property = entityProperties[p];
			var propertyName = property.constructor.name;
			var entitiesWithProperty =
				this.entitiesByPropertyName(propertyName);
			ArrayHelper.remove(entitiesWithProperty, entity);
		}
		ArrayHelper.remove(this.entities, entity);
		this.entitiesByName.delete(entity.name);
	}

	entitySpawn(universe: Universe, world: World, entity: Entity)
	{
		if (entity.name == null)
		{
			entity.name = "Entity";
		}

		if (this.entitiesByName.has(entity.name))
		{
			entity.name += universe.idHelper.idNext();
		}

		this.entities.push(entity);
		this.entitiesByName.set(entity.name, entity);

		var entityProperties = entity.properties;
		for (var i = 0; i < entityProperties.length; i++)
		{
			var property = entityProperties[i];
			var propertyName = property.constructor.name;
			var entitiesWithProperty = this.entitiesByPropertyName(propertyName);
			entitiesWithProperty.push(entity);
		}

		entity.initialize(universe, world, this);
	}

	entityToRemoveAdd(entityToRemove: Entity): void
	{
		this.entitiesToRemove.push(entityToRemove);
	}

	entityToSpawnAdd(entityToSpawn: Entity): void
	{
		this.entitiesToSpawn.push(entityToSpawn);
	}

	finalize(universe: Universe, world: World)
	{
		this.entitiesRemove();
		universe.inputHelper.inputsRemoveAll();
		for (var i = 0; i < this.entities.length; i++)
		{
			var entity = this.entities[i];
			entity.finalize(universe, world, this);
		}
	}

	initialize(universe: Universe, world: World)
	{
		var defn = this.defn(world);
		defn.placeInitialize(universe, world, this);
		this.entitiesSpawn(universe, world);
		this.entitiesToSpawn.length = 0;
		for (var i = 0; i < this.entities.length; i++)
		{
			var entity = this.entities[i];
			entity.initialize(universe, world, this);
		}
	}

	load(universe: Universe, world: World)
	{
		if (this.isLoaded == false)
		{
			var loadables = this.loadables();
			loadables.forEach(x => x.loadable().load(universe, world, this, x));
			this.isLoaded = true;
		}
	}

	unload(universe: Universe, world: World)
	{
		if (this.isLoaded)
		{
			var loadables = this.loadables();
			loadables.forEach(x => x.loadable().unload(universe, world, this, x));
			this.isLoaded = false;
		}
	}

	updateForTimerTick(universe: Universe, world: World)
	{
		this.entitiesRemove();

		this.entitiesSpawn(universe, world);

		var propertyNamesToProcess = this.defn(world).propertyNamesToProcess;
		for (var p = 0; p < propertyNamesToProcess.length; p++)
		{
			var propertyName = propertyNamesToProcess[p];
			var entitiesWithProperty = this.entitiesByPropertyName(propertyName);
			if (entitiesWithProperty != null)
			{
				for (var i = 0; i < entitiesWithProperty.length; i++)
				{
					var entity = entitiesWithProperty[i];
					var entityProperty = entity.propertiesByName.get(propertyName);
					entityProperty.updateForTimerTick(universe, world, this, entity);
				}
			}
		}
	}

	// Controls.

	toControl(universe: Universe, world: World)
	{
		var player = this.player();
		var playerControllable = player.controllable();
		var returnValue = playerControllable.toControl
		(
			universe, universe.display.sizeInPixels, player, null, false
		);
		return returnValue;
	}

	// Entity convenience accessors.

	camera(): Entity
	{
		return this.entitiesByPropertyName(Camera.name)[0];
	}

	collisionTracker(): CollisionTracker
	{
		var collisionTrackerEntity = this.entitiesByPropertyName(CollisionTracker.name)[0];
		var returnValueAsProperty =
		(
			collisionTrackerEntity == null
			? null
			: collisionTrackerEntity.propertyByName(CollisionTracker.name)
		);
		var returnValue = returnValueAsProperty as CollisionTracker;
		return returnValue;
	}

	drawables(): Entity[]
	{
		return this.entitiesByPropertyName(Drawable.name);
	}

	items(): Entity[]
	{
		return this.entitiesByPropertyName(Item.name);
	}

	loadables(): Entity[]
	{
		return this.entitiesByPropertyName(Loadable.name);
	}

	movables(): Entity[]
	{
		return this.entitiesByPropertyName(Movable.name);
	}

	player(): Entity
	{
		return this.entitiesByPropertyName(Playable.name)[0];
	}

	usables(): Entity[]
	{
		return this.entitiesByPropertyName(Usable.name);
	}

}

}
