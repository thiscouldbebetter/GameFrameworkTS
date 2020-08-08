"use strict";
class ClonableHelper {
    static clone(clonableToClone) {
        return (clonableToClone == null ? null : clonableToClone.clone());
    }
}
