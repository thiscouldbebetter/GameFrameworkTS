"use strict";
class SampleTests extends TestFixture {
    tests() {
        var returnValues = [
            this.alwaysPass
        ];
        return returnValues;
    }
    alwaysPass() {
        var expected = "todo";
        var actual = "todo";
        Assert.areEqual(expected, actual);
    }
}
