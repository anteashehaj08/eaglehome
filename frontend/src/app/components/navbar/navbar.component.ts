import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/models';

interface NavGroup {
  label: string;
  group: string;
  subcategories: Category[];
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <nav class="navbar">
      <div class="nav-inner">

        <a routerLink="/" class="logo">
          <img src="https://i.postimg.cc/YSTsWCTh/logo-eagle-home.png" alt="Logo" class="logo-img">
        </a>

        <ul class="nav-links" [class.open]="mobileOpen">
          <!-- Dynamic category groups -->
          <li *ngFor="let grp of navGroups"
              class="nav-item has-drop"
              (mouseenter)="openDrop(grp.group)"
              (mouseleave)="closeDrop()">
            <a class="nav-link" (click)="navigateGroup(grp.group)">{{ grp.label }}</a>
            <div *ngIf="activeDrop === grp.group && grp.subcategories.length > 0" class="dropdown">
              <a *ngFor="let sub of grp.subcategories"
                 class="drop-item"
                 (click)="navigateCategory(sub.id)">{{ sub.name }}</a>
            </div>
          </li>

          <!-- Static links -->
          <li class="nav-item"><a routerLink="/products" class="nav-link">All</a></li>

          <li class="nav-divider"></li>

          <ng-container *ngIf="!auth.isLoggedIn()">
            <li class="nav-item"><a routerLink="/login"    class="nav-link">Login</a></li>
            <li class="nav-item"><a routerLink="/register" class="nav-link-accent">Register</a></li>
          </ng-container>

          <ng-container *ngIf="auth.isLoggedIn()">
            <li class="nav-item"><span class="nav-user">{{ auth.currentUser?.firstName }}</span></li>
            <li class="nav-item" *ngIf="auth.isAdmin()"><a routerLink="/admin" class="nav-link">Admin</a></li>
            <li class="nav-item"><button class="nav-link btn-ghost" (click)="logout()">Logout</button></li>
          </ng-container>
        </ul>

        <button class="hamburger btn-ghost" (click)="mobileOpen = !mobileOpen">
          <span></span><span></span><span></span>
        </button>
      </div>

      <!-- Search + cart sub-bar -->
      <div class="sub-bar">
        <div class="sub-inner">
          <div class="search-wrap">
            <input type="text" [(ngModel)]="searchQuery"
                   placeholder="Search furniture, lighting, décor..."
                   (keyup.enter)="doSearch()"
                   class="search-input">
            <button class="search-btn" (click)="doSearch()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          </div>
          <a routerLink="/cart" class="cart-btn" *ngIf="auth.isLoggedIn()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span class="cart-count" *ngIf="cartService.itemCount > 0">{{ cartService.itemCount }}</span>
          </a>
        </div>
      </div>
    </nav>

    <div class="nav-spacer"></div>
  `,
  styles: [`
    .navbar {
      position: fixed; top: 0; left: 0; right: 0;
      z-index: 500;
      background: var(--nav-bg);
      box-shadow: 0 1px 0 rgba(0,0,0,0.08);
    }
    .nav-inner {
      max-width: 1200px; margin: 0 auto;
      padding: 0 32px;
      display: flex; align-items: center;
      height: 60px; gap: 32px;
    }
    .logo-img {
      height: 55px;
      width: auto;
      object-fit: contain;
    }
    .nav-links { display: flex; align-items: center; gap: 4px; list-style: none; flex: 1; }
    .nav-item { position: relative; }
    .nav-link {
      display: block; padding: 6px 11px;
      font-size: 12px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
      color: #fff; cursor: pointer; white-space: nowrap;
      transition: color 0.15s; background: none; border: none;
    }
    .nav-link:hover { color: #f0e0e0; }
    .nav-link-accent {
      display: block; padding: 6px 14px;
      font-size: 12px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
      color: #fff; background: var(--accent); cursor: pointer; transition: background 0.2s;
    }
    .nav-link-accent:hover { background: var(--accent-dark); }
    .nav-user { font-size: 12px; color: #f0e0e0; padding: 6px 10px; letter-spacing: 0.06em; }
    .nav-divider { flex: 1; }

    .dropdown {
      position: absolute; top: 100%; left: 0;
      background: #fff; min-width: 220px;
      box-shadow: var(--shadow-lg);
      z-index: 600; padding: 8px 0;
      border-top: 2px solid var(--accent);
    }
    .drop-item {
      display: block; padding: 10px 20px;
      font-size: 13px; color: var(--text-dark);
      cursor: pointer; transition: background 0.15s; letter-spacing: 0.04em;
    }
    .drop-item:hover { background: #f8f4f0; color: var(--accent); }

    .sub-bar { background: #fff; border-top: 1px solid var(--border); }
    .sub-inner {
      max-width: 1200px; margin: 0 auto; padding: 10px 32px;
      display: flex; align-items: center; gap: 16px;
    }
    .search-wrap { flex: 1; display: flex; border: 1px solid var(--border); background: var(--page-bg); }
    .search-input { flex: 1; padding: 9px 14px; border: none; background: transparent; font-size: 13px; color: var(--text-dark); outline: none; font-family: 'Jost', sans-serif; }
    .search-input::placeholder { color: var(--text-light); }
    .search-btn { padding: 0 14px; background: none; border: none; cursor: pointer; color: var(--text-light); display: flex; align-items: center; }
    .search-btn:hover { color: var(--accent); }

    .cart-btn { position: relative; display: flex; align-items: center; padding: 8px; color: var(--text-dark); transition: color 0.2s; }
    .cart-btn:hover { color: var(--accent); }
    .cart-count { position: absolute; top: 0; right: 0; background: var(--accent); color: #fff; width: 17px; height: 17px; border-radius: 50%; font-size: 10px; font-weight: 500; display: flex; align-items: center; justify-content: center; }

    .nav-spacer { height: 112px; }

    .hamburger { display: none; flex-direction: column; gap: 5px; padding: 4px; }
    .hamburger span { display: block; width: 22px; height: 1.5px; background: #fff; }

    @media (max-width: 900px) {
      .nav-links { display: none; position: absolute; top: 60px; left: 0; right: 0; background: var(--nav-bg); flex-direction: column; align-items: flex-start; padding: 12px 0; gap: 0; }
      .nav-links.open { display: flex; }
      .hamburger { display: flex; margin-left: auto; }
      .nav-divider { display: none; }
      .dropdown { position: static; box-shadow: none; border-top: none; padding-left: 16px; background: rgba(0,0,0,0.1); }
    }
  `]
})
export class NavbarComponent implements OnInit {
  navGroups: NavGroup[] = [];
  activeDrop: string | null = null;
  searchQuery = '';
  mobileOpen = false;

  // Fixed top-level groups — subcategories loaded from API
  private readonly GROUPS = [
    { label: 'Indoor',     group: 'INDOOR'   },
    { label: 'Outdoor',    group: 'OUTDOOR'  },
    { label: 'Lighting',   group: 'LIGHTING' },
    { label: 'Boho Décor', group: 'BOHO'     },
  ];

  constructor(
      public auth: AuthService,
      public cartService: CartService,
      private categoryService: CategoryService,
      private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    if (this.auth.isLoggedIn()) {
      this.cartService.loadCart().subscribe();
    }
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe(allCats => {
      this.navGroups = this.GROUPS.map(g => ({
        label: g.label,
        group: g.group,
        subcategories: allCats.filter(c => c.groupName === g.group)
      }));
    });
  }

  @HostListener('window:scroll')
  onScroll() {}

  openDrop(group: string) { this.activeDrop = group; }
  closeDrop() { this.activeDrop = null; }

  navigateGroup(group: string): void {
    this.mobileOpen = false; this.closeDrop();
    this.router.navigate(['/products'], { queryParams: { group } });
  }

  navigateCategory(categoryId: number): void {
    this.mobileOpen = false; this.closeDrop();
    this.router.navigate(['/products'], { queryParams: { categoryId } });
  }

  doSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/products'], { queryParams: { search: this.searchQuery.trim() } });
      this.searchQuery = '';
    }
  }

  logout(): void {
    this.cartService.reset();
    this.auth.logout();
  }
}