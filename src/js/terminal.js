import { Terminal } from 'xterm';

import welcome from '../content/welcome.json';
import portfolio from '../content/portfolio.json';
import me from '../content/me.json';

const commands = {
    'portfolio': terminal => terminal.writeContent(portfolio),
    'whoareyou': terminal => terminal.writeContent(me),
    'skills': handleSkills
};

const terminal = {
    terminal: null,
    commandBuffer: '',
    onDataDisposable: null,
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

        this.onDataDisposable = this.terminal.onData(this.onData.bind(this));
    },
    onData: function(e){
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
            if(this.onDataDisposable){
                this.onDataDisposable.dispose();
                this.onDataDisposable = null;
            }

            commands[command](this);
            this.onDataDisposable = this.terminal.onData(this.onData.bind(this));
        } else {
            this.terminal.writeln('Unknown command, maybe try help');
        }
    }
}

function handleSkills(terminal) {
    let skills = [
        {text: 'PHP', weight: 4 },
        {text: 'Arch Linux', weight: 5 },
        {text: 'Debian', weight: 2 },
        {text: 'Python', weight: 7 },
        {text: 'Bash', weight: 6 },
        {text: 'Cisco IOS', weight: 5 },
        {text: 'Nätverk', weight: 7 },
        {text: 'Mysql', weight: 6 },
        {text: 'Windows', weight: 7 },
        {text: '.NET', weight: 8 },
        {text: 'C#', weight: 8 },
        {text: 'Java', weight: 2 },
        {text: 'C / C++', weight: 3 },				
        {text: 'Android', weight: 1 },
        {text: 'HTML', weight: 8 },
        {text: 'Javascript', weight: 7 },
        {text: 'CSS', weight: 8 },
        {text: 'Photoshop', weight: 6 },
        {text: 'Angular JS', weight: 7 },
        {text: 'Gulp', weight: 4 },
        {text: 'Blender', weight: 5 },
        {text: 'WCF', weight: 4 },
        {text: 'WPF', weight: 6 },
        {text: 'After effects', weight: 1 },
        {text: 'Premiere', weight: 2 },
        {text: 'AVR', weight: 5 },
        {text: 'Arduino', weight: 4 },
    ];
    
    terminal.terminal.writeln('Some skills i know');
    terminal.terminal.writeln(skills.map(s => s.text).join(', '));
}

export const initTerminal = terminal.init.bind(terminal);