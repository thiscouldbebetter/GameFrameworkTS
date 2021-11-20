
namespace ThisCouldBeBetter.GameFramework
{

export interface VisualImage extends VisualBase
{
	image(u: Universe): Image2
	sizeInPixels(u: Universe): Coords
}

}
