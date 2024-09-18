document.addEventListener('DOMContentLoaded', () => {
    let itemCount = 1;
    const spinner = document.getElementById('loadingSpinner');
    const messageContainer = document.getElementById('messageContainer');
    const messageText = document.getElementById('messageText');

    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.style.display = 'none'; 
    tooltip.innerHTML = `
        <p><strong>Nome:</strong> nome do produto (por favor seja específico e digite em inglês)</p>
        <p><strong>Peso:</strong> peso do produto em gramas</p>
        <p><strong>Tipo de Produto:</strong></p>
        <ul>
            <li><strong>Básico:</strong> produtos em forma básica e amplamente consumidos, base da alimentação.<br>Exemplo: frutas, vegetais frescos, ovos, grãos, leites e derivados.</li>
            <li><strong>Tradicional:</strong> Produtos preparados, também inclui alimentos tradicionais de determinadas nacionalidades. <br>Exemplo: cereais prontos, alimentos enlatados, cozidos, fritos e de restaurantes.</li>
        </ul>
    `;
    document.body.appendChild(tooltip);
    // Função para adicionar novo formulário
    const adicionarItem = () => {
        itemCount++;
        const formContainer = document.getElementById('formContainer');
        const newItem = document.createElement('div');
        newItem.classList.add('form-item');
        newItem.innerHTML = `
            <label for="nome-${itemCount}">Nome</label>
            <input type="text" id="nome-${itemCount}" name="nome-${itemCount}" required>
            <label for="peso-${itemCount}">Peso (g)</label>
            <input type="number" id="peso-${itemCount}" name="peso-${itemCount}" required>
            <label for="tipo-produto-${itemCount}">Tipo de Produto</label>
            <select id="tipo-produto-${itemCount}" name="tipo-produto-${itemCount}" required>
                <option value="basico">Básico</option>
                <option value="tradicional">Tradicional</option>
            </select>
            <button type="button" class="remover"></button>
        `;
        formContainer.appendChild(newItem);
        
        
        const removeButton = newItem.querySelector('.remover');
        removeButton.addEventListener('click', () => {
            removeButton.classList.add('remover-clicked');

            if (window.innerWidth <= 767) {
                // Define um atraso antes de remover o item somente para dispositivos móveis
                setTimeout(() => {
                    newItem.remove(); // Remove o item atual
                }, 300); // Ajuste o tempo do delay conforme necessário (300 ms = 0.3 s)
            } else {
                // Remove o item imediatamente para telas maiores
                newItem.remove();
            }
        });
    };

    const showTooltip = (event) => {
        const rect = event.target.getBoundingClientRect();
        tooltip.style.display = 'block';
        tooltip.style.left = `${rect.left + window.scrollX + 20}px`; // Ajusta a posição do popup
        tooltip.style.top = `${rect.top + window.scrollY}px`;
    };

    // Função para esconder a tooltip
    const hideTooltip = () => {
        tooltip.style.display = 'none';
    };

    // Adiciona a tooltip ao botão de info
    const addTooltipEvents = () => {
        const infoButtons = document.querySelectorAll('.info');
        infoButtons.forEach(button => {
            button.addEventListener('mouseover', showTooltip);
            button.addEventListener('mouseout', hideTooltip);
        });
    };


    // Função para calcular e fazer o POST para a API
    const calcular = async () => {
        const formData = new FormData(document.getElementById('produtosForm'));
        const data = [];

        // Limpar resultados anteriores antes de exibir novos
        const resultContainer = document.getElementById('resultContainer');
        resultContainer.innerHTML = '';


        spinner.classList.remove('hidden');
        messageContainer.classList.add('hidden');

        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Iterar sobre os campos do formulário
        for (let i = 1; i <= itemCount; i++) {
            const nome = formData.get(`nome-${i}`);
            const peso = formData.get(`peso-${i}`);
            let tipo = formData.get(`tipo-produto-${i}`);

            if(tipo == "basico"){
                tipo = "Foundation";
            } else{
                tipo = "SR Legacy";
            }

            if (nome && peso) {
                data.push({ name: nome, weight: parseFloat(peso), type: tipo });
            }
        }

        if (data.length === 0) {
            messageText.textContent = 'Adicione pelo menos um item antes de calcular.';
            messageContainer.classList.remove('hidden'); // Exibir mensagem de erro
            spinner.classList.add('hidden');
            return; // Interromper a função se não houver itens
        }
    
        const body = {
            products: data
        };
    
        console.log("Dados enviados:", body);

        // Enviar dados para o endpoint
        try {
            const response = await fetch('/calcular', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            const result = await response.json();
            console.log(result);

            // Verificar se a API retornou um array vazio ou ingredientes não encontrados
            if (result.ingredients.length === 0) {
                messageText.textContent = 'Nenhum ingrediente encontrado para os itens informados.';
                messageContainer.classList.remove('hidden');
            } else {
                exibirResultados(result);
            }
        } catch (error) {
            console.error('Error:', error);
            messageText.textContent = 'Ocorreu um erro ao tentar calcular. Tente novamente.';
            messageContainer.classList.remove('hidden');
        } finally {
            spinner.classList.add('hidden');
            resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Função para exibir os resultados na página
    const exibirResultados = (result) => {
        const resultContainer = document.getElementById('resultContainer');
        resultContainer.innerHTML = ''; // Limpar resultados anteriores
    
        // Criar tabela para os produtos
        const produtosTable = document.createElement('table');
        produtosTable.innerHTML = `
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Peso (g)</th>
                    <th>Calorias (kcal)</th>
                    <th>Carboidratos (g)</th>
                    <th>Proteína (g)</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;
        const tbody = produtosTable.querySelector('tbody');
        
        result.ingredients.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.weight}</td>
                <td>${product.nutrients.energy}</td>
                <td>${product.nutrients.carbohydrate}</td>
                <td>${product.nutrients.protein}</td>
            `;
            tbody.appendChild(row);
        });
        resultContainer.appendChild(produtosTable);
    
        // Criar div para os totais de nutrientes
        const totalNutrientsDiv = document.createElement('div');
        totalNutrientsDiv.innerHTML = `
            <h2>Nutrientes totais</h2>
            <p>Calorias: ${result.totalNutrients.energy} kcal</p>
            <p>Carboidrato: ${result.totalNutrients.carbohydrate} g</p>
            <p>Proteína: ${result.totalNutrients.protein} g</p>
        `;
        resultContainer.appendChild(totalNutrientsDiv);
    };

    document.getElementById('closeMessage').addEventListener('click', () => {
        document.getElementById('messageContainer').classList.add('hidden');
    });

    // Adicionar event listeners
    document.getElementById('adicionar').addEventListener('click', adicionarItem);
    document.getElementById('calcular').addEventListener('click', calcular);
    addTooltipEvents();
});
