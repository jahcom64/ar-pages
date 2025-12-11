document.addEventListener('DOMContentLoaded', () => {
    const draggables = document.querySelectorAll('.draggable');
    const dropZones = document.querySelectorAll('.drop-zone');
    const checkButton = document.getElementById('check-button');
    const resetButton = document.getElementById('reset-button');
    const feedback = document.getElementById('feedback');

    let draggedItem = null;

    // --- 拖曳事件處理 ---
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', (e) => {
            if (draggable.classList.contains('disabled')) {
                e.preventDefault();
                return;
            }
            draggedItem = draggable;
            e.dataTransfer.setData('text/plain', draggable.dataset.percent);
            setTimeout(() => {
                draggable.classList.add('dragging');
            }, 0);
        });

        draggable.addEventListener('dragend', () => {
            if (draggedItem) {
                draggedItem.classList.remove('dragging');
                draggedItem = null;
            }
        });
    });

    // --- 放置區事件處理 ---
    dropZones.forEach(dropZone => {
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault(); // 允許放置
            if (dropZone.children.length === 0) {
                dropZone.classList.add('hovered');
            }
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('hovered');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('hovered');

            // 確保目標區域目前沒有子元素且有拖曳物
            if (dropZone.children.length === 0 && draggedItem) {
                // 複製被拖曳的元素
                const droppedItem = draggedItem.cloneNode(true);
                droppedItem.classList.remove('draggable', 'dragging');
                droppedItem.classList.add('dropped');
                droppedItem.draggable = false;
                
                // 隱藏原始選項，避免重複使用
                draggedItem.style.visibility = 'hidden';
                draggedItem.classList.add('disabled');
                
                // 將複製的元素加入到放置區，並顯示百分比
                droppedItem.textContent = droppedItem.dataset.percent + '%';
                dropZone.innerHTML = ''; // 清空原始提示文字
                dropZone.appendChild(droppedItem);
            }
        });
    });

    // --- 檢查結果功能 ---
    checkButton.addEventListener('click', () => {
        if (checkButton.classList.contains('disabled')) return;
        
        let allCorrect = true;
        let unanswered = false;
        let correctCount = 0;

        dropZones.forEach(dropZone => {
            dropZone.classList.remove('correct', 'incorrect');
            const droppedItem = dropZone.querySelector('.dropped');
            const correctPercent = dropZone.dataset.correctPercent;

            if (droppedItem) {
                const droppedPercent = droppedItem.dataset.percent;
                droppedItem.classList.remove('dropped-correct', 'dropped-incorrect');

                if (droppedPercent === correctPercent) {
                    dropZone.classList.add('correct');
                    droppedItem.classList.add('dropped-correct');
                    correctCount++;
                } else {
                    dropZone.classList.add('incorrect');
                    droppedItem.classList.add('dropped-incorrect');
                    allCorrect = false;
                }
            } else {
                unanswered = true;
            }
        });

        if (unanswered) {
            feedback.style.color = 'orange';
            feedback.textContent = `測驗尚未完成！您還有 ${dropZones.length - correctCount} 個車窗未放置隔熱紙。`;
        } else {
            // 禁用所有選項和檢查按鈕
            draggables.forEach(d => d.draggable = false);
            checkButton.classList.add('disabled');

            if (allCorrect) {
                feedback.style.color = 'green';
                feedback.textContent = '恭喜您！所有隔熱紙透光率都放置正確！🎉';
            } else {
                feedback.style.color = 'red';
                feedback.textContent = `測驗完成，但有誤！您答對了 ${correctCount} 題，請檢查標示錯誤的區塊 (紅色邊框)。`;
            }
        }
    });

    // --- 重新測驗功能 ---
    resetButton.addEventListener('click', () => {
        feedback.textContent = '';
        checkButton.classList.remove('disabled');

        // 1. 清除放置區的內容和樣式
        dropZones.forEach(dropZone => {
            // 恢復原始提示文字 (簡化)
            let originalText = '';
            if (dropZone.id === 'front-windshield') originalText = '前擋風玻璃';
            else if (dropZone.id === 'front-left-window') originalText = '前側車窗';
            else if (dropZone.id === 'rear-left-window') originalText = '後側車窗';
            else if (dropZone.id === 'rear-windshield') originalText = '後擋風玻璃';
            
            dropZone.innerHTML = originalText;
            dropZone.classList.remove('correct', 'incorrect', 'hovered');
        });

        // 2. 恢復拖曳選項
        draggables.forEach(draggable => {
            draggable.style.visibility = 'visible';
            draggable.draggable = true;
            draggable.classList.remove('disabled');
        });
    });
});
