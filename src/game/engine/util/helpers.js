export function runConditional(conditional, state) {
    const rawResult = conditional(state);

    if (typeof rawResult === 'object') {
        return rawResult;
    }

    return { success: !!rawResult, output: '' };
}