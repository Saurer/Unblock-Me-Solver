import Board, { Block, Orientation, Direction, BlockType } from './Board';

const mockSize = 6;
const mockPattern: Block[] = [
    {
        id: 0,
        x: 0,
        y: 2,
        orientation: Orientation.Horizontal,
        size: 2,
        type: BlockType.Main
    },
    {
        id: 1,
        x: 0,
        y: 0,
        orientation: Orientation.Vertical,
        size: 2,
        type: BlockType.Block
    },
    {
        id: 2,
        x: 1,
        y: 0,
        orientation: Orientation.Horizontal,
        size: 3,
        type: BlockType.Block
    },
    {
        id: 3,
        x: 2,
        y: 1,
        orientation: Orientation.Vertical,
        size: 2,
        type: BlockType.Block
    },
    {
        id: 4,
        x: 3,
        y: 1,
        orientation: Orientation.Vertical,
        size: 2,
        type: BlockType.Block
    },
    {
        id: 6,
        x: 4,
        y: 2,
        orientation: Orientation.Vertical,
        size: 2,
        type: BlockType.Block
    },
    {
        id: 7,
        x: 2,
        y: 3,
        orientation: Orientation.Horizontal,
        size: 2,
        type: BlockType.Block
    },
    {
        id: 8,
        x: 1,
        y: 3,
        orientation: Orientation.Vertical,
        size: 2,
        type: BlockType.Block
    },
    {
        id: 10,
        x: 3,
        y: 4,
        orientation: Orientation.Horizontal,
        size: 2,
        type: BlockType.Block
    },
    {
        id: 11,
        x: 3,
        y: 5,
        orientation: Orientation.Horizontal,
        size: 2,
        type: BlockType.Block
    },
    {
        id: 12,
        x: 0,
        y: 5,
        orientation: Orientation.Horizontal,
        size: 1,
        type: BlockType.Block
    }
];

function enumerate(board: Board, id: number) {
    const v = board.enumerateBlockMoves(id);
    const result: Array<{ direction: Direction; count: number }> = [];
    for (let itr = v.next(); !itr.done; itr = v.next()) {
        result.push(itr.value);
    }
    return result;
}

export default describe('Board', () => {
    it('Should construct without errors', () => {
        const board = Board.fromPattern(mockPattern, mockSize);
        expect(board).toBeInstanceOf(Board);
    });

    it('Should get correct bounding boxes', () => {
        expect(
            Board.getBoundingBox({
                id: 0,
                x: 3,
                y: 5,
                orientation: Orientation.Horizontal,
                size: 2,
                type: BlockType.Block
            })
        ).toMatchObject({
            left: 3,
            top: 5,
            right: 5,
            bottom: 6
        });

        expect(
            Board.getBoundingBox({
                id: 0,
                x: 3,
                y: 5,
                orientation: Orientation.Vertical,
                size: 2,
                type: BlockType.Block
            })
        ).toMatchObject({
            left: 3,
            top: 5,
            right: 4,
            bottom: 7
        });
    });

    it('Should correctly enumerate moves', () => {
        const board = Board.fromPattern(mockPattern, mockSize);

        expect(enumerate(board, 0)).toMatchObject([]);
        expect(enumerate(board, 1)).toMatchObject([]);
        expect(enumerate(board, 2)).toMatchObject([
            { direction: Direction.East, count: 1 },
            { direction: Direction.East, count: 2 }
        ]);
        expect(enumerate(board, 6)).toMatchObject([
            { direction: Direction.North, count: 1 },
            { direction: Direction.North, count: 2 }
        ]);
        expect(enumerate(board, 8)).toMatchObject([
            { direction: Direction.South, count: 1 }
        ]);
        expect(enumerate(board, 10)).toMatchObject([
            { direction: Direction.West, count: 1 },
            { direction: Direction.East, count: 1 }
        ]);
        expect(enumerate(board, 11)).toMatchObject([
            { direction: Direction.West, count: 1 },
            { direction: Direction.West, count: 2 },
            { direction: Direction.East, count: 1 }
        ]);
    });

    it('Should correctly enumerate all moves', () => {
        const board = Board.fromPattern(mockPattern, mockSize);

        const v = board.enumerateMoves();
        const result: Array<{
            direction: Direction;
            count: number;
            id: number;
        }> = [];
        for (let itr = v.next(); !itr.done; itr = v.next()) {
            result.push(itr.value);
        }

        expect(result).toMatchObject([
            { id: 2, direction: Direction.East, count: 1 },
            { id: 2, direction: Direction.East, count: 2 },
            { id: 6, direction: Direction.North, count: 1 },
            { id: 6, direction: Direction.North, count: 2 },
            { id: 8, direction: Direction.South, count: 1 },
            { id: 10, direction: Direction.West, count: 1 },
            { id: 10, direction: Direction.East, count: 1 },
            { id: 11, direction: Direction.West, count: 1 },
            { id: 11, direction: Direction.West, count: 2 },
            { id: 11, direction: Direction.East, count: 1 }
        ]);
    });

    it('Should move blocks and recalculate moves', () => {
        let board = Board.fromPattern(mockPattern, mockSize);

        expect(enumerate(board, 2)).toMatchObject([
            { direction: Direction.East, count: 1 },
            { direction: Direction.East, count: 2 }
        ]);
        expect(enumerate(board, 7)).toMatchObject([]);
        board = board.moveBlock(6, Direction.North, 2);
        expect(enumerate(board, 2)).toMatchObject([]);
        expect(enumerate(board, 7)).toMatchObject([
            { direction: Direction.East, count: 1 },
            { direction: Direction.East, count: 2 }
        ]);

        board = Board.fromPattern(mockPattern, mockSize);
        expect(enumerate(board, 3)).toMatchObject([]);
        board = board.moveBlock(2, Direction.East, 2);
        expect(enumerate(board, 3)).toMatchObject([
            { direction: Direction.North, count: 1 }
        ]);

        board = Board.fromPattern(mockPattern, mockSize);
        expect(enumerate(board, 7)).toMatchObject([]);
        board = board.moveBlock(8, Direction.South, 1);
        expect(enumerate(board, 7)).toMatchObject([
            { direction: Direction.West, count: 1 },
            { direction: Direction.West, count: 2 }
        ]);

        board = Board.fromPattern(mockPattern, mockSize);
        expect(enumerate(board, 8)).toMatchObject([
            { direction: Direction.South, count: 1 }
        ]);
        board = board.moveBlock(11, Direction.West, 1);
        expect(enumerate(board, 8)).toMatchObject([
            { direction: Direction.South, count: 1 }
        ]);
        board = board.moveBlock(11, Direction.West, 1);
        expect(enumerate(board, 8)).toMatchObject([]);
    });

    it('Should calculate if solved', () => {
        let board = Board.fromPattern(mockPattern, mockSize);
        expect(board.isSolved()).toBe(false);
        board = board.moveBlock(6, Direction.North, 2);
        expect(board.isSolved()).toBe(false);
        board = board.moveBlock(7, Direction.East, 2);
        expect(board.isSolved()).toBe(false);
        board = board.moveBlock(3, Direction.South, 2);
        expect(board.isSolved()).toBe(false);
        board = board.moveBlock(10, Direction.East, 1);
        expect(board.isSolved()).toBe(false);
        board = board.moveBlock(4, Direction.South, 2);
        expect(board.isSolved()).toBe(true);
    });

    it('Should not mutate previous board data', () => {
        const board = Board.fromPattern(mockPattern, mockSize);
        const initialPattern: Block[] = JSON.parse(
            JSON.stringify(board.pattern)
        );

        const v = board.enumerateMoves();
        for (let itr = v.next(); !itr.done; itr = v.next()) {
            board.moveBlock(itr.value.id, itr.value.direction, itr.value.count);
            expect(board.pattern).toMatchObject(initialPattern);
        }
    });
});
