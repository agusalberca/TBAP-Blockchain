### Commands
//compilar contrato
npx hardhat compile

//Version inicial de deployment 
//(se puede hacer mejor utilizando el formato enunciado màs adelante)
npx hardhat run scripts/deploy.js --network rinkeby

//check-balance no es nativo, se importa a traves de hardhat.config.js
npx hardhat check-balance

//deployment a travès de hardhat 
npx hardhat deploy

//minteo a travès de hardhat (no hace falta tener una GUI para interactuar con el contrato)
npx hardhat mint --address 0xb9720BE63Ea8896956A06d2dEd491De125fD705E