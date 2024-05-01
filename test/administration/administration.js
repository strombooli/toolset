document.addEventListener('DOMContentLoaded', () => {
    // 获取页面中的元素
    let displayBox = document.getElementById('display-box'); // 显示框
    let inputBox = document.getElementById('input-box'); // 输入框
    let submitBtn = document.getElementById('submit-btn'); // 提交按钮
    let refreshBtn = document.getElementById('refresh-btn'); // 刷新按钮
    let hintBtn = document.getElementById('hint-btn'); // 提示按钮
    let hintText = document.getElementById('hint-text'); // 提示文本
    let levelBtns = document.querySelectorAll('.level-btn'); // 等级按钮
    let scoreDisplay = document.getElementById('score-display'); // 显示得分

    let correctAnswers = 0; // 正确回答的数量

    // 获取CSV数据并根据选定的级别渲染地区名称
    function fetchCSV(level) {
        let csvFile;
        if (level === 'county') {
            csvFile = 'county.csv'; // 县级数据文件
        } else if (level === 'prefecture') {
            csvFile = 'prefecture.csv'; // 市级数据文件
        }

        fetch(csvFile)
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n').map(row => row.split(',')); // 解析CSV数据
                let regions = rows.slice(0); // 复制地区数据

                // 获取随机地区函数
                function getRandomRegion() {
                    const randomIndex = Math.floor(Math.random() * regions.length);
                    return regions[randomIndex];
                }

                // 初始化当前地区
                let currentRegion = getRandomRegion();
                displayBox.textContent = currentRegion[0]; // 显示当前地区名称
                displayBox.style.display = 'block'; // 显示地区名称

                // 刷新按钮点击事件
                refreshBtn.addEventListener('click', () => {
                    currentRegion = getRandomRegion(); // 获取新的随机地区
                    displayBox.textContent = currentRegion[0]; // 显示新地区名称
                    hintText.style.display = 'none'; // 隐藏提示文本
                    hintBtn.style.display = 'none'; // 隐藏提示按钮
                });

                // 提交按钮点击事件
                submitBtn.addEventListener('click', () => {
                    checkInput(); // 检查输入
                });

                // 输入框输入事件
                inputBox.addEventListener('input', () => {
                    checkInput(); // 检查输入
                });

                // 提示按钮点击事件
                hintBtn.addEventListener('click', () => {
                    hintText.textContent = `提示：${currentRegion[3]}`; // 显示提示文本
                    hintText.style.display = 'block'; // 显示提示文本
                    hintBtn.style.display = 'none'; // 隐藏提示按钮
                });

                // 检查输入函数
                function checkInput() {
                    const userInput = inputBox.value.trim(); // 获取输入并去除首尾空格
                    const aliases = [currentRegion[1], currentRegion[2]]; // 获取地区别名

                    // 如果输入不为空且与地区别名匹配
                    if (userInput !== '' && aliases.includes(userInput)) {
                        correctAnswers++; // 增加正确回答的数量
                        scoreDisplay.textContent = `得分：${correctAnswers}`; // 显示得分
                        currentRegion = getRandomRegion(); // 获取新的随机地区
                        displayBox.textContent = currentRegion[0]; // 显示新地区名称
                        inputBox.value = ''; // 清空输入框
                        hintText.style.display = 'none'; // 隐藏提示文本
                        hintBtn.style.display = 'none'; // 隐藏提示按钮
                    } else {
                        hintBtn.style.display = hintText.style.display === 'none' ? 'inline-block' : 'none'; // 显示或隐藏提示按钮
                    }
                }
            });
    }

    // 遍历等级按钮并添加点击事件监听器
    levelBtns.forEach(btn => {
        btn.addEventListener('click', (event) => {
            const selectedLevel = event.target.value; // 获取选定的级别
            // 如果选定的是县级或市级
            if (selectedLevel === 'county' || selectedLevel === 'prefecture') {
                correctAnswers = 0; // 重置正确回答的数量
                scoreDisplay.textContent = `得分：${correctAnswers}`; // 显示得分
                fetchCSV(selectedLevel); // 获取对应级别的地区数据
                displayBox.style.display = 'block'; // 显示地区名称框
                inputBox.style.display = 'inline-block'; // 显示输入框
                refreshBtn.style.display = 'inline-block'; // 显示刷新按钮
                submitBtn.style.display = 'inline-block'; // 显示提交按钮
                hintBtn.style.display = 'none'; // 隐藏提示按钮
                hintText.style.display = 'none'; // 隐藏提示文本
            }
        });
    });
});