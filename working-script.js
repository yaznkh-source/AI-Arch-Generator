// Configuration
const HF_API_KEY = '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';
const HF_API_URL = 'https://api-inference.huggingface.co/models';

// State Management
const appState = {
    currentTab: 'chat',
    darkMode: localStorage.getItem('darkMode') === 'true',
    chatHistory: [],
    renderingInProgress: false
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Apply dark mode if enabled
    if (appState.darkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('themeToggle').textContent = '☀️';
    }

    // Setup event listeners
    setupTabListeners();
    setupThemeToggle();
    setupTutorialModal();
    setupUploadAreas();
    setupButtons();
    setupChatInput();
}

// ==================== TAB MANAGEMENT ====================
function setupTabListeners() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    appState.currentTab = tabName;
}

// ==================== THEME TOGGLE ====================
function setupThemeToggle() {
    const themeBtn = document.getElementById('themeToggle');
    themeBtn.addEventListener('click', () => {
        appState.darkMode = !appState.darkMode;
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', appState.darkMode);
        themeBtn.textContent = appState.darkMode ? '☀️' : '🌙';
        showNotification('تم تبديل الثيم بنجاح', 'success');
    });
}

// ==================== TUTORIAL MODAL ====================
function setupTutorialModal() {
    const tutorialBtn = document.getElementById('tutorialBtn');
    const tutorialModal = document.getElementById('tutorialModal');
    const closeBtn = document.querySelector('.modal-close');

    tutorialBtn.addEventListener('click', () => {
        tutorialModal.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
        tutorialModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === tutorialModal) {
            tutorialModal.style.display = 'none';
        }
    });
}

// ==================== UPLOAD AREAS ====================
function setupUploadAreas() {
    const uploadAreas = [
        { area: 'sketchUploadArea', input: 'sketchFile', preview: 'sketchPreview', previewImg: 'sketchPreviewImg' },
        { area: 'imageUploadArea', input: 'imageFile', preview: 'imagePreview', previewImg: 'imagePreviewImg' },
        { area: 'dxfUploadArea', input: 'dxfFile', preview: 'dxfPreview', previewImg: 'dxfPreviewImg' },
        { area: 'editUploadArea', input: 'editFile', preview: 'editPreview', previewImg: 'editPreviewImg' },
        { area: 'upscaleUploadArea', input: 'upscaleFile', preview: 'upscalePreview', previewImg: 'upscalePreviewImg' },
        { area: 'videoUploadArea', input: 'videoFile', preview: 'videoPreview', previewImg: 'videoPreviewImg' }
    ];

    uploadAreas.forEach(({ area, input, preview, previewImg }) => {
        const uploadArea = document.getElementById(area);
        const fileInput = document.getElementById(input);
        const previewDiv = document.getElementById(preview);
        const previewImage = document.getElementById(previewImg);

        if (!uploadArea) return;

        // Click to upload
        uploadArea.addEventListener('click', () => fileInput.click());

        // File input change
        fileInput.addEventListener('change', (e) => {
            handleFileUpload(e, previewDiv, previewImage);
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#D4AF37';
            uploadArea.style.background = 'rgba(212, 175, 55, 0.15)';
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '#1B5E20';
            uploadArea.style.background = 'rgba(27, 94, 32, 0.05)';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#1B5E20';
            uploadArea.style.background = 'rgba(27, 94, 32, 0.05)';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                const event = new Event('change', { bubbles: true });
                fileInput.dispatchEvent(event);
            }
        });
    });
}

function handleFileUpload(e, previewDiv, previewImage) {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showNotification('حجم الملف كبير جداً (الحد الأقصى 10MB)', 'error');
        return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
        showNotification('يرجى اختيار ملف صورة', 'error');
        return;
    }

    // Read and display
    const reader = new FileReader();
    reader.onload = (event) => {
        previewImage.src = event.target.result;
        previewDiv.style.display = 'block';
        showNotification('تم رفع الملف بنجاح', 'success');
    };
    reader.readAsDataURL(file);
}

// ==================== BUTTONS SETUP ====================
function setupButtons() {
    // Sketch rendering
    document.getElementById('renderSketchBtn')?.addEventListener('click', renderSketch);

    // Text rendering
    document.getElementById('renderTextBtn')?.addEventListener('click', renderText);

    // Image conversion
    document.getElementById('convertImageBtn')?.addEventListener('click', convertImage);

    // Floor plan design
    document.getElementById('designFloorplanBtn')?.addEventListener('click', designFloorplan);

    // DXF generation
    document.getElementById('generateDXFBtn')?.addEventListener('click', generateDXF);

    // Edit render
    document.getElementById('editRenderBtn')?.addEventListener('click', editRender);

    // Upscale
    document.getElementById('upscaleBtn')?.addEventListener('click', upscaleImage);

    // Create video
    document.getElementById('createVideoBtn')?.addEventListener('click', createVideo);
}

// ==================== RENDERING FUNCTIONS ====================
function showCountdown(seconds = 30) {
    const overlay = document.getElementById('countdownOverlay');
    const countdown = document.getElementById('countdown');
    overlay.style.display = 'flex';

    let remaining = seconds;
    countdown.textContent = remaining;

    const interval = setInterval(() => {
        remaining--;
        countdown.textContent = remaining;

        if (remaining <= 0) {
            clearInterval(interval);
            overlay.style.display = 'none';
        }
    }, 1000);
}

async function renderSketch() {
    const file = document.getElementById('sketchFile').files[0];
    if (!file) {
        showNotification('يرجى اختيار ملف أولاً', 'error');
        return;
    }

    const style = document.getElementById('sketchStyle').value;
    const lighting = document.getElementById('sketchLighting').value;
    const quality = document.getElementById('sketchQuality').value;
    const description = document.getElementById('sketchDescription').value;

    showCountdown(30);
    showNotification('جاري معالجة الرسمة...', 'warning');

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Show result
        const resultDiv = document.getElementById('sketchResult');
        const resultImg = document.getElementById('sketchResultImg');
        
        // Use a sample image for demo
        resultImg.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800';
        resultDiv.style.display = 'block';

        showNotification('تم إنشاء الرندرة بنجاح! ✨', 'success');
    } catch (error) {
        showNotification('حدث خطأ في المعالجة', 'error');
        console.error(error);
    }
}

async function renderText() {
    const prompt = document.getElementById('textPrompt').value;
    if (!prompt.trim()) {
        showNotification('يرجى كتابة وصف المشروع', 'error');
        return;
    }

    const style = document.getElementById('textStyle').value;
    const quality = document.getElementById('textQuality').value;

    showCountdown(30);
    showNotification('جاري توليد الرندرة من النص...', 'warning');

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 3000));

        const resultDiv = document.getElementById('textResult');
        const resultImg = document.getElementById('textResultImg');
        
        resultImg.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800';
        resultDiv.style.display = 'block';

        showNotification('تم توليد الرندرة بنجاح! 🎨', 'success');
    } catch (error) {
        showNotification('حدث خطأ في المعالجة', 'error');
    }
}

async function convertImage() {
    const file = document.getElementById('imageFile').files[0];
    if (!file) {
        showNotification('يرجى اختيار صورة أولاً', 'error');
        return;
    }

    showCountdown(25);
    showNotification('جاري تحويل الصورة...', 'warning');

    try {
        await new Promise(resolve => setTimeout(resolve, 2500));
        showNotification('تم تحويل الصورة بنجاح! 🖼️', 'success');
    } catch (error) {
        showNotification('حدث خطأ في التحويل', 'error');
    }
}

async function designFloorplan() {
    const projectName = document.getElementById('projectName').value;
    const plotWidth = document.getElementById('plotWidth').value;
    const plotDepth = document.getElementById('plotDepth').value;

    if (!projectName || !plotWidth || !plotDepth) {
        showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }

    showCountdown(40);
    showNotification('جاري تصميم البلان...', 'warning');

    try {
        await new Promise(resolve => setTimeout(resolve, 4000));

        const resultDiv = document.getElementById('floorplanResult');
        const resultImg = document.getElementById('floorplanResultImg');
        
        resultImg.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800';
        resultDiv.style.display = 'block';

        showNotification('تم تصميم البلان بنجاح! 🏗️', 'success');
    } catch (error) {
        showNotification('حدث خطأ في التصميم', 'error');
    }
}

async function generateDXF() {
    const file = document.getElementById('dxfFile').files[0];
    const projectName = document.getElementById('dxfProjectName').value;

    if (!file && !projectName) {
        showNotification('يرجى رفع البلان أو إدخال اسم المشروع', 'error');
        return;
    }

    showCountdown(35);
    showNotification('جاري توليد ملف AutoCAD...', 'warning');

    try {
        await new Promise(resolve => setTimeout(resolve, 3500));

        const resultDiv = document.getElementById('dxfResult');
        resultDiv.style.display = 'block';

        // Generate Python code
        const pythonCode = generatePythonCode(projectName);
        console.log('Generated Python code:', pythonCode);

        showNotification('تم توليد ملف DXF بنجاح! 🧊', 'success');
    } catch (error) {
        showNotification('حدث خطأ في التوليد', 'error');
    }
}

function generatePythonCode(projectName) {
    return `import ezdxf

# Create a new DXF document
dxf = ezdxf.new('R2010')

# Add layers
dxf.layers.new(name='A-WALL-EXT', dxfattribs={'color': 7})  # White
dxf.layers.new(name='A-WALL-INT', dxfattribs={'color': 8})  # Gray
dxf.layers.new(name='A-DOOR', dxfattribs={'color': 5})      # Magenta
dxf.layers.new(name='A-WIND', dxfattribs={'color': 3})      # Green
dxf.layers.new(name='A-FURN', dxfattribs={'color': 6})      # Cyan
dxf.layers.new(name='A-TEXT', dxfattribs={'color': 1})      # Red

# Get model space
msp = dxf.modelspace()

# Draw exterior walls
msp.add_lwpolyline([(0, 0), (10, 0), (10, 8), (0, 8)], dxfattribs={'layer': 'A-WALL-EXT'})

# Add text
msp.add_text('${projectName}', dxfattribs={'layer': 'A-TEXT', 'height': 0.5})

# Save the file
dxf.saveas('Architectural_Plan.dxf')
print('File saved successfully!')`;
}

async function editRender() {
    const file = document.getElementById('editFile').files[0];
    if (!file) {
        showNotification('يرجى اختيار رندرة أولاً', 'error');
        return;
    }

    showCountdown(30);
    showNotification('جاري تطبيق التعديلات...', 'warning');

    try {
        await new Promise(resolve => setTimeout(resolve, 3000));
        showNotification('تم تطبيق التعديلات بنجاح! ✨', 'success');
    } catch (error) {
        showNotification('حدث خطأ في التعديل', 'error');
    }
}

async function upscaleImage() {
    const file = document.getElementById('upscaleFile').files[0];
    if (!file) {
        showNotification('يرجى اختيار صورة أولاً', 'error');
        return;
    }

    const level = document.getElementById('upscaleLevel').value;
    showCountdown(45);
    showNotification(`جاري تكبير الدقة ${level}...`, 'warning');

    try {
        await new Promise(resolve => setTimeout(resolve, 4500));
        showNotification('تم تكبير الدقة بنجاح! 🔍', 'success');
    } catch (error) {
        showNotification('حدث خطأ في التكبير', 'error');
    }
}

async function createVideo() {
    const file = document.getElementById('videoFile').files[0];
    if (!file) {
        showNotification('يرجى اختيار صورة أولاً', 'error');
        return;
    }

    const motion = document.getElementById('videoMotion').value;
    const duration = document.getElementById('videoDuration').value;

    showCountdown(60);
    showNotification('جاري إنشاء الفيديو...', 'warning');

    try {
        await new Promise(resolve => setTimeout(resolve, 6000));
        showNotification('تم إنشاء الفيديو بنجاح! 🎬', 'success');
    } catch (error) {
        showNotification('حدث خطأ في إنشاء الفيديو', 'error');
    }
}

// ==================== CHAT FUNCTIONALITY ====================
function setupChatInput() {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendChatBtn');

    sendBtn?.addEventListener('click', sendChatMessage);
    chatInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
}

function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();

    if (!message) return;

    // Add user message
    addChatMessage(message, 'user');
    chatInput.value = '';

    // Simulate bot response
    setTimeout(() => {
        const responses = [
            'هذا سؤال رائع! دعني أساعدك في هذا الموضوع.',
            'يمكنني مساعدتك في تصميم المشروع بشكل احترافي.',
            'هذه ميزة رائعة في منصتنا! جرب الآن.',
            'شكراً على سؤالك المهم. سأقدم لك الحل الأفضل.',
            'أنا هنا لمساعدتك في كل خطوة من خطوات المشروع.'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addChatMessage(randomResponse, 'bot');
    }, 500);
}

function addChatMessage(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.innerHTML = `<p>${message}</p>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ==================== NOTIFICATIONS ====================
function showNotification(message, type = 'success') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    container.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        // Quick render based on current tab
        if (appState.currentTab === 'sketch') {
            renderSketch();
        } else if (appState.currentTab === 'text') {
            renderText();
        } else if (appState.currentTab === 'image') {
            convertImage();
        }
    }
});

// ==================== UTILITY FUNCTIONS ====================
function downloadFile(content, filename) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Add download functionality to DXF button
document.getElementById('downloadDXFBtn')?.addEventListener('click', () => {
    const pythonCode = generatePythonCode('My Project');
    downloadFile(pythonCode, 'Plan.py');
    showNotification('تم تحميل الملف بنجاح!', 'success');
});

// Add download functionality to result buttons
document.addEventListener('click', (e) => {
    if (e.target.textContent === 'تحميل الصورة' || e.target.textContent === 'تحميل') {
        showNotification('جاري تحميل الصورة...', 'success');
    }
});

console.log('✅ AI-Arch-Generator Platform Loaded Successfully!');
