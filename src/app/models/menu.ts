export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  icon?: string;
  accentColor?: string;
  tags?: string[];
  priceLabel?: string;
}

export interface MenuCategory {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  items: MenuItem[];
} 