"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ConversationDefn {
            constructor(name, contentTextStringName, soundMusicName, talkNodeDefns, talkNodes) {
                this.name = name;
                this.contentTextStringName = contentTextStringName;
                this.soundMusicName = soundMusicName;
                this.talkNodeDefns = talkNodeDefns;
                this.talkNodeDefnsByName = GameFramework.ArrayHelper.addLookupsByName(this.talkNodeDefns);
                this.talkNodes = talkNodes;
                this.talkNodesByName = GameFramework.ArrayHelper.addLookupsByName(this.talkNodes);
                var validationErrors = this.validateAndReturnErrors();
                if (validationErrors.length > 0) {
                    var errorMessage = "ConversationDefn '" + this.name + "' is not valid: " + validationErrors.join("; ") + ".";
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
                var nodesWithNoTypeSpecified = nodes.filter(x => x.defnName == null);
                if (nodesWithNoTypeSpecified.length > 0) {
                    var error = "one or more nodes have no type specified: "
                        + nodesWithNoTypeSpecified.map(x => x.name).join(", ");
                    errorsSoFar.push(error);
                }
                else {
                    var nodesWithUnrecognizedTypes = nodes.filter(x => this.talkNodeDefnsByName.has(x.defnName) == false);
                    if (nodesWithUnrecognizedTypes.length > 0) {
                        var defnNamesUnrecognized = nodesWithUnrecognizedTypes.map(x => x.defnName);
                        var error = "one or more nodes have unrecognized types: " + defnNamesUnrecognized.join(", ");
                        errorsSoFar.push(error);
                    }
                    var nodesWithNextFieldsThatDoNotCorrespondToNamesOfOtherNodes = nodes.filter(x => 
                    // Some node types use the next field to store a script or multiple node names.
                    x.defnName.startsWith("Variable") == false
                        && x.defnName.startsWith("DoNext") == false
                        && x.next != null
                        && nodes.some(y => y.name == x.next) == false);
                    if (nodesWithNextFieldsThatDoNotCorrespondToNamesOfOtherNodes.length > 0) {
                        var nextFieldsThatDoNotMatch = nodesWithNextFieldsThatDoNotCorrespondToNamesOfOtherNodes.map(x => x.next);
                        var error = "one or more nodes have next fields that do not correspond to the name of some other node: "
                            + nextFieldsThatDoNotMatch.join(", ");
                        errorsSoFar.push(error);
                    }
                    var nodesThatNeedButLackNextField = nodes.filter(x => (x.defnName.startsWith("DoNext")
                        || x.defnName == "DoRandom"
                        || x.defnName == "Option"
                        || x.defnName == "Goto"
                        || x.defnName == "OptionClear")
                        && x.next == null);
                    if (nodesThatNeedButLackNextField.length > 0) {
                        var nodesAsString = nodesThatNeedButLackNextField.map(x => x.toStringPipeSeparatedValues());
                        var error = "one or more nodes need but lack next fields: "
                            + nodesAsString.join(", ");
                        errorsSoFar.push(error);
                    }
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
                            var talkNodeExpanded = new GameFramework.TalkNode(talkNodeToExpand.name + "_" + j, talkNodeToExpandDefnName, textLine, talkNodeToExpand.next, talkNodeToExpand._isEnabled);
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
                return new ConversationDefn(this.name, this.contentTextStringName, this.soundMusicName, talkNodeDefnsCloned, talkNodesCloned);
            }
            // Serialization.
            static deserialize(conversationDefnAsText) {
                var returnValue;
                var newline = "\n";
                conversationDefnAsText =
                    conversationDefnAsText
                        .split(newline)
                        .filter(x => x.startsWith("//") == false)
                        .join(newline);
                var wasTextParsableAsJson;
                try {
                    JSON.parse(conversationDefnAsText);
                    wasTextParsableAsJson = true;
                }
                catch (err) {
                    wasTextParsableAsJson = false;
                }
                if (wasTextParsableAsJson) {
                    returnValue = ConversationDefn.fromJson(conversationDefnAsText);
                }
                else {
                    returnValue = ConversationDefn.fromPipeSeparatedValues(conversationDefnAsText);
                }
                return returnValue;
            }
            static fromPipeSeparatedValues(conversationDefnAsPsv) {
                var newline = "\n";
                // Convert any DOS-style line endings to Unix-style.
                conversationDefnAsPsv = conversationDefnAsPsv.split("\r\n").join(newline);
                // Remove any tabs.
                conversationDefnAsPsv = conversationDefnAsPsv.split("\t").join("");
                var blankLine = newline + newline;
                var indexOfFirstBlankLine = conversationDefnAsPsv.indexOf(blankLine);
                var header = conversationDefnAsPsv.substr(0, indexOfFirstBlankLine);
                var body = conversationDefnAsPsv.substr(indexOfFirstBlankLine);
                var conversationDefnName;
                var contentTextStringName;
                var soundMusicName;
                var headerLines = header.split(newline);
                headerLines = headerLines.map(x => x.indexOf("//") > 0 ? x.split("//")[0].trim() : x);
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
                    else if (fieldName == "soundMusicName") {
                        soundMusicName = fieldValue;
                    }
                    else {
                        // Ignore it.
                    }
                }
                var bodyLines = body.split(newline);
                var bodyLinesMinusComments = bodyLines.map(x => x.split("//")[0]);
                var bodyLinesNonBlank = bodyLinesMinusComments.filter(x => x.trim().length > 0);
                var bodyLinesAsTalkNodes = bodyLinesNonBlank.map(x => GameFramework.TalkNode.fromLinePipeSeparatedValues(x));
                var talkNodeDefns = GameFramework.TalkNodeDefn.Instances()._All;
                var returnValue = new ConversationDefn(conversationDefnName, contentTextStringName, soundMusicName, talkNodeDefns, bodyLinesAsTalkNodes);
                return returnValue;
            }
            static fromPipeSeparatedValues_DemoData() {
                // A sample conversation in pipe-separated value format.
                // This data is also present as /Content/Text/Conversation_psv.txt.
                var conversationDefnAsLines = [
                    "name=AnEveningWithProfessorSurly",
                    "",
                    "// name|defnName|content|next|isDisabled",
                    "",
                    "Greet|SpeakerSet|Friendly",
                    "|Display|Hi, I'm Professor Surly.",
                    "Subject|Display|What do you want to talk about?",
                    "|Option|Let's talk about math.|Math",
                    "|Option|Let's talk about science.|Science",
                    "Subject.History|Option|Let's talk about history.|History",
                    "Subject.Random|Option|Say something random.|CoinFlip",
                    "Subject.Carol|Option|We NEED to talk about Carol.|TalkOver|false",
                    "|Option|; drop database conversation_topics;|SQLInjection",
                    "|Option|Say, how do I play this game?|Game",
                    "|Option|Do you want to trade items?|Trade",
                    "|Option|Never mind. I hate you.|Quit",
                    "SubjectPrompt|Prompt",
                    "Math|Display|Math is too complicated...",
                    "|Display|...what with all those numbers.",
                    "|Goto||SubjectPrompt",
                    "Science|Display|Science is way too broad a subject.",
                    "|Display|I mean, what ISN'T science, really?",
                    "|Goto||SubjectPrompt",
                    "History|Push",
                    "|Display|Okay, but the past is pretty pointless.",
                    "|Display|What kind of history interests you?",
                    "|Option|Tell me about ancient times.|History.Ancient",
                    "|Option|Tell me about recent events.|History.Recent",
                    "|Option|I think we should talk about Carol.|History.Carol",
                    "|Option|Never mind.|History.NeverMind",
                    "|Prompt",
                    "History.Ancient|Display|That all happened a long time ago.",
                    "|Prompt",
                    "History.Recent|Display|If it's recent, is it really history?",
                    "|Prompt",
                    "History.Carol|Display|We are NEVER talking about Carol.",
                    "|Display|I don't want to talk about history anymore.",
                    "|Disable||Subject.History",
                    "|Enable||Subject.Carol",
                    "|Pop||Subject",
                    "History.NeverMind|Display|Fine, you're the one who brought it up.",
                    "|Pop||Subject",
                    "CoinFlip|Push",
                    "|Display|Uh, okay:",
                    "|Display|[Flips a coin.]",
                    "|VariableLoad|HeadsOrTails|u.randomizer.integerLessThan(2)",
                    "|Display|Heads.||cr.varGet('HeadsOrTails') != 0",
                    "|Display|Tails.||cr.varGet('HeadsOrTails') != 1",
                    "|Display|Was that random enough for you?",
                    "|Display|Now YOU say something random, smart guy.",
                    "|VariableLoad|SaySomethingRandomIndex|u.randomizer.integerLessThan(3)",
                    "|Option|Uhh... skibluhvwee.|CoinFlip.Done|cr.varGet('SaySomethingRandomIndex') != 0",
                    "|Option|Uhh... jib--jibbluhkuhjax.|CoinFlip.Done|cr.varGet('SaySomethingRandomIndex') != 1",
                    "|Option|My baloney... has no middle name.|CoinFlip.Done|cr.varGet('SaySomethingRandomIndex') != 2",
                    "|Option|I... can't.|CoinFlip.Done",
                    "|Prompt",
                    "CoinFlip.Done|Display|Yeah, that's what I figured.",
                    "|Pop",
                    "SQLInjection|Display|What are you--what's happening to me?",
                    "|Script|alert('ER-ROR!  ER-ROR!  DOES! NOT! COMPUTE!')",
                    "|Goto||Greet",
                    "Game|Push|GameDescription",
                    "GameDescription|Display|Well, it's kind of a moving target.",
                    "|Display|The rules and objectives keep changing...",
                    "|Display|...to say nothing of the bugs.",
                    "|Display|But basically, use the arrow keys to move.",
                    "|Display|If you move over the exit there...",
                    "|Display|...and press E, you'll go outside.",
                    "|Display|After that, uh, have adventures, I guess.",
                    "|Option|How do I win?|Game.Win",
                    "|Option|What buttons do I press?|Game.Controls",
                    "|Option|Any exciting gameplay mechanics?|Game.Mechanics",
                    "Game.GoWithMe.Option|Option|Will you go with me, to help?|Game.GoWithMe",
                    "|Option|Got any general tips?|Game.Tips",
                    "|Option|I never read the instructions!|Game.NeverMind",
                    "Game.Prompt|Prompt",
                    "Game.Win|Display|Last I heard?",
                    "|Display|Get five keys, touch the goal.",
                    "|Display|Whee.",
                    "|Display|Oh, and since the latest updates...",
                    "|Display|...you'll have to FIND the goal first.",
                    "|Goto||Game.Prompt",
                    "Game.Controls|Display|The arrow keys move you around.",
                    "|Display|The G key picks up any nearby items.",
                    "|Display|The E key interacts with things and people.",
                    "|Display|The F key uses a weapon, if one's equipped.",
                    "|Display|Tab or Escape brings up the menu.",
                    "|Display|Space jumps, if you've learned how.",
                    "|Display|There's SUPPOSED to be gamepad support...",
                    "|Display|...but it never gets tested.",
                    "|Goto||Game.Prompt",
                    "Game.Mechanics|Display|Not really.",
                    "|Display|You can pick stuff up.",
                    "|Display|You can then see what you've picked up...",
                    "|Display|...by going to the status screen...",
                    "|Display|...by pressing, I think, Tab?",
                    "|Display|You can also equip things from there.",
                    "|Display|If you can find and equip a gun and ammo...",
                    "|Display|...you can shoot the red guys...",
                    "|Display|...but they'll just keep coming forever.",
                    "|Display|The status screen also has a 'craft' tab...",
                    "|Display|...though there aren't many recipes yet.",
                    "|Display|For now I think you can upgrade armor.",
                    "|Display|Finally, there's a tab for skills...",
                    "|Display|...like jumping and running...",
                    "|Display|...which are available to learn...",
                    "|Display|...provided you already know the prereqs...",
                    "|Display|...and have enough experience.",
                    "|Display|You gain experience by killing 'monsters'...",
                    "|Display|...that makes YOU the real monster, though.",
                    "|Goto||Game.Prompt",
                    "Game.GoWithMe|Display|No, I'm pretty comfortable here.",
                    "|Display|But I'll give you a walkie-talkie...",
                    "|Display|...so I can provide valuable insights.",
                    "|Script|(u) => { u.world.placeCurrent.player().itemHolder().itemEntityAdd( new Entity(null, [ new Item('Walkie-Talkie', 1) ] ) ); }",
                    "|Display|[You have received a walkie-talkie.]",
                    "|Disable||Game.GoWithMe.Option",
                    "|Goto||Game.Prompt",
                    "Game.Tips|Display|Don't touch anything red.",
                    "|Display|Just in the game, I mean...",
                    "|Display|...not in, like, life.",
                    "|Goto||Game.Prompt",
                    "Game.NeverMind|Display|You were fun.  I'll miss you.",
                    "|Pop||Subject",
                    "Trade|Display|I guess so.  Got anything good?",
                    "|Script|u.venueNextSet(ItemBarterer.create().toControl(u, u.display.sizeInPixels, cr.p, cr.t, u.venueCurrent() ).toVenue() )",
                    "|Display|Well, that was mutually enriching.",
                    "|Goto||Subject",
                    "Quit|Display|Same to you, buddy.",
                    "TalkOver|Display|[This conversation is over.]",
                    "|Quit"
                ];
                var newline = "\n";
                var conversationDefnAsString = conversationDefnAsLines.join(newline);
                return conversationDefnAsString;
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
                        var scripts = GameFramework.Script.Instances();
                        var scriptToRun = talkNode.isDisabled
                            ? scripts.ReturnFalse
                            : scripts.ReturnTrue;
                        talkNode._isEnabled = scriptToRun;
                    }
                }
                conversationDefn.talkNodes = talkNodes;
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
            toPipeSeparatedValues() {
                var lines = [];
                if (this.name != null) {
                    lines.push("name=" + this.name);
                }
                if (this.contentTextStringName != null) {
                    lines.push("contentTextStringName=" + this.contentTextStringName);
                }
                if (this.soundMusicName != null) {
                    lines.push("soundMusicName=" + this.soundMusicName);
                }
                lines.push("");
                var talkNodesAsLines = this.talkNodes.map(x => x.toPipeSeparatedValues());
                lines.push(...talkNodesAsLines);
                var newline = "\n";
                var returnValue = lines.join(newline);
                return returnValue;
            }
        }
        GameFramework.ConversationDefn = ConversationDefn;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
