# Calculadora Nutricional

## Descrição

Este projeto é uma **calculadora nutricional** que permite aos usuários inserir informações sobre produtos alimentícios e calcular os valores nutricionais totais, incluindo calorias, carboidratos e proteínas. A interface web permite adicionar múltiplos produtos e visualizar os resultados em uma tabela.

## Funcionalidades

- **Adicionar Produtos**: Os usuários podem adicionar produtos alimentícios com campos para nome e peso.
- **Calcular Valores Nutricionais**: Após adicionar os produtos, os usuários podem calcular os valores nutricionais totais com base nas informações fornecidas.
- **Resultados Detalhados**: Os resultados são exibidos em uma tabela com informações detalhadas sobre cada produto e os totais nutricionais.

## Estudo e Desenvolvimento

Este projeto está sendo desenvolvido como parte de um estudo para compreender melhor as **APIs de nutrição** e a **integração de frontend com backend**. O objetivo é criar uma ferramenta prática para análise nutricional de alimentos.

## API Utilizada

A aplicação utiliza uma API para obter os dados nutricionais dos produtos alimentícios. A API processa as informações fornecidas (nome e peso dos produtos) e retorna os seguintes dados:

- Calorias (kcal)
- Carboidratos (g)
- Proteínas (g)

### Endpoints

- **POST /calcular**: Recebe uma lista de produtos e retorna os valores nutricionais calculados.

## Tecnologias

- **Frontend**: HTML, CSS e JavaScript
- **Backend**: Node.js e Typescript
- **API**: FoodData Central - https://fdc.nal.usda.gov/

## Melhorias Planejadas

1. **Sugestão de Nomes e Pesquisa por ID de Produto Selecionado**: Adicionar funcionalidades para sugerir nomes de produtos com base na entrada do usuário e permitir a pesquisa por ID do produto selecionado (melhorando a eficiencia da pesquisa).
2. **Exportação**: Implementar opções para exportar os resultados em formatos como CSV ou PDF.
3. **Melhorar Interface**: Aperfeiçoar a interface com designs mais responsivos e intuitivos para uma melhor experiência do usuário.
4. **Pesquisar em outros idiomas (português e espanhol)

## Como usar

  Acesse https://calculadora-nutricional-bice.vercel.app/
