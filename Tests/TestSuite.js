"use strict";
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
