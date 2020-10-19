import '../css/style.scss';


const SQUARE = [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]];
const TRIANGLE = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 1, 0], [0, 1, 1, 1]];
const LFIGURE = [[0, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0], [1, 1, 0, 0]];

const ELEMENTS = {
    square: SQUARE,
    triangle: TRIANGLE,
    lFigure: LFIGURE,
};

const DEFAULT_GAME_SPEED = 1000;
const AREA_HEIGHT = 50;
const AREA_WIDTH = 30;
const BLOCK_SIZE = 10;

const BASE_COLOR = '#ffff00';

function onkeydownEvent(event) {
    console.log('user pressed', event);

    switch (event.code) {
        case 'ArrowRight':
            onRightPressed();
            break;
        case 'ArrowLeft':
            onLeftPressed();
            break;
        case 'ArrowDown':
            onDownPressed();
            break;
        case 'ArrowUp':
            onUpPressed();
            break;
        case 'Enter':
            onEnterPress();
            break;
        default:
            console.log('another key pressed');
            break;

    }
}

function onLeftPressed() {
   if (window.figure && window.figure.isCanMoveLeft()) {
       window.figure.moveLeft();
   }
}

function onRightPressed() {
    if (window.figure && window.figure.isCanMoveRight()) {
        window.figure.moveRight();
    }
}

function onDownPressed() {
    if (window.figure && window.figure.isCanMoveDown()) {
        window.figure.moveDown();
    }
}

function onUpPressed() {
    if (window.figure && window.figure.isCanRotate()) {
        window.figure.rotate();
    }
}

function onEnterPress() {
    drawFigure();
}

class Position {
    x;
    y;

    constructor(props) {
        this.x = Math.floor(AREA_WIDTH / 2);
        this.y = AREA_HEIGHT;

    }

}

class Figure {
    position;
    template;
    color;
    html;

    constructor(template, color = BASE_COLOR) {
        console.log('new element', template);
        this.position = new Position();
        this.template = template;
        this.color = color;
    }

    setPosition() {
        this.html.style.left = `${figure.position.x * BLOCK_SIZE}px`;
        this.html.style.top = `${(AREA_HEIGHT- figure.position.y) * BLOCK_SIZE}px`;
    }

    getHtml() {
        const element = document.createElement('div');
        element.classList.add('element');

        this.template.forEach((row) => {
            const rowElement = document.createElement('div');
            rowElement.classList.add('row');
            element.appendChild(rowElement);
            row.forEach((cell) => {
                const block = document.createElement('div');
                block.classList.add('block');
                block.style.background = cell === 1 ? this.color : 'transparent';
                rowElement.appendChild(block);
            });
        });
        this.html = element;

        return element;
    }

    moveDown() {
        this.position.y -= 1;
        this.setPosition();
    }

    isCanMoveDown() {
        return this.position.y > 0;
    }

    isCanMoveRight() {
        return this.position.x < AREA_WIDTH;
    }

    moveRight() {
        this.position.x += 1;
        this.setPosition();
    }

    isCanMoveLeft() {
        return this.position.x > 0;
    }

    moveLeft() {
        this.position.x -= 1;
        this.setPosition();
    }

    isCanRotate() {
        return true;
    }

    updateHtml() {
        this.template.forEach((row, i) => {
            row.forEach((block, j) => {
                this.html.childNodes[i].childNodes[j].style.background =
                    block === 1 ? this.color : 'transparent';
            });
        });
    }

    rotate() {
        const newTemplate = [];
        for (let y = 0; y < this.template.length; y += 1) {
            newTemplate.push(new Array(this.template[y].length));
        }

        for (let y = 0; y < this.template.length; y += 1) {
            for (let x = 0; x < this.template[y].length; x += 1) {
                newTemplate[y][x] = this.template[this.template.length - 1 - x][y];
            }
        }
        this.template = newTemplate;
        this.updateHtml();
    }
}

function getRandomTemplate() {
    return Object.values(ELEMENTS)[Math.floor(Math.random() * Object.values(ELEMENTS).length)];
}

function drawFigure() {
    if (!window.figure) {
        window.figure = new Figure(getRandomTemplate(), '#ff0000');
        window.plot.appendChild(figure.getHtml());
        window.figure.setPosition();
    }
}

function gameTick() {
    if (window.figure && figure.isCanMoveDown()) {
        figure.moveDown();
    }
}

(function main() {
    document.addEventListener('DOMContentLoaded', () => {
        window.plot = document.querySelector('#plot');
        console.log('works');
        window.gameInterval = setInterval(gameTick, DEFAULT_GAME_SPEED);

        document.addEventListener('keydown', onkeydownEvent);
    });
})();
