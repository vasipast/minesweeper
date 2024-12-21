const boardSize = 10;
const bombFrequency = 0.25; 
const tileSize = 50;
let tiles;
const board = document.querySelectorAll('.board')[0];
const endscreen = document.querySelectorAll('.endscreen')[0]
let bombs = [];
let numbers = [];
let numColors = ['#db3434', '#db7134', '#f5f238', '#8af538', '#38bcf5', '#3848f5', '#c24cf5', '#fa69bb',];
let endscreenContent = {win: 'Вы победили!', loose: 'Вы проиграли'};
let gameOver = false;

const setup = () => {
	for (let i = 0; i < Math.pow(boardSize, 2); i++) {
		const tile = document.createElement('div');
		tile.classList.add('tile');
		board.appendChild(tile);
	}
	tiles = document.querySelectorAll('.tile');
	board.style.width = `${boardSize * tileSize}px`;
	
	let x = 0;
	let y = 0;
	tiles.forEach((tile, i) => {
		tile.setAttribute('data-tile', `${x},${y}`);
		
		let random_boolean = Math.random() < bombFrequency;
		if (random_boolean) {
			bombs.push(`${x},${y}`);
			if (x > 0) numbers.push(`${x-1},${y}`);
			if (x < boardSize - 1) numbers.push(`${x+1},${y}`);
			if (y > 0) numbers.push(`${x},${y-1}`);
			if (y < boardSize - 1) numbers.push(`${x},${y+1}`);
			if (x > 0 && y > 0) numbers.push(`${x-1},${y-1}`);
			if (x < boardSize - 1 && y < boardSize - 1) numbers.push(`${x+1},${y+1}`);
			if (y > 0 && x < boardSize - 1) numbers.push(`${x+1},${y-1}`);
			if (x > 0 && y < boardSize - 1) numbers.push(`${x-1},${y+1}`);
		}
		
		x++;
		if (x >= boardSize) {
			x = 0;
			y++;
		}

		tile.addEventListener('click', function(e) {
			clickTile(tile);
		});
		
		tile.oncontextmenu = function(e) {
			e.preventDefault();
			flag(tile);
		}
	});
	
	numbers.forEach(num => {
		const [x, y] = num.split(',');
		const tile = document.querySelector(`[data-tile="${x},${y}"]`);
		const dataNumAttr = tile.getAttribute('data-num');
		const dataNum = dataNumAttr ? parseInt(dataNumAttr) : 0;
		tile.setAttribute('data-num', dataNum + 1);
	  });
}

const flag = (tile) => {
	if (gameOver) return;
	if (!tile.classList.contains('tile--checked')) {
		tile.classList.toggle('tile--flagged');
		if (tile.classList.contains('tile--flagged')) {
			tile.textContent = '🚩';
		} else { 
			tile.textContent = '';
		}
	}
};

const clickTile = (tile) => {
	if (tile.classList.contains('tile--checked') || tile.classList.contains('tile--flagged')) return;
	if (gameOver) return;

	let coordinate = tile.getAttribute('data-tile');
	if (bombs.includes(coordinate)) {
		endGame(tile);
		return;
	}

	let num = tile.getAttribute('data-num');
	if (num !== null) {
		tile.classList.add('tile--checked');
		tile.textContent = num;
		tile.style.color = numColors[num - 1];
		setTimeout(checkWin, 100);
		return;
	}

	checkTile(tile, coordinate);
	tile.classList.add('tile--checked');
};

const checkTile = (tile, coordinate) => {
	let coords = coordinate.split(',');
	let x = parseInt(coords[0]);
	let y = parseInt(coords[1]);
  
	setTimeout(() => {
	  const directions = [
		{ dx: -1, dy: 0 },
		{ dx: 1, dy: 0 }, 
		{ dx: 0, dy: -1 },
		{ dx: 0, dy: 1 },
		{ dx: -1, dy: -1 },
		{ dx: 1, dy: 1 },
		{ dx: 1, dy: -1 },
		{ dx: -1, dy: 1 }
	  ];
  
	  for (const direction of directions) {
		const newX = x + direction.dx;
		const newY = y + direction.dy;
  
		if (newX >= 0 && newX < boardSize && newY >= 0 && newY < boardSize) {
		  const target = document.querySelectorAll(`[data-tile="${newX},${newY}"]`)[0];
		  clickTile(target, `${newX},${newY}`);
		}
	  }
	}, 10);
  };

const endGame = (tile) => {
	endscreen.innerHTML = endscreenContent.loose;
	endscreen.classList.add('show');
	gameOver = true;
	tiles.forEach(tile => {
		let coordinate = tile.getAttribute('data-tile');
		if (bombs.includes(coordinate)) {
			tile.classList.remove('tile--flagged');
			tile.classList.add('tile--checked', 'tile--bomb');
			tile.innerHTML = '&#128163;';
		}
	});
}

const checkWin = () => {
	let win = true;
	tiles.forEach(tile => {
		let coordinate = tile.getAttribute('data-tile');
		if (!tile.classList.contains('tile--checked') && !bombs.includes(coordinate)) win = false;
	});
	if (win) {
		endscreen.innerHTML = endscreenContent.win;
		endscreen.classList.add('show');
		gameOver = true;
	}
}

setup();
