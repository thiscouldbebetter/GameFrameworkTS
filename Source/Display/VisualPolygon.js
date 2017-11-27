
function VisualPolygon(color, vertices)
{
	this.color = color;
	this.vertices = vertices;

	this.verticesTransformed = [];
	for (var i = 0; i < this.vertices.length; i++)
	{
		this.verticesTransformed[i] = new Coords();
	}
}

{
	VisualPolygon.prototype.draw = function(universe, display, drawable, loc)
	{
		var pos = loc.pos;

		for (var i = 0; i < this.verticesTransformed.length; i++)
		{
			var vertexBase = this.vertices[i];
			var vertexTransformed = this.verticesTransformed[i];

			vertexTransformed.overwriteWith(vertexBase).add(pos);
		}

		display.drawPolygon
		(
			this.verticesTransformed, this.color, display.colorFore
		);
	}
}
