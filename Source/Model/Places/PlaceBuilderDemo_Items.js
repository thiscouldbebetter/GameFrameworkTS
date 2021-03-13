"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
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
                var itemArmorColor = GameFramework.Color.byName("GreenDark");
                var path = new GameFramework.Path([
                    new GameFramework.Coords(0, 0.5, 0),
                    new GameFramework.Coords(-.5, 0, 0),
                    new GameFramework.Coords(-.5, -.5, 0),
                    new GameFramework.Coords(.5, -.5, 0),
                    new GameFramework.Coords(.5, 0, 0),
                ]).transform(GameFramework.Transform_Scale.fromScalar(this.entityDimension));
                var itemArmorVisual = new GameFramework.VisualGroup([
                    new GameFramework.VisualPolygon(path, itemArmorColor, null)
                ]);
                if (this.parent.visualsHaveText) {
                    itemArmorVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(itemArmorName, itemArmorColor), new GameFramework.Coords(0, 0 - this.entityDimension, 0)));
                }
                var itemArmor = new GameFramework.ItemDefn(itemArmorName, null, null, 50, 30, null, ["Armor"], this.itemUseEquip, itemArmorVisual);
                return itemArmor;
            }
            armorEnhanced() {
                var itemArmorName = "Enhanced Armor";
                var itemArmorColor = GameFramework.Color.byName("GreenDark");
                var path = new GameFramework.Path([
                    new GameFramework.Coords(0, 0.5, 0),
                    new GameFramework.Coords(-.5, 0, 0),
                    new GameFramework.Coords(-.5, -.5, 0),
                    new GameFramework.Coords(.5, -.5, 0),
                    new GameFramework.Coords(.5, 0, 0),
                ]).transform(GameFramework.Transform_Scale.fromScalar(this.entityDimension));
                var itemArmorVisual = new GameFramework.VisualGroup([
                    new GameFramework.VisualPolygon(path, itemArmorColor, null)
                ]);
                if (this.parent.visualsHaveText) {
                    itemArmorVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(itemArmorName, itemArmorColor), new GameFramework.Coords(0, 0 - this.entityDimension, 0)));
                }
                var itemArmor = new GameFramework.ItemDefn(itemArmorName, null, null, 50, 30, null, ["Armor"], this.itemUseEquip, itemArmorVisual);
                return itemArmor;
            }
            arrow() {
                var itemArrowName = "Arrow";
                var itemArrowColor = new GameFramework.Color(null, null, [0, .5, .5, 1]);
                var itemArrowVisualShaft = new GameFramework.VisualLine(new GameFramework.Coords(-5, 0, 0), new GameFramework.Coords(5, 0, 0), GameFramework.Color.byName("Brown"), 1 // lineThickness
                );
                var pathHead = new GameFramework.Path([
                    new GameFramework.Coords(1, 0, 0),
                    new GameFramework.Coords(0.5, .25, 0),
                    new GameFramework.Coords(0.5, -.25, 0),
                ]).transform(GameFramework.Transform_Scale.fromScalar(this.entityDimension));
                var itemArrowVisualHead = new GameFramework.VisualPolygon(pathHead, itemArrowColor, null);
                var pathTail = new GameFramework.Path([
                    new GameFramework.Coords(0, 0, 0),
                    new GameFramework.Coords(-.5, .25, 0),
                    new GameFramework.Coords(-.75, .25, 0),
                    new GameFramework.Coords(-.5, 0, 0),
                    new GameFramework.Coords(-.75, -.25, 0),
                    new GameFramework.Coords(-.5, -.25, 0),
                ]).transform(GameFramework.Transform_Scale.fromScalar(this.entityDimension));
                var itemArrowVisualTail = new GameFramework.VisualPolygon(pathTail, GameFramework.Color.byName("White"), null);
                var itemArrowVisual = new GameFramework.VisualGroup([
                    itemArrowVisualTail,
                    itemArrowVisualShaft,
                    itemArrowVisualHead
                ]);
                if (this.parent.visualsHaveText) {
                    itemArrowVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(itemArrowName, itemArrowColor), new GameFramework.Coords(0, 0 - this.entityDimension * 1.5, 0)));
                }
                var itemArrow = new GameFramework.ItemDefn(itemArrowName, null, null, .05, 5, null, null, null, itemArrowVisual);
                return itemArrow;
            }
            bomb() {
                var itemBombName = "Bomb";
                var itemBombColor = GameFramework.Color.byName("BlueDark");
                var itemBombVisual = new GameFramework.VisualGroup([
                    // fuse
                    new GameFramework.VisualOffset(new GameFramework.VisualRectangle(new GameFramework.Coords(.2, 1, 1).multiplyScalar(this.entityDimensionHalf), GameFramework.Color.byName("Tan"), null, // colorBorder
                    true // isCentered
                    ), new GameFramework.Coords(0, -1, 0).multiplyScalar(this.entityDimensionHalf)),
                    // body
                    new GameFramework.VisualCircle(this.entityDimensionHalf, itemBombColor, null, null),
                    // highlight
                    new GameFramework.VisualOffset(new GameFramework.VisualCircle(this.entityDimensionHalf * .3, GameFramework.Color.byName("Blue"), null, null), new GameFramework.Coords(-this.entityDimensionHalf / 3, -this.entityDimensionHalf / 3, 0))
                ]);
                if (this.parent.visualsHaveText) {
                    itemBombVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(itemBombName, itemBombColor), new GameFramework.Coords(0, 0 - this.entityDimension * 2, 0)));
                }
                var itemBomb = new GameFramework.ItemDefn(itemBombName, null, null, 5, 10, null, ["Wieldable"], this.itemUseEquip, itemBombVisual);
                return itemBomb;
            }
            book() {
                var itemBookName = "Book";
                var itemBookColor = GameFramework.Color.byName("Blue");
                var itemBookVisual = new GameFramework.VisualGroup([
                    new GameFramework.VisualRectangle(new GameFramework.Coords(1, 1.25, 0).multiplyScalar(this.entityDimension), itemBookColor, null, null),
                    new GameFramework.VisualOffset(new GameFramework.VisualRectangle(new GameFramework.Coords(.1, 1.1, 0).multiplyScalar(this.entityDimension), GameFramework.Color.byName("White"), null, null), new GameFramework.Coords(.4, 0, 0).multiplyScalar(this.entityDimension))
                ]);
                if (this.parent.visualsHaveText) {
                    itemBookVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(itemBookName, itemBookColor), new GameFramework.Coords(0, 0 - this.entityDimension * 1.5, 0)));
                }
                var itemBook = new GameFramework.ItemDefn(itemBookName, null, null, 1, 10, null, // name, appearance, descripton, mass, value, stackSize
                null, // categoryNames
                (universe, world, place, entityUser, entityItem) => // use
                 {
                    var venuePrev = universe.venueCurrent;
                    var back = function () {
                        var venueNext = venuePrev;
                        venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                        universe.venueNext = venueNext;
                    };
                    var text = "Fourscore and seven years ago, our fathers brought forth upon this continent "
                        + "a new nation, conceived in liberty, and dedicated to the proposition that "
                        + " all men are created equal. ";
                    var size = universe.display.sizeInPixels.clone();
                    var fontHeight = 10;
                    var textarea = new GameFramework.ControlTextarea("textareaContents", size.clone().half().half(), size.clone().half(), GameFramework.DataBinding.fromContext(text), fontHeight, new GameFramework.DataBinding(false, null, null) // isEnabled
                    );
                    var button = new GameFramework.ControlButton("buttonDone", new GameFramework.Coords(size.x / 4, 3 * size.y / 4 + fontHeight, 1), new GameFramework.Coords(size.x / 2, fontHeight * 2, 1), "Done", fontHeight, true, // hasBorder
                    true, // isEnabled
                    back, // click
                    null, null);
                    var container = new GameFramework.ControlContainer("containerBook", new GameFramework.Coords(0, 0, 0), size.clone(), [textarea, button], // children
                    [
                        new GameFramework.Action(GameFramework.ControlActionNames.Instances().ControlCancel, back),
                        new GameFramework.Action(GameFramework.ControlActionNames.Instances().ControlConfirm, back)
                    ], null);
                    var venueNext = new GameFramework.VenueControls(container, false);
                    venueNext = new GameFramework.VenueFader(venueNext, null, null, null);
                    universe.venueNext = venueNext;
                    return "";
                }, itemBookVisual);
                return itemBook;
            }
            bow() {
                var itemBowName = "Bow";
                var itemBowColor = GameFramework.Color.byName("Brown");
                var itemBowVisualString = new GameFramework.VisualPolygon(new GameFramework.Path([
                    new GameFramework.Coords(0, -this.entityDimension, 0),
                    new GameFramework.Coords(1, -this.entityDimension, 0),
                    new GameFramework.Coords(1, this.entityDimension, 0),
                    new GameFramework.Coords(0, this.entityDimension, 0),
                ]), GameFramework.Color.byName("White"), null);
                var itemBowVisualBody = new GameFramework.VisualArc(this.entityDimension, // radiusOuter
                this.entityDimension - 3, // radiusInner
                new GameFramework.Coords(0, -1, 0), // directionMin
                .5, // angleSpannedInTurns
                itemBowColor, null);
                var itemBowVisual = new GameFramework.VisualGroup([
                    itemBowVisualString,
                    itemBowVisualBody
                ]);
                if (this.parent.visualsHaveText) {
                    itemBowVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(itemBowName, itemBowColor), new GameFramework.Coords(0, 0 - this.entityDimension * 2, 0)));
                }
                var itemBow = new GameFramework.ItemDefn(itemBowName, null, null, 5, 100, null, ["Wieldable"], this.itemUseEquip, itemBowVisual);
                return itemBow;
            }
            bread() {
                var itemBreadName = "Bread";
                var itemBreadColor = GameFramework.Color.byName("Orange");
                var itemBreadVisualCut = new GameFramework.VisualEllipse(this.entityDimension * .15, // semimajorAxis
                this.entityDimensionHalf * .15, .25, // rotationInTurns
                GameFramework.Color.byName("Tan"), null // colorBorder
                );
                var itemBreadVisual = new GameFramework.VisualGroup([
                    new GameFramework.VisualEllipse(this.entityDimensionHalf * 1.5, // semimajorAxis
                    this.entityDimensionHalf * .75, 0, // rotationInTurns
                    itemBreadColor, null // colorBorder
                    ),
                    itemBreadVisualCut,
                    new GameFramework.VisualOffset(itemBreadVisualCut, new GameFramework.Coords(-this.entityDimensionHalf * 0.75, 0, 0)),
                    new GameFramework.VisualOffset(itemBreadVisualCut, new GameFramework.Coords(this.entityDimensionHalf * 0.75, 0, 0))
                ]);
                if (this.parent.visualsHaveText) {
                    itemBreadVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(itemBreadName, itemBreadColor), new GameFramework.Coords(0, 0 - this.entityDimension * 1.5, 0)));
                }
                var itemBread = new GameFramework.ItemDefn(itemBreadName, null, null, 1, 4, null, // name, appearance, descripton, mass, value, stackSize
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
                var itemCoinColor = GameFramework.Color.byName("Yellow");
                var itemCoinVisual = new GameFramework.VisualGroup([
                    new GameFramework.VisualCircle(this.entityDimensionHalf, itemCoinColor, null, null),
                    new GameFramework.VisualCircle(this.entityDimensionHalf * .75, null, GameFramework.Color.byName("Gray"), null)
                ]);
                if (this.parent.visualsHaveText) {
                    itemCoinVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(itemCoinName, itemCoinColor), new GameFramework.Coords(0, 0 - this.entityDimension, 0)));
                }
                var itemCoin = new GameFramework.ItemDefn(itemCoinName, null, null, .01, 1, null, null, null, itemCoinVisual);
                return itemCoin;
            }
            crystal() {
                var itemCrystalName = "Crystal";
                var itemCrystalColor = GameFramework.Color.byName("Cyan");
                var itemCrystalVisual = new GameFramework.VisualGroup([
                    new GameFramework.VisualPolygon(new GameFramework.Path([
                        new GameFramework.Coords(1, 0, 0),
                        new GameFramework.Coords(0, 1, 0),
                        new GameFramework.Coords(-1, 0, 0),
                        new GameFramework.Coords(0, -1, 0)
                    ]).transform(new GameFramework.Transform_Scale(new GameFramework.Coords(1, 1, 1).multiplyScalar(this.entityDimension / 2))), itemCrystalColor, GameFramework.Color.byName("White")),
                    new GameFramework.VisualPolygon(new GameFramework.Path([
                        new GameFramework.Coords(1, 0, 0),
                        new GameFramework.Coords(0, 1, 0),
                        new GameFramework.Coords(-1, 0, 0),
                        new GameFramework.Coords(0, -1, 0)
                    ]).transform(new GameFramework.Transform_Scale(new GameFramework.Coords(1, 1, 1).multiplyScalar(this.entityDimension / 4))), GameFramework.Color.byName("White"), null)
                ]);
                if (this.parent.visualsHaveText) {
                    itemCrystalVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(itemCrystalName, itemCrystalColor), new GameFramework.Coords(0, 0 - this.entityDimension, 0)));
                }
                var itemCrystal = new GameFramework.ItemDefn(itemCrystalName, null, null, .1, 1, null, null, null, itemCrystalVisual);
                return itemCrystal;
            }
            doughnut() {
                var itemDoughnutName = "Doughnut";
                var itemDoughnutColor = GameFramework.Color.byName("Orange");
                var itemDoughnutVisualBody = new GameFramework.VisualGroup([
                    // body
                    new GameFramework.VisualCircle(this.entityDimensionHalf, itemDoughnutColor, null, null),
                    // hole
                    new GameFramework.VisualErase(new GameFramework.VisualCircle(this.entityDimensionHalf * .3, itemDoughnutColor, null, null))
                ]);
                var itemDoughnutVisual = new GameFramework.VisualBuffered(new GameFramework.Coords(1, 1, 0).multiplyScalar(this.entityDimension * 1.2), itemDoughnutVisualBody);
                if (this.parent.visualsHaveText) {
                    itemDoughnutVisualBody.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(itemDoughnutName, itemDoughnutColor), new GameFramework.Coords(0, 0 - this.entityDimension * 2, 0)));
                }
                var itemDoughnut = new GameFramework.ItemDefn(itemDoughnutName, null, null, 1, 4, null, // name, appearance, descripton, mass, value, stackSize
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
                var colorFlower = GameFramework.Color.byName("Pink");
                var itemFlowerVisual = new GameFramework.VisualGroup([
                    new GameFramework.VisualOffset(new GameFramework.VisualArc(this.entityDimensionHalf * 2, // radiusOuter
                    this.entityDimensionHalf * 2 - 2, // radiusInner
                    new GameFramework.Coords(-1, 1, 0).normalize(), // directionMin
                    .25, // angleSpannedInTurns
                    GameFramework.Color.byName("GreenDark"), null), new GameFramework.Coords(.5, 1.75, 0).multiplyScalar(this.entityDimensionHalf)),
                    new GameFramework.VisualPolygon(new GameFramework.Path([
                        new GameFramework.Coords(1, 0, 0),
                        new GameFramework.Coords(.3, .3, 0),
                        new GameFramework.Coords(0, 1, 0),
                        new GameFramework.Coords(-.3, .3, 0),
                        new GameFramework.Coords(-1, 0, 0),
                        new GameFramework.Coords(-.3, -.3, 0),
                        new GameFramework.Coords(0, -1, 0),
                        new GameFramework.Coords(.3, -.3, 0)
                    ]).transform(new GameFramework.Transform_Scale(new GameFramework.Coords(1, 1, 1).multiplyScalar(this.entityDimensionHalf))), colorFlower, GameFramework.Color.byName("Red"))
                ]);
                if (this.parent.visualsHaveText) {
                    itemFlowerVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(itemFlowerName, colorFlower), new GameFramework.Coords(0, 0 - this.entityDimensionHalf * 2, 0)));
                }
                var itemFlower = new GameFramework.ItemDefn(itemFlowerName, null, null, .01, 1, null, null, null, itemFlowerVisual);
                return itemFlower;
            }
            fruit() {
                var itemFruitName = "Fruit";
                var itemFruitColor = GameFramework.Color.byName("Orange");
                var itemFruitVisual = new GameFramework.VisualGroup([
                    new GameFramework.VisualCircle(this.entityDimensionHalf, itemFruitColor, null, null),
                    new GameFramework.VisualOffset(new GameFramework.VisualCircle(this.entityDimensionHalf * .25, GameFramework.Color.byName("White"), null, null), new GameFramework.Coords(-this.entityDimensionHalf / 2, -this.entityDimensionHalf / 2, 0))
                ]);
                if (this.parent.visualsHaveText) {
                    itemFruitVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(itemFruitName, itemFruitColor), new GameFramework.Coords(0, 0 - this.entityDimension, 0)));
                }
                var itemFruit = new GameFramework.ItemDefn(itemFruitName, null, null, .25, 6, null, // name, appearance, descripton, mass, value, stackSize
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
                var itemGrassVisual = new GameFramework.VisualGroup([
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
                    new GameFramework.VisualImageScaled(new GameFramework.VisualImageFromLibrary("Grass"), new GameFramework.Coords(1, 1, 0).multiplyScalar(this.entityDimension * 2) // sizeScaled
                    ),
                ]);
                if (this.parent.visualsHaveText) {
                    itemGrassVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(itemGrassName, GameFramework.Color.byName("GreenDark")), new GameFramework.Coords(0, 0 - this.entityDimensionHalf * 3, 0)));
                }
                var itemGrass = new GameFramework.ItemDefn(itemGrassName, null, null, .01, 1, null, null, null, itemGrassVisual);
                return itemGrass;
            }
            heart() {
                var entityDimensionQuarter = this.entityDimensionHalf / 2;
                var itemHeartName = "Heart";
                var itemHeartColor = GameFramework.Color.byName("Red");
                var itemHeartVisual = new GameFramework.VisualGroup([
                    new GameFramework.VisualOffset(new GameFramework.VisualArc(entityDimensionQuarter, // radiusOuter
                    0, // radiusInner
                    new GameFramework.Coords(-1, 0, 0), // directionMin
                    .5, // angleSpannedInTurns
                    itemHeartColor, null), new GameFramework.Coords(-entityDimensionQuarter, 0, 0)),
                    new GameFramework.VisualOffset(new GameFramework.VisualArc(entityDimensionQuarter, // radiusOuter
                    0, // radiusInner
                    new GameFramework.Coords(-1, 0, 0), // directionMin
                    .5, // angleSpannedInTurns
                    itemHeartColor, null), new GameFramework.Coords(entityDimensionQuarter, 0, 0)),
                    new GameFramework.VisualPolygon(new GameFramework.Path([
                        new GameFramework.Coords(-1.1, 0, 0),
                        new GameFramework.Coords(1.1, 0, 0),
                        new GameFramework.Coords(0, 1.3, 0),
                    ]).transform(GameFramework.Transform_Scale.fromScalar(this.entityDimensionHalf)), itemHeartColor, null)
                ]);
                if (this.parent.visualsHaveText) {
                    itemHeartVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(itemHeartName, itemHeartColor), new GameFramework.Coords(0, 0 - this.entityDimension * 1.5, 0)));
                }
                var itemHeartVisualShifted = new GameFramework.VisualOffset(itemHeartVisual, new GameFramework.Coords(0, -entityDimensionQuarter, 0));
                var itemHeart = new GameFramework.ItemDefn(itemHeartName, null, null, 10, 1, null, null, null, itemHeartVisualShifted);
                return itemHeart;
            }
            iron() {
                var itemIronName = "Iron";
                var itemIronColor = GameFramework.Color.byName("Gray");
                var itemIronVisual = new GameFramework.VisualGroup([
                    new GameFramework.VisualPolygon(new GameFramework.Path([
                        new GameFramework.Coords(-0.5, 0.4, 0),
                        new GameFramework.Coords(0.5, 0.4, 0),
                        new GameFramework.Coords(0.2, -0.4, 0),
                        new GameFramework.Coords(-0.2, -0.4, 0),
                    ]).transform(GameFramework.Transform_Scale.fromScalar(this.entityDimension)), itemIronColor, null)
                ]);
                if (this.parent.visualsHaveText) {
                    itemIronVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(itemIronName, itemIronColor), new GameFramework.Coords(0, 0 - this.entityDimension, 0)));
                }
                var itemIron = new GameFramework.ItemDefn(itemIronName, null, null, 10, 5, null, null, null, itemIronVisual);
                return itemIron;
            }
            ironOre() {
                var itemIronOreName = "Iron Ore";
                var itemIronOreColor = GameFramework.Color.byName("Gray");
                var itemIronOreVisual = new GameFramework.VisualGroup([
                    new GameFramework.VisualArc(this.entityDimension / 2, // radiusOuter
                    0, // radiusInner
                    new GameFramework.Coords(-1, 0, 0), // directionMin
                    .5, // angleSpannedInTurns
                    itemIronOreColor, null)
                ]);
                if (this.parent.visualsHaveText) {
                    itemIronOreVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(itemIronOreName, itemIronOreColor), new GameFramework.Coords(0, 0 - this.entityDimension * 1.5, 0)));
                }
                var itemIronOre = new GameFramework.ItemDefn(itemIronOreName, null, null, 10, 1, null, null, null, itemIronOreVisual);
                return itemIronOre;
            }
            key() {
                var itemKeyName = "Key";
                var itemKeyColor = GameFramework.Color.byName("Yellow");
                var itemKeyVisual = new GameFramework.VisualGroup([
                    new GameFramework.VisualArc(this.entityDimensionHalf, // radiusOuter
                    this.entityDimensionHalf / 2, // radiusInner
                    GameFramework.Coords.Instances().Ones, // directionMin
                    1, // angleSpannedInTurns
                    itemKeyColor, null),
                    new GameFramework.VisualOffset(new GameFramework.VisualPolars([
                        new GameFramework.Polar(0, this.entityDimensionHalf, 0),
                        new GameFramework.Polar(.25, this.entityDimensionHalf / 2, 0)
                    ], itemKeyColor, this.entityDimensionHalf / 2 // lineThickness
                    ), new GameFramework.Coords(this.entityDimensionHalf, 0, 0)),
                ]);
                if (this.parent.visualsHaveText) {
                    itemKeyVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(itemKeyName, itemKeyColor), new GameFramework.Coords(0, 0 - this.entityDimension * 2, 0)));
                }
                var itemKey = new GameFramework.ItemDefn(itemKeyName, null, null, .1, 5, null, null, null, itemKeyVisual);
                return itemKey;
            }
            log() {
                var itemLogName = "Log";
                var itemLogColor = GameFramework.Color.byName("Brown");
                var itemLogVisual = new GameFramework.VisualGroup([
                    new GameFramework.VisualOffset(new GameFramework.VisualCircle(this.entityDimensionHalf, itemLogColor, null, null), new GameFramework.Coords(this.entityDimension, 0, 0)),
                    new GameFramework.VisualRectangle(new GameFramework.Coords(this.entityDimension * 2, this.entityDimension, 0), itemLogColor, null, null),
                    new GameFramework.VisualOffset(new GameFramework.VisualCircle(this.entityDimensionHalf, GameFramework.Color.byName("Tan"), null, null), new GameFramework.Coords(-this.entityDimension, 0, 0))
                ]);
                if (this.parent.visualsHaveText) {
                    itemLogVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(itemLogName, itemLogColor), new GameFramework.Coords(0, 0 - this.entityDimension, 0)));
                }
                var itemLog = new GameFramework.ItemDefn(itemLogName, null, null, 10, 1, null, null, null, itemLogVisual);
                return itemLog;
            }
            meat() {
                var itemMeatName = "Meat";
                var itemMeatColor = GameFramework.Color.byName("Red");
                var itemMeatVisual = new GameFramework.VisualGroup([
                    new GameFramework.VisualCircle(this.entityDimensionHalf, itemMeatColor, null, null),
                    new GameFramework.VisualCircle(this.entityDimensionHalf * .9, null, GameFramework.Color.byName("White"), null),
                    new GameFramework.VisualOffset(new GameFramework.VisualCircle(this.entityDimensionHalf * .2, GameFramework.Color.byName("Pink"), GameFramework.Color.byName("White"), null), new GameFramework.Coords(this.entityDimensionHalf * .2, 0, 0))
                ]);
                if (this.parent.visualsHaveText) {
                    itemMeatVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(itemMeatName, itemMeatColor), new GameFramework.Coords(0, 0 - this.entityDimension * 1.5, 0)));
                }
                var itemMeat = new GameFramework.ItemDefn(itemMeatName, null, null, 1, 10, null, // name, appearance, descripton, mass, value, stackSize
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
                var itemMedicineColor = GameFramework.Color.byName("Red");
                var itemMedicineVisual = new GameFramework.VisualGroup([
                    new GameFramework.VisualRectangle(new GameFramework.Coords(1, 1, 0).multiplyScalar(this.entityDimension), GameFramework.Color.byName("White"), null, null),
                    new GameFramework.VisualPolygon(new GameFramework.Path([
                        new GameFramework.Coords(-0.5, -0.2, 0),
                        new GameFramework.Coords(-0.2, -0.2, 0),
                        new GameFramework.Coords(-0.2, -0.5, 0),
                        new GameFramework.Coords(0.2, -0.5, 0),
                        new GameFramework.Coords(0.2, -0.2, 0),
                        new GameFramework.Coords(0.5, -0.2, 0),
                        new GameFramework.Coords(0.5, 0.2, 0),
                        new GameFramework.Coords(0.2, 0.2, 0),
                        new GameFramework.Coords(0.2, 0.5, 0),
                        new GameFramework.Coords(-0.2, 0.5, 0),
                        new GameFramework.Coords(-0.2, 0.2, 0),
                        new GameFramework.Coords(-0.5, 0.2, 0)
                    ]).transform(GameFramework.Transform_Scale.fromScalar(this.entityDimension)), itemMedicineColor, null)
                ]);
                if (this.parent.visualsHaveText) {
                    itemMedicineVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(itemMedicineName, itemMedicineColor), new GameFramework.Coords(0, 0 - this.entityDimension, 0)));
                }
                var itemMedicine = new GameFramework.ItemDefn(itemMedicineName, null, null, 1, 10, null, // name, appearance, descripton, mass, value, stackSize
                ["Consumable"], // categoryNames
                (universe, world, place, entityUser, entityItem) => // use
                 {
                    var effectToApply = GameFramework.Effect.Instances().Healing;
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
                var colorStem = GameFramework.Color.byName("Gray");
                var colorCap = GameFramework.Color.byName("Violet");
                var itemMushroomVisual = new GameFramework.VisualGroup([
                    new GameFramework.VisualOffset(new GameFramework.VisualArc(this.entityDimensionHalf, // radiusOuter
                    0, // radiusInner
                    new GameFramework.Coords(-1, 0, 0), // directionMin
                    .5, // angleSpannedInTurns
                    colorCap, null), new GameFramework.Coords(0, -this.entityDimensionHalf / 2, 0)),
                    new GameFramework.VisualOffset(new GameFramework.VisualRectangle(new GameFramework.Coords(this.entityDimensionHalf / 2, this.entityDimensionHalf, 0), colorStem, null, null), new GameFramework.Coords(0, 0, 0))
                ]);
                if (this.parent.visualsHaveText) {
                    itemMushroomVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(itemMushroomName, colorCap), new GameFramework.Coords(0, 0 - this.entityDimensionHalf * 3, 0)));
                }
                var itemMushroom = new GameFramework.ItemDefn(itemMushroomName, null, null, .01, 1, null, null, null, itemMushroomVisual);
                return itemMushroom;
            }
            pick() {
                var itemPickName = "Pick";
                var itemPickColor = GameFramework.Color.byName("Gray");
                var itemPickVisual = new GameFramework.VisualGroup([
                    new GameFramework.VisualOffset(new GameFramework.VisualRectangle(new GameFramework.Coords(this.entityDimension / 4, this.entityDimension, 0), GameFramework.Color.byName("Brown"), null, null), new GameFramework.Coords(0, 0 - this.entityDimension / 2, 0)),
                    new GameFramework.VisualPolygon(new GameFramework.Path([
                        new GameFramework.Coords(0.75, -1, 0),
                        new GameFramework.Coords(-0.75, -1, 0),
                        new GameFramework.Coords(-0.5, -1.4, 0),
                        new GameFramework.Coords(0.5, -1.4, 0)
                    ]).transform(GameFramework.Transform_Scale.fromScalar(this.entityDimension)), itemPickColor, null)
                ]);
                if (this.parent.visualsHaveText) {
                    itemPickVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(itemPickName, itemPickColor), new GameFramework.Coords(0, 0 - this.entityDimension * 2, 0)));
                }
                var itemPick = new GameFramework.ItemDefn(itemPickName, null, null, 1, 30, null, ["Wieldable"], this.itemUseEquip, itemPickVisual);
                return itemPick;
            }
            potion() {
                // todo - Same as medicine right now.
                var itemPotionName = "Potion";
                var itemPotionColor = GameFramework.Color.byName("Red");
                var itemPotionVisual = new GameFramework.VisualGroup([
                    new GameFramework.VisualRectangle(new GameFramework.Coords(1, 1, 0).multiplyScalar(this.entityDimension), GameFramework.Color.byName("White"), null, null),
                    new GameFramework.VisualPolygon(new GameFramework.Path([
                        new GameFramework.Coords(-0.5, -0.2, 0),
                        new GameFramework.Coords(-0.2, -0.2, 0),
                        new GameFramework.Coords(-0.2, -0.5, 0),
                        new GameFramework.Coords(0.2, -0.5, 0),
                        new GameFramework.Coords(0.2, -0.2, 0),
                        new GameFramework.Coords(0.5, -0.2, 0),
                        new GameFramework.Coords(0.5, 0.2, 0),
                        new GameFramework.Coords(0.2, 0.2, 0),
                        new GameFramework.Coords(0.2, 0.5, 0),
                        new GameFramework.Coords(-0.2, 0.5, 0),
                        new GameFramework.Coords(-0.2, 0.2, 0),
                        new GameFramework.Coords(-0.5, 0.2, 0)
                    ]).transform(GameFramework.Transform_Scale.fromScalar(this.entityDimension)), itemPotionColor, null)
                ]);
                if (this.parent.visualsHaveText) {
                    itemPotionVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(itemPotionName, itemPotionColor), new GameFramework.Coords(0, 0 - this.entityDimension, 0)));
                }
                var itemPotion = new GameFramework.ItemDefn(itemPotionName, null, null, 1, 10, null, // name, appearance, descripton, mass, value, stackSize
                ["Consumable"], // categoryNames
                (universe, world, place, entityUser, entityItem) => // use
                 {
                    var effectToApply = GameFramework.Effect.Instances().Healing;
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
                var itemShovelColor = GameFramework.Color.byName("Gray");
                var itemShovelVisual = new GameFramework.VisualGroup([
                    new GameFramework.VisualOffset(new GameFramework.VisualRectangle(new GameFramework.Coords(this.entityDimension / 4, this.entityDimension, 0), GameFramework.Color.byName("Brown"), null, null), new GameFramework.Coords(0, 0 + this.entityDimension / 2, 0)),
                    new GameFramework.VisualPolygon(new GameFramework.Path([
                        new GameFramework.Coords(0.5, 1.5, 0),
                        new GameFramework.Coords(0, 1.75, 0),
                        new GameFramework.Coords(-0.5, 1.5, 0),
                        new GameFramework.Coords(-0.5, 1.0, 0),
                        new GameFramework.Coords(0.5, 1.0, 0)
                    ]).transform(GameFramework.Transform_Scale.fromScalar(this.entityDimension)), itemShovelColor, null)
                ]);
                if (this.parent.visualsHaveText) {
                    itemShovelVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(itemShovelName, itemShovelColor), new GameFramework.Coords(0, 0 - this.entityDimension * 2, 0)));
                }
                var itemShovel = new GameFramework.ItemDefn(itemShovelName, null, null, 1, 30, null, ["Wieldable"], this.itemUseEquip, itemShovelVisual);
                return itemShovel;
            }
            speedBoots() {
                var itemSpeedBootsName = "Speed Boots";
                var itemAccessoryColor = GameFramework.Color.byName("Orange");
                var itemSpeedBootsVisual = new GameFramework.VisualGroup([
                    new GameFramework.VisualPolygon(new GameFramework.Path([
                        new GameFramework.Coords(0, .5, 0),
                        new GameFramework.Coords(1, .5, 0),
                        new GameFramework.Coords(.5, 0, 0),
                        new GameFramework.Coords(.5, -.5, 0),
                        new GameFramework.Coords(0, -.5, 0),
                    ]).transform(GameFramework.Transform_Scale.fromScalar(this.entityDimension)), itemAccessoryColor, null),
                    new GameFramework.VisualPolygon(new GameFramework.Path([
                        new GameFramework.Coords(-.1, .5, 0),
                        new GameFramework.Coords(-1.1, .5, 0),
                        new GameFramework.Coords(-.6, 0, 0),
                        new GameFramework.Coords(-.6, -.5, 0),
                        new GameFramework.Coords(-.1, -.5, 0),
                    ]).transform(GameFramework.Transform_Scale.fromScalar(this.entityDimension)), itemAccessoryColor, null)
                ]);
                if (this.parent.visualsHaveText) {
                    itemSpeedBootsVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(itemSpeedBootsName, itemAccessoryColor), new GameFramework.Coords(0, 0 - this.entityDimension * 2, 0)));
                }
                var itemSpeedBoots = new GameFramework.ItemDefn(itemSpeedBootsName, null, null, 10, 30, null, ["Accessory"], this.itemUseEquip, itemSpeedBootsVisual);
                return itemSpeedBoots;
            }
            sword() {
                var itemSwordVisual = this.sword_Visual(GameFramework.Color.byName("GrayLight"));
                var itemSword = new GameFramework.ItemDefn("Sword", null, null, 10, 100, null, ["Wieldable"], this.itemUseEquip, itemSwordVisual);
                return itemSword;
            }
            sword_Visual(bladeColor) {
                var hiltColor = GameFramework.Color.fromRGB(0, .5, .5);
                var itemSwordVisualBladePath = new GameFramework.Path([
                    // blade
                    new GameFramework.Coords(-0.4, 0.2, 0),
                    new GameFramework.Coords(.9, 0.2, 0),
                    new GameFramework.Coords(1.1, 0, 0),
                    new GameFramework.Coords(.9, -0.2, 0),
                    new GameFramework.Coords(-0.4, -0.2, 0),
                ]);
                var itemSwordVisualHiltPath = new GameFramework.Path([
                    // hilt
                    new GameFramework.Coords(-0.4, -0.5, 0),
                    new GameFramework.Coords(-0.8, -0.5, 0),
                    new GameFramework.Coords(-0.8, -0.2, 0),
                    new GameFramework.Coords(-1.1, -0.2, 0),
                    new GameFramework.Coords(-1.1, 0.2, 0),
                    new GameFramework.Coords(-0.8, 0.2, 0),
                    new GameFramework.Coords(-0.8, 0.5, 0),
                    new GameFramework.Coords(-0.4, 0.5, 0)
                ]);
                var transform = new GameFramework.Transform_Multiple([
                    GameFramework.Transform_Scale.fromScalar(this.entityDimension),
                    new GameFramework.Transform_RotateRight(3) // quarter-turns
                ]);
                var itemSwordVisualBlade = new GameFramework.VisualPolygon //Located
                (itemSwordVisualBladePath.transform(transform), bladeColor, null // colorBorder
                );
                var itemSwordVisualHilt = new GameFramework.VisualPolygon //Located
                (itemSwordVisualHiltPath.transform(transform), hiltColor, null // colorBorder
                );
                var itemSwordVisualBody = new GameFramework.VisualGroup([
                    itemSwordVisualBlade, itemSwordVisualHilt
                ]);
                var itemSwordVisual = new GameFramework.VisualGroup([
                    itemSwordVisualBody
                ]);
                if (this.parent.visualsHaveText) {
                    itemSwordVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor("Sword", bladeColor), new GameFramework.Coords(0, 0 - this.entityDimension * 2, 0)));
                }
                return itemSwordVisual;
            }
            swordCold() {
                var bladeColor = GameFramework.Color.byName("Cyan");
                var damageTypeName = "Cold";
                var itemSwordVisual = this.sword_Visual(bladeColor);
                var itemSword = new GameFramework.ItemDefn("Sword" + damageTypeName, null, null, 10, 100, null, ["Wieldable"], this.itemUseEquip, itemSwordVisual);
                return itemSword;
            }
            swordHeat() {
                var bladeColor = GameFramework.Color.byName("Yellow");
                var damageTypeName = "Heat";
                var itemSwordVisual = this.sword_Visual(bladeColor);
                var itemSword = new GameFramework.ItemDefn("Sword" + damageTypeName, null, null, 10, 100, null, ["Wieldable"], this.itemUseEquip, itemSwordVisual);
                return itemSword;
            }
            toolset() {
                var itemToolsetName = "Toolset";
                var itemToolsetColor = GameFramework.Color.byName("Gray");
                var itemToolsetVisual = new GameFramework.VisualGroup([
                    new GameFramework.VisualOffset(new GameFramework.VisualRectangle(new GameFramework.Coords(this.entityDimension / 4, this.entityDimension, 0), GameFramework.Color.byName("Brown"), null, null), new GameFramework.Coords(0, this.entityDimension / 2, 0)),
                    new GameFramework.VisualRectangle(new GameFramework.Coords(this.entityDimension, this.entityDimension / 2, 0), itemToolsetColor, null, null)
                ]);
                if (this.parent.visualsHaveText) {
                    itemToolsetVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(itemToolsetName, itemToolsetColor), new GameFramework.Coords(0, 0 - this.entityDimension, 0)));
                }
                var itemToolset = new GameFramework.ItemDefn(itemToolsetName, null, null, 1, 30, null, null, null, itemToolsetVisual);
                return itemToolset;
            }
            torch() {
                var itemTorchName = "Torch";
                var itemTorchColor = GameFramework.Color.byName("Brown");
                var itemTorchVisualBody = new GameFramework.VisualRectangle(new GameFramework.Coords(this.entityDimension / 3, this.entityDimension * 1.5, 0), itemTorchColor, null, null);
                var itemTorchVisualHead = new GameFramework.VisualEllipse(this.entityDimensionHalf * .65, // semimajorAxis
                this.entityDimensionHalf * .45, .25, // rotationInTurns
                GameFramework.Color.byName("Tan"), null // colorBorder
                );
                var itemTorchVisualFlame = GameFramework.VisualBuilder.Instance().flame(this.entityDimensionHalf * .6);
                var itemTorchVisual = new GameFramework.VisualGroup([
                    new GameFramework.VisualOffset(itemTorchVisualBody, new GameFramework.Coords(0, 0, 0)),
                    new GameFramework.VisualOffset(itemTorchVisualHead, new GameFramework.Coords(0, 0 - this.entityDimension * .75, 0)),
                    new GameFramework.VisualOffset(itemTorchVisualFlame, new GameFramework.Coords(0, 0 - this.entityDimension * .7, 0))
                ]);
                if (this.parent.visualsHaveText) {
                    itemTorchVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(itemTorchName, itemTorchColor), new GameFramework.Coords(0, 0 - this.entityDimension * 1.5, 0)));
                }
                var itemTorch = new GameFramework.ItemDefn(itemTorchName, null, null, 1, 4, null, // name, appearance, descripton, mass, value, stackSize
                ["Wieldable", "Consumable"], // categoryNames
                null, // use
                itemTorchVisual);
                return itemTorch;
            }
            walkieTalkie() {
                var itemWalkieTalkie = new GameFramework.ItemDefn("Walkie-Talkie", null, null, 2, 10, null, [], // categoryNames
                (universe, world, place, entityUser, entityItem) => // use
                 {
                    return "There is no response but static.";
                }, new GameFramework.VisualNone() // todo
                );
                return itemWalkieTalkie;
            }
            weight() {
                var itemWeightName = "Weight";
                var itemWeightColor = GameFramework.Color.byName("Blue");
                var itemWeightVisual = new GameFramework.VisualGroup([
                    new GameFramework.VisualOffset(new GameFramework.VisualArc(this.entityDimensionHalf, // radiusOuter
                    this.entityDimensionHalf / 2, // radiusInner
                    new GameFramework.Coords(-1, 0, 0).normalize(), // directionMin
                    .5, // angleSpannedInTurns
                    itemWeightColor, null), new GameFramework.Coords(0, -1, 0).multiplyScalar(this.entityDimensionHalf)),
                    new GameFramework.VisualPolygon(new GameFramework.Path([
                        new GameFramework.Coords(-.75, .5, 0),
                        new GameFramework.Coords(-.5, -.5, 0),
                        new GameFramework.Coords(.5, -.5, 0),
                        new GameFramework.Coords(.75, .5, 0)
                    ]).transform(new GameFramework.Transform_Scale(new GameFramework.Coords(1, 1, 1).multiplyScalar(this.entityDimension))), itemWeightColor, null)
                ]);
                if (this.parent.visualsHaveText) {
                    itemWeightVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(itemWeightName, itemWeightColor), new GameFramework.Coords(0, 0 - this.entityDimension * 2, 0)));
                }
                var itemWeight = new GameFramework.ItemDefn(itemWeightName, null, null, 2000, 5, null, null, null, itemWeightVisual);
                return itemWeight;
            }
        }
        GameFramework.PlaceBuilderDemo_Items = PlaceBuilderDemo_Items;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
