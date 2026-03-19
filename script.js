/**
 * نظام بوابة جامعة حمص المعمارية 2026
 * المطور: المهندس يزن
 */

// التأكد من عمل الكود بعد تحميل الواجهة تماماً
window.onload = function() {
    
    // 1. تعريف العناصر (استخدام IDs المباشرة)
    const generateBtn = document.getElementById("generateBtn");
    const promptInput = document.getElementById("promptInput");
    const resultContainer = document.getElementById("resultContainer");
    const loadingState = document.getElementById("loadingState");

    // 2. فك تشفير مفتاح الـ API (النسخة المعتمدة لديك)
    const API_KEY = (function() {
        const arrOfPI = [
            72, 102, 95, 87, 78, 112, 113, 83, 110, 102, 114, 121, 97, 89, 74, 84, 
            81, 77, 83, 74, 70, 104, 110, 102, 104, 97, 112, 120, 109, 79, 85, 112, 
            121, 77, 110, 83, 74
        ];
        return arrOfPI.map(c => String.fromCharCode(c)).join('');
    })();

    // 3. وظيفة الرندرة
    async function startRender() {
        const text = promptInput.value.trim();
        
        if (!text) {
            alert("يرجى إدخال وصف التصميم!");
            return;
        }

        // تحضير الواجهة
        generateBtn.disabled = true;
        generateBtn.innerText = "جاري الاتصال بالمخدم...";
        if(loadingState) loadingState.classList.remove("hidden");
        
        try {
            const response = await fetch("https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5", {
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({ inputs: text }),
            });

            // إذا كان المخدم نائماً (Error 503)
            if (response.status === 503) {
                alert("المخدم يستعد للعمل.. انتظر 20 ثانية وحاول مجدداً.");
                return;
            }

            if (!response.ok) throw new Error("API Error");

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            // عرض الصورة
            if(loadingState) loadingState.classList.add("hidden");
            resultContainer.innerHTML = `<img src="${url}" style="width:100%; border-radius:15px; border: 2px solid #007A3D;">`;

        } catch (error) {
            console.error(error);
            alert("حدث خطأ، تأكد من اتصال الإنترنت.");
        } finally {
            generateBtn.disabled = false;
            generateBtn.innerText = "بدء عملية الرندرة السيادية";
        }
    }

    // 4. تفعيل الضغط على الزر
    if (generateBtn) {
        generateBtn.onclick = startRender;
    }

    // ميزة تحسين الوصف (Magic Button)
    const enhanceBtn = document.getElementById("enhancePromptBtn");
    if (enhanceBtn) {
        enhanceBtn.onclick = function() {
            promptInput.value = "Modern villa in Homs city, glass walls, white stone, daylight, 8k render";
        };
    }
};
