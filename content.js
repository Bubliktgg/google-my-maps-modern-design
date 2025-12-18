// content.js - My Maps Modern Design (Оптимизированная версия)

// ===== КОНФИГУРАЦИЯ =====
const CONFIG = {
    checkboxes: {
        borderColor: '#1d458540',
        checkedColor: '#1d458540'
    },
    header: {
        backgroundColor: '#7a7a7a'
    },
    timing: {
        initialDelay: 2000,
        recheckDelay: 3000,
        sliderDelay: 100
    }
};

// ===== УСТАНОВКА ЛОГОТИПА С ПРОВЕРКОЙ =====
function setPatakaLogo() {
    try {
        // Проверяем наличие переменной PATAKA_BASE64
        if (typeof PATAKA_BASE64 === 'undefined' || !PATAKA_BASE64) {
            console.warn('PATAKA_BASE64 не определена, пропускаем установку логотипа');
            return;
        }

        // Проверяем валидность base64
        if (!PATAKA_BASE64.startsWith('data:image/')) {
            console.warn('PATAKA_BASE64 должна быть data URL');
            return;
        }

        const style = document.createElement('style');
        style.id = 'pataka-logo-style';
        style.textContent = `
            :root {
                --pataka-logo: url(${PATAKA_BASE64}) !important;
            }
            
            .gm-style>div:first-child::before {
                content: '';
                position: absolute;
                right: 108px;
                width: 48px;
                height: 48px;
                background-image: var(--pataka-logo, none);
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                opacity: 1;
                z-index: 999;
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);
        console.log('Логотип Pataka установлен');
    } catch (error) {
        console.warn('Не удалось установить логотип:', error.message);
    }
}

// ===== УТИЛИТЫ =====
function getPageType() {
    const url = window.location.href;
    return url.includes('/viewer?') ? 'viewer' :
        url.includes('/edit?') ? 'edit' : 'other';
}

function safeQuerySelector(selector) {
    try {
        return document.querySelectorAll(selector);
    } catch (e) {
        console.warn(`Некорректный селектор: ${selector}`, e.message);
        return [];
    }
}

// ===== СТИЛИЗАЦИЯ ЧЕКБОКСОВ =====
function styleCheckboxesSafely() {
    try {
        const selectors = [
            '.HzV7m-pbTTYe-PGTmtf.N2RpBe',
            '.N2RpBe-HzV7m-Aql3ge'
        ];

        selectors.forEach(selector => {
            const checkboxes = safeQuerySelector(selector);
            if (!checkboxes.length) return;

            checkboxes.forEach(checkbox => {
                if (!checkbox?.style) return;

                const isChecked = checkbox.getAttribute('aria-checked') === 'true' ||
                    checkbox.classList.contains('N2RpBe-HzV7m-Aql3ge');

                checkbox.style.borderColor = isChecked ?
                    CONFIG.checkboxes.checkedColor :
                    CONFIG.checkboxes.borderColor;
                checkbox.style.transition = 'border-color 0.2s ease';

                const innerCheck = checkbox.querySelector('.PkgjBf');
                if (innerCheck?.style) {
                    innerCheck.style.backgroundColor = isChecked ?
                        CONFIG.checkboxes.checkedColor : 'transparent';
                    innerCheck.style.transition = 'background-color 0.2s ease';
                }
            });
        });
    } catch (error) {
        console.warn('Ошибка стилизации чекбоксов:', error.message);
    }
}

// ===== УЛУЧШЕННЫЕ СЛАЙДЕРЫ =====
function createSliderProgressBar(slider) {
    const track = slider.querySelector('.VIpgJd-SxecR-skjTt');
    if (!track) return null;

    // Удаляем старый прогресс-бар если есть
    const oldBar = track.querySelector('.pataka-slider-progress');
    if (oldBar) oldBar.remove();

    const progressBar = document.createElement('div');
    progressBar.className = 'pataka-slider-progress';
    progressBar.style.cssText = `
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        background: linear-gradient(90deg, #848484ff, #5f5f5fff);
        border-radius: 2px;
        transition: width 0.15s ease;
        z-index: 1;
    `;
    track.appendChild(progressBar);

    return progressBar;
}

function createSliderValueDisplay(handle, value, unit = '%') {
    const oldDisplay = handle.querySelector('.pataka-slider-value');
    if (oldDisplay) oldDisplay.remove();

    const valueDisplay = document.createElement('div');
    valueDisplay.className = 'pataka-slider-value';
    valueDisplay.textContent = `${value} ${unit}`;
    valueDisplay.style.cssText = `
        position: absolute;
        top: -24px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(32, 33, 36, 0.95);
        color: white;
        padding: 3px 6px;
        border-radius: 3px;
        font-size: 10px;
        font-weight: 500;
        font-family: system-ui, -apple-system, sans-serif;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.1s linear;
        z-index: 1000;
        white-space: nowrap;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        min-width: 36px;
        text-align: center;
        backdrop-filter: blur(4px);
    `;
    handle.appendChild(valueDisplay);

    return valueDisplay;
}

function enhanceSlidersWithProgress() {
    try {
        const sliders = safeQuerySelector('.VIpgJd-SxecR:not(.pataka-enhanced)');
        if (!sliders.length) return;

        sliders.forEach(slider => {
            try {
                slider.classList.add('pataka-enhanced');

                const currentValue = parseInt(slider.getAttribute('aria-valuenow') || '0');
                const maxValue = parseInt(slider.getAttribute('aria-valuemax') || '100');
                const minValue = parseInt(slider.getAttribute('aria-valuemin') || '0');

                const progress = maxValue > minValue ?
                    ((currentValue - minValue) / (maxValue - minValue)) * 100 : 0;

                slider.style.setProperty('--slider-progress', `${progress}%`);

                // Создаем прогресс-бар
                const progressBar = createSliderProgressBar(slider);
                if (progressBar) {
                    progressBar.style.width = `${progress}%`;
                }

                // Обновляем значение на ползунке
                const handle = slider.querySelector('.VIpgJd-SxecR-PFprWc');
                if (handle) {
                    handle.style.left = `${progress}%`;

                    // Определяем единицы измерения
                    let unit = '%';
                    if (slider.id === 'stylepopup-borderwidth' || slider.id === 'stylepopup-linewidth') {
                        const pixels = currentValue / (slider.id === 'stylepopup-borderwidth' ? 100 : 1000);
                        unit = 'px';
                        createSliderValueDisplay(handle, Math.round(pixels), unit);
                    } else {
                        createSliderValueDisplay(handle, currentValue, unit);
                    }

                    // Добавляем обработчики для отображения значения
                    handle.addEventListener('mouseenter', () => {
                        const display = handle.querySelector('.pataka-slider-value');
                        if (display) display.style.opacity = '1';
                    });

                    handle.addEventListener('mouseleave', () => {
                        const display = handle.querySelector('.pataka-slider-value');
                        if (display) display.style.opacity = '0';
                    });
                }

                // Наблюдаем за изменениями значения
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.attributeName === 'aria-valuenow') {
                            const newValue = parseInt(slider.getAttribute('aria-valuenow'));
                            const newProgress = maxValue > minValue ?
                                ((newValue - minValue) / (maxValue - minValue)) * 100 : 0;

                            slider.style.setProperty('--slider-progress', `${newProgress}%`);

                            if (progressBar) progressBar.style.width = `${newProgress}%`;
                            if (handle) handle.style.left = `${newProgress}%`;

                            // Обновляем отображаемое значение
                            const valueDisplay = handle?.querySelector('.pataka-slider-value');
                            if (valueDisplay) {
                                if (slider.id === 'stylepopup-borderwidth' || slider.id === 'stylepopup-linewidth') {
                                    const pixels = newValue / (slider.id === 'stylepopup-borderwidth' ? 100 : 1000);
                                    valueDisplay.textContent = `${Math.round(pixels)} px`;
                                } else {
                                    valueDisplay.textContent = `${newValue}%`;
                                }
                            }
                        }
                    });
                });

                observer.observe(slider, {
                    attributes: true,
                    attributeFilter: ['aria-valuenow']
                });

            } catch (sliderError) {
                console.warn('Ошибка улучшения слайдера:', sliderError.message);
            }
        });
    } catch (error) {
        console.warn('Ошибка в enhanceSlidersWithProgress:', error.message);
    }
}

// ===== СТИЛИ ДЛЯ СТРАНИЦ =====
function applyViewerStyles() {
    console.log('🎨 Применяем стили для страницы просмотра');

    // Заголовок
    safeQuerySelector('.HzV7m-tJHJj, .HzV7m-tJHJj .i4ewOd-r4nke').forEach(element => {
        if (element?.style) {
            element.style.backgroundColor = CONFIG.header.backgroundColor;
        }
    });

    // Информационные блоки
    safeQuerySelector('.mU4ghb-X9G3K-tJHJj').forEach(block => {
        if (block?.style) {
            Object.assign(block.style, {
                margin: '12px',
                padding: '16px 20px',
                borderRadius: '12px',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#ffffff'
            });
        }
    });

    // Кнопки редактирования
    safeQuerySelector('.b0t70b-haAclf').forEach(button => {
        if (button?.style) {
            button.style.borderRadius = '10px';
            button.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
        }
    });

    // Основные контейнеры
    safeQuerySelector('div.XKSfm-Sx9Kwc').forEach(element => {
        if (element?.style) {
            Object.assign(element.style, {
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                border: '1px solid #e0e0e0'
            });
        }
    });
}

function applyEditStyles() {
    console.log('🎨 Применяем стили для страницы редактирования');

    // Основные контейнеры
    safeQuerySelector('div.XKSfm-Sx9Kwc').forEach(element => {
        if (element?.style) {
            Object.assign(element.style, {
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                border: '1px solid #e0e0e0'
            });
        }
    });
}

function applyCommonStyles() {
    console.log('🎨 Применяем общие стили');

    // Элементы управления зумом
    safeQuerySelector('.nJjxad-bMcfAe-haAclf').forEach(control => {
        if (control?.style) control.style.borderRadius = '10px';
    });

    // Кнопки увеличения/уменьшения
    safeQuerySelector('.nJjxad-bEDTcc-LgbsSe').forEach(button => {
        if (button?.style) button.style.borderRadius = '10px 10px 0 0';
    });

    safeQuerySelector('.nJjxad-m9bMae-LgbsSe').forEach(button => {
        if (button?.style) button.style.borderRadius = '0 0 10px 10px';
    });
}

function applyAllStyles() {
    const pageType = getPageType();
    console.log(`🎨 My Maps Modern Design: ${pageType} страница`);

    if (pageType === 'viewer') applyViewerStyles();
    if (pageType === 'edit') applyEditStyles();
    applyCommonStyles();
    styleCheckboxesSafely();
    enhanceSlidersWithProgress();
}

// ===== НАБЛЮДАТЕЛЬ ЗА ИЗМЕНЕНИЯМИ =====
function createDOMObserver() {
    try {
        const observer = new MutationObserver(() => {
            // Проверяем наличие целевых элементов
            const targetSelectors = [
                '.HzV7m-tJHJj',
                '.mU4ghb-X9G3K-tJHJj',
                'div.XKSfm-Sx9Kwc',
                '.VIpgJd-SxecR',
                '.HzV7m-pbTTYe-PGTmtf'
            ];

            const hasChanges = targetSelectors.some(selector =>
                document.querySelector(selector)
            );

            if (hasChanges) {
                console.log('🔄 Обнаружены изменения DOM');
                setTimeout(applyAllStyles, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        return observer;
    } catch (error) {
        console.warn('Не удалось создать DOM observer:', error.message);
        return null;
    }
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
function initialize() {
    try {
        const pageType = getPageType();
        console.log(`🚀 My Maps Modern Design запущен (${pageType})`);

        // Устанавливаем логотип если есть
        setPatakaLogo();

        // Применяем стили сразу
        applyAllStyles();

        // Запускаем наблюдатель
        createDOMObserver();

        // Дополнительные проверки
        setTimeout(applyAllStyles, CONFIG.timing.initialDelay);
        setTimeout(() => {
            enhanceSlidersWithProgress();
            styleCheckboxesSafely();
        }, CONFIG.timing.recheckDelay);

    } catch (error) {
        console.error('❌ Ошибка инициализации:', error);
    }
}

// ===== ОБРАБОТЧИКИ СООБЩЕНИЙ =====
function setupMessageHandlers() {
    try {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            try {
                if (request.action === "applyStyles") {
                    applyAllStyles();
                    sendResponse({
                        success: true,
                        pageType: getPageType(),
                        message: `Стили применены (${getPageType()})`
                    });
                } else if (request.action === "getPageInfo") {
                    sendResponse({
                        pageType: getPageType(),
                        url: window.location.href
                    });
                }
            } catch (error) {
                console.warn('Ошибка обработки сообщения:', error.message);
                sendResponse({ success: false, error: error.message });
            }
            return true;
        });
    } catch (error) {
        console.warn('Не удалось настроить обработчики сообщений:', error.message);
    }
}

// ===== ОСНОВНОЙ ЗАПУСК =====
(function main() {
    // Ждем загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initialize();
            setupMessageHandlers();
        });
    } else {
        initialize();
        setupMessageHandlers();
    }

    // Обработчик ошибок изображений
    document.addEventListener('error', (e) => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
        }
    }, true);
})();