import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class CookreyVendorService {
    public API_URL = 'https://cookrey.com/';
    public API_URL2 = 'http://laravel.test/';

    constructor(private http: HttpClient) {
    }

    getCookreyVendors() {
        return this.http.get<any>(this.API_URL + 'getVendors');
    }

    getProductByVendor(param) {
        return this.http.get<any>(this.API_URL + 'getVendorById/' + param);
    }

    getProductByVendorId(param) {
        return this.http.get<any>(this.API_URL + 'getProductById/' + param);
    }

    getProductByProductId(param) {
        return this.http.get<any>(this.API_URL + 'getSingleProductById/' + param);
    }
}
