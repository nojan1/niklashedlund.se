
const game = {
    assets: {

    },
    state: {
        variables: { },
        currentScene: '',
    },
    onInput: null,
    bootstrap: function(assets, onOutput = console.log){        
        this.assets = {...this.assets, ...assets};
        this.onOutput = onOutput;

        onOutput('Engine loaded');

        const gameEndPromise = new Promise(resolve => {
            this.onInput = function(string) {
                onOutput(string);

                if(string === 'exit')
                    resolve();
            };
        });

        return {
            onInput: this.onInput.bind(this),
            gameEndPromise
        };
    }
};

export const bootstrap = game.bootstrap.bind(game);