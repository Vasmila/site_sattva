document.addEventListener('DOMContentLoaded', () => {
    // Данные карточек сертификатов
    const certificatesData = [
        {
            id: 0,
            color: 0,
            title: 'Сертификат "Первое посещение"',
            text: 'Этот сертификат — ваш персональный пропуск в мир глубокого расслабления и гармонии. Мы знаем, как важно иногда поставить мир на паузу, поэтому подготовили особенное предложение для вашего первого знакомства с нашими ритуалами.',
            price: 'Восточный массаж (60 мин)',
            time: '1 200 ₽',
            img: 'img/cert_1.png'
        },
        {
            id: 1,
            color: 1,
            title: 'Сертификат на любую услугу',
            text: 'Идеальный выбор для тех, кто хочет сам определить свой формат отдыха. В  этот сертификат можно вписать любую услугу нашего салона, цена меняется соответственно выбранной услуге. Сделай выбор в пользу своего здоровья',
            price: 'выбери услугу',
            time: '1 200 - 6 000 ₽',
            img: 'img/cert_2.png'
        },
        {
            id: 2,
            color: 2,
            title: 'Сертификат "5000"',
            text: 'Номинал 5 000 ₽. Можно использовать для одной полноценной программы или комбинации нескольких процедур. Лучший способ восстановить силы.',
            price: 'номинал 5000 ₽',
            time: '5 000 ₽',
            img: 'img/cert_3.png'
        }
    ];

    // Текущее состояние
    let currentLargeIndex = 0;
    let currentSmallIndexes = [1, 2];

    // DOM элементы
    const certLargeCard = document.getElementById('certLargeCard');
    const largeTitle = document.getElementById('largeTitle');
    const largeText = document.getElementById('largeText');
    const largePrice = document.getElementById('largePrice');
    const largeTime = document.getElementById('largeTime');
    const largeImg = document.getElementById('largeImg');
    const largeBtn = document.getElementById('largeBtn');
    const certRow = document.getElementById('certRow');

    // Обновление большой карточки
    function updateLargeCard() {
        const data = certificatesData[currentLargeIndex];
        if (!data) return;
        
        largeTitle.textContent = data.title;
        largeText.textContent = data.text;
        largePrice.textContent = data.price;
        largeTime.textContent = data.time;
        largeImg.src = data.img;
        largeImg.alt = data.title;
        
        if (certLargeCard) {
            certLargeCard.setAttribute('data-cert-color', data.color);
        }
    }

    // Пересоздание маленьких карточек
    function rebuildSmallCards() {
        if (!certRow) return;
        
        certRow.innerHTML = '';
        
        currentSmallIndexes.forEach((dataIndex) => {
            const data = certificatesData[dataIndex];
            if (!data) return;
            
            const card = document.createElement('div');
            card.className = 'cert-card-small';
            card.setAttribute('data-cert-index', dataIndex);
            card.setAttribute('data-cert-color', data.color);
            
            card.innerHTML = `
                <div class="cert-small-left">
                    <h4 class="cert-small-title">${data.title}</h4>
                    <div class="cert-price-block-vertical small">
                        <span class="cert-price-value">${data.price}</span>
                        <div class="cert-line"></div>
                        <span class="cert-time">${data.time}</span>
                    </div>
                </div>
                <div class="cert-small-right">
                    <img src="${data.img}" alt="${data.title}">
                </div>
            `;
            
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                const clickedIndex = parseInt(card.getAttribute('data-cert-index'), 10);
                swapCards(clickedIndex);
            });
            
            card.style.cursor = 'pointer';
            certRow.appendChild(card);
        });
    }

    // Функция обмена карточек
    function swapCards(clickedDataIndex) {
        if (clickedDataIndex === currentLargeIndex) return;
        
        const positionInSmall = currentSmallIndexes.findIndex(idx => idx === clickedDataIndex);
        if (positionInSmall === -1) return;
        
        const oldLargeIndex = currentLargeIndex;
        const newLargeIndex = clickedDataIndex;
        const newSmallIndexes = [...currentSmallIndexes];
        newSmallIndexes[positionInSmall] = oldLargeIndex;
        
        if (certLargeCard) {
            certLargeCard.style.transition = 'all 0.3s ease';
            certLargeCard.style.opacity = '0.6';
            
            setTimeout(() => {
                currentLargeIndex = newLargeIndex;
                currentSmallIndexes = newSmallIndexes;
                
                updateLargeCard();
                rebuildSmallCards();
                
                certLargeCard.style.opacity = '1';
            }, 150);
        } else {
            currentLargeIndex = newLargeIndex;
            currentSmallIndexes = newSmallIndexes;
            updateLargeCard();
            rebuildSmallCards();
        }
    }

    // Десктоп инициализация
    function initDesktop() {
        updateLargeCard();
        rebuildSmallCards();
    }

    // Мобильная версия
    const certificatesMobile = document.querySelector('.certificates-mobile');
    const certMobileSlider = document.querySelector('.certificates-mobile .cert-mobile-track') || (() => {
        const mobileContainer = document.querySelector('.certificates-mobile');
        if (mobileContainer && !document.querySelector('.cert-mobile-track')) {
            const track = document.createElement('div');
            track.className = 'cert-mobile-track';
            const dots = document.createElement('div');
            dots.className = 'cert-mobile-dots';
            dots.id = 'certMobileDots';
            mobileContainer.innerHTML = '';
            mobileContainer.appendChild(track);
            mobileContainer.appendChild(dots);
            return track;
        }
        return document.querySelector('.cert-mobile-track');
    })();
    
    const certMobileTrack = document.querySelector('.cert-mobile-track');
    const certMobileDots = document.querySelector('#certMobileDots');
    
    let mobileIsDragging = false;
    let mobileStartX = 0;
    let mobileStartY = 0;
    let mobileStartTransform = 0;
    let mobileCurrentIndex = 0;
    let mobileCardWidth = 0;
    let mobileGap = 20;
    let isHorizontalScroll = false; // Флаг для определения направления скролла

    function updateMobileCardWidth() {
        const cards = document.querySelectorAll('.cert-mobile-card');
        if (cards.length > 0) {
            mobileCardWidth = cards[0].offsetWidth;
        }
        const track = certMobileTrack;
        if (track) {
            const style = window.getComputedStyle(track);
            mobileGap = parseFloat(style.gap) || 20;
        }
    }

    function scrollToMobileCard(index, animate = true) {
        if (index < 0) index = 0;
        const maxIndex = certificatesData.length - 1;
        if (index > maxIndex) index = maxIndex;
        
        mobileCurrentIndex = index;
        const scrollPosition = index * (mobileCardWidth + mobileGap);
        
        if (animate) {
            certMobileTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            certMobileTrack.style.transform = `translateX(-${scrollPosition}px)`;
        } else {
            certMobileTrack.style.transition = 'none';
            certMobileTrack.style.transform = `translateX(-${scrollPosition}px)`;

            certMobileTrack.offsetHeight;
            certMobileTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
        // Обновляем точки
        if (certMobileDots) {
            const dots = certMobileDots.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                if (i === index) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
    }

    function getNearestMobileIndex(scrollLeft) {
        const step = mobileCardWidth + mobileGap;
        const index = Math.round(scrollLeft / step);
        const maxIndex = certificatesData.length - 1;
        return Math.max(0, Math.min(index, maxIndex));
    }

    function getCurrentTranslateX() {
        const transform = certMobileTrack.style.transform;
        if (transform && transform !== 'none') {
            const match = transform.match(/translateX\(-([\d.]+)px\)/);
            if (match) {
                return parseFloat(match[1]);
            }
        }
        return 0;
    }

    const startDrag = (e) => {
        mobileIsDragging = true;
        isHorizontalScroll = false;
        mobileStartX = e.type === 'mousedown' ? e.pageX : e.touches[0].pageX;
        mobileStartY = e.type === 'mousedown' ? e.pageY : e.touches[0].pageY;
        mobileStartTransform = getCurrentTranslateX();
        certMobileTrack.style.transition = 'none';
        certMobileTrack.style.cursor = 'grabbing';
    };
    
    const onDrag = (e) => {
        if (!mobileIsDragging) return;
        
        const currentX = e.type === 'mousemove' ? e.pageX : e.touches[0].pageX;
        const currentY = e.type === 'mousemove' ? e.pageY : e.touches[0].pageY;
        const deltaX = Math.abs(currentX - mobileStartX);
        const deltaY = Math.abs(currentY - mobileStartY);
        
        // Определяем направление скролла после небольшого движения
        if (!isHorizontalScroll && (deltaX > 5 || deltaY > 5)) {
            isHorizontalScroll = deltaX > deltaY;
        }
        
        // Если это горизонтальный скролл - предотвращаем прокрутку страницы
        if (isHorizontalScroll) {
            e.preventDefault();
            const deltaMoveX = currentX - mobileStartX;
            let newTransform = mobileStartTransform - deltaMoveX;
            
            const step = mobileCardWidth + mobileGap;
            const maxTransform = (certificatesData.length - 1) * step;
            newTransform = Math.max(0, Math.min(newTransform, maxTransform));
            
            certMobileTrack.style.transform = `translateX(-${newTransform}px)`;
        }
        // Если вертикальный - ничего не делаем, страница скроллится естественным образом
    };
    
    const endDrag = () => {
        if (!mobileIsDragging) return;
        mobileIsDragging = false;
        certMobileTrack.style.cursor = 'grab';
        
        // Если был горизонтальный скролл - фиксируем позицию
        if (isHorizontalScroll) {
            const currentTransform = getCurrentTranslateX();
            const nearestIndex = getNearestMobileIndex(currentTransform);
            
            certMobileTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            scrollToMobileCard(nearestIndex, true);
        }
        
        // Сбрасываем флаги
        isHorizontalScroll = false;
    };

    function initMobileSlider() {
        if (!certMobileTrack || !certMobileDots) return;
        
        certMobileTrack.innerHTML = '';
        certMobileDots.innerHTML = '';
        
        // Создаем карточки
        certificatesData.forEach((cert, index) => {
            const card = document.createElement('div');
            card.className = 'cert-mobile-card';
            card.setAttribute('data-mobile-color', cert.color);
            card.innerHTML = `
                <h4 class="cert-mobile-title">${cert.title}</h4>
                <p class="cert-mobile-text">${cert.text}</p>
                <div class="cert-mobile-image">
                    <img src="${cert.img}" alt="${cert.title}">
                </div>
                <div class="cert-mobile-info">
                    <span class="cert-mobile-price">${cert.price}</span>
                    <div class="cert-mobile-line"></div>
                    <span class="cert-mobile-time">${cert.time}</span>
                </div>
                <a href="#" class="cert-mobile-btn" onclick="openBookingModal(); return false;">Заказать</a>
            `;
            certMobileTrack.appendChild(card);
            
            // Точки
            const dot = document.createElement('span');
            dot.className = 'dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                scrollToMobileCard(index, true);
            });
            certMobileDots.appendChild(dot);
        });
        

        updateMobileCardWidth();
        
        // Устанавливаем начальную позицию
        scrollToMobileCard(0, false);
        
        // Добавляем обработчики для мыши
        certMobileTrack.addEventListener('mousedown', startDrag);
        window.addEventListener('mousemove', onDrag);
        window.addEventListener('mouseup', endDrag);
        
        // Добавляем обработчики для тач-событий (с пассивным слушателем для вертикального скролла)
        certMobileTrack.addEventListener('touchstart', startDrag, { passive: false });
        window.addEventListener('touchmove', onDrag, { passive: false });
        window.addEventListener('touchend', endDrag);
        
        // Защита от выделения текста
        certMobileTrack.addEventListener('dragstart', (e) => e.preventDefault());
        
        // Устанавливаем курсор
        certMobileTrack.style.cursor = 'grab';
        
        // Обновление при ресайзе
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                updateMobileCardWidth();
                scrollToMobileCard(mobileCurrentIndex, false);
            }, 150);
        });
    }

    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    function handleResize() {
        if (isMobile()) {
            initMobileSlider();
        } else {
            initDesktop();
        }
    }
    
    handleResize();
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 200);
    });
});