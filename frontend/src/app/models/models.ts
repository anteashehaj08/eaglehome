export interface AuthResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'ADMIN';
}
export interface RegisterRequest { email: string; password: string; firstName: string; lastName: string; }
export interface LoginRequest { email: string; password: string; }

export interface Category {
  id: number;
  name: string;
  description?: string;
  groupName?: string;   // INDOOR | OUTDOOR | LIGHTING | BOHO | ALL
  imageUrl?: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  additionalImages?: string;   // comma-separated
  availableColors?: string;    // comma-separated
  availableMaterials?: string; // comma-separated
  dimensions?: string;
  active: boolean;
  featured: boolean;
  createdAt: string;
  category?: Category;
}

export interface ProductPage {
  content: Product[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface CartItem { id: number; product: Product; quantity: number; subtotal: number; }
export interface Cart { id: number; items: CartItem[]; total: number; itemCount: number; }

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export interface OrderItem { id: number; product: Product; quantity: number; priceAtPurchase: number; subtotal: number; }
export interface Order { id: number; items: OrderItem[]; totalAmount: number; status: OrderStatus; shippingAddress: string; createdAt: string; updatedAt: string; }

// Navigation structure
export const NAV_GROUPS = [
  {
    label: 'Indoor',
    group: 'INDOOR',
    subcategories: ['Sofas & Corners','Indoor Chairs & Armchairs','Chair + Table Sets','Beds','Office','Shelves & Sideboards','Tables','Coffee Tables','Barstools']
  },
  {
    label: 'Outdoor',
    group: 'OUTDOOR',
    subcategories: ['Outdoor Sets','Chairs & Armchairs','Bar Stools','Beach']
  },
  { label: 'Lighting', group: 'LIGHTING', subcategories: [] },
  { label: 'Boho Décor', group: 'BOHO', subcategories: [] },
  { label: 'All', group: 'ALL', subcategories: [] }
];
