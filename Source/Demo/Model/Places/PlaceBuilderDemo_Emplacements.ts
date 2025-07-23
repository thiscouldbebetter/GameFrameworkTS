
class PlaceBuilderDemo_Emplacements
{
	parent: PlaceBuilderDemo;
	entityDimension: number;
	font: FontNameAndHeight;

	constructor(parent: PlaceBuilderDemo)
	{
		this.parent = parent;
		this.entityDimension = this.parent.entityDimension;
		this.font = FontNameAndHeight.fromHeightInPixels(this.entityDimension);
	}

	entityDefnBuildAnvil(): Entity
	{
		var anvilName = "Anvil";
		var anvilVisual: VisualBase = new VisualImageScaled
		(
			Coords.fromXY(1, 1).multiplyScalar(this.entityDimension * 2), // sizeScaled
			new VisualImageFromLibrary(anvilName)
		);
		anvilVisual = VisualGroup.fromChildren( [ anvilVisual ] );

		this.parent.textWithColorAddToVisual
		(
			anvilName, Color.Instances().Blue, anvilVisual as VisualGroup
		);

		var anvilUse = (uwpe: UniverseWorldPlaceEntities) =>
		{
			var universe = uwpe.universe;
			var entityUsing = uwpe.entity;
			var entityUsed = uwpe.entity2;

			var itemCrafter = ItemCrafter.of(entityUsed);
			var itemCrafterAsControls = itemCrafter.toControl
			(
				universe,
				universe.display.sizeInPixels,
				entityUsed, // entityItemCrafter
				entityUsing, // entityItemHolder
				universe.venueCurrent(),
				true // includeTitleAndDoneButton
			);
			var venueNext = itemCrafterAsControls.toVenue();
			universe.venueTransitionTo(venueNext);
			return "";
		};
		var anvilItemCrafter = new ItemCrafter
		([
			new CraftingRecipe
			(
				"Enhanced Armor",
				0, // ticksToComplete,
				[
					new Item("Armor", 1),
					new Item("Iron", 1),
					new Item("Toolset", 1)
				],
				[
					new Item("Enhanced Armor", 1),
					new Item("Toolset", 1)
				]
			)
		]);

		var itemAnvilEntityDefn = Entity.fromNameAndProperties
		(
			anvilName,
			[
				Locatable.create(),
				Drawable.fromVisual(anvilVisual),
				anvilItemCrafter,
				ItemHolder.create(),
				Usable.fromUse(anvilUse)
			]
		);

		return itemAnvilEntityDefn;
	}

	entityDefnBuildArcheryTarget(): Entity
	{
		var entityDimensionHalf = this.entityDimension / 2;

		var name = "ArcheryTarget";

		var visual = VisualBuilder.Instance().archeryTarget(this.entityDimension);

		var collider =
			Sphere.fromRadius(entityDimensionHalf);
		var collide = (uwpe: UniverseWorldPlaceEntities) =>
		{
			console.log("todo - Collide with archery target.");
		};
		var collidable = Collidable.fromColliderAndCollideEntities
		(
			collider,
			collide
		);

		var boundable = Boundable.fromCollidable(collidable);

		var entityDefn = Entity.fromNameAndProperties
		(
			name,
			[
				boundable,
				collidable,
				Drawable.fromVisual(visual),
				Locatable.create()
			]
		);

		return entityDefn;
	}

	entityDefnBuildBoulder(): Entity
	{
		var entityDimension = this.entityDimension / 2;
		var itemDefnName = "Boulder";

		var colorBoulder = Color.Instances().Gray;
		var itemBoulderVisual = VisualGroup.fromChildren
		([
			new VisualArc
			(
				entityDimension * 2, // radiusOuter
				0, // radiusInner
				Coords.fromXY(-1, 0), // directionMin
				.5, // angleSpannedInTurns
				colorBoulder,
				null
			)
		]);
		if (this.parent.visualsHaveText)
		{
			itemBoulderVisual.children.push
			(
				VisualOffset.fromOffsetAndChild
				(
					Coords.fromXY(0, 0 - this.entityDimension * 3),
					VisualText.fromTextImmediateFontAndColor
					(
						itemDefnName, this.font, colorBoulder
					)
				)
			);
		}

		var collider = BoxAxisAligned.fromSize
		(
			Coords
				.fromXYZ(1, .1, 1)
				.multiplyScalar(this.entityDimension)
		);
		var collidable = Collidable.fromColliderAndCollideEntities
		(
			collider,
			(uwpe: UniverseWorldPlaceEntities) =>
			{
				var u = uwpe.universe;
				var e = uwpe.entity;
				var e2 = uwpe.entity2;
				u.collisionHelper.collideEntitiesBounce(e, e2);
			}
		);

		var killable = Killable.fromDie
		(
			(uwpe: UniverseWorldPlaceEntities) =>
			{
				var entityDying = uwpe.entity;
				var entityDropped = Locatable.of(entityDying).entitySpawnWithDefnName
				(
					uwpe, "Iron Ore"
				);
				var quantityToSet = DiceRoll.roll("1d3", null);
				Item.of(entityDropped).quantitySet(quantityToSet);
			}
		);

		var itemBoulderEntityDefn = Entity.fromNameAndProperties
		(
			itemDefnName,
			[
				Locatable.create(),
				collidable,
				Drawable.fromVisual(itemBoulderVisual),
				killable
			]
		);

		return itemBoulderEntityDefn;
	}

	entityDefnBuildCampfire(): Entity
	{
		var entityDimensionHalf = this.entityDimension / 2;

		var campfireName = "Campfire";
		var colors = Color.Instances();
		var campfireColor = colors.Orange;

		var flameVisual = VisualBuilder.Instance().flame(this.entityDimension);
		var smokePuffVisual = VisualCircle.fromRadiusAndColorFill
		(
			entityDimensionHalf, colors.GrayLight
		);
		var smokeVisual = new VisualParticles
		(
			"Smoke",
			null, // ticksToGenerate
			1 / 3, // particlesPerTick
			() => 50, // particleTicksToLiveGet
			// particleVelocityGet
			() => Coords.fromXY(.33, -1.5).add(Coords.fromXY(Math.random() - 0.5, 0) ),
			new Transform_Dynamic
			(
				(transformable: TransformableBase) =>
				{
					var transformableAsVisualCircle =
						transformable as VisualCircle;
					transformableAsVisualCircle.radius *= 1.02;
					var color = transformableAsVisualCircle.colorFill.clone();
					color.alphaSet(color.alpha() * .95);
					transformableAsVisualCircle.colorFill = color;
					return transformable;
				}
			),
			smokePuffVisual
		);

		var itemLogVisual = this.parent.itemDefnsByName.get("Log").visual;
		var itemLogVisualMinusText = itemLogVisual.clone() as VisualGroup;

		if (this.parent.visualsHaveText)
		{
			itemLogVisualMinusText.children.length--;
		}

		var campfireVisual = VisualGroup.fromChildren
		([
			smokeVisual,
			itemLogVisualMinusText,
			flameVisual
		]);

		this.parent.textWithColorAddToVisual
		(
			campfireName, campfireColor, campfireVisual
		);

		var campfireCollider =
			Sphere.fromCenterAndRadius(Coords.create(), entityDimensionHalf);
		var campfireCollide = (uwpe: UniverseWorldPlaceEntities) =>
		{
			var entityOther = uwpe.entity2;
			var entityOtherEffectable = Effectable.of(entityOther);
			if (entityOtherEffectable != null)
			{
				entityOtherEffectable.effectAdd(Effect.Instances().Burning.clone());
			}
		};
		var campfireCollidable = Collidable.fromColliderAndCollideEntities
		(
			campfireCollider,
			campfireCollide
		);

		var boundable = Boundable.fromCollidable(campfireCollidable);

		var campfireEntityDefn = Entity.fromNameAndProperties
		(
			campfireName,
			[
				Animatable2.create(),
				boundable,
				campfireCollidable,
				Drawable.fromVisual(campfireVisual),
				Locatable.create()
			]
		);

		return campfireEntityDefn;
	}

	entityDefnBuildContainer(): Entity
	{
		var colors = Color.Instances();
		var containerColor = colors.Orange;
		var entitySize = Coords.fromXY(1.5, 1).multiplyScalar(this.entityDimension);
		var visual = VisualGroup.fromChildren
		([
			VisualRectangle.fromSizeAndColorFill
			(
				entitySize, containerColor
			),
			VisualRectangle.fromSizeAndColorFill
			(
				Coords.fromXY(1.5 * this.entityDimension, 1), colors.Gray
			),
			VisualRectangle.fromSizeAndColorFill
			(
				Coords.fromXY(.5, .5).multiplyScalar(this.entityDimension),
				colors.Gray
			)
		]);

		this.parent.textWithColorAddToVisual
		(
			"Container", containerColor, visual
		);

		var collidable = Collidable.fromCollider
		(
			BoxAxisAligned.fromSize(entitySize)
		);

		var boundable = Boundable.fromCollidable(collidable);
	
		var containerEntityDefn = Entity.fromNameAndProperties
		(
			"Container",
			[
				boundable,
				collidable,
				Drawable.fromVisual(visual),
				new ItemContainer(),
				ItemHolder.create(),
				Locatable.create(),
				Usable.fromUse
				(
					(uwpe: UniverseWorldPlaceEntities) =>
					{
						var universe = uwpe.universe;
						var entityUsing = uwpe.entity;
						var entityOther = uwpe.entity2;
						var itemContainer = ItemContainer.of(entityOther);
						var itemContainerAsControl = itemContainer.toControl
						(
							universe, universe.display.sizeInPixels,
							entityUsing, entityOther,
							universe.venueCurrent()
						);
						var venueNext = itemContainerAsControl.toVenue();
						universe.venueTransitionTo(venueNext);
						return null;
					}
				)
			]
		);

		return containerEntityDefn;
	}

	entityDefnBuildExit(): Entity
	{
		var colors = Color.Instances();
		var exitColor = colors.Brown;
		var entitySize = Coords.ones().multiplyScalar(this.entityDimension);

		var visual = VisualGroup.fromChildren
		([
			VisualPolygon.fromPathAndColorFill
			(
				Path.fromPoints
				([
					Coords.fromXY(0.5, 0),
					Coords.fromXY(-0.5, 0),
					Coords.fromXY(-0.5, -1.5),
					Coords.fromXY(0.5, -1.5)
				]).transform
				(
					Transform_Scale.fromScalar(this.entityDimension)
				),
				exitColor
			),
			VisualOffset.fromOffsetAndChild
			(
				Coords.fromXY
				(
					this.entityDimension / 4,
					0 - this.entityDimension * .6
				),
				VisualCircle.fromRadiusAndColorFill
				(
					this.entityDimension / 8, colors.Yellow
				)
			)
		]);

		this.parent.textWithColorAddToVisual
		(
			"Exit", exitColor, visual
		);

		var collidable = Collidable.fromCollider
		(
			BoxAxisAligned.fromSize(entitySize)
		);

		var boundable = Boundable.fromCollidable(collidable);

		var exitEntityDefn = Entity.fromNameAndProperties
		(
			"Exit",
			[
				boundable,
				collidable,
				Drawable.fromVisual(visual),
				Locatable.create(),
				Portal.create(), // Destination must be set ouside this method.
				Usable.fromUse
				(
					(uwpe: UniverseWorldPlaceEntities) =>
					{
						var eUsed = uwpe.entity2;
						Portal.of(eUsed).use(uwpe);
						return null;
					}
				)
			]
		);

		return exitEntityDefn;
	}

	entityDefnBuildHole(): Entity
	{
		var entityName = "Hole";
		var entityDimension = this.entityDimension * 1.5;
		var itemHoleColor = Color.Instances().Brown;
		var itemHoleVisual = VisualGroup.fromChildren
		([
			VisualPolygon.fromPathAndColorFill
			(
				Path.fromPoints
				([
					Coords.fromXY(-0.5, 0.0),
					Coords.fromXY(0.5, 0.0),
					Coords.fromXY(0.4, -0.2),
					Coords.fromXY(-0.4, -0.2),
				]).transform
				(
					Transform_Scale.fromScalar(entityDimension)
				),
				itemHoleColor
			)
		]);

		this.parent.textWithColorAddToVisual
		(
			entityName, itemHoleColor, itemHoleVisual
		);

		var use = (uwpe: UniverseWorldPlaceEntities): void =>
		{
			var u = uwpe.universe;
			var eUsing = uwpe.entity;
			var eUsed = uwpe.entity2;
			var itemContainerAsControl = ItemContainer.of(eUsed).toControl
			(
				u, u.display.sizeInPixels, eUsing, eUsed, u.venueCurrent()
			);
			var venueNext = itemContainerAsControl.toVenue();
			u.venueTransitionTo(venueNext);
		}

		var entityDefn = Entity.fromNameAndProperties
		(
			entityName,
			[
				ItemContainer.create(),
				ItemHolder.create(),
				Locatable.create(),
				Drawable.fromVisual(itemHoleVisual),
				Perceptible.default(),
				Usable.fromUse(use)
			]
		);

		return entityDefn;
	}

	entityDefnBuildObstacleBar(): Entity
	{
		var obstacleColor = Color.Instances().Red;

		var obstacleBarSize = Coords.fromXYZ(6, 2, 1).multiplyScalar(this.entityDimension);
		var obstacleRotationInTurns = .0625;
		var obstacleCollider = BoxAxisAligned.fromSize(obstacleBarSize); // todo - Rotate.
		var obstacleCollidable = Collidable.fromCollider(obstacleCollider);
		var obstacleBounds = obstacleCollider;
		var obstacleBoundable = Boundable.fromBounds(obstacleBounds);

		var obstacleLoc = Disposition.fromPosAndOri
		(
			Coords.create(),
			Orientation.fromForwardAndDown
			(
				Coords.create().fromHeadingInTurns(obstacleRotationInTurns),
				Coords.fromXYZ(0, 0, 1)
			)
		);

		var visualBody = VisualGroup.fromChildren
		([
			VisualRectangle.fromSizeAndColorsFillAndBorder
			(
				obstacleCollider.size, obstacleColor, obstacleColor
			)
		]);

		this.parent.textWithColorAddToVisual
		(
			"Bar", obstacleColor, visualBody
		);

		var visual = VisualRotate.fromChild(visualBody);

		var obstacleBarEntityDefn = Entity.fromNameAndProperties
		(
			"Bar",
			[
				obstacleBoundable,
				obstacleCollidable,
				Damager.fromDamagePerHit(Damage.fromAmount(10)),
				Drawable.fromVisual(visual),
				Locatable.fromLoc(obstacleLoc)
			]
		);

		return obstacleBarEntityDefn;
	}

	entityDefnBuildObstacleMine(): Entity
	{
		var colors = Color.Instances();
		var obstacleColor = colors.Red;
		var obstacleMappedCellSourceAsStrings =
		[
			"....xxxx....",
			".....xx.....",
			".....xx.....",
			"....xxxx....",
			"x..xx..xx..x",
			"xxxx.xx.xxxx",
			"xxxx.xx.xxxx",
			"x..xx..xx..x",
			"....xxxx....",
			".....xx.....",
			".....xx.....",
			"....xxxx....",
		];
		var obstacleMappedCellSource = new MapOfCellsCellSourceObstacle
		(
			obstacleMappedCellSourceAsStrings
		);

		var obstacleMappedSizeInCells = Coords.fromXYZ
		(
			obstacleMappedCellSourceAsStrings[0].length,
			obstacleMappedCellSourceAsStrings.length,
			1
		);

		var obstacleMappedCellSize = Coords.fromXYZ(2, 2, 1);

		var entityDefnName = "Mine";
		var obstacleMappedMap = new MapOfCells
		(
			entityDefnName,
			obstacleMappedSizeInCells,
			obstacleMappedCellSize,
			obstacleMappedCellSource
		);

		var obstacleMappedVisualLookup = new Map<string, VisualBase>
		([
			[ "Blocking", new VisualRectangle(obstacleMappedCellSize, obstacleColor, null, false) ], // isCentered
			[ "Open", new VisualNone() ]
		]);
		var obstacleMappedVisual = VisualGroup.fromChildren
		([
			new VisualMap(obstacleMappedMap, obstacleMappedVisualLookup, null, null)
		]);

		this.parent.textWithColorAddToVisual
		(
			entityDefnName, obstacleColor, obstacleMappedVisual
		);

		var obstacleCollider = new MapLocated
		(
			obstacleMappedMap, Disposition.create()
		);

		var obstacleCollidable = Collidable.fromCollider
		(
			obstacleCollider
		);
		var obstacleBounds = BoxAxisAligned.fromCenterAndSize
		(
			obstacleCollider.loc.pos, obstacleMappedMap.size
		);
		var obstacleBoundable = Boundable.fromBounds(obstacleBounds);

		var obstacleMappedEntityDefn = Entity.fromNameAndProperties
		(
			entityDefnName,
			[
				obstacleBoundable,
				obstacleCollidable,
				Damager.fromDamagePerHit(Damage.fromAmount(10)),
				Drawable.fromVisual(obstacleMappedVisual),
				Locatable.create()
			]
		);

		return obstacleMappedEntityDefn;
	}

	entityDefnBuildObstacleRing(): Entity
	{
		var colors = Color.Instances();
		var obstacleColor = colors.Gray;
		var obstacleRadiusOuter = this.entityDimension * 3.5;
		var obstacleRadiusInner = obstacleRadiusOuter - this.entityDimension;
		var obstacleAngleSpannedInTurns = .85;
		var obstacleLoc = new Disposition(Coords.create(), null, null);
		var obstacleCollider = new Arc
		(
			new Shell
			(
				Sphere.fromRadius(obstacleRadiusOuter), // sphereOuter
				obstacleRadiusInner
			),
			new Wedge
			(
				Coords.create(), // vertex
				Coords.fromXY(1, 0), // directionMin
				//obstacleLoc.orientation.forward, // directionMin
				obstacleAngleSpannedInTurns
			)
		);

		var obstacleRingVisual = new VisualArc
		(
			obstacleRadiusOuter,
			obstacleRadiusInner,
			Coords.fromXY(1, 0), // directionMin
			obstacleAngleSpannedInTurns,
			obstacleColor,
			null
		);

		var obstacleRingObstacle = new Obstacle();
		var obstacleCollidable = Collidable.fromColliderPropertyNameAndCollide
		(
			obstacleCollider,
			Movable.name,
			(uwpe: UniverseWorldPlaceEntities) => obstacleRingObstacle.collide(uwpe)
		);

		var boundable = Boundable.fromCollidable(obstacleCollidable);

		var obstacleRingEntityDefn = Entity.fromNameAndProperties
		(
			"Ring",
			[
				boundable,
				obstacleCollidable,
				//Damager.fromDamagePerHit(Damage.fromAmount(10)),
				Drawable.fromVisual(obstacleRingVisual),
				Locatable.fromLoc(obstacleLoc),
			]
		);

		return obstacleRingEntityDefn;
	}

	entityDefnBuildPillow(): Entity
	{
		var pillowName = "Pillow";
		var pillowVisual: VisualBase = new VisualImageScaled
		(
			Coords.fromXY(1, .75).multiplyScalar(this.entityDimension * 2), // sizeScaled
			new VisualImageFromLibrary(pillowName)
		);
		pillowVisual = VisualGroup.fromChildren( [ pillowVisual ] );

		this.parent.textWithColorAddToVisual
		(
			pillowName, Color.Instances().Blue, pillowVisual as VisualGroup
		);

		var pillowUse = (uwpe: UniverseWorldPlaceEntities) =>
		{
			var universe = uwpe.universe;
			var entityUsing = uwpe.entity;

			var tirable = Tirable.of(entityUsing);
			tirable.fallAsleep(uwpe);
			var venueNext = universe.venueCurrent();
			universe.venueTransitionTo(venueNext);
			return ""; // todo
		};

		var itemPillowEntityDefn = Entity.fromNameAndProperties
		(
			pillowName,
			[
				Locatable.create(),
				Drawable.fromVisual(pillowVisual),
				Usable.fromUse(pillowUse)
			]
		);

		return itemPillowEntityDefn;
	}

	entityDefnBuildPortal(): Entity
	{
		var baseColor = Color.Instances().Brown;

		var entitySize = Coords.ones().multiplyScalar(this.entityDimension);

		var visual = VisualGroup.fromChildren
		([
			VisualPolygon.fromPathAndColorFill
			(
				Path.fromPoints
				([
					Coords.fromXY(0.5, 0.5),
					Coords.fromXY(-0.5, 0.5),
					Coords.fromXY(-0.5, -0.5),
					Coords.fromXY(0, -1),
					Coords.fromXY(0.5, -0.5)
				]).transform
				(
					Transform_Scale.fromScalar(this.entityDimension)
				),
				baseColor
			),
			VisualOffset.fromOffsetAndChild
			(
				Coords.fromXY(0, this.entityDimension),
				new VisualDynamic
				(
					(uwpe: UniverseWorldPlaceEntities) =>
					{
						var e = uwpe.entity;
						return VisualText.fromTextImmediateFontAndColor
						(
							Portal.of(e).destinationPlaceName,
							this.font,
							baseColor
						)
					}
				)
			)
		]);

		var portalUse = (uwpe: UniverseWorldPlaceEntities) =>
		{
			var eUsed = uwpe.entity2;
			Portal.of(eUsed).use(uwpe);
		};

		var portalEntity = Entity.fromNameAndProperties
		(
			"Portal",
			[
				Collidable.fromCollider(BoxAxisAligned.fromSize(entitySize)),
				Drawable.fromVisual(visual),
				Locatable.create(),
				new Portal(null, "Exit", Coords.create()),
				Usable.fromUse(portalUse)
			]
		);

		return portalEntity;
	}

	entityDefnBuildTrafficCone(): Entity
	{
		var entityName = "TrafficCone";
		var entityDimension = this.entityDimension * 1.5;
		var colors = Color.Instances();
		var color = colors.Orange;
		var visual = VisualGroup.fromChildren
		([
			VisualEllipse.fromSemiaxesHorizontalAndVerticalAndColorFill
			(
				this.entityDimension / 2,
				this.entityDimension / 4,
				colors.YellowOrange
			),
			VisualPolygon.fromPathAndColorFill
			(
				Path.fromPoints
				([
					Coords.fromXY(-0.5, 0),
					Coords.fromXY(-0.1, -1.5), // tip left
					Coords.fromXY(0.1, -1.5), // tip right
					Coords.fromXY(0.5, 0),
				]).transform
				(
					Transform_Scale.fromScalar(this.entityDimension * 0.75)
				),
				color
			)
		]);

		this.parent.textWithColorAddToVisual
		(
			entityName, color, visual
		);

		var colliderRadius = entityDimension * .25;
		var collider = Sphere.fromRadius(colliderRadius);
		var collidable = Collidable.fromColliderPropertyNameAndCollide
		(
			collider,
			Movable.name, // entityPropertyNamesToCollideWith,
			// collideEntities
			(uwpe: UniverseWorldPlaceEntities, c: Collision) =>
			{
				var universe = uwpe.universe;
				var e = uwpe.entity;
				var e2 = uwpe.entity2;
				universe.collisionHelper.collideEntitiesBounce(e, e2);
			}
		);

		var boundable = Boundable.fromBounds
		(
			BoxAxisAligned.fromSize
			(
				Coords.fromXY(1, 1).multiplyScalar(colliderRadius)
			)
		);

		var entityDefn = Entity.fromNameAndProperties
		(
			entityName,
			[
				boundable,
				collidable,
				Drawable.fromVisual(visual),
				Locatable.create()
			]
		);

		return entityDefn;
	}

	entityDefnBuildTree(): Entity
	{
		var entityName = "Tree";
		this.entityDimension *= 1.5;
		var colors = Color.Instances();
		var color = colors.GreenDark;
		var colorBorder = colors.Black;
		var visualTree = VisualGroup.fromChildren
		([
			VisualRectangle.fromSizeAndColorFill
			(
				Coords.fromXY(1, 2).multiplyScalar(this.entityDimension * 0.5),
				colors.Brown
			),
			VisualOffset.fromOffsetAndChild
			(
				Coords.fromXY(0, 0 - this.entityDimension),
				new VisualEllipse
				(
					this.entityDimension, // semimajorAxis
					this.entityDimension * .8,
					0, // rotationInTurns
					color,
					colorBorder,
					false // shouldUseEntityOrientation
				)
			),
		]);

		this.parent.textWithColorAddToVisual
		(
			entityName, color, visualTree
		);

		var visual = VisualOffset.fromOffsetAndChild
		(
			Coords.fromXY(0, 0 - this.entityDimension), visualTree
		);
		var collider = BoxAxisAligned.fromSize
		(
			Coords
				.fromXYZ(1, .1, 1)
				.multiplyScalar(this.entityDimension * .25)
		);
		var collidable = Collidable.fromColliderAndCollideEntities
		(
			collider,
			(uwpe: UniverseWorldPlaceEntities, c: Collision) =>
			{
				var u = uwpe.universe;
				var e = uwpe.entity;
				var e2 = uwpe.entity2;
				u.collisionHelper.collideEntitiesBounce(e, e2);
			}
		);

		var entityDefn = Entity.fromNameAndProperties
		(
			entityName,
			[
				Locatable.create(),
				collidable,
				Drawable.fromVisual(visual),
			]
		);

		return entityDefn;
	}
}

class MapCellObstacle implements Clonable<MapCellObstacle>
{
	isBlocking: boolean;
	visualName: string;

	constructor(isBlocking: boolean, visualName: string)
	{
		this.isBlocking = isBlocking;
		this.visualName = visualName;
	}

	static default(): MapCellObstacle
	{
		return new MapCellObstacle(false, null);
	}

	// Clonable.

	clone(): MapCellObstacle
	{
		return new MapCellObstacle(this.isBlocking, this.visualName);
	}

	overwriteWith(other: MapCellObstacle)
	{
		this.isBlocking = other.isBlocking;
		this.visualName = other.visualName;
		return this;
	}
}

class MapOfCellsCellSourceObstacle
	implements MapOfCellsCellSource<MapCellObstacle>
{
	cellsAsStrings: string[];

	constructor(cellsAsStrings: string[])
	{
		this.cellsAsStrings = cellsAsStrings;
	}

	cellAtPosInCells
	(
		map: MapOfCells<MapCellObstacle>,
		cellPosInCells: Coords,
		cellToOverwrite: MapCellObstacle
	): MapCellObstacle
	{
		var cellCode = this.cellsAsStrings[cellPosInCells.y][cellPosInCells.x];
		var cellVisualName = (cellCode == "x" ? "Blocking" : "Open");
		var cellIsBlocking = (cellCode == "x");
		cellToOverwrite.visualName = cellVisualName;
		cellToOverwrite.isBlocking = cellIsBlocking;
		return cellToOverwrite;
	}

	cellAtPosInCellsNoOverwrite
	(
		map: MapOfCells<MapCellObstacle>,
		posInCells: Coords
	): MapCellObstacle
	{
		return this.cellAtPosInCells(map, posInCells, this.cellCreate() );
	}

	cellCreate(): MapCellObstacle
	{
		return MapCellObstacle.default();
	}

	// Clonable.

	clone(): MapOfCellsCellSourceObstacle { return this; }

	overwriteWith
	(
		other: MapOfCellsCellSourceObstacle
	): MapOfCellsCellSourceObstacle
	{
		return this;
	}

}
