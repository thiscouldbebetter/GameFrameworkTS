"use strict";
class AnimationDefnGroup {
    constructor(name, animationDefns) {
        this.name = name;
        this.animationDefns = animationDefns;
        this.animationDefnsByName = ArrayHelper.addLookupsByName(this.animationDefns);
    }
}
