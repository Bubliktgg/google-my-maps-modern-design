document.addEventListener('DOMContentLoaded', function () {
    const refreshBtn = document.getElementById('refreshStyles');
    const status = document.getElementById('status');
    const pageInfo = document.getElementById('pageInfo');

    loadPageInfo();

    refreshBtn.addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (!tabs || !tabs[0]) {
                showStatus('❌ Не удалось найти активную вкладку', 'error');
                return;
            }

            chrome.tabs.sendMessage(tabs[0].id, {
                action: "applyStyles"
            }, function (response) {
                if (chrome.runtime.lastError) {
                    showStatus('❌ Расширение не активировано на этой странице', 'error');
                    return;
                }

                if (response && response.success) {
                    showStatus(`✅ ${response.message}`, 'success');
                    loadPageInfo();
                } else {
                    showStatus('❌ Ошибка применения стилей', 'error');
                }
            });
        });
    });

    function loadPageInfo() {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (!tabs || !tabs[0]) {
                pageInfo.textContent = 'Информация о странице недоступна';
                return;
            }

            chrome.tabs.sendMessage(tabs[0].id, {
                action: "getPageInfo"
            }, function (response) {
                if (chrome.runtime.lastError) {
                    pageInfo.textContent = 'Расширение не активировано на этой странице';
                    return;
                }

                if (response) {
                    const pageTypes = {
                        'viewer': 'просмотра',
                        'edit': 'редактирования',
                        'main': 'главная (список карт)'
                    };

                    const pageTypeText = pageTypes[response.pageType] || 'неизвестная';

                    pageInfo.textContent = `Текущая страница: ${pageTypeText}`;
                } else {
                    pageInfo.textContent = 'Информация о странице недоступна';
                }
            });
        });
    }

    function showStatus(message, type = 'success') {
        if (!status) return;

        status.textContent = message;
        status.className = `status show ${type === 'error' ? 'error' : ''}`;

        setTimeout(() => {
            status.classList.remove('show');
        }, 3000);
    }
});