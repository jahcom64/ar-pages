document.addEventListener('DOMContentLoaded', () => {
    const hotspots = document.querySelectorAll('.hotspot');
    const clues = document.querySelectorAll('.clue');
    const showAllBtn = document.getElementById('show-all-btn');
    const resetBtn = document.getElementById('reset-btn');
    const mainImage = document.getElementById('main-image');
    
    // 用來追蹤已經找到的答案數量
    let foundCount = 0;
    const totalClues = clues.length;
    let cluesFound = {}; // 追蹤每個答案是否被找到

    // 初始化所有答案的追蹤狀態為 false
    clues.forEach(clue => {
        cluesFound[clue.id] = false;
    });

    /**
     * 點擊熱區的處理函式
     * @param {string} clueId - 答案提示的 ID (例如: 'clue-boy')
     */
    function handleHotspotClick(clueId) {
        const clueElement = document.getElementById(clueId);
        
        // 點擊後顯示答案
        if (clueElement && clueElement.classList.contains('hidden')) {
            clueElement.classList.remove('hidden');
            
            // 檢查是否是第一次找到這個答案
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
        // 根據您的要求 6: 點到答案後，不論再點哪裡都不要消失，所以這裡不需寫隱藏邏輯。
    }

    // 1. 綁定所有熱區的點擊事件
    hotspots.forEach(hotspot => {
        hotspot.addEventListener('click', () => {
            // 透過 ID 映射找到對應的答案提示 ID
            let clueId;
            if (hotspot.id === 'hotspot-boy') clueId = 'clue-boy';
            else if (hotspot.id === 'hotspot-girl') clueId = 'clue-girl';
            else if (hotspot.id === 'hotspot-id') clueId = 'clue-id';
            else if (hotspot.id === 'hotspot-speed') clueId = 'clue-speed';

            if (clueId) {
                handleHotspotClick(clueId);
            }
        });
    });

    // 4. 顯示所有答案按鈕
    showAllBtn.addEventListener('click', () => {
        clues.forEach(clue => {
            if (clue.classList.contains('hidden')) {
                clue.classList.remove('hidden');
            }
        });
        // 更新追蹤狀態，視為都已找到
        foundCount = totalClues;
        clues.forEach(clue => cluesFound[clue.id] = true);
        
        // 顯示完後一樣跳出提示
        setTimeout(() => {
            alert("你很厲害都答對了！恭喜找出所有不符法規的地方。");
        }, 50);
    });

    // 5. 再玩一次按鈕
    resetBtn.addEventListener('click', () => {
        // 隱藏所有答案
        clues.forEach(clue => {
            clue.classList.add('hidden');
        });
        // 重置追蹤狀態
        foundCount = 0;
        clues.forEach(clue => cluesFound[clue.id] = false);
    });
});
