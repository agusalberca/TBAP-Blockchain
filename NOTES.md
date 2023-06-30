> Toda la info a seguir la saque de acá: 


### Flujo de deployment
- Compilar contrato : `npx hardhat compile`
- Ejecutar tests de contrato: `npx hardhat test`
- Deploy a testnet (configurar .env): `npx hardhat run --network mumbai scripts/deploy_testnet.js`
- Verificar contrato: `npx hardhat verify --network mumbai {contract_address} {contract_constructor_parameters_list}`
- Ejecutar tasks: `npx hardhat {task_name} {task_params} --network mumbai`
- Ejemplos varios
    - npx hardhat mint-gift --network mumbai
    - npx hardhat mint --network mumbai
    - npx hardhat get-user-rewards --network mumbai
    - npx hardhat get-user-rewards --address 0xf1dD71895e49b1563693969de50898197cDF3481 --network mumbai


#### Comandos de interacción
- Ejemplo base para correr un script (Debe respetar estructura main()):
    npx hardhat run --network mumbai {script_path}

- Ejemplo base para correr una task definida
    npx hardhat task-name --network mumbai

- Listar tokens de cuenta de testing
    npx hardhat getUserRewards --network mumbai

### Links de interes
- [General - OpenZeppelin](https://docs.openzeppelin.com/learn/)
- [General - Polygon](https://wiki.polygon.technology/docs/develop/developer-resources)
- [Firma ECDSA](https://blog.cabala.co/how-to-verify-off-chain-results-and-whitelist-with-ecdsa-in-solidity-using-openzeppelin-ethers-js-ba4c85521711)
- [Desarrollo en polygon](https://wiki.polygon.technology/docs/develop/getting-started/)
- [Polygon hardhat network config](https://wiki.polygon.technology/docs/develop/hardhat/)