"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class TreeHelper {
            // Static class.
            static addNodeAndAllDescendantsToList(node, listToAddTo) {
                listToAddTo.push(node);
                for (var i = 0; i < node.children.length; i++) {
                    var child = node.children[i];
                    if (child != null) {
                        TreeHelper.addNodeAndAllDescendantsToList(child, listToAddTo);
                    }
                }
                return listToAddTo;
            }
        }
        GameFramework.TreeHelper = TreeHelper;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
