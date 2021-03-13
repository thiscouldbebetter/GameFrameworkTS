
namespace ThisCouldBeBetter.GameFramework
{

export interface Clonable<T>
{
	clone(): T;
	overwriteWith(other: T): T;
}

}
