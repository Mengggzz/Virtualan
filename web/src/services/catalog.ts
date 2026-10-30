export interface TemplateMeta {
  id: string;
  name: string;
  category: string;
  layouts: string[];
  seasonal?: boolean;
}

export interface StickerMeta {
  id: string;
  name: string;
  category: string;
}

export interface FilterMeta {
  id: string;
  name: string;
  cssFilter: string;
  note?: string;
}

export interface TemplateDetail {
  id: string;
  name: string;
  category: string;
  layouts: string[];
  canvas: Record<string, [number, number]>;
  slots: Record<string, Array<{ x: number; y: number; w: number; h: number; shape?: string }>>;
  bg: string;
  footerText: string;
  seasonal?: boolean;
}

export interface Catalog {
  templates: TemplateMeta[];
  stickers: StickerMeta[];
  filters: FilterMeta[];
  error?: string;
}

export async function loadCatalog(): Promise<Catalog> {
  try {
    const [tRes, sRes, fRes] = await Promise.all([
      fetch('/assets/templates/templates-index.json'),
      fetch('/assets/stickers/stickers-index.json'),
      fetch('/assets/filters.json'),
    ]);

    if (!tRes.ok || !sRes.ok || !fRes.ok) {
      const missing = [];
      if (!tRes.ok) missing.push('/assets/templates/templates-index.json');
      if (!sRes.ok) missing.push('/assets/stickers/stickers-index.json');
      if (!fRes.ok) missing.push('/assets/filters.json');

      throw new Error(`Katalog aset tidak ditemukan: ${missing.join(', ')}`);
    }

    const templates = await tRes.json();
    const stickers = await sRes.json();
    const filters = await fRes.json();

    return { templates, stickers, filters };
  } catch (err: any) {
    console.error('Catalog load error:', err);
    return {
      templates: [],
      stickers: [],
      filters: [],
      error: err.message || 'Gagal memuat katalog aset.',
    };
  }
}

export async function loadTemplateDetail(templateId: string): Promise<TemplateDetail> {
  const res = await fetch(`/assets/templates/${templateId}/template.json`);
  if (!res.ok) {
    throw new Error(`Gagal memuat template: /assets/templates/${templateId}/template.json`);
  }
  return res.json();
}
