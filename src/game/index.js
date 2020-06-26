import { bootstrap } from './engine';


const launchGame = function (terminal) {
    const assets = {
        scenes: [

        ],
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
                if (this.terminal._core.buffer.x > 0) {
                    this.terminal.write('\b \b');

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