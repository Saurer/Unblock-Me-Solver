import * as theme from '../lib/theme';
import { CSSProperties } from 'react';
import { css } from '@emotion/core';

export enum Tool {
    Block,
    Main,
    Clear
}

interface Props {
    type?: Tool;
    disabled?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const style = css`
    padding: 10px;
    box-sizing: border-box;
    display: block;
    width: 100%;

    .badge {
        border: solid 1px #ccc;
        background: #ccc;
        width: 20px;
        height: 20px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
    }
`;

function resolveStyle(type?: Tool): CSSProperties {
    switch (type) {
        case Tool.Block:
            return {
                border: `solid 2px ${theme.block.stroke}`,
                background: theme.block.fill
            };

        case Tool.Main:
            return {
                border: `solid 2px ${theme.main.stroke}`,
                background: theme.main.fill
            };

        default:
            return {
                border: 'solid 2px #ccc',
                background: '#ccc'
            };
    }
}

const ToolButton: React.FC<Props> = props => (
    <button css={style} onClick={props.onClick} disabled={props.disabled}>
        <em
            className="badge"
            style={{
                ...resolveStyle(props.type)
            }}
        />
        <span>{props.children}</span>
    </button>
);

export default ToolButton;
