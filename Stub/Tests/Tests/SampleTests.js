"use strict";
class SampleTests extends TestFixture {
    tests() {
        var returnValues = [
            alwaysPass
        ];
        return returnValues;
    }
    alwaysPass() {
        var expected = "todo";
        var actual = "todo";
        Assert.areEqual(expected, actual);
    }
}
