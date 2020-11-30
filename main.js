import { Maze } from './maze.js';


let maze;
const player = {
   x: 1,
   y: 1,
};

function ready() {
   maze.setCell(1, 1, Maze.CELLS.player);
   maze.setCell(23, 23, Maze.CELLS.exit);
}

function init() {
   const gamefield = document.getElementById('gamefield');
   maze = new Maze(gamefield);

   maze.addEventListener('ready', ready);
   maze.init({ width: 25, height: 25, cellSize: 20 });
}

function getNewPlayer(event) {
   const directionsMap = {
      ArrowUp: 'UP',
      ArrowDown: 'DOWN',
      ArrowLeft: 'LEFT',
      ArrowRight: 'RIGHT',
   };

   const newDirection = directionsMap[event.key];

   const stayPlayer = {
      x: player.x,
      y: player.y,
   };

   maze.setCell(player.x, player.y, Maze.CELLS.empty);

   switch (newDirection) {
      case 'UP':
         event.preventDefault();
         player.y = player.y - 1;
         break;
      case 'DOWN':
         event.preventDefault();
         player.y = player.y + 1;
         break;
      case 'LEFT':
         event.preventDefault();
         player.x = player.x - 1;
         break;
      case 'RIGHT':
         event.preventDefault();
         player.x = player.x + 1;
         break;
   }

   const obstacle = maze.getCell(player.x, player.y);

   if (obstacle === 'wall' || obstacle === 'permanent') {
      player.x = stayPlayer.x;
      player.y = stayPlayer.y;
   }

   if (obstacle === 'exit') {
      const gameOver = confirm('Game over! You are the WINER!!! Do you want to start the game again?');

      if (gameOver) {
         location.reload();
      }
   }

   maze.setCell(player.x, player.y, Maze.CELLS.player);
}

window.addEventListener('load', init);
window.addEventListener('keydown', getNewPlayer);