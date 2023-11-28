import axios from "axios";
import { API_URL } from "../const";
import { AccessKeyService } from "./StorageService";

export class ApiService {
    #apiURL = API_URL;

    constructor() {
        this.accessKeyService = new AccessKeyService('accessKey');
        this.accessKey = this.accessKeyService.get('accessKey');
    }

    async getAccessKey() {
        try {
            if (!this.accessKey) {
                const response = await axios.get(`${this.#apiURL}api/users/accessKey`);
                this.accessKey = response.data.accessKey;
                this.accessKeyService.set(this.accessKey);
            }
        } catch (error) {
            console.log('error: ', error);
        }
    }

    async getData(url, params = {}) {
        if (!this.accessKey) {
            await this.getAccessKey();
        }
        try {
            const response = await axios.get(`${this.#apiURL}${url}`, {
                headers: {
                    'Authorization': `Bearer ${this.accessKey}`
                },
                params
            });

            return response.data

        } catch (error) {
            if (error.response && error.response.status === 401) {
                this.accessKey = null;
                this.accessKeyService.delete();

                return this.getData(url, params);
            } else {
                console.log(error);
            }
        }
    }

    async getProducts(page = 1, limit = 12, list, category, q) {
        return await this.getData('api/products', {
            page,
            limit,
            list,
            category,
            q
        })
    }

    async getProductCategories() {
        return await this.getData('api/productCategories');
    }

    async getProductById(id) {
        return await this.getData(`api/products/${id}`);
    }
}