
namespace ThisCouldBeBetter.GameFramework
{

export interface VisualImage extends Visual
{
	image(u: Universe): Image2
	sizeInPixels(u: Universe): Coords
}

}
