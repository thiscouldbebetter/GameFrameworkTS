
namespace ThisCouldBeBetter.GameFramework
{

export interface Inactivatable<T>
{
	activate(): Inactivatable<T>;
	activated(): boolean;
	inactivate(): Inactivatable<T>;
	inactivated(): boolean;
}

}
