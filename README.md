# Neovitale - Sitio estatico

Sitio web simple (HTML/CSS/JS) sin WordPress. Pensado para actualizar rapido textos e imagenes.

## Estructura
- `index.html` pagina principal
- `productos/` catalogo y subpagina de ortopedia
- `contacto.html` pagina de contacto
- `assets/` estilos, scripts e imagenes
- `data/` contenido editable en JSON

## Como actualizar
1. **Imagenes**: coloca tus fotos en `assets/images/`.
2. **Productos**: edita `data/productos.json`.
   - Cambia `titulo`, `descripcion`, `imagen` y `href`.
   - La ruta de `imagen` es relativa al HTML (usa `assets/images/tu-foto.jpg`).
3. **Testimonios**: edita `data/testimonios.json`.
4. **Marcas**: edita `data/marcas.json`.
5. **Galeria de Ortopedia**: edita `data/galerias/ortopedia.json`.

## Vista local
Al abrir los HTML directamente en el navegador puede fallar la carga de JSON.
Para ver todo correctamente, abre un servidor local:

```bash
python3 -m http.server 8000
```

Luego entra a `http://localhost:8000`.

## Reemplazar placeholders
- `assets/images/hero.svg` -> foto principal
- `assets/images/tienda.svg` -> foto de la tienda
- `assets/images/placeholder-producto.svg` -> imagenes de productos
- `assets/images/logos/` -> logos de marcas

Puedes borrar los SVG y sustituirlos por JPG/PNG manteniendo el mismo nombre o actualizando las rutas en los JSON.
