/**
 * @param {string} elementSelector
 */

function CanvasLib(elementSelector) {
   /** @type HTMLCanvasElement */
   let canvas = document.querySelector(elementSelector);

   /** @type CanvasRenderingContext2D */
   let ctx;

   this.width = 0;
   this.height = 0;

   /**
    * @param {object} options
    * @param {number} options.zoom
    */
   this.init = function ({ zoom }) {
      this.zoom = zoom;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx = canvas.getContext('2d');
      ctx.scale(zoom, zoom);
      ctx.imageSmoothingEnabled = false;
      this.width = Math.floor(canvas.width / this.zoom);
      this.height = Math.floor(canvas.height / this.zoom);
   };

   this.setColor = function (color) {
      if (color) {
         ctx.fillStyle = color;
      }
   };

   this.setPixel = function (x, y) {
      ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
   };

   this.line = function (x1, y1, x2, y2) {
      const dx = x2 - x1;
      const dy = y2 - y1;

      const lengthX = Math.abs(dx);
      const lengthY = Math.abs(dy);

      let pixelCount = lengthX;

      if (lengthX < lengthY) {
         pixelCount = lengthY;
      }

      const stepX = dx / pixelCount;
      const stepY = dy / pixelCount;

      for (let i = 0; i <= pixelCount; i = i + 1) {
         const pointX = x1 + stepX * i;
         const pointY = y1 + stepY * i;

         this.setPixel(Math.floor(pointX), Math.floor(pointY));
      }
   };

   this.clear = function (color) {
      this.setColor(color);
      this.fillRect(0, 0, this.width, this.height);
   };

   this.fillRect = function (x, y, w, h) {
      ctx.fillRect(x, y, w, h);
   };
}

export {
   CanvasLib
};
