"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Stack {
            constructor() {
                this.items = new Array();
            }
            static fromArray(array) {
                var returnStack = new Stack();
                returnStack.pushMany(array);
                return returnStack;
            }
            hasMoreItems() {
                return this.size() > 0;
            }
            peek() {
                return this.items[0];
            }
            pop() {
                var returnValue = null;
                if (this.items.length > 0) {
                    returnValue = this.items[0];
                    this.items.splice(0, 1);
                }
                return returnValue;
            }
            push(itemToPush) {
                this.items.splice(0, 0, itemToPush);
            }
            pushMany(itemsToPush) {
                itemsToPush.forEach(x => this.items.push(x));
            }
            size() {
                return this.items.length;
            }
        }
        GameFramework.Stack = Stack;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
