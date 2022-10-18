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
    const result = document.querySelector('.result');
    result.innerHTML = '';


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
    let privateCounter = 0;
    //conto delle righe
    const row = Math.sqrt(numCell);

    drawGrid();
    placeCounter();
    removeText();

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

        //creo la cella con le classi e gli stili in funzione della difficoltà
        const cell = addElementClassHTML('div', `square ${numb}`, grid);
        cell.style.width = `calc(100% / ${Math.sqrt(numCell)})`;
        cell.style.height = `calc(100% / ${Math.sqrt(numCell)})`;
        cell.style.cursor = 'pointer';

        //distinguo se la cella che vado a creare è o non è una bomba
        if(listOfBombs.includes(numb)){
            cell.classList.add('bomb');
        }else{
            cell.innerHTML = '0';
        }

        cell.addEventListener('click', handleClick);
    }
    
    function handleClick()
        {   
            if (listOfBombs.includes(parseInt(this.classList[1]))){
                gameOver(0);
            }else{
                //incremento il contatore dei click
                count++;
                privateCounter++;
                result.innerHTML = `Tentativi: ${count}`
    
                //al click rendo la cella cliccata e le rimuovo la classe clickable
                this.classList.add('checked');
                this.removeEventListener('click' , handleClick)

                const arraySquares = document.querySelectorAll('.square');
                const currentPosition = parseInt(this.classList[1]);
                let arrayPosition = [];
                let exception1 = [];
                let exception2 = [];
                
                {   
                    if(numCell == 100){
                    exception1 = [1,11,21,31,41,51,61,71,81,91];
                    exception2 = [10,20,30,40,50,60,70,80,90,100];
                    }else if(numCell == 81){
                    exception1 = [1,10,19,28,37,46,55,64,73];
                    exception2 = [9,18,27,36,45,54,63,72,81];
                    }else{
                    exception1 = [1,8,15,22,29,36,43];
                    exception2 = [7,14,21,28,35,42,49];
                    }
                }
                if(exception1.includes(currentPosition)){
                    arrayPosition = [currentPosition-row,currentPosition-row+1,currentPosition+1,currentPosition+row,currentPosition+row+1];
                }else if(exception2.includes(currentPosition)){
                    arrayPosition = [currentPosition-row-1,currentPosition-row,currentPosition-1,currentPosition+row-1,currentPosition+row];
                }else {
                    arrayPosition = [currentPosition-row-1,currentPosition-row,currentPosition-row+1,currentPosition-1,currentPosition+1,currentPosition+row-1,currentPosition+row,currentPosition+row+1];
                }
                // console.log(arrayPosition);
                for(let i = 0; i < arrayPosition.length; i++){
                    if(1 <= arrayPosition[i] && arrayPosition[i] <= numCell){
                        if(!listOfBombs.includes(arrayPosition[i])){
                            if(!arraySquares[arrayPosition[i]-1].classList.contains('show')){
                                privateCounter++;
                                arraySquares[arrayPosition[i]-1].classList.add('show');
                                arraySquares[arrayPosition[i]-1].removeEventListener('click', handleClick);
                            }
                            
                        }
                    }
                }
                //condizione di vittoria
                if (privateCounter == (numCell-COUNT_BOMBS)){
                    gameOver(1);
                }
            }
        }
    function gameOver(vinto)
    {   
        //prendo e pulisco il campo dei risultati
        result.innerHTML = ''
        //aggiungo ad ogni elemento bomba la classe che colora di rosso al background
        const arraySquares = document.querySelectorAll('.square');
        for (let i = 0; i < arraySquares.length; i++){
            if(arraySquares[i].classList.contains('bomb')){
                arraySquares[i].classList.add('bomb-exploded');
            }else{
                arraySquares[i].classList.add('show');
            }
            //tolgo gli eventi ad ogni quadrato
            arraySquares[i].removeEventListener('click', handleClick);
        }

        //printo il messaggio di vittoria o sconfitta
        if (vinto){
            result.innerHTML = `Tentativi: ${count} Hai Vinto!`
        }else{
            result.innerHTML = `Tentativi: ${count} Hai Perso!`
        }
    }

    function placeCounter(){
        const arrayBombs = document.querySelectorAll('.bomb');
        const arraySquares = document.querySelectorAll('.square');

        for(let j = 0; j < arrayBombs.length; j++){
            const currentPosition = parseInt(arrayBombs[j].classList[1]);
            let arrayPosition = [];
            let exception1 = [];
            let exception2 = [];
            
            {   
                if(numCell == 100){
                exception1 = [1,11,21,31,41,51,61,71,81,91];
                exception2 = [10,20,30,40,50,60,70,80,90,100];
                }else if(numCell == 81){
                exception1 = [1,10,19,28,37,46,55,64,73];
                exception2 = [9,18,27,36,45,54,63,72,81];
                }else{
                exception1 = [1,8,15,22,29,36,43];
                exception2 = [7,14,21,28,35,42,49];
                }
            }
            if(exception1.includes(currentPosition)){
                arrayPosition = [currentPosition-row,currentPosition-row+1,currentPosition+1,currentPosition+row,currentPosition+row+1];
            }else if(exception2.includes(currentPosition)){
                arrayPosition = [currentPosition-row-1,currentPosition-row,currentPosition-1,currentPosition+row-1,currentPosition+row];
            }else {
                arrayPosition = [currentPosition-row-1,currentPosition-row,currentPosition-row+1,currentPosition-1,currentPosition+1,currentPosition+row-1,currentPosition+row,currentPosition+row+1];
            }
            // console.log(arrayPosition);
            for(let i = 0; i < arrayPosition.length; i++){
                if(!listOfBombs.includes(arrayPosition[i])){
                    if(1 <= arrayPosition[i] && arrayPosition[i] <= numCell){
                        let testo = parseInt(arraySquares[arrayPosition[i]-1].textContent);
                        testo++;
                        arraySquares[arrayPosition[i]-1].textContent = `${testo}`
                    }
                }
            }
        }
    }

    function removeText(){
        const arraySquares = document.querySelectorAll('.square');
        for(let i = 0; i < arraySquares.length; i++){
            const testo = parseInt(arraySquares[i].textContent);
            if (testo == 0){
                arraySquares[i].textContent = '';
            }
        }
    }
}