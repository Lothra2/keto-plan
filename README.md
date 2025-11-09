# 🥑 Keto Pro Ultra

> Tu plan cetogénico personalizado con inteligencia artificial - Versión 2.0

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/keto-pro-ultra/deploys)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Una aplicación web progresiva (PWA) moderna y profesional para gestionar tu dieta cetogénica con el poder de la inteligencia artificial.

## ✨ Características

### 🎯 Core Features
- ✅ **Plan de comidas personalizado** - 14+ días de menús keto
- ✅ **Generación con IA** - OpenAI GPT-4 y Google Gemini
- ✅ **Seguimiento de progreso** - Peso, medidas, gráficos
- ✅ **Lista de compras inteligente** - Generada automáticamente
- ✅ **Planes de ejercicio** - 4 semanas progresivas
- ✅ **Multi-idioma** - Español e Inglés

### 🎨 UI/UX Moderno
- ✅ **Diseño moderno** con Glassmorphism
- ✅ **Animaciones suaves** y transiciones
- ✅ **Tema claro/oscuro** adaptativo
- ✅ **Responsive design** - Móvil, tablet, desktop
- ✅ **Accesibilidad** WCAG 2.1 AA

### ⚡ Tecnología Avanzada
- ✅ **PWA completa** - Instalable, offline-first
- ✅ **IndexedDB** - Almacenamiento local robusto
- ✅ **Service Worker** - Caché inteligente
- ✅ **Módulos ES6** - Código modular
- ✅ **Build con Vite** - Ultra rápido
- ✅ **Zero frameworks** - Vanilla JavaScript optimizado

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- npm o pnpm

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/keto-plan.git
cd keto-plan

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Build para producción

```bash
# Build optimizado
npm run build

# Preview del build
npm run preview
```

## 📁 Estructura del Proyecto

```
keto-plan/
├── src/                      # Código fuente
│   ├── components/           # Componentes UI
│   │   ├── ui/              # Componentes base
│   │   ├── layout/          # Componentes de layout
│   │   ├── features/        # Componentes específicos
│   │   └── animations/      # Componentes animados
│   ├── core/                 # Lógica de negocio
│   │   ├── state/           # State management
│   │   ├── services/        # Servicios (AI, Storage, etc.)
│   │   ├── utils/           # Utilidades
│   │   └── data/            # Datos y configuración
│   ├── pages/                # Vistas principales
│   ├── styles/               # Estilos CSS
│   ├── assets/               # Assets (iconos, imágenes)
│   ├── index.html            # HTML principal
│   ├── main.js               # Entry point
│   └── sw.js                 # Service Worker
├── public/                   # Assets estáticos
│   ├── icons/               # Iconos PWA
│   ├── screenshots/         # Screenshots PWA
│   └── manifest.json        # PWA manifest
├── netlify/                  # Netlify Functions
│   └── functions/           # Serverless functions
├── package.json              # Dependencias
├── vite.config.js           # Configuración Vite
└── README.md                # Este archivo
```

## 🛠️ Tecnologías

### Frontend
- **Vanilla JavaScript** (ES6+) - Sin frameworks
- **CSS Variables** - Design tokens
- **Chart.js** - Visualización de datos
- **date-fns** - Manejo de fechas
- **idb** - IndexedDB wrapper

### Build & Dev Tools
- **Vite** - Build tool y dev server
- **ESLint** - Linting
- **Prettier** - Code formatting

### Backend/Serverless
- **Netlify Functions** - Serverless
- **OpenAI API** - Generación de comidas
- **Google Gemini API** - Alternativa IA

### PWA
- **Service Workers** - Offline support
- **Web App Manifest** - Instalabilidad
- **IndexedDB** - Almacenamiento local

## 🎨 Sistema de Diseño

### Colores
- **Primario**: `#0f766e` (Teal)
- **Éxito**: `#22c55e` (Green)
- **Peligro**: `#ef4444` (Red)
- **Advertencia**: `#f59e0b` (Amber)

### Tipografía
- **Font**: Inter (Google Fonts)
- **Pesos**: 400, 500, 600, 700

### Espaciado
Sistema de espaciado basado en `4px` (0.25rem):
- `--space-1`: 4px
- `--space-2`: 8px
- `--space-3`: 12px
- `--space-4`: 16px
- etc.

## 📱 PWA Features

- ✅ Instalable en dispositivos móviles y desktop
- ✅ Funciona offline
- ✅ Notificaciones push (opcional)
- ✅ Splash screen personalizada
- ✅ App shortcuts
- ✅ Share target

## 🔐 Variables de Entorno

Crear archivo `.env` en la raíz:

```env
# API Keys (opcional si usas Netlify Functions)
VITE_OPENAI_API_KEY=your_openai_key
VITE_GEMINI_API_KEY=your_gemini_key

# Features
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_NOTIFICATIONS=true
```

## 🚀 Deploy

### Netlify (Recomendado)

1. Conecta tu repositorio con Netlify
2. Configuración automática desde `netlify.toml`
3. Deploy!

```bash
# O usando Netlify CLI
netlify deploy --prod
```

### Otros proveedores

```bash
# Build
npm run build

# El directorio dist/ contiene los archivos estáticos
```

Compatible con: Vercel, GitHub Pages, AWS S3, etc.

## 📊 Performance

- ⚡ Lighthouse Score: 95+
- 🎯 First Contentful Paint: < 1s
- 🚀 Time to Interactive: < 2s
- 📦 Bundle size: < 200KB (gzipped)

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guidelines

- Sigue el estilo de código existente
- Usa Prettier para formatear
- Escribe commits descriptivos
- Agrega tests si es posible

## 📝 Roadmap

### v2.1 (Próximo)
- [ ] Integración con wearables (Apple Health, Google Fit)
- [ ] Modo colaborativo (compartir planes)
- [ ] Recetas con videos
- [ ] Escaneo de código de barras

### v3.0 (Futuro)
- [ ] Sincronización en la nube
- [ ] Chat con IA conversacional
- [ ] Análisis de macros con IA
- [ ] Modo de ayuno intermitente

## 🐛 Reportar Issues

Usa [GitHub Issues](https://github.com/tu-usuario/keto-plan/issues) para reportar bugs o solicitar features.

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 👥 Autores

- **Keto Pro Team** - [GitHub](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- OpenAI por GPT-4
- Google por Gemini
- La comunidad keto
- Todos los contribuidores

---

**Hecho con ❤️ y 🥑 por el equipo de Keto Pro**

[Sitio Web](https://keto-pro-ultra.netlify.app) · [Reportar Bug](https://github.com/tu-usuario/keto-plan/issues) · [Solicitar Feature](https://github.com/tu-usuario/keto-plan/issues)
