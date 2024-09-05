"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ConversationDefn {
            constructor(name, contentTextStringName, visualPortrait, soundMusicName, talkNodeDefns, talkNodes) {
                this.name = name;
                this.contentTextStringName = contentTextStringName;
                this.visualPortrait = visualPortrait;
                this.soundMusicName = soundMusicName;
                this.talkNodeDefns = talkNodeDefns;
                this.talkNodeDefnsByName = GameFramework.ArrayHelper.addLookupsByName(this.talkNodeDefns);
                this.talkNodes = talkNodes;
                this.talkNodesByName = GameFramework.ArrayHelper.addLookupsByName(this.talkNodes);
                var validationErrors = this.validateAndReturnErrors();
                if (validationErrors.length > 0) {
                    var errorMessage = "ConversationDefn '" + this.name + "'is not valid: " + validationErrors.join("; ") + ".";
                    throw new Error(errorMessage);
                }
            }
            contentSubstitute(contentByNodeName) {
                this.talkNodes.forEach(talkNode => {
                    var talkNodeName = talkNode.name;
                    if (talkNodeName != null
                        && talkNodeName.startsWith("_") == false
                        && contentByNodeName.has(talkNodeName)) {
                        talkNode.content = contentByNodeName.get(talkNodeName);
                    }
                    else if (contentByNodeName.has(talkNode.content)) {
                        talkNode.content = contentByNodeName.get(talkNode.content);
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
            validateAndReturnErrors() {
                var errorsSoFar = [];
                var nodes = this.talkNodes;
                var nodesWithUnrecognizedTypes = nodes.filter(x => this.talkNodeDefnsByName.has(x.defnName) == false);
                if (nodesWithUnrecognizedTypes.length > 0) {
                    var defnNamesUnrecognized = nodesWithUnrecognizedTypes.map(x => x.defnName);
                    var error = "one or more nodes have unrecognized types: " + defnNamesUnrecognized.join(", ");
                    errorsSoFar.push(error);
                }
                var nodesWithNextFieldsThatDoNotCorrespondToNamesOfOtherNodes = nodes.filter(x => x.defnName.startsWith("Variable") == false // Some of these use the next field to store a script.
                    && x.next != null
                    && nodes.some(y => y.name == x.next) == false);
                if (nodesWithNextFieldsThatDoNotCorrespondToNamesOfOtherNodes.length > 0) {
                    var nextFieldsThatDoNotMatch = nodesWithNextFieldsThatDoNotCorrespondToNamesOfOtherNodes.map(x => x.next);
                    var error = "one or more nodes have next fields that do not correspond to the name of some other node: "
                        + nextFieldsThatDoNotMatch.join(", ");
                    errorsSoFar.push(error);
                }
                return errorsSoFar;
            }
            // Content expansion.
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
                var talkNodeDefnsCloned = this.talkNodeDefns.map(x => x.clone());
                var talkNodesCloned = this.talkNodes.map(x => x.clone());
                return new ConversationDefn(this.name, this.contentTextStringName, this.visualPortrait, this.soundMusicName, talkNodeDefnsCloned, talkNodesCloned);
            }
            // Serialization.
            static deserialize(conversationDefnAsText) {
                var returnValue;
                try {
                    returnValue = ConversationDefn.fromJson(conversationDefnAsText);
                }
                catch (err) {
                    returnValue = ConversationDefn.fromPipeSeparatedValues(conversationDefnAsText);
                }
                return returnValue;
            }
            static fromPipeSeparatedValues(conversationDefnAsPsv) {
                var newline = "\n";
                conversationDefnAsPsv = conversationDefnAsPsv.split("\r\n").join(newline);
                var blankLine = newline + newline;
                var indexOfFirstBlankLine = conversationDefnAsPsv.indexOf(blankLine);
                var header = conversationDefnAsPsv.substr(0, indexOfFirstBlankLine);
                var body = conversationDefnAsPsv.substr(indexOfFirstBlankLine);
                var conversationDefnName;
                var contentTextStringName;
                var imagePortraitName;
                var soundMusicName;
                var headerLines = header.split(newline);
                for (var i = 0; i < headerLines.length; i++) {
                    var headerLine = headerLines[i];
                    var fieldNameAndValue = headerLine.split("=");
                    var fieldName = fieldNameAndValue[0];
                    var fieldValue = fieldNameAndValue[1];
                    if (fieldName == "name") {
                        conversationDefnName = fieldValue;
                    }
                    else if (fieldName == "contentTextStringName") {
                        contentTextStringName = fieldValue;
                    }
                    else if (fieldName == "imagePortraitName") {
                        imagePortraitName = fieldValue;
                    }
                    else if (fieldName == "soundMusicName") {
                        soundMusicName = fieldValue;
                    }
                    else {
                        // Ignore it.
                    }
                }
                var visualPortrait = new GameFramework.VisualImageFromLibrary(imagePortraitName);
                var bodyLines = body.split(newline);
                var bodyLinesMinusComments = bodyLines.map(x => x.split("//")[0]);
                var bodyLinesNonBlank = bodyLinesMinusComments.filter(x => x.trim().length > 0);
                var bodyLinesAsTalkNodes = bodyLinesNonBlank.map(x => GameFramework.TalkNode.fromLinePipeSeparatedValues(x));
                var talkNodeDefns = GameFramework.TalkNodeDefn.Instances()._All;
                var returnValue = new ConversationDefn(conversationDefnName, contentTextStringName, visualPortrait, // todo
                soundMusicName, talkNodeDefns, bodyLinesAsTalkNodes);
                return returnValue;
            }
            static fromJson(conversationDefnAsJson) {
                var conversationDefn = JSON.parse(conversationDefnAsJson);
                // Additional processing to support minification.
                conversationDefn.name = conversationDefn["name"];
                conversationDefn.contentTextStringName = conversationDefn["contentTextStringName"];
                var imagePortraitName = conversationDefn["imagePortraitName"];
                if (imagePortraitName == null) {
                    conversationDefn.visualPortrait = new GameFramework.VisualNone();
                }
                else {
                    conversationDefn.visualPortrait = new GameFramework.VisualImageFromLibrary(imagePortraitName);
                }
                var soundMusicName = conversationDefn["soundMusicName"];
                if (soundMusicName == null) {
                    conversationDefn.soundMusic = new GameFramework.SoundNone();
                }
                else {
                    conversationDefn.soundMusic = new GameFramework.SoundFromLibrary(soundMusicName);
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
