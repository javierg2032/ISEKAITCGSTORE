(function () {

    "use strict";

    function initIsekaiCarousel() {

        const carousel = document.querySelector("#isekai-home .isekai-carousel");

        if (!carousel) {
            return;
        }

        const slides = carousel.querySelectorAll(".isekai-slide");
        const dots = carousel.querySelectorAll(".isekai-carousel-dot");
        const previousButton = carousel.querySelector(".isekai-carousel-prev");
        const nextButton = carousel.querySelector(".isekai-carousel-next");

        if (!slides.length) {
            return;
        }

        let currentSlide = 0;
        let autoplayTimer = null;


        /* =====================================================
           MOSTRAR DIAPOSITIVA
           ===================================================== */

        function showSlide(index) {

            if (index < 0) {
                index = slides.length - 1;
            }

            if (index >= slides.length) {
                index = 0;
            }

            currentSlide = index;


            /* Ocultar todas las diapositivas */

            slides.forEach(function (slide) {

                slide.style.opacity = "0";
                slide.style.visibility = "hidden";

            });


            /* Mostrar la actual */

            slides[currentSlide].style.opacity = "1";
            slides[currentSlide].style.visibility = "visible";


            /* Actualizar puntos */

            dots.forEach(function (dot, index) {

                if (index === currentSlide) {

                    dot.classList.add("active");

                } else {

                    dot.classList.remove("active");

                }

            });

        }


        /* =====================================================
           SIGUIENTE
           ===================================================== */

        function nextSlide() {

            showSlide(currentSlide + 1);

            restartAutoplay();

        }


        /* =====================================================
           ANTERIOR
           ===================================================== */

        function previousSlide() {

            showSlide(currentSlide - 1);

            restartAutoplay();

        }


        /* =====================================================
           AUTOPLAY
           ===================================================== */

        function startAutoplay() {

            autoplayTimer = setInterval(function () {

                showSlide(currentSlide + 1);

            }, 5000);

        }


        /* =====================================================
           REINICIAR AUTOPLAY
           ===================================================== */

        function restartAutoplay() {

            clearInterval(autoplayTimer);

            startAutoplay();

        }


        /* =====================================================
           BOTÓN SIGUIENTE
           ===================================================== */

        if (nextButton) {

            nextButton.addEventListener("click", function (event) {

                event.preventDefault();

                nextSlide();

            });

        }


        /* =====================================================
           BOTÓN ANTERIOR
           ===================================================== */

        if (previousButton) {

            previousButton.addEventListener("click", function (event) {

                event.preventDefault();

                previousSlide();

            });

        }


        /* =====================================================
           PUNTOS
           ===================================================== */

        dots.forEach(function (dot, index) {

            dot.addEventListener("click", function (event) {

                event.preventDefault();

                showSlide(index);

                restartAutoplay();

            });

        });


        /* =====================================================
           INICIAR
           ===================================================== */

        showSlide(0);

        startAutoplay();

    }


    /* =========================================================
       ESPERAR A QUE CARGUE LA PÁGINA
       ========================================================= */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initIsekaiCarousel
        );

    } else {

        initIsekaiCarousel();

    }

})();