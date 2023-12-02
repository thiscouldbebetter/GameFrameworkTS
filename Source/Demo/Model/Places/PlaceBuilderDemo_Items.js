"use strict";
class PlaceBuilderDemo_Items {
    constructor(parent) {
        this.parent = parent;
        this.entityDimension = this.parent.entityDimension;
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
    itemUseEquip(uwpe) {
        var entityUser = uwpe.entity;
        var equipmentUser = entityUser.equipmentUser();
        equipmentUser.equipEntityWithItem(uwpe);
    }
    // Items.
    armor() {
        var itemArmorName = "Armor";
        var itemArmorColor = Color.byName("GreenDark");
        var path = new Path([
            Coords.fromXY(0, 0.5),
            Coords.fromXY(-.5, 0),
            Coords.fromXY(-.5, -.5),
            Coords.fromXY(.5, -.5),
            Coords.fromXY(.5, 0),
        ]).transform(Transform_Scale.fromScalar(this.entityDimension));
        var itemArmorVisual = new VisualGroup([
            VisualPolygon.fromPathAndColorFill(path, itemArmorColor)
        ]);
        this.parent.textWithColorAddToVisual(itemArmorName, itemArmorColor, itemArmorVisual);
        var itemArmor = new ItemDefn(itemArmorName, null, null, 50, 30, null, ["Armor"], (uwpe) => this.itemUseEquip(uwpe), itemArmorVisual, null);
        return itemArmor;
    }
    armorEnhanced() {
        var itemArmorName = "Enhanced Armor";
        var itemArmorColor = Color.byName("GreenDark");
        var path = new Path([
            Coords.fromXY(0, 0.5),
            Coords.fromXY(-.5, 0),
            Coords.fromXY(-.5, -.5),
            Coords.fromXY(.5, -.5),
            Coords.fromXY(.5, 0),
        ]).transform(Transform_Scale.fromScalar(this.entityDimension));
        var itemArmorVisual = new VisualGroup([
            VisualPolygon.fromPathAndColorFill(path, itemArmorColor)
        ]);
        if (this.parent.visualsHaveText) {
            itemArmorVisual.children.push(new VisualOffset(Coords.fromXY(0, 0 - this.entityDimension), VisualText.fromTextImmediateHeightAndColor(itemArmorName, this.entityDimension, itemArmorColor)));
        }
        var itemArmor = new ItemDefn(itemArmorName, null, null, 50, 30, null, ["Armor"], (uwpe) => this.itemUseEquip(uwpe), itemArmorVisual, null);
        return itemArmor;
    }
    arrow() {
        var itemArrowName = "Arrow";
        var itemArrowColor = new Color(null, null, [0, .5, .5, 1]);
        var itemArrowVisualShaft = new VisualLine(Coords.fromXY(-5, 0), Coords.fromXY(5, 0), Color.byName("Brown"), 1 // lineThickness
        );
        var pathHead = new Path([
            Coords.fromXY(1, 0),
            Coords.fromXY(0.5, .25),
            Coords.fromXY(0.5, -.25),
        ]).transform(Transform_Scale.fromScalar(this.entityDimension));
        var itemArrowVisualHead = VisualPolygon.fromPathAndColorFill(pathHead, itemArrowColor);
        var pathTail = new Path([
            Coords.create(),
            Coords.fromXY(-.5, .25),
            Coords.fromXY(-.75, .25),
            Coords.fromXY(-.5, 0),
            Coords.fromXY(-.75, -.25),
            Coords.fromXY(-.5, -.25),
        ]).transform(Transform_Scale.fromScalar(this.entityDimension));
        var itemArrowVisualTail = VisualPolygon.fromPathAndColorFill(pathTail, Color.byName("White"));
        var itemArrowVisual = new VisualGroup([
            itemArrowVisualTail,
            itemArrowVisualShaft,
            itemArrowVisualHead
        ]);
        if (this.parent.visualsHaveText) {
            itemArrowVisual.children.push(new VisualOffset(Coords.fromXY(0, 0 - this.entityDimension * 1.5), VisualText.fromTextImmediateHeightAndColor(itemArrowName, this.entityDimension, itemArrowColor)));
        }
        var itemArrow = ItemDefn.fromNameMassValueAndVisual(itemArrowName, .05, 5, itemArrowVisual);
        return itemArrow;
    }
    bomb() {
        var itemBombName = "Bomb";
        var itemBombColor = Color.byName("BlueDark");
        var itemBombVisual = new VisualGroup([
            // fuse
            new VisualOffset(Coords.fromXY(0, -1).multiplyScalar(this.entityDimensionHalf), VisualRectangle.fromSizeAndColorFill(new Coords(.2, 1, 1).multiplyScalar(this.entityDimensionHalf), Color.byName("Tan"))),
            // body
            VisualCircle.fromRadiusAndColorFill(this.entityDimensionHalf, itemBombColor),
            // highlight
            new VisualOffset(Coords.fromXY(-this.entityDimensionHalf / 3, -this.entityDimensionHalf / 3), VisualCircle.fromRadiusAndColorFill(this.entityDimensionHalf * .3, Color.byName("Blue")))
        ]);
        if (this.parent.visualsHaveText) {
            itemBombVisual.children.push(new VisualOffset(Coords.fromXY(0, 0 - this.entityDimension * 2), VisualText.fromTextImmediateHeightAndColor(itemBombName, this.entityDimension, itemBombColor)));
        }
        var itemBomb = new ItemDefn(itemBombName, null, null, 5, 10, null, ["Wieldable"], (uwpe) => this.itemUseEquip(uwpe), itemBombVisual, null);
        return itemBomb;
    }
    book() {
        var itemBookName = "Book";
        var itemBookColor = Color.byName("Blue");
        var itemBookVisual = new VisualGroup([
            VisualRectangle.fromSizeAndColorFill(Coords.fromXY(1, 1.25).multiplyScalar(this.entityDimension), itemBookColor),
            new VisualOffset(Coords.fromXY(.4, 0).multiplyScalar(this.entityDimension), VisualRectangle.fromSizeAndColorFill(Coords.fromXY(.1, 1.1).multiplyScalar(this.entityDimension), Color.byName("White")))
        ]);
        if (this.parent.visualsHaveText) {
            itemBookVisual.children.push(new VisualOffset(Coords.fromXY(0, 0 - this.entityDimension * 1.5), VisualText.fromTextImmediateHeightAndColor(itemBookName, this.entityDimension, itemBookColor)));
        }
        var itemBookUse = (uwpe) => // use
         {
            var universe = uwpe.universe;
            var venuePrev = universe.venueCurrent();
            var back = () => universe.venueTransitionTo(venuePrev);
            var text = "Fourscore and seven years ago, our fathers brought forth upon this continent "
                + "a new nation, conceived in liberty, and dedicated to the proposition that "
                + " all men are created equal. ";
            var size = universe.display.sizeInPixels.clone();
            var fontHeight = 10;
            var fontNameAndHeight = FontNameAndHeight.fromHeightInPixels(fontHeight);
            var textarea = new ControlTextarea("textareaContents", size.clone().half().half(), size.clone().half(), DataBinding.fromContext(text), fontNameAndHeight, DataBinding.fromFalseWithContext(text) // isEnabled
            );
            var button = new ControlButton("buttonDone", Coords.fromXY(size.x / 4, 3 * size.y / 4 + fontHeight), Coords.fromXY(size.x / 2, fontHeight * 2), "Done", fontNameAndHeight, true, // hasBorder
            DataBinding.fromTrue(), // isEnabled
            back, // click
            false // canBeHeldDown
            );
            var container = new ControlContainer("containerBook", Coords.create(), size.clone(), [textarea, button], // children
            [
                new Action(ControlActionNames.Instances().ControlCancel, back),
                new Action(ControlActionNames.Instances().ControlConfirm, back)
            ], null);
            var venueNext = container.toVenue();
            universe.venueTransitionTo(venueNext);
            return "";
        };
        var itemBook = new ItemDefn(itemBookName, null, null, 1, 10, null, // name, appearance, descripton, mass, value, stackSize
        null, // categoryNames
        itemBookUse, itemBookVisual, null);
        return itemBook;
    }
    bow() {
        var itemBowName = "Bow";
        var itemBowColor = Color.byName("Brown");
        var itemBowVisualString = VisualPolygon.fromPathAndColorFill(new Path([
            Coords.fromXY(0, -this.entityDimension),
            Coords.fromXY(1, -this.entityDimension),
            Coords.fromXY(1, this.entityDimension),
            Coords.fromXY(0, this.entityDimension),
        ]), Color.byName("White"));
        var itemBowVisualBody = new VisualArc(this.entityDimension, // radiusOuter
        this.entityDimension - 3, // radiusInner
        Coords.fromXY(0, -1), // directionMin
        .5, // angleSpannedInTurns
        itemBowColor, null);
        var itemBowVisual = new VisualGroup([
            itemBowVisualString,
            itemBowVisualBody
        ]);
        if (this.parent.visualsHaveText) {
            itemBowVisual.children.push(new VisualOffset(Coords.fromXY(0, 0 - this.entityDimension * 2), VisualText.fromTextImmediateHeightAndColor(itemBowName, this.entityDimension, itemBowColor)));
        }
        var itemBow = new ItemDefn(itemBowName, null, null, 5, 100, null, ["Wieldable"], (uwpe) => this.itemUseEquip(uwpe), itemBowVisual, null);
        return itemBow;
    }
    bread() {
        var itemBreadName = "Bread";
        var itemBreadColor = Color.byName("Orange");
        var itemBreadVisualCut = new VisualEllipse(this.entityDimension * .15, // semimajorAxis
        this.entityDimensionHalf * .15, .25, // rotationInTurns
        Color.byName("Tan"), null, // colorBorder
        false // shouldUseEntityOrientation
        );
        var itemBreadVisual = new VisualGroup([
            new VisualEllipse(this.entityDimensionHalf * 1.5, // semimajorAxis
            this.entityDimensionHalf * .75, 0, // rotationInTurns
            itemBreadColor, null, // colorBorder
            false // shouldUseEntityOrientation
            ),
            itemBreadVisualCut,
            new VisualOffset(Coords.fromXY(-this.entityDimensionHalf * 0.75, 0), itemBreadVisualCut),
            new VisualOffset(Coords.fromXY(this.entityDimensionHalf * 0.75, 0), itemBreadVisualCut)
        ]);
        if (this.parent.visualsHaveText) {
            itemBreadVisual.children.push(new VisualOffset(Coords.fromXY(0, 0 - this.entityDimension * 1.5), VisualText.fromTextImmediateHeightAndColor(itemBreadName, this.entityDimension, itemBreadColor)));
        }
        var itemBread = new ItemDefn(itemBreadName, null, null, 1, 4, null, // name, appearance, descripton, mass, value, stackSize
        ["Consumable"], // categoryNames
        (uwpe) => // use
         {
            var entityUser = uwpe.entity;
            var entityItem = uwpe.entity2;
            entityUser.starvable().satietyAdd(10);
            var item = entityItem.item();
            var itemHolder = entityUser.itemHolder();
            itemHolder.itemSubtractDefnNameAndQuantity(item.defnName, 1);
            itemHolder.statusMessage += "You eat the bread.";
        }, itemBreadVisual, null // toEntity
        );
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
            itemCoinVisual.children.push(new VisualOffset(Coords.fromXY(0, 0 - this.entityDimension), VisualText.fromTextImmediateHeightAndColor(itemCoinName, this.entityDimension, itemCoinColor)));
        }
        var itemCoin = ItemDefn.fromNameMassValueAndVisual(itemCoinName, .01, 1, itemCoinVisual);
        return itemCoin;
    }
    crystal() {
        var itemCrystalName = "Crystal";
        var itemCrystalColor = Color.byName("Cyan");
        var itemCrystalVisual = new VisualGroup([
            VisualPolygon.fromPathAndColors(new Path([
                Coords.fromXY(1, 0),
                Coords.fromXY(0, 1),
                Coords.fromXY(-1, 0),
                Coords.fromXY(0, -1)
            ]).transform(new Transform_Scale(Coords.ones().multiplyScalar(this.entityDimension / 2))), itemCrystalColor, Color.byName("White")),
            VisualPolygon.fromPathAndColorFill(new Path([
                Coords.fromXY(1, 0),
                Coords.fromXY(0, 1),
                Coords.fromXY(-1, 0),
                Coords.fromXY(0, -1)
            ]).transform(new Transform_Scale(Coords.ones().multiplyScalar(this.entityDimension / 4))), Color.byName("White"))
        ]);
        if (this.parent.visualsHaveText) {
            itemCrystalVisual.children.push(new VisualOffset(Coords.fromXY(0, 0 - this.entityDimension), VisualText.fromTextImmediateHeightAndColor(itemCrystalName, this.entityDimension, itemCrystalColor)));
        }
        var itemCrystal = ItemDefn.fromNameMassValueAndVisual(itemCrystalName, .1, 1, itemCrystalVisual);
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
        /*
        // This causes tainted canvas errors on deserialization.
        var itemDoughnutVisual = new VisualBuffered
        (
            Coords.fromXY(1, 1).multiplyScalar(this.entityDimension * 1.2),
            itemDoughnutVisualBody
        )
        */
        var itemDoughnutVisual = itemDoughnutVisualBody;
        if (this.parent.visualsHaveText) {
            itemDoughnutVisualBody.children.push(new VisualOffset(Coords.fromXY(0, 0 - this.entityDimension * 2), VisualText.fromTextImmediateHeightAndColor(itemDoughnutName, this.entityDimension, itemDoughnutColor)));
        }
        var itemDoughnut = new ItemDefn(itemDoughnutName, null, null, 1, 4, null, // name, appearance, descripton, mass, value, stackSize
        ["Consumable"], // categoryNames
        (uwpe) => // use
         {
            var entityUser = uwpe.entity;
            var entityItem = uwpe.entity2;
            entityUser.starvable().satietyAdd(2);
            var item = entityItem.item();
            var itemHolder = entityUser.itemHolder();
            itemHolder.itemSubtractDefnNameAndQuantity(item.defnName, 1);
            itemHolder.statusMessage = "You eat the doughnut.";
        }, itemDoughnutVisual, null // toEntity
        );
        return itemDoughnut;
    }
    flower() {
        var itemFlowerName = "Flower";
        var colorFlower = Color.byName("Pink");
        var itemFlowerVisual = new VisualGroup([
            new VisualOffset(Coords.fromXY(.5, 1.75).multiplyScalar(this.entityDimensionHalf), new VisualArc(this.entityDimensionHalf * 2, // radiusOuter
            this.entityDimensionHalf * 2 - 2, // radiusInner
            Coords.fromXY(-1, 1).normalize(), // directionMin
            .25, // angleSpannedInTurns
            Color.byName("GreenDark"), null)),
            VisualPolygon.fromPathAndColors(new Path([
                Coords.fromXY(1, 0),
                Coords.fromXY(.3, .3),
                Coords.fromXY(0, 1),
                Coords.fromXY(-.3, .3),
                Coords.fromXY(-1, 0),
                Coords.fromXY(-.3, -.3),
                Coords.fromXY(0, -1),
                Coords.fromXY(.3, -.3)
            ]).transform(new Transform_Scale(Coords.ones().multiplyScalar(this.entityDimensionHalf))), colorFlower, Color.byName("Red"))
        ]);
        if (this.parent.visualsHaveText) {
            itemFlowerVisual.children.push(new VisualOffset(Coords.fromXY(0, 0 - this.entityDimensionHalf * 2), VisualText.fromTextImmediateHeightAndColor(itemFlowerName, this.entityDimension, colorFlower)));
        }
        var itemFlower = ItemDefn.fromNameMassValueAndVisual(itemFlowerName, .01, 1, itemFlowerVisual);
        return itemFlower;
    }
    fruit() {
        var itemFruitName = "Fruit";
        var itemFruitColor = Color.byName("Orange");
        var itemFruitVisual = new VisualGroup([
            VisualCircle.fromRadiusAndColorFill(this.entityDimensionHalf, itemFruitColor),
            new VisualOffset(Coords.fromXY(-this.entityDimensionHalf / 2, -this.entityDimensionHalf / 2), VisualCircle.fromRadiusAndColorFill(this.entityDimensionHalf * .25, Color.byName("White")))
        ]);
        if (this.parent.visualsHaveText) {
            itemFruitVisual.children.push(new VisualOffset(Coords.fromXY(0, 0 - this.entityDimension), VisualText.fromTextImmediateHeightAndColor(itemFruitName, this.entityDimension, itemFruitColor)));
        }
        var itemFruit = new ItemDefn(itemFruitName, null, null, .25, 6, null, // name, appearance, descripton, mass, value, stackSize
        ["Consumable"], // categoryNames
        (uwpe) => // use
         {
            var entityUser = uwpe.entity;
            var entityItem = uwpe.entity2;
            entityUser.starvable().satietyAdd(5);
            var item = entityItem.item();
            var itemHolder = entityUser.itemHolder();
            itemHolder.itemSubtractDefnNameAndQuantity(item.defnName, 1);
            itemHolder.statusMessage = "You eat the fruit.";
        }, itemFruitVisual, null // toEntity
        );
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
                    Coords.fromXY(.3, 1).multiplyScalar(this.entityDimension * 2) // sizeScaled
                ),
                Coords.fromXY(-.075, -1.2).multiplyScalar(this.entityDimension)
            ),
            */
            new VisualImageScaled(Coords.fromXY(1, 1).multiplyScalar(this.entityDimension * 2), // sizeScaled
            new VisualImageFromLibrary("Grass")),
        ]);
        if (this.parent.visualsHaveText) {
            itemGrassVisual.children.push(new VisualOffset(Coords.fromXY(0, 0 - this.entityDimensionHalf * 3), VisualText.fromTextImmediateHeightAndColor(itemGrassName, this.entityDimension, Color.byName("GreenDark"))));
        }
        var itemGrass = ItemDefn.fromNameMassValueAndVisual(itemGrassName, .01, 1, itemGrassVisual);
        return itemGrass;
    }
    heart() {
        var entityDimensionQuarter = this.entityDimensionHalf / 2;
        var itemHeartName = "Heart";
        var itemHeartColor = Color.byName("Red");
        var itemHeartVisual = new VisualGroup([
            new VisualOffset(Coords.fromXY(-entityDimensionQuarter, 0), new VisualArc(entityDimensionQuarter, // radiusOuter
            0, // radiusInner
            Coords.fromXY(-1, 0), // directionMin
            .5, // angleSpannedInTurns
            itemHeartColor, null)),
            new VisualOffset(Coords.fromXY(entityDimensionQuarter, 0), new VisualArc(entityDimensionQuarter, // radiusOuter
            0, // radiusInner
            Coords.fromXY(-1, 0), // directionMin
            .5, // angleSpannedInTurns
            itemHeartColor, null)),
            VisualPolygon.fromPathAndColorFill(new Path([
                Coords.fromXY(-1.1, 0),
                Coords.fromXY(1.1, 0),
                Coords.fromXY(0, 1.3),
            ]).transform(Transform_Scale.fromScalar(this.entityDimensionHalf)), itemHeartColor)
        ]);
        if (this.parent.visualsHaveText) {
            itemHeartVisual.children.push(new VisualOffset(Coords.fromXY(0, 0 - this.entityDimension * 1.5), VisualText.fromTextImmediateHeightAndColor(itemHeartName, this.entityDimension, itemHeartColor)));
        }
        var itemHeartVisualShifted = new VisualOffset(Coords.fromXY(0, -entityDimensionQuarter), itemHeartVisual);
        var itemHeart = ItemDefn.fromNameMassValueAndVisual(itemHeartName, 10, 1, itemHeartVisualShifted);
        return itemHeart;
    }
    iron() {
        var itemIronName = "Iron";
        var itemIronColor = Color.byName("Gray");
        var itemIronVisual = new VisualGroup([
            VisualPolygon.fromPathAndColorFill(new Path([
                Coords.fromXY(-0.5, 0.4),
                Coords.fromXY(0.5, 0.4),
                Coords.fromXY(0.2, -0.4),
                Coords.fromXY(-0.2, -0.4),
            ]).transform(Transform_Scale.fromScalar(this.entityDimension)), itemIronColor)
        ]);
        if (this.parent.visualsHaveText) {
            itemIronVisual.children.push(new VisualOffset(Coords.fromXY(0, 0 - this.entityDimension), VisualText.fromTextImmediateHeightAndColor(itemIronName, this.entityDimension, itemIronColor)));
        }
        var itemIron = ItemDefn.fromNameMassValueAndVisual(itemIronName, 10, 5, itemIronVisual);
        return itemIron;
    }
    ironOre() {
        var itemIronOreName = "Iron Ore";
        var itemIronOreColor = Color.byName("Gray");
        var itemIronOreVisual = new VisualGroup([
            new VisualArc(this.entityDimension / 2, // radiusOuter
            0, // radiusInner
            Coords.fromXY(-1, 0), // directionMin
            .5, // angleSpannedInTurns
            itemIronOreColor, null)
        ]);
        if (this.parent.visualsHaveText) {
            itemIronOreVisual.children.push(new VisualOffset(Coords.fromXY(0, 0 - this.entityDimension * 1.5), VisualText.fromTextImmediateHeightAndColor(itemIronOreName, this.entityDimension, itemIronOreColor)));
        }
        var itemIronOre = ItemDefn.fromNameMassValueAndVisual(itemIronOreName, 10, 1, itemIronOreVisual);
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
            new VisualOffset(Coords.fromXY(this.entityDimensionHalf, 0), new VisualPolars([
                new Polar(0, this.entityDimensionHalf, 0),
                new Polar(.25, this.entityDimensionHalf / 2, 0)
            ], itemKeyColor, this.entityDimensionHalf / 2 // lineThickness
            )),
        ]);
        if (this.parent.visualsHaveText) {
            itemKeyVisual.children.push(new VisualOffset(Coords.fromXY(0, 0 - this.entityDimension * 2), VisualText.fromTextImmediateHeightAndColor(itemKeyName, this.entityDimension, itemKeyColor)));
        }
        var itemKey = ItemDefn.fromNameMassValueAndVisual(itemKeyName, .1, 5, itemKeyVisual);
        return itemKey;
    }
    log() {
        var itemLogName = "Log";
        var itemLogColor = Color.byName("Brown");
        var itemLogVisual = new VisualGroup([
            new VisualOffset(Coords.fromXY(this.entityDimension, 0), VisualCircle.fromRadiusAndColorFill(this.entityDimensionHalf, itemLogColor)),
            VisualRectangle.fromSizeAndColorFill(Coords.fromXY(this.entityDimension * 2, this.entityDimension), itemLogColor),
            new VisualOffset(Coords.fromXY(-this.entityDimension, 0), VisualCircle.fromRadiusAndColorFill(this.entityDimensionHalf, Color.byName("Tan")))
        ]);
        if (this.parent.visualsHaveText) {
            itemLogVisual.children.push(new VisualOffset(Coords.fromXY(0, 0 - this.entityDimension), VisualText.fromTextImmediateHeightAndColor(itemLogName, this.entityDimension, itemLogColor)));
        }
        var itemLog = ItemDefn.fromNameMassValueAndVisual(itemLogName, 10, 1, itemLogVisual);
        return itemLog;
    }
    meat() {
        var itemMeatName = "Meat";
        var itemMeatColor = Color.byName("Red");
        var itemMeatVisual = new VisualGroup([
            VisualCircle.fromRadiusAndColorFill(this.entityDimensionHalf, itemMeatColor),
            new VisualCircle(this.entityDimensionHalf * .9, null, Color.byName("White"), null),
            new VisualOffset(Coords.fromXY(this.entityDimensionHalf * .2, 0), new VisualCircle(this.entityDimensionHalf * .2, Color.byName("Pink"), Color.byName("White"), null // ?
            ))
        ]);
        if (this.parent.visualsHaveText) {
            itemMeatVisual.children.push(new VisualOffset(Coords.fromXY(0, 0 - this.entityDimension * 1.5), VisualText.fromTextImmediateHeightAndColor(itemMeatName, this.entityDimension, itemMeatColor)));
        }
        var itemMeat = new ItemDefn(itemMeatName, null, null, 1, 10, null, // name, appearance, descripton, mass, value, stackSize
        ["Consumable"], // categoryNames
        (uwpe) => // use
         {
            var entityUser = uwpe.entity;
            var entityItem = uwpe.entity2;
            entityUser.starvable().satietyAdd(20);
            var item = entityItem.item();
            var itemHolder = entityUser.itemHolder();
            itemHolder.itemSubtractDefnNameAndQuantity(item.defnName, 1);
            itemHolder.statusMessage = "You eat the meat.";
        }, itemMeatVisual, null);
        return itemMeat;
    }
    medicine() {
        var itemMedicineName = "Medicine";
        var itemMedicineColor = Color.byName("Red");
        var itemMedicineVisual = new VisualGroup([
            VisualRectangle.fromSizeAndColorFill(Coords.fromXY(1, 1).multiplyScalar(this.entityDimension), Color.byName("White")),
            VisualPolygon.fromPathAndColorFill(new Path([
                Coords.fromXY(-0.5, -0.2),
                Coords.fromXY(-0.2, -0.2),
                Coords.fromXY(-0.2, -0.5),
                Coords.fromXY(0.2, -0.5),
                Coords.fromXY(0.2, -0.2),
                Coords.fromXY(0.5, -0.2),
                Coords.fromXY(0.5, 0.2),
                Coords.fromXY(0.2, 0.2),
                Coords.fromXY(0.2, 0.5),
                Coords.fromXY(-0.2, 0.5),
                Coords.fromXY(-0.2, 0.2),
                Coords.fromXY(-0.5, 0.2)
            ]).transform(Transform_Scale.fromScalar(this.entityDimension)), itemMedicineColor)
        ]);
        this.parent.textWithColorAddToVisual(itemMedicineName, itemMedicineColor, itemMedicineVisual);
        var itemMedicine = new ItemDefn(itemMedicineName, null, null, 1, 10, null, // name, appearance, descripton, mass, value, stackSize
        ["Consumable"], // categoryNames
        (uwpe) => // use
         {
            var entityUser = uwpe.entity;
            var entityItem = uwpe.entity2;
            var effectToApply = Effect.Instances().Healing;
            entityUser.effectable().effectAdd(effectToApply);
            var item = entityItem.item();
            var itemHolder = entityUser.itemHolder();
            itemHolder.itemSubtractDefnNameAndQuantity(item.defnName, 1);
            itemHolder.statusMessage = "You use the medicine.";
        }, itemMedicineVisual, null);
        return itemMedicine;
    }
    mushroom() {
        var itemMushroomName = "Mushroom";
        var colorStem = Color.byName("Gray");
        var colorCap = Color.byName("Violet");
        var itemMushroomVisual = new VisualGroup([
            new VisualOffset(Coords.fromXY(0, -this.entityDimensionHalf / 2), new VisualArc(this.entityDimensionHalf, // radiusOuter
            0, // radiusInner
            Coords.fromXY(-1, 0), // directionMin
            .5, // angleSpannedInTurns
            colorCap, null)),
            new VisualOffset(Coords.zeroes(), VisualRectangle.fromSizeAndColorFill(Coords.fromXY(this.entityDimensionHalf / 2, this.entityDimensionHalf), colorStem))
        ]);
        this.parent.textWithColorAddToVisual(itemMushroomName, colorCap, itemMushroomVisual);
        var itemMushroom = ItemDefn.fromNameMassValueAndVisual(itemMushroomName, .01, 1, itemMushroomVisual);
        return itemMushroom;
    }
    pick() {
        var itemPickName = "Pick";
        var itemPickColor = Color.byName("Gray");
        var itemPickVisual = new VisualGroup([
            new VisualOffset(Coords.fromXY(0, 0 - this.entityDimension / 2), VisualRectangle.fromSizeAndColorFill(Coords.fromXY(this.entityDimension / 4, this.entityDimension), Color.byName("Brown"))),
            VisualPolygon.fromPathAndColorFill(new Path([
                Coords.fromXY(0.75, -1),
                Coords.fromXY(-0.75, -1),
                Coords.fromXY(-0.5, -1.4),
                Coords.fromXY(0.5, -1.4)
            ]).transform(Transform_Scale.fromScalar(this.entityDimension)), itemPickColor)
        ]);
        if (this.parent.visualsHaveText) {
            itemPickVisual.children.push(new VisualOffset(Coords.fromXY(0, 0 - this.entityDimension * 2), VisualText.fromTextImmediateHeightAndColor(itemPickName, this.entityDimension, itemPickColor)));
        }
        var itemPick = new ItemDefn(itemPickName, null, null, 1, 30, null, ["Wieldable"], (uwpe) => this.itemUseEquip(uwpe), itemPickVisual, null);
        return itemPick;
    }
    potion() {
        // todo - Same as medicine right now.
        var itemPotionName = "Potion";
        var itemPotionColor = Color.byName("Red");
        var itemPotionVisual = new VisualGroup([
            VisualRectangle.fromSizeAndColorFill(Coords.fromXY(1, 1).multiplyScalar(this.entityDimension), Color.byName("White")),
            VisualPolygon.fromPathAndColorFill(new Path([
                Coords.fromXY(-0.5, -0.2),
                Coords.fromXY(-0.2, -0.2),
                Coords.fromXY(-0.2, -0.5),
                Coords.fromXY(0.2, -0.5),
                Coords.fromXY(0.2, -0.2),
                Coords.fromXY(0.5, -0.2),
                Coords.fromXY(0.5, 0.2),
                Coords.fromXY(0.2, 0.2),
                Coords.fromXY(0.2, 0.5),
                Coords.fromXY(-0.2, 0.5),
                Coords.fromXY(-0.2, 0.2),
                Coords.fromXY(-0.5, 0.2)
            ]).transform(Transform_Scale.fromScalar(this.entityDimension)), itemPotionColor)
        ]);
        if (this.parent.visualsHaveText) {
            itemPotionVisual.children.push(new VisualOffset(Coords.fromXY(0, 0 - this.entityDimension), VisualText.fromTextImmediateHeightAndColor(itemPotionName, this.entityDimension, itemPotionColor)));
        }
        var itemPotion = new ItemDefn(itemPotionName, null, null, 1, 10, null, // name, appearance, descripton, mass, value, stackSize
        ["Consumable"], // categoryNames
        (uwpe) => // use
         {
            var entityUser = uwpe.entity;
            var entityItem = uwpe.entity2;
            var effectToApply = Effect.Instances().Healing;
            entityUser.effectable().effectAdd(effectToApply);
            var item = entityItem.item();
            entityUser.itemHolder().itemSubtractDefnNameAndQuantity(item.defnName, 1);
            var message = "You use the medicine.";
            return message;
        }, itemPotionVisual, null);
        return itemPotion;
    }
    shovel() {
        var itemShovelName = "Shovel";
        var itemShovelColor = Color.byName("Gray");
        var itemShovelVisual = new VisualGroup([
            new VisualOffset(Coords.fromXY(0, 0 + this.entityDimension / 2), VisualRectangle.fromSizeAndColorFill(Coords.fromXY(this.entityDimension / 4, this.entityDimension), Color.byName("Brown"))),
            VisualPolygon.fromPathAndColorFill(new Path([
                Coords.fromXY(0.5, 1.5),
                Coords.fromXY(0, 1.75),
                Coords.fromXY(-0.5, 1.5),
                Coords.fromXY(-0.5, 1.0),
                Coords.fromXY(0.5, 1.0)
            ]).transform(Transform_Scale.fromScalar(this.entityDimension)), itemShovelColor)
        ]);
        this.parent.textWithColorAddToVisual(itemShovelName, itemShovelColor, itemShovelVisual);
        var itemShovel = new ItemDefn(itemShovelName, null, null, 1, 30, null, ["Wieldable"], (uwpe) => this.itemUseEquip(uwpe), itemShovelVisual, null);
        return itemShovel;
    }
    speedBoots() {
        var itemSpeedBootsName = "Speed Boots";
        var itemAccessoryColor = Color.byName("Orange");
        var itemSpeedBootsVisual = new VisualGroup([
            VisualPolygon.fromPathAndColorFill(new Path([
                Coords.fromXY(0, .5),
                Coords.fromXY(1, .5),
                Coords.fromXY(.5, 0),
                Coords.fromXY(.5, -.5),
                Coords.fromXY(0, -.5),
            ]).transform(Transform_Scale.fromScalar(this.entityDimension)), itemAccessoryColor),
            VisualPolygon.fromPathAndColorFill(new Path([
                Coords.fromXY(-.1, .5),
                Coords.fromXY(-1.1, .5),
                Coords.fromXY(-.6, 0),
                Coords.fromXY(-.6, -.5),
                Coords.fromXY(-.1, -.5),
            ]).transform(Transform_Scale.fromScalar(this.entityDimension)), itemAccessoryColor)
        ]);
        if (this.parent.visualsHaveText) {
            itemSpeedBootsVisual.children.push(new VisualOffset(Coords.fromXY(0, 0 - this.entityDimension * 2), VisualText.fromTextImmediateHeightAndColor(itemSpeedBootsName, this.entityDimension, itemAccessoryColor)));
        }
        var itemSpeedBoots = new ItemDefn(itemSpeedBootsName, null, null, 10, 30, null, ["Accessory"], (uwpe) => this.itemUseEquip(uwpe), itemSpeedBootsVisual, null);
        return itemSpeedBoots;
    }
    sword() {
        var itemSwordVisual = this.sword_Visual(Color.byName("GrayLight"));
        var itemSword = new ItemDefn("Sword", null, null, 10, 100, null, ["Wieldable"], (uwpe) => this.itemUseEquip(uwpe), itemSwordVisual, null);
        return itemSword;
    }
    sword_Visual(bladeColor) {
        var hiltColor = Color.fromRGB(0, .5, .5);
        var itemSwordVisualBladePath = new Path([
            // blade
            Coords.fromXY(-0.4, 0.2),
            Coords.fromXY(.9, 0.2),
            Coords.fromXY(1.1, 0),
            Coords.fromXY(.9, -0.2),
            Coords.fromXY(-0.4, -0.2),
        ]);
        var itemSwordVisualHiltPath = new Path([
            // hilt
            Coords.fromXY(-0.4, -0.5),
            Coords.fromXY(-0.8, -0.5),
            Coords.fromXY(-0.8, -0.2),
            Coords.fromXY(-1.1, -0.2),
            Coords.fromXY(-1.1, 0.2),
            Coords.fromXY(-0.8, 0.2),
            Coords.fromXY(-0.8, 0.5),
            Coords.fromXY(-0.4, 0.5)
        ]);
        var transform = new Transform_Multiple([
            Transform_Scale.fromScalar(this.entityDimension),
            new Transform_RotateRight(3) // quarter-turns
        ]);
        var itemSwordVisualBlade = new VisualPolygon //Located
        (itemSwordVisualBladePath.transform(transform), bladeColor, null, // colorBorder
        true // shouldUseEntityOrientation
        );
        var itemSwordVisualHilt = new VisualPolygon(itemSwordVisualHiltPath.transform(transform), hiltColor, null, true // shouldUseEntityOrientation
        );
        var itemSwordVisualBody = new VisualGroup([
            itemSwordVisualBlade, itemSwordVisualHilt
        ]);
        var itemSwordVisual = new VisualGroup([
            itemSwordVisualBody
        ]);
        if (this.parent.visualsHaveText) {
            itemSwordVisual.children.push(new VisualOffset(Coords.fromXY(0, 0 - this.entityDimension * 2), VisualText.fromTextImmediateHeightAndColor("Sword", this.entityDimension, bladeColor)));
        }
        return itemSwordVisual;
    }
    swordCold() {
        var bladeColor = Color.byName("Cyan");
        var damageTypeName = "Cold";
        var itemSwordVisual = this.sword_Visual(bladeColor);
        var itemSword = new ItemDefn("Sword" + damageTypeName, null, null, 10, 100, null, ["Wieldable"], (uwpe) => this.itemUseEquip(uwpe), itemSwordVisual, null);
        return itemSword;
    }
    swordHeat() {
        var bladeColor = Color.byName("Yellow");
        var damageTypeName = "Heat";
        var itemSwordVisual = this.sword_Visual(bladeColor);
        var itemSword = new ItemDefn("Sword" + damageTypeName, null, null, 10, 100, null, ["Wieldable"], (uwpe) => this.itemUseEquip(uwpe), itemSwordVisual, null);
        return itemSword;
    }
    toolset() {
        var itemToolsetName = "Toolset";
        var itemToolsetColor = Color.byName("Gray");
        var itemToolsetVisual = new VisualGroup([
            new VisualOffset(Coords.fromXY(0, this.entityDimension / 2), VisualRectangle.fromSizeAndColorFill(Coords.fromXY(this.entityDimension / 4, this.entityDimension), Color.byName("Brown"))),
            VisualRectangle.fromSizeAndColorFill(Coords.fromXY(this.entityDimension, this.entityDimension / 2), itemToolsetColor)
        ]);
        this.parent.textWithColorAddToVisual(itemToolsetName, itemToolsetColor, itemToolsetVisual);
        var itemToolset = ItemDefn.fromNameMassValueAndVisual(itemToolsetName, 1, 30, itemToolsetVisual);
        return itemToolset;
    }
    torch() {
        var itemTorchName = "Torch";
        var itemTorchColor = Color.byName("Brown");
        var itemTorchVisualBody = VisualRectangle.fromSizeAndColorFill(Coords.fromXY(this.entityDimension / 3, this.entityDimension * 1.5), itemTorchColor);
        var itemTorchVisualHead = new VisualEllipse(this.entityDimensionHalf * .65, // semimajorAxis
        this.entityDimensionHalf * .45, .25, // rotationInTurns
        Color.byName("Tan"), null, // colorBorder
        false // shouldUseEntityOrientation
        );
        var itemTorchVisualFlame = VisualBuilder.Instance().flame(this.entityDimensionHalf * .6);
        var itemTorchVisual = new VisualGroup([
            new VisualOffset(Coords.create(), itemTorchVisualBody),
            new VisualOffset(Coords.fromXY(0, 0 - this.entityDimension * .75), itemTorchVisualHead),
            new VisualOffset(Coords.fromXY(0, 0 - this.entityDimension * .7), itemTorchVisualFlame)
        ]);
        this.parent.textWithColorAddToVisual(itemTorchName, itemTorchColor, itemTorchVisual);
        var itemTorch = new ItemDefn(itemTorchName, null, null, 1, 4, null, // name, appearance, descripton, mass, value, stackSize
        ["Wieldable", "Consumable"], // categoryNames
        null, // use
        itemTorchVisual, null);
        return itemTorch;
    }
    walkieTalkie() {
        var itemWalkieTalkie = new ItemDefn("Walkie-Talkie", null, null, 2, 10, null, [], // categoryNames
        (uwpe) => // use
         {
            return "There is no response but static.";
        }, new VisualNone(), // todo
        null);
        return itemWalkieTalkie;
    }
    weight() {
        var itemWeightName = "Weight";
        var itemWeightColor = Color.byName("Blue");
        var itemWeightVisual = new VisualGroup([
            new VisualOffset(Coords.fromXY(0, -1).multiplyScalar(this.entityDimensionHalf), new VisualArc(this.entityDimensionHalf, // radiusOuter
            this.entityDimensionHalf / 2, // radiusInner
            Coords.fromXY(-1, 0).normalize(), // directionMin
            .5, // angleSpannedInTurns
            itemWeightColor, null)),
            VisualPolygon.fromPathAndColorFill(new Path([
                Coords.fromXY(-.75, .5),
                Coords.fromXY(-.5, -.5),
                Coords.fromXY(.5, -.5),
                Coords.fromXY(.75, .5)
            ]).transform(new Transform_Scale(Coords.ones().multiplyScalar(this.entityDimension))), itemWeightColor)
        ]);
        this.parent.textWithColorAddToVisual(itemWeightName, itemWeightColor, itemWeightVisual);
        var itemWeight = ItemDefn.fromNameMassValueAndVisual(itemWeightName, 2000, 5, itemWeightVisual);
        return itemWeight;
    }
}
