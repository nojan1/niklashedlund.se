import { setContextGetter } from "./util/tagEngine";
import { renderScene } from "./core/scene";
import { parseSceneCommand } from "./core/commandParser";

const game = {
    assets: {
        scenes: {
            'default_scene': {
                default: true,
                text: () => 'No scenes configured'
            }
        }
    },
    state: {
        variables: {},
        currentScene: '',
    },
    currentScene() { return this.assets.scenes[this.state.currentScene]; },
    onInput: null,
    bootstrap: function (assets, onOutput = console.log) {
        this.assets = { ...this.assets, ...assets };
        this.onOutput = onOutput;

        setContextGetter(() => (
            {
                ...this.state
            }
        ));

        this.findAndSetDefaultScene();
        onOutput('Engine loaded');

        renderScene(this.currentScene(), onOutput);

        const gameEndPromise = new Promise(resolve => {
            this.onInput = function (string) {
                if (string === 'exit'){
                    resolve();
                    return;
                }

                const result = parseSceneCommand(this.currentScene(), this.state, string);

                if(result.output)
                    onOutput(result.output);

                if(result.stateChange){
                    this.state = {...this.state, ...result.stateChange};
                    
                    if(result.stateChange.currentScene)
                        renderScene(this.currentScene(), onOutput);
                }
            };
        });

        return {
            onInput: this.onInput.bind(this),
            gameEndPromise
        };
    },
    findAndSetDefaultScene() {
        const defaultScene = Object.entries(this.assets?.scenes ?? {}).find(([name, scene]) => scene.default);
        this.state.currentScene = defaultScene[0];
    }
};

export const bootstrap = game.bootstrap.bind(game);