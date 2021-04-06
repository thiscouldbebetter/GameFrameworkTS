"use strict";
class PlaceBuilderDemo_Items {
    constructor(parent, entityDimension) {
        this.parent = parent;
        this.entityDimension = entityDimension;
        this.entityDimensionHalf = this.entityDimension / 2;
    }
    itemDefnsBuild() {
        var itemDefns = [
            this.armor(),
            this.armorEnhanced(),
            this.arrow(),
            this.bomb(),
            this.book(),
            this.bow(),
            this.bread(),
            this.coin(),
            this.crystal(),
            this.doughnut(),
            this.flower(),
            this.fruit(),
            this.grass(),
            this.heart(),
            this.iron(),
            this.ironOre(),
            this.key(),
            this.log(),
            this.meat(),
            this.medicine(),
            this.mushroom(),
            this.pick(),
            this.potion(),
            this.shovel(),
            this.speedBoots(),
            this.sword(),
            this.swordCold(),
            this.swordHeat(),
            this.toolset(),
            this.torch(),
            this.walkieTalkie(),
            this.weight()
        ];
        return itemDefns;
    }
    itemUseEquip(universe, world, place, entityUser, entityItem) {
        var equipmentUser = entityUser.equipmentUser();
        var message = equipmentUser.equipEntityWithItem(universe, world, place, entityUser, entityItem);
        return message;
    }
    // Items.
    armor() {
        var itemArmorName = "Armor";
        var itemArmorColor = Color.byName("GreenDark");
        var path = new Path([
            new Coords(0, 0.5, 0),
            new Coords(-.5, 0, 0),
            new Coords(-.5, -.5, 0),
            new Coords(.5, -.5, 0),
            new Coords(.5, 0, 0),
        ]).transform(Transform_Scale.fromScalar(this.entityDimension));
        var itemArmorVisual = new VisualGroup([
            new VisualPolygon(path, itemArmorColor, null)
        ]);
        if (this.parent.visualsHaveText) {
            itemArmorVisual.children.push(new VisualOffset(VisualText.fromTextAndColor(itemArmorName, itemArmorColor), new Coords(0, 0 - this.entityDimension, 0)));
        }
        var itemArmor = new ItemDefn(itemArmorName, null, null, 50, 30, null, ["Armor"], this.itemUseEquip, itemArmorVisual);
        return itemArmor;
    }
    armorEnhanced() {
        var itemArmorName = "Enhanced Armor";
        var itemArmorColor = Color.byName("GreenDark");
        var path = new Path([
            new Coords(0, 0.5, 0),
            new Coords(-.5, 0, 0),
            new Coords(-.5, -.5, 0),
            new Coords(.5, -.5, 0),
            new Coords(.5, 0, 0),
        ]).transform(Transform_Scale.fromScalar(this.entityDimension));
        var itemArmorVisual = new VisualGroup([
            new VisualPolygon(path, itemArmorColor, null)
        ]);
        if (this.parent.visualsHaveText) {
            itemArmorVisual.children.push(new VisualOffset(VisualText.fromTextAndColor(itemArmorName, itemArmorColor), new Coords(0, 0 - this.entityDimension, 0)));
        }
        var itemArmor = new ItemDefn(itemArmorName, null, null, 50, 30, null, ["Armor"], this.itemUseEquip, itemArmorVisual);
        return itemArmor;
    }
    arrow() {
        var itemArrowName = "Arrow";
        var itemArrowColor = new Color(null, null, [0, .5, .5, 1]);
        var itemArrowVisualShaft = new VisualLine(new Coords(-5, 0, 0), new Coords(5, 0, 0), Color.byName("Brown"), 1 // lineThickness
        );
        var pathHead = new Path([
            new Coords(1, 0, 0),
            new Coords(0.5, .25, 0),
            new Coords(0.5, -.25, 0),
        ]).transform(Transform_Scale.fromScalar(this.entityDimension));
        var itemArrowVisualHead = new VisualPolygon(pathHead, itemArrowColor, null);
        var pathTail = new Path([
            Coords.create(),
            new Coords(-.5, .25, 0),
            new Coords(-.75, .25, 0),
            new Coords(-.5, 0, 0),
            new Coords(-.75, -.25, 0),
            new Coords(-.5, -.25, 0),
        ]).transform(Transform_Scale.fromScalar(this.entityDimension));
        var itemArrowVisualTail = new VisualPolygon(pathTail, Color.byName("White"), null);
        var itemArrowVisual = new VisualGroup([
            itemArrowVisualTail,
            itemArrowVisualShaft,
            itemArrowVisualHead
        ]);
        if (this.parent.visualsHaveText) {
            itemArrowVisual.children.push(new VisualOffset(VisualText.fromTextAndColor(itemArrowName, itemArrowColor), Coords.fromXY(0, 0 - this.entityDimension * 1.5)));
        }
        var itemArrow = new ItemDefn(itemArrowName, null, null, .05, 5, null, null, null, itemArrowVisual);
        return itemArrow;
    }
    bomb() {
        var itemBombName = "Bomb";
        var itemBombColor = Color.byName("BlueDark");
        var itemBombVisual = new VisualGroup([
            // fuse
            new VisualOffset(VisualRectangle.fromSizeAndColorFill(new Coords(.2, 1, 1).multiplyScalar(this.entityDimensionHalf), Color.byName("Tan")), new Coords(0, -1, 0).multiplyScalar(this.entityDimensionHalf)),
            // body
            VisualCircle.fromRadiusAndColorFill(this.entityDimensionHalf, itemBombColor),
            // highlight
            new VisualOffset(VisualCircle.fromRadiusAndColorFill(this.entityDimensionHalf * .3, Color.byName("Blue")), new Coords(-this.entityDimensionHalf / 3, -this.entityDimensionHalf / 3, 0))
        ]);
        if (this.parent.visualsHaveText) {
            itemBombVisual.children.push(new VisualOffset(VisualText.fromTextAndColor(itemBombName, itemBombColor), new Coords(0, 0 - this.entityDimension * 2, 0)));
        }
        var itemBomb = new ItemDefn(itemBombName, null, null, 5, 10, null, ["Wieldable"], this.itemUseEquip, itemBombVisual);
        return itemBomb;
    }
    book() {
        var itemBookName = "Book";
        var itemBookColor = Color.byName("Blue");
        var itemBookVisual = new VisualGroup([
            VisualRectangle.fromSizeAndColorFill(new Coords(1, 1.25, 0).multiplyScalar(this.entityDimension), itemBookColor),
            new VisualOffset(VisualRectangle.fromSizeAndColorFill(new Coords(.1, 1.1, 0).multiplyScalar(this.entityDimension), Color.byName("White")), new Coords(.4, 0, 0).multiplyScalar(this.entityDimension))
        ]);
        if (this.parent.visualsHaveText) {
            itemBookVisual.children.push(new VisualOffset(VisualText.fromTextAndColor(itemBookName, itemBookColor), new Coords(0, 0 - this.entityDimension * 1.5, 0)));
        }
        var itemBook = new ItemDefn(itemBookName, null, null, 1, 10, null, // name, appearance, descripton, mass, value, stackSize
        null, // categoryNames
        (universe, world, place, entityUser, entityItem) => // use
         {
            var venuePrev = universe.venueCurrent;
            var back = () => {
                var venueNext = venuePrev;
                venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                universe.venueNext = venueNext;
            };
            var text = "Fourscore and seven years ago, our fathers brought forth upon this continent "
                + "a new nation, conceived in liberty, and dedicated to the proposition that "
                + " all men are created equal. ";
            var size = universe.display.sizeInPixels.clone();
            var fontHeight = 10;
            var textarea = new ControlTextarea("textareaContents", size.clone().half().half(), size.clone().half(), DataBinding.fromContext(text), fontHeight, DataBinding.fromContext(false) // isEnabled
            );
            var button = new ControlButton("buttonDone", new Coords(size.x / 4, 3 * size.y / 4 + fontHeight, 1), new Coords(size.x / 2, fontHeight * 2, 1), "Done", fontHeight, true, // hasBorder
            true, // isEnabled
            back, // click
            null, null);
            var container = new ControlContainer("containerBook", Coords.create(), size.clone(), [textarea, button], // children
            [
                new Action(ControlActionNames.Instances().ControlCancel, back),
                new Action(ControlActionNames.Instances().ControlConfirm, back)
            ], null);
            var venueNext = container.toVenue();
            venueNext = VenueFader.fromVenueTo(venueNext);
            universe.venueNext = venueNext;
            return "";
        }, itemBookVisual);
        return itemBook;
    }
    bow() {
        var itemBowName = "Bow";
        var itemBowColor = Color.byName("Brown");
        var itemBowVisualString = new VisualPolygon(new Path([
            new Coords(0, -this.entityDimension, 0),
            new Coords(1, -this.entityDimension, 0),
            new Coords(1, this.entityDimension, 0),
            new Coords(0, this.entityDimension, 0),
        ]), Color.byName("White"), null);
        var itemBowVisualBody = new VisualArc(this.entityDimension, // radiusOuter
        this.entityDimension - 3, // radiusInner
        new Coords(0, -1, 0), // directionMin
        .5, // angleSpannedInTurns
        itemBowColor, null);
        var itemBowVisual = new VisualGroup([
            itemBowVisualString,
            itemBowVisualBody
        ]);
        if (this.parent.visualsHaveText) {
            itemBowVisual.children.push(new VisualOffset(VisualText.fromTextAndColor(itemBowName, itemBowColor), new Coords(0, 0 - this.entityDimension * 2, 0)));
        }
        var itemBow = new ItemDefn(itemBowName, null, null, 5, 100, null, ["Wieldable"], this.itemUseEquip, itemBowVisual);
        return itemBow;
    }
    bread() {
        var itemBreadName = "Bread";
        var itemBreadColor = Color.byName("Orange");
        var itemBreadVisualCut = new VisualEllipse(this.entityDimension * .15, // semimajorAxis
        this.entityDimensionHalf * .15, .25, // rotationInTurns
        Color.byName("Tan"), null // colorBorder
        );
        var itemBreadVisual = new VisualGroup([
            new VisualEllipse(this.entityDimensionHalf * 1.5, // semimajorAxis
            this.entityDimensionHalf * .75, 0, // rotationInTurns
            itemBreadColor, null // colorBorder
            ),
            itemBreadVisualCut,
            new VisualOffset(itemBreadVisualCut, new Coords(-this.entityDimensionHalf * 0.75, 0, 0)),
            new VisualOffset(itemBreadVisualCut, new Coords(this.entityDimensionHalf * 0.75, 0, 0))
        ]);
        if (this.parent.visualsHaveText) {
            itemBreadVisual.children.push(new VisualOffset(VisualText.fromTextAndColor(itemBreadName, itemBreadColor), new Coords(0, 0 - this.entityDimension * 1.5, 0)));
        }
        var itemBread = new ItemDefn(itemBreadName, null, null, 1, 4, null, // name, appearance, descripton, mass, value, stackSize
        ["Consumable"], // categoryNames
        (universe, world, place, entityUser, entityItem) => // use
         {
            entityUser.starvable().satietyAdd(10);
            var item = entityItem.item();
            entityUser.itemHolder().itemSubtractDefnNameAndQuantity(item.defnName, 1);
            var message = "You eat the bread.";
            return message;
        }, itemBreadVisual);
        return itemBread;
    }
    coin() {
        var itemCoinName = "Coin";
        var itemCoinColor = Color.byName("Yellow");
        var itemCoinVisual = new VisualGroup([
            VisualCircle.fromRadiusAndColorFill(this.entityDimensionHalf, itemCoinColor),
            new VisualCircle(this.entityDimensionHalf * .75, null, Color.byName("Gray"), null)
        ]);
        if (this.parent.visualsHaveText) {
            itemCoinVisual.children.push(new VisualOffset(VisualText.fromTextAndColor(itemCoinName, itemCoinColor), new Coords(0, 0 - this.entityDimension, 0)));
        }
        var itemCoin = new ItemDefn(itemCoinName, null, null, .01, 1, null, null, null, itemCoinVisual);
        return itemCoin;
    }
    crystal() {
        var itemCrystalName = "Crystal";
        var itemCrystalColor = Color.byName("Cyan");
        var itemCrystalVisual = new VisualGroup([
            new VisualPolygon(new Path([
                new Coords(1, 0, 0),
                new Coords(0, 1, 0),
                new Coords(-1, 0, 0),
                new Coords(0, -1, 0)
            ]).transform(new Transform_Scale(new Coords(1, 1, 1).multiplyScalar(this.entityDimension / 2))), itemCrystalColor, Color.byName("White")),
            new VisualPolygon(new Path([
                new Coords(1, 0, 0),
                new Coords(0, 1, 0),
                new Coords(-1, 0, 0),
                new Coords(0, -1, 0)
            ]).transform(new Transform_Scale(new Coords(1, 1, 1).multiplyScalar(this.entityDimension / 4))), Color.byName("White"), null)
        ]);
        if (this.parent.visualsHaveText) {
            itemCrystalVisual.children.push(new VisualOffset(VisualText.fromTextAndColor(itemCrystalName, itemCrystalColor), new Coords(0, 0 - this.entityDimension, 0)));
        }
        var itemCrystal = new ItemDefn(itemCrystalName, null, null, .1, 1, null, null, null, itemCrystalVisual);
        return itemCrystal;
    }
    doughnut() {
        var itemDoughnutName = "Doughnut";
        var itemDoughnutColor = Color.byName("Orange");
        var itemDoughnutVisualBody = new VisualGroup([
            // body
            VisualCircle.fromRadiusAndColorFill(this.entityDimensionHalf, itemDoughnutColor),
            // hole
            new VisualErase(VisualCircle.fromRadiusAndColorFill(this.entityDimensionHalf * .3, itemDoughnutColor))
        ]);
        var itemDoughnutVisual = new VisualBuffered(new Coords(1, 1, 0).multiplyScalar(this.entityDimension * 1.2), itemDoughnutVisualBody);
        if (this.parent.visualsHaveText) {
            itemDoughnutVisualBody.children.push(new VisualOffset(VisualText.fromTextAndColor(itemDoughnutName, itemDoughnutColor), new Coords(0, 0 - this.entityDimension * 2, 0)));
        }
        var itemDoughnut = new ItemDefn(itemDoughnutName, null, null, 1, 4, null, // name, appearance, descripton, mass, value, stackSize
        ["Consumable"], // categoryNames
        (universe, world, place, entityUser, entityItem) => // use
         {
            entityUser.starvable().satietyAdd(2);
            var item = entityItem.item();
            entityUser.itemHolder().itemSubtractDefnNameAndQuantity(item.defnName, 1);
            var message = "You eat the doughnut.";
            return message;
        }, itemDoughnutVisual);
        return itemDoughnut;
    }
    flower() {
        var itemFlowerName = "Flower";
        var colorFlower = Color.byName("Pink");
        var itemFlowerVisual = new VisualGroup([
            new VisualOffset(new VisualArc(this.entityDimensionHalf * 2, // radiusOuter
            this.entityDimensionHalf * 2 - 2, // radiusInner
            new Coords(-1, 1, 0).normalize(), // directionMin
            .25, // angleSpannedInTurns
            Color.byName("GreenDark"), null), new Coords(.5, 1.75, 0).multiplyScalar(this.entityDimensionHalf)),
            new VisualPolygon(new Path([
                new Coords(1, 0, 0),
                new Coords(.3, .3, 0),
                new Coords(0, 1, 0),
                new Coords(-.3, .3, 0),
                new Coords(-1, 0, 0),
                new Coords(-.3, -.3, 0),
                new Coords(0, -1, 0),
                new Coords(.3, -.3, 0)
            ]).transform(new Transform_Scale(new Coords(1, 1, 1).multiplyScalar(this.entityDimensionHalf))), colorFlower, Color.byName("Red"))
        ]);
        if (this.parent.visualsHaveText) {
            itemFlowerVisual.children.push(new VisualOffset(VisualText.fromTextAndColor(itemFlowerName, colorFlower), new Coords(0, 0 - this.entityDimensionHalf * 2, 0)));
        }
        var itemFlower = new ItemDefn(itemFlowerName, null, null, .01, 1, null, null, null, itemFlowerVisual);
        return itemFlower;
    }
    fruit() {
        var itemFruitName = "Fruit";
        var itemFruitColor = Color.byName("Orange");
        var itemFruitVisual = new VisualGroup([
            VisualCircle.fromRadiusAndColorFill(this.entityDimensionHalf, itemFruitColor),
            new VisualOffset(VisualCircle.fromRadiusAndColorFill(this.entityDimensionHalf * .25, Color.byName("White")), new Coords(-this.entityDimensionHalf / 2, -this.entityDimensionHalf / 2, 0))
        ]);
        if (this.parent.visualsHaveText) {
            itemFruitVisual.children.push(new VisualOffset(VisualText.fromTextAndColor(itemFruitName, itemFruitColor), new Coords(0, 0 - this.entityDimension, 0)));
        }
        var itemFruit = new ItemDefn(itemFruitName, null, null, .25, 6, null, // name, appearance, descripton, mass, value, stackSize
        ["Consumable"], // categoryNames
        (universe, world, place, entityUser, entityItem) => // use
         {
            entityUser.starvable().satietyAdd(5);
            var item = entityItem.item();
            entityUser.itemHolder().itemSubtractDefnNameAndQuantity(item.defnName, 1);
            var message = "You eat the fruit.";
            return message;
        }, itemFruitVisual);
        return itemFruit;
    }
    grass() {
        var itemGrassName = "Grass";
        var itemGrassVisual = new VisualGroup([
            /*
            new VisualOffset
            (
                new VisualImageScaled
                (
                    new VisualImageFromLibrary("Grain"),
                    new Coords(.3, 1, 0).multiplyScalar(this.entityDimension * 2) // sizeScaled
                ),
                new Coords(-.075, -1.2, 0).multiplyScalar(this.entityDimension)
            ),
            */
            new VisualImageScaled(new VisualImageFromLibrary("Grass"), new Coords(1, 1, 0).multiplyScalar(this.entityDimension * 2) // sizeScaled
            ),
        ]);
        if (this.parent.visualsHaveText) {
            itemGrassVisual.children.push(new VisualOffset(VisualText.fromTextAndColor(itemGrassName, Color.byName("GreenDark")), new Coords(0, 0 - this.entityDimensionHalf * 3, 0)));
        }
        var itemGrass = new ItemDefn(itemGrassName, null, null, .01, 1, null, null, null, itemGrassVisual);
        return itemGrass;
    }
    heart() {
        var entityDimensionQuarter = this.entityDimensionHalf / 2;
        var itemHeartName = "Heart";
        var itemHeartColor = Color.byName("Red");
        var itemHeartVisual = new VisualGroup([
            new VisualOffset(new VisualArc(entityDimensionQuarter, // radiusOuter
            0, // radiusInner
            new Coords(-1, 0, 0), // directionMin
            .5, // angleSpannedInTurns
            itemHeartColor, null), new Coords(-entityDimensionQuarter, 0, 0)),
            new VisualOffset(new VisualArc(entityDimensionQuarter, // radiusOuter
            0, // radiusInner
            new Coords(-1, 0, 0), // directionMin
            .5, // angleSpannedInTurns
            itemHeartColor, null), new Coords(entityDimensionQuarter, 0, 0)),
            new VisualPolygon(new Path([
                new Coords(-1.1, 0, 0),
                new Coords(1.1, 0, 0),
                new Coords(0, 1.3, 0),
            ]).transform(Transform_Scale.fromScalar(this.entityDimensionHalf)), itemHeartColor, null)
        ]);
        if (this.parent.visualsHaveText) {
            itemHeartVisual.children.push(new VisualOffset(VisualText.fromTextAndColor(itemHeartName, itemHeartColor), new Coords(0, 0 - this.entityDimension * 1.5, 0)));
        }
        var itemHeartVisualShifted = new VisualOffset(itemHeartVisual, new Coords(0, -entityDimensionQuarter, 0));
        var itemHeart = new ItemDefn(itemHeartName, null, null, 10, 1, null, null, null, itemHeartVisualShifted);
        return itemHeart;
    }
    iron() {
        var itemIronName = "Iron";
        var itemIronColor = Color.byName("Gray");
        var itemIronVisual = new VisualGroup([
            new VisualPolygon(new Path([
                new Coords(-0.5, 0.4, 0),
                new Coords(0.5, 0.4, 0),
                new Coords(0.2, -0.4, 0),
                new Coords(-0.2, -0.4, 0),
            ]).transform(Transform_Scale.fromScalar(this.entityDimension)), itemIronColor, null)
        ]);
        if (this.parent.visualsHaveText) {
            itemIronVisual.children.push(new VisualOffset(VisualText.fromTextAndColor(itemIronName, itemIronColor), new Coords(0, 0 - this.entityDimension, 0)));
        }
        var itemIron = new ItemDefn(itemIronName, null, null, 10, 5, null, null, null, itemIronVisual);
        return itemIron;
    }
    ironOre() {
        var itemIronOreName = "Iron Ore";
        var itemIronOreColor = Color.byName("Gray");
        var itemIronOreVisual = new VisualGroup([
            new VisualArc(this.entityDimension / 2, // radiusOuter
            0, // radiusInner
            new Coords(-1, 0, 0), // directionMin
            .5, // angleSpannedInTurns
            itemIronOreColor, null)
        ]);
        if (this.parent.visualsHaveText) {
            itemIronOreVisual.children.push(new VisualOffset(VisualText.fromTextAndColor(itemIronOreName, itemIronOreColor), new Coords(0, 0 - this.entityDimension * 1.5, 0)));
        }
        var itemIronOre = new ItemDefn(itemIronOreName, null, null, 10, 1, null, null, null, itemIronOreVisual);
        return itemIronOre;
    }
    key() {
        var itemKeyName = "Key";
        var itemKeyColor = Color.byName("Yellow");
        var itemKeyVisual = new VisualGroup([
            new VisualArc(this.entityDimensionHalf, // radiusOuter
            this.entityDimensionHalf / 2, // radiusInner
            Coords.Instances().Ones, // directionMin
            1, // angleSpannedInTurns
            itemKeyColor, null),
            new VisualOffset(new VisualPolars([
                new Polar(0, this.entityDimensionHalf, 0),
                new Polar(.25, this.entityDimensionHalf / 2, 0)
            ], itemKeyColor, this.entityDimensionHalf / 2 // lineThickness
            ), new Coords(this.entityDimensionHalf, 0, 0)),
        ]);
        if (this.parent.visualsHaveText) {
            itemKeyVisual.children.push(new VisualOffset(VisualText.fromTextAndColor(itemKeyName, itemKeyColor), new Coords(0, 0 - this.entityDimension * 2, 0)));
        }
        var itemKey = new ItemDefn(itemKeyName, null, null, .1, 5, null, null, null, itemKeyVisual);
        return itemKey;
    }
    log() {
        var itemLogName = "Log";
        var itemLogColor = Color.byName("Brown");
        var itemLogVisual = new VisualGroup([
            new VisualOffset(VisualCircle.fromRadiusAndColorFill(this.entityDimensionHalf, itemLogColor), Coords.fromXY(0, this.entityDimension)),
            VisualRectangle.fromSizeAndColorFill(new Coords(this.entityDimension * 2, this.entityDimension, 0), itemLogColor),
            new VisualOffset(VisualCircle.fromRadiusAndColorFill(this.entityDimensionHalf, Color.byName("Tan")), Coords.fromXY(-this.entityDimension, 0))
        ]);
        if (this.parent.visualsHaveText) {
            itemLogVisual.children.push(new VisualOffset(VisualText.fromTextAndColor(itemLogName, itemLogColor), new Coords(0, 0 - this.entityDimension, 0)));
        }
        var itemLog = new ItemDefn(itemLogName, null, null, 10, 1, null, null, null, itemLogVisual);
        return itemLog;
    }
    meat() {
        var itemMeatName = "Meat";
        var itemMeatColor = Color.byName("Red");
        var itemMeatVisual = new VisualGroup([
            VisualCircle.fromRadiusAndColorFill(this.entityDimensionHalf, itemMeatColor),
            new VisualCircle(this.entityDimensionHalf * .9, null, Color.byName("White"), null),
            new VisualOffset(new VisualCircle(this.entityDimensionHalf * .2, Color.byName("Pink"), Color.byName("White"), null), Coords.fromXY(this.entityDimensionHalf * .2, 0))
        ]);
        if (this.parent.visualsHaveText) {
            itemMeatVisual.children.push(new VisualOffset(VisualText.fromTextAndColor(itemMeatName, itemMeatColor), Coords.fromXY(0, 0 - this.entityDimension * 1.5)));
        }
        var itemMeat = new ItemDefn(itemMeatName, null, null, 1, 10, null, // name, appearance, descripton, mass, value, stackSize
        ["Consumable"], // categoryNames
        (universe, world, place, entityUser, entityItem) => // use
         {
            entityUser.starvable().satietyAdd(20);
            var item = entityItem.item();
            entityUser.itemHolder().itemSubtractDefnNameAndQuantity(item.defnName, 1);
            var message = "You eat the meat.";
            return message;
        }, itemMeatVisual);
        return itemMeat;
    }
    medicine() {
        var itemMedicineName = "Medicine";
        var itemMedicineColor = Color.byName("Red");
        var itemMedicineVisual = new VisualGroup([
            VisualRectangle.fromSizeAndColorFill(new Coords(1, 1, 0).multiplyScalar(this.entityDimension), Color.byName("White")),
            new VisualPolygon(new Path([
                new Coords(-0.5, -0.2, 0),
                new Coords(-0.2, -0.2, 0),
                new Coords(-0.2, -0.5, 0),
                new Coords(0.2, -0.5, 0),
                new Coords(0.2, -0.2, 0),
                new Coords(0.5, -0.2, 0),
                new Coords(0.5, 0.2, 0),
                new Coords(0.2, 0.2, 0),
                new Coords(0.2, 0.5, 0),
                new Coords(-0.2, 0.5, 0),
                new Coords(-0.2, 0.2, 0),
                new Coords(-0.5, 0.2, 0)
            ]).transform(Transform_Scale.fromScalar(this.entityDimension)), itemMedicineColor, null)
        ]);
        if (this.parent.visualsHaveText) {
            itemMedicineVisual.children.push(new VisualOffset(VisualText.fromTextAndColor(itemMedicineName, itemMedicineColor), new Coords(0, 0 - this.entityDimension, 0)));
        }
        var itemMedicine = new ItemDefn(itemMedicineName, null, null, 1, 10, null, // name, appearance, descripton, mass, value, stackSize
        ["Consumable"], // categoryNames
        (universe, world, place, entityUser, entityItem) => // use
         {
            var effectToApply = Effect.Instances().Healing;
            entityUser.effectable().effectAdd(effectToApply);
            var item = entityItem.item();
            entityUser.itemHolder().itemSubtractDefnNameAndQuantity(item.defnName, 1);
            var message = "You use the medicine.";
            return message;
        }, itemMedicineVisual);
        return itemMedicine;
    }
    mushroom() {
        var itemMushroomName = "Mushroom";
        var colorStem = Color.byName("Gray");
        var colorCap = Color.byName("Violet");
        var itemMushroomVisual = new VisualGroup([
            new VisualOffset(new VisualArc(this.entityDimensionHalf, // radiusOuter
            0, // radiusInner
            new Coords(-1, 0, 0), // directionMin
            .5, // angleSpannedInTurns
            colorCap, null), new Coords(0, -this.entityDimensionHalf / 2, 0)),
            new VisualOffset(VisualRectangle.fromSizeAndColorFill(new Coords(this.entityDimensionHalf / 2, this.entityDimensionHalf, 0), colorStem), Coords.create())
        ]);
        if (this.parent.visualsHaveText) {
            itemMushroomVisual.children.push(new VisualOffset(VisualText.fromTextAndColor(itemMushroomName, colorCap), new Coords(0, 0 - this.entityDimensionHalf * 3, 0)));
        }
        var itemMushroom = new ItemDefn(itemMushroomName, null, null, .01, 1, null, null, null, itemMushroomVisual);
        return itemMushroom;
    }
    pick() {
        var itemPickName = "Pick";
        var itemPickColor = Color.byName("Gray");
        var itemPickVisual = new VisualGroup([
            new VisualOffset(VisualRectangle.fromSizeAndColorFill(new Coords(this.entityDimension / 4, this.entityDimension, 0), Color.byName("Brown")), new Coords(0, 0 - this.entityDimension / 2, 0)),
            new VisualPolygon(new Path([
                new Coords(0.75, -1, 0),
                new Coords(-0.75, -1, 0),
                new Coords(-0.5, -1.4, 0),
                new Coords(0.5, -1.4, 0)
            ]).transform(Transform_Scale.fromScalar(this.entityDimension)), itemPickColor, null)
        ]);
        if (this.parent.visualsHaveText) {
            itemPickVisual.children.push(new VisualOffset(VisualText.fromTextAndColor(itemPickName, itemPickColor), new Coords(0, 0 - this.entityDimension * 2, 0)));
        }
        var itemPick = new ItemDefn(itemPickName, null, null, 1, 30, null, ["Wieldable"], this.itemUseEquip, itemPickVisual);
        return itemPick;
    }
    potion() {
        // todo - Same as medicine right now.
        var itemPotionName = "Potion";
        var itemPotionColor = Color.byName("Red");
        var itemPotionVisual = new VisualGroup([
            VisualRectangle.fromSizeAndColorFill(new Coords(1, 1, 0).multiplyScalar(this.entityDimension), Color.byName("White")),
            new VisualPolygon(new Path([
                new Coords(-0.5, -0.2, 0),
                new Coords(-0.2, -0.2, 0),
                new Coords(-0.2, -0.5, 0),
                new Coords(0.2, -0.5, 0),
                new Coords(0.2, -0.2, 0),
                new Coords(0.5, -0.2, 0),
                new Coords(0.5, 0.2, 0),
                new Coords(0.2, 0.2, 0),
                new Coords(0.2, 0.5, 0),
                new Coords(-0.2, 0.5, 0),
                new Coords(-0.2, 0.2, 0),
                new Coords(-0.5, 0.2, 0)
            ]).transform(Transform_Scale.fromScalar(this.entityDimension)), itemPotionColor, null)
        ]);
        if (this.parent.visualsHaveText) {
            itemPotionVisual.children.push(new VisualOffset(VisualText.fromTextAndColor(itemPotionName, itemPotionColor), new Coords(0, 0 - this.entityDimension, 0)));
        }
        var itemPotion = new ItemDefn(itemPotionName, null, null, 1, 10, null, // name, appearance, descripton, mass, value, stackSize
        ["Consumable"], // categoryNames
        (universe, world, place, entityUser, entityItem) => // use
         {
            var effectToApply = Effect.Instances().Healing;
            entityUser.effectable().effectAdd(effectToApply);
            var item = entityItem.item();
            entityUser.itemHolder().itemSubtractDefnNameAndQuantity(item.defnName, 1);
            var message = "You use the medicine.";
            return message;
        }, itemPotionVisual);
        return itemPotion;
    }
    shovel() {
        var itemShovelName = "Shovel";
        var itemShovelColor = Color.byName("Gray");
        var itemShovelVisual = new VisualGroup([
            new VisualOffset(VisualRectangle.fromSizeAndColorFill(new Coords(this.entityDimension / 4, this.entityDimension, 0), Color.byName("Brown")), new Coords(0, 0 + this.entityDimension / 2, 0)),
            new VisualPolygon(new Path([
                new Coords(0.5, 1.5, 0),
                new Coords(0, 1.75, 0),
                new Coords(-0.5, 1.5, 0),
                new Coords(-0.5, 1.0, 0),
                new Coords(0.5, 1.0, 0)
            ]).transform(Transform_Scale.fromScalar(this.entityDimension)), itemShovelColor, null)
        ]);
        if (this.parent.visualsHaveText) {
            itemShovelVisual.children.push(new VisualOffset(VisualText.fromTextAndColor(itemShovelName, itemShovelColor), new Coords(0, 0 - this.entityDimension * 2, 0)));
        }
        var itemShovel = new ItemDefn(itemShovelName, null, null, 1, 30, null, ["Wieldable"], this.itemUseEquip, itemShovelVisual);
        return itemShovel;
    }
    speedBoots() {
        var itemSpeedBootsName = "Speed Boots";
        var itemAccessoryColor = Color.byName("Orange");
        var itemSpeedBootsVisual = new VisualGroup([
            new VisualPolygon(new Path([
                new Coords(0, .5, 0),
                new Coords(1, .5, 0),
                new Coords(.5, 0, 0),
                new Coords(.5, -.5, 0),
                new Coords(0, -.5, 0),
            ]).transform(Transform_Scale.fromScalar(this.entityDimension)), itemAccessoryColor, null),
            new VisualPolygon(new Path([
                new Coords(-.1, .5, 0),
                new Coords(-1.1, .5, 0),
                new Coords(-.6, 0, 0),
                new Coords(-.6, -.5, 0),
                new Coords(-.1, -.5, 0),
            ]).transform(Transform_Scale.fromScalar(this.entityDimension)), itemAccessoryColor, null)
        ]);
        if (this.parent.visualsHaveText) {
            itemSpeedBootsVisual.children.push(new VisualOffset(VisualText.fromTextAndColor(itemSpeedBootsName, itemAccessoryColor), new Coords(0, 0 - this.entityDimension * 2, 0)));
        }
        var itemSpeedBoots = new ItemDefn(itemSpeedBootsName, null, null, 10, 30, null, ["Accessory"], this.itemUseEquip, itemSpeedBootsVisual);
        return itemSpeedBoots;
    }
    sword() {
        var itemSwordVisual = this.sword_Visual(Color.byName("GrayLight"));
        var itemSword = new ItemDefn("Sword", null, null, 10, 100, null, ["Wieldable"], this.itemUseEquip, itemSwordVisual);
        return itemSword;
    }
    sword_Visual(bladeColor) {
        var hiltColor = Color.fromRGB(0, .5, .5);
        var itemSwordVisualBladePath = new Path([
            // blade
            new Coords(-0.4, 0.2, 0),
            new Coords(.9, 0.2, 0),
            new Coords(1.1, 0, 0),
            new Coords(.9, -0.2, 0),
            new Coords(-0.4, -0.2, 0),
        ]);
        var itemSwordVisualHiltPath = new Path([
            // hilt
            new Coords(-0.4, -0.5, 0),
            new Coords(-0.8, -0.5, 0),
            new Coords(-0.8, -0.2, 0),
            new Coords(-1.1, -0.2, 0),
            new Coords(-1.1, 0.2, 0),
            new Coords(-0.8, 0.2, 0),
            new Coords(-0.8, 0.5, 0),
            new Coords(-0.4, 0.5, 0)
        ]);
        var transform = new Transform_Multiple([
            Transform_Scale.fromScalar(this.entityDimension),
            new Transform_RotateRight(3) // quarter-turns
        ]);
        var itemSwordVisualBlade = new VisualPolygon //Located
        (itemSwordVisualBladePath.transform(transform), bladeColor, null // colorBorder
        );
        var itemSwordVisualHilt = new VisualPolygon //Located
        (itemSwordVisualHiltPath.transform(transform), hiltColor, null // colorBorder
        );
        var itemSwordVisualBody = new VisualGroup([
            itemSwordVisualBlade, itemSwordVisualHilt
        ]);
        var itemSwordVisual = new VisualGroup([
            itemSwordVisualBody
        ]);
        if (this.parent.visualsHaveText) {
            itemSwordVisual.children.push(new VisualOffset(VisualText.fromTextAndColor("Sword", bladeColor), new Coords(0, 0 - this.entityDimension * 2, 0)));
        }
        return itemSwordVisual;
    }
    swordCold() {
        var bladeColor = Color.byName("Cyan");
        var damageTypeName = "Cold";
        var itemSwordVisual = this.sword_Visual(bladeColor);
        var itemSword = new ItemDefn("Sword" + damageTypeName, null, null, 10, 100, null, ["Wieldable"], this.itemUseEquip, itemSwordVisual);
        return itemSword;
    }
    swordHeat() {
        var bladeColor = Color.byName("Yellow");
        var damageTypeName = "Heat";
        var itemSwordVisual = this.sword_Visual(bladeColor);
        var itemSword = new ItemDefn("Sword" + damageTypeName, null, null, 10, 100, null, ["Wieldable"], this.itemUseEquip, itemSwordVisual);
        return itemSword;
    }
    toolset() {
        var itemToolsetName = "Toolset";
        var itemToolsetColor = Color.byName("Gray");
        var itemToolsetVisual = new VisualGroup([
            new VisualOffset(VisualRectangle.fromSizeAndColorFill(new Coords(this.entityDimension / 4, this.entityDimension, 0), Color.byName("Brown")), new Coords(0, this.entityDimension / 2, 0)),
            VisualRectangle.fromSizeAndColorFill(new Coords(this.entityDimension, this.entityDimension / 2, 0), itemToolsetColor)
        ]);
        if (this.parent.visualsHaveText) {
            itemToolsetVisual.children.push(new VisualOffset(VisualText.fromTextAndColor(itemToolsetName, itemToolsetColor), new Coords(0, 0 - this.entityDimension, 0)));
        }
        var itemToolset = new ItemDefn(itemToolsetName, null, null, 1, 30, null, null, null, itemToolsetVisual);
        return itemToolset;
    }
    torch() {
        var itemTorchName = "Torch";
        var itemTorchColor = Color.byName("Brown");
        var itemTorchVisualBody = VisualRectangle.fromSizeAndColorFill(new Coords(this.entityDimension / 3, this.entityDimension * 1.5, 0), itemTorchColor);
        var itemTorchVisualHead = new VisualEllipse(this.entityDimensionHalf * .65, // semimajorAxis
        this.entityDimensionHalf * .45, .25, // rotationInTurns
        Color.byName("Tan"), null // colorBorder
        );
        var itemTorchVisualFlame = VisualBuilder.Instance().flame(this.entityDimensionHalf * .6);
        var itemTorchVisual = new VisualGroup([
            new VisualOffset(itemTorchVisualBody, Coords.create()),
            new VisualOffset(itemTorchVisualHead, new Coords(0, 0 - this.entityDimension * .75, 0)),
            new VisualOffset(itemTorchVisualFlame, new Coords(0, 0 - this.entityDimension * .7, 0))
        ]);
        if (this.parent.visualsHaveText) {
            itemTorchVisual.children.push(new VisualOffset(VisualText.fromTextAndColor(itemTorchName, itemTorchColor), new Coords(0, 0 - this.entityDimension * 1.5, 0)));
        }
        var itemTorch = new ItemDefn(itemTorchName, null, null, 1, 4, null, // name, appearance, descripton, mass, value, stackSize
        ["Wieldable", "Consumable"], // categoryNames
        null, // use
        itemTorchVisual);
        return itemTorch;
    }
    walkieTalkie() {
        var itemWalkieTalkie = new ItemDefn("Walkie-Talkie", null, null, 2, 10, null, [], // categoryNames
        (universe, world, place, entityUser, entityItem) => // use
         {
            return "There is no response but static.";
        }, new VisualNone() // todo
        );
        return itemWalkieTalkie;
    }
    weight() {
        var itemWeightName = "Weight";
        var itemWeightColor = Color.byName("Blue");
        var itemWeightVisual = new VisualGroup([
            new VisualOffset(new VisualArc(this.entityDimensionHalf, // radiusOuter
            this.entityDimensionHalf / 2, // radiusInner
            new Coords(-1, 0, 0).normalize(), // directionMin
            .5, // angleSpannedInTurns
            itemWeightColor, null), new Coords(0, -1, 0).multiplyScalar(this.entityDimensionHalf)),
            new VisualPolygon(new Path([
                new Coords(-.75, .5, 0),
                new Coords(-.5, -.5, 0),
                new Coords(.5, -.5, 0),
                new Coords(.75, .5, 0)
            ]).transform(new Transform_Scale(new Coords(1, 1, 1).multiplyScalar(this.entityDimension))), itemWeightColor, null)
        ]);
        if (this.parent.visualsHaveText) {
            itemWeightVisual.children.push(new VisualOffset(VisualText.fromTextAndColor(itemWeightName, itemWeightColor), new Coords(0, 0 - this.entityDimension * 2, 0)));
        }
        var itemWeight = new ItemDefn(itemWeightName, null, null, 2000, 5, null, null, null, itemWeightVisual);
        return itemWeight;
    }
}
