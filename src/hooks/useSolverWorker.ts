import * as Solver from '../solver.worker';
import { useState, useEffect } from 'react';
import { Block } from 'lib/Board';
import { Solution } from 'lib/solver';

function useSolverWorker() {
    const [worker, setWorker] = useState<Worker>();
    const [value, setValue] = useState<{
        pending: boolean;
        progress: number;
        solution?: Solution;
    }>({
        pending: true,
        progress: 0
    });

    useEffect(() => {
        const value: Worker = new (Solver as any)();
        setWorker(value);
        setValue({
            pending: false,
            progress: 0
        });

        value.addEventListener('message', e => {
            switch (e.data.type) {
                case 'progress':
                    setValue({
                        pending: !e.data.data.done,
                        progress: e.data.data.value,
                        solution: e.data.data.solution
                    });

                    break;

                default:
                    break;
            }
        });

        return worker?.terminate();
    }, []);

    return {
        process: (pattern: Block[], size: number) => {
            if (value.pending) {
                return;
            }

            setValue({
                pending: true,
                progress: 0
            });

            worker?.postMessage({
                type: 'request',
                value: {
                    pattern,
                    size
                }
            });
        },
        pending: value.pending,
        progress: value.progress,
        value: value.solution
    };
}

export default useSolverWorker;
