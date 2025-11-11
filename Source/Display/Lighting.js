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
        }
        GameFramework.Lighting = Lighting;
        class LightAmbient {
            constructor(intensity) {
                this.intensity = intensity;
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
        class LightDirectional {
            constructor(intensity, direction) {
                this.intensity = intensity;
                this.direction = direction;
            }
            static fromIntensityAndDirection(intensity, direction) {
                return new LightDirectional(intensity, direction);
            }
            writeToWebGlContext(webGlContext) {
                var gl = webGlContext.gl;
                var shaderProgram = webGlContext.shaderProgram;
                gl.uniform3fv(shaderProgram.lightDirection, GameFramework.WebGLContext.coordsToWebGLArray(this.direction));
                gl.uniform1f(shaderProgram.lightDirectionalIntensity, this.intensity);
            }
        }
        class LightPoint {
            constructor(intensity, pos) {
                this.intensity = intensity;
                this.pos = pos;
            }
            static fromIntensityAndPos(intensity, pos) {
                return new LightPoint(intensity, pos);
            }
            writeToWebGlContext(webGlContext) {
                // todo
            }
        }
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
