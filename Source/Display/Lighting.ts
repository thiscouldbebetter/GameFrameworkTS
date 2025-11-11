
namespace ThisCouldBeBetter.GameFramework
{

export class Lighting
{
	lightAmbient: LightAmbient;
	lightDirectional: LightDirectional;
	lightPoint: LightPoint;

	constructor
	(
		lightAmbient: LightAmbient,
		lightDirectional: LightDirectional,
		lightPoint: LightPoint
	)
	{
		this.lightAmbient = lightAmbient;
		this.lightDirectional = lightDirectional;
		this.lightPoint = lightPoint;
	}

	static default(): Lighting
	{
		return new Lighting
		(
			LightAmbient.fromIntensity(.5),
			LightDirectional.fromIntensityAndDirection(.4, Coords.ones().multiplyScalar(-1).normalize() ),
			null // lightPoint
		);
	}

	static fromLightsAmbientDirectionalAndPoint
	(
		lightAmbient: LightAmbient,
		lightDirectional: LightDirectional,
		lightPoint: LightPoint
	): Lighting
	{
		return new Lighting(lightAmbient, lightDirectional, lightPoint);
	}
}

class LightAmbient
{
	intensity: number;

	constructor(intensity: number)
	{
		this.intensity = intensity;
	}

	static fromIntensity(intensity: number): LightAmbient
	{
		return new LightAmbient(intensity);
	}

	writeToWebGlContext(webGlContext: WebGLContext): void
	{
		var gl = webGlContext.gl;
		var shaderProgram = webGlContext.shaderProgram;

		gl.uniform1f
		(
			shaderProgram.lightAmbientIntensity,
			this.intensity
		);
	}
}

class LightDirectional
{
	intensity: number;
	direction: Coords;

	constructor(intensity: number, direction: Coords)
	{
		this.intensity = intensity;
		this.direction = direction;
	}

	static fromIntensityAndDirection(intensity: number, direction: Coords): LightDirectional
	{
		return new LightDirectional(intensity, direction);
	}

	writeToWebGlContext(webGlContext: WebGLContext): void
	{
		var gl = webGlContext.gl;
		var shaderProgram = webGlContext.shaderProgram;

		gl.uniform3fv
		(
			shaderProgram.lightDirection,
			WebGLContext.coordsToWebGLArray(this.direction)
		);

		gl.uniform1f
		(
			shaderProgram.lightDirectionalIntensity,
			this.intensity
		);
	}
}

class LightPoint
{
	intensity: number;
	pos: Coords;

	constructor(intensity: number, pos: Coords)
	{
		this.intensity = intensity;
		this.pos = pos;
	}

	static fromIntensityAndPos(intensity: number, pos: Coords): LightPoint
	{
		return new LightPoint(intensity, pos);
	}

	writeToWebGlContext(webGlContext: WebGLContext): void
	{
		// todo
	}
}

}
