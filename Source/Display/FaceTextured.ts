
namespace ThisCouldBeBetter.GameFramework
{

export class FaceTextured extends Face
{
	material: Material;

	constructor(vertices: Coords[], material: Material)
	{
		super(vertices);
		this.material = material;
	}
}

}
