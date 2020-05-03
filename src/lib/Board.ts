export enum Orientation {
    Horizontal,
    Vertical
}

export enum BlockType {
    Main = 'main',
    Block = 'block'
}

export enum Direction {
    North = 'north',
    East = 'east',
    South = 'south',
    West = 'west'
}

export interface Block {
    id: number;
    x: number;
    y: number;
    orientation: Orientation;
    size: number;
    type: BlockType;
}

export interface Move {
    direction: Direction;
    id: number;
    count: number;
}

class Board {
    private _map: { [coords: string]: boolean };
    private _blocks: {
        [id: number]: number;
    };
    private _mainIndex = -1;

    public readonly hash: string;
    public readonly size: number;
    public pattern: Block[];

    static fromPattern(pattern: Block[], size: number) {
        const map: { [coords: string]: boolean } = {};
        const blocks: {
            [id: number]: number;
        } = {};
        let main: number = -1;

        for (let i = 0; i < pattern.length; i++) {
            const block = pattern[i];
            const bbox = Board.getBoundingBox(block);
            blocks[block.id] = i;

            if ('main' === block.type) {
                main = i;
            }

            for (let x = bbox.left; x < bbox.right; x++) {
                for (let y = bbox.top; y < bbox.bottom; y++) {
                    map[Board._getCoord(x, y)] = true;
                }
            }
        }

        return new Board(pattern, size, map, blocks, main);
    }

    private constructor(
        pattern: Block[],
        size: number,
        map: { [coords: string]: boolean },
        blocks: { [id: number]: number },
        mainIndex: number
    ) {
        this.pattern = pattern;
        this.size = size;
        this._map = map;
        this._blocks = blocks;
        this._mainIndex = mainIndex;
        this.hash = this._getHash();
    }

    *enumerateMoves() {
        for (const block of this.pattern) {
            yield* this.enumerateBlockMoves(block.id);
        }
    }

    *enumerateBlockMoves(id: number): Generator<Move, void, Move> {
        const blockIndex = this._blocks[id];
        const block = this.pattern[blockIndex];

        // Blocks with size eq 1 are considered unmovable since they
        // are not oriented horizontally nor vertically
        if (block.size === 1) {
            return;
        }

        const bbox = Board.getBoundingBox(block);

        if (block.orientation === Orientation.Vertical) {
            for (
                let y = bbox.top - 1;
                y >= 0 && !this._map[Board._getCoord(bbox.left, y)];
                y--
            ) {
                yield {
                    id: block.id,
                    direction: Direction.North,
                    count: bbox.top - y
                };
            }
            for (
                let y = bbox.bottom;
                y < this.size && !this._map[Board._getCoord(bbox.left, y)];
                y++
            ) {
                yield {
                    id: block.id,
                    direction: Direction.South,
                    count: y - bbox.bottom + 1
                };
            }
        }
        if (block.orientation === Orientation.Horizontal) {
            for (
                let x = bbox.left - 1;
                x >= 0 && !this._map[Board._getCoord(x, bbox.top)];
                x--
            ) {
                yield {
                    id: block.id,
                    direction: Direction.West,
                    count: bbox.left - x
                };
            }
            for (
                let x = bbox.right;
                x < this.size && !this._map[Board._getCoord(x, bbox.top)];
                x++
            ) {
                yield {
                    id: block.id,
                    direction: Direction.East,
                    count: x - bbox.right + 1
                };
            }
        }
    }

    moveBlock = (id: number, direction: Direction, count: number) => {
        const blockIndex = this._blocks[id];
        const block = this.pattern[blockIndex];
        const newPattern = [...this.pattern];
        const newMap: { [coords: string]: boolean } = { ...this._map };
        const newBlock = (newPattern[blockIndex] = { ...block });

        switch (direction) {
            case Direction.North:
                newBlock.y -= count;
                break;
            case Direction.East:
                newBlock.x += count;
                break;
            case Direction.South:
                newBlock.y += count;
                break;

            case Direction.West:
                newBlock.x -= count;
                break;

            default:
                break;
        }

        // Erase previous collision data of the moving block
        const startBox = Board.getBoundingBox(block);
        for (let x = startBox.left; x < startBox.right; x++) {
            for (let y = startBox.top; y < startBox.bottom; y++) {
                newMap[Board._getCoord(x, y)] = false;
            }
        }

        // And fill with new data acquired by performing a move
        const endBox = Board.getBoundingBox(newBlock);
        for (let x = endBox.left; x < endBox.right; x++) {
            for (let y = endBox.top; y < endBox.bottom; y++) {
                newMap[Board._getCoord(x, y)] = true;
            }
        }

        return new Board(
            newPattern,
            this.size,
            newMap,
            this._blocks,
            this._mainIndex
        );
    };

    // If there are no blocks following the main block's right
    // then the maze is considered solved
    isSolved = () => {
        const main = this.pattern[this._mainIndex];
        for (let x = main.x + main.size; x < this.size; x++) {
            if (this._map[Board._getCoord(x, main.y)]) {
                return false;
            }
        }

        return true;
    };

    private _getHash = () => {
        const parts: string[] = [];
        for (const block of this.pattern) {
            parts.push(block.x + ':' + block.y);
        }
        return parts.join('');
    };

    private static _getCoord = (x: number, y: number) => `${x}:${y}`;

    static getBoundingBox = (block: Block) => {
        const startX = block.x;
        const startY = block.y;
        let endX = block.x;
        let endY = block.y;

        if (block.orientation === Orientation.Horizontal) {
            endX += block.size;
            endY += 1;
        }
        if (block.orientation === Orientation.Vertical) {
            endX += 1;
            endY += block.size;
        }

        return {
            left: startX,
            right: endX,
            top: startY,
            bottom: endY
        };
    };
}

export default Board;
