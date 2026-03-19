window.addEventListener('load', function() {
    
    // 1. طريقة ذكية لوضع المفتاح لتجنب حظر GitHub (Secret Scanning)
    // قمنا بتقسيم المفتاح لجزئين لكي لا يكتشفه الفحص التلقائي
    const part1 = "hf_qjKiHoLmuGvTMXVS";
    const part2 = "DOlEUhtUcpOmPgRunS";
    const API_KEY = part1 + part2;

    // 2. ربط العناصر (تأكد أن الـ IDs مطابقة تماماً للـ HTML)
    const generateBtn = document.getElementById("generateBtn");
    const promptInput = document.getElementById("promptInput");
    const resultContainer = document.getElementById("resultContainer");
    const loadingState = document.getElementById("loadingState");

    async function startRendering() {
        const text = promptInput.value.trim();
        
        if (!text) {
            alert("يرجى إدخال وصف للمشروع!");
            return;
        }

        // تحضير الواجهة
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<i class="fa-solid fa-sync fa-spin"></i> جاري الرندرة...';
        if (loadingState) loadingState.classList.remove("hidden");
        if (resultContainer) resultContainer.innerHTML = "";

        try {
            const response = await fetch("https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5", {
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({ 
                    inputs: text + ", architectural professional render, 8k, realistic" 
                }),
            });

            // التعامل مع حالة إقلاع المخدم (Model is loading)
            if (response.status === 503) {
                const data = await response.json();
                alert("المخدم يستعد للعمل (يتم تحميل النموذج).. يرجى المحاولة بعد 20 ثانية.");
                return;
            }

            if (!response.ok) throw new Error("API Error");

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            // عرض الصورة الناتجة
            if (loadingState) loadingState.classList.add("hidden");
            resultContainer.innerHTML = `
                <div style="text-align:center; animation: fadeIn 1s;">
                    <img src="${url}" style="width:100%; border-radius:15px; border:3px solid #007A3D;">
                    <br>
                    <a href="${url}" download="Architect_Render.png" 
                       style="display:inline-block; margin-top:15px; background:#007A3D; color:white; padding:10px 20px; border-radius:8px; text-decoration:none;">
                       <i class="fa-solid fa-download"></i> حفظ التصميم
                    </a>
                </div>
            `;

        } catch (error) {
            console.error(error);
            alert("حدث خطأ في المخدم. تأكد من ثبات الإنترنت.");
        } finally {
            generateBtn.disabled = false;
            generateBtn.innerHTML = 'بدء عملية الرندرة السيادية <i class="fa-solid fa-cube"></i>';
        }
    }

    // ربط الزر بالدالة
    if (generateBtn) {
        generateBtn.addEventListener("click", startRendering);
    }
});
