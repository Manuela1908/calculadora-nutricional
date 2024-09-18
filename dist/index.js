"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
const token = process.env.TOKEN;
const getNutrientValueById = (nutrients, nutrientId) => {
    const nutrient = nutrients.find(n => n.nutrientId === nutrientId);
    return nutrient ? nutrient.value : null;
};
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/view/index.html'));
});
app.post('/calcular', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { products } = req.body; // Assume que products é um array de objetos com nome e peso
    const results = [];
    // Função para somar os valores nutricionais
    const sumNutrients = (total, nutrients, weight) => {
        const weightFactor = weight / 100;
        total.energy += (getNutrientValueById(nutrients, 1008) || 0) * weightFactor;
        total.carbohydrate += (getNutrientValueById(nutrients, 1005) || 0) * weightFactor;
        total.protein += (getNutrientValueById(nutrients, 1003) || 0) * weightFactor;
        return total;
    };
    // Inicializar totalizador de nutrientes
    const totalNutrients = {
        energy: 0,
        carbohydrate: 0,
        protein: 0
    };
    // Iterar sobre cada ingrediente e fazer a requisição
    for (const product of products) {
        const { name, weight, type } = product; // Assume que product tem as propriedades name e weight
        const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${token}&query=${name}`;
        const config = {
            params: {
                dataType: type,
                pageSize: 1,
                pageNumber: 1
            }
        };
        try {
            const search = yield axios_1.default.get(url, config);
            const response = search.data.foods[0];
            if (response) {
                const productName = response.description;
                const category = response.foodCategory;
                const nutrients = response.foodNutrients;
                const nutrientValues = sumNutrients(totalNutrients, nutrients, weight);
                // Adicionar ao resultado
                results.push({
                    name: productName,
                    category,
                    weight,
                    nutrients: {
                        energy: ((getNutrientValueById(nutrients, 1008) * (weight / 100))).toFixed(1),
                        carbohydrate: ((getNutrientValueById(nutrients, 1005) * (weight / 100))).toFixed(1),
                        protein: ((getNutrientValueById(nutrients, 1003) * (weight / 100))).toFixed(1)
                    }
                });
            }
        }
        catch (error) {
            console.error(`Error fetching data for product ${name}:`, error);
        }
    }
    // Responder com os resultados e os totais
    res.status(200).json({
        ingredients: results,
        totalNutrients: {
            energy: totalNutrients.energy.toFixed(1),
            carbohydrate: totalNutrients.carbohydrate.toFixed(1),
            protein: totalNutrients.protein.toFixed(1)
        }
    });
}));
app.listen(port, () => {
    console.log(`Servidor rodando na porta http://localhost:${port}`);
});
