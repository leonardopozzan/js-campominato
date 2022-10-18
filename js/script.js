// Consegna
// L'utente clicca su un bottone che genererà una griglia di gioco quadrata.
// Ogni cella ha un numero progressivo, da 1 a 100.
// Ci saranno quindi 10 caselle per ognuna delle 10 righe.
// Quando l'utente clicca su ogni cella, la cella cliccata si colora di azzurro ed emetto un messaggio in console con il numero della cella cliccata.
// Bonus
// Aggiungere una select accanto al bottone di generazione, che fornisca una scelta tra tre diversi livelli di difficoltà:
// - con difficoltà 1 => 100 caselle, con un numero compreso tra 1 e 100, divise in 10 caselle per 10 righe;
// - con difficoltà 2 => 81 caselle, con un numero compreso tra 1 e 81, divise in 9 caselle per 9 righe;
// - con difficoltà 3 => 49 caselle, con un numero compreso tra 1 e 49, divise in 7 caselle per 7 righe;


const btn = document.querySelector('#btn');
btn.addEventListener('click',play);
const container = document.querySelector('.the-game');

function play(){
    //prendo e pulisco il container del gioco
    container.innerHTML = '';
    const difficulty = document.querySelector('#difficulty').value;

    //scelgo il numero di celle 
    let numCell;
    switch (difficulty) {
        case 'easy':
            numCell = 100
            break;
        case 'hard':
            numCell = 81
            break;
        case 'crazy':
            numCell = 49
            break;
        case 'impossible':
            numCell = 25
            break;
    }

    //genero la lista delle posizioni delle bombe
    let listOfBombs = [];
    const COUNT_BOMBS = 16;
    while(listOfBombs.length < COUNT_BOMBS){
        const random = Math.floor(Math.random() * numCell) + 1;
        if(!listOfBombs.includes(random)){
            listOfBombs.push(random);
        }
    }
    //contatore dei click dell'utente
    let count = 0;

    drawGrid()

    //funzione che crea la griglia delle celle
    function drawGrid(){
        const grid = addElementClassHTML('div', 'grid', container);
        for (let i = 1; i <= numCell; i++){
            createCell(i,grid);
        }
    }

    //funzione che crea le celle
    function createCell(numb, grid)
    {
        const result = document.querySelector('.result');

        //creo la cella con le classi e gli stili in funzione della difficoltà
        const cell = addElementClassHTML('div', `square ${numb}`, grid);
        cell.style.width = `calc(100% / ${Math.sqrt(numCell)})`;
        cell.style.height = `calc(100% / ${Math.sqrt(numCell)})`;
        cell.style.cursor = 'pointer';

        //inserisco una variabile che conta i click
        count = 0;

        //distinguo se la cella che vado a creare è o non è una bomba
        if(listOfBombs.includes(numb)){
            cell.classList.add('bomb');
        }else{
            cell.classList.add('clickable');
        }

        cell.addEventListener('click', a = function handleClick()
        {
            if (listOfBombs.includes(numb)){
                gameOver(numb,count,result);
            }else{
                //incremento il contatore dei click
                count++;
                result.innerHTML = `Tentativi: ${count}`
                
                //al click rendo la cella cliccata e le rimuovo la classe clickable
                this.classList.add('checked');
                this.removeEventListener('click' , handleClick)
                //condizione di vittoria
                if (count == (numCell-COUNT_BOMBS)){
                    gameOver(numb,count,result);
                }
            }
        })
    }

    function gameOver(numb,count,result)
    {   
        console.log('game over')
        //prendo e pulisco il campo dei risultati
        result.innerHTML = ''
        //al click aggiungo ad ogni elemento bomba la classe che colora di rosso il background
        const arraySquares = document.querySelectorAll('.square');
        for (let i = 0; i < arraySquares.length; i++){
            if(arraySquares[i].classList.contains('bomb')){
                // console.log('esplodi bomba')
                arraySquares[i].classList.add('bomb-exploded');
            }
            arraySquares[i].removeEventListener('click', handleClick)
        }

        if (listOfBombs.includes(numb)){
            
            //inoltre rendo il colore delle altre celle immutabile in modo che l'utente non possa più giocare
            //selezionando tutte le celle non ancora cliccate
            // const arrayNotBombs = document.querySelectorAll('.clickable');
            // const arrayNotBombs = document.querySelectorAll('.square');

            // for (let i = 0; i < arrayNotBombs.length; i++){
            //     arrayNotBombs[i].classList.add('unclickable');
            //     // console.log(1)
            //     // arrayNotBombs[i].removeEventListener('click' , bomba);
            // }
            result.innerHTML = `Tentativi: ${count} Hai Perso!`
        }
        //condizione di vittoria
        if (count == (numCell-COUNT_BOMBS)){
            
            result.innerHTML = `Tentativi: ${count} Hai Vinto!`
        }
    }
    
}