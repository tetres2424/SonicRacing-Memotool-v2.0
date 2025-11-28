// --- グローバル変数 ---
let currentUpper = []; // 上段ガジェットIDリスト
let currentLower = []; // 下段ガジェットIDリスト
let myCustomGadgets = []; // オリジナルガジェット

// 起動時処理
window.onload = function() {
    loadMemos(); // 保存データの読み込み
    initSelectors(); // セレクトボックスの初期化
    updateVisuals(); // 画面描画
    
    // ランキングデータの集計（data.jsのplayerDataを使用）
    if(typeof playerData !== 'undefined'){
        analyzeRankingData(); 
    }
};

// --- 初期化・選択肢生成 ---
function initSelectors() {
    // キャラクター選択肢
    const charSelect = document.getElementById('charSelect');
    if(typeof characters !== 'undefined') {
        characters.forEach(c => {
            let op = document.createElement('option');
            op.value = c.name;
            op.text = c.name;
            charSelect.appendChild(op);
        });
    }

    // ガジェット選択肢
    const gadgetSelect = document.getElementById('gadgetSelect');
    if(typeof gadgets !== 'undefined') {
        gadgets.forEach(g => {
            let op = document.createElement('option');
            op.value = g.id;
            op.text = `[C${g.cost}] ${g.name}`;
            gadgetSelect.appendChild(op);
        });
    }
}

// --- ステータス計算 (キャラ+マシン) ---
function changeMachineType() {
    const type = document.getElementById('machineTypeSelect').value;
    const p1 = document.getElementById('part1Select');
    const p2 = document.getElementById('part2Select');
    const p3 = document.getElementById('part3Select');

    // 簡易的なパーツリセット処理（実際はdata.jsのデータに基づいて生成が必要）
    // ここでは枠組みだけ記述します
    p1.disabled = false; p2.disabled = false;
    p3.disabled = (type === 'ダッシュ'); // ダッシュはタイヤなし
    
    updateCharMachineInfo();
}

function updateCharMachineInfo() {
    const charName = document.getElementById('charSelect').value;
    const machineType = document.getElementById('machineTypeSelect').value;
    
    // ※ここに実際のステータス計算ロジックが入ります
    // 今回は表示更新のトリガーとして記述
    let statsText = "🚀 ?  ⚡ ?  🌀 ?  💪 ?  ⏩ ?";
    document.getElementById('totalStats').textContent = statsText;
}

// --- ガジェット追加・削除・表示 (核心部分) ---

// ガジェットの説明を表示
function showGadgetDescription() {
    const id = document.getElementById('gadgetSelect').value;
    const g = gadgets.find(x => x.id == id);
    const box = document.getElementById('gadgetDescPreview');
    if(g) {
        box.innerHTML = `<strong>${g.name}</strong> (Cost:${g.cost})<br>${g.effect}`;
    } else {
        box.textContent = "（ここにガジェットの効果が表示されます）";
    }
}

// ガジェット追加
function tryAddGadget() {
    const id = document.getElementById('gadgetSelect').value;
    if(!id) return;
    const g = gadgets.find(x => x.id == id);
    if(!g) return;

    // 上段・下段のコスト計算
    let upperCost = currentUpper.reduce((sum, gid) => sum + getCost(gid), 0);
    let lowerCost = currentLower.reduce((sum, gid) => sum + getCost(gid), 0);

    // 空きがある方に追加（上段優先）
    if (upperCost + g.cost <= 3) {
        currentUpper.push(id);
    } else if (lowerCost + g.cost <= 3) {
        currentLower.push(id);
    } else {
        alert("コストが一杯です！どちらかの列に空きを作ってください。");
        return;
    }
    updateVisuals();
}

function getCost(id) {
    let g = gadgets.find(x => x.id == id);
    return g ? g.cost : 0;
}

// 画面描画（コスト枠表示）
function updateVisuals() {
    renderRow('visualUpper', currentUpper, 'costUpper');
    renderRow('visualLower', currentLower, 'costLower');
}

function renderRow(elementId, list, costId) {
    const container = document.getElementById(elementId);
    container.innerHTML = "";
    
    let totalCost = 0;

    list.forEach((id, index) => {
        const g = gadgets.find(x => x.id == id);
        if(!g) return;
        totalCost += g.cost;

        // ガジェットボックス（全体枠）
        const box = document.createElement('div');
        box.className = "gadget-box";
        box.onclick = () => removeGadget(elementId, index); // クリックで削除
        box.title = `${g.name}\n${g.effect}`; // ツールチップ

        // コスト数だけ四角形を描画 (■■■)
        for(let i=0; i < g.cost; i++){
            const unit = document.createElement('div');
            unit.className = `cost-unit cost-${g.cost}`;
            box.appendChild(unit);
        }
        
        // 名前（スペースがあれば表示、またはツールチップで代用）
        // box.innerHTML += `<span style='font-size:0.7rem; writing-mode:vertical-rl;'>${g.name.substring(0,4)}</span>`;

        container.appendChild(box);
    });

    // 残りコストの空枠表示（オプション）
    for(let i=0; i < (3 - totalCost); i++){
        const empty = document.createElement('div');
        empty.className = "gadget-box";
        const unit = document.createElement('div');
        unit.className = "cost-unit empty";
        empty.appendChild(unit);
        container.appendChild(empty);
    }

    document.getElementById(costId).textContent = totalCost;
}

function removeGadget(rowId, index) {
    if (rowId === 'visualUpper') currentUpper.splice(index, 1);
    else currentLower.splice(index, 1);
    updateVisuals();
}

function resetCurrent() {
    currentUpper = [];
    currentLower = [];
    updateVisuals();
}

// --- ランキング・シナジー機能 (Step 2以降で詳細化) ---

// ページ切り替え
function showPage(pageName) {
    document.getElementById('page-main').style.display = (pageName === 'main') ? 'block' : 'none';
    document.getElementById('page-ranking').style.display = (pageName === 'ranking') ? 'block' : 'none';
}

// ランキング分析（簡易版）
function analyzeRankingData() {
    // ここでplayerDataを集計し、rank-gadgetsなどにHTMLを出力します
    // 処理落ち防止のため、ロジックは次のステップで詳細化します
    console.log("Ranking logic loaded.");
}

// --- メモ保存・共有機能 ---
function saveMemo() {
    const title = document.getElementById('memoTitle').value || "無題の構成";
    const data = {
        title: title,
        char: document.getElementById('charSelect').value,
        machine: document.getElementById('machineTypeSelect').value,
        upper: currentUpper,
        lower: currentLower,
        date: new Date().toLocaleString()
    };
    
    let memos = JSON.parse(localStorage.getItem('cw_memos') || "[]");
    memos.push(data);
    localStorage.setItem('cw_memos', JSON.stringify(memos));
    loadMemos();
}

function loadMemos() {
    let memos = JSON.parse(localStorage.getItem('cw_memos') || "[]");
    const list = document.getElementById('memoList');
    list.innerHTML = "";
    memos.reverse().forEach((m, idx) => {
        const div = document.createElement('div');
        div.className = "memo-item";
        div.innerHTML = `<span>${m.title} (${m.date})</span>`;
        // ロードボタンなどの追加も可能
        list.appendChild(div);
    });
}
