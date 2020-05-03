import { css } from '@emotion/core';

const style = css`
    border: solid 1px #348b03;
    background: #f0f0f0;
    height: 25px;
    position: relative;

    .filler {
        background: #4fb316;
        height: 100%;
    }

    .label {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        font-weight: bold;
        color: #000;
        text-align: center;
        line-height: 25px;
    }
`;

interface Props {
    value: number;
}

const Progress: React.FC<Props> = props => (
    <div css={style}>
        <div className="filler" style={{ width: `${props.value}%` }} />
        <div className="label">{Math.round(props.value)}%</div>
    </div>
);

export default Progress;
