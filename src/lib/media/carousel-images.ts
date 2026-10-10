/** URLs otimizadas (menor largura) para carregamento mais rápido do carrossel e hero. */
export const CAROUSEL_IMAGE_WIDTH = 1200;

export function unsplashCarouselUrl(photoPath: string): string {
  return `https://images.unsplash.com/${photoPath}?auto=format&fit=crop&w=${CAROUSEL_IMAGE_WIDTH}&q=75`;
}

export const HOME_CAROUSEL_SLIDES = [
  {
    src: unsplashCarouselUrl("photo-1578916171728-46686eac8d58"),
    alt: "Corredor de atacado com carrinhos e prateleiras altas",
    caption: "Corredores amplos de atacado",
  },
  {
    src: unsplashCarouselUrl("photo-1604719312566-8912e9227c6a"),
    alt: "Prateleiras de produtos em estoque de supermercado",
    caption: "Estoque organizado para o seu negócio",
  },
  {
    src: unsplashCarouselUrl("photo-1534723452862-4c874018d66d"),
    alt: "Pessoa escolhendo frutas e verduras frescas",
    caption: "Clientes escolhendo com tranquilidade",
  },
  {
    src: unsplashCarouselUrl("photo-1542838132-92c53300491e"),
    alt: "Corredor de supermercado com produtos frescos",
    caption: "Experiência completa no varejo",
  },
  {
    src: unsplashCarouselUrl("photo-1550989460-0adf9ea622e2"),
    alt: "Pessoas fazendo compras em supermercado",
    caption: "Movimento real nas lojas Dahora",
  },
  {
    src: unsplashCarouselUrl("photo-1583258292688-d0213dc5a3a8"),
    alt: "Interior de loja com produtos e clientes circulando",
    caption: "Do atacado ao dia a dia",
  },
] as const;

export const HOME_HERO_IMAGE = unsplashCarouselUrl("photo-1542838132-92c53300491e");
