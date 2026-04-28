import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div *ngIf="loading" class="loading">Loading...</div>
    <div *ngIf="product" class="detail">
      <a routerLink="/products" class="back">← Back to Products</a>
      <div class="detail-layout">
        <div class="detail-img">
          <img *ngIf="product.imageUrl" [src]="product.imageUrl" [alt]="product.name">
          <div *ngIf="!product.imageUrl" class="img-placeholder">📦</div>
        </div>
        <div class="detail-info">
          <div class="category-tag">{{ product.category?.name }}</div>
          <h1 class="product-title">{{ product.name }}</h1>
          <div class="product-price">\${{ product.price | number:'1.2-2' }}</div>
          <p class="product-desc">{{ product.description }}</p>
          <div class="stock" [class.low]="product.stockQuantity < 5" [class.out]="product.stockQuantity === 0">
            {{ product.stockQuantity > 0 ? '✓ In Stock (' + product.stockQuantity + ' available)' : '✗ Out of Stock' }}
          </div>
          <div class="qty-row" *ngIf="product.stockQuantity > 0 && auth.isLoggedIn()">
            <label>Quantity:</label>
            <div class="qty-control">
              <button (click)="qty > 1 ? qty = qty - 1 : null">−</button>
              <span>{{ qty }}</span>
              <button (click)="qty < product.stockQuantity ? qty = qty + 1 : null">+</button>
            </div>
          </div>
          <div class="action-row">
            <button class="btn btn-primary" *ngIf="auth.isLoggedIn()"
                    [disabled]="product.stockQuantity === 0 || added"
                    (click)="addToCart()">
              {{ added ? '✓ Added to Cart!' : 'Add to Cart' }}
            </button>
            <a routerLink="/login" class="btn btn-primary" *ngIf="!auth.isLoggedIn()">Login to Buy</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loading { padding: 40px; text-align: center; color: #666; }
    .back { color: #1a1a2e; text-decoration: none; font-size: 14px; display: inline-block; margin-bottom: 24px; }
    .back:hover { text-decoration: underline; }
    .detail-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
    @media (max-width: 700px) { .detail-layout { grid-template-columns: 1fr; } }
    .detail-img { border-radius: 12px; overflow: hidden; background: #f5f5f5; aspect-ratio: 1; }
    .detail-img img { width: 100%; height: 100%; object-fit: cover; }
    .img-placeholder { height: 100%; display: flex; align-items: center; justify-content: center; font-size: 80px; }
    .category-tag { font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
    .product-title { font-size: 32px; font-weight: 700; color: #1a1a2e; margin-bottom: 16px; }
    .product-price { font-size: 28px; font-weight: 700; color: #1a1a2e; margin-bottom: 16px; }
    .product-desc { color: #555; line-height: 1.7; margin-bottom: 20px; }
    .stock { font-size: 14px; color: #4caf50; margin-bottom: 20px; }
    .stock.low { color: #ff9800; }
    .stock.out { color: #f44336; }
    .qty-row { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
    .qty-row label { font-size: 14px; color: #555; }
    .qty-control { display: flex; align-items: center; gap: 12px; border: 1px solid #ddd; border-radius: 8px; padding: 4px 8px; }
    .qty-control button { background: none; border: none; font-size: 18px; cursor: pointer; padding: 0 4px; }
    .qty-control span { min-width: 24px; text-align: center; font-weight: 600; }
    .btn { padding: 14px 28px; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; border: none; text-decoration: none; }
    .btn-primary { background: #1a1a2e; color: white; width: 100%; display: block; text-align: center; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class ProductDetailComponent implements OnInit {
  product?: Product;
  loading = true;
  qty = 1;
  added = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProduct(id).subscribe({
      next: p => { this.product = p; this.loading = false; },
      error: () => this.loading = false
    });
  }

  addToCart(): void {
    if (!this.product) return;
    this.cartService.addItem(this.product.id, this.qty).subscribe(() => {
      this.added = true;
      setTimeout(() => this.added = false, 2000);
    });
  }
}
