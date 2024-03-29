import fs from 'fs'
import __dirname from '../../utils.js';

export class localProductManager {
    constructor() {
        this.products = [];
        this.idCounter = 0;
        this.PATH = `${__dirname}/dataBase/products.json`;


    }

    async handleData() {

        try {
            let data = await fs.promises.readFile(this.PATH, 'utf-8');

            if (data) {
                this.products = JSON.parse(data);
                const lastProductId = this.products.reduce((maxId, product) => Math.max(maxId, product.id), 0);
                this.idCounter = lastProductId;
            }
        } catch (error) {
            if (error.code === 'ENOENT') {

                await fs.promises.writeFile(this.PATH, JSON.stringify(''), null, 2);
                this.products = [];
                return this.products;

            } else {

                throw new Error ("Error al cargar los datos")
            }
        }
    }

    async saveData() {
        try {
            await fs.promises.writeFile(this.PATH, JSON.stringify(this.products), null, 2);
        } catch (error) {
            throw new Error("Error al guardar los datos")
        }
    }

    async addProduct(productData) {
        await this.handleData();

        if (!this.products.some(product => product.code === productData.code)) {
            const newProduct = {
                id: this.idCounter + 1,
                title: productData.title,
                description: productData.description,
                price: productData.price,
                thumbnail: productData.thumbnail,
                code: productData.code,
                stock: productData.stock,
            };
            this.products.push(newProduct);
            this.idCounter++;
            await this.saveData();
        } else {
            throw new Error("Error a agregar el producto")
        }
    }

    async getProducts() {
        try {
            await this.handleData();
            return this.products;
        } catch (error) {
            throw new Error("producto no encontrado");
        }
    }

    async getProductById(id) {
        await this.handleData();
        const product = this.products.find(product => product.id == id);
        if (product) {
            return product;
        } else {
              throw new Error ("El producto no existe");
        }
    }

    async updateProduct(id, newProductData) {
        await this.handleData();

        const product = this.products.find(product => product.id == id);
        if (product) {
            if (newProductData.hasOwnProperty('id')) {
                throw new Error("No se permite modificar el ID del producto.");
            }


            const updatedProduct = {
                ...product,
                ...newProductData
            };
            const index = this.products.indexOf(product);
            this.products[index] = updatedProduct;
            this.saveData();
            return true
        } else {
            return false
        }
    }

    async deleteProduct(id) {
        await this.handleData();
        const productIndex = this.products.findIndex(product => product.id == id);
        if (productIndex === -1) {
            return null;
        }

        const deletedProduct = this.products.splice(productIndex, 1)[0];
        await this.saveData();

        return deletedProduct;
    }
}


