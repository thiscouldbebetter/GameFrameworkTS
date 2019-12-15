
function Place(name, defnName, size, entities)
{
	this.name = name;
	this.defnName = defnName;
	this.size = size;
	this.entities = [];
	this._entitiesByPropertyName = {};
	this.entitiesToSpawn = entities.slice();
	this.entitiesToRemove = [];

	this.propertyNamesToProcess =
	[
		Locatable.name,
		Constrainable.name,
		Collidable.name,
		CollisionTracker.name,
		Idleable.name,
		Actor.name,
		Playable.name,
		Ephemeral.name,
		Killable.name,
	];
}
{
	Place.prototype.defn = function(world)
	{
		return world.defns.placeDefns[this.defnName];
	};

	Place.prototype.draw = function(universe, world)
	{
		universe.display.drawBackground("Black", "Black");
		var entitiesDrawable = this.entitiesByPropertyName(Drawable.name);
		for (var i = 0; i < entitiesDrawable.length; i++)
		{
			var entity = entitiesDrawable[i];
			var drawable = entity.Drawable;
			drawable.updateForTimerTick(universe, world, this, entity);
		}
	};

	Place.prototype.entitiesByPropertyName = function(propertyName)
	{
		var returnValues = this._entitiesByPropertyName[propertyName];
		if (returnValues == null)
		{
			returnValues = [];
			this._entitiesByPropertyName[propertyName] = returnValues;
		}

		return returnValues;
	};

	Place.prototype.entitiesRemove = function()
	{
		for (var i = 0; i < this.entitiesToRemove.length; i++)
		{
			var entity = this.entitiesToRemove[i];
			this.entityRemove(entity);
		}
		this.entitiesToRemove.clear();
	};

	Place.prototype.entitiesSpawn = function(universe, world)
	{
		for (var i = 0; i < this.entitiesToSpawn.length; i++)
		{
			var entity = this.entitiesToSpawn[i];
			this.entitySpawn(universe, world, entity);
		}

		this.entitiesToSpawn.clear();
	};

	Place.prototype.entityRemove = function(entity)
	{
		var entityProperties = entity.properties;
		for (var p = 0; p < entityProperties.length; p++)
		{
			var property = entityProperties[p];
			var propertyName = property.constructor.name;
			var entitiesWithProperty =
				this.entitiesByPropertyName(propertyName);
			entitiesWithProperty.remove(entity);
		}
		this.entities.remove(entity);
		delete this.entities[entity.name];
	};

	Place.prototype.entitySpawn = function(universe, world, entity)
	{
		this.entities.push(entity);
		this.entities[entity.name] = entity;

		var entityProperties = entity.properties;
		for (var p = 0; p < entityProperties.length; p++)
		{
			var property = entityProperties[p];
			var propertyName = property.constructor.name;
			var entitiesWithProperty = this.entitiesByPropertyName(propertyName);
			entitiesWithProperty.push(entity);

			if (property.initialize != null)
			{
				property.initialize(universe, world, this, entity);
			}
		}
	};

	Place.prototype.finalize = function(universe, world)
	{
		universe.inputHelper.inputsRemoveAll();
	};

	Place.prototype.initialize = function(universe, world)
	{
		this.entitiesSpawn(universe, world);
	};

	Place.prototype.updateForTimerTick = function(universe, world)
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
					var entityProperty = entity[propertyName];
					entityProperty.updateForTimerTick(universe, world, this, entity);
				}
			}
		}
	};

	// Entity convenience accessors.

	Place.prototype.camera = function()
	{
		var cameraEntity = this.entitiesByPropertyName(Camera.name)[0];
		return (cameraEntity == null ? null : cameraEntity.Camera);
	};

	Place.prototype.player = function()
	{
		return this.entitiesByPropertyName(Playable.name)[0];
	};
}
