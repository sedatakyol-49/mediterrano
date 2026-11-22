export interface Inquiry {
  id: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'quoted' | 'closed';
  customer: {
    name: string;
    email: string;
    phone: string;
    eventDate: string;
    address: string;
    message: string;
  };
  guests: number | null;
  notes: string;
  emailStatus: 'pending' | 'not_configured' | 'accepted' | 'failed';
  items: {
    productId: string;
    name: string;
    image: string;
    description: string;
    quantity: number;
    priceMode: string;
    priceCents: number | null;
  }[];
}
export interface InquiryRevision {
  revision: number;
  content: Inquiry;
}
