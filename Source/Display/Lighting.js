"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Lighting {
            constructor(lightAmbient, lightDirectional, lightPoint) {
                this.lightAmbient = lightAmbient;
                this.lightDirectional = lightDirectional;
                this.lightPoint = lightPoint;
            }
            static default() {
                return new Lighting(LightAmbient.fromIntensity(.5), LightDirectional.fromIntensityAndDirection(.4, GameFramework.Coords.ones().multiplyScalar(-1).normalize()), null // lightPoint
                );
            }
            static fromLightsAmbientDirectionalAndPoint(lightAmbient, lightDirectional, lightPoint) {
                return new Lighting(lightAmbient, lightDirectional, lightPoint);
            }
            static fromLightPoint(lightPoint) {
                return new Lighting(LightAmbient.dark(), LightDirectional.dark(), lightPoint);
            }
        }
        GameFramework.Lighting = Lighting;
        class LightAmbient {
            constructor(intensity) {
                this.intensity = intensity;
            }
            static dark() {
                return new LightAmbient(0);
            }
            static fromIntensity(intensity) {
                return new LightAmbient(intensity);
            }
            writeToWebGlContext(webGlContext) {
                var gl = webGlContext.gl;
                var shaderProgram = webGlContext.shaderProgram;
                gl.uniform1f(shaderProgram.lightAmbientIntensity, this.intensity);
            }
        }
        GameFramework.LightAmbient = LightAmbient;
        class LightDirectional {
            constructor(intensity, direction) {
                this.intensity = intensity;
                this.direction = direction;
            }
            static dark() {
                return new LightDirectional(0, GameFramework.Coords.fromXYZ(1, 0, 0));
            }
            static fromIntensityAndDirection(intensity, direction) {
                return new LightDirectional(intensity, direction);
            }
            writeToWebGlContext(webGlContext) {
                var gl = webGlContext.gl;
                var shaderProgram = webGlContext.shaderProgram;
                gl.uniform1f(shaderProgram.lightDirectionalIntensity, this.intensity);
                gl.uniform3fv(shaderProgram.lightDirectionalDirection, GameFramework.WebGLContext.coordsToWebGLArray(this.direction));
            }
        }
        GameFramework.LightDirectional = LightDirectional;
        class LightPoint {
            constructor(intensity, pos) {
                this.intensity = intensity;
                this.pos = pos;
            }
            static default() {
                return new LightPoint(1, GameFramework.Coords.zeroes());
            }
            static fromIntensityAndPos(intensity, pos) {
                return new LightPoint(intensity, pos);
            }
            writeToWebGlContext(webGlContext) {
                // todo
            }
        }
        GameFramework.LightPoint = LightPoint;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
