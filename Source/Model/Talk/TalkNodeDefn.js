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
            static scriptParse(scriptAsString) {
                scriptAsString =
                    //"( (u, cr) => " + scriptAsString + ")";
                    "return " + scriptAsString;
                // return ScriptUsingEval.fromCodeAsString(scriptAsString); // Not possible to catch eval() errors here!
                var returnValue = GameFramework.ScriptUsingFunctionConstructor.fromParameterNamesAndCodeAsString(["u", "cr"], scriptAsString);
                return returnValue;
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
                this.DoNextInCycle = tnd("DoNextInCycle", this.doNextInCycle);
                this.DoNextInSequence = tnd("DoNextInSequence", this.doNextInSequence);
                this.DoNothing = tnd("DoNothing", this.doNothing);
                this.DoRandomSelection = tnd("DoRandomSelection", this.doRandomSelection);
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
                this.ScriptFromName = tnd("ScriptFromName", this.scriptFromName);
                this.ScriptUsingEval = tnd("ScriptUsingEval", this.scriptUsingEval);
                this.ScriptUsingFunctionConstructor
                    = tnd("Script", this.scriptUsingFunctionConstructor);
                this.SpeakerSet = tnd("SpeakerSet", this.speakerSet);
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
                        this.DoNextInCycle,
                        this.DoNextInSequence,
                        this.DoNothing,
                        this.DoRandomSelection,
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
                        this.ScriptFromName,
                        this.ScriptUsingEval,
                        this.ScriptUsingFunctionConstructor,
                        this.SpeakerSet,
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
            doNextInCycle(universe, conversationRun) {
                var _a;
                var talkNode = conversationRun.talkNodeCurrent();
                var talkNodeNextNamesJoined = talkNode.next;
                const delimiter = ";";
                var talkNodeNextNames = talkNodeNextNamesJoined.split(delimiter);
                var talkNodeCount = talkNodeNextNames.length;
                for (var i = 0; i < talkNodeCount; i++) {
                    var talkNodeToDisableName = talkNodeNextNames[i];
                    conversationRun.disableTalkNodeWithName(talkNodeToDisableName);
                }
                var variableName = (_a = talkNode.content) !== null && _a !== void 0 ? _a : talkNodeNextNamesJoined;
                var indexOfCurrentNodeOfCycle = conversationRun.variableGetWithDefault(variableName, 0);
                var talkNodeNextName = talkNodeNextNames[indexOfCurrentNodeOfCycle];
                conversationRun.enableTalkNodeWithName(talkNodeNextName);
                indexOfCurrentNodeOfCycle++;
                if (indexOfCurrentNodeOfCycle >= talkNodeCount) {
                    indexOfCurrentNodeOfCycle = 0;
                }
                conversationRun.variableSet(variableName, indexOfCurrentNodeOfCycle);
                conversationRun.talkNodeAdvance(universe);
                conversationRun.talkNodeCurrentExecute(universe);
            }
            doNextInSequence(universe, conversationRun) {
                // Like .doNextInCycle(), but stays on last node forever after.
                var _a;
                var talkNode = conversationRun.talkNodeCurrent();
                var talkNodeNextNamesJoined = talkNode.next;
                const delimiter = ";";
                var talkNodeNextNames = talkNodeNextNamesJoined.split(delimiter);
                var talkNodeCount = talkNodeNextNames.length;
                for (var i = 0; i < talkNodeCount; i++) {
                    var talkNodeToDisableName = talkNodeNextNames[i];
                    conversationRun.disableTalkNodeWithName(talkNodeToDisableName);
                }
                var variableName = (_a = talkNode.content) !== null && _a !== void 0 ? _a : talkNodeNextNamesJoined;
                var indexOfCurrentNodeOfCycle = conversationRun.variableGetWithDefault(variableName, 0);
                var talkNodeNextName = talkNodeNextNames[indexOfCurrentNodeOfCycle];
                conversationRun.enableTalkNodeWithName(talkNodeNextName);
                indexOfCurrentNodeOfCycle++;
                if (indexOfCurrentNodeOfCycle >= talkNodeCount) {
                    indexOfCurrentNodeOfCycle = talkNodeCount - 1;
                }
                conversationRun.variableSet(variableName, indexOfCurrentNodeOfCycle);
                conversationRun.talkNodeAdvance(universe);
                conversationRun.talkNodeCurrentExecute(universe);
            }
            doNothing(universe, conversationRun) {
                conversationRun.talkNodeAdvance(universe);
                conversationRun.talkNodeCurrentExecute(universe);
            }
            doRandomSelection(universe, conversationRun) {
                // Like .doNextInCycle() and .doNextInSequence(), but random.
                var talkNode = conversationRun.talkNodeCurrent();
                var talkNodeNextNamesJoined = talkNode.next;
                const delimiter = ";";
                var talkNodeNextNames = talkNodeNextNamesJoined.split(delimiter);
                var talkNodeCount = talkNodeNextNames.length;
                for (var i = 0; i < talkNodeCount; i++) {
                    var talkNodeToDisableName = talkNodeNextNames[i];
                    conversationRun.disableTalkNodeWithName(talkNodeToDisableName);
                }
                var randomizer = universe.randomizer;
                var indexRandom = randomizer.integerLessThan(talkNodeCount);
                var talkNodeNextName = talkNodeNextNames[indexRandom];
                conversationRun.enableTalkNodeWithName(talkNodeNextName);
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
                var talkNodeNextName = talkNode.next;
                conversationRun.goto(talkNodeNextName, universe);
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
            scriptFromName(universe, conversationRun) {
                var world = universe.world;
                var worldDefn = world.defn;
                var talkNode = conversationRun.talkNodeCurrent();
                var scriptName = talkNode.content;
                var scriptToRun = worldDefn.scriptByName(scriptName);
                scriptToRun.runWithParams2(universe, conversationRun);
                conversationRun.talkNodeGoToNext(universe);
                conversationRun.talkNodeCurrentExecute(universe); // hack
            }
            scriptUsingEval(universe, conversationRun) {
                var talkNode = conversationRun.talkNodeCurrent();
                var scriptToRunAsString = "( (u, cr) => " + talkNode.content + ")";
                var scriptToRun = GameFramework.ScriptUsingEval.fromCodeAsString(scriptToRunAsString);
                scriptToRun.runWithParams2(universe, conversationRun);
                conversationRun.talkNodeGoToNext(universe);
                conversationRun.talkNodeCurrentExecute(universe); // hack
            }
            scriptUsingFunctionConstructor(universe, conversationRun) {
                var talkNode = conversationRun.talkNodeCurrent();
                var scriptBodyToRunAsString = talkNode.content;
                var scriptToRun = TalkNodeDefn.scriptParse(scriptBodyToRunAsString);
                scriptToRun.runWithParams2(universe, conversationRun);
                conversationRun.talkNodeGoToNext(universe);
                conversationRun.talkNodeCurrentExecute(universe); // hack
            }
            speakerSet(universe, conversationRun) {
                // todo - Set the character portrait and possibly the font.
                conversationRun.talkNodeAdvance(universe);
                conversationRun.talkNodeCurrentExecute(universe);
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
                var variableIncrement = parseFloat(variableIncrementAsString);
                if (isNaN(variableIncrement)) {
                    variableIncrement = 1;
                }
                var variableValueBeforeIncrementAsUnknown = conversationRun.variableGetWithDefault(variableName, 0);
                var variableValueBeforeIncrement = variableValueBeforeIncrementAsUnknown;
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
                var variableAsCode = 
                // "(u, cr) => " + variableExpression;
                variableExpression;
                var variableScript = 
                // ScriptUsingEval.fromCodeAsString(variableAsCode);
                TalkNodeDefn.scriptParse(variableAsCode);
                var variableValue = variableScript.runWithParams2(universe, conversationRun);
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
