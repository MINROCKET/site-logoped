document.addEventListener('DOMContentLoaded', () => {
    
    // --- 0. ЭКРАН ЗАГРУЗКИ (НОВОЕ) ---
    const loader = document.getElementById('loader-wrapper');
    if (loader) {
        // Ждем 2000 миллисекунд (2 секунды), чтобы насладиться анимацией
        setTimeout(() => {
            loader.classList.add('hidden'); // Добавляем класс, который делает прозрачным
        }, 2000);
    }

    // 1. СВЕТ ВОКРУГ КУРСОРА
    const light = document.createElement('div');
    light.id = 'cursor-light';
    document.body.appendChild(light);

    document.addEventListener('mousemove', (e) => {
        light.style.left = e.clientX + 'px';
        light.style.top = e.clientY + 'px';
    });
    
    document.body.addEventListener('mouseleave', () => { light.style.opacity = '0'; });
    document.body.addEventListener('mouseenter', () => { light.style.opacity = '1'; });


    // 2. ЛЕТАЮЩИЕ ТОЧКИ (ФОН)
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let particlesArray;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.directionX = (Math.random() * 0.4) - 0.2;
            this.directionY = (Math.random() * 0.4) - 0.2;
            this.size = (Math.random() * 3) + 1;
            this.color = 'rgba(106, 156, 201, 0.4)';
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
    }

    window.addEventListener('resize', () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        init();
    });

    init();
    animate();


    // 3. ОТКРЫТИЕ ФОТО (ЛАЙТБОКС) - НОВОЕ!
    const modal = document.getElementById('imageModal');
    
    // Если на странице есть модальное окно (оно есть в about.html)
    if (modal) {
        const modalImg = document.getElementById('modalImg');
        const closeBtn = document.querySelector('.close-modal');
        
        // Находим все картинки внутри блоков дипломов (.cert-item)
        const images = document.querySelectorAll('.cert-item img');

        images.forEach(img => {
            img.addEventListener('click', () => {
                modal.style.display = "flex"; // Сначала показываем блок
                setTimeout(() => { modal.classList.add('show'); }, 10); // Плавно проявляем
                modalImg.src = img.src; // Подставляем картинку
            });
        });

        // Функция закрытия
        function closeModal() {
            modal.classList.remove('show');
            setTimeout(() => { modal.style.display = "none"; }, 300);
        }

        // Закрытие по крестику
        closeBtn.addEventListener('click', closeModal);

        // Закрытие по клику на темный фон
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Закрытие по клавише Esc
        document.addEventListener('keydown', (e) => {
            if (e.key === "Escape" && modal.style.display === "flex") {
                closeModal();
            }
        });
    }
    // --- 4. ЭФФЕКТ ПЕЧАТНОЙ МАШИНКИ (НОВОЕ) ---
    const typewriterElement = document.getElementById('typewriter');
    
    // Если мы на главной странице и нашли элемент
    if (typewriterElement) {
        const words = ["Звукопроизношение", "Заикание", "Дикцию", "Почерк", "Речь перед школой"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                // Удаляем символы
                typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                // Печатаем символы
                typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            // Скорость печати
            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentWord.length) {
                // Если слово напечатано целиком, ждем и начинаем удалять
                typeSpeed = 2000; // Пауза перед удалением
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                // Если слово удалено, переходим к следующему
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length; // Бесконечный цикл
                typeSpeed = 500; // Пауза перед новым словом
            }

            setTimeout(type, typeSpeed);
        }

        // Запуск
        type();
    }
    // --- 5. ЖИВОЙ ЗАГОЛОВОК (НОВОЕ) ---
    let docTitle = document.title; // Запоминаем "Логопед | Анна Борисова"
    
    window.addEventListener("blur", () => {
        document.title = "Вернитесь, мы скучаем! 🥺";
    });
    
    window.addEventListener("focus", () => {
        document.title = docTitle; // Возвращаем нормальное название
    });
    // --- 6. КНОПКА "НАВЕРХ" (НОВОЕ) ---
    
    // 1. Создаем кнопку программно
    const upBtn = document.createElement('button');
    upBtn.id = 'scrollToTopBtn';
    upBtn.innerHTML = '↑'; // Стрелочка
    upBtn.title = "Вернуться наверх";
    document.body.appendChild(upBtn);

    // 2. Следим за прокруткой
    window.addEventListener('scroll', () => {
        // Если прокрутили больше 300px вниз - показываем кнопку
        if (window.scrollY > 300) {
            upBtn.classList.add('show');
        } else {
            upBtn.classList.remove('show');
        }
    });

    // 3. Действие при клике
    upBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Плавная прокрутка
        });
    });

});
