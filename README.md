# GTA Map Coordinates

Este projeto é uma aplicação web para visualizar coordenadas do mapa de GTA V. Ele permite inserir coordenadas X e Y do jogo e gerar uma imagem do mapa com um marcador na posição correspondente.

## Funcionalidades

- Conversão de coordenadas GTA para pixels no mapa
- Geração de imagens do mapa com marcadores GPS
- Interface web simples para interação

## Como usar

1. Instale as dependências:
   ```
   npm install
   ```

2. Certifique-se de que o arquivo `gta-map.jpeg` esteja na raiz do projeto (não incluído neste repositório).

3. Execute o servidor:
   ```
   node index.js
   ```

4. Abra `index.html` no navegador ou acesse `http://localhost:3000` para a interface web.

5. Use a rota `/map?x=<coord_x>&y=<coord_y>` para obter uma imagem do mapa com o marcador.

## Uso Permitido

Este projeto é de uso livre e permitido para qualquer finalidade, sem restrições.

## Tecnologias

- Node.js
- Express
- Canvas API
- HTML/CSS/JavaScript