const WIDTH = 1000;
const HEIGHT = 400;
const PADDING = 60;
const FONT_SIZE = 13;

const DPI = 2;
const DPI_WIDTH = WIDTH * DPI;
const DPI_HEIGHT = HEIGHT * DPI;
const DPI_PADDING = PADDING * DPI;
const DPI_FONT_SIZE = FONT_SIZE * DPI;

const VIEW_HEIGHT = DPI_HEIGHT - DPI_PADDING * 2;
const VIEW_WIDTH = DPI_WIDTH - DPI_PADDING * 2;

const ROWS_COUNT = 5;

const COLORS = ['#609DF9', '#77D066', '#FFBD3B', '#CC73F5', '#E85A5A'];

const CANVAS = document.getElementById('chart');
const CTX = CANVAS.getContext('2d');
CANVAS.style.width = WIDTH + 'px';
CANVAS.style.height = HEIGHT + 'px';
CANVAS.width = DPI_WIDTH;
CANVAS.height = DPI_HEIGHT;

let ANIMATE_COUNT = 1;
const ANIMATE_LIMIT = 30;

function initChart(data) {
  paint(data);
}

initChart({
  ['14-07-1990']: {sent: 4, open: 2, click: 0, reply: 6, bounce: 1},
  ['15-07-1990']: {sent: 7, open: 3, click: 4, reply: 6, bounce: 1},
  ['16-07-1990']: {sent: 9, open: 5, click: 4, reply: 6, bounce: 1},
  ['18-07-1990']: {sent: 8, open: 5, click: 4, reply: 0, bounce: 1},
  ['19-07-1990']: {sent: 10, open: 0, click: 4, reply: 6, bounce: 1},
  ['20-07-1990']: {sent: 6, open: 3, click: 4, reply: 6, bounce: 1},
  ['21-07-1990']: {sent: 5, open: 2, click: 4, reply: 6, bounce: 0},
  ['22-07-1990']: {sent: 8, open: 4, click: 4, reply: 6, bounce: 1},
});


function paint(data) {
  const ctx = CTX;
  // const data = DATA;
  const yMax = computeYmax(data);
  const yRatio = VIEW_HEIGHT / (yMax - 0);
  const nCols = Object.keys(data).length;

  ctx.clearRect(0,0,DPI_WIDTH,DPI_HEIGHT);

  yAxis(ctx, yMax);
  xAxis(ctx, nCols, data);
  histogram(ctx, data, nCols, yRatio);

  ctx.restore();

  ANIMATE_COUNT++
  if (ANIMATE_COUNT <= ANIMATE_LIMIT) {
    requestAnimationFrame(() => paint(data));
  } else {
    ANIMATE_COUNT = 1;
  }
}

function computeYmax(data) {
  let max;

  Object.values(data).forEach(item => {
    if (typeof max !== 'number') max = item.sent;
    if (max < item.sent) max = item.sent;
  });

  if (max <= 5) return 5;

  if (max.toString().length > 3) {
    const pow = Math.pow(10, max.toString().length - 2);
    return Math.ceil(max / pow) * pow;
  } else if (max.toString().length === 3) {
    const pow = Math.pow(10, max.toString().length - 1);
    return Math.ceil(max / pow) * pow;
  } else {
    return Math.ceil(max / 10) * 10;
  }
}

function yAxis(ctx, yMax) {
  const step = VIEW_HEIGHT / ROWS_COUNT;
  const textStep = yMax / ROWS_COUNT;

  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#DFE1F0';
  ctx.font = `normal ${DPI_FONT_SIZE}px Helvetica, sans-serif`;
  ctx.fillStyle = '#949AA1';
  ctx.textAlign = 'end';

  let yFirst = DPI_PADDING % 2 !== 0 ? DPI_PADDING : DPI_PADDING + 1;

  ctx.fillText(yMax.toString(), DPI_PADDING - 10, DPI_PADDING + 7);
  ctx.moveTo(DPI_PADDING, yFirst);
  ctx.lineTo(DPI_PADDING + VIEW_WIDTH, yFirst);

  for (let i = 1; i <= ROWS_COUNT; i++) {
    let y = Math.round(step * i);
    y = y % 2 !== 0 ? y : y + 1;

    const text = yMax - textStep * i;

    ctx.fillText(text.toString(), DPI_PADDING - 10, y + DPI_PADDING + 7);
    ctx.moveTo(DPI_PADDING, y + DPI_PADDING);
    ctx.lineTo(DPI_PADDING + VIEW_WIDTH, y + DPI_PADDING);
  }
  ctx.stroke();
  ctx.closePath();
}

function xAxis(ctx, nCols, data) {
  let step =  Math.round(VIEW_WIDTH / nCols);
  step = step % 2 !== 0 ? step : step + 1;

  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#DFE1F0';
  ctx.font = `normal ${DPI_FONT_SIZE}px Helvetica, sans-serif`;
  ctx.fillStyle = '#949AA1';
  ctx.textAlign = 'center';

  const dates = Object.keys(data).map(date => date);

  for (let i = 1; i <= nCols; i++) {
    let x = step * i;

    ctx.fillText(dates[i - 1].toString(), DPI_PADDING + x - step / 2, DPI_PADDING + VIEW_HEIGHT + 40);
    ctx.moveTo(DPI_PADDING + x - step / 2, DPI_PADDING + VIEW_HEIGHT);
    ctx.lineTo(DPI_PADDING + x - step / 2, DPI_PADDING + VIEW_HEIGHT + 10);

  }
  ctx.stroke();
  ctx.closePath();
}

function histogram(ctx, data, nCols, yRatio) {
  let step = Math.round(VIEW_WIDTH / nCols);
  step = step % 2 !== 0 ? step : step + 1;


  Object.values(data).forEach((date, index) => {

    const length = Object.keys(date).length;

    let widthLine = Math.round(step / (length * 2));

    while (widthLine % length !== 0) {
      widthLine++
    }

    const pureArea = (step - widthLine * length) / 2;

    Object.values(date).forEach((item, i) => {
      ctx.beginPath();
      ctx.strokeStyle = COLORS[i];
      ctx.lineWidth = widthLine;

      let x = (DPI_PADDING + step * (index + 1)) - (pureArea + (length - i - 1) * widthLine + widthLine / 2);

      ctx.moveTo(x, DPI_PADDING + VIEW_HEIGHT);
      ctx.lineTo(x, DPI_PADDING + VIEW_HEIGHT - item * yRatio / ANIMATE_LIMIT * ANIMATE_COUNT);

      ctx.stroke();
      ctx.closePath();
    })
  })
}




const week = document.getElementById('week');
week.onclick = function () {
  initChart( {
    ['14-07-1990']: {sent: 4, open: 2, click: 0, reply: 6, bounce: 1},
    ['15-07-1990']: {sent: 7, open: 3, click: 4, reply: 6, bounce: 1},
    ['16-07-1990']: {sent: 9, open: 5, click: 4, reply: 6, bounce: 1},
    ['18-07-1990']: {sent: 8, open: 5, click: 4, reply: 0, bounce: 1},
    ['19-07-1990']: {sent: 10, open: 0, click: 4, reply: 6, bounce: 1},
    ['20-07-1990']: {sent: 6, open: 3, click: 4, reply: 6, bounce: 1},
    ['21-07-1990']: {sent: 5, open: 2, click: 4, reply: 6, bounce: 0},
    ['22-07-1990']: {sent: 8, open: 4, click: 4, reply: 6, bounce: 1},
  });
}

const year = document.getElementById('year');
year.onclick = function () {
  initChart( {
    ['Jan']: {sent: 1265, open: 589, click: 256, reply: 150, bounce: 85},
    ['Feb']: {sent: 968, open: 456, click: 365, reply: 265, bounce: 100},
    ['Mar']: {sent: 746, open: 420, click: 258, reply: 198, bounce: 98},
    ['Apr']: {sent: 528, open: 334, click: 158, reply: 123, bounce: 85},
    ['May']: {sent: 620, open: 268, click: 124, reply: 97, bounce: 67},
    ['Jun']: {sent: 586, open: 265, click: 113, reply: 84, bounce: 45},
    ['Jul']: {sent: 436, open: 125, click: 95, reply: 69, bounce: 37},
    ['Aug']: {sent: 265, open: 167, click: 87, reply: 57, bounce: 27},
    ['Sep']: {sent: 364, open: 133, click: 110, reply: 67, bounce: 23},
    ['Oct']: {sent: 458, open: 165, click: 105, reply: 42, bounce: 18},
    ['Nov']: {sent: 389, open: 98, click: 56, reply: 36, bounce: 17},
    ['Dec']: {sent: 154, open: 58, click: 30, reply: 56, bounce: 11},
  });
}

const days = document.getElementById('days');
days.onclick = function () {
  initChart({
    ['19-07-1990']: {sent: 364, open: 133, click: 110, reply: 67, bounce: 23},
    ['20-07-1990']: {sent: 458, open: 165, click: 105, reply: 42, bounce: 18},
    ['21-07-1990']: {sent: 389, open: 98, click: 56, reply: 36, bounce: 17},
  });
}
