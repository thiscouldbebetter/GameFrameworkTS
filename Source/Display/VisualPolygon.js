
function VisualPolygon(vertices, colorFill, colorBorder)
{
	this.vertices = vertices;
	this.colorFill = colorFill;
	this.colorBorder = colorBorder;	

	this.verticesTransformed = [];
	for (var i = 0; i < this.vertices.length; i++)
	{
		this.verticesTransformed[i] = new Coords();
	}
}

{
	VisualPolygon.prototype.draw = function(universe, world, display, drawable)
	{
		var pos = drawable.loc.pos;

		for (var i = 0; i < this.verticesTransformed.length; i++)
		{
			var vertexBase = this.vertices[i];
			var vertexTransformed = this.verticesTransformed[i];

			vertexTransformed.overwriteWith(vertexBase).add(pos);
		}

		display.drawPolygon
		(
			this.verticesTransformed, this.colorFill, this.colorBorder
		);
	}
}
