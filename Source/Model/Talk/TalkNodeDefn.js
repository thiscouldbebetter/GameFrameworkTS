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
                var tnd = (n, e) => new TalkNodeDefn(n, e);
                this.Disable = tnd("Disable", this.disable);
                this.Display = tnd("Display", this.display);
                this.DoNothing = tnd("DoNothing", this.doNothing);
                this.Enable = tnd("Enable", this.enable);
                this.Goto = tnd("Goto", this.goto);
                this.JumpIfFalse = tnd("JumpIfFalse", this.jumpIfFalse);
                this.JumpIfTrue = tnd("JumpIfTrue", this.jumpIfTrue);
                this.Option = tnd("Option", this.option);
                this.OptionRemove = tnd("OptionRemove", this.optionRemove);
                this.OptionsClear = tnd("OptionsClear", this.optionsClear);
                this.Pop = tnd("Pop", this.pop);
                this.Prompt = tnd("Prompt", this.prompt);
                this.Push = tnd("Push", this.push);
                this.Quit = tnd("Quit", this.quit);
                this.Script = tnd("Script", this.script);
                this.Switch = tnd("Switch", this._switch);
                this.VariableAdd = tnd("VariableAdd", this.variableAdd);
                this.VariableLoad = tnd("VariableLoad", this.variableLoad);
                this.VariableSet = tnd("VariableSet", this.variableSet);
                this.VariableStore = tnd("VariableStore", this.variableStore);
                this.VariablesExport = tnd("VariablesExport", this.variablesExport);
                this.VariablesImport = tnd("VariablesImport", this.variablesImport);
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
                        this.OptionRemove,
                        this.OptionsClear,
                        this.Pop,
                        this.Prompt,
                        this.Push,
                        this.Quit,
                        this.Script,
                        this.Switch,
                        this.VariableAdd,
                        this.VariableLoad,
                        this.VariableSet,
                        this.VariableStore,
                        this.VariablesExport,
                        this.VariablesImport
                    ];
                this._AllByName = GameFramework.ArrayHelper.addLookupsByName(this._All);
            }
            disable(universe, conversationRun) {
                var talkNode = conversationRun.talkNodeCurrent();
                var talkNodesToDisablePrefixesJoined = talkNode.next;
                var talkNodesToDisablePrefixes = talkNodesToDisablePrefixesJoined.split(",");
                var talkNodesToDisableAsArrays = talkNodesToDisablePrefixes.map(prefix => conversationRun.nodesByPrefix(prefix));
                var talkNodesToDisable = GameFramework.ArrayHelper.flattenArrayOfArrays(talkNodesToDisableAsArrays);
                talkNodesToDisable.forEach(talkNodeToDisable => conversationRun.disable(talkNodeToDisable.name));
                conversationRun.talkNodeAdvance(universe);
                conversationRun.talkNodeCurrentExecute(universe);
            }
            display(universe, conversationRun) {
                var scope = conversationRun.scopeCurrent;
                var talkNode = conversationRun.talkNodeCurrent();
                talkNode.contentVariablesSubstitute(conversationRun);
                if (scope.displayLinesCurrent == null) {
                    scope.displayLinesCurrent = talkNode.content.split("\n");
                }
                scope.displayTextCurrentAdvance();
                var displayTextCurrent = scope.displayTextCurrent();
                if (displayTextCurrent == null) {
                    scope.displayLinesCurrent = null;
                    conversationRun.talkNodeGoToNext(universe);
                    conversationRun.talkNodeCurrentExecute(universe);
                }
                else {
                    var nodeForTranscript = GameFramework.TalkNode.display(null, displayTextCurrent);
                    conversationRun.talkNodesForTranscript.push(nodeForTranscript);
                }
            }
            doNothing(universe, conversationRun) {
                conversationRun.talkNodeAdvance(universe);
                conversationRun.talkNodeCurrentExecute(universe);
            }
            enable(universe, conversationRun) {
                var talkNode = conversationRun.talkNodeCurrent();
                var talkNodesToEnablePrefixesJoined = talkNode.next;
                var talkNodesToEnablePrefixes = talkNodesToEnablePrefixesJoined.split(",");
                var talkNodesToEnableAsArrays = talkNodesToEnablePrefixes.map(prefix => conversationRun.nodesByPrefix(prefix));
                var talkNodesToEnable = GameFramework.ArrayHelper.flattenArrayOfArrays(talkNodesToEnableAsArrays);
                talkNodesToEnable.forEach(talkNodeToEnable => conversationRun.enable(talkNodeToEnable.name));
                conversationRun.talkNodeAdvance(universe);
                conversationRun.talkNodeCurrentExecute(universe);
            }
            goto(universe, conversationRun) {
                var talkNode = conversationRun.talkNodeCurrent();
                var talkNodeNameNext = talkNode.next;
                conversationRun.goto(talkNodeNameNext, universe);
            }
            jumpIfFalse(universe, conversationRun) {
                var talkNode = conversationRun.talkNodeCurrent();
                var variableName = talkNode.content;
                var talkNodeNameToJumpTo = talkNode.next;
                var variableValue = conversationRun.variableByName(variableName);
                var variableValueAsString = variableValue == null ? null : variableValue.toString();
                if (variableValueAsString == "true") {
                    conversationRun.talkNodeAdvance(universe);
                }
                else {
                    var nodeNext = conversationRun.defn.talkNodeByName(talkNodeNameToJumpTo);
                    conversationRun.talkNodeCurrentSet(nodeNext);
                }
                conversationRun.talkNodeCurrentExecute(universe);
            }
            jumpIfTrue(universe, conversationRun) {
                var talkNode = conversationRun.talkNodeCurrent();
                var variableName = talkNode.content;
                var talkNodeNameToJumpTo = talkNode.next;
                var variableValue = conversationRun.variableByName(variableName);
                var variableValueAsString = variableValue == null ? null : variableValue.toString();
                if (variableValueAsString == "true") {
                    var nodeNext = conversationRun.defn.talkNodeByName(talkNodeNameToJumpTo);
                    conversationRun.talkNodeCurrentSet(nodeNext);
                }
                else {
                    conversationRun.talkNodeAdvance(universe);
                }
                conversationRun.talkNodeCurrentExecute(universe);
            }
            option(universe, conversationRun) {
                var scope = conversationRun.scopeCurrent;
                var talkNode = conversationRun.talkNodeCurrent();
                var talkNodesForOptions = scope.talkNodesForOptions;
                if (talkNodesForOptions.indexOf(talkNode) == -1) {
                    talkNodesForOptions.push(talkNode);
                    scope.talkNodesForOptionsByName.set(talkNode.name, talkNode);
                }
                conversationRun.talkNodeAdvance(universe);
                conversationRun.talkNodeCurrentExecute(universe);
            }
            optionRemove(universe, conversationRun) {
                var scope = conversationRun.scopeCurrent;
                var talkNode = conversationRun.talkNodeCurrent();
                var talkNodesForOptions = scope.talkNodesForOptions;
                var optionToRemoveName = talkNode.next;
                var optionToRemove = talkNodesForOptions.find(x => x.name == optionToRemoveName);
                if (optionToRemove != null) {
                    var indexToRemoveAt = talkNodesForOptions.indexOf(optionToRemove);
                    if (indexToRemoveAt >= 0) {
                        talkNodesForOptions.splice(indexToRemoveAt, 1);
                        scope.talkNodesForOptionsByName.delete(optionToRemove.name);
                    }
                }
                conversationRun.talkNodeAdvance(universe);
                conversationRun.talkNodeCurrentExecute(universe);
            }
            optionsClear(universe, conversationRun) {
                var scope = conversationRun.scopeCurrent;
                var talkNodesForOptions = scope.talkNodesForOptions;
                talkNodesForOptions.length = 0;
                conversationRun.talkNodeAdvance(universe);
                conversationRun.talkNodeCurrentExecute(universe);
            }
            pop(universe, conversationRun) {
                var scope = conversationRun.scopeCurrent;
                var talkNode = conversationRun.talkNodeCurrent();
                scope = scope.parent;
                conversationRun.scopeCurrent = scope;
                if (talkNode.next != null) {
                    var nodeNext = conversationRun.defn.talkNodeByName(talkNode.next);
                    conversationRun.talkNodeCurrentSet(nodeNext);
                }
                conversationRun.talkNodeCurrentExecute(universe);
            }
            prompt(universe, conversationRun) {
                var scope = conversationRun.scopeCurrent;
                scope.isPromptingForResponse = true;
            }
            push(universe, conversationRun) {
                var talkNodeToPushTo = conversationRun.talkNodeNext();
                var talkNodeToReturnTo = conversationRun.talkNodePrev();
                conversationRun.talkNodeCurrentSet(talkNodeToReturnTo);
                conversationRun.scopeCurrent = new GameFramework.ConversationScope(conversationRun.scopeCurrent, // parent
                talkNodeToPushTo, [] // options
                );
                conversationRun.talkNodeCurrentExecute(universe);
            }
            quit(universe, conversationRun) {
                conversationRun.quit(universe);
            }
            script(universe, conversationRun) {
                var talkNode = conversationRun.talkNodeCurrent();
                var scriptToRunAsString = "( (u, cr) => " + talkNode.content + ")";
                var scriptToRun = GameFramework.Script.fromCodeAsString(scriptToRunAsString);
                scriptToRun.runWithParams2(universe, conversationRun);
                conversationRun.talkNodeGoToNext(universe);
                conversationRun.talkNodeCurrentExecute(universe); // hack
            }
            _switch(universe, conversationRun) {
                var talkNode = conversationRun.talkNodeCurrent();
                var variableName = talkNode.content;
                var variableValueActual = conversationRun.variableByName(variableName);
                var variableValueAndNodeNextNamePairs = talkNode.next.split(";").map(x => x.split(":"));
                var talkNodeNextName = variableValueAndNodeNextNamePairs.find(x => x[0] == variableValueActual)[1];
                conversationRun.goto(talkNodeNextName, universe);
            }
            variableAdd(universe, conversationRun) {
                var talkNode = conversationRun.talkNodeCurrent();
                var variableName = talkNode.content;
                var variableIncrementAsString = talkNode.next;
                var variableIncrement = eval(variableIncrementAsString);
                var variableValueBeforeIncrement = conversationRun.variableGetWithDefault(variableName, 0);
                var variableValueAfterIncrement = variableValueBeforeIncrement + variableIncrement;
                conversationRun.variableSet(variableName, variableValueAfterIncrement);
                conversationRun.talkNodeAdvance(universe);
                conversationRun.talkNodeCurrentExecute(universe); // hack
            }
            variableLoad(universe, conversationRun) {
                var talkNode = conversationRun.talkNodeCurrent();
                var variableName = talkNode.content;
                var scriptExpression = talkNode.next;
                conversationRun.variableLoad(universe, variableName, scriptExpression);
                conversationRun.talkNodeAdvance(universe);
                conversationRun.talkNodeCurrentExecute(universe); // hack
            }
            variableSet(universe, conversationRun) {
                var talkNode = conversationRun.talkNodeCurrent();
                var variableName = talkNode.content;
                var variableExpression = talkNode.next;
                var variableValue = eval(variableExpression);
                conversationRun.variableSet(variableName, variableValue);
                conversationRun.talkNodeAdvance(universe);
                conversationRun.talkNodeCurrentExecute(universe); // hack
            }
            variableStore(universe, conversationRun) {
                var talkNode = conversationRun.talkNodeCurrent();
                var variableName = talkNode.content;
                var scriptExpression = talkNode.next;
                conversationRun.variableStore(universe, variableName, scriptExpression);
                conversationRun.talkNodeAdvance(universe);
                conversationRun.talkNodeCurrentExecute(universe); // hack
            }
            variablesExport(universe, conversationRun) {
                var talkNode = conversationRun.talkNodeCurrent();
                var variableLookupToExportToName = talkNode.content;
                conversationRun.variablesExport(universe, variableLookupToExportToName);
                conversationRun.talkNodeAdvance(universe);
                conversationRun.talkNodeCurrentExecute(universe); // hack
            }
            variablesImport(universe, conversationRun) {
                var talkNode = conversationRun.talkNodeCurrent();
                var variableLookupToImportFromExpression = talkNode.content;
                conversationRun.variablesImport(universe, variableLookupToImportFromExpression);
                conversationRun.talkNodeAdvance(universe);
                conversationRun.talkNodeCurrentExecute(universe); // hack
            }
        }
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
