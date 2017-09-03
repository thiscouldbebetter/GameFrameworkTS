
function Face(vertices)
{
	this.vertices = vertices;
	this.plane = new Plane(new Coords()).fromPoints(this.vertices);
}
{
	Face.prototype.containsPoint = function(pointToCheck)
	{
		var returnValue = true;

		var edges = this.edges();
		var normal = this.plane.normal;
		for (var e = 0; e < edges.length; e++)
		{
			var edge = edges[e];
			var distanceAlongTransverse = edge.transverse(normal).dotProduct(pointToCheck);
			var isPointWithinEdge = (distanceAlongTransverse > 0);
			if (isPointWithinEdge == false)
			{
				returnValue = false;
				break;
			}
		}
		return returnValue;
	}

	Face.prototype.edges = function()
	{
		if (this._edges == null)
		{
			this._edges = [];

			for (var v = 0; v < this.vertices.length; v++)
			{
				var vNext = NumberHelper.wrapValueToRangeMinMax(v + 1, 0, this.vertices.length);
				var vertex = this.vertices[v];
				var vertexNext = this.vertices[vNext];

				var edge = new Edge([vertex, vertexNext]);

				this._edges.push(edge);
			}
		}

		return this._edges;
	}

	Face.prototype.recalculate = function()
	{
		this.plane.fromPoints(this.vertices);
	}
}
