
function Place(entities)
{
	this.entities = [];
	this._entitiesByPropertyName = {};
	this.entitiesToSpawn = entities.slice();
	this.entitiesToRemove = [];
}
{
	Place.prototype.draw = function(universe, world)
	{
		var entitiesDrawable = this.entitiesByPropertyName("drawable");
		for (var i = 0; i < entitiesDrawable.length; i++)
		{
			var entity = entitiesDrawable[i];
			var drawable = entity.drawable;
			drawable.updateForTimerTick(universe, world, this, entity);
		}
	}

	Place.prototype.entitiesByPropertyName = function(propertyName)
	{
		var returnValues = this._entitiesByPropertyName[propertyName];
		if (returnValues == null)
		{
			returnValues = [];
			this._entitiesByPropertyName[propertyName] = returnValues;
		}

		return returnValues;
	}

	Place.prototype.entitiesRemove = function()
	{
		for (var i = 0; i < this.entitiesToRemove.length; i++)
		{
			var entity = this.entitiesToRemove[i];
			this.entityRemove(entity);
		}
		this.entitiesToRemove.clear();
	}

	Place.prototype.entitiesSpawn = function(universe, world)
	{
		for (var i = 0; i < this.entitiesToSpawn.length; i++)
		{
			var entity = this.entitiesToSpawn[i];
			this.entitySpawn(entity);
		}

		this.entitiesToSpawn.clear();
	}

	Place.prototype.entityRemove = function(entity)
	{
		var entityProperties = entity.properties;
		for (var p = 0; p < entityProperties.length; p++)
		{
			var property = entityProperties[p];
			var propertyName = property.constructor.name;
			propertyName =
				propertyName.substr(0, 1).toLowerCase()
				+ propertyName.substr(1);
			var entitiesWithProperty =
				this.entitiesByPropertyName(propertyName);
			entitiesWithProperty.remove(entity);
		}
		this.entities.remove(entity);
		delete this.entities[entity.name];
	}

	Place.prototype.entitySpawn = function(entity)
	{
		this.entities.push(entity);
		this.entities[entity.name] = entity;

		var entityProperties = entity.properties;
		for (var p = 0; p < entityProperties.length; p++)
		{
			var property = entityProperties[p];
			var propertyName = property.constructor.name;
			propertyName =
				propertyName.substr(0, 1).toLowerCase()
				+ propertyName.substr(1);

			var entitiesWithProperty = this.entitiesByPropertyName(propertyName);
			entitiesWithProperty.push(entity);
		}
	}

	Place.prototype.finalize = function(universe, world)
	{
		universe.inputHelper.inputsRemoveAll();
	}

	Place.prototype.initialize = function(universe, world)
	{
		// Do nothing.
	}

	Place.prototype.updateForTimerTick = function(universe, world)
	{
		this.entitiesRemove();

		this.entitiesSpawn();

		var propertyNamesToProcess =
		[
			"locatable",
			"constrainable",
			"collidable",
			"idleable",
			"actor",
			"playable",
			"ephemeral",
		];

		for (var p = 0; p < propertyNamesToProcess.length; p++)
		{
			var propertyName = propertyNamesToProcess[p];
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
	}
}
