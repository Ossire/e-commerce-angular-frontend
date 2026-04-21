import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product, Category } from '../models/model';
import { catchError, finalize, map, Observable } from 'rxjs';
import { StateService } from './state-service';
import { ErrorService } from './error-service';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  cartCount = 0;

  cartItems: Product[] = [];

  cartItemsId: number[] = [];

  envFile = environment;
  constructor(
    private http: HttpClient,
    private stateService: StateService,
    private errorHandler: ErrorService,
  ) {}

  createProduct(product: Product): Observable<Product> {
    return this.http
      .post<Product>(`${this.envFile.apiUrl}/products`, product)
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }

  getAllProducts() {
    this.stateService.setLoading(true);
    this.http
      .get<Product[]>(`${this.envFile.apiUrl}/products`)
      .pipe(
        catchError((error) => this.errorHandler.handleError(error)),
        finalize(() => this.stateService.setLoading(false)),
      )
      .subscribe({
        next: (data) => this.stateService.setProducts(data),
        error: (err) => {
          this.stateService.setError(err.message);
        },
      });
  }

  getProductById(id: string) {
    this.stateService.setLoading(true);
    this.http
      .get<Product>(`${this.envFile.apiUrl}/products/${id}`)
      .pipe(
        catchError((error) => this.errorHandler.handleError(error)),
        finalize(() => this.stateService.setLoading(false)),
      )
      .subscribe({
        next: (data) => {
          this.stateService.setProduct(data);
        },
        error: (err) => {
          this.stateService.setError(err.message);
        },
      });
  }

  reloadProducts() {
    this.getAllProducts();
  }

  reloadProduct(id: string) {
    this.getProductById(id);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.envFile.categoryUrl);
  }
}
