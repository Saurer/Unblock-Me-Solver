import { useRef, useEffect, useState } from 'react';
import BoardRenderer from 'lib/BoardRenderer';
import React from 'react';
import { Block, BlockType } from 'lib/Board';
import SolutionView from './SolutionView';
import BoardTools from './BoardTools';
import { Tool } from './ToolButton';
import useSolverWorker from 'hooks/useSolverWorker';
import Progress from './Progress';

const TILE_SIZE = 50;

interface Props {
    tiles: number;
    value: Block[];
    onBlockAdd: (block: Block) => void;
    onBlocksUpdate: (blocks: Block[]) => void;
}

const Board: React.FC<Props> = props => {
    const [controller, setController] = useState<BoardRenderer>();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const size = props.tiles * TILE_SIZE;

    useEffect(() => {
        if (canvasRef.current) {
            const ctrl = new BoardRenderer(
                canvasRef.current,
                TILE_SIZE,
                props.tiles
            );
            setController(ctrl);
            ctrl.redraw(props.value);
        } else {
            setController(undefined);
        }
    }, [canvasRef.current]);

    const handleMouseDown: React.MouseEventHandler<HTMLCanvasElement> = e => {
        const box = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - box.x;
        const y = e.clientY - box.y;

        if (x < 0 || y < 0 || x > size || y > size) {
            return;
        }

        if (!controller?.drawBegin(x, y)) {
            const [tileX, tileY] = controller!.getTileOffset(x, y);
            props.onBlocksUpdate(controller!.removeAt(tileX, tileY));
        }
    };
    const handleMouseMove: React.MouseEventHandler<HTMLCanvasElement> = e => {
        const box = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - box.x;
        const y = e.clientY - box.y;

        if (x < 0 || y < 0 || x > size || y > size) {
            return;
        }

        controller?.drawMove(x, y);
    };
    const handleMouseUp: React.MouseEventHandler<HTMLCanvasElement> = () => {
        const block = controller?.drawEnd();

        if (block) {
            switch (tool) {
                case Tool.Block:
                    props.onBlockAdd({ ...block, type: BlockType.Block });
                    return;

                case Tool.Main:
                    props.onBlockAdd({ ...block, type: BlockType.Main });
                    return;

                default:
                    return;
            }
        }
    };

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }

        controller?.redraw(props.value);
    }, [props.value]);

    const [tool, setTool] = useState<Tool>(Tool.Block);
    const handleToolChange = (tool: Tool) => {
        switch (tool) {
            case Tool.Clear:
                props.onBlocksUpdate([]);
                return;

            default:
                setTool(tool);
                return;
        }
    };

    const [activeSolution, setActiveSolution] = useState(-1);
    const solverWorker = useSolverWorker();
    const handleCalculate = () => {
        setActiveSolution(-1);

        solverWorker.process(props.value, props.tiles);
    };
    const handleSolutionClick = (index: number) => {
        if (-1 === index) {
            props.onBlocksUpdate(solverWorker.value!.basePattern);
        } else {
            props.onBlocksUpdate(solverWorker.value!.moves[index].pattern);
        }
        setActiveSolution(index);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div
                style={{ width: size, height: size, border: 'solid 5px #666' }}
            >
                <canvas
                    ref={canvasRef}
                    width={size}
                    height={size}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                />
                <div>
                    <div>Tools</div>
                    <BoardTools activeTool={tool} onChange={handleToolChange} />
                </div>
                <div>
                    <button
                        style={{
                            padding: 15,
                            display: 'block',
                            boxSizing: 'border-box',
                            width: '100%'
                        }}
                        disabled={solverWorker.pending}
                        onClick={handleCalculate}
                    >
                        Calculate
                    </button>
                </div>
                <div style={{ marginTop: 15 }}>
                    <Progress value={solverWorker.progress} />
                </div>
            </div>

            {solverWorker.value && (
                <div style={{ marginLeft: 15 }}>
                    <SolutionView
                        value={solverWorker.value}
                        activeIndex={activeSolution}
                        onSolutionClick={handleSolutionClick}
                    />
                </div>
            )}
        </div>
    );
};

export default Board;
