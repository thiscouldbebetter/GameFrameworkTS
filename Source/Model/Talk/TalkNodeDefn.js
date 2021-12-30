"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class TalkNodeDefn {
            constructor(name, execute, activate) {
                this.name = name;
                this.execute = execute;
                this.activate = activate;
            }
            static Instances() {
                if (TalkNodeDefn._instances == null) {
                    TalkNodeDefn._instances = new TalkNodeDefn_Instances();
                }
                return TalkNodeDefn._instances;
            }
            // Clonable.
            clone() {
                return new TalkNodeDefn(this.name, this.execute, this.activate);
            }
        }
        GameFramework.TalkNodeDefn = TalkNodeDefn;
        class TalkNodeDefn_Instances {
            constructor() {
                this.Disable = new TalkNodeDefn("Disable", (universe, conversationRun, scope, talkNode) => // execute
                 {
                    var talkNodesToDisablePrefixesJoined = talkNode.content;
                    var talkNodesToDisablePrefixes = talkNodesToDisablePrefixesJoined.split(",");
                    var talkNodesToDisableAsArrays = talkNodesToDisablePrefixes.map(prefix => conversationRun.nodesByPrefix(prefix));
                    var talkNodesToDisable = GameFramework.ArrayHelper.flattenArrayOfArrays(talkNodesToDisableAsArrays);
                    talkNodesToDisable.forEach(talkNodeToDisable => conversationRun.disable(talkNodeToDisable.name));
                    scope.talkNodeAdvance(universe, conversationRun);
                    conversationRun.update(universe);
                }, null // activate
                );
                this.Display = new TalkNodeDefn("Display", (universe, conversationRun, scope, talkNode) => // execute
                 {
                    scope.displayTextCurrent =
                        talkNode.content;
                    scope.talkNodeNextSpecifiedOrAdvance(universe, conversationRun);
                    conversationRun.talkNodesForTranscript.push(talkNode);
                }, null // activate
                );
                this.DoNothing = new TalkNodeDefn("DoNothing", (universe, conversationRun, scope, talkNode) => // execute
                 {
                    scope.talkNodeAdvance(universe, conversationRun);
                    conversationRun.update(universe);
                }, null // activate
                );
                this.Enable = new TalkNodeDefn("Enable", (universe, conversationRun, scope, talkNode) => // execute
                 {
                    var talkNodesToEnablePrefixesJoined = talkNode.content;
                    var talkNodesToEnablePrefixes = talkNodesToEnablePrefixesJoined.split(",");
                    var talkNodesToEnableAsArrays = talkNodesToEnablePrefixes.map(prefix => conversationRun.nodesByPrefix(prefix));
                    var talkNodesToEnable = GameFramework.ArrayHelper.flattenArrayOfArrays(talkNodesToEnableAsArrays);
                    talkNodesToEnable.forEach(talkNodeToEnable => conversationRun.enable(talkNodeToEnable.name));
                    scope.talkNodeAdvance(universe, conversationRun);
                    conversationRun.update(universe);
                }, null // activate
                );
                this.Goto = new TalkNodeDefn("Goto", (universe, conversationRun, scope, talkNode) => // execute
                 {
                    var talkNodeNameNext = talkNode.next;
                    conversationRun.goto(talkNodeNameNext, universe);
                }, null // activate
                );
                this.JumpIfFalse = new TalkNodeDefn("JumpIfFalse", (universe, conversationRun, scope, talkNode) => // execute
                 {
                    var variableName = talkNode.content;
                    var talkNodeNameToJumpTo = talkNode.next;
                    var variableValue = conversationRun.variableByName(variableName);
                    if (variableValue == true) {
                        scope.talkNodeAdvance(universe, conversationRun);
                    }
                    else {
                        scope.talkNodeCurrent = conversationRun.defn.talkNodeByName(talkNodeNameToJumpTo);
                    }
                    conversationRun.update(universe);
                }, null // activate
                );
                this.JumpIfTrue = new TalkNodeDefn("JumpIfTrue", (universe, conversationRun, scope, talkNode) => // execute
                 {
                    var variableName = talkNode.content;
                    var talkNodeNameToJumpTo = talkNode.next;
                    var variableValue = conversationRun.variableByName(variableName);
                    if (variableValue == true) {
                        scope.talkNodeCurrent = conversationRun.defn.talkNodeByName(talkNodeNameToJumpTo);
                    }
                    else {
                        scope.talkNodeAdvance(universe, conversationRun);
                    }
                    conversationRun.update(universe);
                }, null // activate
                );
                this.Option = new TalkNodeDefn("Option", (universe, conversationRun, scope, talkNode) => // execute
                 {
                    var talkNodesForOptions = scope.talkNodesForOptions;
                    if (talkNodesForOptions.indexOf(talkNode) == -1) {
                        talkNodesForOptions.push(talkNode);
                        scope.talkNodesForOptionsByName.set(talkNode.name, talkNode);
                    }
                    scope.talkNodeAdvance(universe, conversationRun);
                    conversationRun.update(universe);
                }, (conversationRun, scope, talkNode) => // activate
                 {
                    scope.isPromptingForResponse = false;
                    //scope.talkNodesForOptions.length = 0;
                    var nameOfTalkNodeNext = talkNode.next;
                    var talkNodeNext = conversationRun.defn.talkNodeByName(nameOfTalkNodeNext);
                    scope.talkNodeCurrent = talkNodeNext;
                    conversationRun.talkNodesForTranscript.push(talkNode);
                });
                this.Pop = new TalkNodeDefn("Pop", (universe, conversationRun, scope, talkNode) => // execute
                 {
                    var scope = scope.parent;
                    conversationRun.scopeCurrent = scope;
                    if (talkNode.next != null) {
                        scope.talkNodeCurrent = conversationRun.defn.talkNodeByName(talkNode.next);
                    }
                    conversationRun.update(universe);
                }, null // activate
                );
                this.Prompt = new TalkNodeDefn("Prompt", (universe, conversationRun, scope, talkNode) => // execute
                 {
                    scope.isPromptingForResponse = true;
                }, (conversationRun, scope, talkNode) => // activate
                 {
                    var shouldClearOptions = talkNode.content;
                    if (shouldClearOptions) {
                        scope.talkNodesForOptions.length = 0;
                    }
                });
                this.Push = new TalkNodeDefn("Push", (universe, conversationRun, scope, talkNode) => // execute
                 {
                    var runDefn = conversationRun.defn;
                    var talkNodeIndex = runDefn.talkNodes.indexOf(talkNode);
                    var talkNodeToReturnTo = runDefn.talkNodes[talkNodeIndex + 1];
                    scope.talkNodeCurrent = talkNodeToReturnTo;
                    var talkNodeToPushTo = runDefn.talkNodeByName(talkNode.next);
                    conversationRun.scopeCurrent = new GameFramework.ConversationScope(scope, // parent
                    talkNodeToPushTo, [] // options
                    );
                    conversationRun.update(universe);
                }, null // activate
                );
                this.Quit = new TalkNodeDefn("Quit", (universe, conversationRun, scope, talkNode) => // execute
                 {
                    conversationRun.quit(universe);
                }, null // activate
                );
                this.Script = new TalkNodeDefn("Script", (universe, conversationRun, scope, talkNode) => // execute
                 {
                    var scriptToRunAsString = "(" + talkNode.content + ")";
                    var scriptToRun = eval(scriptToRunAsString);
                    scriptToRun(universe, conversationRun);
                    scope.talkNodeNextSpecifiedOrAdvance(universe, conversationRun);
                    conversationRun.update(universe); // hack
                }, null // activate
                );
                this.Switch = new TalkNodeDefn("Switch", (universe, conversationRun, scope, talkNode) => // execute
                 {
                    var variableName = talkNode.content;
                    var variableValueActual = conversationRun.variableByName(variableName);
                    var variableValueAndNodeNextNamePairs = talkNode.next.split(";").map(x => x.split(":"));
                    var talkNodeNextName = variableValueAndNodeNextNamePairs.find(x => x[0] == variableValueActual)[1];
                    conversationRun.goto(talkNodeNextName, universe);
                }, (conversationRun, scope, talkNode) => // activate
                 {
                    var shouldClearOptions = talkNode.content;
                    if (shouldClearOptions == "true") {
                        scope.talkNodesForOptions.length = 0;
                    }
                });
                this.VariableLoad = new TalkNodeDefn("VariableLoad", (universe, conversationRun, scope, talkNode) => // execute
                 {
                    var variableName = talkNode.content;
                    var scriptExpression = talkNode.next;
                    var scriptToRunAsString = "( (u, cr) => " + scriptExpression + " )";
                    var scriptToRun = eval(scriptToRunAsString);
                    var scriptResult = scriptToRun(universe, conversationRun);
                    conversationRun.variableSet(variableName, scriptResult);
                    scope.talkNodeAdvance(universe, conversationRun);
                    conversationRun.update(universe); // hack
                }, null // activate
                );
                this.VariableSet = new TalkNodeDefn("VariableSet", (universe, conversationRun, scope, talkNode) => // execute
                 {
                    var variableName = talkNode.content;
                    var variableValue = talkNode.next;
                    conversationRun.variableSet(variableName, variableValue);
                    scope.talkNodeAdvance(universe, conversationRun);
                    conversationRun.update(universe); // hack
                }, null // activate
                );
                this.VariableStore = new TalkNodeDefn("VariableStore", (universe, conversationRun, scope, talkNode) => // execute
                 {
                    var variableName = talkNode.content;
                    var variableValue = conversationRun.variableByName(variableName).toString();
                    var scriptExpression = talkNode.next;
                    var scriptExpressionWithValue = scriptExpression.split("[value]").join(variableValue);
                    var scriptToRunAsString = "( (u, cr) => { " + scriptExpressionWithValue + "; } )";
                    var scriptToRun = eval(scriptToRunAsString);
                    scriptToRun(universe, conversationRun);
                    scope.talkNodeAdvance(universe, conversationRun);
                    conversationRun.update(universe); // hack
                }, null // activate
                );
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
