import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product, Category, ProductPage, NAV_GROUPS } from '../../models/models';
import { ProductModalComponent } from '../product-modal/product-modal.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductModalComponent],
  template: `
    <!-- Page header -->
    <div class="page-header">
      <div class="container">
        <span class="section-label">{{ groupLabel || 'All Collections' }}</span>
        <h1 class="section-title">{{ pageTitle }}</h1>
        <div class="divider"></div>
      </div>
    </div>

    <div class="page-content">
      <div class="container">
        <div class="list-layout">

          <!-- Sidebar filters -->
          <aside class="sidebar">
            <div class="filter-block">
              <div class="filter-title">Collections</div>
              <ul class="filter-list">
                <li [class.active]="!activeGroup" (click)="setGroup(null)">All Products</li>
                <li *ngFor="let g of navGroups" [class.active]="activeGroup === g.group" (click)="setGroup(g.group)">{{ g.label }}</li>
              </ul>
            </div>

            <div class="filter-block" *ngIf="categories.length > 0">
              <div class="filter-title">Category</div>
              <ul class="filter-list">
                <li [class.active]="!activeCategoryId" (click)="setCategory(null)">All</li>
                <li *ngFor="let c of filteredCategories"
                    [class.active]="activeCategoryId === c.id"
                    (click)="setCategory(c.id)">{{ c.name }}</li>
              </ul>
            </div>

            <div class="filter-block">
              <div class="filter-title">Sort By</div>
              <ul class="filter-list">
                <li [class.active]="sortBy==='id'&&dir==='asc'"  (click)="setSort('id','asc')">Default</li>
                <li [class.active]="sortBy==='price'&&dir==='asc'"  (click)="setSort('price','asc')">Price: Low → High</li>
                <li [class.active]="sortBy==='price'&&dir==='desc'" (click)="setSort('price','desc')">Price: High → Low</li>
                <li [class.active]="sortBy==='name'&&dir==='asc'"  (click)="setSort('name','asc')">Name A–Z</li>
              </ul>
            </div>
          </aside>

          <!-- Product grid -->
          <div class="main-col">
            <div class="results-bar">
              <span class="results-count" *ngIf="!loading">{{ totalElements }} item{{ totalElements !== 1 ? 's' : '' }}</span>
              <span class="results-count" *ngIf="loading">Loading…</span>
            </div>

            <div *ngIf="loading" class="loading-grid">
              <div *ngFor="let n of [1,2,3,4,5,6]" class="skeleton-card">
                <div class="skel-img"></div>
                <div class="skel-body">
                  <div class="skel-line short"></div>
                  <div class="skel-line"></div>
                  <div class="skel-line short"></div>
                </div>
              </div>
            </div>

            <div *ngIf="!loading && products.length === 0" class="empty-state">
              <div class="empty-icon">🛋️</div>
              <h3>No products found</h3>
              <p>Try a different category or search term.</p>
              <button class="btn-outline" (click)="setGroup(null)">Browse All</button>
            </div>

            <div *ngIf="!loading && products.length > 0" class="product-grid">
              <div class="product-card" *ngFor="let p of products" (click)="openModal(p)">
                <div class="product-card-img">
                  <img *ngIf="p.imageUrl" [src]="p.imageUrl" [alt]="p.name">
                  <div *ngIf="!p.imageUrl" class="product-card-img-placeholder">
                    <span>{{ p.name }}</span>
                  </div>
                  <div class="featured-badge" *ngIf="p.featured">Featured</div>
                </div>
                <div class="product-card-body">
                  <div class="product-card-cat">{{ p.category?.name }}</div>
                  <h3 class="product-card-name">{{ p.name }}</h3>
                  <div class="product-card-footer">
                    <span class="product-card-price">{{ p.price | number:'1.2-2' }} ALL</span>
                    <span class="view-link">View →</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div class="pagination" *ngIf="totalPages > 1 && !loading">
              <button class="page-btn" (click)="goTo(0)"          [disabled]="page === 0">««</button>
              <button class="page-btn" (click)="goTo(page - 1)"   [disabled]="page === 0">‹</button>
              <span class="page-info">{{ page + 1 }} / {{ totalPages }}</span>
              <button class="page-btn" (click)="goTo(page + 1)"   [disabled]="page >= totalPages - 1">›</button>
              <button class="page-btn" (click)="goTo(totalPages-1)" [disabled]="page >= totalPages - 1">»»</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <app-product-modal *ngIf="selectedProduct" [product]="selectedProduct" (close)="selectedProduct = null"></app-product-modal>
  `,
  styles: [`
    .page-header { background: #f2ede6; padding: 48px 0 36px; text-align: center; border-bottom: 1px solid var(--border); }
    .page-content { padding: 40px 0 80px; }

    .list-layout { display: grid; grid-template-columns: 220px 1fr; gap: 40px; align-items: start; }
    @media (max-width: 768px) { .list-layout { grid-template-columns: 1fr; } }

    /* Sidebar */
    .sidebar { position: sticky; top: 120px; }
    .filter-block { margin-bottom: 32px; }
    .filter-title { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-dark); font-weight: 500; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid var(--border); }
    .filter-list { list-style: none; }
    .filter-list li { padding: 7px 0; font-size: 13px; color: var(--text-mid); cursor: pointer; transition: color 0.15s; letter-spacing: 0.02em; border-bottom: 1px solid transparent; }
    .filter-list li:hover { color: var(--accent); }
    .filter-list li.active { color: var(--accent); font-weight: 500; }

    /* Results bar */
    .results-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .results-count { font-size: 13px; color: var(--text-light); letter-spacing: 0.04em; }

    /* Loading skeletons */
    .loading-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 24px; }
    .skeleton-card { border: 1px solid var(--border); overflow: hidden; }
    .skel-img { height: 200px; background: linear-gradient(90deg, #ede8e0 25%, #e0dbd3 50%, #ede8e0 75%); background-size: 400% 100%; animation: shimmer 1.4s infinite; }
    .skel-body { padding: 16px; }
    .skel-line { height: 12px; background: #ede8e0; margin-bottom: 8px; border-radius: 2px; animation: shimmer 1.4s infinite; }
    .skel-line.short { width: 60%; }
    @keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }

    /* Empty state */
    .empty-state { text-align: center; padding: 80px 20px; }
    .empty-icon { font-size: 52px; margin-bottom: 16px; }
    .empty-state h3 { font-family: 'Cormorant Garamond', serif; font-size: 24px; margin-bottom: 8px; }
    .empty-state p { color: var(--text-light); margin-bottom: 24px; }

    /* Product card extras */
    .featured-badge {
      position: absolute; top: 12px; left: 12px;
      background: var(--accent); color: #fff;
      font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase;
      padding: 4px 10px; font-weight: 500;
    }
    .product-card-img { position: relative; }
    .product-card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 6px; }
    .view-link { font-size: 11px; letter-spacing: 0.08em; color: var(--text-light); transition: color 0.2s; }
    .product-card:hover .view-link { color: var(--accent); }

    /* Pagination */
    .pagination { display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 48px; }
    .page-btn { padding: 8px 14px; border: 1px solid var(--border); background: #fff; font-size: 13px; cursor: pointer; color: var(--text-dark); transition: all 0.15s; }
    .page-btn:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); }
    .page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
    .page-info { font-size: 13px; color: var(--text-mid); padding: 0 8px; }
  `]
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  selectedProduct: Product | null = null;
  navGroups = NAV_GROUPS;

  loading = false;
  page = 0; size = 12; totalPages = 0; totalElements = 0;
  sortBy = 'id'; dir = 'asc';
  activeGroup: string | null = null;
  activeCategoryId: number | null = null;
  searchTerm = '';
  pageTitle = 'All Products';
  groupLabel = '';

  private routeSub!: Subscription;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(cats => this.categories = cats);
    this.routeSub = this.route.queryParams.subscribe(params => {
      this.page = 0;
      this.activeGroup = params['group'] || null;
      this.activeCategoryId = params['categoryId'] ? +params['categoryId'] : null;
      this.searchTerm = params['search'] || '';
      this.updateTitle();
      this.filterCategories();
      this.load();
    });
  }

  ngOnDestroy(): void { this.routeSub?.unsubscribe(); }

  updateTitle(): void {
    if (this.searchTerm) { this.pageTitle = `Results for "${this.searchTerm}"`; this.groupLabel = 'Search'; return; }
    const grp = NAV_GROUPS.find(g => g.group === this.activeGroup);
    this.pageTitle = grp ? grp.label : 'All Products';
    this.groupLabel = grp ? 'Collection' : '';
  }

  filterCategories(): void {
    this.filteredCategories = this.activeGroup
      ? this.categories.filter(c => c.groupName === this.activeGroup)
      : this.categories;
  }

  load(): void {
    this.loading = true;
    this.productService.getProducts(
      this.page, this.size, this.sortBy, this.dir,
      this.activeCategoryId ?? undefined,
      this.activeGroup ?? undefined,
      this.searchTerm || undefined
    ).subscribe({
      next: (pg: ProductPage) => {
        this.products = pg.content;
        this.totalPages = pg.totalPages;
        this.totalElements = pg.totalElements;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  setGroup(group: string | null): void {
    this.router.navigate(['/products'], { queryParams: group ? { group } : {} });
  }

  setCategory(id: number | null): void {
    this.activeCategoryId = id;
    this.page = 0;
    this.load();
  }

  setSort(by: string, direction: string): void {
    this.sortBy = by; this.dir = direction; this.page = 0; this.load();
  }

  goTo(p: number): void { this.page = p; this.load(); window.scrollTo({ top: 0, behavior: 'smooth' }); }

  openModal(p: Product): void { this.selectedProduct = p; }
}
