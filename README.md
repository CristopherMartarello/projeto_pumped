# projeto_pumped
Pumped, site para registro de vida fitness, com foco em auxiliar a vida do usuario com a criação de rotinas de treinos, dietas com base no seu objetivo e registros pessoais para acompanhar sua evolução.

# Instalações necessárias
1°- Clonar esse projeto para o seu computador ultilizando o Git. Todas as pastas da aplicação se encontram na branch 'MASTER'.

2°- Abra o projeto no VSCODE, abra o terminal do VSCODE e entre na branch MASTER atraves do comando 'git checkout master'. Agora você está na branch principal do projeto.

3° - Baixar node.js (versão 20.9 ou 20.12 / com o node package manager - npm)

4° - Instalar dependencias do projeto (comando: npm install)

5° - Configurar o nodemon para que rode de forma correta (comando: npm install -g nodemon) e (comando: npm install --save-dev nodemon)

6° - Rodar o script 'nodemon start.js' para iniciar o servidor.

Caso não consiga rodar o script:
7°- Abra o terminal (POWERSHELL) para verificar as permissões do usuário e veja se possui permissão para rodar scripts, usando o comando 'Get-ExecutionPolicy', se for 'Restricted': rode o comando 'Set-ExecutionPolicy RemoteSigned'

# Lista de Funcionalidades
1° - Sistema de login e criação de contas: Cada usuario tem sua propria conta, com seus registros pessoais (se existirem) salvos em nosso Banco de Dados, se o usuario tentar entrar sem ter uma conta ele não conseguirá, assim tendo que ir para a aba de criação de conta, e após cria-la, pode agora entrar no site.

2° - Aba de Dados: Local dedicado para o usurario registrar seus dados pessoais, eles sendo nome, email, idade, peso atual, altura, data de nascimento e biografia, todos esses dados ao serem registrados sao enviados ao Banco de Dados e assim, sempre que o usuario entrar em sua conta, esses dados ja estarão salvos, assim podendo atualiza-los sempre que necessário.

3° - Aba Treino: Local dedicado a criação de treinos personalizados com base no grupamento muscular selecionado pelo usuario (sendo eles: peito, costas, ombros, pernas, biceps, triceps e abdomem), o usuario pode criar varios treinos nomeados por ele, e tambem excui-los, cada treino criado é enviado para o Banco de Dados, assim ficando salvo para que cada vez que o usuario entre no site, ele ja tenha seus treinos registrados ali. Ao clicar em um treino existente, o usuario pode marcar em checkbox quais exercicios ele ja realizou, e após marcar todos os exercicios, ele pode concluir o treino, ao ser concluido, o contador de vezes que o treino foi realizado aumenta.

4° - Aba Dieta: Local dedicado a criação de dietas personalizadas com base no objetivo do usuario (Perda de peso, Ganho de massa ou Manter Fisico), os calculos para a criação das dietas usam os dados ja registrados pelo usuario, como peso, idade e altura, tambem é levado em conta a atividade fisica realizada pelo usuario. Assim, a quantidade de agua e calorias diarias nescessarias para o objetivo selecionado é calculada, e assim como os treinos, as dietas tambem sao salvas no Banco de Dados e ficam registradas no site para cada usuario e podem ser excluidas. Ao clicar em uma dieta, é apresentado uma lista de 50 aliemtos e suas calorias a cada 100g, a meta de calorias, e as calorias consumidas, assim, cada aliemento consumido o usuario marca um checkbox, e a quantidade de calorias consumidas é somada.

# Lista de Funcionalidades Desejadas Não Implementadas
1° - Sistema de seguir e ser seguido por outros usuarios.

2° - Um feed como de qualquer rede social, quando um usuario concluí um treino ou dieta, ela apareceria no feed dos usurarios que o seguem, assim podendo comentar e curtir a dieta ou treino.

3° - Uma loja do site, com produtos relacionados a vida fitness, como suplementos e acessorios.

4° - Uma aba de evolução, que mostraria a evolução do usuario com base nos treinos, dietas e peso.

5° - A possibilidade do usuário poder selecionar a quandidade em gramas dos alimentos que ele consumiu da dieta, assim um calculo seria feito para a relação gramas e calorias.

# Como abrir a documentação
A documentação foi feita usando o JSDoc, ela se encontra na pasta /doc , é o arquivo index.html.

# Como abrir a documentação das APIs
1°- Inicializar o servidor caso não esteja inicializado (nodemon start.js).
2°- Entrar no caminho http://localhost:3000/swagger/ para acessar a interface Swagger com as APIs.
