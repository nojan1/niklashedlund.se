export function renderScene(scene, onOutput){
    scene.text().split('\n').forEach(l => onOutput(l));
}