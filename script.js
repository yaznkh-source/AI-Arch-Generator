/**
 * منصة الرندرة المعمارية الذكية - جامعة حمص
 * Homs University Architectural Rendering Platform
 * 
 * Main JavaScript File
 * Handles all interactive features and user interactions
 */

// ===== GLOBAL STATE =====
const appState = {
    isLoading: false,
    renderResult: null,
    archStyle: 'modern',
    lightingStyle: 'daylight',
    qualityLevel: 80,
    aspectRatio: '16:9',
    prompt: ''
};

// ===== DOM ELEMENTS =====
const elements = {
    preloader: document.getElementById('preloader'),
    generateBtn: document.getElementById('generateBtn'),
    enhancePromptBtn: document.getElementById('enhancePromptBtn'),
    promptInput: document.getElementById('promptInput'),
    archStyleSelect: document.getElementById('archStyle'),
    lightingStyleSelect: document.getElementById('lightingStyle'),
    qualitySlider: document.getElementById('qualitySlider'),
    resultContainer: document.getElementById('resultContainer'),
    loadingState: document.getElementById('loadingState'),
    idleState: resultContainer?.querySelector('.idle-state'),
    postRenderActions: document.getElementById('postRenderActions'),
    imageModal: document.getElementById('imageModal'),
    modalImage: document.getElementById('modalImage'),
    closeModal: document.querySelector('.close-modal'),
    systemDate: document.getElementById('systemDate'),
    statusText: document.getElementById('statusText')
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    console.log('🏗️ تهيئة تطبيق منصة الرندرة المعمارية...');
    
    // Hide preloader after 2 seconds
    setTimeout(() => {
        hidePreloader();
    }, 2000);

    // Set up event listeners
    setupEventListeners();
    
    // Update system date
    updateSystemDate();
    
    // Initialize smooth scrolling
    initializeSmoothScroll();
    
    console.log('✅ تم تهيئة التطبيق بنجاح');
}

// ===== PRELOADER =====
function hidePreloader() {
    if (elements.preloader) {
        elements.preloader.style.opacity = '0';
        elements.preloader.style.pointerEvents = 'none';
        elements.preloader.style.transition = 'opacity 0.5s ease-out';
        
        setTimeout(() => {
            elements.preloader.style.display = 'none';
        }, 500);
    }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Generate button
    if (elements.generateBtn) {
        elements.generateBtn.addEventListener('click', handleGenerateRender);
    }

    // Enhance prompt button
    if (elements.enhancePromptBtn) {
        elements.enhancePromptBtn.addEventListener('click', handleEnhancePrompt);
    }

    // Prompt input
    if (elements.promptInput) {
        elements.promptInput.addEventListener('input', (e) => {
            appState.prompt = e.target.value;
        });
    }

    // Architecture style select
    if (elements.archStyleSelect) {
        elements.archStyleSelect.addEventListener('change', (e) => {
            appState.archStyle = e.target.value;
            console.log('🏛️ تم تغيير النمط المعماري إلى:', appState.archStyle);
        });
    }

    // Lighting style select
    if (elements.lightingStyleSelect) {
        elements.lightingStyleSelect.addEventListener('change', (e) => {
            appState.lightingStyle = e.target.value;
            console.log('💡 تم تغيير الإضاءة إلى:', appState.lightingStyle);
        });
    }

    // Quality slider
    if (elements.qualitySlider) {
        elements.qualitySlider.addEventListener('input', (e) => {
            appState.qualityLevel = e.target.value;
            console.log('📊 جودة الرندر:', appState.qualityLevel + '%');
        });
    }

    // Modal close button
    if (elements.closeModal) {
        elements.closeModal.addEventListener('click', closeImageModal);
    }

    // Modal background click
    if (elements.imageModal) {
        elements.imageModal.addEventListener('click', (e) => {
            if (e.target === elements.imageModal) {
                closeImageModal();
            }
        });
    }

    // Aspect ratio radio buttons
    const ratioButtons = document.querySelectorAll('input[name="ratio"]');
    ratioButtons.forEach(button => {
        button.addEventListener('change', (e) => {
            appState.aspectRatio = e.target.value;
            console.log('📐 نسبة الأبعاد:', appState.aspectRatio);
        });
    });

    // Download button
    const downloadBtn = document.querySelector('.btn-download');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', handleDownload);
    }

    // Share button
    const shareBtn = document.querySelector('.btn-share');
    if (shareBtn) {
        shareBtn.addEventListener('click', handleShare);
    }

    // Upscale button
    const upscaleBtn = document.querySelector('.btn-upscale');
    if (upscaleBtn) {
        upscaleBtn.addEventListener('click', handleUpscale);
    }
}

// ===== RENDER GENERATION =====
function handleGenerateRender() {
    if (!elements.promptInput.value.trim()) {
        showNotification('الرجاء إدخال وصف المشروع', 'error');
        return;
    }

    appState.isLoading = true;
    
    // Update UI
    elements.generateBtn.disabled = true;
    elements.generateBtn.style.opacity = '0.7';
    
    // Show loading state
    if (elements.idleState) {
        elements.idleState.classList.add('hidden');
    }
    if (elements.loadingState) {
        elements.loadingState.classList.remove('hidden');
    }
    if (elements.postRenderActions) {
        elements.postRenderActions.classList.add('hidden');
    }

    console.log('🚀 بدء عملية الرندرة...');
    console.log('📝 الوصف:', appState.prompt);
    console.log('🎨 النمط:', appState.archStyle);
    console.log('💡 الإضاءة:', appState.lightingStyle);
    console.log('📊 الجودة:', appState.qualityLevel + '%');
    console.log('📐 النسبة:', appState.aspectRatio);

    // Simulate rendering process (3 seconds)
    setTimeout(() => {
        completeRender();
    }, 3000);
}

function completeRender() {
    appState.isLoading = false;
    appState.renderResult = true;

    // Hide loading state
    if (elements.loadingState) {
        elements.loadingState.classList.add('hidden');
    }

    // Show render result
    const resultHTML = `
        <div class="animate-fade-in">
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663058953049/CTLGhCweHHB2cVtgPX2ihQ/hero-bg-modern-architecture-UUg2hqghvz2jBjnGJuiN4K.webp" 
                 alt="رندر معماري" 
                 class="w-full rounded-lg" 
                 style="width: 100%; border-radius: 0.5rem; cursor: pointer;"
                 onclick="openImageModal(this.src)">
        </div>
    `;

    // Clear previous content and add new result
    const resultContainer = document.getElementById('resultContainer');
    if (resultContainer) {
        resultContainer.innerHTML = resultHTML;
    }

    // Show post-render actions
    if (elements.postRenderActions) {
        elements.postRenderActions.classList.remove('hidden');
    }

    // Reset button state
    elements.generateBtn.disabled = false;
    elements.generateBtn.style.opacity = '1';

    console.log('✅ تم إكمال عملية الرندرة بنجاح!');
    showNotification('تم إنشاء الرندرة بنجاح! ✨', 'success');
}

// ===== PROMPT ENHANCEMENT =====
function handleEnhancePrompt() {
    const enhancedPrompts = [
        ' - مع تفاصيل معمارية عالية الدقة، تصوير احترافي، دقة 8K، إضاءة مثالية، تصور معماري متقدم',
        ' - مع ميزات مستدامة، عمارة خضراء، مواد طبيعية، تصور معماري احترافي، جودة 8K',
        ' - مع دقة هندسية بارامترية، تصميم مبتكر، تصور معماري احترافي، دقة 8K عالية'
    ];

    const randomPrompt = enhancedPrompts[Math.floor(Math.random() * enhancedPrompts.length)];
    
    if (elements.promptInput) {
        elements.promptInput.value += randomPrompt;
        appState.prompt = elements.promptInput.value;
        console.log('✨ تم تحسين الوصف تلقائياً');
        showNotification('تم تحسين الوصف بنجاح! ✨', 'success');
    }
}

// ===== CLEAR PROMPT =====
function clearPrompt() {
    if (elements.promptInput) {
        elements.promptInput.value = '';
        appState.prompt = '';
        appState.renderResult = null;
        
        // Reset UI
        if (elements.postRenderActions) {
            elements.postRenderActions.classList.add('hidden');
        }
        
        // Show idle state
        const resultContainer = document.getElementById('resultContainer');
        if (resultContainer) {
            resultContainer.innerHTML = `
                <div class="idle-state">
                    <i class="fa-regular fa-image placeholder-icon"></i>
                    <p id="statusText">المنصة بانتظار إرسال البيانات للمعالجة...</p>
                    <small>سيتم عرض الصورة المعمارية هنا</small>
                </div>
            `;
        }
        
        console.log('🗑️ تم مسح الوصف');
    }
}

// ===== IMAGE MODAL =====
function openImageModal(imageSrc) {
    if (elements.imageModal && elements.modalImage) {
        elements.modalImage.src = imageSrc;
        elements.imageModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        console.log('🖼️ تم فتح معاينة الصورة');
    }
}

function closeImageModal() {
    if (elements.imageModal) {
        elements.imageModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        console.log('✖️ تم إغلاق معاينة الصورة');
    }
}

// ===== POST-RENDER ACTIONS =====
function handleDownload() {
    console.log('📥 جاري تحميل الصورة بدقة 8K...');
    showNotification('جاري تحميل الصورة... يرجى الانتظار', 'info');
    
    // Simulate download
    setTimeout(() => {
        showNotification('تم تحميل الصورة بنجاح! ✅', 'success');
        console.log('✅ اكتمل التحميل');
    }, 2000);
}

function handleShare() {
    console.log('📤 جاري مشاركة الصورة...');
    
    if (navigator.share) {
        navigator.share({
            title: 'منصة الرندرة المعمارية - جامعة حمص',
            text: 'تحقق من هذا الرندر المعماري الرائع!',
            url: window.location.href
        }).then(() => {
            console.log('✅ تم المشاركة بنجاح');
            showNotification('تم المشاركة بنجاح! ✅', 'success');
        }).catch(err => {
            console.error('خطأ في المشاركة:', err);
        });
    } else {
        // Fallback: Copy to clipboard
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            console.log('✅ تم نسخ الرابط إلى الحافظة');
            showNotification('تم نسخ الرابط إلى الحافظة! ✅', 'success');
        });
    }
}

function handleUpscale() {
    console.log('🔍 جاري زيادة دقة الصورة...');
    showNotification('جاري معالجة الصورة لزيادة الدقة... يرجى الانتظار', 'info');
    
    // Simulate upscaling
    setTimeout(() => {
        showNotification('تم زيادة دقة الصورة بنجاح! ✅', 'success');
        console.log('✅ اكتملت عملية زيادة الدقة');
    }, 3000);
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background-color: ${getNotificationColor(type)};
        color: white;
        border-radius: 0.5rem;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        animation: slideInDown 0.3s ease-out;
        font-weight: 600;
        max-width: 400px;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function getNotificationColor(type) {
    const colors = {
        success: '#1B5E20',
        error: '#dc2626',
        info: '#2196F3',
        warning: '#ff9800'
    };
    return colors[type] || colors.info;
}

// ===== SYSTEM DATE =====
function updateSystemDate() {
    if (elements.systemDate) {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        };
        const formatter = new Intl.DateTimeFormat('ar-SA', options);
        elements.systemDate.textContent = formatter.format(now);
    }
}

// ===== SMOOTH SCROLLING =====
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInDown 0.5s ease-out';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for scroll animation
document.querySelectorAll('.gallery-item, .section-header').forEach(el => {
    observer.observe(el);
});

// ===== RESPONSIVE MENU =====
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const desktopMenu = document.querySelector('.desktop-menu');
    
    if (menuToggle && desktopMenu) {
        menuToggle.addEventListener('click', () => {
            desktopMenu.classList.toggle('active');
        });
    }
}

// Initialize mobile menu on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMobileMenu);
} else {
    setupMobileMenu();
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    // Escape key closes modal
    if (e.key === 'Escape') {
        closeImageModal();
    }
    
    // Ctrl/Cmd + Enter generates render
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (elements.generateBtn && !elements.generateBtn.disabled) {
            handleGenerateRender();
        }
    }
});

// ===== PERFORMANCE MONITORING =====
function logPerformance() {
    if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('⏱️ وقت تحميل الصفحة:', pageLoadTime + 'ms');
    }
}

window.addEventListener('load', logPerformance);

// ===== CONSOLE WELCOME MESSAGE =====
console.log('%c🏗️ منصة الرندرة المعمارية الذكية - جامعة حمص', 'font-size: 20px; font-weight: bold; color: #1B5E20;');
console.log('%cHoms University Architectural Rendering Platform', 'font-size: 14px; color: #666;');
console.log('%cتم تطويره بواسطة: المهندس يزن', 'font-size: 12px; color: #999;');
console.log('%cVersion: Nano Banana 3.0', 'font-size: 12px; color: #999;');
