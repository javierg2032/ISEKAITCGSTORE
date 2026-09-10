/* ================================================================
   ISEKAI TCG STORE
   JAVASCRIPT GLOBAL
   - Menú de categorías
   - Menú de usuario
   - Modo claro / oscuro
   - Carrusel de Home
   - Detección de Shop
   ================================================================ */

(function () {
    "use strict";

    function initIsekai() {
        /* =========================================================
           DETECCIÓN DE PÁGINA
           ========================================================= */

        const home = document.getElementById("isekai-home");
        const shop = document.querySelector("#wrap.isekai-shop-page");
        const portal = document.querySelector(".isekai-portal-page");
        const body = document.body;

        if (!body) {
            return;
        }

        body.classList.toggle("isekai-shop-active", !!shop);

        /*
         * FIX: faltaba esta línea. style.css define un bloque
         * completo de reglas bajo "body.isekai-portal-active"
         * (oculta el header nativo de Odoo, aplica el tema
         * oscuro, etc. en /my/home, /my/orders...) pero nunca se
         * añadía la clase al <body>, así que ese CSS no se
         * aplicaba nunca.
         */
        body.classList.toggle("isekai-portal-active", !!portal);

        /* =========================================================
           MODO CLARO / OSCURO
           ========================================================= */

        const themeButtons = document.querySelectorAll(".isekai-theme-toggle");

        function getSavedTheme() {
            try {
                return localStorage.getItem("isekai-theme");
            } catch (error) {
                return null;
            }
        }

        function saveTheme(theme) {
            try {
                localStorage.setItem("isekai-theme", theme);
            } catch (error) {
                /* Si localStorage está bloqueado, el tema
                   seguirá funcionando durante esta sesión. */
            }
        }

        function applyTheme(theme) {
            const isLight = theme === "light";

            body.classList.toggle("isekai-light-theme", isLight);

            body.classList.toggle("isekai-dark-theme", !isLight);

            themeButtons.forEach(function (button) {
                button.classList.toggle("isekai-light-mode", isLight);

                button.setAttribute("aria-pressed", isLight ? "true" : "false");

                button.setAttribute(
                    "aria-label",
                    isLight ? "Cambiar a modo oscuro" : "Cambiar a modo claro",
                );

                button.setAttribute(
                    "title",
                    isLight ? "Cambiar a modo oscuro" : "Cambiar a modo claro",
                );
            });
        }

        const savedTheme = getSavedTheme();

        applyTheme(savedTheme === "light" ? "light" : "dark");

        themeButtons.forEach(function (button) {
            if (button.dataset.isekaiThemeReady === "true") {
                return;
            }

            button.dataset.isekaiThemeReady = "true";

            button.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();

                const isLight = body.classList.contains("isekai-light-theme");

                const newTheme = isLight ? "dark" : "light";

                applyTheme(newTheme);
                saveTheme(newTheme);
            });
        });

        /* =========================================================
           CATEGORÍAS
           ========================================================= */

        /*
         * IMPORTANTE:
         * No limitamos la búsqueda a #isekai-home.
         * De esta forma el mismo header funciona también en Shop.
         */

        const categoryDropdowns = document.querySelectorAll(
            ".isekai-category-dropdown",
        );

        function closeAllCategories() {
            categoryDropdowns.forEach(function (dropdown) {
                dropdown.classList.remove("isekai-open");

                const button = dropdown.querySelector(
                    ".isekai-category-button",
                );

                if (button) {
                    button.setAttribute("aria-expanded", "false");
                }
            });
        }

        categoryDropdowns.forEach(function (dropdown) {
            const button = dropdown.querySelector(".isekai-category-button");

            const menu = dropdown.querySelector(".isekai-subcategory-menu");

            /*
             * Las categorías sin subcategorías siguen siendo
             * enlaces normales hacia /shop/category/...
             */
            if (!button || !menu) {
                return;
            }

            button.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();

                const isOpen = dropdown.classList.contains("isekai-open");

                closeAllCategories();

                if (!isOpen) {
                    dropdown.classList.add("isekai-open");

                    button.setAttribute("aria-expanded", "true");
                }
            });

            menu.addEventListener("click", function (event) {
                event.stopPropagation();
            });
        });

        /* =========================================================
           MENÚ DE USUARIO
           ========================================================= */

        const userDropdowns = document.querySelectorAll(
            ".isekai-user-dropdown",
        );

        function closeAllUserMenus() {
            userDropdowns.forEach(function (dropdown) {
                dropdown.classList.remove("isekai-open");

                const button = dropdown.querySelector(".isekai-user-button");

                if (button) {
                    button.setAttribute("aria-expanded", "false");
                }
            });
        }

        userDropdowns.forEach(function (dropdown) {
            const button = dropdown.querySelector(".isekai-user-button");

            const menu = dropdown.querySelector(".isekai-user-menu");

            if (!button || !menu) {
                return;
            }

            button.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();

                const isOpen = dropdown.classList.contains("isekai-open");

                closeAllUserMenus();

                if (!isOpen) {
                    dropdown.classList.add("isekai-open");

                    button.setAttribute("aria-expanded", "true");
                }
            });

            menu.addEventListener("click", function (event) {
                event.stopPropagation();
            });
        });

        /* =========================================================
           CLICK FUERA DE LOS MENÚS
           ========================================================= */

        document.addEventListener("click", function () {
            closeAllCategories();
            closeAllUserMenus();
        });

        /* =========================================================
           ESCAPE
           ========================================================= */

        document.addEventListener("keydown", function (event) {
            if (event.key !== "Escape") {
                return;
            }

            closeAllCategories();
            closeAllUserMenus();
        });

        /* =========================================================
           CARRUSEL HOME
           ========================================================= */

        if (home) {
            const carousel = home.querySelector(".isekai-carousel");

            if (carousel && carousel.dataset.isekaiCarouselReady !== "true") {
                carousel.dataset.isekaiCarouselReady = "true";

                const slides = carousel.querySelectorAll(".isekai-slide");

                const dots = carousel.querySelectorAll(".isekai-carousel-dot");

                const previousButton = carousel.querySelector(
                    ".isekai-carousel-prev",
                );

                const nextButton = carousel.querySelector(
                    ".isekai-carousel-next",
                );

                if (slides.length > 1) {
                    let currentSlide = 0;
                    let autoplay = null;

                    function showSlide(index) {
                        currentSlide = (index + slides.length) % slides.length;

                        slides.forEach(function (slide, slideIndex) {
                            slide.classList.toggle(
                                "active",
                                slideIndex === currentSlide,
                            );
                        });

                        dots.forEach(function (dot, dotIndex) {
                            dot.classList.toggle(
                                "active",
                                dotIndex === currentSlide,
                            );

                            dot.setAttribute(
                                "aria-current",
                                dotIndex === currentSlide ? "true" : "false",
                            );
                        });
                    }

                    function nextSlide() {
                        showSlide(currentSlide + 1);
                    }

                    function previousSlide() {
                        showSlide(currentSlide - 1);
                    }

                    function stopAutoplay() {
                        if (autoplay !== null) {
                            clearInterval(autoplay);
                            autoplay = null;
                        }
                    }

                    function startAutoplay() {
                        stopAutoplay();

                        autoplay = setInterval(function () {
                            nextSlide();
                        }, 6000);
                    }

                    if (previousButton) {
                        previousButton.addEventListener(
                            "click",
                            function (event) {
                                event.preventDefault();
                                event.stopPropagation();

                                previousSlide();
                                startAutoplay();
                            },
                        );
                    }

                    if (nextButton) {
                        nextButton.addEventListener("click", function (event) {
                            event.preventDefault();
                            event.stopPropagation();

                            nextSlide();
                            startAutoplay();
                        });
                    }

                    dots.forEach(function (dot, dotIndex) {
                        dot.addEventListener("click", function (event) {
                            event.preventDefault();
                            event.stopPropagation();

                            showSlide(dotIndex);
                            startAutoplay();
                        });
                    });

                    carousel.addEventListener("mouseenter", function () {
                        stopAutoplay();
                    });

                    carousel.addEventListener("mouseleave", function () {
                        startAutoplay();
                    });

                    carousel.addEventListener("focusin", function () {
                        stopAutoplay();
                    });

                    carousel.addEventListener("focusout", function () {
                        startAutoplay();
                    });

                    showSlide(0);
                    startAutoplay();
                }
            }
        }
    }

    /* =============================================================
       INICIO SEGURO
       ============================================================= */

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initIsekai);
    } else {
        initIsekai();
    }
})();
