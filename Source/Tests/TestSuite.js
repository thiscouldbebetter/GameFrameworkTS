"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class TestSuite {
            constructor(testFixtures) {
                this.testFixtures = testFixtures;
            }
            run() {
                this.write("Running test suite containing "
                    + this.testFixtures.length + " test fixtures.<br /><br />");
                this.testFixtures.forEach(testFixture => {
                    testFixture.run();
                });
                this.write("All " + this.testFixtures.length
                    + " test fixtures in suite have been run.<br />");
            }
            write(messageToWrite) {
                var d = document;
                var messageAsDomElement = d.createElement("span");
                messageAsDomElement.innerHTML = messageToWrite;
                d.body.appendChild(messageAsDomElement);
            }
        }
        GameFramework.TestSuite = TestSuite;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
