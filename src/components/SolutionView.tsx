import { css } from '@emotion/core';
import { Solution } from '../lib/solver';

interface Props {
    activeIndex: number;
    value: Solution;
    onSolutionClick?: (index: number) => void;
}

const style = css`
    .count {
        float: left;
        font-size: 20px;
        color: #fff;
        background: #ff0000;
        width: 32px;
        height: 32px;
        border-radius: 100%;
        text-align: center;
        margin-top: -5px;
        margin-right: 10px;
        line-height: 31px;
    }

    .entry {
        vertical-align: top;
        padding-bottom: 10px;
    }

    .entry_title {
        font-weight: bold;
        min-width: 100px;
    }

    .stepButton {
        background: 0;
        border: 0;
        text-decoration: underline;
        color: #0000ff;
        cursor: pointer;
        padding: 5px;

        &:disabled {
            color: #ff0000;
            font-weight: bold;
        }
    }
`;

const SolutionView: React.FC<Props> = props => (
    <div css={style}>
        <h3>
            <span>Solution</span>
            <span className="count">{props.value.moves.length}</span>
        </h3>
        <table>
            <tbody>
                <tr>
                    <td className="entry entry_title">Time</td>
                    <td className="entry">{props.value.timeSeconds} sec.</td>
                </tr>
                <tr>
                    <td className="entry entry_title">Iterations</td>
                    <td className="entry">{props.value.iterations}</td>
                </tr>
                <tr>
                    <td className="entry entry_title">Moves</td>
                    <td className="entry">
                        <button
                            className="stepButton"
                            disabled={props.activeIndex === -1}
                            onClick={() => props.onSolutionClick?.(-1)}
                        >
                            Initial state
                        </button>
                        {props.value.moves.map((v, index) => (
                            <div key={index}>
                                <button
                                    className="stepButton"
                                    disabled={props.activeIndex === index}
                                    onClick={() =>
                                        props.onSolutionClick?.(index)
                                    }
                                >
                                    [{v.move.id}] -&gt;
                                    {v.move.direction} ({v.move.count})
                                </button>
                            </div>
                        ))}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
);

export default SolutionView;
