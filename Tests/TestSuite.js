"use strict";
class TestSuite {
    constructor(testFixtures) {
        this.testFixtures = testFixtures;
    }
    run() {
        document.write("Running test suite containing "
            + this.testFixtures.length + " test fixtures.<br />");
        this.testFixtures.forEach(testFixture => {
            testFixture.run();
        });
        document.write("All test fixtures in suite have been run.<br />");
    }
}
