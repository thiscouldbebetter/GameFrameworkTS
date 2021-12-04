"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class TestFixture {
            constructor(name) {
                this.name = name;
            }
            tests() {
                return null;
            }
            run() {
                var tests = this.tests();
                var testCount = tests.length;
                this.writeInfo("Test fixture '" + this.name
                    + "', containing " + testCount + " tests, running.<br />");
                var testsPassedCount = 0;
                tests.forEach(test => {
                    try {
                        test.call(this);
                        testsPassedCount++;
                    }
                    catch (ex) {
                        this.writeError("Test failed: " + test.name + "<br /><br />");
                        this.writeError(ex.stack + "<br />"
                            + "<br /><br />");
                    }
                });
                var testsFailedCount = tests.length - testsPassedCount;
                var results = "All tests in fixture '" + this.name + "' complete.  "
                    + testsPassedCount + "/" + tests.length
                    + " passed. ";
                this.writeInfo(results);
                if (testsFailedCount > 0) {
                    var results = testsFailedCount
                        + " tests failed!";
                    this.writeError(results);
                }
                this.writeInfo("<br /><br />");
            }
            writeMessageInColor(messageToWrite, color) {
                var d = document;
                var messageAsDomElement = d.createElement("span");
                if (color != null) {
                    messageAsDomElement.style.color = color;
                }
                messageAsDomElement.innerHTML = messageToWrite;
                d.body.appendChild(messageAsDomElement);
            }
            writeError(messageToWrite) {
                this.writeMessageInColor(messageToWrite, "Red");
            }
            writeInfo(messageToWrite) {
                this.writeMessageInColor(messageToWrite, null);
            }
        }
        GameFramework.TestFixture = TestFixture;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
