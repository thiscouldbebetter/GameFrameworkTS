"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Serializer {
            deserialize(stringToDeserialize) {
                var nodeRoot = JSON.parse(stringToDeserialize);
                var typeNames = nodeRoot["typeNames"];
                nodeRoot.__proto__ = SerializerNode.prototype;
                nodeRoot.prototypesAssign();
                var returnValue = nodeRoot.unwrap(typeNames, []);
                return returnValue;
            }
            serialize(objectToSerialize, prettyPrint) {
                var nodeRoot = new SerializerNode(objectToSerialize);
                var typeNames = new Array();
                nodeRoot.wrap(typeNames, new Map(), [], []);
                nodeRoot["typeNames"] = typeNames;
                var nodeRootSerialized = JSON.stringify(nodeRoot, null, // ?
                (prettyPrint == true ? 4 : null) // pretty-print indent size
                );
                return nodeRootSerialized;
            }
            serializeWithFormatting(objectToSerialize) {
                return this.serialize(objectToSerialize, true);
            }
            serializeWithoutFormatting(objectToSerialize) {
                return this.serialize(objectToSerialize, false);
            }
        }
        GameFramework.Serializer = Serializer;
        class SerializerNode {
            constructor(objectWrapped) {
                this.o = objectWrapped;
            }
            wrap(typeNamesSoFar, typeIdsByName, objectsAlreadyWrapped, objectIndexToNodeLookup) {
                var objectWrapped = this.o;
                if (objectWrapped != null) {
                    var typeName = objectWrapped.constructor.name;
                    if (typeIdsByName.has(typeName) == false) {
                        typeIdsByName.set(typeName, typeNamesSoFar.length);
                        typeNamesSoFar.push(typeName);
                    }
                    var typeId = typeIdsByName.get(typeName);
                    var objectIndexExisting = objectsAlreadyWrapped.indexOf(objectWrapped);
                    if (objectIndexExisting >= 0) {
                        var nodeForObjectExisting = objectIndexToNodeLookup[objectIndexExisting];
                        this.i = nodeForObjectExisting.i;
                        this.r = 1; // isReference
                        delete this.o; // objectWrapped
                    }
                    else {
                        // this.r = 0; // isReference
                        var objectIndex = objectsAlreadyWrapped.length;
                        this.i = objectIndex;
                        objectsAlreadyWrapped.push(objectWrapped);
                        objectIndexToNodeLookup[objectIndex] = this;
                        this.t = typeId;
                        if (typeName == Function.name) {
                            var functionText = objectWrapped.toString();
                            if (functionText.startsWith(Function.name) == false
                                && functionText.indexOf("=>") == -1) {
                                // This sometimes happens when passing class methods
                                // as lambdas instead of using 'big-arrow' syntax.
                                console.log("Modifying lambda text for serialization.");
                                var firstIndexOfOpenParenthesis = functionText.indexOf("(");
                                var firstIndexOfCloseParenthesis = functionText.indexOf(")");
                                var functionName = functionText.substr(0, firstIndexOfOpenParenthesis);
                                var functionParametersLength = firstIndexOfCloseParenthesis - firstIndexOfOpenParenthesis + 1;
                                var functionParameters = functionText.substr(firstIndexOfOpenParenthesis, functionParametersLength);
                                functionText = functionParameters + " => " + functionName + functionParameters;
                            }
                            this.o = functionText;
                        }
                        else {
                            var children = {}; // new Map<string, any>();
                            this.c = children;
                            if (typeName == Map.name) {
                                // Maps don't serialize well with JSON.stringify(),
                                // so convert it to a generic object.
                                var objectWrappedAsObject = {};
                                for (var key of objectWrapped.keys()) {
                                    var value = objectWrapped.get(key);
                                    objectWrappedAsObject[key] = value;
                                }
                                objectWrapped = objectWrappedAsObject;
                            }
                            for (var propertyName in objectWrapped) {
                                var property = null;
                                try {
                                    var objectWrappedPrototype = Object.getPrototypeOf(objectWrapped);
                                    property = objectWrappedPrototype[propertyName];
                                    if (property == null) {
                                        var propertyValue = objectWrapped[propertyName];
                                        if (propertyValue == null) {
                                            child = null;
                                        }
                                        else {
                                            var propertyValueTypeName = propertyValue.constructor.name;
                                            if (propertyValueTypeName == Boolean.name
                                                || propertyValueTypeName == Number.name
                                                || propertyValueTypeName == String.name) {
                                                child = propertyValue;
                                            }
                                            else {
                                                child = new SerializerNode(propertyValue);
                                            }
                                        }
                                        children[propertyName] = child;
                                    }
                                }
                                catch (ex) {
                                    // This usually happens on attempting to serialize a DOM element.
                                    var errorMessage = "Error accessing property '" + propertyName
                                        + "' on type '" + typeName + "'.  Ignoring.";
                                    console.log(errorMessage);
                                }
                            }
                            delete this.o;
                            for (var childName in children) {
                                var child = children[childName];
                                if (child != null) {
                                    var childTypeName = child.constructor.name;
                                    if (childTypeName == SerializerNode.name) {
                                        child.wrap(typeNamesSoFar, typeIdsByName, objectsAlreadyWrapped, objectIndexToNodeLookup);
                                    }
                                }
                            }
                        }
                    }
                } // end if objectWrapped != null
                return this;
            }
            prototypesAssign() {
                var children = this.c;
                if (children != null) {
                    for (var childName in children) {
                        var child = children[childName];
                        if (child != null) {
                            var childTypeName = child.constructor.name;
                            if (childTypeName == Object.name) {
                                Object.setPrototypeOf(child, SerializerNode.prototype);
                                child.prototypesAssign();
                            }
                        }
                    }
                }
            }
            unwrap(typeNames, nodesAlreadyProcessed) {
                var isReference = (this.r == 1);
                if (isReference) {
                    var nodeExisting = nodesAlreadyProcessed[this.i];
                    this.o = nodeExisting.o; // objectWrapped
                }
                else {
                    nodesAlreadyProcessed[this.i] = this;
                    var typeId = this.t;
                    var typeName = typeNames[typeId];
                    if (typeName == null) {
                        // Value is null.  Do nothing.
                    }
                    else if (typeName == Array.name) {
                        this.o = [];
                    }
                    else if (typeName == Function.name) {
                        try {
                            this.o = eval("(" + this.o + ")");
                        }
                        catch (ex) {
                            // This sometimes happens when passing class methods
                            // as lambdas instead of using 'big-arrow' syntax.
                            console.log("An error occurred while deserializing a function.");
                            throw ex;
                        }
                    }
                    else if (typeName == Map.name) {
                        this.o = new Map();
                    }
                    else if (typeName == Boolean.name
                        || typeName == Number.name
                        || typeName == String.name) {
                        // Primitive types. Do nothing.
                    }
                    else {
                        this.o = {};
                        var objectWrappedType = eval("(" + typeName + ")");
                        this.o.__proto__ = objectWrappedType.prototype;
                    }
                    var children = this.c;
                    if (children != null) {
                        for (var childName in children) {
                            var child = children[childName];
                            if (child != null) {
                                if (child.constructor.name == SerializerNode.name) {
                                    child = child.unwrap(typeNames, nodesAlreadyProcessed);
                                }
                            }
                            if (this.o.constructor.name == Map.name) {
                                this.o.set(childName, child);
                            }
                            else {
                                this.o[childName] = child;
                            }
                        }
                    }
                }
                return this.o; // objectWrapped
            }
        }
        GameFramework.SerializerNode = SerializerNode;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
