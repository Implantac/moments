/* ==========================================================================
   Moments Paris — dados que mudam entre ambientes
   --------------------------------------------------------------------------
   Este é o ÚNICO arquivo que precisa ser editado para apontar o site para
   outro endereço de loja ou de domínio próprio. O site.js lê daqui e reescreve
   os links sozinho; se o arquivo não carregar, os links ficam como estão no
   HTML (nada quebra).

   Depois de publicar na Vercel, trocar:
     siteUrl: "https://moments-site.vercel.app"
   Quando a loja sair daqui para o domínio dela, trocar:
     storeUrl: "https://www.dominio-da-loja.com.br"
   ========================================================================== */
window.MOMENTS = {
  storeUrl: "https://www.seudominio.com.br",   /* troque pelo domínio da loja */
  siteUrl: ""                                   /* preencha depois de publicar; o site.js usa para og:url */
};
