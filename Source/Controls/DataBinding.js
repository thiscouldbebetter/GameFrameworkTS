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
            static fromContext(context) {
                return new DataBinding(context, null, null);
            }
            static fromContextAndGet(context, get) {
                return new DataBinding(context, get, null);
            }
            static fromGet(get) {
                return new DataBinding(null, get, null);
            }
            static fromTrue() {
                return DataBinding.fromContext(true);
            }
            contextSet(value) {
                this.context = value;
                return this;
            }
            get() {
                return (this._get == null ? this.context : this._get(this.context));
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
