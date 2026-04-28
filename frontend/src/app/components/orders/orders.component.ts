import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/models';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header">
      <div class="container">
        <span class="section-label">Account</span>
        <h1 class="section-title">My Orders</h1>
        <div class="divider"></div>
      </div>
    </div>
    <div class="page-content">
      <div class="container">
        <div *ngIf="loading" class="loading-msg">Loading orders…</div>
        <div *ngIf="!loading && orders.length === 0" class="empty">
          <p>No orders yet. Orders placed via WhatsApp will appear here once confirmed.</p>
          <a routerLink="/products" class="btn-outline">Browse Collections</a>
        </div>
        <div *ngFor="let o of orders" class="order-card">
          <div class="order-head">
            <div>
              <span class="order-id">Order #{{ o.id }}</span>
              <span class="order-date">{{ o.createdAt | date:'d MMMM yyyy' }}</span>
            </div>
            <span class="status-pill status-{{ o.status.toLowerCase() }}">{{ o.status }}</span>
          </div>
          <div class="order-items">
            <div *ngFor="let item of o.items" class="order-item">
              <span class="item-name">{{ item.product.name }}</span>
              <span class="item-qty">× {{ item.quantity }}</span>
              <span class="item-price">{{ item.subtotal | number:'1.2-2' }} ALL</span>
            </div>
          </div>
          <div class="order-foot">
            <span class="shipping-addr">📍 {{ o.shippingAddress }}</span>
            <span class="order-total">{{ o.totalAmount | number:'1.2-2' }} ALL</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header { background: #f2ede6; padding: 48px 0 36px; text-align: center; border-bottom: 1px solid var(--border); }
    .page-content { padding: 48px 0 80px; max-width: 800px; margin: 0 auto; }
    .loading-msg { text-align: center; padding: 60px; color: var(--text-light); }
    .empty { text-align: center; padding: 60px; }
    .empty p { color: var(--text-light); margin-bottom: 24px; }
    .order-card { background: #fff; border: 1px solid var(--border); padding: 24px; margin-bottom: 16px; }
    .order-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .order-id { font-family: 'Cormorant Garamond', serif; font-size: 18px; margin-right: 14px; }
    .order-date { font-size: 12px; color: var(--text-light); letter-spacing: 0.04em; }
    .status-pill { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; padding: 4px 12px; font-weight: 500; }
    .status-pending    { background: #fdf3e3; color: #b7770d; }
    .status-processing { background: #e8f0fe; color: #1a56a0; }
    .status-shipped    { background: #f0e8fe; color: #6b21a8; }
    .status-delivered  { background: #e8f5e9; color: #2e7d32; }
    .status-cancelled  { background: #feecec; color: #b91c1c; }
    .order-items { border-top: 1px solid var(--border); padding-top: 12px; margin-bottom: 12px; }
    .order-item { display: flex; align-items: center; gap: 12px; padding: 6px 0; font-size: 14px; }
    .item-name { flex: 1; color: var(--text-dark); font-family: 'Cormorant Garamond', serif; font-size: 16px; }
    .item-qty { color: var(--text-light); font-size: 13px; }
    .item-price { font-weight: 500; color: var(--accent); }
    .order-foot { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 12px; }
    .shipping-addr { font-size: 12px; color: var(--text-light); }
    .order-total { font-size: 18px; font-weight: 500; color: var(--text-dark); font-family: 'Cormorant Garamond', serif; }
  `]
})
export class OrdersComponent implements OnInit {
  orders: Order[] = []; loading = true;
  constructor(private orderService: OrderService) {}
  ngOnInit(): void {
    this.orderService.getMyOrders().subscribe({
      next: o => { this.orders = o; this.loading = false; },
      error: () => this.loading = false
    });
  }
}
