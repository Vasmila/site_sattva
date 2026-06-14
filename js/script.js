document.addEventListener('DOMContentLoaded', () => {
    // карточки акций
    const promotionsSlider = document.querySelector('.promotions-slider');
    const promotionsTrack = document.querySelector('.promotions-track');
    const promotionCards = document.querySelectorAll('.promotion-card');
    const promotionDots = document.querySelectorAll('#promotionsDots .dot');
    
    if (promotionsSlider && promotionsTrack && promotionCards.length > 0) {
        initSlider(promotionsSlider, promotionsTrack, promotionCards, promotionDots, 'promotions');
    }
    
    // карточки услуг
    const servicesSlider = document.querySelector('.services-slider');
    const servicesTrack = document.querySelector('.services-track');
    const serviceCards = document.querySelectorAll('.service-card');
    const serviceDots = document.querySelectorAll('#servicesDots .dot');
    
    if (servicesSlider && servicesTrack && serviceCards.length > 0) {
        initSlider(servicesSlider, servicesTrack, serviceCards, serviceDots, 'services');
    }
    
    // Функция инициализации слайдера
    function initSlider(slider, track, cards, dots, type) {
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let startScrollLeft = 0;
        let currentIndex = 0;
        let cardWidth = 0;
        let isHorizontalSwipe = false;
        let isMoved = false;
        
        // Функция обновления ширины карточки
        function updateCardWidth() {
            if (cards.length > 0) {
                cardWidth = cards[0].offsetWidth;
            }
        }
        
        // Функция скролла к определенному индексу
        function scrollToIndex(index, animate = true) {
            if (index < 0) index = 0;
            const maxIndex = cards.length - 1;
            if (index > maxIndex) index = maxIndex;
            
            currentIndex = index;
            const scrollPosition = index * (cardWidth + 24);
            
            if (animate) {
                track.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                track.style.transform = `translateX(-${scrollPosition}px)`;
            } else {
                track.style.transition = 'none';
                track.style.transform = `translateX(-${scrollPosition}px)`;
                void track.offsetHeight;
            }
            
            if (dots && dots.length > 0) {
                updateDots(index, dots);
            }
        }
        
        // Функция обновления dots
        function updateDots(index, dotsArray) {
            dotsArray.forEach((dot, i) => {
                if (i === index) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        // Функция определения ближайшего индекса (только соседние карточки)
        function getNearestIndex(scrollLeft) {
            const step = cardWidth + 24;
            const currentCardIndex = scrollLeft / step;
            const remainder = currentCardIndex - Math.floor(currentCardIndex);
            
            // Если прокручено больше половины карточки - переключаем на следующую
            if (remainder > 0.5) {
                return Math.min(Math.floor(currentCardIndex) + 1, cards.length - 1);
            } else {
                return Math.floor(currentCardIndex);
            }
        }
        
        // Обработчик начала перетаскивания
        const startDrag = (e) => {
            isDragging = true;
            isMoved = false;
            isHorizontalSwipe = false;
            startX = e.type === 'mousedown' ? e.pageX : e.touches[0].pageX;
            startY = e.type === 'mousedown' ? e.pageY : e.touches[0].pageY;
            startScrollLeft = parseFloat(track.style.transform.replace('translateX(-', '').replace('px)', '')) || 0;
            track.style.transition = 'none';
            slider.style.cursor = 'grabbing';
        };
        
        // Обработчик движения
        const onDrag = (e) => {
            if (!isDragging) return;
            
            const currentX = e.type === 'mousemove' ? e.pageX : e.touches[0].pageX;
            const currentY = e.type === 'mousemove' ? e.pageY : e.touches[0].pageY;
            const deltaX = Math.abs(currentX - startX);
            const deltaY = Math.abs(currentY - startY);
            
            // Определяем направление после первого движения (более 5px)
            if (!isHorizontalSwipe && (deltaX > 5 || deltaY > 5)) {
                isHorizontalSwipe = deltaX > deltaY;
            }
            
            // Если это горизонтальный свайп - скроллим слайдер
            if (isHorizontalSwipe) {
                e.preventDefault();
                isMoved = true;
                let newScrollLeft = startScrollLeft - (currentX - startX);
                
                const step = cardWidth + 24;
                const maxScroll = (cards.length - 1) * step;
                newScrollLeft = Math.max(0, Math.min(newScrollLeft, maxScroll));
                
                track.style.transform = `translateX(-${newScrollLeft}px)`;
            }
        };
        
        // Обработчик окончания перетаскивания
        const endDrag = (e) => {
            if (!isDragging) return;
            isDragging = false;
            slider.style.cursor = 'grab';
            
            // Если был горизонтальный свайп и было движение - фиксируем позицию
            if (isHorizontalSwipe && isMoved) {
                const currentScrollLeft = parseFloat(track.style.transform.replace('translateX(-', '').replace('px)', '')) || 0;
                const nearestIndex = getNearestIndex(currentScrollLeft);
                
                track.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                scrollToIndex(nearestIndex, true);
            } else if (!isHorizontalSwipe && !isMoved) {
                // Если это был клик, а не свайп - ничего не делаем
                // Карточка откроется по ссылке
            }
            
            isHorizontalSwipe = false;
            isMoved = false;
        };
        
        // Клик по dots
        if (dots && dots.length > 0) {
            dots.forEach((dot, index) => {
                if (index < cards.length) {
                    dot.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        scrollToIndex(index, true);
                    });
                }
            });
        }
        
        // Обновление при ресайзе
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                updateCardWidth();
                const scrollPosition = currentIndex * (cardWidth + 24);
                track.style.transition = 'none';
                track.style.transform = `translateX(-${scrollPosition}px)`;
                void track.offsetHeight;
            }, 150);
        });
        
        // Наблюдатель за изменением размера карточек
        const resizeObserver = new ResizeObserver(() => {
            updateCardWidth();
            const scrollPosition = currentIndex * (cardWidth + 24);
            track.style.transform = `translateX(-${scrollPosition}px)`;
        });
        
        cards.forEach(card => {
            resizeObserver.observe(card);
        });
        
        // Инициализация
        updateCardWidth();
        scrollToIndex(0, false);
        
        // Добавляем обработчики для мыши
        slider.addEventListener('mousedown', startDrag);
        window.addEventListener('mousemove', onDrag);
        window.addEventListener('mouseup', endDrag);
        
        // Добавляем обработчики для тач-событий
        slider.addEventListener('touchstart', startDrag, { passive: false });
        window.addEventListener('touchmove', onDrag, { passive: false });
        window.addEventListener('touchend', endDrag);
        
        // Защита от выделения текста
        slider.addEventListener('dragstart', (e) => e.preventDefault());
        
        // Устанавливаем курсор
        slider.style.cursor = 'grab';
        
        // Предотвращаем всплытие кликов на карточках
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
    }
});