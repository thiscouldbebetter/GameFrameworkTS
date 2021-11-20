
namespace ThisCouldBeBetter.GameFramework
{

export interface VisualBase extends Clonable<VisualBase>, Transformable<VisualBase>
{
	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void;
}

export interface Visual<T extends VisualBase> extends Clonable<T>, Transformable<T>
{}

}
