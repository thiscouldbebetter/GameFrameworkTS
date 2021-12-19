"use strict";
class TestRunner {
    run() {
        var testSuite = new TestSuite("TestsAll", [
            // Controls.
            new ControlBuilderTests(),
            // Geometry.
            new CameraTests(),
            // Geometry - Collisions.
            new CollisionHelperTests(),
            // Geometry - Constraints.
            new ConstraintTests(),
            // Geometry - Shapes.
            new ArcTests(),
            new BoxTests(),
            // Storage - CompressorLZW.
            new CompressorLZWTests()
        ]);
        testSuite.run();
    }
}
