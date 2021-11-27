"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class DataBinding {
            constructor(context, get, set) {
                this.context = context;
                this._get = get;
                this._set = set;
            }
            static fromBooleanWithContext(value, context) {
                return DataBinding.fromContextAndGet(context, (context) => value);
            }
            static fromContext(context) {
                return new DataBinding(context, (contextGet) => contextGet, null // set
                );
            }
            static fromContextAndGet(context, get) {
                return new DataBinding(context, get, null);
            }
            static fromFalseWithContext(context) {
                return DataBinding.fromBooleanWithContext(false, context);
            }
            static fromGet(get) {
                return new DataBinding(null, get, null);
            }
            static fromTrue() {
                return DataBinding.fromBooleanWithContext(true, null);
            }
            static fromTrueWithContext(context) {
                return DataBinding.fromBooleanWithContext(true, context);
            }
            contextSet(context) {
                this.context = context;
                return this;
            }
            get() {
                return this._get(this.context);
            }
            set(value) {
                if (this._set == null) {
                    this.context = value;
                }
                else {
                    this._set(this.context, value);
                }
            }
        }
        GameFramework.DataBinding = DataBinding;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
