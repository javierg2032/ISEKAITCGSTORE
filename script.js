(function () {
    "use strict";

    function initIsekai() {
        const home = document.getElementById("isekai-home");

        if (!home) {
            return;
        }


        /* =========================================================
           1. CARRUSEL
           ========================================================= */

        function initCarousel() {
            const carousel = home.querySelector(".isekai-carousel");

            if (!carousel) {
                return;
            }

            const slides = carousel.querySelectorAll(".isekai-slide");
            const dots = carousel.querySelectorAll(".isekai-carousel-dot");
            const previousButton =
                carousel.querySelector(".isekai-carousel-prev");
            const nextButton =
                carousel.querySelector(".isekai-carousel-next");

            if (!slides.length) {
                return;
            }

            let currentSlide = 0;
            let autoplayTimer = null;

            function showSlide(index) {
                if (index >= slides.length) {
                    index = 0;
                }

                if (index < 0) {
                    index = slides.length - 1;
                }

                currentSlide = index;

                slides.forEach(function (slide, slideIndex) {
                    const isActive = slideIndex === currentSlide;

                    slide.style.opacity = isActive ? "1" : "0";
                    slide.style.visibility = isActive
                        ? "visible"
                        : "hidden";

                    slide.classList.toggle("active", isActive);
                });

                dots.forEach(function (dot, dotIndex) {
                    const isActive = dotIndex === currentSlide;

                    dot.classList.toggle("active", isActive);

                    if (isActive) {
                        dot.setAttribute("aria-current", "true");
                    } else {
                        dot.removeAttribute("aria-current");
                    }
                });
            }


            function startAutoplay() {
                if (autoplayTimer !== null) {
                    return;
                }

                autoplayTimer = setInterval(function () {
                    showSlide(currentSlide + 1);
                }, 5000);
            }


            function stopAutoplay() {
                if (autoplayTimer === null) {
                    return;
                }

                clearInterval(autoplayTimer);
                autoplayTimer = null;
            }


            function restartAutoplay() {
                stopAutoplay();
                startAutoplay();
            }


            function nextSlide() {
                showSlide(currentSlide + 1);
                restartAutoplay();
            }


            function previousSlide() {
                showSlide(currentSlide - 1);
                restartAutoplay();
            }


            /* -----------------------------------------------------
               Botón siguiente
               ----------------------------------------------------- */

            if (nextButton) {
                nextButton.addEventListener("click", function (event) {
                    event.preventDefault();

                    nextSlide();
                });
            }


            /* -----------------------------------------------------
               Botón anterior
               ----------------------------------------------------- */

            if (previousButton) {
                previousButton.addEventListener("click", function (event) {
                    event.preventDefault();

                    previousSlide();
                });
            }


            /* -----------------------------------------------------
               Indicadores
               ----------------------------------------------------- */

            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function (event) {
                    event.preventDefault();

                    showSlide(index);
                    restartAutoplay();
                });
            });


            /* -----------------------------------------------------
               Pausar al pasar el ratón
               ----------------------------------------------------- */

            carousel.addEventListener("mouseenter", function () {
                stopAutoplay();
            });

            carousel.addEventListener("mouseleave", function () {
                startAutoplay();
            });


            /* -----------------------------------------------------
               Pausar al utilizar teclado
               ----------------------------------------------------- */

            carousel.addEventListener("focusin", function () {
                stopAutoplay();
            });

            carousel.addEventListener("focusout", function () {
                setTimeout(function () {
                    if (!carousel.contains(document.activeElement)) {
                        startAutoplay();
                    }
                }, 0);
            });


            /* -----------------------------------------------------
               Pausar si la pestaña deja de estar visible
               ----------------------------------------------------- */

            document.addEventListener(
                "visibilitychange",
                function () {
                    if (document.hidden) {
                        stopAutoplay();
                    } else {
                        startAutoplay();
                    }
                }
            );


            /* -----------------------------------------------------
               Inicialización
               ----------------------------------------------------- */

            showSlide(0);
            startAutoplay();
        }


        /* =========================================================
           2. MENÚS DE CATEGORÍAS
           ========================================================= */

        function initCategoryMenus() {
            const categoryDropdowns =
                home.querySelectorAll(".isekai-category-dropdown");

            if (!categoryDropdowns.length) {
                return;
            }


            categoryDropdowns.forEach(function (dropdown) {
                const button =
                    dropdown.querySelector(".isekai-category-button");

                const menu =
                    dropdown.querySelector(".isekai-subcategory-menu");

                if (!button || !menu) {
                    return;
                }


                button.setAttribute("aria-expanded", "false");


                button.addEventListener("click", function (event) {
                    /*
                     * Las categorías con subcategorías funcionan
                     * como desplegable.
                     *
                     * Evitamos que el enlace navegue directamente
                     * al hacer clic en ellas.
                     */
                    event.preventDefault();
                    event.stopPropagation();


                    const isOpen =
                        dropdown.classList.contains("isekai-open");


                    /* Cerrar todos los demás */
                    categoryDropdowns.forEach(function (otherDropdown) {
                        otherDropdown.classList.remove("isekai-open");

                        const otherButton =
                            otherDropdown.querySelector(
                                ".isekai-category-button"
                            );

                        if (otherButton) {
                            otherButton.setAttribute(
                                "aria-expanded",
                                "false"
                            );
                        }
                    });


                    /* Abrir el seleccionado */
                    if (!isOpen) {
                        dropdown.classList.add("isekai-open");

                        button.setAttribute(
                            "aria-expanded",
                            "true"
                        );
                    }
                });


                /*
                 * Evita que hacer clic dentro del menú provoque
                 * el cierre mediante el listener global.
                 */
                menu.addEventListener("click", function (event) {
                    event.stopPropagation();
                });
            });
        }


        /* =========================================================
           3. MENÚ DE USUARIO
           ========================================================= */

        function initUserMenus() {
            const userDropdowns =
                home.querySelectorAll(".isekai-user-dropdown");

            if (!userDropdowns.length) {
                return;
            }


            userDropdowns.forEach(function (dropdown) {
                const button =
                    dropdown.querySelector(".isekai-user-button");

                const menu =
                    dropdown.querySelector(".isekai-user-menu");

                if (!button || !menu) {
                    return;
                }


                button.setAttribute("aria-expanded", "false");


                button.addEventListener("click", function (event) {
                    event.preventDefault();
                    event.stopPropagation();


                    const isOpen =
                        dropdown.classList.contains("isekai-open");


                    /* Cerrar todos los menús de usuario */
                    userDropdowns.forEach(function (otherDropdown) {
                        otherDropdown.classList.remove("isekai-open");

                        const otherButton =
                            otherDropdown.querySelector(
                                ".isekai-user-button"
                            );

                        if (otherButton) {
                            otherButton.setAttribute(
                                "aria-expanded",
                                "false"
                            );
                        }
                    });


                    /* Abrir el seleccionado */
                    if (!isOpen) {
                        dropdown.classList.add("isekai-open");

                        button.setAttribute(
                            "aria-expanded",
                            "true"
                        );
                    }
                });


                /*
                 * Evita que hacer clic dentro del menú
                 * provoque el cierre inmediatamente.
                 */
                menu.addEventListener("click", function (event) {
                    event.stopPropagation();
                });
            });
        }


        /* =========================================================
           4. CERRAR MENÚS AL HACER CLIC FUERA
           ========================================================= */

        function initOutsideClick() {
            document.addEventListener("click", function (event) {

                /*
                 * Si el clic está dentro de Isekai, comprobamos
                 * específicamente si está fuera de los menús.
                 */

                const categoryDropdowns =
                    home.querySelectorAll(
                        ".isekai-category-dropdown"
                    );

                categoryDropdowns.forEach(function (dropdown) {
                    if (!dropdown.contains(event.target)) {
                        dropdown.classList.remove(
                            "isekai-open"
                        );

                        const button =
                            dropdown.querySelector(
                                ".isekai-category-button"
                            );

                        if (button) {
                            button.setAttribute(
                                "aria-expanded",
                                "false"
                            );
                        }
                    }
                });


                const userDropdowns =
                    home.querySelectorAll(
                        ".isekai-user-dropdown"
                    );

                userDropdowns.forEach(function (dropdown) {
                    if (!dropdown.contains(event.target)) {
                        dropdown.classList.remove(
                            "isekai-open"
                        );

                        const button =
                            dropdown.querySelector(
                                ".isekai-user-button"
                            );

                        if (button) {
                            button.setAttribute(
                                "aria-expanded",
                                "false"
                            );
                        }
                    }
                });
            });
        }


        /* =========================================================
           5. MODO CLARO / OSCURO
           ========================================================= */

        function initThemeToggle() {
            const toggle =
                home.querySelector(".isekai-theme-toggle");

            if (!toggle) {
                return;
            }


            /* -----------------------------------------------------
               Recuperar tema guardado
               ----------------------------------------------------- */

            let savedTheme = null;

            try {
                savedTheme =
                    localStorage.getItem("isekai-theme");
            } catch (error) {
                /*
                 * Si localStorage está bloqueado por el navegador,
                 * simplemente utilizamos el modo oscuro.
                 */
                savedTheme = null;
            }


            /*
             * El modo oscuro es el predeterminado.
             */
            if (savedTheme === "light") {
                home.setAttribute(
                    "data-theme",
                    "light"
                );
            } else {
                home.setAttribute(
                    "data-theme",
                    "dark"
                );
            }


            /* -----------------------------------------------------
               Actualizar accesibilidad del botón
               ----------------------------------------------------- */

            function updateThemeButton() {
                const isLight =
                    home.getAttribute("data-theme") === "light";


                toggle.setAttribute(
                    "aria-pressed",
                    isLight ? "true" : "false"
                );


                if (isLight) {
                    toggle.setAttribute(
                        "aria-label",
                        "Cambiar a modo oscuro"
                    );

                    toggle.setAttribute(
                        "title",
                        "Cambiar a modo oscuro"
                    );
                } else {
                    toggle.setAttribute(
                        "aria-label",
                        "Cambiar a modo claro"
                    );

                    toggle.setAttribute(
                        "title",
                        "Cambiar a modo claro"
                    );
                }
            }


            /* -----------------------------------------------------
               Cambiar tema
               ----------------------------------------------------- */

            toggle.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();


                const isLight =
                    home.getAttribute("data-theme") === "light";


                const newTheme =
                    isLight ? "dark" : "light";


                home.setAttribute(
                    "data-theme",
                    newTheme
                );


                try {
                    localStorage.setItem(
                        "isekai-theme",
                        newTheme
                    );
                } catch (error) {
                    /*
                     * No hacemos nada si localStorage no está disponible.
                     */
                }


                updateThemeButton();
            });


            /* -----------------------------------------------------
               Estado inicial
               ----------------------------------------------------- */

            updateThemeButton();
        }


        /* =========================================================
           6. INICIALIZACIÓN
           ========================================================= */

        initCarousel();
        initCategoryMenus();
        initUserMenus();
        initThemeToggle();
        initOutsideClick();
    }


    /* =============================================================
       ARRANQUE
       ============================================================= */

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initIsekai
        );
    } else {
        initIsekai();
    }

})();