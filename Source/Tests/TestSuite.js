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
                document.write("Running test suite containing "
                    + this.testFixtures.length + " test fixtures.<br /><br />");
                this.testFixtures.forEach(testFixture => {
                    testFixture.run();
                });
                document.write("All " + this.testFixtures.length
                    + " test fixtures in suite have been run.<br />");
            }
        }
        GameFramework.TestSuite = TestSuite;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
