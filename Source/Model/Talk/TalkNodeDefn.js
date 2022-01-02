"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class TalkNodeDefn {
            constructor(name, execute) {
                this.name = name;
                this.execute = execute;
            }
            static Instances() {
                if (TalkNodeDefn._instances == null) {
                    TalkNodeDefn._instances = new TalkNodeDefn_Instances();
                }
                return TalkNodeDefn._instances;
            }
            // Clonable.
            clone() {
                return new TalkNodeDefn(this.name, this.execute);
            }
        }
        GameFramework.TalkNodeDefn = TalkNodeDefn;
        class TalkNodeDefn_Instances {
            constructor() {
                this.Disable = new TalkNodeDefn("Disable", (universe, conversationRun) => // execute
                 {
                    var talkNode = conversationRun.talkNodeCurrent();
                    var talkNodesToDisablePrefixesJoined = talkNode.content;
                    var talkNodesToDisablePrefixes = talkNodesToDisablePrefixesJoined.split(",");
                    var talkNodesToDisableAsArrays = talkNodesToDisablePrefixes.map(prefix => conversationRun.nodesByPrefix(prefix));
                    var talkNodesToDisable = GameFramework.ArrayHelper.flattenArrayOfArrays(talkNodesToDisableAsArrays);
                    talkNodesToDisable.forEach(talkNodeToDisable => conversationRun.disable(talkNodeToDisable.name));
                    conversationRun.talkNodeAdvance(universe);
                    conversationRun.talkNodeCurrentExecute(universe);
                });
                this.Display = new TalkNodeDefn("Display", (universe, conversationRun) => // execute
                 {
                    var scope = conversationRun.scopeCurrent;
                    var talkNode = conversationRun.talkNodeCurrent();
                    talkNode.contentVariablesSubstitute(conversationRun);
                    scope.displayTextCurrent = talkNode.content;
                    conversationRun.talkNodeGoToNext(universe);
                    conversationRun.talkNodesForTranscript.push(talkNode);
                });
                this.DoNothing = new TalkNodeDefn("DoNothing", (universe, conversationRun) => // execute
                 {
                    conversationRun.talkNodeAdvance(universe);
                    conversationRun.talkNodeCurrentExecute(universe);
                });
                this.Enable = new TalkNodeDefn("Enable", (universe, conversationRun) => // execute
                 {
                    var talkNode = conversationRun.talkNodeCurrent();
                    var talkNodesToEnablePrefixesJoined = talkNode.content;
                    var talkNodesToEnablePrefixes = talkNodesToEnablePrefixesJoined.split(",");
                    var talkNodesToEnableAsArrays = talkNodesToEnablePrefixes.map(prefix => conversationRun.nodesByPrefix(prefix));
                    var talkNodesToEnable = GameFramework.ArrayHelper.flattenArrayOfArrays(talkNodesToEnableAsArrays);
                    talkNodesToEnable.forEach(talkNodeToEnable => conversationRun.enable(talkNodeToEnable.name));
                    conversationRun.talkNodeAdvance(universe);
                    conversationRun.talkNodeCurrentExecute(universe);
                });
                this.Goto = new TalkNodeDefn("Goto", (universe, conversationRun) => // execute
                 {
                    var talkNode = conversationRun.talkNodeCurrent();
                    var talkNodeNameNext = talkNode.next;
                    conversationRun.goto(talkNodeNameNext, universe);
                });
                this.JumpIfFalse = new TalkNodeDefn("JumpIfFalse", (universe, conversationRun) => // execute
                 {
                    var talkNode = conversationRun.talkNodeCurrent();
                    var variableName = talkNode.content;
                    var talkNodeNameToJumpTo = talkNode.next;
                    var variableValue = conversationRun.variableByName(variableName);
                    if (variableValue == true) {
                        conversationRun.talkNodeAdvance(universe);
                    }
                    else {
                        var nodeNext = conversationRun.defn.talkNodeByName(talkNodeNameToJumpTo);
                        conversationRun.talkNodeCurrentSet(nodeNext);
                    }
                    conversationRun.talkNodeCurrentExecute(universe);
                });
                this.JumpIfTrue = new TalkNodeDefn("JumpIfTrue", (universe, conversationRun) => // execute
                 {
                    var talkNode = conversationRun.talkNodeCurrent();
                    var variableName = talkNode.content;
                    var talkNodeNameToJumpTo = talkNode.next;
                    var variableValue = conversationRun.variableByName(variableName);
                    if (variableValue == true) {
                        var nodeNext = conversationRun.defn.talkNodeByName(talkNodeNameToJumpTo);
                        conversationRun.talkNodeCurrentSet(nodeNext);
                    }
                    else {
                        conversationRun.talkNodeAdvance(universe);
                    }
                    conversationRun.talkNodeCurrentExecute(universe);
                });
                this.Option = new TalkNodeDefn("Option", (universe, conversationRun) => // execute
                 {
                    var scope = conversationRun.scopeCurrent;
                    var talkNode = conversationRun.talkNodeCurrent();
                    var talkNodesForOptions = scope.talkNodesForOptions;
                    if (talkNodesForOptions.indexOf(talkNode) == -1) {
                        talkNodesForOptions.push(talkNode);
                        scope.talkNodesForOptionsByName.set(talkNode.name, talkNode);
                    }
                    conversationRun.talkNodeAdvance(universe);
                    conversationRun.talkNodeCurrentExecute(universe);
                });
                this.Pop = new TalkNodeDefn("Pop", (universe, conversationRun) => // execute
                 {
                    var scope = conversationRun.scopeCurrent;
                    var talkNode = conversationRun.talkNodeCurrent();
                    scope = scope.parent;
                    conversationRun.scopeCurrent = scope;
                    if (talkNode.next != null) {
                        var nodeNext = conversationRun.defn.talkNodeByName(talkNode.next);
                        conversationRun.talkNodeCurrentSet(nodeNext);
                    }
                    conversationRun.talkNodeCurrentExecute(universe);
                });
                this.Prompt = new TalkNodeDefn("Prompt", (universe, conversationRun) => // execute
                 {
                    var scope = conversationRun.scopeCurrent;
                    scope.isPromptingForResponse = true;
                });
                this.Push = new TalkNodeDefn("Push", (universe, conversationRun) => // execute
                 {
                    var talkNodeToPushTo = conversationRun.talkNodeNext();
                    var talkNodeToReturnTo = conversationRun.talkNodePrev();
                    conversationRun.talkNodeCurrentSet(talkNodeToReturnTo);
                    conversationRun.scopeCurrent = new GameFramework.ConversationScope(conversationRun.scopeCurrent, // parent
                    talkNodeToPushTo, [] // options
                    );
                    conversationRun.talkNodeCurrentExecute(universe);
                });
                this.Quit = new TalkNodeDefn("Quit", (universe, conversationRun) => // execute
                 {
                    conversationRun.quit(universe);
                });
                this.Random = new TalkNodeDefn("Random", (universe, conversationRun) => // execute
                 {
                    conversationRun.talkNodeAdvance(universe);
                    var node = conversationRun.talkNodeCurrent();
                    var nodeDefnName = node.defnName;
                    var nodeDefnNameFirst = nodeDefnName;
                    var nodesToChooseBetween = [];
                    var nodesToRestoreFrom = [];
                    while (nodeDefnName == nodeDefnNameFirst) {
                        if (node.isEnabled(universe, conversationRun)) {
                            nodesToRestoreFrom.push(node.clone());
                            node.disable();
                            nodesToChooseBetween.push(node);
                        }
                        conversationRun.talkNodeAdvance(universe);
                        node = conversationRun.talkNodeCurrent();
                        nodeDefnName = node.defnName;
                    }
                    var nodeNextAfterNodesToChooseBetween = node;
                    var randomNumber = universe.randomizer.getNextRandom();
                    var nodeIndex = Math.floor(randomNumber * nodesToChooseBetween.length);
                    var nodeChosenAtRandom = nodesToChooseBetween[nodeIndex];
                    nodeChosenAtRandom.enable();
                    conversationRun.talkNodeCurrentSet(nodeChosenAtRandom);
                    nodeChosenAtRandom.execute(universe, conversationRun, conversationRun.scopeCurrent);
                    conversationRun.talkNodeCurrentSet(nodeNextAfterNodesToChooseBetween);
                    for (var i = 0; i < nodesToChooseBetween.length; i++) {
                        var nodeToBeRestored = nodesToChooseBetween[i];
                        var nodeToRestoreFrom = nodesToRestoreFrom[i];
                        nodeToBeRestored.overwriteWith(nodeToRestoreFrom);
                    }
                });
                this.Script = new TalkNodeDefn("Script", (universe, conversationRun) => // execute
                 {
                    var talkNode = conversationRun.talkNodeCurrent();
                    var scriptToRunAsString = "( (u, cr) => " + talkNode.content + ")";
                    var scriptToRun = eval(scriptToRunAsString);
                    scriptToRun(universe, conversationRun);
                    conversationRun.talkNodeGoToNext(universe);
                    conversationRun.talkNodeCurrentExecute(universe); // hack
                });
                this.Switch = new TalkNodeDefn("Switch", (universe, conversationRun) => // execute
                 {
                    var talkNode = conversationRun.talkNodeCurrent();
                    var variableName = talkNode.content;
                    var variableValueActual = conversationRun.variableByName(variableName);
                    var variableValueAndNodeNextNamePairs = talkNode.next.split(";").map(x => x.split(":"));
                    var talkNodeNextName = variableValueAndNodeNextNamePairs.find(x => x[0] == variableValueActual)[1];
                    conversationRun.goto(talkNodeNextName, universe);
                });
                this.VariableLoad = new TalkNodeDefn("VariableLoad", (universe, conversationRun) => // execute
                 {
                    var talkNode = conversationRun.talkNodeCurrent();
                    var variableName = talkNode.content;
                    var scriptExpression = talkNode.next;
                    var scriptToRunAsString = "( (u, cr) => " + scriptExpression + " )";
                    var scriptToRun = eval(scriptToRunAsString);
                    var scriptResult = scriptToRun(universe, conversationRun);
                    conversationRun.variableSet(variableName, scriptResult);
                    conversationRun.talkNodeAdvance(universe);
                    conversationRun.talkNodeCurrentExecute(universe); // hack
                });
                this.VariableSet = new TalkNodeDefn("VariableSet", (universe, conversationRun) => // execute
                 {
                    var talkNode = conversationRun.talkNodeCurrent();
                    var variableName = talkNode.content;
                    var variableValue = talkNode.next;
                    conversationRun.variableSet(variableName, variableValue);
                    conversationRun.talkNodeAdvance(universe);
                    conversationRun.talkNodeCurrentExecute(universe); // hack
                });
                this.VariableStore = new TalkNodeDefn("VariableStore", (universe, conversationRun) => // execute
                 {
                    var talkNode = conversationRun.talkNodeCurrent();
                    var variableName = talkNode.content;
                    var variableValue = conversationRun.variableByName(variableName).toString();
                    var scriptExpression = talkNode.next;
                    var scriptExpressionWithValue = scriptExpression.split("$value").join(variableValue);
                    var scriptToRunAsString = "( (u, cr) => { " + scriptExpressionWithValue + "; } )";
                    var scriptToRun = eval(scriptToRunAsString);
                    scriptToRun(universe, conversationRun);
                    conversationRun.talkNodeAdvance(universe);
                    conversationRun.talkNodeCurrentExecute(universe); // hack
                });
                this._All =
                    [
                        this.Disable,
                        this.Display,
                        this.DoNothing,
                        this.Enable,
                        this.Goto,
                        this.JumpIfFalse,
                        this.JumpIfTrue,
                        this.Option,
                        this.Pop,
                        this.Prompt,
                        this.Push,
                        this.Quit,
                        this.Random,
                        this.Script,
                        this.Switch,
                        this.VariableLoad,
                        this.VariableSet,
                        this.VariableStore,
                    ];
                this._AllByName = GameFramework.ArrayHelper.addLookupsByName(this._All);
            }
        }
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
