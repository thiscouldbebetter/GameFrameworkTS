"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class WebGLContext {
            constructor(canvas) {
                this.gl = this.initGL(canvas);
                this.shaderProgram = this.buildShaderProgram(this.gl);
            }
            // methods
            // static methods
            static coordsToWebGLArray(coordsToConvert) {
                var returnValues = new Float32Array(coordsToConvert.dimensions());
                return returnValues;
            }
            // instance methods
            initGL(canvas) {
                var gl = canvas.getContext("experimental-webgl");
                gl.viewport(0, 0, canvas.width, canvas.height);
                var colorBackground = GameFramework.Color.Instances().Black;
                var colorBackgroundComponentsRGBA = colorBackground.fractionsRgba; // todo
                gl.clearColor(colorBackgroundComponentsRGBA[0], colorBackgroundComponentsRGBA[1], colorBackgroundComponentsRGBA[2], colorBackgroundComponentsRGBA[3]);
                gl.enable(gl.CULL_FACE);
                gl.enable(gl.DEPTH_TEST);
                return gl;
            }
            buildShaderProgram(gl) {
                var shaderProgram = this.buildShaderProgram_Compile(gl, this.buildShaderProgram_FragmentShader(gl), this.buildShaderProgram_VertexShader(gl));
                this.buildShaderProgram_SetUpInputVariables(gl, shaderProgram);
                return shaderProgram;
            }
            buildShaderProgram_FragmentShader(gl) {
                var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
                var newline = "\n";
                var fragmentShaderCode = [
                    "precision mediump float;",
                    "",
                    "uniform sampler2D uSampler;",
                    "",
                    "varying vec4 vColor;",
                    "varying vec3 vLight;",
                    "varying vec2 vTextureUV;",
                    "",
                    "void main(void) {",
                    "    if (vTextureUV.x < 0.0) {",
                    "        gl_FragColor = vColor;",
                    "    } else {",
                    "        vec4 textureColor = ",
                    "            texture2D(uSampler, vec2(vTextureUV.s, vTextureUV.t));",
                    "        gl_FragColor = vec4(vLight * textureColor.rgb, textureColor.a);",
                    "    }",
                    "}"
                ].join(newline);
                gl.shaderSource(fragmentShader, fragmentShaderCode);
                gl.compileShader(fragmentShader);
                return fragmentShader;
            }
            buildShaderProgram_VertexShader(gl) {
                var vertexShader = gl.createShader(gl.VERTEX_SHADER);
                var newline = "\n";
                var vertexShaderCode = [
                    "attribute vec4 aVertexColor;",
                    "attribute vec3 aVertexNormal;",
                    "attribute vec3 aVertexPosition;",
                    "attribute vec2 aVertexTextureUV;",
                    "",
                    "uniform mat4 uEntityMatrix;",
                    "uniform mat4 uCameraMatrix;",
                    "uniform float uLightAmbientIntensity;",
                    "uniform vec3 uLightDirection;",
                    "uniform float uLightDirectionalIntensity;",
                    "uniform mat4 uNormalMatrix;",
                    "",
                    "varying vec4 vColor;",
                    "varying vec3 vLight;",
                    "varying vec2 vTextureUV;",
                    "",
                    "void main(void) {",
                    "    vColor = aVertexColor;",
                    "    vec4 vertexNormal4 = vec4(aVertexNormal, 0.0);",
                    "    vec4 transformedNormal4 = uNormalMatrix * vertexNormal4;",
                    "    vec3 transformedNormal = vec3(transformedNormal4.xyz) * -1.0;",
                    "    float lightMagnitude = uLightAmbientIntensity;",
                    "    lightMagnitude += ",
                    "        uLightDirectionalIntensity ",
                    "        * max(dot(transformedNormal, uLightDirection), 0.0);",
                    "    vLight = vec3(1.0, 1.0, 1.0) * lightMagnitude;",
                    "    vTextureUV = aVertexTextureUV;",
                    "    vec4 vertexPos = vec4(aVertexPosition, 1.0);",
                    "    gl_Position = uCameraMatrix * uEntityMatrix * vertexPos;",
                    "}"
                ].join(newline);
                gl.shaderSource(vertexShader, vertexShaderCode);
                gl.compileShader(vertexShader);
                return vertexShader;
            }
            buildShaderProgram_Compile(gl, fragmentShader, vertexShader) {
                var shaderProgram = gl.createProgram();
                gl.attachShader(shaderProgram, vertexShader);
                gl.attachShader(shaderProgram, fragmentShader);
                gl.linkProgram(shaderProgram);
                gl.useProgram(shaderProgram);
                return shaderProgram;
            }
            buildShaderProgram_SetUpInputVariables(gl, shaderProgram) {
                var vars = ShaderProgramVariableNames.Instance();
                var sp = shaderProgram;
                sp.vertexColorAttribute =
                    gl.getAttribLocation(sp, vars.aVertexColor);
                gl.enableVertexAttribArray(sp.vertexColorAttribute);
                sp.vertexNormalAttribute =
                    gl.getAttribLocation(sp, vars.aVertexNormal);
                gl.enableVertexAttribArray(sp.vertexNormalAttribute);
                sp.vertexPositionAttribute =
                    gl.getAttribLocation(sp, vars.aVertexPosition);
                gl.enableVertexAttribArray(sp.vertexPositionAttribute);
                sp.vertexTextureUVAttribute =
                    gl.getAttribLocation(sp, vars.aVertexTextureUV);
                gl.enableVertexAttribArray(sp.vertexTextureUVAttribute);
                sp.entityMatrix =
                    gl.getUniformLocation(sp, vars.uEntityMatrix);
                sp.cameraMatrix =
                    gl.getUniformLocation(sp, vars.uCameraMatrix);
                sp.lightAmbientIntensity =
                    gl.getUniformLocation(sp, vars.uLightAmbientIntensity);
                sp.lightDirection =
                    gl.getUniformLocation(sp, vars.uLightDirection);
                sp.lightDirectionalIntensity =
                    gl.getUniformLocation(sp, vars.uLightDirectionalIntensity);
                sp.normalMatrix =
                    gl.getUniformLocation(sp, vars.uNormalMatrix);
            }
        }
        GameFramework.WebGLContext = WebGLContext;
        class ShaderProgramVariableNames {
            constructor() {
                this.aVertexColor = "aVertexColor";
                this.aVertexNormal = "aVertexNormal";
                this.aVertexPosition = "aVertexPosition";
                this.aVertexTextureUV = "aVertexTextureUV";
                this.uEntityMatrix = "uEntityMatrix";
                this.uCameraMatrix = "uCameraMatrix";
                this.uLightAmbientIntensity = "uLightAmbientIntensity";
                this.uLightDirection = "uLightDirection";
                this.uLightDirectionalIntensity = "uLightDirectionalIntensity";
                this.uNormalMatrix = "uNormalMatrix";
            }
            static Instance() {
                if (this._instance == null) {
                    this._instance = new ShaderProgramVariableNames();
                }
                return this._instance;
            }
        }
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
