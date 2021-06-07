"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class URLParser {
            constructor(urlAsString) {
                this.urlAsString = urlAsString;
                this.queryStringParametersByName = new Map();
                // todo - Make sure regex converts to string correctly.
                var indexOfQuestionMark = this.urlAsString.indexOf("?");
                if (indexOfQuestionMark >= 0) {
                    var parametersAsString = this.urlAsString.substr(indexOfQuestionMark + 1);
                    var parametersAsStrings = parametersAsString.split("&");
                    for (var i = 0; i < parametersAsStrings.length; i++) {
                        var parameterAsString = parametersAsStrings[i];
                        var parameterNameAndValue = parameterAsString.split("=");
                        var parameterName = parameterNameAndValue[0];
                        var parameterValue = parameterNameAndValue[1];
                        this.queryStringParametersByName.set(parameterName, parameterValue);
                    }
                }
            }
            queryStringParameterByName(parameterName) {
                return this.queryStringParametersByName.get(parameterName);
            }
            static fromWindow() {
                return new URLParser(window.location.toString());
            }
        }
        GameFramework.URLParser = URLParser;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
