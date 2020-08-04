
class Place
{
	name: string;
	defnName: string;
	size: Coords;
	entities: Entity[];
	entitiesByName: Map<string, Entity>;

	_entitiesByPropertyName: Map<string, Entity[]>;
	entitiesToSpawn: Entity[];
	entitiesToRemove: Entity[];
	propertyNamesToProcess: string[];

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

		this.propertyNamesToProcess =
		[
			Locatable.name,
			Boundable.name,
			Constrainable.name,
			Collidable.name,
			CollisionTracker.name,
			Generator.name,
			Idleable.name,
			Actor.name,
			Playable.name,
			SkillLearner.name,
			Ephemeral.name,
			Recurrent.name,
			Killable.name,
			Camera.name
		];
	}

	defn(world: World)
	{
		return world.defn.placeDefnsByName().get(this.defnName);
	};

	draw(universe: Universe, world: World)
	{
		var entitiesDrawable = this.entitiesByPropertyName(Drawable.name);
		for (var i = 0; i < entitiesDrawable.length; i++)
		{
			var entity = entitiesDrawable[i];
			var drawable = entity.drawable();
			drawable.updateForTimerTick(universe, world, this, entity);
		}
		this.camera().drawEntitiesInViewThenClear(universe, world, this, universe.display);
	};

	entitiesByPropertyName(propertyName: string)
	{
		var returnValues = this._entitiesByPropertyName.get(propertyName);
		if (returnValues == null)
		{
			returnValues = [];
			this._entitiesByPropertyName.set(propertyName, returnValues);
		}

		return returnValues;
	};

	entitiesInitialize(universe: Universe, world: World)
	{
		for (var i = 0; i < this.entities.length; i++)
		{
			var entity = this.entities[i];
			entity.initialize(universe, world, this);
		}

		this.entitiesToSpawn.length = 0;
	};

	entitiesRemove()
	{
		for (var i = 0; i < this.entitiesToRemove.length; i++)
		{
			var entity = this.entitiesToRemove[i];
			this.entityRemove(entity);
		}
		this.entitiesToRemove.length = 0;
	};

	entitiesSpawn(universe: Universe, world: World)
	{
		for (var i = 0; i < this.entitiesToSpawn.length; i++)
		{
			var entity = this.entitiesToSpawn[i];
			this.entitySpawn(universe, world, entity);
		}

		this.entitiesToSpawn.length = 0;
	};

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
	};

	entitySpawn(universe: Universe, world: World, entity: Entity)
	{
		var entityName = entity.name;
		if (entityName == null)
		{
			entityName = "Entity";
		}

		if (this.entitiesByName.get(entityName) != null)
		{
			entityName += universe.idHelper.idNext();
		}

		this.entities.push(entity);
		this.entitiesByName.set(entityName, entity);

		var entityProperties = entity.properties;
		for (var i = 0; i < entityProperties.length; i++)
		{
			var property = entityProperties[i];
			var propertyName = property.constructor.name;
			var entitiesWithProperty = this.entitiesByPropertyName(propertyName);
			entitiesWithProperty.push(entity);
		}

		entity.initialize(universe, world, this);
	};

	finalize(universe: Universe, world: World)
	{
		this.entitiesRemove();
		universe.inputHelper.inputsRemoveAll();
	};

	initialize(universe: Universe, world: World)
	{
		this.entitiesSpawn(universe, world);
		this.entitiesInitialize(universe, world);
	};

	updateForTimerTick(universe: Universe, world: World)
	{
		this.entitiesRemove();

		this.entitiesSpawn(universe, world);

		for (var p = 0; p < this.propertyNamesToProcess.length; p++)
		{
			var propertyName = this.propertyNamesToProcess[p];
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
	};

	// Entity convenience accessors.

	camera()
	{
		var cameraEntity = this.entitiesByPropertyName(Camera.name)[0];
		return (cameraEntity == null ? null : cameraEntity.camera());
	}

	items()
	{
		return this.entitiesByPropertyName(Item.name);
	}

	movables()
	{
		return this.entitiesByPropertyName(Movable.name);
	}

	player()
	{
		return this.entitiesByPropertyName(Playable.name)[0];
	}

	usables()
	{
		return this.entitiesByPropertyName(Usable.name);
	}

}
