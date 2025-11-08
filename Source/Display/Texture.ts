
namespace ThisCouldBeBetter.GameFramework
{

export class Texture
{
	name: string;
	image: Image2;

	systemTexture: WebGLTexture;

	constructor(name: string, image: Image2)
	{
		this.name = name;
		this.image = image;
	}

	static fromNameAndImage(name: string, image: Image2): Texture
	{
		return new Texture(name, image);
	}

	// methods

	initializeForWebGLContext(webGLContext: WebGLContext): void
	{
		var gl = webGLContext.gl;

		this.systemTexture = gl.createTexture();

		gl.bindTexture(gl.TEXTURE_2D, this.systemTexture);
		//gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D
		(
			gl.TEXTURE_2D,
			0,
			gl.RGBA,
			gl.RGBA,
			gl.UNSIGNED_BYTE,
			this.image.systemImage
		);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
}

}
