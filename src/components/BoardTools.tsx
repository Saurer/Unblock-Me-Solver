import { css } from '@emotion/core';
import ToolButton, { Tool } from './ToolButton';

interface Props {
    activeTool: Tool;
    onChange?: (tool: Tool) => void;
}

const style = css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    list-style-type: none;
    padding: 0;
    margin: 0;

    li {
        flex: 1;
    }
`;

const BoardTools: React.FC<Props> = props => (
    <ul css={style}>
        <li>
            <ToolButton
                type={Tool.Block}
                disabled={props.activeTool === Tool.Block}
                onClick={() => props.onChange?.(Tool.Block)}
            >
                Block
            </ToolButton>
        </li>
        <li>
            <ToolButton
                type={Tool.Main}
                disabled={props.activeTool === Tool.Main}
                onClick={() => props.onChange?.(Tool.Main)}
            >
                Main
            </ToolButton>
        </li>
        <li>
            <ToolButton
                type={Tool.Clear}
                disabled={props.activeTool === Tool.Clear}
                onClick={() => props.onChange?.(Tool.Clear)}
            >
                Clear
            </ToolButton>
        </li>
    </ul>
);

export default BoardTools;
