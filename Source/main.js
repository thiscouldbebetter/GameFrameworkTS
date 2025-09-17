"use strict";
class Program {
    start() {
        var testRunner = new TestRunner();
        testRunner.run();
        var configuration = Configuration.Instance();
        new GameDemo(configuration).start();
    }
}
new Program().start();
