export class LocalStorageService {
    get(itemName) {
        return localStorage.getItem(itemName);
    }

    set(itemName, item) {
        localStorage.setItem(itemName, item);
    }

    delete(item) {
        localStorage.removeItem(item);
    }
}