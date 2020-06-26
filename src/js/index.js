import { initTerminal } from './terminal';
 

function onKeyDown(event){
    document.querySelector('.intro').classList.toggle('hidden');
    document.querySelector('.main').classList.toggle('hidden');

    initTerminal(document.querySelector('.terminal'));
    document.removeEventListener('keydown', onKeyDown);
}

document.addEventListener('keydown', onKeyDown);