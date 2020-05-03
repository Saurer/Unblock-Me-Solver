import Board, { Block, Move, BlockType, Direction } from './Board';

interface Step {
    board: Board;
    parent?: Step;
    move?: Move;
}

export interface Solution {
    basePattern: Block[];
    moves: {
        pattern: Block[];
        move: Move;
    }[];
    timeSeconds: number;
    iterations: number;
}

function generateSolvingMove(step: Step): Step {
    const pattern = step.board.pattern;
    const main = pattern.find(l => l.type === BlockType.Main)!;
    const count = step.board.size - Board.getBoundingBox(main).right;
    const move: Move = {
        id: main.id,
        direction: Direction.East,
        count
    };

    return {
        board: step.board.moveBlock(move.id, move.direction, move.count),
        parent: step,
        move
    };
}

interface Solver {
    (pattern: Block[], size: number): Generator<Progress, Progress, Progress>;
}

interface Progress {
    done: boolean;
    value: number;
    solution?: Solution;
}

const solver: Solver = function* solver(pattern, size, stepSize = 5000) {
    const [main] = pattern.filter(l => l.type === 'main');

    if (!main) {
        return {
            done: true,
            value: 100
        };
    }

    const queue: Array<Step> = [
        {
            board: Board.fromPattern(pattern, size)
        }
    ];
    const discovered: { [hash: string]: boolean } = {};

    const timeStart = Date.now();
    let iterations = 0;
    let percent = 0;

    yield {
        done: false,
        value: 0
    };

    while (queue.length > 0) {
        const value = queue.shift()!;
        iterations++;

        if (iterations % stepSize === 0) {
            if (percent < 50) {
                percent += iterations / queue.length;
            } else if (percent < 65) {
                percent += 5;
            } else if (percent < 85) {
                percent += 1;
            } else if (percent < 95) {
                percent += 0.3;
            }

            yield {
                done: false,
                value: percent
            };
        }

        if (discovered[value.board.hash]) {
            continue;
        } else {
            discovered[value.board.hash] = true;
        }

        if (value.board.isSolved()) {
            const result: Solution = {
                basePattern: pattern,
                moves: [],
                timeSeconds: (Date.now() - timeStart) / 1000,
                iterations
            };

            let parent = value;
            while (parent) {
                if (parent.move) {
                    result.moves.unshift({
                        pattern: parent.board.pattern,
                        move: parent.move
                    });
                }
                parent = parent.parent!;
            }
            const solving = generateSolvingMove(value);
            result.moves.push({
                pattern: solving.board.pattern,
                move: solving.move!
            });

            return yield {
                done: true,
                value: 100,
                solution: result
            };
        }

        const v = value.board.enumerateMoves();
        for (let itr = v.next(); !itr.done; itr = v.next()) {
            const board = value.board.moveBlock(
                itr.value.id,
                itr.value.direction,
                itr.value.count
            );

            if (!discovered[board.hash]) {
                queue.push({
                    board,
                    parent: value,
                    move: itr.value
                });
            }
        }
    }

    return yield {
        done: true,
        value: 100
    };
};

export default solver;
