
function Edge(vertices)
{
	this.vertices = vertices;
}
{
	Edge.prototype.direction = function()
	{
		if (this._direction == null)
		{
			this._direction = this.displacement().clone().normalize();
		}

		return this._displacement;
	}
	
	Edge.prototype.displacement = function()
	{
		if (this._displacement == null)
		{
			this._displacement = this.vertices[1].clone().subtract(this.vertices[0]);
		}

		return this._displacement;
	}
	
	Edge.prototype.transverse = function(faceNormal)
	{
		if (this._transverse == null)
		{
			this._transverse = faceNormal.clone().crossProduct(this.direction());
		}

		return this._transverse;
	}
}