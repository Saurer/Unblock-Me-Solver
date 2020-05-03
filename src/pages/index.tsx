import Board from 'components/Board';
import { useState } from 'react';
import { Orientation, Block, BlockType } from 'lib/Board';

const Index: React.FC = () => {
    const [value, setValue] = useState<Block[]>([
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
            id: 5,
            x: 4,
            y: 1,
            orientation: Orientation.Horizontal,
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
            id: 9,
            x: 1,
            y: 5,
            orientation: Orientation.Vertical,
            size: 1,
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
        }
    ]);

    function handleBlockAdd(block: Block) {
        switch (block.type) {
            case 'main':
                setValue([...value.filter(l => l.type !== block.type), block]);
                break;

            default:
                setValue([...value, block]);
                break;
        }
    }

    function handleBlocksUpdate(blocks: Block[]) {
        setValue(blocks);
    }

    return (
        <Board
            tiles={6}
            value={value}
            onBlockAdd={handleBlockAdd}
            onBlocksUpdate={handleBlocksUpdate}
        />
    );
};

export default Index;
