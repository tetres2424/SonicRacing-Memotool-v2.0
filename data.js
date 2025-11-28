// --- キャラクターデータ ---
const characters = [
    { name: "ソニック", type: "スピード" },
    { name: "テイルス", type: "テクニック" },
    { name: "ナックルズ", type: "パワー" },
    { name: "エミー", type: "スピード" }
];

// --- ガジェットデータ (サンプル) ---
// id: 識別ID, name: 名前, cost: コスト(1~3), effect: 効果説明
const gadgets = [
    { id: "g001", name: "ウィンドブースト", cost: 1, effect: "スタートダッシュの効果時間が少し延びる" },
    { id: "g002", name: "ヘビータンク", cost: 3, effect: "最高速度が大きく下がる代わりに、当たり負けしなくなる" },
    { id: "g003", name: "クイックチャージ", cost: 2, effect: "ドリフトごとのゲージ蓄積量がアップする" },
    { id: "g004", name: "マグネットシールド", cost: 2, effect: "アイテムを吸い寄せる範囲が広がる" },
    { id: "g005", name: "エアロボディ", cost: 1, effect: "空中での加速力が少しアップ" },
    { id: "g006", name: "スタビライザー", cost: 1, effect: "被弾時の反動を少し軽減する" },
    { id: "g007", name: "ターボエンジン", cost: 3, effect: "ブースト使用時の最高速度が劇的に向上する" }
];

// --- ランキング用データ (サンプル) ---
// 実際のTop50プレイヤーの構成データなどをここに入れます
const playerData = [
    { name: "PlayerA", char: "ソニック", machine: "スピード", gadgets: ["g001", "g003", "g007"] },
    { name: "PlayerB", char: "ナックルズ", machine: "パワー", gadgets: ["g002", "g006", "g006"] },
    { name: "PlayerC", char: "テイルス", machine: "テクニック", gadgets: ["g004", "g001", "g001"] }
];
