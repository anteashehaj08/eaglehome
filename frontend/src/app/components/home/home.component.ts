import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/models';
import { ProductModalComponent } from '../product-modal/product-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductModalComponent],
  template: `
    <!-- Hero Slideshow -->
    <section class="hero">
      <div class="slide" *ngFor="let slide of slides; let i = index" [class.active]="i === currentSlide">
        <div class="slide-bg" [style.background-image]="'url(' + slide.image + ')'"></div>
        <div class="slide-overlay"></div>
        <div class="slide-content">
          <span class="slide-label">{{ slide.label }}</span>
          <h1 class="slide-title">{{ slide.title }}</h1>
          <p class="slide-sub">{{ slide.sub }}</p>
          <button class="btn-primary" (click)="navigateTo(slide.group)">Explore Collection</button>
        </div>
      </div>
      <div class="slide-dots">
        <button *ngFor="let s of slides; let i = index"
                class="dot" [class.active]="i === currentSlide"
                (click)="currentSlide = i"></button>
      </div>
    </section>

    <!-- 3 Category Cards -->
    <section class="categories-section">
      <div class="container">
        <div class="cat-grid">
          <div class="cat-card" *ngFor="let cat of categoryCards" (click)="navigateTo(cat.group)">
            <div class="cat-card-img">
              <img [src]="cat.image" [alt]="cat.name">
            </div>
            <div class="cat-card-body">
              <h3 class="cat-name">{{ cat.name }}</h3>
              <p class="cat-desc">{{ cat.desc }}</p>
              <span class="cat-link">Shop Now →</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Us -->
    <section class="about-section">
      <div class="container">
        <div class="about-grid">
          <div class="about-text">
            <span class="section-label">Our Story</span>
            <h2 class="section-title">About EagleFier</h2>
            <div class="divider left"></div>
            <p>Eagle Home is a success story that began in 1995, with a small furniture store, built on a passion for quality, aesthetics and customer service. Today, after decades of experience and continuous development, we have become a consolidated company operating in the field of interior and exterior decoration.</p>
            <br>
            <p>We offer complete solutions for interior design and outdoor spaces, including furniture and lighting for the home, as well as professional projects for bars, restaurants, hotels and other commercial environments.</p>
            <br>
            <p>Our portfolio includes carefully selected products from well-known brands, as well as personalized solutions that adapt to the style and needs of each client.</p>
            <br>
            <button class="btn-outline" (click)="navigateTo('ALL')">View All Collections</button>
          </div>
          <div class="about-image">
            <div class="about-img-placeholder">
              <img
                  src="https://i.postimg.cc/QCk8Vrz8/showroom-Eagle.jpg"
                  alt="Eagle Showroom"
                  style="width: 100%; height: 100%; object-fit: cover; display: block;"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="featured-section" *ngIf="featured.length > 0">
      <div class="container">
        <div class="text-center">
          <span class="section-label">Handpicked for You</span>
          <h2 class="section-title">Featured Pieces</h2>
          <div class="divider"></div>
        </div>
        <div class="product-grid">
          <div class="product-card" *ngFor="let p of featured" (click)="openModal(p)">
            <div class="product-card-img">
              <img *ngIf="p.imageUrl" [src]="p.imageUrl" [alt]="p.name">
              <div *ngIf="!p.imageUrl" class="product-card-img-placeholder">
                <span>{{ p.name }}</span>
              </div>
            </div>
            <div class="product-card-body">
              <div class="product-card-cat">{{ p.category?.name }}</div>
              <h3 class="product-card-name">{{ p.name }}</h3>
              <div class="product-card-price">{{ p.price | number:'1.2-2' }} ALL</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <app-product-modal *ngIf="selectedProduct" [product]="selectedProduct" (close)="selectedProduct = null"></app-product-modal>
  `,
  styles: [`
    /* Hero */
    .hero { position: relative; height: 600px; overflow: hidden; }
    @media (max-width: 768px) { .hero { height: 420px; } }
    .slide { position: absolute; inset: 0; opacity: 0; transition: opacity 0.8s ease; }
    .slide.active { opacity: 1; }
    .slide-bg { position: absolute; inset: 0; background-size: cover; background-position: center; background-color: #2a2018; }
    .slide-overlay { position: absolute; inset: 0; background: linear-gradient(to right, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.1)); }
    .slide-content {
      position: relative; z-index: 2;
      max-width: 600px; margin: 0; padding: 0 32px;
      display: flex; flex-direction: column; justify-content: center;
      height: 100%; padding-top: 20px;
    }
    .slide-label { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.7); margin-bottom: 12px; }
    .slide-title { font-family: 'Cormorant Garamond', serif; font-size: 52px; font-weight: 300; color: #fff; margin-bottom: 16px; line-height: 1.1; white-space: pre-line; }
    @media (max-width: 600px) { .slide-title { font-size: 36px; } }
    .slide-sub { font-size: 15px; color: rgba(255,255,255,0.8); margin-bottom: 28px; line-height: 1.6; max-width: 420px; font-weight: 300; }
    .slide-dots { position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; z-index: 3; }
    .dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,0.4); border: none; cursor: pointer; padding: 0; transition: background 0.2s; }
    .dot.active { background: #fff; }

    /* Categories */
    .categories-section { padding: 64px 0; }
    .cat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    @media (max-width: 768px) { .cat-grid { grid-template-columns: 1fr; } }
    .cat-card { border: 1px solid var(--border); background: var(--card-bg); cursor: pointer; transition: box-shadow 0.25s, transform 0.25s; overflow: hidden; }
    .cat-card:hover { box-shadow: var(--shadow-md); transform: translateY(-4px); }
    .cat-card-img { height: 220px; overflow: hidden; }
    .cat-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
    .cat-card:hover .cat-card-img img { transform: scale(1.05); }
    .cat-card-body { padding: 24px 28px 28px; }
    .cat-name { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 400; margin-bottom: 8px; color: var(--text-dark); }
    .cat-desc { font-size: 13px; color: var(--text-mid); line-height: 1.6; margin-bottom: 14px; font-weight: 300; }
    .cat-link { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); font-weight: 500; }

    /* About */
    .about-section { padding: 80px 0; background: #f2ede6; }
    .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
    @media (max-width: 768px) { .about-grid { grid-template-columns: 1fr; } }
    .about-text p { font-size: 15px; color: var(--text-mid); line-height: 1.8; font-weight: 300; }
    .about-img-placeholder {
      aspect-ratio: 4/3;
      background: #ddd5c8;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #a89880;
      font-size: 13px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      overflow: hidden; 
    }
    /* Featured */
    .featured-section { padding: 80px 0; }
    .text-center { text-align: center; }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  featured: Product[] = [];
  selectedProduct: Product | null = null;
  currentSlide = 0;
  private slideTimer: any;

  slides = [
    { label: 'New Collection', title: 'Living Spaces,\nReimagined', sub: 'Discover handcrafted furniture that brings warmth and character to every room.', image: 'https://i.postimg.cc/7ZJ0mF9c/img_7022.jpg', group: 'INDOOR' },
    { label: 'Outdoor Living', title: 'Your Garden,\nYour Sanctuary', sub: 'Weather-resistant outdoor furniture designed for the Mediterranean lifestyle.', image: 'https://i.postimg.cc/k5r8ZTYy/img_7973.jpg', group: 'OUTDOOR' },
    { label: 'Ambience', title: 'Light that\nTransforms', sub: 'Curated lighting collections for every mood and every corner of your home.', image: 'https://i.postimg.cc/bwSk37g5/img_7819.jpg', group: 'LIGHTING' },
  ];

  categoryCards = [
    { name: 'Indoor',   desc: 'Sofas, chairs, beds, tables and everything in between for your living spaces.',   group: 'INDOOR',   image: 'https://i.postimg.cc/6TJfz7tz/1.png' },
    { name: 'Outdoor',  desc: 'Sets, loungers and accessories crafted for sun-drenched terraces and gardens.',    group: 'OUTDOOR',  image: 'https://i.postimg.cc/K4SDQKmy/2.png' },
    { name: 'Lighting', desc: 'Pendants, floor lamps and statement pieces that set the perfect atmosphere.',      group: 'LIGHTING', image: 'https://i.postimg.cc/VkWMxfjp/3.png' },
  ];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.productService.getFeatured().subscribe(p => this.featured = p);
    this.startSlider();
  }

  ngOnDestroy(): void {
    clearInterval(this.slideTimer);
  }

  startSlider(): void {
    this.slideTimer = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }, 5000);
  }

  navigateTo(group: string): void {
    if (group === 'ALL') { this.router.navigate(['/products']); return; }
    this.router.navigate(['/products'], { queryParams: { group } });
  }

  openModal(p: Product): void { this.selectedProduct = p; }
}