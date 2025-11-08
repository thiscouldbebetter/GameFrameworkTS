"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Material {
            constructor(name, colorStroke, colorFill, texture) {
                this.name = name;
                this.colorStroke = colorStroke;
                this.colorFill = colorFill;
                this.texture = texture;
            }
            static fromNameColorsStrokeAndFillAndTexture(name, colorStroke, colorFill, texture) {
                return new Material(name, colorStroke, colorFill, texture);
            }
            static fromTexture(texture) {
                var colors = GameFramework.Color.Instances();
                return new Material(texture.name, colors.Black, colors.Gray, texture);
            }
            static Instances() {
                if (Material._instances == null) {
                    Material._instances = new Material_Instances();
                }
                return Material._instances;
            }
        }
        GameFramework.Material = Material;
        class Material_Instances {
            constructor() {
                this.Default = new Material("Default", GameFramework.Color.Instances().Blue, // colorStroke
                GameFramework.Color.Instances().Yellow, // colorFill
                null // texture
                );
            }
        }
        GameFramework.Material_Instances = Material_Instances;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
