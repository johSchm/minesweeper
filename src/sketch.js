var grid;
var canvasHeight = 800;
var canvasWidth  = 800;
var canvasOffset = 1;
var cellSize  	 = 50;
var numGridRows  = canvasHeight / cellSize;
var numGridCols  = canvasWidth  / cellSize;
var totalBombes  = 20;
var pressStartTime = 0;
var pressEndTime   = 0;
var longPressDuration = 1000;


function make2DArray(cols, rows)
{
	var arr = new Array(cols);
	for(var i = 0; i < arr.length; i++)
		arr[i] = new Array(rows);
	return arr;
}


function touchStarted()
{
	pressStartTime = performance.now();
}


function touchEnded()
{
	pressEndTime = performance.now(); 
	mouseClickEvent(pressEndTime - pressStartTime);
}


function mousePressed()
{
	pressStartTime = performance.now();
}


function mouseReleased()
{
	pressEndTime = performance.now();
	mouseClickEvent(pressEndTime - pressStartTime);
}


function mouseClickEvent(passedClickTime)
{
	for (var i = 0; i < numGridCols; i++)
	{
		for (var j = 0; j < numGridRows; j++)
		{
			if (grid[i][j].contains(mouseX, mouseY))
			{
				// reveal clicked cell
				if (passedClickTime < longPressDuration)
				{
					grid[i][j].reveal();
					if (grid[i][j].bombe)
						gameOver();
				}

				// set marker
				else
				{
					grid[i][j].setMarker();
				}
			}
		}
	}
}


function gameOver()
{
	// reveal the everything
	for (var i = 0; i < numGridCols; i++)
		for (var j = 0; j < numGridRows; j++)
			grid[i][j].revealed = true;
}


function setup()
{
	// create basic playground
	createCanvas(canvasHeight + canvasOffset, canvasWidth + canvasOffset);
	grid = make2DArray(numGridCols, numGridRows)

	// init. every grid element
	for (var i = 0; i < numGridCols; i++)
		for (var j = 0; j < numGridRows; j++)
			grid[i][j] = new Cell(i, j, cellSize);

	// distribute bombes along the grid
	for (var n = 0; n < totalBombes; n++)
	{
		var i = floor(random(numGridCols));
		var j = floor(random(numGridRows));
		if (grid[i][j].bombe)
			n--;
		else
			grid[i][j].bombe = true;
	}

	// assign bombe count numbers to the cells
	for (var i = 0; i < numGridCols; i++)
		for (var j = 0; j < numGridRows; j++)
			grid[i][j].countBombes();
}


function draw()
{
	background(255);

	// draw all grid elements
	for (var i = 0; i < numGridCols; i++)
		for (var j = 0; j < numGridRows; j++)
			grid[i][j].show();
}