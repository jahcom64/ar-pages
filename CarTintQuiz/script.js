document.addEventListener('DOMContentLoaded', () => {
    const draggables = document.querySelectorAll('.draggable');
    const dropZones = document.querySelectorAll('.drop-zone');
    const checkButton = document.getElementById('check-button');
    const resetButton = document.getElementById('reset-button');
    const feedback = document.getElementById('feedback');

    // 儲存每個車窗當前放置的值
    const placements = {};

    // Helper: 取得顯示值
    const getDisplayValue = (value) => {
        return value === 'Any' ? '皆可' : value + '%';
    };

    // Helper: 更新結果顯示區
    const updateResultsDisplay = () => {
        document.getElementById('res-front-windshield').textContent = placements['front-windshield'] ? getDisplayValue(placements['front-windshield']) : '未放置';
        document.getElementById('res-front-left-window').textContent = placements['front-left-window'] ? getDisplayValue(placements['front-left-window']) : '未放置';
        document.getElementById('res-rear-left-window').textContent = placements['rear-left-window'] ? getDisplayValue(placements['rear-left-window']) : '未放置';
        document.getElementById('res-rear-windshield').textContent = placements['rear-windshield'] ? getDisplayValue(placements['rear-windshield']) : '未放置';
    };
    updateResultsDisplay(); // 初始呼叫

    // --- 拖曳事件處理 ---
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', (e) => {
            // 傳遞選項的值和顯示文字
            e.dataTransfer.setData('value', draggable.dataset.value);
            e.dataTransfer.setData('text', draggable.textContent);
            setTimeout(() => {
                draggable.classList.add('dragging');
            }, 0);
        });

        draggable.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });
    });

    // --- 放置區事件處理 ---
    dropZones.forEach(dropZone => {
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault(); // 允許放置
            dropZone.classList.add('hovered');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('hovered');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('hovered');

            const droppedValue = e.dataTransfer.getData('value');
            const droppedText = e.dataTransfer.getData('text');
            const dropZoneId = dropZone.id;
            
            // 1. 更新內部數據
            placements[dropZoneId] = droppedValue;

            // 2. 更新視覺顯示
            let displayElement = dropZone.querySelector('.dropped-display');
            if (!displayElement) {
                displayElement = document.createElement('div');
                displayElement.classList.add('dropped-display');
                dropZone.innerHTML = ''; // 清空原始提示文字
                dropZone.appendChild(displayElement);
            }
            
            displayElement.textContent = droppedText;
            
            // 移除舊的顏色類別，添加新的顏色類別
            displayElement.className = 'dropped-display';
            displayElement.classList.add(`color-${droppedValue.replace('%', '')}`);
            
            // 3. 更新結果顯示區
            updateResultsDisplay();
        });
    });

    // --- 檢查結果功能 ---
    checkButton.addEventListener('click', () => {
        let allCorrect = true;
        let unanswered = false;
        let correctCount = 0;
        
        // 檢查按鈕被按下後，將所有選項和按鈕禁用
        draggables.forEach(d => d.draggable = false);
        checkButton.classList.add('disabled');

        dropZones.forEach(dropZone => {
            dropZone.classList.remove('correct', 'incorrect');
            const droppedValue = placements[dropZone.id];
            const correctValue = dropZone.dataset.correctValue;
            const displayElement = dropZone.querySelector('.dropped-display');

            if (!droppedValue) {
                unanswered = true;
                dropZone.classList.add('incorrect');
                allCorrect = false;
                return;
            }

            let isCorrect = false;
            
            // 處理「皆可」邏輯
            if (correctValue === 'Any') {
                isCorrect = (droppedValue !== '20'); // 假設「皆可」代表只要不是明顯錯誤的 20% 即可 (可根據需求修改)
            } else {
                isCorrect = (droppedValue === correctValue);
            }

            // 更新車窗邊框顏色
            if (isCorrect) {
                dropZone.classList.add('correct');
                displayElement.classList.remove('is-incorrect');
                displayElement.classList.add('is-correct');
                correctCount++;
            } else {
                dropZone.classList.add('incorrect');
                displayElement.classList.remove('is-correct');
                displayElement.classList.add('is-incorrect');
                allCorrect = false;
            }
        });

        if (unanswered) {
            feedback.style.color = 'orange';
            feedback.textContent = `測驗尚未完成！您還有 ${dropZones.length - correctCount} 個車窗未放置隔熱紙。`;
        } else if (allCorrect) {
            feedback.style.color = 'green';
            feedback.textContent = '恭喜您！所有隔熱紙透光率都放置正確！🎉';
        } else {
            feedback.style.color = 'red';
            feedback.textContent = `測驗完成，但有誤！您答對了 ${correctCount} 題，請檢查標示紅色的區塊。`;
        }
    });

    // --- 重新測驗功能 ---
    resetButton.addEventListener('click', () => {
        feedback.textContent = '';
        checkButton.classList.remove('disabled');
        
        // 1. 清除放置區的內容和樣式
        dropZones.forEach(dropZone => {
            let originalText = '';
            if (dropZone.id === 'front-windshield') originalText = '前擋風玻璃';
            else if (dropZone.id === 'front-left-window') originalText = '前側車窗';
            else if (dropZone.id === 'rear-left-window') originalText = '後側車窗';
            else if (dropZone.id === 'rear-windshield') originalText = '後擋風玻璃';
            
            dropZone.innerHTML = originalText;
            dropZone.classList.remove('correct', 'incorrect', 'hovered');
            placements[dropZone.id] = null; // 清除數據
        });

        // 2. 恢復拖曳選項 (其實它們一直都是可拖曳的，但要確保沒有被 disabled)
        draggables.forEach(draggable => {
            draggable.draggable = true;
            draggable.classList.remove('disabled');
        });
        
        updateResultsDisplay();
    });
});
