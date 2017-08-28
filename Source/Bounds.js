
function Bounds(center, size)
{
	this.center = center;
	this.size = size;

	this.sizeHalf = this.size.clone().divideScalar(2);
	this._min = new Coords();
	this._max = new Coords();
}
{
	Bounds.prototype.containsPoint = function(pointToCheck)
	{
		return pointToCheck.isInRangeMinMax(this.min(), this.max());
	}
	
	Bounds.prototype.faces = function()
	{
		var min = this.min();
		var max = this.max();
		
		var vertices = 
		[
			// top
			new Coords(min.x, min.y, min.z),
			new Coords(max.x, min.y, min.z),
			new Coords(max.x, max.y, min.z),
			new Coords(min.x, max.y, min.z),

			// bottom
			new Coords(min.x, min.y, max.z),
			new Coords(max.x, min.y, max.z),
			new Coords(max.x, max.y, max.z),
			new Coords(min.x, max.y, max.z),
		];
		
		this._faces = 
		[
			new Face([vertices[0], vertices[1], vertices[5], vertices[4]]), // north
			new Face([vertices[1], vertices[2], vertices[6], vertices[5]]), // east

			new Face([vertices[2], vertices[3], vertices[7], vertices[6]]), // south
			new Face([vertices[3], vertices[0], vertices[4], vertices[7]]), // west
			
			new Face([vertices[0], vertices[1], vertices[2], vertices[3]]), // top
			new Face([vertices[4], vertices[5], vertices[6], vertices[7]]), // bottom

		];
		
		return this._faces;
	}

	Bounds.prototype.max = function()
	{
		return this._max.overwriteWith(this.center).add(this.sizeHalf);
	}

	Bounds.prototype.min = function()
	{
		return this._min.overwriteWith(this.center).subtract(this.sizeHalf);
	}

    Bounds.prototype.overlapsWith = function(other)
    {
        var returnValue = false;
 
        var bounds = [ this, other ];
 
        for (var b = 0; b < bounds.length; b++)
        {
            var boundsThis = bounds[b];
            var boundsOther = bounds[1 - b];            
 
            var doAllDimensionsOverlapSoFar = true;
 
            for (var d = 0; d < Coords.NumberOfDimensions; d++)
            {
                if 
                (
                    boundsThis.max().dimension(d) <= boundsOther.min().dimension(d)
                    || boundsThis.min().dimension(d) >= boundsOther.max().dimension(d)
                )
                {
                    doAllDimensionsOverlapSoFar = false;
                    break;
                }
            }
 
            if (doAllDimensionsOverlapSoFar == true)
            {
                returnValue = true;
                break;
            }
        }
 
        return returnValue;
    }
}