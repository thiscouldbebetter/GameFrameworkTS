"use strict";
class TestRunner {
    runThen(testRunnerComplete) {
        var testSuite = new TestSuite("TestsAll", [
            // Controls.
            new ControlBuilderTests(),
            // Geometry.
            new CameraTests(),
            // Geometry - Collisions.
            new CollidableTests(),
            new CollisionHelperTests(),
            // Geometry - Constraints.
            new ConstraintTests(),
            // Geometry - Shapes.
            new ArcTests(),
            new BoxAxisAlignedTests(),
            // Model - Talk.
            new TalkTests(),
            // Storage - CompressorLZW.
            new CompressorLZWTests()
        ]);
        testSuite.runThen((testSuiteCompleted) => {
            console.log("All tests in test suite '" + testSuiteCompleted.name + "' completed.");
            testRunnerComplete();
        });
    }
}
