import { bootstrap } from './engine';
import { flavor } from './engine/util/tagEngine';


const launchGame = function (terminal) {
    const assets = {
        scenes: {
            'start': {
                default: true,
                text: () =>
flavor`You are standing in front of a deep and spooky forest. 
The only sound you hear is that of your own breating.

A mostly overgrown footpath leads into the forest to the north.`,
                directions: {
                    'north': {
                        destination: 'clearing'
                    }
                }
            },
            'clearing': {
                text: () =>
flavor`You arrive at at clearing in the forest, going further on this path is impossible due to overgrowth.
The ground is full of rock and debris.
There is a tiny gap in a rockface to the west where you might be able to squeeze through.`,
                triggers: {
                    'look .*debris': () => ({ success: true, output: 'The debris seems to be from a wagon probably belonging to a merchant' }),
                    '(dig|search|investigate).*': ({variables}) => {
                        variables['got_orb'] = true;

                        return {
                            success: true,
                            output: `Digging through the ruble you find a magical glowing orb. 
As you touch it the rockface seems to pulse.`
                        }
                    }
                },
                directions: {
                    'west': {
                        destination: 'shrine',
                        conditional: ({variables}) => variables['got_orb'] ? true : { success: false, output: 'The path is magically sealed' } 
                    },
                    'south': {
                        destination: 'start'
                    }
                }
            },
            'shrine': {
                text: () => `You arrive at a beatiful shine in the middle of the forest.
Admiring the stonework you feel fulfilled in your heart and is happy to retire`
            }
        },
        dialogues: [

        ],
        encounters: [

        ]
    };

    terminal.terminal.clear();
    const gameInstance = bootstrap(assets, terminal.terminal.writeln.bind(terminal.terminal));

    let commandBuffer = '';
    const onDataDispose = terminal.terminal.onData(e => {
        switch (e) {
            case '\r': // Enter
                terminal.terminal.writeln('');
                gameInstance.onInput(commandBuffer);
                commandBuffer = '';
                break;
            case '\u007F': // Backspace (DEL)
                if (terminal.terminal._core.buffer.x > 0) {
                    terminal.terminal.write('\b \b');

                    commandBuffer =
                        commandBuffer.length > 0
                            ? commandBuffer.substr(0, commandBuffer.length - 1)
                            : '';
                }
                break;
            default:
                terminal.terminal.write(e);
                commandBuffer += e;
        }
    });

    return gameInstance.gameEndPromise.then(() => onDataDispose.dispose());
}

export default launchGame;