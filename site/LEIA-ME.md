# Moments Paris, site cinematográfico

Site de uma página com hero controlado por scroll. HTML puro, CSS e JavaScript vanilla, sem build e sem npm.

## O que tem aqui

```
index.html              a página inteira
assets/
  site.css              estilos, tokens, cinco portões do hero estático
  site.js               scrub, faixas, entradas, momento interativo
  hero-scrub.mp4        6 s, 1920x1080, keyframe a cada 8 quadros (4,2 MB)
  hero-poster.jpg       primeiro quadro, para quem não recebe o scrub
  hero-ending.jpg       quadro final, reusado na chamada final
  hero-portrait.jpg     pôster vertical do celular
  ritual.jpg            o homem aplicando o perfume
  flatlay-si.jpg        a estante
  quadro-final.jpg      fundo da chamada final
  good-girl.jpg, la-vie-est-belle.jpg, coco-mademoiselle.jpg
  favicon.svg
  fonts/                Bodoni Moda, Instrument Sans, IBM Plex Mono (woff2)
```

Peso total: 6,9 MB, sendo 4,2 MB o vídeo. O celular nunca baixa o vídeo.

O hero é montado da foto real do frasco: recorte em camada própria, fundo em paralaxe, luz percorrendo o vidro e poeira. Gerado por `review/render_hero.py`, fora desta pasta.

## Como ver localmente

```
python3 -m http.server 8080
```

E abra `http://localhost:8080`. Dar dois cliques no `index.html` também funciona, mas o navegador bloqueia `fetch` em `file://`, então você vê o hero estático, que é o recuo desenhado de propósito.

## Como publicar (HostGator)

Suba o conteúdo desta pasta para `public_html`. Nada aqui depende de Node.

Antes de subir, troque no `index.html` os dois blocos marcados com `DEPLOY STEP`:

```html
<meta property="og:image" content="https://SEU-DOMINIO/assets/hero-poster.jpg">
<meta property="og:url" content="https://SEU-DOMINIO/">
```

Os endereços ficam em **`assets/config.js`** — é o único arquivo a editar:

```js
window.MOMENTS = {
  storeUrl: "https://www.dominio-da-loja.com.br",  // para onde vão os botões
  siteUrl:  "https://www.dominio-do-site.com.br"   // usado no og:url e og:image
};
```

O `site.js` reescreve os 13 links e as metatags sozinho ao carregar. As fotos
são servidas em WebP (`.webp`); os `.jpg` continuam na pasta como reserva para
navegador antigo. A pasta `assets/originais/` guarda as fotos como vieram e
**não precisa ser publicada**.

## O que foi medido

| Medida | Resultado |
|---|---|
| Scrub | linear de 0 a 6 s, sem travar em 12 rolagens rápidas |
| Repouso do final | movimento cai para 32% do inicial nos últimos 20 quadros |
| Faixas | soma das opacidades nunca passa de 1,0; nenhum ponto de rolagem sem texto |
| Contraste do texto sobre o vídeo | 12,6:1 no pior caso (mínimo exigido: 3,5:1) |
| CLS | 0,00 (medido em 10 cargas seguidas com CPU 4× mais lenta) |
| Peso da página | 4,35 MB no desktop (quase todo o vídeo) e 0,30 MB no celular |
| Acessibilidade | 0 violações no axe-core (WCAG 2.1 AA), desktop e celular |
| FCP | 232 ms no desktop, 152 ms no celular |
| Console | zero erros em desktop, celular, tablet e movimento reduzido |
| Overflow horizontal | zero em 375, 390, 1024, 1280, 1440 e 1920 |
| 3G a 400 kbps | página usável em 1 s, vídeo pronto em ~40 s atrás do anel |
| Sem JavaScript | hero estático e botão funcionam |
| Movimento reduzido | ligado e desligado no meio da sessão, nas duas direções |

O hero decide o modo **antes da primeira pintura**: um script de três linhas no
`<head>` marca o `<html>` com `js` quando o visitante pode ver a jornada por
scroll. Sem isso, o hero nascia com 760 px e virava 400vh depois do load — o que
empurrava a seção seguinte e gerava CLS 0,15.
