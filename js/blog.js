document.addEventListener('DOMContentLoaded', () => {
    // Элементы фильтров
    const filterBtns = document.querySelectorAll('.blog-filter-btn');
    
    // Все типы карточек
    const blogCards = document.querySelectorAll('.blog-card');
    const blogCardsAlt = document.querySelectorAll('.blog-card-alt');
    const blogCardsBg = document.querySelectorAll('.blog-card-bg');
    const allCards = [...blogCards, ...blogCardsAlt, ...blogCardsBg];
    
    let currentFilter = 'all';
    let isAnimating = false;
    
    // Функция для применения мобильных стилей после фильтрации
    function applyMobileStyles() {
        if (window.innerWidth <= 768) {
            // Принудительно применяем стили для карточек 1 типа
            document.querySelectorAll('.blog-card').forEach(card => {
                card.style.display = 'flex';
                card.style.flexDirection = 'column';
                card.style.gap = '20px';
            });
            
            // Принудительно применяем стили для карточек 2 типа
            document.querySelectorAll('.blog-card-alt').forEach(card => {
                card.style.display = 'flex';
                card.style.flexDirection = 'column';
                card.style.gap = '20px';
            });
            
            // Принудительно применяем стили для карточек 3 типа
            document.querySelectorAll('.blog-card-bg').forEach(card => {
                card.style.display = 'flex';
                card.style.flexDirection = 'column';
                card.style.gap = '20px';
            });
        }
    }
    
    // Для кнопок "читать далее"
    // Функция для инициализации кнопок "читать далее" для первого типа карточек
    function initReadMoreButtonsFirstType() {
        const firstTypeCards = document.querySelectorAll('.blog-card');
        
        firstTypeCards.forEach((card) => {
            const textBlock = card.querySelector('.blog-card-text');
            const wrapper = card.querySelector('.blog-card-text-wrapper');
            let btn = card.querySelector('.read-more-btn');
            
            if (!textBlock) return;
    
            if (btn) {
                btn.remove();
            }
            
            if (window.innerWidth <= 768) {
                const textHeight = textBlock.scrollHeight;
                const lineHeight = 24;
                const maxHeight = lineHeight * 6;
                
                if (textHeight > maxHeight) {
                    textBlock.classList.add('collapsed');
                    
                    btn = document.createElement('button');
                    btn.className = 'read-more-btn';
                    btn.textContent = 'Читать далее';
                    btn.setAttribute('data-readmore', `card-${Date.now()}-${Math.random()}`);
                    
                    btn.addEventListener('click', () => {
                        textBlock.classList.toggle('collapsed');
                        textBlock.classList.toggle('expanded');
                        btn.textContent = textBlock.classList.contains('collapsed') ? 'Читать далее' : 'Свернуть';
                    });
                    
                    if (wrapper) {
                        wrapper.appendChild(btn);
                    }
                } else {
                    textBlock.classList.remove('collapsed');
                    textBlock.classList.remove('expanded');
                }
            } else {
                textBlock.classList.remove('collapsed');
                textBlock.classList.remove('expanded');
            }
        });
    }
    
    // Функция для инициализации кнопок "читать далее" для второго типа карточек
    function initReadMoreButtonsSecondType() {
        const secondTypeCards = document.querySelectorAll('.blog-card-alt');
        
        secondTypeCards.forEach((card) => {
            const textBlock = card.querySelector('.blog-card-alt-text');
            const wrapper = card.querySelector('.blog-card-alt-text-wrapper');
            let btn = card.querySelector('.read-more-btn-alt');
            
            if (!textBlock) return;
            
            if (btn) {
                btn.remove();
            }
            
            if (window.innerWidth <= 768) {
                const textHeight = textBlock.scrollHeight;
                const lineHeight = 24;
                const maxHeight = lineHeight * 6;
                
                if (textHeight > maxHeight) {
                    textBlock.classList.add('collapsed');
                    
                    btn = document.createElement('button');
                    btn.className = 'read-more-btn-alt';
                    btn.textContent = 'Читать далее';
                    btn.setAttribute('data-readmore', `card-alt-${Date.now()}-${Math.random()}`);
                    
                    btn.addEventListener('click', () => {
                        textBlock.classList.toggle('collapsed');
                        textBlock.classList.toggle('expanded');
                        btn.textContent = textBlock.classList.contains('collapsed') ? 'Читать далее' : 'Свернуть';
                    });
                    
                    if (wrapper) {
                        wrapper.appendChild(btn);
                    }
                } else {
                    textBlock.classList.remove('collapsed');
                    textBlock.classList.remove('expanded');
                }
            } else {
                textBlock.classList.remove('collapsed');
                textBlock.classList.remove('expanded');
            }
        });
    }
    
    // Функция для инициализации кнопок "читать далее" для третьего типа карточек
    function initReadMoreButtonsThirdType() {
        const thirdTypeCards = document.querySelectorAll('.blog-card-bg');
        
        thirdTypeCards.forEach((card) => {
            const textBlock = card.querySelector('.blog-card-bg-text');
            const wrapper = card.querySelector('.blog-card-bg-text-wrapper');
            let btn = card.querySelector('.read-more-btn-bg');
            
            if (!textBlock) return;
            
            if (btn) {
                btn.remove();
            }
            
            if (window.innerWidth <= 768) {
                const textHeight = textBlock.scrollHeight;
                const lineHeight = 22;
                const maxHeight = lineHeight * 6;
                
                if (textHeight > maxHeight) {
                    textBlock.classList.add('collapsed');
                    
                    btn = document.createElement('button');
                    btn.className = 'read-more-btn-bg';
                    btn.textContent = 'Читать далее';
                    btn.setAttribute('data-readmore', `card-bg-${Date.now()}-${Math.random()}`);
                    
                    btn.addEventListener('click', () => {
                        textBlock.classList.toggle('collapsed');
                        textBlock.classList.toggle('expanded');
                        btn.textContent = textBlock.classList.contains('collapsed') ? 'Читать далее' : 'Свернуть';
                    });
                    
                    if (wrapper) {
                        wrapper.appendChild(btn);
                    }
                } else {
                    textBlock.classList.remove('collapsed');
                    textBlock.classList.remove('expanded');
                }
            } else {
                textBlock.classList.remove('collapsed');
                textBlock.classList.remove('expanded');
            }
        });
    }
    
    // Общая функция инициализации всех кнопок
    function initAllReadMoreButtons() {
        initReadMoreButtonsFirstType();
        initReadMoreButtonsSecondType();
        initReadMoreButtonsThirdType();
    }
    
    // Функция фильтрации
    function filterCards(filterValue) {
        if (isAnimating) return;
        isAnimating = true;
        
        let visibleCount = 0;
        const cardsToHide = [];
        const cardsToShow = [];
        
        allCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const shouldShow = (filterValue === 'all' || cardCategory === filterValue);
            
            if (shouldShow && card.classList.contains('hide')) {
                cardsToShow.push(card);
            } else if (!shouldShow && !card.classList.contains('hide')) {
                cardsToHide.push(card);
            } else if (shouldShow && !card.classList.contains('hide')) {
                visibleCount++;
            }
        });
        
        // скрытие карточек
        if (cardsToHide.length > 0) {
            cardsToHide.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                
                setTimeout(() => {
                    card.classList.add('hide');
                    card.style.display = 'none';
                    card.style.opacity = '';
                    card.style.transform = '';
                }, 300);
            });
        }
        
        // новые карточки с анимацией
        setTimeout(() => {
            if (cardsToShow.length > 0) {
                cardsToShow.forEach(card => {
                    card.classList.remove('hide');
                    card.style.display = 'grid';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                });
            }
            
            setTimeout(() => {
                // Применяем мобильные стили после показа карточек
                applyMobileStyles();
                initAllReadMoreButtons();
                isAnimating = false;
            }, 400);
        }, cardsToHide.length > 0 ? 350 : 50);
        
        if (cardsToHide.length === 0 && cardsToShow.length === 0) {
            setTimeout(() => {
                isAnimating = false;
            }, 100);
        }
    }
    
    // Обработчики фильтров
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isAnimating) return;
            
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            filterCards(currentFilter);
        });
    });
    
    // Плавное появление карточек
    allCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    setTimeout(() => {
        allCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }, 100);
    
    // Инициализация кнопок "читать далее"
    setTimeout(() => {
        initAllReadMoreButtons();
    }, 500);
    
    // Применяем мобильные стили при загрузке
    applyMobileStyles();
    
    // обновление при ресайзе
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            applyMobileStyles();
            initAllReadMoreButtons();
        }, 200);
    });
    
});