
namespace ThisCouldBeBetter.GameFramework
{

export class WebGLContext
{
	gl: WebGLRenderingContext;
	shaderProgram: WebGLProgram;
	shaderProgramVariables: ShaderProgramVariables;

	constructor(canvas: HTMLCanvasElement)
	{
		this.gl = this.initGL(canvas);
		this.shaderProgram = this.buildShaderProgram(this.gl);
	}

	// methods

	// static methods

	static coordsToWebGLArray(coordsToConvert: Coords)
	{
		var returnValues = new Float32Array(coordsToConvert.dimensions());

		return returnValues;
	}

	// instance methods

	initGL(canvas: HTMLCanvasElement): WebGLRenderingContext
	{
		var gl = canvas.getContext("experimental-webgl") as WebGLRenderingContext;
		gl.viewport(0, 0, canvas.width, canvas.height);

		var colorBackground = Color.Instances().Black;
		var colorBackgroundComponentsRGBA =
			colorBackground.fractionsRgba; // todo
		gl.clearColor
		(
			colorBackgroundComponentsRGBA[0],
			colorBackgroundComponentsRGBA[1],
			colorBackgroundComponentsRGBA[2],
			colorBackgroundComponentsRGBA[3]
		);

		gl.enable(gl.CULL_FACE);
		gl.enable(gl.DEPTH_TEST);

		return gl;
	}

	buildShaderProgram(gl: WebGLRenderingContext): WebGLProgram
	{
		var shaderProgram = this.buildShaderProgram_Compile
		(
			gl,
			this.buildShaderProgram_FragmentShader(gl),
			this.buildShaderProgram_VertexShader(gl)
		);

		this.buildShaderProgram_SetUpInputVariables(gl, shaderProgram);

		return shaderProgram;
	}

	buildShaderProgram_FragmentShader(gl: WebGLRenderingContext): WebGLShader
	{
		var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		var newline = "\n";
		var fragmentShaderCode =
		[
			"precision mediump float;",
			"",
			"uniform sampler2D uSampler;",
			"",
			"varying vec4 vColor;",
			"varying vec3 vLight;",
			"varying vec2 vTextureUv;",
			"",
			"void main(void) {",
			"    if (vTextureUv.x < 0.0) {",
			"        gl_FragColor = vColor;",
			"    } else {",
			"        vec4 textureColor = ",
			"            texture2D(uSampler, vec2(vTextureUv.s, vTextureUv.t));",
			"        gl_FragColor = vec4(vLight * textureColor.rgb, textureColor.a);",
			"    }",
			"}"
		].join(newline);
		gl.shaderSource(fragmentShader, fragmentShaderCode);
		gl.compileShader(fragmentShader);

		return fragmentShader;
	}

	buildShaderProgram_VertexShader(gl: WebGLRenderingContext): WebGLShader
	{
		var vertexShader = gl.createShader(gl.VERTEX_SHADER);
		var newline = "\n";
		var vertexShaderCode =
		[
			"attribute vec4 aVertexColor;",
			"attribute vec3 aVertexNormal;",
			"attribute vec3 aVertexPosition;",
			"attribute vec2 aVertexTextureUV;",
			"",
			"// These are specified by the calling application.",
			"uniform mat4 uEntityMatrix;",
			"uniform mat4 uCameraMatrix;",
			"uniform float uLightAmbientIntensity;",
			"uniform float uLightDirectionalIntensity;",
			"uniform vec3 uLightDirectionalDirection;",
			"uniform vec3 uLightPointIntensity;",
			"uniform vec3 uLightPointPosition;",
			"uniform mat4 uNormalMatrix;",
			"",
			"// These are set below, then passed to the fragment shader.",
			"varying vec4 vColor;",
			"varying vec3 vLight;",
			"varying vec2 vTextureUv;",
			"",
			"void main(void) {",
			"    vColor = aVertexColor;",
			"    vec4 vertexNormal4 = vec4(aVertexNormal, 0.0);",
			"    vec4 transformedNormal4 = uNormalMatrix * vertexNormal4;",
			"    vec3 transformedNormal = vec3(transformedNormal4.xyz) * -1.0;",
			"    float lightMagnitude = uLightAmbientIntensity;",
			"    lightMagnitude += ",
			"        uLightDirectionalIntensity ",
			"        * max(dot(transformedNormal, uLightDirectionalDirection), 0.0);",
			"    vec3 lightColor = vec3(1.0, 1.0, 1.0);",
			"    vLight = lightColor * lightMagnitude;",
			"    vTextureUv = aVertexTextureUV;",
			"    vec4 vertexPos = vec4(aVertexPosition, 1.0);",
			"    gl_Position = uCameraMatrix * uEntityMatrix * vertexPos;",
			"}"
		].join(newline);
		gl.shaderSource(vertexShader, vertexShaderCode);
		gl.compileShader(vertexShader);

		return vertexShader;
	}

	buildShaderProgram_Compile
	(
		gl: WebGLRenderingContext, fragmentShader: WebGLShader, vertexShader: WebGLShader
	): WebGLProgram
	{
		var shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);
		gl.useProgram(shaderProgram);

		return shaderProgram;
	}

	buildShaderProgram_SetUpInputVariables
	(
		gl: WebGLRenderingContext,
		shaderProgram: WebGLProgram
	): void
	{
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

export class ShaderProgramVariables
{
	vertexColorAttribute: number;
	vertexNormalAttribute: number;
	vertexPositionAttribute: number;
	vertexTextureUVAttribute: number;
	entityMatrix: WebGLUniformLocation;
	cameraMatrix: WebGLUniformLocation;
	lightAmbientIntensity: WebGLUniformLocation;
	lightDirectionalIntensity: WebGLUniformLocation;
	lightDirectionalDirection: WebGLUniformLocation;
	lightPointIntensity: WebGLUniformLocation;
	lightPointPosition: WebGLUniformLocation;
	normalMatrix: WebGLUniformLocation;
}

class ShaderProgramVariableNames
{
	aVertexColor: string;
	aVertexNormal: string;
	aVertexPosition: string;
	aVertexTextureUV: string;
	uEntityMatrix: string;
	uCameraMatrix: string;
	uLightAmbientIntensity: string;
	uLightDirectionalIntensity: string;
	uLightDirectionalDirection: string;
	uLightPointIntensity: string;
	uLightPointPosition: string;
	uNormalMatrix: string;

	constructor()
	{
		this.aVertexColor = "aVertexColor";
		this.aVertexNormal = "aVertexNormal";
		this.aVertexPosition = "aVertexPosition";
		this.aVertexTextureUV = "aVertexTextureUV";
		this.uEntityMatrix = "uEntityMatrix";
		this.uCameraMatrix = "uCameraMatrix";
		this.uLightAmbientIntensity = "uLightAmbientIntensity";
		this.uLightDirectionalIntensity = "uLightDirectionalIntensity";
		this.uLightDirectionalDirection = "uLightDirectionalDirection";
		this.uNormalMatrix = "uNormalMatrix";
	}

	static _instance: ShaderProgramVariableNames;
	static Instance(): ShaderProgramVariableNames
	{
		if (this._instance == null)
		{
			this._instance = new ShaderProgramVariableNames();
		}
		return this._instance;
	}
}

}
