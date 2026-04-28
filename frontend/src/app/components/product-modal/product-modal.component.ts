import { Component, Input, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/models';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="modal-overlay" (click)="onOverlayClick($event)">
      <div class="modal" role="dialog">
        <button class="modal-close" (click)="close.emit()">✕</button>

        <div class="modal-grid">
          <!-- Image gallery -->
          <div class="gallery">
            <div class="gallery-main">
              <img *ngIf="activeImage" [src]="activeImage" [alt]="product.name">
              <div *ngIf="!activeImage" class="gallery-placeholder">
                <span>{{ product.name }}</span>
              </div>
            </div>
            <div class="gallery-thumbs" *ngIf="allImages.length > 1">
              <div *ngFor="let img of allImages"
                   class="thumb"
                   [class.active]="img === activeImage"
                   (click)="activeImage = img">
                <img [src]="img" [alt]="product.name">
              </div>
            </div>
          </div>

          <!-- Info -->
          <div class="modal-info">
            <div class="modal-cat">{{ product.category?.name }}</div>
            <h2 class="modal-name">{{ product.name }}</h2>
            <div class="modal-price">€{{ product.price | number:'1.2-2' }}</div>

            <div class="modal-divider"></div>

            <p class="modal-desc" *ngIf="product.description">{{ product.description }}</p>

            <!-- Dimensions -->
            <div class="spec-row" *ngIf="product.dimensions">
              <span class="spec-label">Dimensions</span>
              <span class="spec-val">{{ product.dimensions }}</span>
            </div>

            <!-- Colour selector -->
            <div class="option-group" *ngIf="colors.length > 0">
              <div class="option-label">Colour
                <span *ngIf="selectedColor" class="selected-val">— {{ selectedColor }}</span>
              </div>
              <div class="color-chips">
                <button *ngFor="let c of colors"
                        class="color-chip"
                        [class.selected]="c === selectedColor"
                        (click)="selectedColor = c">{{ c }}</button>
              </div>
            </div>

            <!-- Material selector -->
            <div class="option-group" *ngIf="materials.length > 0">
              <div class="option-label">Material
                <span *ngIf="selectedMaterial" class="selected-val">— {{ selectedMaterial }}</span>
              </div>
              <div class="color-chips">
                <button *ngFor="let m of materials"
                        class="color-chip"
                        [class.selected]="m === selectedMaterial"
                        (click)="selectedMaterial = m">{{ m }}</button>
              </div>
            </div>

            <!-- Quantity -->
            <div class="option-group">
              <div class="option-label">Quantity</div>
              <div class="qty-row">
                <button class="qty-btn" (click)="qty > 1 ? qty = qty - 1 : null">−</button>
                <span class="qty-val">{{ qty }}</span>
                <button class="qty-btn" (click)="qty < product.stockQuantity ? qty = qty + 1 : null">+</button>
                <span class="stock-note" *ngIf="product.stockQuantity > 0">
                  {{ product.stockQuantity }} available
                </span>
                <span class="stock-note out" *ngIf="product.stockQuantity === 0">Out of stock</span>
              </div>
            </div>

            <!-- Actions -->
            <ng-container *ngIf="auth.isLoggedIn(); else loginPrompt">
              <button class="btn-add-cart"
                      [disabled]="product.stockQuantity === 0 || adding"
                      (click)="addToCart()">
                <svg *ngIf="!added" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                <svg *ngIf="added" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {{ added ? 'Added to Cart!' : adding ? 'Adding…' : 'Add to Cart' }}
              </button>
              <p class="cart-note">
                Go to your <a routerLink="/cart" (click)="close.emit()">cart</a> to review and place order via WhatsApp.
              </p>
            </ng-container>

            <ng-template #loginPrompt>
              <a routerLink="/login" class="btn-add-cart login-prompt" (click)="close.emit()">
                Login to Add to Cart
              </a>
            </ng-template>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.58);
      z-index: 1000;
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
      animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .modal {
      background: #fff; max-width: 960px; width: 100%;
      max-height: 92vh; overflow-y: auto;
      position: relative;
      animation: slideUp 0.25s ease;
    }
    @keyframes slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    .modal-close { position: absolute; top: 14px; right: 18px; background: none; border: none; font-size: 20px; cursor: pointer; color: #999; z-index: 10; }
    .modal-close:hover { color: #333; }

    .modal-grid { display: grid; grid-template-columns: 1fr 1fr; }
    @media (max-width: 700px) { .modal-grid { grid-template-columns: 1fr; } }

    /* Gallery */
    .gallery { background: #f5f1ec; }
    .gallery-main { aspect-ratio: 1; overflow: hidden; display: flex; align-items: center; justify-content: center; }
    .gallery-main img { width: 100%; height: 100%; object-fit: cover; }
    .gallery-placeholder { width: 100%; height: 100%; min-height: 300px; display: flex; align-items: center; justify-content: center; color: #a89880; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; }
    .gallery-thumbs { display: flex; gap: 8px; padding: 12px; flex-wrap: wrap; }
    .thumb { width: 64px; height: 64px; overflow: hidden; cursor: pointer; border: 2px solid transparent; }
    .thumb.active { border-color: var(--accent); }
    .thumb img { width: 100%; height: 100%; object-fit: cover; }

    /* Info */
    .modal-info { padding: 36px 36px 32px; display: flex; flex-direction: column; }
    .modal-cat { font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: #999; margin-bottom: 8px; }
    .modal-name { font-family: 'Cormorant Garamond', serif; font-size: 30px; font-weight: 400; color: #1c1c1c; margin-bottom: 10px; }
    .modal-price { font-size: 22px; font-weight: 500; color: var(--accent); margin-bottom: 20px; }
    .modal-divider { height: 1px; background: #e5e0d8; margin-bottom: 18px; }
    .modal-desc { font-size: 14px; color: #666; line-height: 1.75; margin-bottom: 18px; font-weight: 300; }

    .spec-row { display: flex; gap: 12px; margin-bottom: 14px; }
    .spec-label { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #999; min-width: 90px; padding-top: 1px; }
    .spec-val { font-size: 13px; color: #444; }

    .option-group { margin-bottom: 18px; }
    .option-label { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #666; margin-bottom: 10px; font-weight: 500; }
    .selected-val { font-weight: 400; color: var(--accent); text-transform: none; letter-spacing: 0; }

    .color-chips { display: flex; flex-wrap: wrap; gap: 8px; }
    .color-chip { padding: 6px 14px; border: 1px solid #ddd; background: #fff; font-size: 12px; cursor: pointer; color: #444; transition: all 0.15s; }
    .color-chip:hover { border-color: var(--accent); color: var(--accent); }
    .color-chip.selected { border-color: var(--accent); background: var(--accent); color: #fff; }

    /* Qty */
    .qty-row { display: flex; align-items: center; gap: 12px; }
    .qty-btn { width: 32px; height: 32px; border: 1px solid var(--border); background: #fff; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-mid); transition: all 0.15s; }
    .qty-btn:hover { border-color: var(--accent); color: var(--accent); }
    .qty-val { font-size: 16px; min-width: 28px; text-align: center; font-weight: 500; }
    .stock-note { font-size: 12px; color: var(--text-light); margin-left: 4px; }
    .stock-note.out { color: var(--accent); }

    /* Add to cart */
    .btn-add-cart {
      display: flex; align-items: center; justify-content: center; gap: 10px;
      width: 100%; padding: 14px;
      background: var(--accent); color: #fff;
      border: none; cursor: pointer;
      font-family: 'Jost', sans-serif;
      font-size: 13px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
      transition: background 0.2s; margin-top: 8px; text-decoration: none;
    }
    .btn-add-cart:hover:not(:disabled) { background: var(--accent-hover); }
    .btn-add-cart:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-add-cart.login-prompt { background: #888; }
    .btn-add-cart.login-prompt:hover { background: #666; }

    .cart-note { font-size: 12px; color: var(--text-light); text-align: center; margin-top: 10px; }
    .cart-note a { color: var(--accent); text-decoration: underline; }
  `]
})
export class ProductModalComponent implements OnInit {
  @Input() product!: Product;
  @Output() close = new EventEmitter<void>();

  activeImage = '';
  allImages: string[] = [];
  colors: string[] = [];
  materials: string[] = [];
  selectedColor = '';
  selectedMaterial = '';
  qty = 1;
  adding = false;
  added = false;

  constructor(public auth: AuthService, private cartService: CartService) {}

  ngOnInit(): void {
    this.allImages = [];
    if (this.product.imageUrl) this.allImages.push(this.product.imageUrl);
    if (this.product.additionalImages) {
      this.product.additionalImages.split(',').map(s => s.trim()).filter(Boolean)
          .forEach(u => this.allImages.push(u));
    }
    this.activeImage = this.allImages[0] || '';

    this.colors = this.product.availableColors
        ? this.product.availableColors.split(',').map(s => s.trim()).filter(Boolean) : [];
    this.materials = this.product.availableMaterials
        ? this.product.availableMaterials.split(',').map(s => s.trim()).filter(Boolean) : [];
  }

  @HostListener('document:keydown.escape')
  onEsc() { this.close.emit(); }

  onOverlayClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) this.close.emit();
  }

  addToCart(): void {
    if (this.adding || this.added) return;
    this.adding = true;
    this.cartService.addItem(this.product.id, this.qty).subscribe({
      next: () => {
        this.adding = false;
        this.added = true;
        setTimeout(() => this.added = false, 2500);
      },
      error: () => { this.adding = false; }
    });
  }
}