document.addEventListener('DOMContentLoaded', () => {
    let itemCount = 1;
    const spinner = document.getElementById('loadingSpinner');

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
            <button type="button" class="remover"></button>
        `;
        formContainer.appendChild(newItem);

        const removeButton = newItem.querySelector('.remover');
        removeButton.addEventListener('click', () => {
            newItem.remove(); // Remove o item atual
        });
       
    };


    const calcular = async () => {
        const formData = new FormData(document.getElementById('produtosForm'));
        const data = [];

        spinner.classList.remove('hidden');
        messageContainer.classList.add('hidden');

        // Iterar sobre os campos do formulário
        for (let i = 1; i <= itemCount; i++) {
            const nome = formData.get(`nome-${i}`);
            const peso = formData.get(`peso-${i}`);
            if (nome && peso) {
                data.push({ name: nome, weight: parseFloat(peso) });
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
    
        console.log("Dados enviados:", body);        // Enviar dados para o endpoint
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
            exibirResultados(result);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            spinner.classList.add('hidden');
        }
    };

    document.getElementById('closeMessage').addEventListener('click', () => {
        document.getElementById('messageContainer').classList.add('hidden');
    });

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
                    <th>Proteina (g)</th>
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
            <p>Proteina: ${result.totalNutrients.protein} g</p>
        `;
        resultContainer.appendChild(totalNutrientsDiv);
    };
    
    // Adicionar event listeners
    document.getElementById('adicionar').addEventListener('click', adicionarItem);
    document.getElementById('calcular').addEventListener('click', calcular);
});
