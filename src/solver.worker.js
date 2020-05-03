import solver from 'lib/solver';

self.addEventListener('message', event => {
    switch (event.data.type) {
        case 'request':
            solveRequest(event.data.value.pattern, event.data.value.size);
            break;

        default:
            break;
    }
});

function solveRequest(pattern, size) {
    const v = solver(pattern, size);
    for (let itr = v.next(); !itr.done; itr = v.next()) {
        self.postMessage({
            type: 'progress',
            data: itr.value
        });
    }
}
