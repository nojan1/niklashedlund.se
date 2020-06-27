
export function flavor(strings, ...expressions){
    const textParts = [];
    const currentExpressionIndex = 0;

    strings.forEach(string => {
        textParts.push(string);

        if(currentExpressionIndex < keys.length){
            const expression = expressions[currentExpressionIndex++];

            if(typeof expression === 'function'){
                textParts.push(expression({ /* game context goes here */ }));
            }else{
                textParts.push(expression);
            }
        }
    });

    return textParts.join('');
}