"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ConversationDefn {
            constructor(name, visualPortrait, talkNodeDefns, talkNodes) {
                this.name = name;
                this.visualPortrait = visualPortrait;
                this.talkNodeDefns = talkNodeDefns;
                this.talkNodeDefnsByName = GameFramework.ArrayHelper.addLookupsByName(this.talkNodeDefns);
                this.talkNodes = talkNodes;
                this.talkNodesByName = GameFramework.ArrayHelper.addLookupsByName(this.talkNodes);
            }
            contentSubstitute(contentByNodeName) {
                this.talkNodes.forEach(talkNode => {
                    var talkNodeName = talkNode.name;
                    if (talkNodeName != null) {
                        if (contentByNodeName.has(talkNodeName)) {
                            talkNode.content = contentByNodeName.get(talkNodeName);
                        }
                    }
                });
                return this;
            }
            displayNodesExpandByLines() {
                var defnNameDisplay = GameFramework.TalkNodeDefn.Instances().Display.name;
                for (var i = 0; i < this.talkNodes.length; i++) {
                    var talkNode = this.talkNodes[i];
                    if (talkNode.defnName == defnNameDisplay) {
                        var content = talkNode.content;
                        var contentAsLines = content.split("\n");
                        if (contentAsLines.length > 0) {
                            talkNode.content = contentAsLines[0];
                            var linesAfterFirst = contentAsLines.slice(1);
                            var linesAsDisplayNodes = linesAfterFirst.map(x => GameFramework.TalkNode.display(null, x));
                            for (var j = 0; j < linesAsDisplayNodes.length; j++) {
                                var nodeNew = linesAsDisplayNodes[j];
                                this.talkNodes.splice(i + j + 1, 0, nodeNew);
                            }
                            i += linesAsDisplayNodes.length;
                        }
                    }
                }
                return this;
            }
            talkNodeByName(nameOfTalkNodeToGet) {
                return this.talkNodesByName.get(nameOfTalkNodeToGet);
            }
            talkNodesByNames(namesOfTalkNodesToGet) {
                var returnNodes = [];
                for (var i = 0; i < namesOfTalkNodesToGet.length; i++) {
                    var nameOfTalkNodeToGet = namesOfTalkNodesToGet[i];
                    var talkNode = this.talkNodeByName(nameOfTalkNodeToGet);
                    returnNodes.push(talkNode);
                }
                return returnNodes;
            }
            expandFromContentTextString(contentTextString) {
                var contentText = contentTextString.value;
                var contentTextAsLines = contentText.split("\n");
                var tagToTextLinesLookup = new Map([]);
                var tagCurrent = null;
                var linesForTagCurrent;
                for (var i = 0; i < contentTextAsLines.length; i++) {
                    var contentLine = contentTextAsLines[i];
                    if (contentLine.startsWith("#")) {
                        if (tagCurrent != null) {
                            tagToTextLinesLookup.set(tagCurrent, linesForTagCurrent);
                        }
                        tagCurrent = contentLine.split("\t")[0];
                        linesForTagCurrent = [];
                    }
                    else {
                        if (contentLine.length > 0) {
                            linesForTagCurrent.push(contentLine);
                        }
                    }
                }
                tagToTextLinesLookup.set(tagCurrent, linesForTagCurrent);
                var talkNodeDefns = GameFramework.TalkNodeDefn.Instances()._AllByName;
                var talkNodeDefnNamesToExpand = [
                    talkNodeDefns.get("Display").name,
                    talkNodeDefns.get("Option").name,
                ];
                var talkNodesExpanded = [];
                for (var i = 0; i < this.talkNodes.length; i++) {
                    var talkNodeToExpand = this.talkNodes[i];
                    var talkNodeToExpandDefnName = talkNodeToExpand.defnName;
                    var shouldTalkNodeBeExpanded = talkNodeDefnNamesToExpand.some(x => x == talkNodeToExpandDefnName);
                    if (shouldTalkNodeBeExpanded == false) {
                        talkNodesExpanded.push(talkNodeToExpand);
                    }
                    else {
                        throw new Error("todo");
                        var tag = talkNodeToExpand.content;
                        var textLinesForTag = tagToTextLinesLookup.get(tag);
                        for (var j = 0; j < textLinesForTag.length; j++) {
                            var textLine = textLinesForTag[j];
                            var talkNodeExpanded = new GameFramework.TalkNode(talkNodeToExpand.name + "_" + j, talkNodeToExpandDefnName, textLine, talkNodeToExpand.next, talkNodeToExpand._isDisabled);
                            talkNodesExpanded.push(talkNodeExpanded);
                        }
                    }
                }
                this.talkNodes = talkNodesExpanded;
                this.talkNodesByName = GameFramework.ArrayHelper.addLookupsByName(this.talkNodes);
            }
            // Clonable.
            clone() {
                return new ConversationDefn(this.name, this.visualPortrait, this.talkNodeDefns.map(x => x.clone()), this.talkNodes.map(x => x.clone()));
            }
            // Serialization.
            static deserialize(conversationDefnAsJSON) {
                var conversationDefn = JSON.parse(conversationDefnAsJSON);
                // Additional processing to support minification.
                conversationDefn.name = conversationDefn["name"];
                var imagePortraitName = conversationDefn["imagePortraitName"];
                if (imagePortraitName == null) {
                    conversationDefn.visualPortrait = new GameFramework.VisualNone();
                }
                else {
                    conversationDefn.visualPortrait = new GameFramework.VisualImageFromLibrary(imagePortraitName);
                }
                var talkNodes = conversationDefn["talkNodes"];
                for (var i = 0; i < talkNodes.length; i++) {
                    var talkNode = talkNodes[i];
                    /*
                    talkNode.name = talkNode["name"];
                    talkNode.defnName = talkNode["defnName"];
                    talkNode.text = talkNode["text"];
                    talkNode.next = talkNode["next"];
                    talkNode.isDisabled = talkNode["isDisabled"];
                    */
                    Object.setPrototypeOf(talkNode, GameFramework.TalkNode.prototype);
                }
                Object.setPrototypeOf(conversationDefn, ConversationDefn.prototype);
                var talkNodes = conversationDefn.talkNodes;
                for (var i = 0; i < talkNodes.length; i++) {
                    var talkNode = talkNodes[i];
                    if (talkNode.name == null) {
                        talkNode.name = GameFramework.TalkNode.idNext();
                    }
                    if (talkNode.isDisabled != null) {
                        var scriptToRunAsString = "( (u, cr) => " + talkNode.isDisabled + " )";
                        var scriptToRun = eval(scriptToRunAsString);
                        talkNode._isDisabled = scriptToRun;
                    }
                }
                conversationDefn.talkNodes = talkNodes;
                /*
                conversationDefn.talkNodesByName = ArrayHelper.addLookupsByName(talkNodes);
                conversationDefn.talkNodeDefnsByName =
                    ArrayHelper.addLookupsByName(conversationDefn.talkNodeDefns);
                */
                conversationDefn.talkNodeDefns = GameFramework.TalkNodeDefn.Instances()._All;
                conversationDefn = conversationDefn.clone(); // hack
                return conversationDefn;
            }
            serialize() {
                var talkNodeDefnsToRestore = this.talkNodeDefns;
                delete this.talkNodeDefns;
                var returnValue = JSON.stringify(this, null, 4);
                this.talkNodeDefns = talkNodeDefnsToRestore;
                return returnValue;
            }
        }
        GameFramework.ConversationDefn = ConversationDefn;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
