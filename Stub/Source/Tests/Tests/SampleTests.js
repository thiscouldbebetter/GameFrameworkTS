"use strict";
class SampleTests extends TestFixture {
    constructor() {
        super(SampleTests.name);
    }
    tests() {
        var returnValues = [
            this.alwaysPass
        ];
        return returnValues;
    }
    alwaysPass() {
        var expected = "todo";
        var actual = "todo";
        Assert.areStringsEqual(expected, actual);
    }
}
