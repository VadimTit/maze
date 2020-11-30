export class Gamefield {
   width = 50;
   height = 30;
   cellSize = 20;

   
   /**
    * @param {HTMLElement} element
    */
   constructor(element) {
      this.element = element;
   }

   /**
    * @param {object} options
    * @param {number} options.width
    * @param {number} options.height
    * @param {number} options.cellSize
    */
   // @ts-ignore
   init(options = {}) {
      this.width = options.width || this.width;
      this.height = options.height || this.height;
      this.cellSize = options.cellSize || this.cellSize;

      this.element.innerHTML = '';
      for (let y = 0; y < this.height; y++) {
         for (let x = 0; x < this.width; x++) {
            this._createCell(x, y);
         }
      }

      this.element.style.width = this.width * this.cellSize + 'px';
      this.element.style.height = this.height * this.cellSize + 'px';
   }

   /**
    * @param {number} x
    * @param {number} y
    * @returns {HTMLDivElement}
    */
   getCell(x, y) {
      const id = `x${x}y${y}`;
      return this.element.querySelector(`#${id}`);
   }

   /**
    * @param {number} x
    * @param {number} y
    * @param {string} cellClass
    */
   setCellClass(x, y, cellClass) {
      const cell = this.getCell(x, y);
      cell.className = cellClass;
   }

   /**
    * @param {number} x
    * @param {number} y
    * @returns {string}
    */
   getCellClass(x, y) {
      const cell = this.getCell(x, y);
      return cell.className;
   }

   _createCell(x, y) {
      const cell = document.createElement('div');
      cell.id = `x${x}y${y}`;
      cell.dataset.x = x;
      cell.dataset.y = y;

      cell.style.left = `${x * this.cellSize}px`;
      cell.style.top = `${y * this.cellSize}px`;
      cell.style.width = `${this.cellSize}px`;
      cell.style.height = `${this.cellSize}px`;

      this.element.appendChild(cell);

      return cell;
   }

}