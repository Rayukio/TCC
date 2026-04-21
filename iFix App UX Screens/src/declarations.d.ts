// Permite importar arquivos CSS
declare module "*.css";

// Permite importar imagens via caminho figma:asset/
declare module "figma:asset/*" {
  const src: string;
  export default src;
}

// Permite importar imagens comuns
declare module "*.png" {
  const src: string;
  export default src;
}
declare module "*.svg" {
  const src: string;
  export default src;
}