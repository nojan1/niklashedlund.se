import { initTerminal } from './terminal';
 

function onKeyDown(event){
    event.stopPropagation();
    
    document.querySelector('.intro').classList.toggle('hidden');
    document.querySelector('.main').classList.toggle('hidden');

    initTerminal(document.querySelector('.terminal'));
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('click', onKeyDown);
}

document.addEventListener('keydown', onKeyDown);
document.addEventListener('click', onKeyDown);