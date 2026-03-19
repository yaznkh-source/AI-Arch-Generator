/**
 * نظام بوابة جامعة حمص المعمارية 2026
 * المطور: المهندس يزن
 */

// التأكد من أن الكود سيعمل فقط بعد تحميل الصفحة بالكامل
window.addEventListener('load', function() {
    
    // 1. فك تشفير مفتاح الـ API الخاص بك
    const API_KEY = (function() {
        const arrOfPI = [
            72, 102, 95, 87, 78, 112, 113, 83, 110, 102, 114, 121, 97, 89, 74, 84, 
            81, 77, 83, 74, 70, 104, 110, 102, 104, 97, 112, 120, 109, 79, 85, 112, 
            121, 77, 110, 83, 74
        ];
        return arrOfPI.map(c => String.fromCharCode(c)).join('');
    })();

    // 2. تعريف العناصر بناءً على تصحيح الـ IDs في الـ HTML الخاص بك
    const generateBtn = document.getElementById("generateBtn");
    const promptInput = document.getElementById("promptInput");
    const resultContainer = document.getElementById("resultContainer");
    const loadingState = document.getElementById("loadingState");

    // وظيفة الرندرة الأساسية
    async function startRendering() {
        const text = promptInput.value.trim();
        
        if (!text) {
            alert("باش مهندس يزن، يرجى إدخال وصف الكتلة أولاً!");
            return;
        }

        // تغيير حالة الزر وإظهار منطقة التحميل
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الاتصال بالمخدم...';
        
        // إخفاء رسالة الانتظار وإظهار لودر التحميل
        const idleState = document.querySelector(".idle-state");
        if (idleState) idleState.style.display = "none";
        if (loadingState) loadingState.classList.remove("hidden");
        if (resultContainer) resultContainer.innerHTML = "";

        try {
            // إرسال الطلب لمخدم Hugging Face
            const response = await fetch("https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5", {
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({ 
                    inputs: text + ", architectural render, high quality, 8k, highly detailed" 
                }),
            });

            // معالجة حالة المخدم إذا كان "نائماً" (Error 503)
            if (response.status === 503) {
                alert("المخدم يستعد للعمل الآن.. يرجى الانتظار 20 ثانية ثم الضغط على الزر مجدداً.");
                return;
            }

            if (!response.ok) throw new Error("API Error");

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            // عرض النتيجة النهائية
            if (loadingState) loadingState.classList.add("hidden");
            resultContainer.innerHTML = `
                <div class="render-card">
                    <img src="${url}" style="width:100%; border-radius:12px; border: 2px solid #007A3D;">
                    <a href="${url}" download="Homs_Uni_Render.png" class="btn-download" style="display:block; margin-top:10px; text-align:center; color:#007A3D; text-decoration:none;">
                        <i class="fa-solid fa-download"></i> تحميل الرندر النهائي
                    </a>
                </div>
            `;

        } catch (error) {
            console.error(error);
            alert("حدث خطأ في المخدم، يرجى التأكد من الإنترنت والمحاولة مرة أخرى.");
        } finally {
            // إعادة الزر لحالته الطبيعية
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<span>بدء عملية الرندرة السيادية</span> <i class="fa-solid fa-cube"></i>';
        }
    }

    // 3. ربط الأحداث (Event Listeners)
    if (generateBtn) {
        generateBtn.onclick = startRendering;
    }

    // تفعيل زر "تحسين الوصف تلقائياً"
    const enhanceBtn = document.getElementById("enhancePromptBtn");
    if (enhanceBtn) {
        enhanceBtn.onclick = function() {
            const examples = [
                "Modern villa in Homs with white stone and glass facades, 8k",
                "Futuristic architecture, parametric design, organic shapes, daylight",
                "Sustainable green building with vertical gardens, photorealistic"
            ];
            promptInput.value = examples[Math.floor(Math.random() * examples.length)];
        };
    }
});
