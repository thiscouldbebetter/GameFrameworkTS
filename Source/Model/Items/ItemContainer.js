"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ItemContainer {
            static of(entity) {
                return entity.propertyByName(ItemContainer.name);
            }
            transfer(world, entityFrom, entityTo, messagePrefix) {
                var itemHolderFrom = GameFramework.ItemHolder.of(entityFrom);
                var itemHolderTo = GameFramework.ItemHolder.of(entityTo);
                if (itemHolderFrom.itemSelected == null) {
                    this.statusMessage = "Select and click buttons transfer items.";
                }
                else {
                    var itemToTransfer = itemHolderFrom.itemSelected;
                    itemHolderFrom.itemTransferSingleTo(itemToTransfer, itemHolderTo);
                    if (itemHolderFrom.itemQuantityByDefnName(itemToTransfer.defnName) <= 0) {
                        itemHolderFrom.itemSelected = null;
                    }
                    this.statusMessage =
                        messagePrefix
                            + " " + itemToTransfer.defnName + ".";
                    var equipmentUser = GameFramework.EquipmentUser.of(entityFrom);
                    if (equipmentUser != null) {
                        var uwpe = new GameFramework.UniverseWorldPlaceEntities(null, world, null, entityFrom, entityTo);
                        equipmentUser.unequipItemsNoLongerHeld(uwpe);
                    }
                }
            }
            // Clonable.
            clone() { return this; }
            overwriteWith(other) { return this; }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return ItemContainer.name; }
            updateForTimerTick(uwpe) { }
            // Equatable
            equals(other) { return false; } // todo
            // Controllable.
            toControl(universe, size, entityGetterPutter, entityContainer, venuePrev) {
                if (size == null) {
                    size = universe.display.sizeDefault();
                }
                var fontHeight = 10;
                var font = GameFramework.FontNameAndHeight.fromHeightInPixels(fontHeight);
                var margin = fontHeight * 1.5;
                var buttonSize = GameFramework.Coords.fromXY(2, 2).multiplyScalar(fontHeight);
                var listSize = GameFramework.Coords.fromXY((size.x - margin * 4 - buttonSize.x) / 2, size.y - margin * 4 - fontHeight * 2);
                var itemContainer = this;
                var itemHolderGetterPutter = GameFramework.ItemHolder.of(entityGetterPutter);
                var itemHolderContainer = GameFramework.ItemHolder.of(entityContainer);
                var world = universe.world;
                var back = () => universe.venueTransitionTo(venuePrev);
                var get = () => {
                    itemContainer.transfer(world, entityContainer, entityGetterPutter, "Took");
                };
                var put = () => {
                    itemContainer.transfer(world, entityGetterPutter, entityContainer, "Put");
                };
                var returnValue = new GameFramework.ControlContainer("containerTransfer", GameFramework.Coords.create(), // pos
                size.clone(), 
                // children
                [
                    GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(margin, margin), // pos
                    GameFramework.Coords.fromXY(listSize.x, 25), // size
                    GameFramework.DataBinding.fromContext(entityContainer.name + ":"), font),
                    new GameFramework.ControlList("listContainerItems", GameFramework.Coords.fromXY(margin, margin * 2), // pos
                    listSize.clone(), GameFramework.DataBinding.fromContextAndGet(itemHolderContainer, (c) => c.items), // items
                    GameFramework.DataBinding.fromGet((c) => c.toString(world)), // bindingForItemText
                    font, new GameFramework.DataBinding(itemHolderContainer, (c) => c.itemSelected, (c, v) => c.itemSelected = v), // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                    GameFramework.DataBinding.fromTrue(), // isEnabled
                    get, // confirm
                    null),
                    GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY((size.x - buttonSize.x) / 2, (size.y - buttonSize.y - margin) / 2), // pos
                    buttonSize.clone(), ">", font, get // click
                    ),
                    GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY((size.x - buttonSize.x) / 2, (size.y + buttonSize.y + margin) / 2), // pos
                    buttonSize.clone(), "<", font, put // click
                    ),
                    GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(size.x - margin - listSize.x, margin), // pos
                    GameFramework.Coords.fromXY(85, 25), // size
                    GameFramework.DataBinding.fromContext(entityGetterPutter.name + ":"), font),
                    new GameFramework.ControlList("listOtherItems", GameFramework.Coords.fromXY(size.x - margin - listSize.x, margin * 2), // pos
                    listSize.clone(), GameFramework.DataBinding.fromContextAndGet(itemHolderGetterPutter, (c) => c.items //.filter(x => x.item().defnName != itemDefnNameCurrency);
                    ), // items
                    GameFramework.DataBinding.fromGet((c) => c.toString(world)), // bindingForItemText
                    font, new GameFramework.DataBinding(itemHolderGetterPutter, (c) => c.itemSelected, (c, v) => c.itemSelected = v), // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                    GameFramework.DataBinding.fromTrue(), // isEnabled
                    put, // confirm
                    null),
                    GameFramework.ControlLabel.fromPosSizeTextFontCenteredHorizontally(GameFramework.Coords.fromXY(size.x / 2, size.y - margin - fontHeight), // pos
                    GameFramework.Coords.fromXY(size.x, fontHeight), // size
                    GameFramework.DataBinding.fromContextAndGet(this, c => c.statusMessage), font),
                    GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(size.x - margin - buttonSize.x, size.y - margin - buttonSize.y), // pos
                    buttonSize.clone(), "Done", font, back // click
                    )
                ], [new GameFramework.Action("Back", back)], [new GameFramework.ActionToInputsMapping("Back", [GameFramework.Input.Instances().Escape.name], true)]);
                return returnValue;
            }
        }
        GameFramework.ItemContainer = ItemContainer;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
