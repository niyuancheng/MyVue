export function nextTick(fn) {
    Promise.resolve().then(()=>fn());
}