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
                    "varying vec3 vNormal;",
                    "varying vec3 vLightComponentsFromAmbientAndDirectional;",
                    "varying vec2 vTextureUv;",
                    "varying float vLightPointIntensity;",
                    "varying vec3 vDisplacementFromSurfaceToLightPoint;",
                    "",
                    "void main(void) {",
                    "    if (vTextureUv.x < 0.0)",
                    "    {",
                    "        gl_FragColor = vColor;",
                    "    }",
                    "    else",
                    "    {",
                    "        vec2 textureUvAsVec2 = vec2(vTextureUv.s, vTextureUv.t);",
                    "        vec4 textureColor = texture2D(uSampler, textureUvAsVec2);",
                    "        vec3 directionFromSurfaceToLightPoint = normalize(vDisplacementFromSurfaceToLightPoint);",
                    "        float distanceFromSurfaceToLightPoint = length(vDisplacementFromSurfaceToLightPoint);",
                    "        float distanceFromSurfaceToLightPointSquared = distanceFromSurfaceToLightPoint * distanceFromSurfaceToLightPoint;",
                    //"        float lightMagnitudeFromPointAtSurface = dot(vNormal, directionFromSurfaceToLightPoint);",
                    "        float lightMagnitudeFromPointAtSurface = vLightPointIntensity / distanceFromSurfaceToLightPointSquared;",
                    "        vec3 lightComponentsFromPointAtSurface = vec3(1.0, 1.0, 1.0) * lightMagnitudeFromPointAtSurface;",
                    "        vec3 lightComponentsFromAllSources = ",
                    "            vLightComponentsFromAmbientAndDirectional + lightComponentsFromPointAtSurface;",
                    "        vec3 surfaceColorRgb = lightComponentsFromAllSources * textureColor.rgb;",
                    "        gl_FragColor = vec4(surfaceColorRgb, textureColor.a);",
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
                    "// These come from the vertex data stream.",
                    "attribute vec4 aVertexColor;",
                    "attribute vec3 aVertexNormal;",
                    "attribute vec3 aVertexPosition;",
                    "attribute vec2 aVertexTextureUV;",
                    "",
                    "// These are specified individually by the calling application.",
                    "uniform mat4 uEntityMatrix;",
                    "uniform mat4 uCameraMatrix;",
                    "uniform mat4 uNormalMatrix;",
                    "uniform float uLightAmbientIntensity;",
                    "uniform float uLightDirectionalIntensity;",
                    "uniform vec3 uLightDirectionalDirection;",
                    "uniform float uLightPointIntensity;",
                    "uniform vec3 uLightPointPosition;",
                    "",
                    "// These are set below, then passed to the fragment shader.",
                    "varying vec4 vColor;",
                    "varying vec3 vLightComponentsFromAmbientAndDirectional;",
                    "varying vec2 vTextureUv;",
                    "varying vec3 vDisplacementFromSurfaceToLightPoint;",
                    "varying float vLightPointIntensity;",
                    "varying vec3 vNormal;",
                    "",
                    "void main(void) {",
                    "    vColor = aVertexColor;",
                    "    vNormal = aVertexNormal;",
                    "    vec4 vertexNormalAsVec4 = vec4(aVertexNormal, 0.0);",
                    "    vec4 vertexNormalTimesNormalMatrix = uNormalMatrix * vertexNormalAsVec4;",
                    "    vec3 vertexNormalTimesNormalMatrixInverted = vec3(vertexNormalTimesNormalMatrix.xyz) * -1.0;",
                    "    float normalTransformedDotLightDirection = ",
                    "        dot(vertexNormalTimesNormalMatrixInverted, uLightDirectionalDirection);",
                    "    float lightDirectionalMagnitude =",
                    "        uLightDirectionalIntensity * max(normalTransformedDotLightDirection, 0.0);",
                    "    float lightMagnitude = uLightAmbientIntensity + lightDirectionalMagnitude;",
                    "    vec3 lightColor = vec3(1.0, 1.0, 1.0);",
                    "    vLightComponentsFromAmbientAndDirectional = lightColor * lightMagnitude;",
                    "    vec4 vertexPositionAsVec4 = vec4(aVertexPosition, 1.0);", // Because a vec3 can't be multiplied with a mat4?
                    "    vec3 vertexPositionInWorldCoords = (uEntityMatrix * vertexPositionAsVec4).xyz;", // Need a "world matrix" instead of uEntityMatrix?
                    "    vLightPointIntensity = uLightPointIntensity;",
                    "    vDisplacementFromSurfaceToLightPoint = uLightPointPosition - vertexPositionInWorldCoords;",
                    "    vTextureUv = aVertexTextureUV;",
                    "    gl_Position = uCameraMatrix * uEntityMatrix * vertexPositionAsVec4;",
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
                var sp = shaderProgram;
                var vars = new ShaderProgramVariables();
                var varNames = ShaderProgramVariableNames.Instance();
                vars.vertexColorAttribute =
                    gl.getAttribLocation(sp, varNames.aVertexColor);
                gl.enableVertexAttribArray(vars.vertexColorAttribute);
                vars.vertexNormalAttribute =
                    gl.getAttribLocation(sp, varNames.aVertexNormal);
                gl.enableVertexAttribArray(vars.vertexNormalAttribute);
                vars.vertexPositionAttribute =
                    gl.getAttribLocation(sp, varNames.aVertexPosition);
                gl.enableVertexAttribArray(vars.vertexPositionAttribute);
                vars.vertexTextureUVAttribute =
                    gl.getAttribLocation(sp, varNames.aVertexTextureUV);
                gl.enableVertexAttribArray(vars.vertexTextureUVAttribute);
                vars.entityMatrix =
                    gl.getUniformLocation(sp, varNames.uEntityMatrix);
                vars.cameraMatrix =
                    gl.getUniformLocation(sp, varNames.uCameraMatrix);
                vars.lightAmbientIntensity =
                    gl.getUniformLocation(sp, varNames.uLightAmbientIntensity);
                vars.lightDirectionalIntensity =
                    gl.getUniformLocation(sp, varNames.uLightDirectionalIntensity);
                vars.lightDirectionalDirection =
                    gl.getUniformLocation(sp, varNames.uLightDirectionalDirection);
                vars.lightPointIntensity =
                    gl.getUniformLocation(sp, varNames.uLightPointIntensity);
                vars.lightPointPosition =
                    gl.getUniformLocation(sp, varNames.uLightPointPosition);
                vars.normalMatrix =
                    gl.getUniformLocation(sp, varNames.uNormalMatrix);
                this.shaderProgramVariables = vars;
            }
        }
        GameFramework.WebGLContext = WebGLContext;
        class ShaderProgramVariables {
        }
        GameFramework.ShaderProgramVariables = ShaderProgramVariables;
        class ShaderProgramVariableNames {
            constructor() {
                this.aVertexColor = "aVertexColor";
                this.aVertexNormal = "aVertexNormal";
                this.aVertexPosition = "aVertexPosition";
                this.aVertexTextureUV = "aVertexTextureUV";
                this.uEntityMatrix = "uEntityMatrix";
                this.uCameraMatrix = "uCameraMatrix";
                this.uLightAmbientIntensity = "uLightAmbientIntensity";
                this.uLightDirectionalIntensity = "uLightDirectionalIntensity";
                this.uLightDirectionalDirection = "uLightDirectionalDirection";
                this.uLightPointIntensity = "uLightPointIntensity";
                this.uLightPointPosition = "uLightPointPosition";
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
