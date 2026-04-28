import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product, Category, NAV_GROUPS } from '../../models/models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <div class="container">
        <span class="section-label">Management</span>
        <h1 class="section-title">Admin Panel</h1>
        <div class="divider"></div>
      </div>
    </div>

    <div class="page-content">
      <div class="container">

        <!-- Tabs -->
        <div class="tabs">
          <button [class.active]="tab==='products'"   (click)="tab='products'">Products</button>
          <button [class.active]="tab==='categories'" (click)="tab='categories'">Categories</button>
        </div>

        <!-- ── PRODUCTS ─────────────────────────────── -->
        <div *ngIf="tab==='products'">
          <div class="panel-header">
            <h2 class="panel-title">Products <span class="count">({{ products.length }})</span></h2>
            <button class="btn-primary" (click)="toggleProductForm()">
              {{ showPForm ? 'Cancel' : '+ New Product' }}
            </button>
          </div>

          <!-- Product form -->
          <div class="form-panel" *ngIf="showPForm">
            <h3 class="form-title">{{ editingP ? 'Edit Product' : 'Add New Product' }}</h3>
            <div class="form-grid">
              <div class="field"><label>Product Name *</label>
                <input [(ngModel)]="pf.name" placeholder="e.g. Oslo Corner Sofa"></div>
              <div class="field"><label>Price (ALL) *</label>
                <input type="number" [(ngModel)]="pf.price" placeholder="0.00"></div>
              <div class="field"><label>Stock Quantity</label>
                <input type="number" [(ngModel)]="pf.stockQuantity" placeholder="0"></div>
              <div class="field"><label>Category *</label>
                <select [(ngModel)]="pf.categoryId">
                  <option [ngValue]="null" disabled>Select category…</option>
                  <option *ngFor="let c of categories" [ngValue]="c.id">{{ c.name }}</option>
                </select>
              </div>
              <div class="field full"><label>Main Image URL</label>
                <input [(ngModel)]="pf.imageUrl" placeholder="https://…/image.jpg"></div>
              <div class="field full"><label>Additional Images <span class="hint">comma-separated URLs</span></label>
                <input [(ngModel)]="pf.additionalImages" placeholder="https://…/img2.jpg, https://…/img3.jpg"></div>
              <div class="field"><label>Available Colours <span class="hint">comma-separated</span></label>
                <input [(ngModel)]="pf.availableColors" placeholder="White, Oak, Walnut"></div>
              <div class="field"><label>Available Materials <span class="hint">comma-separated</span></label>
                <input [(ngModel)]="pf.availableMaterials" placeholder="Fabric, Leather, Velvet"></div>
              <div class="field"><label>Dimensions</label>
                <input [(ngModel)]="pf.dimensions" placeholder="W:200cm H:85cm D:95cm"></div>
              <div class="field checkbox-field">
                <label class="check-label">
                  <input type="checkbox" [(ngModel)]="pf.featured"> Mark as Featured
                </label>
              </div>
              <div class="field full"><label>Description</label>
                <textarea [(ngModel)]="pf.description" rows="3" placeholder="Product description…"></textarea>
              </div>
            </div>
            <div class="form-actions">
              <button class="btn-primary" (click)="saveProduct()">{{ editingP ? 'Update Product' : 'Create Product' }}</button>
              <button class="btn-outline" (click)="cancelPForm()">Cancel</button>
            </div>
            <div class="success-msg" *ngIf="pMsg">{{ pMsg }}</div>
            <div class="error-msg"   *ngIf="pErr">{{ pErr }}</div>
          </div>

          <!-- Products table -->
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th><th>Image</th><th>Name</th><th>Category</th>
                  <th>Price</th><th>Stock</th><th>Featured</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of products">
                  <td class="td-id">{{ p.id }}</td>
                  <td><div class="thumb-img"><img *ngIf="p.imageUrl" [src]="p.imageUrl" [alt]="p.name"></div></td>
                  <td><span class="p-name">{{ p.name }}</span></td>
                  <td>{{ p.category?.name }}</td>
                  <td>{{ p.price | number:'1.2-2' }} ALL</td>
                  <td>{{ p.stockQuantity }}</td>
                  <td><span class="pill" [class.yes]="p.featured">{{ p.featured ? 'Yes' : '—' }}</span></td>
                  <td><span class="pill" [class.active]="p.active" [class.inactive]="!p.active">{{ p.active ? 'Active' : 'Hidden' }}</span></td>
                  <td class="td-actions">
                    <button class="act-btn edit" (click)="editProduct(p)">Edit</button>
                    <button class="act-btn del"  (click)="deleteProduct(p.id)">Delete</button>
                  </td>
                </tr>
                <tr *ngIf="products.length === 0">
                  <td colspan="9" class="td-empty">No products yet. Add your first product above.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ── CATEGORIES ─────────────────────────────── -->
        <div *ngIf="tab==='categories'">
          <div class="panel-header">
            <h2 class="panel-title">Categories <span class="count">({{ categories.length }})</span></h2>
            <button class="btn-primary" (click)="toggleCatForm()">
              {{ showCForm ? 'Cancel' : '+ New Category' }}
            </button>
          </div>

          <div class="form-panel" *ngIf="showCForm">
            <h3 class="form-title">{{ editingC ? 'Edit Category' : 'Add New Category' }}</h3>
            <div class="form-grid">
              <div class="field"><label>Category Name *</label>
                <input [(ngModel)]="cf.name" placeholder="e.g. Sofas & Corners"></div>
              <div class="field"><label>Group *</label>
                <select [(ngModel)]="cf.groupName">
                  <option [ngValue]="null" disabled>Select group…</option>
                  <option *ngFor="let g of navGroups" [value]="g.group">{{ g.label }}</option>
                </select>
              </div>
              <div class="field full"><label>Cover Image URL</label>
                <input [(ngModel)]="cf.imageUrl" placeholder="https://…/cover.jpg"></div>
              <div class="field full"><label>Description</label>
                <input [(ngModel)]="cf.description" placeholder="Short description…"></div>
            </div>
            <div class="form-actions">
              <button class="btn-primary" (click)="saveCategory()">{{ editingC ? 'Update Category' : 'Create Category' }}</button>
              <button class="btn-outline" (click)="cancelCForm()">Cancel</button>
            </div>
            <div class="success-msg" *ngIf="cMsg">{{ cMsg }}</div>
            <div class="error-msg"   *ngIf="cErr">{{ cErr }}</div>
          </div>

          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>ID</th><th>Name</th><th>Group</th><th>Description</th><th>Actions</th></tr></thead>
              <tbody>
                <tr *ngFor="let c of categories">
                  <td class="td-id">{{ c.id }}</td>
                  <td><span class="p-name">{{ c.name }}</span></td>
                  <td><span class="group-badge">{{ c.groupName }}</span></td>
                  <td>{{ c.description }}</td>
                  <td class="td-actions">
                    <button class="act-btn edit" (click)="editCategory(c)">Edit</button>
                    <button class="act-btn del"  (click)="deleteCategory(c.id)">Delete</button>
                  </td>
                </tr>
                <tr *ngIf="categories.length === 0">
                  <td colspan="5" class="td-empty">No categories yet.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .page-header { background: #f2ede6; padding: 48px 0 36px; text-align: center; border-bottom: 1px solid var(--border); }
    .page-content { padding: 40px 0 80px; }

    .tabs { display: flex; gap: 0; margin-bottom: 32px; border-bottom: 2px solid var(--border); }
    .tabs button { padding: 12px 28px; border: none; background: none; cursor: pointer; font-family: 'Jost', sans-serif; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-light); border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all 0.2s; }
    .tabs button.active { color: var(--accent); border-bottom-color: var(--accent); }

    .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .panel-title { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 400; }
    .count { font-size: 16px; color: var(--text-light); }

    .form-panel { background: #faf9f7; border: 1px solid var(--border); padding: 28px; margin-bottom: 32px; }
    .form-title { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 400; margin-bottom: 20px; color: var(--text-dark); }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .field.full { grid-column: 1 / -1; }
    .field.checkbox-field { display: flex; align-items: flex-end; padding-bottom: 4px; }
    .check-label { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-mid); cursor: pointer; }
    .hint { font-size: 10px; color: var(--text-light); letter-spacing: 0.04em; text-transform: none; font-weight: 300; margin-left: 4px; }
    .form-actions { display: flex; gap: 12px; margin-top: 20px; }
    .success-msg { font-size: 13px; color: #2e7d32; margin-top: 12px; }
    .error-msg   { font-size: 13px; color: var(--accent); margin-top: 12px; }

    .table-wrap { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid var(--border); }
    .data-table th { background: #f5f1ec; padding: 12px 16px; text-align: left; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-mid); font-weight: 500; white-space: nowrap; }
    .data-table td { padding: 12px 16px; font-size: 13px; border-top: 1px solid var(--border); vertical-align: middle; color: var(--text-dark); }
    .td-id { color: var(--text-light); font-size: 12px; }
    .thumb-img { width: 44px; height: 44px; overflow: hidden; background: #f0ede8; }
    .thumb-img img { width: 100%; height: 100%; object-fit: cover; }
    .p-name { font-family: 'Cormorant Garamond', serif; font-size: 15px; }
    .pill { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 10px; font-weight: 500; }
    .pill.active   { background: #e8f5e9; color: #2e7d32; }
    .pill.inactive { background: #fee; color: var(--accent); }
    .pill.yes      { background: #fff3e0; color: #b7770d; }
    .group-badge { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; background: #f0ede8; color: var(--text-mid); padding: 3px 8px; }
    .td-actions { display: flex; gap: 8px; white-space: nowrap; }
    .act-btn { padding: 5px 14px; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; border: none; cursor: pointer; font-family: 'Jost', sans-serif; transition: opacity 0.15s; }
    .act-btn.edit { background: #e8f0fe; color: #1a56a0; }
    .act-btn.del  { background: #fee; color: var(--accent); }
    .act-btn:hover { opacity: 0.8; }
    .td-empty { text-align: center; color: var(--text-light); padding: 40px; font-style: italic; }
  `]
})
export class AdminComponent implements OnInit {
  tab = 'products';
  products: Product[] = [];
  categories: Category[] = [];
  navGroups = NAV_GROUPS.filter(g => g.group !== 'ALL');

  showPForm = false; showCForm = false;
  editingP: Product | null = null; editingC: Category | null = null;
  pMsg = ''; pErr = ''; cMsg = ''; cErr = '';

  pf: any = this.blankP();
  cf: any = this.blankC();

  constructor(private productService: ProductService, private categoryService: CategoryService) {}

  ngOnInit(): void { this.loadProducts(); this.loadCategories(); }

  loadProducts(): void { this.productService.getProducts(0, 200).subscribe(p => this.products = p.content); }
  loadCategories(): void { this.categoryService.getAll().subscribe(c => this.categories = c); }

  toggleProductForm(): void { this.showPForm = !this.showPForm; if (!this.showPForm) this.cancelPForm(); }
  toggleCatForm(): void { this.showCForm = !this.showCForm; if (!this.showCForm) this.cancelCForm(); }

  saveProduct(): void {
    this.pMsg = ''; this.pErr = '';
    if (!this.pf.name || !this.pf.price || !this.pf.categoryId) { this.pErr = 'Name, price and category are required.'; return; }
    const call = this.editingP
      ? this.productService.updateProduct(this.editingP.id, this.pf)
      : this.productService.createProduct(this.pf);
    call.subscribe({
      next: () => { this.pMsg = this.editingP ? 'Product updated.' : 'Product created.'; this.loadProducts(); this.cancelPForm(); this.showPForm = false; },
      error: e => this.pErr = e.error?.message || 'Failed to save product.'
    });
  }

  editProduct(p: Product): void {
    this.editingP = p;
    this.pf = { name: p.name, price: p.price, stockQuantity: p.stockQuantity, categoryId: p.category?.id ?? null, imageUrl: p.imageUrl || '', additionalImages: p.additionalImages || '', availableColors: p.availableColors || '', availableMaterials: p.availableMaterials || '', dimensions: p.dimensions || '', featured: p.featured, description: p.description || '' };
    this.showPForm = true; window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteProduct(id: number): void {
    if (!confirm('Hide this product?')) return;
    this.productService.deleteProduct(id).subscribe(() => this.loadProducts());
  }

  cancelPForm(): void { this.editingP = null; this.pf = this.blankP(); this.pMsg = ''; this.pErr = ''; }

  saveCategory(): void {
    this.cMsg = ''; this.cErr = '';
    if (!this.cf.name || !this.cf.groupName) { this.cErr = 'Name and group are required.'; return; }
    const call = this.editingC
      ? this.categoryService.update(this.editingC.id, this.cf)
      : this.categoryService.create(this.cf);
    call.subscribe({
      next: () => { this.cMsg = this.editingC ? 'Category updated.' : 'Category created.'; this.loadCategories(); this.cancelCForm(); this.showCForm = false; },
      error: e => this.cErr = e.error?.message || 'Failed to save category.'
    });
  }

  editCategory(c: Category): void {
    this.editingC = c;
    this.cf = { name: c.name, groupName: c.groupName || null, imageUrl: c.imageUrl || '', description: c.description || '' };
    this.showCForm = true; window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteCategory(id: number): void {
    if (!confirm('Delete this category?')) return;
    this.categoryService.delete(id).subscribe(() => this.loadCategories());
  }

  cancelCForm(): void { this.editingC = null; this.cf = this.blankC(); this.cMsg = ''; this.cErr = ''; }

  blankP() { return { name: '', price: null, stockQuantity: 0, categoryId: null, imageUrl: '', additionalImages: '', availableColors: '', availableMaterials: '', dimensions: '', featured: false, description: '' }; }
  blankC() { return { name: '', groupName: null, imageUrl: '', description: '' }; }
}
