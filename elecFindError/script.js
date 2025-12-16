document.addEventListener('DOMContentLoaded', () => {
    const hotspots = document.querySelectorAll('.hotspot');
    const clues = document.querySelectorAll('.clue');
    const showAllBtn = document.getElementById('show-all-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    let foundCount = 0;
    const totalClues = clues.length;
    let cluesFound = {}; 

    // 初始化所有答案的追蹤狀態
    clues.forEach(clue => {
        cluesFound[clue.id] = false;
    });

    /**
     * 處理點擊，移動提示框到熱區的位置
     */
    function handleHotspotClick(hotspotElement) {
        // 1. 根據熱區 ID 取得對應的提示框 ID
        let clueId;
        if (hotspotElement.id === 'hotspot-boy') clueId = 'clue-boy';
        else if (hotspotElement.id === 'hotspot-girl') clueId = 'clue-girl';
        else if (hotspotElement.id === 'hotspot-id') clueId = 'clue-id';
        else if (hotspotElement.id === 'hotspot-speed') clueId = 'clue-speed';

        if (!clueId) return;

        const clueElement = document.getElementById(clueId);

        // 2. 獲取熱區的位置 (以百分比表示)
        const hotspotStyle = window.getComputedStyle(hotspotElement);
        const leftPercent = hotspotStyle.left;
        const topPercent = hotspotStyle.top;

        // 3. 設定提示框的位置，讓它與熱區重疊
        if (clueElement && !clueElement.classList.contains('show')) {
            clueElement.style.left = leftPercent;
            clueElement.style.top = topPercent;
            
            // 4. 顯示提示框
            clueElement.classList.add('show');
            clueElement.classList.remove('hidden'); // 確保覆蓋 hidden 屬性

            // 5. 檢查答案狀態
            if (cluesFound[clueId] === false) {
                cluesFound[clueId] = true;
                foundCount++;
                
                // 檢查是否所有答案都找到了
                if (foundCount === totalClues) {
                    setTimeout(() => {
                        alert("你很厲害都答對了！恭喜找出所有不符法規的地方。");
                    }, 50);
                }
            }
        }
    }

    // 1. 綁定所有熱區的點擊事件
    hotspots.forEach(hotspot => {
        hotspot.addEventListener('click', () => {
            handleHotspotClick(hotspot);
        });
    });

    // 4. 顯示所有答案按鈕
    showAllBtn.addEventListener('click', () => {
        hotspots.forEach(hotspot => handleHotspotClick(hotspot));
        
        // 確保找到提示只執行一次
        if (foundCount < totalClues) {
             setTimeout(() => {
                alert("你很厲害都答對了！恭喜找出所有不符法規的地方。");
            }, 50);
        }
    });

    // 5. 再玩一次按鈕
    resetBtn.addEventListener('click', () => {
        // 隱藏所有答案
        clues.forEach(clue => {
            clue.classList.remove('show');
            clue.classList.add('hidden'); // 確保恢復 hidden 狀態
        });
        // 重置追蹤狀態
        foundCount = 0;
        clues.forEach(clue => cluesFound[clue.id] = false);
    });
});
