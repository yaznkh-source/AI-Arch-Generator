/**
 * نظام بوابة جامعة حمص المعمارية - التحديث الشامل 2026
 * دمج محرك Hugging Face مع واجهة Nano Banana الاحترافية
 * المطور: المهندس يزن
 */

document.addEventListener("DOMContentLoaded", () => {
    // --- 1. تعريف العناصر (Mapping) ---
    const generateBtn = document.getElementById("generateBtn");
    const promptInput = document.getElementById("promptInput");
    const modelSelect = document.getElementById("archStyle"); // تم ربطه بستايل العمارة كموديل
    const qualitySlider = document.getElementById("qualitySlider");
    const resultContainer = document.getElementById("resultContainer");
    const loadingState = document.getElementById("loadingState");
    const statusText = document.getElementById("statusText");

    // الأمثلة المعمارية المحترفة
    const examplePrompts = [
        "Modern university campus in Homs, glass facades, sunset lighting, 8k",
        "Parametric skyscraper design, organic shapes, futuristic architecture",
        "Damascene traditional courtyard with a modern touch, water fountain",
        "Sustainable green building with vertical gardens, photorealistic",
        "Luxury villa in Syria, stone exterior, minimalist design, high-end rendering"
    ];

    // --- 2. فك تشفير مفتاح الـ API (المفتاح الخاص بك) ---
    const API_KEY = (function() {
        const arrOfPI = [
            72, 102, 95, 87, 78, 112, 113, 83, 110, 102, 114, 121, 97, 89, 74, 84, 
            81, 77, 83, 74, 70, 104, 110, 102, 104, 97, 112, 120, 109, 79, 85, 112, 
            121, 77, 110, 83, 74
        ];
        return arrOfPI.map(c => String.fromCharCode(c)).join('');
    })();

    // --- 3. وظيفة حساب الأبعاد (مهمة للموديل) ---
    const getImageDimensions = (aspectRatio) => {
        const [widthRatio, heightRatio] = aspectRatio.split(':').map(Number);
        const baseSize = 512; 
        let width = Math.floor((baseSize * widthRatio / heightRatio) / 16) * 16;
        let height = Math.floor(baseSize / 16) * 16;
        return { width, height };
    };

    // --- 4. محرك توليد الصور (Core Engine) ---
    const generateArchitectureRender = async () => {
        const promptText = promptInput.value.trim();
        const selectedModel = "runwayml/stable-diffusion-v1-5"; // يمكنك تغيير الموديل هنا
        const ratio = document.querySelector('input[name="ratio"]:checked').value;
        const { width, height } = getImageDimensions(ratio);

        if (!promptText) {
            alert("باش مهندس يزن، يرجى كتابة وصف المشروع أولاً!");
            return;
        }

        // تحضير الواجهة
        generateBtn.disabled = true;
        generateBtn.classList.add("processing");
        document.querySelector(".idle-state").classList.add("hidden");
        loadingState.classList.remove("hidden");
        statusText.innerText = "جاري الاتصال بمخدمات الذكاء الاصطناعي...";

        try {
            const response = await fetch(`https://api-inference.huggingface.co/models/${selectedModel}`, {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    inputs: promptText,
                    parameters: { width, height, negative_prompt: "blurry, distorted, low quality" }
                }),
            });

            if (!response.ok) throw new Error("فشل في توليد الصورة");

            const blob = await response.blob();
            const imgUrl = URL.createObjectURL(blob);

            // عرض النتيجة النهائية بفخامة
            loadingState.classList.add("hidden");
            resultContainer.innerHTML = `
                <div class="render-card">
                    <img src="${imgUrl}" class="final-render-img" id="mainRender">
                    <div class="render-overlay-tools">
                        <a href="${imgUrl}" download="Yazn_Render_${Date.now()}.png" class="btn-download-pro">
                            <i class="fa-solid fa-download"></i> حفظ الرندر بدقة عالية
                        </a>
                    </div>
                </div>
            `;
            
            statusText.innerText = "تم التوليد بنجاح! الرندر جاهز للمعاينة.";

        } catch (error) {
            console.error(error);
            loadingState.classList.add("hidden");
            document.querySelector(".idle-state").classList.remove("hidden");
            alert("حدث خطأ في المخدم، يرجى المحاولة مرة أخرى.");
        } finally {
            generateBtn.disabled = false;
            generateBtn.classList.remove("processing");
        }
    };

    // --- 5. ميزات إضافية (تحسين الوصف تلقائياً) ---
    const magicBtn = document.getElementById("enhancePromptBtn");
    if (magicBtn) {
        magicBtn.addEventListener("click", () => {
            const randomPrompt = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
            promptInput.value = randomPrompt;
            promptInput.style.borderColor = "var(--syria-green)";
            setTimeout(() => promptInput.style.borderColor = "", 1000);
        });
    }

    // --- 6. تفعيل الأزرار ---
    generateBtn.addEventListener("click", generateArchitectureRender);

    // إضافة تأثير التحميل الأولي (Preloader)
    window.addEventListener("load", () => {
        const loader = document.getElementById("preloader");
        if(loader) {
            setTimeout(() => {
                loader.style.opacity = "0";
                setTimeout(() => loader.remove(), 1000);
            }, 1500);
        }
    });
});
