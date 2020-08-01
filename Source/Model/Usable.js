"use strict";
class Usable {
    constructor(use) {
        this._use = use;
    }
    use(u, w, p, eUsing, eUsed) {
        return this._use(u, w, p, eUsing, eUsed);
    }
}
