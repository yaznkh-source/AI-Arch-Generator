/**
 * نظام بوابة جامعة حمص المعمارية - الإصدار النهائي 2026
 * تطوير المهندس: يزن - مختبر الذكاء الاصطناعي
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. تعريف العناصر من الواجهة الاحترافية
    const generateBtn = document.getElementById("generateBtn");
    const promptInput = document.getElementById("promptInput");
    const resultContainer = document.getElementById("resultContainer");
    const loadingState = document.getElementById("loadingState");
    const qualitySlider = document.getElementById("qualitySlider");

    // 2. فك تشفير مفتاح الـ API الخاص بك
    // تم تصحيح الوظيفة لتعيد النص الصافي بدلاً من المصفوفة
    const API_KEY = (function() {
        const arrOfPI = [
            72, 102, 95, 87, 78, 112, 113, 83, 110, 102, 114, 121, 97, 89, 74, 84, 
            81, 77, 83, 74, 70, 104, 110, 102, 104, 97, 112, 120, 109, 79, 85, 112, 
            121, 77, 110, 83, 74
        ];
        return arrOfPI.map(c => String.fromCharCode(c)).join('');
    })();

    // 3. وظيفة الرندرة الأساسية
    const handleRender = async () => {
        const promptText = promptInput.value.trim();

        if (!promptText) {
            alert("باش مهندس يزن، يرجى إدخال وصف التصميم أولاً!");
            return;
        }

        // تحضير الواجهة لحالة المعالجة
        generateBtn.disabled = true;
        generateBtn.innerText = "جاري الرندرة...";
        
        const idleState = document.querySelector(".idle-state");
        if (idleState) idleState.classList.add("hidden");
        
        loadingState.classList.remove("hidden");
        resultContainer.innerHTML = ""; // مسح النتائج السابقة

        try {
            // إرسال الطلب إلى Hugging Face
            const response = await fetch("https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5", {
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({ 
                    inputs: promptText,
                    parameters: {
                        negative_prompt: "blurry, bad architecture, distorted windows, low quality",
                        num_inference_steps: 30
                    }
                }),
            });

            // معالجة حالة المخدم (التي ظهرت في صورتك الأخيرة)
            if (response.status === 503) {
                alert("المخدم حالياً قيد الإقلاع.. يرجى إعادة المحاولة بعد 30 ثانية.");
                throw new Error("Model Loading");
            }

            if (!response.ok) throw new Error("فشل في استلام البيانات من المخدم");

            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);

            // عرض الصورة الناتجة بفخامة
            loadingState.classList.add("hidden");
            resultContainer.innerHTML = `
                <div class="render-result-wrapper">
                    <img src="${imageUrl}" class="final-render-img" style="width:100%; border-radius:12px; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
                    <div style="margin-top: 15px; display: flex; gap: 10px; justify-content: center;">
                        <a href="${imageUrl}" download="Homs_Uni_Render_${Date.now()}.png" class="btn-outline-green" style="display:inline-block; padding:10px 20px;">
                            <i class="fa-solid fa-download"></i> حفظ التصميم
                        </a>
                    </div>
                </div>
            `;

        } catch (error) {
            console.error("Render Error:", error);
            loadingState.classList.add("hidden");
            if (idleState) idleState.classList.remove("hidden");
            
            if (error.message !== "Model Loading") {
                alert("حدث خطأ تقني. تأكد من اتصال الإنترنت وحاول مجدداً.");
            }
        } finally {
            generateBtn.disabled = false;
            generateBtn.innerText = "بدء عملية الرندرة السيادية";
        }
    };

    // 4. ربط الأحداث (Event Listeners)
    if (generateBtn) {
        generateBtn.addEventListener("click", handleRender);
    }

    // زر تحسين الوصف تلقائياً (Magic Tool)
    const enhanceBtn = document.getElementById("enhancePromptBtn");
    if (enhanceBtn) {
        enhanceBtn.addEventListener("click", () => {
            const examples = [
                "Modern sustainable skyscraper with glass facades and vertical gardens, 8k render",
                "Luxury villa design in Homs, white stone exterior, cinematic lighting, architectural photography",
                "Futuristic university campus library, parametric interior design, natural sunlight"
            ];
            promptInput.value = examples[Math.floor(Math.random() * examples.length)];
        });
    }

    // 5. التحكم في شاشة التحميل (Preloader)
    const preloader = document.getElementById("preloader");
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = "0";
            setTimeout(() => preloader.remove(), 800);
        }, 1500);
    }
});
