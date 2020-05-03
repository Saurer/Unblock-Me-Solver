import * as theme from './theme';
import { Orientation, Block, BlockType } from './Board';

interface NewBlock {
    mouseX: number;
    mouseY: number;
    startX: number;
    endX: number;
    startY: number;
    endY: number;
}

class BoardRenderer {
    private readonly _context: CanvasRenderingContext2D;
    private readonly _tileSize: number;
    private readonly _boardSize: number;
    private _newBlock: NewBlock | undefined;
    private _blocks: Block[] = [];

    constructor(
        canvas: HTMLCanvasElement,
        tileSize: number,
        boardSize: number
    ) {
        this._context = canvas.getContext('2d')!;
        this._tileSize = tileSize;
        this._boardSize = boardSize;
    }

    drawBlock = (block: Block) => {
        const width =
            block.orientation === Orientation.Horizontal ? block.size : 1;
        const height =
            block.orientation === Orientation.Vertical ? block.size : 1;

        let fontStyle: string = '';
        switch (block.type) {
            case BlockType.Block:
                this._context.strokeStyle = theme.block.stroke;
                this._context.fillStyle = theme.block.fill;
                fontStyle = theme.block.font;
                break;

            case BlockType.Main:
                this._context.strokeStyle = theme.main.stroke;
                this._context.fillStyle = theme.main.fill;
                fontStyle = theme.main.font;
                break;

            default:
                break;
        }

        const outX = block.x * this._tileSize;
        const outY = block.y * this._tileSize;
        const outW = width * this._tileSize;
        const outH = height * this._tileSize;
        const label = block.id.toString();
        const labelMetrics = this._context.measureText(label);
        const fontSize = 30;
        this._context.fillRect(outX, outY, outW, outH);
        this._context.strokeRect(outX, outY, outW, outH);
        this._context.font = `${fontSize}px Arial`;
        this._context.fillStyle = fontStyle;
        this._context.fillText(
            label,
            outX + outW / 2 - labelMetrics.width / 2,
            outY + outH / 2 + fontSize / 2 - 5
        );
    };

    getTileOffset = (x: number, y: number) => {
        const tileX = Math.floor(x / this._tileSize);
        const tileY = Math.floor(y / this._tileSize);
        return [tileX, tileY];
    };

    drawBegin = (x: number, y: number): boolean => {
        if (!this.checkBounds(x, y)) {
            return true;
        }

        const [tileX, tileY] = this.getTileOffset(x, y);
        if (this.checkCollision(tileX, tileY)) {
            return false;
        }

        this._newBlock = {
            mouseX: tileX,
            mouseY: tileY,
            startX: tileX,
            startY: tileY,
            endX: tileX + 1,
            endY: tileY + 1
        };
        this.redraw(this._blocks);
        return true;
    };

    drawMove = (x: number, y: number) => {
        if (!this.checkBounds(x, y) || !this._newBlock) {
            return;
        }

        const newBlock = this._newBlock;
        const reverseX = x / this._tileSize < newBlock.mouseX;
        const reverseY = y / this._tileSize < newBlock.mouseY;

        if (
            Math.abs(newBlock.startX * this._tileSize - x) >
            Math.abs(newBlock.startY * this._tileSize - y)
        ) {
            // Horizontal
            const tileX = Math.ceil(x / this._tileSize);
            const tileY = newBlock.startY + 1;
            this._newBlock = {
                ...newBlock,
                startX: reverseX ? newBlock.mouseX + 1 : newBlock.mouseX,
                startY: newBlock.mouseY,
                endX: reverseX ? tileX - 1 : tileX,
                endY: tileY
            };
        } else {
            // Vertical
            const tileX = newBlock.startX + 1;
            const tileY = Math.ceil(y / this._tileSize);
            this._newBlock = {
                ...newBlock,
                startX: newBlock.mouseX,
                startY: reverseY ? newBlock.mouseY + 1 : newBlock.mouseY,
                endX: tileX,
                endY: reverseY ? tileY - 1 : tileY
            };
        }
        this.redraw(this._blocks.slice());
    };

    drawEnd = (): Block | undefined => {
        if (!this._newBlock) {
            return;
        }

        const newBlock = this._newBlock;

        const startX =
            newBlock.startX > newBlock.endX ? newBlock.endX : newBlock.startX;
        const endX =
            newBlock.startX < newBlock.endX ? newBlock.endX : newBlock.startX;
        const startY =
            newBlock.startY > newBlock.endY ? newBlock.endY : newBlock.startY;
        const endY =
            newBlock.startY < newBlock.endY ? newBlock.endY : newBlock.startY;

        const direction =
            Math.abs(endX) - Math.abs(startX) > 1
                ? Orientation.Horizontal
                : Orientation.Vertical;

        const size =
            direction === Orientation.Horizontal
                ? endX - startX
                : endY - startY;

        this._newBlock = undefined;
        this.redraw(this._blocks);

        const maxID = this._blocks.length
            ? this._blocks.sort((a, b) => b.id - a.id)[0].id + 1
            : 0;

        return {
            id: maxID,
            x: startX,
            y: startY,
            size,
            orientation: direction,
            type: BlockType.Block
        };
    };

    redraw = (value: Block[]) => {
        const context = this._context;

        const size = this._boardSize * this._tileSize;
        context.fillStyle = '#ccc';
        context.fillRect(0, 0, size, size);

        context.lineWidth = 1;
        context.strokeStyle = '#999';
        for (let x = 0; x < this._boardSize; x++) {
            context.beginPath();
            context.moveTo(x * this._tileSize, 0);
            context.lineTo(x * this._tileSize, size);
            context.stroke();
        }
        for (let y = 0; y < this._boardSize; y++) {
            context.beginPath();
            context.moveTo(0, y * this._tileSize);
            context.lineTo(size, y * this._tileSize);
            context.stroke();
        }

        value.forEach(block => this.drawBlock(block));
        if (this._newBlock) {
            const newBlock = this._newBlock;
            context.strokeStyle = '#ff0000';
            context.fillStyle = '#55aa00';

            const outX = newBlock.startX * this._tileSize;
            const outY = newBlock.startY * this._tileSize;
            const outW = (newBlock.endX - newBlock.startX) * this._tileSize;
            const outH = (newBlock.endY - newBlock.startY) * this._tileSize;
            context.fillRect(outX, outY, outW, outH);
            context.strokeRect(outX, outY, outW, outH);
        }
        this._blocks = value;
    };

    checkCollision = (x: number, y: number) => {
        for (const block of this._blocks) {
            if (this.checkBlockCollision(block, x, y)) {
                return true;
            }
        }
        return false;
    };

    removeAt = (x: number, y: number) => {
        return this._blocks.filter(
            block => !this.checkBlockCollision(block, x, y)
        );
    };

    private checkBlockCollision = (block: Block, x: number, y: number) => {
        if (Orientation.Horizontal === block.orientation) {
            if (y === block.y && x >= block.x && x < block.x + block.size) {
                return true;
            }
        } else {
            if (x === block.x && y >= block.y && y < block.y + block.size) {
                return true;
            }
        }
        return false;
    };

    private checkBounds = (x: number, y: number) => {
        if (
            x < 0 ||
            y < 0 ||
            x > this._boardSize * this._tileSize ||
            y > this._boardSize * this._tileSize
        ) {
            return false;
        } else {
            return true;
        }
    };
}

export default BoardRenderer;
