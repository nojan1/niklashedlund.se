import { runConditional } from "../util/helpers";

const verbHandles = {
    '.*': handleTrigger,
    'go': handleGo,
    'pickup': handlePickup
}

export function parseSceneCommand(scene, state, input) {
    const commandParts = input.trim().toLowerCase().split(' ');
    if (commandParts.length < 2)
        return {
            success: false,
            output: 'I didn\'t get that'
        };

    const verbs = Object.keys(verbHandles);
    for (let i = 0; i < verbs.length; i++) {
        var regex = new RegExp(verbs[i], 'g');
        if (commandParts[0].match(regex)) {
            const result = verbHandles[verbs[i]](scene, state, input, commandParts);

            if (!result.continue)
                return result;
        }
    }

    return {
        success: false,
        output: 'I do not know how to do that'
    };
}

function handleTrigger(scene, state, input, commandParts) {
    const matchingTrigger = Object.entries(scene.triggers ?? {})
        .find(([phrase, action]) => 
            input.trim().toLowerCase().match(new RegExp(phrase))
        );

    if(matchingTrigger){
        return matchingTrigger[1](state);
    }

    return {
        success: false,
        output: '',
        continue: true
    };
}

function handleGo(scene, state, input, commandParts) {
    const direction = scene.directions?.[commandParts[1]];

    if (direction) {
        if(direction.conditional){
            const result = runConditional(direction.conditional, state);

            if(!result.success){
                return {
                    success: false,
                    output: result.output ?? 'Seems that is not possible to go that way'
                }
            }
        }

        return {
            success: true,
            output: null,
            stateChange: {
                currentScene: direction.destination
            }
        };
    } else {
        return {
            success: false,
            output: 'That is not a direction I can go'
        };
    }
}

function handlePickup(scene, state, input, commandParts) {
    return {
        success: false,
        output: ''
    };
}