/**
 * نظام جامعة حمص - إصلاح محرك الرندرة
 * المطور: المهندس يزن
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. تعريف العناصر بدقة (حسب الـ ID في الـ HTML الجديد)
    const generateBtn = document.getElementById("generateBtn");
    const promptInput = document.getElementById("promptInput");
    const resultContainer = document.getElementById("resultContainer");
    const loadingState = document.getElementById("loadingState");
    const archStyle = document.getElementById("archStyle"); // الموديل المعماري

    // 2. فك تشفير مفتاح الـ API الخاص بك
    const API_KEY = (function() {
        const arrOfPI = [
            72, 102, 95, 87, 78, 112, 113, 83, 110, 102, 114, 121, 97, 89, 74, 84, 
            81, 77, 83, 74, 70, 104, 110, 102, 104, 97, 112, 120, 109, 79, 85, 112, 
            121, 77, 110, 83, 74
        ];
        return arrOfPI.map(c => String.fromCharCode(c)).join('');
    })();

    // 3. وظيفة الرندرة الأساسية
    const startRendering = async () => {
        const text = promptInput.value.trim();
        if (!text) {
            alert("يا بشمهندس، يرجى إدخال وصف التصميم أولاً!");
            return;
        }

        // تحضير الواجهة (إظهار اللودر وإخفاء الحالة الفارغة)
        generateBtn.disabled = true;
        generateBtn.style.opacity = "0.7";
        generateBtn.innerText = "جاري المعالجة...";
        
        const idleState = document.querySelector(".idle-state");
        if (idleState) idleState.classList.add("hidden");
        loadingState.classList.remove("hidden");

        try {
            // استخدام موديل Stable Diffusion عبر Hugging Face
            const response = await fetch("https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5", {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({ inputs: text }),
            });

            if (!response.ok) throw new Error("API Error");

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            // عرض الصورة الناتجة
            loadingState.classList.add("hidden");
            resultContainer.innerHTML = `
                <div style="width:100%; position:relative;">
                    <img src="${url}" style="width:100%; border-radius:15px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                    <a href="${url}" download="Homs_Uni_Render.png" 
                       style="display:block; margin-top:15px; color:#007A3D; text-decoration:none; font-weight:bold;">
                       <i class="fa-solid fa-download"></i> تحميل الرندر النهائي
                    </a>
                </div>
            `;

        } catch (error) {
            console.error(error);
            alert("عذراً، حدث خطأ في الاتصال بالمخدم. تأكد من الإنترنت.");
            loadingState.classList.add("hidden");
            if (idleState) idleState.classList.remove("hidden");
        } finally {
            generateBtn.disabled = false;
            generateBtn.style.opacity = "1";
            generateBtn.innerText = "بدء عملية الرندرة السيادية";
        }
    };

    // 4. ربط الزر بالوظيفة (هنا كان الخطأ)
    if (generateBtn) {
        generateBtn.onclick = (e) => {
            e.preventDefault();
            startRendering();
        };
    }

    // 5. ميزة زر "تحسين الوصف" (Magic Button)
    const enhanceBtn = document.getElementById("enhancePromptBtn");
    if (enhanceBtn) {
        enhanceBtn.onclick = () => {
            const examples = [
                "Modern villa with stone walls and large glass windows in Homs, daylight",
                "Futuristic library design, parametric architecture, white concrete, 8k",
                "Traditional Syrian house courtyard, fountain, jasmine trees, cinematic lighting"
            ];
            promptInput.value = examples[Math.floor(Math.random() * examples.length)];
        };
    }
});
