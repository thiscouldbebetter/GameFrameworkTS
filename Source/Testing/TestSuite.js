"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class TestSuite {
            constructor(name, testFixtures) {
                this.name = name;
                this.testFixtures = testFixtures;
            }
            static fromNameAndTestFixtures(name, testFixtures) {
                return new TestSuite(name, testFixtures);
            }
            static fromTestFixtures(testFixtures) {
                return new TestSuite(TestSuite.name, testFixtures);
            }
            runThen(testSuiteComplete) {
                this.write("Running test suite '" + this.name + "', containing "
                    + this.testFixtures.length + " test fixtures.");
                var testFixturesCount = this.testFixtures.length;
                var testFixturesCompletedCount = 0;
                var testSuite = this;
                this.testFixtures.forEach(testFixture => {
                    testFixture.runThen((testFixtureCompleted) => {
                        testFixturesCompletedCount++;
                        if (testFixturesCompletedCount >= testFixturesCount) {
                            this.write("All " + this.testFixtures.length
                                + " test fixtures in suite '" + this.name + "' have been run.");
                            testSuiteComplete(testSuite);
                        }
                    });
                });
            }
            toDomElement() {
                var d = document;
                var testSuiteAsDomElement = d.createElement("div");
                var nameAsDomElement = d.createElement("h1");
                nameAsDomElement.innerHTML = TestSuite.name + " " + this.name;
                testSuiteAsDomElement.appendChild(nameAsDomElement);
                var divTestFixtures = d.createElement("div");
                this.testFixtures.forEach(x => divTestFixtures.appendChild(x.toDomElement()));
                testSuiteAsDomElement.appendChild(divTestFixtures);
                return testSuiteAsDomElement;
            }
            write(messageToWrite) {
                console.log(messageToWrite);
            }
        }
        GameFramework.TestSuite = TestSuite;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
