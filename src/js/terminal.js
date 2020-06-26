import { Terminal } from 'xterm';

import welcome from '../content/welcome.json';
import portfolio from '../content/portfolio.json'

const commands = {
    'portfolio': portfolio
};

const terminal = {
    terminal: null,
    commandBuffer: '',
    init: function (element) {
        this.terminal = new Terminal({ theme: { foreground: 'green' } });
        this.terminal.open(element);
        this.terminal.focus();
        
        this.postInit();
    },
    prompt: function () {
        this.terminal.write('\r\n$ ');
        this.commandBuffer = '';
    },
    postInit: function () {
        this.writeContent(welcome);
        this.prompt();

        this.terminal.onData(e => {
            switch (e) {
                case '\r': // Enter
                    this.executeCommand(this.commandBuffer);

                case '\u0003': // Ctrl+C
                    this.prompt();
                    break;
                case '\u007F': // Backspace (DEL)
                    // Do not delete the prompt
                    if (this.terminal._core.buffer.x > 2) {
                        this.terminal.write('\b \b');

                        this.commandBuffer =
                            this.commandBuffer.length > 0
                                ? this.commandBuffer.substr(0, this.commandBuffer.length - 1)
                                : '';
                    }
                    break;
                default: // Print all other characters for demo
                    this.terminal.write(e);
                    this.commandBuffer += e;
            }
        });
    },
    writeContent: function (content) {
        content.forEach(l => this.terminal.writeln(l));
    },
    executeCommand: function (command) {
        this.terminal.writeln('');

        if (command === 'help') {
            this.terminal.writeln('Available commands:');
            this.terminal.writeln(Object.keys(commands).join(' '))
        } else if (Object.keys(commands).includes(command)) {
            this.writeContent(commands[command]);
        } else {
            this.terminal.writeln('Unknown command, maybe try help');
        }
    }
}

export const initTerminal = terminal.init.bind(terminal);