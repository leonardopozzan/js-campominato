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
    let isGameOver = false;


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
    const COUNT_BOMBS = 10;
    while(listOfBombs.length < COUNT_BOMBS){
        const random = Math.floor(Math.random() * numCell) + 1;
        if(!listOfBombs.includes(random)){
            listOfBombs.push(random);
        }
    }
    console.log(listOfBombs);
    //contatore dei click
    let privateCounter = 0;
    //conto delle righe
    const columns = Math.sqrt(numCell);

    drawGrid(numCell);
    const arraySquares = document.querySelectorAll('.square');
    placeCounter();

    //funzione che crea la griglia delle celle
    function drawGrid(numCell){
        const grid = addElementClassHTML('div', 'grid', container);
        for (let i = 1; i <= numCell; i++){
            createCell(i,grid);
        }
    }
    //funzione che crea le celle
    function createCell(numb, grid)
    {

        //creo la cella con le classi e gli stili in funzione della difficoltà
        const cell = addElementClassHTML('div', 'square', grid);
        cell.style.width = `calc(100% / ${columns})`;
        cell.style.height = `calc(100% / ${columns})`;
        cell.id = numb;
        //distinguo se la cella che vado a creare è o non è una bomba
        if(listOfBombs.includes(numb)){
            cell.classList.add('bomb');
        }

        cell.addEventListener('click', function(e){
            click(cell);
        });
        cell.oncontextmenu = function(e){
            e.preventDefault();
            addFlag(cell);
        }
    }
    
    function click(cell)
        {   
            if(isGameOver) return;
            if(cell.classList.contains('flag')) return;
            if(cell.classList.contains('checked')) return;
            if(cell.classList.contains('show')) return;
            const currentPosition = parseInt(cell.id);
            if (listOfBombs.includes(currentPosition)){
                console.log(cell);
                gameOver(0);
            }else{
                //al click rendo la cella cliccata 
                cell.classList.add('checked');
                //incremento il contatore dei click
                privateCounter++;
                //condizione di vittoria
                if (privateCounter == (numCell-COUNT_BOMBS)){
                    return gameOver(1);
                }
                closerBombsCounter = parseInt(cell.textContent);
                //se ha una bomba vicino fermo il controllo delle celle vicine
                if(!isNaN(closerBombsCounter)){
                    return;
                }
                //se invece non ci sono bombe vicine controllo tutte le posizioni vicine
                //valori booleani per indicare se la cella è a destra o sinistra
                const isRight = (currentPosition % columns === 0);
                const isLeft = (currentPosition % columns === 1);
                //in base alla posizione della cella imposto le condizioni da rispettare per andare a controllare una cella vicina
                setTimeout(()=>{
                    if(!isLeft && currentPosition > columns) {
                        const newPosition = currentPosition - columns -1;
                        click(arraySquares[newPosition - 1]);
                    }
                    if(currentPosition > columns){
                        const newPosition = currentPosition - columns;
                        click(arraySquares[newPosition - 1]);
                    }
                    if(!isRight && currentPosition > columns){
                        const newPosition = currentPosition - columns + 1;
                        click(arraySquares[newPosition - 1]);
                    }
                    if(!isLeft && currentPosition > 0){
                        const newPosition = currentPosition - 1;
                        click(arraySquares[newPosition - 1]);
                    }
                    if(!isRight && currentPosition > 0){
                        const newPosition = currentPosition + 1;
                        click(arraySquares[newPosition - 1]);
                    }
                    if(!isLeft && currentPosition <= (numCell - columns)) {
                        const newPosition = currentPosition + columns -1;
                        click(arraySquares[newPosition - 1]);
                    }
                    if(currentPosition <= (numCell - columns)){
                        const newPosition = currentPosition + columns;
                        click(arraySquares[newPosition - 1]);
                    }
                    if(!isRight && currentPosition <= (numCell - columns)){
                        const newPosition = currentPosition + columns + 1;
                        click(arraySquares[newPosition - 1]);
                    }
                },10);
                //esecuzione vecchia, versione 1
                // const arraySquares = document.querySelectorAll('.square');
                // const currentPosition = parseInt(cell.id);
                // let arrayPosition = [];
                // let exception1 = [];
                // let exception2 = [];
                
                // {   
                //     if(numCell == 100){
                //     exception1 = [1,11,21,31,41,51,61,71,81,91];
                //     exception2 = [10,20,30,40,50,60,70,80,90,100];
                //     }else if(numCell == 81){
                //     exception1 = [1,10,19,28,37,46,55,64,73];
                //     exception2 = [9,18,27,36,45,54,63,72,81];
                //     }else{
                //     exception1 = [1,8,15,22,29,36,43];
                //     exception2 = [7,14,21,28,35,42,49];
                //     }
                // }
                // if(exception1.includes(currentPosition)){
                //     arrayPosition = [currentPosition-columns,currentPosition-columns+1,currentPosition+1,currentPosition+columns,currentPosition+columns+1];
                // }else if(exception2.includes(currentPosition)){
                //     arrayPosition = [currentPosition-columns-1,currentPosition-columns,currentPosition-1,currentPosition+columns-1,currentPosition+columns];
                // }else {
                //     arrayPosition = [currentPosition-columns-1,currentPosition-columns,currentPosition-columns+1,currentPosition-1,currentPosition+1,currentPosition+columns-1,currentPosition+columns,currentPosition+columns+1];
                // }
                // // console.log(arrayPosition);
                // for(let i = 0; i < arrayPosition.length; i++){
                //     if(1 <= arrayPosition[i] && arrayPosition[i] <= numCell){
                //         if(!listOfBombs.includes(arrayPosition[i])){
                //             if(!arraySquares[arrayPosition[i]-1].classList.contains('show')){
                //                 privateCounter++;
                //                 arraySquares[arrayPosition[i]-1].classList.add('show');
                //                 arraySquares[arrayPosition[i]-1].removeEventListener('click', handleClick);
                //             }
                //         }
                //     }
                // }
            }
        }
    function gameOver(vinto)
    {   
        isGameOver = true;
        //prendo e pulisco il campo dei risultati
        result.innerHTML = ''

        //printo il messaggio di vittoria o sconfitta
        if (vinto){
            //aggiungo ad ogni elemento bomba la classe che mette la flag mostro le altre caselle non cliccate
            for (let i = 0; i < arraySquares.length; i++){
                if(arraySquares[i].classList.contains('bomb')){
                    arraySquares[i].classList.add('flag');
                }else{
                    arraySquares[i].classList.add('show');
                }
            }
            result.innerHTML = `Hai Vinto!`
        }else{
            //aggiungo ad ogni elemento bomba la classe che la evidenzi e mostro le altre caselle non cliccate
            for (let i = 0; i < arraySquares.length; i++){
                if(arraySquares[i].classList.contains('bomb')){
                    arraySquares[i].classList.add('bomb-exploded');
                }else{
                    arraySquares[i].classList.add('show');
                }
            }
            result.innerHTML = `Hai Perso!`
        }
    }

    function placeCounter(){

        for(let j = 0; j < listOfBombs.length; j++){
            const currentPosition = listOfBombs[j];

            const isRight = (currentPosition % columns === 0);
            const isLeft = (currentPosition % columns === 1);
            //in base alla posizione della cella imposto le condizioni da rispettare per andare a controllare una cella vicina
            
            if(!isLeft && currentPosition > columns) {
                const newPosition = currentPosition - columns -1;
                if(!listOfBombs.includes(newPosition)){
                    let counterBombs = parseInt(arraySquares[newPosition - 1].textContent);
                    if(isNaN(counterBombs)){
                        counterBombs = 0;
                    }
                    counterBombs++;
                    arraySquares[newPosition - 1].textContent = counterBombs;
                }
            }
            if(currentPosition > columns){
                const newPosition = currentPosition - columns;
                if(!listOfBombs.includes(newPosition)){
                    let counterBombs = parseInt(arraySquares[newPosition - 1].textContent);
                    if(isNaN(counterBombs)){
                        counterBombs = 0;
                    }
                    counterBombs++;
                    arraySquares[newPosition - 1].textContent = counterBombs;
                }
            }
            if(!isRight && currentPosition > columns){
                const newPosition = currentPosition - columns + 1;
                if(!listOfBombs.includes(newPosition)){
                    let counterBombs = parseInt(arraySquares[newPosition - 1].textContent);
                    if(isNaN(counterBombs)){
                        counterBombs = 0;
                    }
                    counterBombs++;
                    arraySquares[newPosition - 1].textContent = counterBombs;
                };
            }
            if(!isLeft && currentPosition > 0){
                const newPosition = currentPosition - 1;
                if(!listOfBombs.includes(newPosition)){
                    let counterBombs = parseInt(arraySquares[newPosition - 1].textContent);
                    if(isNaN(counterBombs)){
                        counterBombs = 0;
                    }
                    counterBombs++;
                    arraySquares[newPosition - 1].textContent = counterBombs;
                }
            }
            if(!isRight && currentPosition > 0){
                const newPosition = currentPosition + 1;
                if(!listOfBombs.includes(newPosition)){
                    let counterBombs = parseInt(arraySquares[newPosition - 1].textContent);
                    if(isNaN(counterBombs)){
                        counterBombs = 0;
                    }
                    counterBombs++;
                    arraySquares[newPosition - 1].textContent = counterBombs;
                }
            }
            if(!isLeft && currentPosition <= (numCell - columns)) {
                const newPosition = currentPosition + columns -1;
                if(!listOfBombs.includes(newPosition)){
                    let counterBombs = parseInt(arraySquares[newPosition - 1].textContent);
                    if(isNaN(counterBombs)){
                        counterBombs = 0;
                    }
                    counterBombs++;
                    arraySquares[newPosition - 1].textContent = counterBombs;
                }
            }
            if(currentPosition <= (numCell - columns)){
                const newPosition = currentPosition + columns;
                if(!listOfBombs.includes(newPosition)){
                    let counterBombs = parseInt(arraySquares[newPosition - 1].textContent);
                    if(isNaN(counterBombs)){
                        counterBombs = 0;
                    }
                    counterBombs++;
                    arraySquares[newPosition - 1].textContent = counterBombs;
                }
            }
            if(!isRight && currentPosition <= (numCell - columns)){
                const newPosition = currentPosition + columns + 1;
                if(!listOfBombs.includes(newPosition)){
                    let counterBombs = parseInt(arraySquares[newPosition - 1].textContent);
                    if(isNaN(counterBombs)){
                        counterBombs = 0;
                    }
                    counterBombs++;
                    arraySquares[newPosition - 1].textContent = counterBombs;
                }
            }
            

            //esecuzione vecchia, versione 1
            // let arrayPosition = [];
            // let exception1 = [];
            // let exception2 = [];
            
            // {   
            //     if(numCell == 100){
            //     exception1 = [1,11,21,31,41,51,61,71,81,91];
            //     exception2 = [10,20,30,40,50,60,70,80,90,100];
            //     }else if(numCell == 81){
            //     exception1 = [1,10,19,28,37,46,55,64,73];
            //     exception2 = [9,18,27,36,45,54,63,72,81];
            //     }else{
            //     exception1 = [1,8,15,22,29,36,43];
            //     exception2 = [7,14,21,28,35,42,49];
            //     }
            // }
            // if(exception1.includes(currentPosition)){
            //     arrayPosition = [currentPosition-columns,currentPosition-columns+1,currentPosition+1,currentPosition+columns,currentPosition+columns+1];
            // }else if(exception2.includes(currentPosition)){
            //     arrayPosition = [currentPosition-columns-1,currentPosition-columns,currentPosition-1,currentPosition+columns-1,currentPosition+columns];
            // }else {
            //     arrayPosition = [currentPosition-columns-1,currentPosition-columns,currentPosition-columns+1,currentPosition-1,currentPosition+1,currentPosition+columns-1,currentPosition+columns,currentPosition+columns+1];
            // }
            // // console.log(arrayPosition);
            // for(let i = 0; i < arrayPosition.length; i++){
            //     if(!listOfBombs.includes(arrayPosition[i])){
            //         if(1 <= arrayPosition[i] && arrayPosition[i] <= numCell){
            //             let testo = parseInt(arraySquares[arrayPosition[i]-1].textContent);
            //             if(isNaN(testo)){
            //                 testo = 0;
            //             }
            //             testo++;
            //             arraySquares[arrayPosition[i]-1].textContent = `${testo}`
            //         }
                // }
            // }
        }
    }
    let counterFlag = 0;
    function addFlag(cell){
        if(isGameOver) return;
        if(cell.classList.contains('flag')){
            counterFlag--;
            cell.classList.remove('flag');
            return;
        }
        if(counterFlag >= COUNT_BOMBS) return;
        if(cell.classList.contains('checked')) return;
        counterFlag++;
        cell.classList.add('flag');
    }
}

