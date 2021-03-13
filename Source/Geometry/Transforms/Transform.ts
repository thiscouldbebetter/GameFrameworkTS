
namespace ThisCouldBeBetter.GameFramework
{

export interface Transform
{
	overwriteWith(x: Transform): Transform;
	transform(x: Transformable): Transformable;
	transformCoords(x: Coords): Coords;
}

}
