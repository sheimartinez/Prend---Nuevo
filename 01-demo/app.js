/**
 * app.js
 * Lógica principal de simulación para la demo visual de Prendé.
 * Maneja la navegación tipo SPA y las interacciones de interfaz simulando funcionalidades de un SaaS real.
 */

const app = {
    // Inicialización del sistema
    init() {
        this.cacheDOM();
        this.bindEvents();
        console.log("Prendé Demo Inicializada. Todo el contenido es una simulación visual.");
    },

    // Cachear elementos repetitivos
    cacheDOM() {
        this.navItems = document.querySelectorAll('.nav-item');
        this.sections = document.querySelectorAll('.view-section');
        this.sidebar = document.getElementById('sidebar');
        this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
        this.closeSidebarBtn = document.getElementById('close-sidebar-btn');
        this.cartBadge = document.querySelector('.cart-btn .badge');
    },

    // Binding de eventos interactivos
    bindEvents() {
        // Navegación Sidebar
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('data-target');
                if (targetId) {
                    this.navTo(targetId);
                }
            });
        });

        // Mobile Menu Toggle
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.addEventListener('click', () => {
                this.sidebar.classList.add('mobile-open');
            });
        }

        // Close Sidebar Mobile
        if (this.closeSidebarBtn) {
            this.closeSidebarBtn.addEventListener('click', () => {
                this.sidebar.classList.remove('mobile-open');
            });
        }

        // Simulación: Tabs en Inventario
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                tabs.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                // Al ser visual, solo cambiamos la tab activa, la tabla queda igual por practicidad.
            });
        });

        // Simulación del Chat
        const chatItems = document.querySelectorAll('.chat-item');
        chatItems.forEach(chat => {
            chat.addEventListener('click', () => {
                chatItems.forEach(c => c.classList.remove('active'));
                chat.classList.add('active');
            });
        });
    },

    // Navegación principal (SPA flow)
    navTo(targetId) {
        // Remover activo de todas las secciones
        this.sections.forEach(sec => {
            sec.classList.remove('active');
        });

        // Remover activo de los botones de nav
        this.navItems.forEach(nav => {
            nav.classList.remove('active');
        });

        // Mostrar sección destino
        const targetSec = document.getElementById(targetId);
        if (targetSec) {
            targetSec.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Marcar botón activo correspondiente
        const targetNavs = document.querySelectorAll(`.nav-item[data-target="${targetId}"]`);
        targetNavs.forEach(nav => {
            nav.classList.add('active');
        });

        // Si estamos en mobile, cerrar el menú tras navegar
        if (window.innerWidth <= 900) {
            this.sidebar.classList.remove('mobile-open');
        }
    },

    // Carrito Simulado (Agrega el número al badge)
    cartCount: 0,
    addToCart() {
        this.cartCount++;
        if (this.cartBadge) {
            this.cartBadge.textContent = this.cartCount;
            // Pequeña animación pop
            this.cartBadge.style.transform = "scale(1.5)";
            setTimeout(() => {
                this.cartBadge.style.transform = "scale(1)";
            }, 200);
        }
    }
};

// Override al alert estándar para agregar al carrito
const originalAlert = window.alert;
window.alert = function(message) {
    if (message === 'Agregado al carrito') {
        app.addToCart();
    }
    // Mostramos un alert simple pero podríamos mostrar un toast
    originalAlert(message);
};

// Arrancar aplicación al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
