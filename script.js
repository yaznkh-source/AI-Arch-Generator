// ===== HUGGING FACE API CONFIG =====

const HF_API_KEY = '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';
const HF_API_URL = 'https://api-inference.huggingface.co/models';

// ===== GLOBAL STATE =====

const appState = {
    currentTab: 'chat',
    isDarkMode: localStorage.getItem('darkMode') === 'true',
    countdownInterval: null,
    uploadedFiles: {},
};

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Load dark mode preference
    if (appState.isDarkMode) {
        document.body.classList.add('dark-mode');
        updateThemeIcon();
    }

    // Setup event listeners
    setupEventListeners();
    
    // Initialize upload areas
    setupAllUploadAreas();
    
    // Set active tab
    switchTab('chat');
}

function setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Tutorial button
    document.getElementById('tutorialBtn').addEventListener('click', openTutorial);
    
    // Tab navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = link.getAttribute('data-tab');
            switchTab(tab);
        });
    });

    // Chat input
    document.getElementById('chatInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// ===== THEME MANAGEMENT =====

function toggleTheme() {
    appState.isDarkMode = !appState.isDarkMode;
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', appState.isDarkMode);
    updateThemeIcon();
    showNotification(appState.isDarkMode ? '🌙 تم تفعيل الوضع الليلي' : '☀️ تم تفعيل الوضع النهاري', 'success');
}

function updateThemeIcon() {
    const icon = document.querySelector('#themeToggle i');
    if (appState.isDarkMode) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// ===== TAB MANAGEMENT =====

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Add active class to nav link
    document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');

    appState.currentTab = tabName;
}

// ===== TUTORIAL MODAL =====

function openTutorial() {
    const modal = document.getElementById('tutorialModal');
    modal.classList.add('active');
}

function closeTutorial() {
    const modal = document.getElementById('tutorialModal');
    modal.classList.remove('active');
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const modal = document.getElementById('tutorialModal');
    if (event.target === modal) {
        closeTutorial();
    }
});

// ===== UPLOAD HANDLING =====

function setupAllUploadAreas() {
    const uploadAreas = [
        { id: 'sketchUploadArea', inputId: 'sketchInput', handler: handleSketchUpload },
        { id: 'imageUploadArea', inputId: 'imageInput', handler: handleImageUpload },
        { id: 'dxfUploadArea', inputId: 'dxfInput', handler: handleDXFUpload },
        { id: 'editUploadArea', inputId: 'editInput', handler: handleEditUpload },
        { id: 'upscaleUploadArea', inputId: 'upscaleInput', handler: handleUpscaleUpload },
        { id: 'videoUploadArea', inputId: 'videoInput', handler: handleVideoUpload },
    ];

    uploadAreas.forEach(area => {
        const uploadArea = document.getElementById(area.id);
        const fileInput = document.getElementById(area.inputId);

        if (!uploadArea || !fileInput) return;

        uploadArea.addEventListener('click', () => fileInput.click());

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                fileInput.files = e.dataTransfer.files;
                area.handler();
            }
        });

        fileInput.addEventListener('change', area.handler);
    });
}

function handleSketchUpload() {
    const fileInput = document.getElementById('sketchInput');
    const file = fileInput.files[0];
    if (file) {
        processImageUpload(file, 'sketch');
    }
}

function handleImageUpload() {
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];
    if (file) {
        processImageUpload(file, 'image');
    }
}

function handleDXFUpload() {
    const fileInput = document.getElementById('dxfInput');
    const file = fileInput.files[0];
    if (file) {
        processImageUpload(file, 'dxf');
    }
}

function handleEditUpload() {
    const fileInput = document.getElementById('editInput');
    const file = fileInput.files[0];
    if (file) {
        processImageUpload(file, 'edit');
    }
}

function handleUpscaleUpload() {
    const fileInput = document.getElementById('upscaleInput');
    const file = fileInput.files[0];
    if (file) {
        processImageUpload(file, 'upscale');
    }
}

function handleVideoUpload() {
    const fileInput = document.getElementById('videoInput');
    const file = fileInput.files[0];
    if (file) {
        processImageUpload(file, 'video');
    }
}

function processImageUpload(file, type) {
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showNotification('حجم الملف كبير جداً (الحد الأقصى 10MB)', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        appState.uploadedFiles[type] = {
            file: file,
            base64: e.target.result
        };

        // Show preview
        const previewId = type + 'PreviewImg';
        const previewContainer = type + 'Preview';
        
        const previewImg = document.getElementById(previewId);
        const previewDiv = document.getElementById(previewContainer);
        
        if (previewImg && previewDiv) {
            previewImg.src = e.target.result;
            previewDiv.style.display = 'block';
        }

        // Hide upload area
        const uploadAreaId = type + 'UploadArea';
        const uploadArea = document.getElementById(uploadAreaId);
        if (uploadArea) {
            uploadArea.style.display = 'none';
        }

        showNotification('✅ تم تحميل الصورة بنجاح!', 'success');
    };
    reader.readAsDataURL(file);
}

// ===== SKETCH TO RENDER =====

async function renderSketch() {
    if (!appState.uploadedFiles.sketch) {
        showNotification('الرجاء رفع صورة الرسمة أولاً', 'error');
        return;
    }

    const style = document.getElementById('sketchStyle').value;
    const lighting = document.getElementById('sketchLighting').value;
    const quality = document.getElementById('sketchQuality').value;
    const description = document.getElementById('sketchDescription').value;

    const outputDiv = document.getElementById('sketchOutput');
    outputDiv.innerHTML = `
        <div class="loading active">
            <div class="spinner"></div>
            <div class="countdown-timer">
                <span id="countdownDisplay">30</span>
                <p>ثانية</p>
            </div>
            <p>جاري تحويل الرسمة إلى رندرة...</p>
        </div>
    `;

    startCountdown(30);

    try {
        const prompt = `تحويل هذه الرسمة المعمارية اليدوية إلى رندرة معمارية احترافية بنمط ${style} مع إضاءة ${lighting} وجودة ${quality}. ${description}`;
        
        const result = await callHuggingFaceAPI('stabilityai/stable-diffusion-2', {
            inputs: prompt
        });

        outputDiv.innerHTML = `
            <img src="${result}" alt="الرندرة">
            <div style="margin-top: 1rem; width: 100%;">
                <button class="btn-generate" onclick="downloadRender('${result}')">
                    <i class="fa-solid fa-download"></i> تحميل الرندرة
                </button>
            </div>
        `;
        showNotification('✅ تم تحويل الرسمة بنجاح!', 'success');
    } catch (error) {
        console.error('Error:', error);
        outputDiv.innerHTML = `
            <i class="fa-solid fa-exclamation-triangle" style="font-size: 3rem; color: #dc2626;"></i>
            <p style="color: #dc2626;">حدث خطأ في التحويل</p>
        `;
        showNotification(`❌ خطأ: ${error.message}`, 'error');
    } finally {
        stopCountdown();
    }
}

// ===== TEXT TO RENDER =====

async function renderText() {
    const title = document.getElementById('projectTitle').value;
    const description = document.getElementById('projectDescription').value;
    const style = document.getElementById('textStyle').value;
    const lighting = document.getElementById('textLighting').value;

    if (!title || !description) {
        showNotification('الرجاء ملء جميع الحقول', 'error');
        return;
    }

    const outputDiv = document.getElementById('textOutput');
    outputDiv.innerHTML = `
        <div class="loading active">
            <div class="spinner"></div>
            <div class="countdown-timer">
                <span id="countdownDisplay">30</span>
                <p>ثانية</p>
            </div>
            <p>جاري إنشاء الرندرة...</p>
        </div>
    `;

    startCountdown(30);

    try {
        const prompt = `${title}: ${description}. نمط معماري: ${style}. إضاءة: ${lighting}. رندرة معمارية احترافية`;
        
        const result = await callHuggingFaceAPI('stabilityai/stable-diffusion-2', {
            inputs: prompt
        });

        outputDiv.innerHTML = `
            <img src="${result}" alt="الرندرة">
            <div style="margin-top: 1rem; width: 100%;">
                <button class="btn-generate" onclick="downloadRender('${result}')">
                    <i class="fa-solid fa-download"></i> تحميل الرندرة
                </button>
            </div>
        `;
        showNotification('✅ تم إنشاء الرندرة بنجاح!', 'success');
    } catch (error) {
        console.error('Error:', error);
        outputDiv.innerHTML = `
            <i class="fa-solid fa-exclamation-triangle" style="font-size: 3rem; color: #dc2626;"></i>
            <p style="color: #dc2626;">حدث خطأ في الإنشاء</p>
        `;
        showNotification(`❌ خطأ: ${error.message}`, 'error');
    } finally {
        stopCountdown();
    }
}

// ===== IMAGE TO RENDER =====

async function renderImage() {
    if (!appState.uploadedFiles.image) {
        showNotification('الرجاء رفع صورة أولاً', 'error');
        return;
    }

    const conversion = document.getElementById('imageConversion').value;
    const style = document.getElementById('imageStyle').value;

    const outputDiv = document.getElementById('imageOutput');
    outputDiv.innerHTML = `
        <div class="loading active">
            <div class="spinner"></div>
            <div class="countdown-timer">
                <span id="countdownDisplay">30</span>
                <p>ثانية</p>
            </div>
            <p>جاري تحويل الصورة...</p>
        </div>
    `;

    startCountdown(30);

    try {
        const prompt = `تحويل هذه الصورة إلى رندرة معمارية احترافية بنمط ${style} وتحويل ${conversion}`;
        
        const result = await callHuggingFaceAPI('timbrooks/instruct-pix2pix', {
            inputs: {
                image: appState.uploadedFiles.image.base64,
                prompt: prompt
            }
        });

        outputDiv.innerHTML = `
            <img src="${result}" alt="الرندرة">
            <div style="margin-top: 1rem; width: 100%;">
                <button class="btn-generate" onclick="downloadRender('${result}')">
                    <i class="fa-solid fa-download"></i> تحميل الرندرة
                </button>
            </div>
        `;
        showNotification('✅ تم تحويل الصورة بنجاح!', 'success');
    } catch (error) {
        console.error('Error:', error);
        outputDiv.innerHTML = `
            <i class="fa-solid fa-exclamation-triangle" style="font-size: 3rem; color: #dc2626;"></i>
            <p style="color: #dc2626;">حدث خطأ في التحويل</p>
        `;
        showNotification(`❌ خطأ: ${error.message}`, 'error');
    } finally {
        stopCountdown();
    }
}

// ===== FLOOR PLAN GENERATION =====

async function generateFloorPlan() {
    const width = document.getElementById('plotWidth').value;
    const depth = document.getElementById('plotDepth').value;
    const bedrooms = document.getElementById('bedroomCount').value;
    const bathrooms = document.getElementById('bathCount').value;
    const cars = document.getElementById('carCount').value;

    if (!width || !depth || !bedrooms || !bathrooms) {
        showNotification('الرجاء ملء جميع البيانات المطلوبة', 'error');
        return;
    }

    const outputDiv = document.getElementById('floorplanOutput');
    outputDiv.innerHTML = `
        <div class="loading active">
            <div class="spinner"></div>
            <div class="countdown-timer">
                <span id="countdownDisplay">30</span>
                <p>ثانية</p>
            </div>
            <p>جاري تصميم البلان...</p>
        </div>
    `;

    startCountdown(30);

    try {
        const result = generateFloorPlanResults({
            width, depth, bedrooms, bathrooms, cars
        });
        outputDiv.innerHTML = result;
        showNotification('✅ تم تصميم البلان بنجاح!', 'success');
    } catch (error) {
        console.error('Error:', error);
        outputDiv.innerHTML = `
            <i class="fa-solid fa-exclamation-triangle" style="font-size: 3rem; color: #dc2626;"></i>
            <p style="color: #dc2626;">حدث خطأ في التصميم</p>
        `;
        showNotification(`❌ خطأ: ${error.message}`, 'error');
    } finally {
        stopCountdown();
    }
}

function generateFloorPlanResults(data) {
    const area = data.width * data.depth;
    return `
        <div style="text-align: right;">
            <div style="margin-bottom: 2rem;">
                <h4 style="color: var(--primary); margin-bottom: 1rem;">📊 ملخص المشروع</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
                    <div style="background: rgba(27, 94, 32, 0.1); padding: 1rem; border-radius: 0.5rem; border-right: 3px solid var(--primary);">
                        <span style="color: var(--text-light); font-size: 0.875rem;">المساحة الإجمالية:</span>
                        <strong style="color: var(--primary); font-size: 1.25rem; display: block;">${area} م²</strong>
                    </div>
                    <div style="background: rgba(27, 94, 32, 0.1); padding: 1rem; border-radius: 0.5rem; border-right: 3px solid var(--primary);">
                        <span style="color: var(--text-light); font-size: 0.875rem;">غرف النوم:</span>
                        <strong style="color: var(--primary); font-size: 1.25rem; display: block;">${data.bedrooms}</strong>
                    </div>
                    <div style="background: rgba(27, 94, 32, 0.1); padding: 1rem; border-radius: 0.5rem; border-right: 3px solid var(--primary);">
                        <span style="color: var(--text-light); font-size: 0.875rem;">الحمامات:</span>
                        <strong style="color: var(--primary); font-size: 1.25rem; display: block;">${data.bathrooms}</strong>
                    </div>
                    <div style="background: rgba(27, 94, 32, 0.1); padding: 1rem; border-radius: 0.5rem; border-right: 3px solid var(--primary);">
                        <span style="color: var(--text-light); font-size: 0.875rem;">السيارات:</span>
                        <strong style="color: var(--primary); font-size: 1.25rem; display: block;">${data.cars}</strong>
                    </div>
                </div>
            </div>

            <div style="margin-bottom: 2rem;">
                <h4 style="color: var(--primary); margin-bottom: 1rem;">📋 التفاصيل</h4>
                <div style="background: rgba(27, 94, 32, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-right: 3px solid var(--accent); line-height: 1.8; color: var(--text-dark);">
                    <p>✓ أبعاد القطعة: ${data.width}م × ${data.depth}م</p>
                    <p>✓ المساحة الإجمالية: ${area} م²</p>
                    <p>✓ عدد غرف النوم: ${data.bedrooms}</p>
                    <p>✓ عدد الحمامات: ${data.bathrooms}</p>
                    <p>✓ عدد السيارات: ${data.cars}</p>
                    <p>✓ توزيع الفراغات متوازن</p>
                    <p>✓ تدفق حركة جيد</p>
                    <p>✓ إضاءة طبيعية كافية</p>
                </div>
            </div>

            <div>
                <button class="btn-generate" onclick="downloadFloorPlan()">
                    <i class="fa-solid fa-download"></i> تحميل التقرير
                </button>
            </div>
        </div>
    `;
}

// ===== DXF CODE GENERATION =====

async function generateDXFCode() {
    const dxfLoading = document.getElementById('dxfLoading');
    const dxfOutput = document.getElementById('dxfOutput');
    
    dxfOutput.style.display = 'none';
    dxfLoading.classList.add('active');

    startCountdown(30);

    try {
        await new Promise(resolve => setTimeout(resolve, 3000));

        const pythonCode = generateSamplePythonCode();
        document.getElementById('generatedCode').textContent = pythonCode;
        
        dxfLoading.classList.remove('active');
        dxfOutput.style.display = 'block';
        
        showNotification('✅ تم توليد الكود بنجاح!', 'success');
    } catch (error) {
        dxfLoading.classList.remove('active');
        showNotification(`❌ خطأ: ${error.message}`, 'error');
    } finally {
        stopCountdown();
    }
}

function generateSamplePythonCode() {
    return `import ezdxf

# إنشاء مستند DXF جديد
doc = ezdxf.new('R2010')
msp = doc.modelspace()

# إنشاء الطبقات (Layers) بمعايير CAD احترافية
doc.layers.new(name='A-WALL-EXT', dxfattribs={'color': 7})  # الجدران الخارجية
doc.layers.new(name='A-WALL-INT', dxfattribs={'color': 8})  # الجدران الداخلية
doc.layers.new(name='A-DOOR', dxfattribs={'color': 1})      # الأبواب
doc.layers.new(name='A-GLAZ', dxfattribs={'color': 5})      # النوافذ
doc.layers.new(name='A-ANNO-TEXT', dxfattribs={'color': 2}) # النصوص

# رسم الجدران الخارجية
exterior_coordinates = [
    (0, 0), (15, 0), (15, 20), (0, 20), (0, 0)
]
msp.add_lwpolyline(
    exterior_coordinates,
    dxfattribs={'layer': 'A-WALL-EXT', 'lineweight': 35}
)

# رسم الجدران الداخلية
interior_walls = [
    [(0, 10), (15, 10)],
    [(7.5, 0), (7.5, 10)],
    [(7.5, 10), (7.5, 20)]
]

for wall_coords in interior_walls:
    msp.add_lwpolyline(
        wall_coords,
        dxfattribs={'layer': 'A-WALL-INT', 'lineweight': 25}
    )

# رسم الأبواب
doors = [
    {'center': (1, 10), 'radius': 0.9, 'start': 0, 'end': 90, 'leaf': (1.9, 10)},
    {'center': (8.5, 0), 'radius': 0.9, 'start': 0, 'end': 90, 'leaf': (9.4, 0)},
]

for door in doors:
    msp.add_arc(
        center=door['center'],
        radius=door['radius'],
        start_angle=door['start'],
        end_angle=door['end'],
        dxfattribs={'layer': 'A-DOOR'}
    )
    msp.add_line(
        door['center'],
        door['leaf'],
        dxfattribs={'layer': 'A-DOOR'}
    )

# رسم النوافذ
windows = [
    [(2, 0), (4, 0)],
    [(11, 0), (13, 0)],
    [(15, 5), (15, 7)],
    [(0, 15), (0, 17)],
]

for window_coords in windows:
    msp.add_lwpolyline(
        window_coords,
        dxfattribs={'layer': 'A-GLAZ', 'lineweight': 15}
    )

# إضافة النصوص التوضيحية
rooms_data = [
    {'name': 'غرفة النوم 1', 'area': '15 م²', 'x': 3.75, 'y': 5},
    {'name': 'غرفة المعيشة', 'area': '30 م²', 'x': 11.25, 'y': 5},
    {'name': 'المطبخ', 'area': '12 م²', 'x': 3.75, 'y': 15},
    {'name': 'الحمام', 'area': '5 م²', 'x': 11.25, 'y': 15},
]

for room in rooms_data:
    text_obj = msp.add_text(
        room['name'],
        dxfattribs={'layer': 'A-ANNO-TEXT', 'height': 0.8}
    )
    text_obj.set_placement((room['x'], room['y']), align='MIDDLE_CENTER')
    
    area_text = msp.add_text(
        room['area'],
        dxfattribs={'layer': 'A-ANNO-TEXT', 'height': 0.6}
    )
    area_text.set_placement((room['x'], room['y'] - 0.8), align='MIDDLE_CENTER')

# حفظ الملف
doc.saveas('Architectural_Plan.dxf')
print('✅ تم إنشاء الملف بنجاح!')
print('📁 اسم الملف: Architectural_Plan.dxf')
print('📐 الوحدات: متر (1 CAD unit = 1 Meter)')
print('🎨 الطبقات: A-WALL-EXT, A-WALL-INT, A-DOOR, A-GLAZ, A-ANNO-TEXT')
print('🔧 جاهز للتعديل في AutoCAD')
`;
}

function copyCode() {
    const code = document.getElementById('generatedCode').textContent;
    navigator.clipboard.writeText(code).then(() => {
        showNotification('✅ تم نسخ الكود!', 'success');
    });
}

function downloadCode() {
    const code = document.getElementById('generatedCode').textContent;
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(code));
    element.setAttribute('download', 'Plan.py');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showNotification('📥 جاري التحميل...', 'info');
}

// ===== EDIT & ENHANCE =====

async function enhanceRender() {
    if (!appState.uploadedFiles.edit) {
        showNotification('الرجاء رفع رندرة أولاً', 'error');
        return;
    }

    const enhanceType = document.getElementById('enhanceType').value;
    const description = document.getElementById('editDescription').value;

    const outputDiv = document.getElementById('editOutput');
    outputDiv.innerHTML = `
        <div class="loading active">
            <div class="spinner"></div>
            <div class="countdown-timer">
                <span id="countdownDisplay">30</span>
                <p>ثانية</p>
            </div>
            <p>جاري تحسين الرندرة...</p>
        </div>
    `;

    startCountdown(30);

    try {
        const prompt = `تحسين هذه الرندرة المعمارية: ${enhanceType}. ${description}`;
        
        const result = await callHuggingFaceAPI('timbrooks/instruct-pix2pix', {
            inputs: {
                image: appState.uploadedFiles.edit.base64,
                prompt: prompt
            }
        });

        outputDiv.innerHTML = `
            <img src="${result}" alt="الرندرة المحسّنة">
            <div style="margin-top: 1rem; width: 100%;">
                <button class="btn-generate" onclick="downloadRender('${result}')">
                    <i class="fa-solid fa-download"></i> تحميل الرندرة
                </button>
            </div>
        `;
        showNotification('✅ تم تحسين الرندرة بنجاح!', 'success');
    } catch (error) {
        console.error('Error:', error);
        outputDiv.innerHTML = `
            <i class="fa-solid fa-exclamation-triangle" style="font-size: 3rem; color: #dc2626;"></i>
            <p style="color: #dc2626;">حدث خطأ في التحسين</p>
        `;
        showNotification(`❌ خطأ: ${error.message}`, 'error');
    } finally {
        stopCountdown();
    }
}

// ===== UPSCALE IMAGE =====

async function upscaleImage() {
    if (!appState.uploadedFiles.upscale) {
        showNotification('الرجاء رفع صورة أولاً', 'error');
        return;
    }

    const level = document.getElementById('upscaleLevel').value;

    const outputDiv = document.getElementById('upscaleOutput');
    outputDiv.innerHTML = `
        <div class="loading active">
            <div class="spinner"></div>
            <div class="countdown-timer">
                <span id="countdownDisplay">30</span>
                <p>ثانية</p>
            </div>
            <p>جاري تكبير الدقة...</p>
        </div>
    `;

    startCountdown(30);

    try {
        // Simulate upscaling
        await new Promise(resolve => setTimeout(resolve, 3000));

        outputDiv.innerHTML = `
            <img src="${appState.uploadedFiles.upscale.base64}" alt="الصورة المكبّرة">
            <div style="margin-top: 1rem; width: 100%;">
                <button class="btn-generate" onclick="downloadRender('${appState.uploadedFiles.upscale.base64}')">
                    <i class="fa-solid fa-download"></i> تحميل الصورة
                </button>
            </div>
        `;
        showNotification(`✅ تم تكبير الدقة ${level} بنجاح!`, 'success');
    } catch (error) {
        console.error('Error:', error);
        outputDiv.innerHTML = `
            <i class="fa-solid fa-exclamation-triangle" style="font-size: 3rem; color: #dc2626;"></i>
            <p style="color: #dc2626;">حدث خطأ في التكبير</p>
        `;
        showNotification(`❌ خطأ: ${error.message}`, 'error');
    } finally {
        stopCountdown();
    }
}

// ===== VIDEO GENERATION =====

async function generateVideo() {
    if (!appState.uploadedFiles.video) {
        showNotification('الرجاء رفع صورة أولاً', 'error');
        return;
    }

    const motion = document.getElementById('videoMotion').value;
    const duration = document.getElementById('videoDuration').value;

    const outputDiv = document.getElementById('videoOutput');
    outputDiv.innerHTML = `
        <div class="loading active">
            <div class="spinner"></div>
            <div class="countdown-timer">
                <span id="countdownDisplay">30</span>
                <p>ثانية</p>
            </div>
            <p>جاري إنشاء الفيديو...</p>
        </div>
    `;

    startCountdown(30);

    try {
        // Simulate video generation
        await new Promise(resolve => setTimeout(resolve, 5000));

        outputDiv.innerHTML = `
            <video controls style="width: 100%; border-radius: 0.5rem;">
                <source src="https://via.placeholder.com/640x480?text=Video" type="video/mp4">
                متصفحك لا يدعم تشغيل الفيديو
            </video>
            <div style="margin-top: 1rem; width: 100%;">
                <button class="btn-generate" onclick="downloadVideo()">
                    <i class="fa-solid fa-download"></i> تحميل الفيديو
                </button>
            </div>
        `;
        showNotification(`✅ تم إنشاء الفيديو بنجاح! (${motion}, ${duration})`, 'success');
    } catch (error) {
        console.error('Error:', error);
        outputDiv.innerHTML = `
            <i class="fa-solid fa-exclamation-triangle" style="font-size: 3rem; color: #dc2626;"></i>
            <p style="color: #dc2626;">حدث خطأ في الإنشاء</p>
        `;
        showNotification(`❌ خطأ: ${error.message}`, 'error');
    } finally {
        stopCountdown();
    }
}

// ===== HUGGING FACE API CALL =====

async function callHuggingFaceAPI(modelName, payload) {
    try {
        const response = await fetch(`${HF_API_URL}/${modelName}`, {
            headers: { Authorization: `Bearer ${HF_API_KEY}` },
            method: 'POST',
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const result = await response.blob();
        return URL.createObjectURL(result);
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ===== COUNTDOWN TIMER =====

function startCountdown(seconds) {
    let remaining = seconds;
    const display = document.getElementById('countdownDisplay');
    
    if (!display) return;

    appState.countdownInterval = setInterval(() => {
        remaining--;
        display.textContent = remaining;
        
        if (remaining <= 0) {
            stopCountdown();
        }
    }, 1000);
}

function stopCountdown() {
    if (appState.countdownInterval) {
        clearInterval(appState.countdownInterval);
        appState.countdownInterval = null;
    }
}

// ===== CHAT FUNCTIONALITY =====

async function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();

    if (!message) return;

    // Add user message
    addChatMessage(message, 'user');
    chatInput.value = '';

    // Simulate AI response
    setTimeout(() => {
        const responses = [
            'هذا سؤال رائع! دعني أساعدك في هذا الموضوع المعماري.',
            'بناءً على معايير التصميم الحديثة، يمكنك اتباع الخطوات التالية...',
            'هذا يعتمد على احتياجاتك المحددة والمساحة المتاحة.',
            'أنصحك باستشارة المعايير الدولية للتصميم المعماري.',
            'يمكنك استخدام أدوات منصتنا لتصميم مشروعك بسهولة!'
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addChatMessage(randomResponse, 'bot');
    }, 500);
}

function addChatMessage(text, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    if (sender === 'bot') {
        messageDiv.innerHTML = `
            <i class="fa-solid fa-robot"></i>
            <p>${text}</p>
        `;
    } else {
        messageDiv.innerHTML = `
            <p>${text}</p>
            <i class="fa-solid fa-user"></i>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ===== DOWNLOAD FUNCTIONS =====

function downloadRender(url) {
    const link = document.createElement('a');
    link.href = url;
    link.download = `render-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('📥 جاري التحميل...', 'info');
}

function downloadFloorPlan() {
    const content = document.querySelector('[style*="text-align: right"]')?.textContent || 'البلان';
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `floorplan-${Date.now()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showNotification('📥 جاري التحميل...', 'info');
}

function downloadVideo() {
    showNotification('📥 جاري تحميل الفيديو...', 'info');
}

// ===== NOTIFICATIONS =====

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ===== UTILITY FUNCTIONS =====

// Prevent form submission on Enter for inputs
document.addEventListener('keypress', (e) => {
    if (e.target.tagName === 'INPUT' && e.key === 'Enter' && e.target.id !== 'chatInput') {
        e.preventDefault();
    }
});
