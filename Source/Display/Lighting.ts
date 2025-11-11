
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

	static fromLightPoint(lightPoint: LightPoint): Lighting
	{
		return new Lighting
		(
			LightAmbient.dark(),
			LightDirectional.dark(),
			lightPoint
		);
	}
}

export class LightAmbient
{
	intensity: number;

	constructor(intensity: number)
	{
		this.intensity = intensity;
	}

	static dark(): LightAmbient
	{
		return new LightAmbient(0);
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

export class LightDirectional
{
	intensity: number;
	direction: Coords;

	constructor(intensity: number, direction: Coords)
	{
		this.intensity = intensity;
		this.direction = direction;
	}

	static dark(): LightDirectional
	{
		return new LightDirectional(0, Coords.fromXYZ(1, 0, 0) );
	}

	static fromIntensityAndDirection(intensity: number, direction: Coords): LightDirectional
	{
		return new LightDirectional(intensity, direction);
	}

	writeToWebGlContext(webGlContext: WebGLContext): void
	{
		var gl = webGlContext.gl;
		var shaderProgram = webGlContext.shaderProgram;

		gl.uniform1f
		(
			shaderProgram.lightDirectionalIntensity,
			this.intensity
		);

		gl.uniform3fv
		(
			shaderProgram.lightDirectionalDirection,
			WebGLContext.coordsToWebGLArray(this.direction)
		);
	}
}

export class LightPoint
{
	intensity: number;
	pos: Coords;

	constructor(intensity: number, pos: Coords)
	{
		this.intensity = intensity;
		this.pos = pos;
	}

	static default(): LightPoint
	{
		return new LightPoint(1, Coords.zeroes() );
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
