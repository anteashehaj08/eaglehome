import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-header">
      <div class="container">
        <span class="section-label">Your Selection</span>
        <h1 class="section-title">Shopping Cart</h1>
        <div class="divider"></div>
      </div>
    </div>

    <div class="page-content">
      <div class="container">
        <div *ngIf="loading" class="loading-msg">Loading cart…</div>

        <ng-container *ngIf="!loading">
          <div *ngIf="cart && cart.items.length > 0; else emptyCart">
            <div class="cart-layout">

              <!-- Items -->
              <div class="cart-items">
                <div *ngFor="let item of cart.items" class="cart-row">
                  <div class="cart-img">
                    <img *ngIf="item.product.imageUrl" [src]="item.product.imageUrl" [alt]="item.product.name">
                    <div *ngIf="!item.product.imageUrl" class="img-ph">{{ item.product.name[0] }}</div>
                  </div>
                  <div class="cart-info">
                    <div class="cart-cat">{{ item.product.category?.name }}</div>
                    <div class="cart-name">{{ item.product.name }}</div>
                    <div class="cart-unit">€{{ item.product.price | number:'1.2-2' }} per item</div>
                  </div>
                  <div class="qty-ctl">
                    <button (click)="update(item.id, item.quantity - 1)">−</button>
                    <span>{{ item.quantity }}</span>
                    <button (click)="update(item.id, item.quantity + 1)">+</button>
                  </div>
                  <div class="cart-sub">€{{ item.subtotal | number:'1.2-2' }}</div>
                  <button class="remove-btn" (click)="remove(item.id)" title="Remove">✕</button>
                </div>

                <!-- Per-item preferences -->
                <div class="prefs-section">
                  <h3 class="prefs-title">Order Preferences <span class="optional">optional</span></h3>
                  <p class="prefs-hint">Add any notes per item — colour, material, size, delivery info, etc.</p>

                  <div *ngFor="let item of cart.items" class="pref-row">
                    <label class="pref-label">{{ item.product.name }}</label>
                    <textarea
                      [(ngModel)]="itemPrefs[item.id]"
                      rows="2"
                      class="pref-input"
                      placeholder="e.g. Colour: Oak, Material: Fabric, Custom size…">
                    </textarea>
                  </div>

                  <div class="pref-row">
                    <label class="pref-label">General Notes</label>
                    <textarea
                      [(ngModel)]="generalNote"
                      rows="2"
                      class="pref-input"
                      placeholder="Delivery address, preferred date, any other requests…">
                    </textarea>
                  </div>
                </div>
              </div>

              <!-- Summary + WhatsApp CTA -->
              <div class="cart-summary">
                <h3 class="summary-title">Order Summary</h3>

                <div class="summary-items">
                  <div *ngFor="let item of cart.items" class="summary-item">
                    <span class="si-name">{{ item.product.name }}</span>
                    <span class="si-qty">× {{ item.quantity }}</span>
                    <span class="si-price">€{{ item.subtotal | number:'1.2-2' }}</span>
                  </div>
                </div>

                <div class="summary-total">
                  <span>Total</span>
                  <span>€{{ cart.total | number:'1.2-2' }}</span>
                </div>

                <div class="wa-info">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="color:#25d366;flex-shrink:0">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  </svg>
                  <span>Your cart will be sent to our team on WhatsApp. We'll confirm availability and arrange delivery.</span>
                </div>

                <button class="btn-whatsapp" (click)="sendToWhatsApp()">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  </svg>
                  Place Order via WhatsApp
                </button>

                <div class="divider-line"></div>

                <a routerLink="/products" class="btn-continue">← Continue Shopping</a>
                <button class="btn-clear" (click)="clear()">Clear Cart</button>
              </div>
            </div>
          </div>

          <ng-template #emptyCart>
            <div class="empty-cart">
              <div class="empty-icon">🛒</div>
              <h2>Your cart is empty</h2>
              <p>Explore our collections and find something you love.</p>
              <a routerLink="/products" class="btn-primary">Browse Collections</a>
            </div>
          </ng-template>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .page-header { background: #f2ede6; padding: 48px 0 36px; text-align: center; border-bottom: 1px solid var(--border); }
    .page-content { padding: 48px 0 80px; }
    .loading-msg { text-align: center; padding: 60px; color: var(--text-light); }

    .cart-layout { display: grid; grid-template-columns: 1fr 340px; gap: 40px; align-items: start; }
    @media (max-width: 960px) { .cart-layout { grid-template-columns: 1fr; } }

    /* Cart rows */
    .cart-row { display: flex; align-items: center; gap: 20px; padding: 20px 0; border-bottom: 1px solid var(--border); }
    .cart-img { width: 80px; height: 80px; flex-shrink: 0; overflow: hidden; background: #f0ede8; }
    .cart-img img { width: 100%; height: 100%; object-fit: cover; }
    .img-ph { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-family: 'Cormorant Garamond', serif; font-size: 28px; color: #b0a898; }
    .cart-info { flex: 1; }
    .cart-cat { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-light); margin-bottom: 4px; }
    .cart-name { font-family: 'Cormorant Garamond', serif; font-size: 18px; color: var(--text-dark); margin-bottom: 4px; }
    .cart-unit { font-size: 12px; color: var(--text-light); }
    .qty-ctl { display: flex; align-items: center; gap: 12px; border: 1px solid var(--border); padding: 6px 12px; }
    .qty-ctl button { background: none; border: none; font-size: 18px; cursor: pointer; color: var(--text-mid); line-height: 1; }
    .qty-ctl button:hover { color: var(--accent); }
    .qty-ctl span { font-size: 14px; min-width: 20px; text-align: center; }
    .cart-sub { font-size: 16px; font-weight: 500; color: var(--accent); min-width: 80px; text-align: right; }
    .remove-btn { background: none; border: none; color: #ccc; cursor: pointer; font-size: 14px; }
    .remove-btn:hover { color: var(--accent); }

    /* Preferences */
    .prefs-section { margin-top: 36px; padding-top: 28px; border-top: 1px solid var(--border); }
    .prefs-title { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 400; margin-bottom: 6px; }
    .optional { font-family: 'Jost', sans-serif; font-size: 11px; color: var(--text-light); letter-spacing: 0.08em; text-transform: uppercase; margin-left: 8px; }
    .prefs-hint { font-size: 13px; color: var(--text-light); margin-bottom: 20px; }
    .pref-row { margin-bottom: 16px; }
    .pref-label { display: block; font-size: 12px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-mid); margin-bottom: 6px; }
    .pref-input { width: 100%; padding: 10px 12px; border: 1px solid var(--border); background: #faf9f7; font-size: 13px; color: var(--text-dark); outline: none; resize: vertical; font-family: 'Jost', sans-serif; font-weight: 300; transition: border-color 0.2s; }
    .pref-input:focus { border-color: var(--accent); }

    /* Summary */
    .cart-summary { background: #fff; border: 1px solid var(--border); padding: 28px; position: sticky; top: 120px; }
    .summary-title { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 400; margin-bottom: 20px; }
    .summary-items { margin-bottom: 16px; }
    .summary-item { display: flex; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 1px solid #f5f0eb; font-size: 13px; }
    .si-name { flex: 1; color: var(--text-dark); }
    .si-qty { color: var(--text-light); white-space: nowrap; }
    .si-price { font-weight: 500; color: var(--accent); white-space: nowrap; }
    .summary-total { display: flex; justify-content: space-between; font-size: 20px; font-weight: 500; color: var(--text-dark); border-top: 2px solid var(--border); padding-top: 16px; margin: 16px 0 20px; font-family: 'Cormorant Garamond', serif; }

    .wa-info { display: flex; align-items: flex-start; gap: 10px; font-size: 12px; color: var(--text-light); background: #f0faf4; border: 1px solid #c8ecd4; padding: 12px; margin-bottom: 16px; line-height: 1.5; }

    .btn-whatsapp {
      display: flex; align-items: center; justify-content: center; gap: 10px;
      width: 100%; padding: 15px;
      background: #25d366; color: #fff;
      border: none; cursor: pointer;
      font-family: 'Jost', sans-serif;
      font-size: 13px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
      transition: background 0.2s;
    }
    .btn-whatsapp:hover { background: #1ebe5d; }

    .divider-line { height: 1px; background: var(--border); margin: 16px 0; }

    .btn-continue { display: block; text-align: center; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-mid); padding: 8px; transition: color 0.2s; }
    .btn-continue:hover { color: var(--accent); }
    .btn-clear { width: 100%; padding: 10px; background: none; border: 1px solid var(--border); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; color: var(--text-light); margin-top: 8px; transition: all 0.2s; font-family: 'Jost', sans-serif; }
    .btn-clear:hover { border-color: var(--accent); color: var(--accent); }

    /* Empty */
    .empty-cart { text-align: center; padding: 80px 20px; }
    .empty-icon { font-size: 56px; margin-bottom: 20px; }
    .empty-cart h2 { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 400; margin-bottom: 10px; }
    .empty-cart p { color: var(--text-light); margin-bottom: 28px; font-size: 14px; }
  `]
})
export class CartComponent implements OnInit {
  cart?: Cart;
  loading = true;
  itemPrefs: { [itemId: number]: string } = {};
  generalNote = '';

  // ← Replace with your actual WhatsApp number (no + or spaces)
  private waNumber = '355686034177m ins';

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.loadCart().subscribe({
      next: c => { this.cart = c; this.loading = false; },
      error: () => this.loading = false
    });
    this.cartService.cart$.subscribe(c => { if (c) this.cart = c; });
  }

  update(id: number, qty: number): void {
    this.cartService.updateItem(id, qty).subscribe();
  }

  remove(id: number): void {
    this.cartService.removeItem(id).subscribe();
  }

  clear(): void {
    if (confirm('Clear all items from your cart?')) {
      this.cartService.clearCart().subscribe(() => {
        this.cart = undefined;
        this.itemPrefs = {};
        this.generalNote = '';
      });
    }
  }

  sendToWhatsApp(): void {
    if (!this.cart || this.cart.items.length === 0) return;

    const lines: string[] = [
      'Hello! I would like to place the following order:',
      '',
      '*🛒 ORDER FROM EAGLEFIER*',
      '─────────────────────',
    ];

    this.cart.items.forEach(item => {
      lines.push(`*${item.product.name}*`);
      lines.push(`  Qty: ${item.quantity}  |  €${item.subtotal.toFixed(2)}`);
      if (item.product.category?.name) {
        lines.push(`  Category: ${item.product.category.name}`);
      }
      const pref = this.itemPrefs[item.id]?.trim();
      if (pref) {
        lines.push(`  Preferences: ${pref}`);
      }
      lines.push('');
    });

    lines.push('─────────────────────');
    lines.push(`*TOTAL: €${this.cart.total.toFixed(2)}*`);

    if (this.generalNote.trim()) {
      lines.push('');
      lines.push(`*Notes:* ${this.generalNote.trim()}`);
    }

    lines.push('');
    lines.push('Please confirm availability and delivery details. Thank you!');

    const message = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/${this.waNumber}?text=${message}`, '_blank');
  }
}