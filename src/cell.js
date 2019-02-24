

// cell obj.
function Cell(colIdx, rowIdx, cellsize)
{
	this.colIdx 	= colIdx;
	this.rowIdx 	= rowIdx;
	this.cellsize 	= cellsize;
	this.xPos 		= this.colIdx * this.cellsize;
	this.yPos 		= this.rowIdx * this.cellsize;
	this.bombe 		= false;
	this.revealed 	= false;
	this.bombeSize	= this.cellsize * 0.5;
	this.neighborCellCount = 0;
	this.marker = false;
}


Cell.prototype.show = function()
{
	stroke(0);
	noFill();
	rect(this.xPos, this.yPos, this.cellsize, this.cellsize);

	if(this.revealed)
	{
		if(this.bombe)
		{
			noStroke();
			fill(229, 65, 36);
			ellipse(this.xPos + this.cellsize * 0.5,
					this.yPos + this.cellsize * 0.5,
					this.bombeSize);
		}
		else if (this.neighborCellCount == 0)
		{
			fill(200);
			rect(this.xPos, this.yPos, this.cellsize, this.cellsize);
		}
		else
		{
			fill(200);
			rect(this.xPos, this.yPos, this.cellsize, this.cellsize);

			textAlign(CENTER);
			textSize(24);
			fill(0);
			text(this.neighborCellCount,
				 this.xPos + this.cellsize * 0.5,
				 this.yPos + this.cellsize - 12);
		}
	}
	else if (this.marker)
	{
		stroke(229, 65, 36);
		noFill();
		ellipse(this.xPos + this.cellsize * 0.5,
				this.yPos + this.cellsize * 0.5,
				this.bombeSize);
	}
}


// sets a marker
Cell.prototype.setMarker = function()
{
	if (!this.revealed)
		this.marker = true;
}


// checks wether the clicked position is the cell
Cell.prototype.contains = function(x, y)
{
	return (x > this.xPos && x < this.xPos + this.cellsize &&
			y > this.yPos && y < this.yPos + this.cellsize)
}


Cell.prototype.reveal = function()
{
	this.revealed = true;

	// check for pssible floot fill
	if (this.neighborCellCount == 0)
		this.floodFill();
}


Cell.prototype.floodFill = function()
{
	// check all neighbors
	for(var rowOff = -1; rowOff <= 1; rowOff++)
	{
		for(var colOff = -1; colOff <= 1; colOff++)
		{
			var i = this.colIdx + colOff;
			var j = this.rowIdx + rowOff;
			if (i > -1 && i < numGridCols &&
				j > -1 && j < numGridRows)
			{
				// reveal all non bombe neigbor cells auto.
				// and they shouldnt be revealed already
				var neighborCell = grid[i][j];
				if (!neighborCell.bombe && !neighborCell.revealed)
					neighborCell.reveal();
			}
		}
	}
}


Cell.prototype.countBombes = function()
{
	if (this.bombe)
		this.neighborCellCount = -1;

	var totalBombeCount = 0;

	// [col, row] = [j, i]
	// [0, 0] = current cell
	// [-1, -1] [-1, 0] [-1, 1]
	// [0, -1]  [0, 0]  [0, 1]
	// [1, -1]  [1, 0]  [1, 1]
	for(var rowOff = -1; rowOff <= 1; rowOff++)
	{
		for(var colOff = -1; colOff <= 1; colOff++)
		{
			var i = this.colIdx + colOff;
			var j = this.rowIdx + rowOff;
			if (i > -1 && i < numGridCols &&
				j > -1 && j < numGridRows)
			{
				var neighborCell = grid[i][j];
				if (neighborCell.bombe)
					totalBombeCount++;
			}

		}
	}
	this.neighborCellCount = totalBombeCount;
}