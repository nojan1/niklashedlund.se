
const tagEngine = {
    contextGetter: () => { },
    setContextGetter(contextGetter) {
        this.contextGetter = contextGetter;
    },
    flavor(strings, ...expressions) {
        const textParts = [];
        let currentExpressionIndex = 0;

        strings.forEach(string => {
            textParts.push(string);

            if (currentExpressionIndex < expressions.length) {
                const expression = expressions[currentExpressionIndex++];

                if (typeof expression === 'function') {
                    const context = this.contextGetter();
                    textParts.push(expression(context));
                } else {
                    textParts.push(expression);
                }
            }
        });

        return textParts.join('');
    }
};

export const setContextGetter = tagEngine.setContextGetter.bind(tagEngine);
export const flavor = tagEngine.flavor.bind(tagEngine);