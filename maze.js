import { Gamefield } from './libs/gamefield.js';
/**
 * Create a new maze by providing a base DOM element to constructor
 *
 * Use "init" method to initialize the maze with desired options.
 *
 * The Maze class extends DOM EventTarget.
 * When the maze is complete, the maze instance emits a "ready" event.
 * You can listen to "ready" event as to usual DOM event.
 */

export class Maze extends EventTarget {
  /** @type string[] */
  _crackedWalls = [];

  width = 11;
  height = 11;
  cellSize = 25;
  async = true;
  asyncDelay = 1;

  static directions = [
    { name: 'north', x: 0, y: -1 },
    { name: 'south', x: 0, y: 1 },
    { name: 'west', x: -1, y: 0 },
    { name: 'east', x: 1, y: 0 },
  ];

  static CELLS = {
    empty: '',
    permanent: 'permanent',
    cracked: 'cracked',
    wall: 'wall',
    untouched: 'untouched',
    player: 'player',
    exit: 'exit',
  }

  ready = new Promise(resolve => this._done = resolve);

  /**
   * @param {HTMLElement} element
   */
  constructor(element) {
    super();
    this.gamefield = new Gamefield(element);
  }

  /**
   * @param {object} options
   * @param {number} options.width
   * @param {number} options.height
   * @param {number} [options.cellSize]
   * @param {boolean} [options.async]
   * @param {number} [options.asyncDelay]
   */
  init(options) {
    // this is not the safest solution, however it's the shortest one.
    // Always assign only known properties to this
    Object.assign(this, options);

    if (!(this.width % 2 && this.height % 2)) {
      throw new Error('Width and Height of the maze should be odd.');
    }

    this.gamefield.init({
      width: this.width,
      height: this.height,
      cellSize: this.cellSize,
    });

    this._setupWalls();
    const startX = Math.floor(Math.random() * (Math.floor(this.width / 2))) * 2 + 1;
    const startY = Math.floor(Math.random() * (Math.floor(this.height / 2))) * 2 + 1;

    this._exploreCell(startX, startY);
    this._dissolveRandomWall();
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {string}
   */
  getCell(x, y) {
    return this.gamefield.getCellClass(x, y);
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {string} cellClass
   */
  setCell(x, y, cellClass) {
    return this.gamefield.setCellClass(x, y, cellClass);
  }

  _setupWalls() {
    for (let y = 1; y < this.height; y = y + 2) {
      for (let x = 1; x < this.width; x = x + 2) {
        this.setCell(x, y, Maze.CELLS.untouched);
        this.setCell(x + 1, y, Maze.CELLS.wall);
        this.setCell(x, y + 1, Maze.CELLS.wall);
        this.setCell(x + 1, y + 1, Maze.CELLS.permanent);
      }
    }

    for (let y = 0; y < this.height; y = y + 1) {
      this.setCell(0, y, Maze.CELLS.permanent);
      this.setCell(this.width - 1, y, Maze.CELLS.permanent);
    }
    for (let x = 0; x < this.width; x = x + 1) {
      this.setCell(x, 0, Maze.CELLS.permanent);
      this.setCell(x, this.height - 1, Maze.CELLS.permanent);
    }
  }

  _exploreCell(cellX, cellY) {
    const cellId = `x${cellX}y${cellY}`;
    switch (this.getCell(cellX, cellY)) {
    // A common wall found. We'll put some cracks on it and track its location.
    case Maze.CELLS.wall:
      this._crackedWalls.push(cellId);
      this.setCell(cellX, cellY, Maze.CELLS.cracked);
      return;
      // a wall found second time from other side, so it should not be removed.
      // Remove its location from crackedWalls array.
    case Maze.CELLS.cracked:
      this._crackedWalls.splice(this._crackedWalls.indexOf(cellId), 1);
      this.setCell(cellX, cellY, Maze.CELLS.permanent);
      return;
      // an empty space. Need to check out its suroundings.
      // Remove all classes to prevent any further action for this cell
    case Maze.CELLS.untouched:
      this.setCell(cellX, cellY, Maze.CELLS.empty);
      Maze.directions.forEach(({ x, y }) => this._exploreCell(cellX + x, cellY + y));
      return;
    default:
    }
  }

  _dissolveRandomWall() {
    if (!this._crackedWalls.length) {
      this._done(this);
      this.dispatchEvent(new CustomEvent('ready', { detail: this }));
      return;
    }
    // pick a random wall from the array. Remove it from array.
    const [removeWallCellId] = this._crackedWalls.splice(Math.floor(Math.random() * this._crackedWalls.length), 1);
    const [x, y] = removeWallCellId.substring(1).split('y');
    // mark as empty unprocessed space
    this.setCell(Number(x), Number(y), Maze.CELLS.untouched);

    this._exploreCell(Number(x), Number(y));

    if (this.async) {
      // Schedule an attempt to dissolve one more wall
      setTimeout(() => this._dissolveRandomWall(), this.asyncDelay);
    } else {
      // do it synchronously
      this._dissolveRandomWall();
    }
  }
}
