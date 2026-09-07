/**
 * 資料作成システム - コアロジック (app.js)
 * v2.5.2 構造化出力・キー名正規化・下限厳格チェック対応版
 */

// 形式確認用サンプル
const EMBEDDED_SAMPLE_SLIDE_SPEC_FORMAT_ONLY = {
  "meta": {
    "title": "【サンプル】社内備品管理の効率化に関するご報告",
    "subtitle": "備品貸出・在庫管理のデジタル化による業務削減 — v2.5.2 厳格スキーマモデル",
    "date_dept": "総務部   |   社内改善プロジェクトチーム",
    "confidential": false,
    "tone": "super_prime_v3"
  },
  "slides": [
    {
      "layout": "cover",
      "eyebrow": "INTERNAL REPORT",
      "title": "【サンプル】社内備品管理の効率化に関するご報告"
    },
    {
      "layout": "big_number",
      "eyebrow": "HERO KPI",
      "title": "棚卸し工数の劇的削減効果",
      "value": "93%",
      "unit": "削減",
      "message": "年間たな卸し所要時間を年150時間から年間",
      "desc": "※QRスキャン管理システム全社導入時の実測比較値"
    },
    {
      "layout": "toc",
      "eyebrow": "AGENDA",
      "title": "アジェンダ",
      "items": [
        "備品管理の現状と課題数値の分析",
        "QRスキャンによる改善ポイントと運用フロー",
        "新旧運用の比較と期待される定量的効果",
        "全社導入スケジュールと今後のステップ"
      ]
    },
    {
      "layout": "stats",
      "eyebrow": "BY THE NUMBERS",
      "title": "現状の備品管理コストと主要な課題数値",
      "items": [
        {
          "value": "150時間",
          "label": "年間たな卸し所要時間",
          "desc": "手書き台帳による全件目視確認が大きな**業務ボトルネック**となっております。"
        },
        {
          "value": "12%",
          "label": "所在不明備品の発生率",
          "desc": "返却記入漏れに起因する**備品紛失が多発**しております。"
        },
        {
          "value": "3日",
          "label": "PC貸出平均承認日数",
          "desc": "紙の物理的承認回覧により**大きなタイムロス**が発生。"
        }
      ]
    },
    {
      "layout": "cards",
      "eyebrow": "KEY POINTS",
      "title": "管理運用における2大構造的課題の整理",
      "items": [
        {
          "tag": "A",
          "heading": "台帳記入の抜け漏れと所在不明",
          "body": [
            "手書き紙台帳により**貸出記入忘れが多発**しています。",
            "誰がいつ借りているかが追跡できず所在不明の原因になります。"
          ],
          "note": "※QRコードスキャン化により即時解決"
        },
        {
          "tag": "B",
          "heading": "紙申請書の承認フロー遅延",
          "body": [
            "物理的な紙決裁書回覧のため決裁者の外出時に**処理が滞留**します。",
            "現在のステータスが申請者から見えず問い合わせ工数が発生。"
          ],
          "note": "※ワークフロー化で承認時間を90%削減"
        }
      ]
    },
    {
      "layout": "statement",
      "eyebrow": "KEY MESSAGE",
      "title": "QRスキャンとクラウド化により、年間100時間超の業務削減を実現します。",
      "body": [
        "全備品へ識別用QRラベルを貼付しスマートフォンでスキャン返却。",
        "リアルタイムな在庫把握により無駄な手入力と捜索工数を**完全撲滅**します。"
      ]
    },
    {
      "layout": "table",
      "eyebrow": "DETAILED DATA",
      "title": "従来運用と新運用の詳細比較と期待効果",
      "columns": ["比較項目", "従来(手書き紙台帳)", "新システム(クラウドQR)"],
      "rows": [
        ["貸出・返却手続き", "紙台帳へ手書き記入 (平均3分/件)", "QRスキャンで自動記録 (**平均10秒/件**)"],
        ["年間たな卸し工数", "全拠点目視確認 (年間150時間)", "バーコード一括リード (**年間10時間**)"],
        ["返却催促業務", "個別メール・電話での連絡作業", "システムによる**自動プッシュ通知**"]
      ]
    }
  ]
};

// レイアウト型アイブロウフォールバック対応表 (規約8 規定ラベル)
const LAYOUT_EYEBROW_MAP = {
  cover: 'PRESENTATION',
  toc: 'AGENDA',
  bullets: 'OVERVIEW',
  stats: 'BY THE NUMBERS',
  cards: 'KEY POINTS',
  statement: 'KEY MESSAGE',
  image_right: 'HOW IT WORKS',
  image_full: 'SHOWCASE',
  two_column: 'COMPARISON',
  table: 'DETAILS',
  big_number: 'HERO KPI'
};

// 修正4 (恒久対策): Gemini / OpenAI 用の厳格JSONスキーマ定義 (Structured Outputs / responseSchema)
const SLIDE_SPEC_JSON_SCHEMA = {
  type: "OBJECT",
  properties: {
    meta: {
      type: "OBJECT",
      properties: {
        title: { type: "STRING" },
        tone: { type: "STRING" },
        subtitle: { type: "STRING" },
        date_dept: { type: "STRING" },
        confidential: { type: "BOOLEAN" }
      },
      required: ["title", "tone"]
    },
    slides: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          layout: { type: "STRING" },
          eyebrow: { type: "STRING" },
          title: { type: "STRING" },
          lead: { type: "STRING" },
          body: {
            type: "ARRAY",
            items: { type: "STRING" }
          },
          value: { type: "STRING" },
          unit: { type: "STRING" },
          message: { type: "STRING" },
          desc: { type: "STRING" },
          columns: {
            type: "ARRAY",
            items: { type: "STRING" }
          },
          rows: {
            type: "ARRAY",
            items: {
              type: "ARRAY",
              items: { type: "STRING" }
            }
          },
          items: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                value: { type: "STRING" },
                label: { type: "STRING" },
                desc: { type: "STRING" },
                tag: { type: "STRING" },
                heading: { type: "STRING" },
                body: {
                  type: "ARRAY",
                  items: { type: "STRING" }
                },
                note: { type: "STRING" }
              }
            }
          },
          left: {
            type: "OBJECT",
            properties: {
              heading: { type: "STRING" },
              body: {
                type: "ARRAY",
                items: { type: "STRING" }
              }
            }
          },
          right: {
            type: "OBJECT",
            properties: {
              heading: { type: "STRING" },
              body: {
                type: "ARRAY",
                items: { type: "STRING" }
              }
            }
          },
          image_slots: {
            type: "OBJECT",
            properties: {
              main: { type: "STRING" }
            }
          }
        },
        required: ["layout", "title"]
      }
    }
  },
  required: ["meta", "slides"]
};

// スキーマ・プロンプト定義 (v2.5.2)
const DEFAULT_V252_SCHEMA = {
  "meta": {
    "template_name": "資料作成テンプレート",
    "version": "2.5.2",
    "changelog": "v2.5.2: PASS_B_COREフォーマット厳格指定・正規化関数追加・キー欠落自動補完完全廃止・Structured Outputs完全対応"
  },
  "tone_presets": [
    {
      "id": "super_prime_v3",
      "名称": "SUPER PRIME v3(ミニマル・エディトリアル)",
      "writing_style": "敬体。要点を明確にしつつ、重要数値や重要語句を強調表示する。",
      "design_tokens": {
        "font": "Yu Gothic",
        "font_en": "Arial",
        "heading_size": 22,
        "body_size": 12,
        "primary": "111111",
        "secondary": "666666",
        "muted": "AAAAAA",
        "accent": "111111",
        "emphasis_color": "C8102E",
        "bg": "FFFFFF",
        "panel": "F5F5F5",
        "header_style": "eyebrow",
        "footer_text": "SUPER PRIME — AI BUSINESS"
      }
    },
    {
      "id": "business_standard",
      "名称": "ビジネス標準",
      "writing_style": "敬体。結論先行。強調語句を分かりやすく太字提示する。",
      "design_tokens": {
        "font": "Meiryo",
        "font_en": "Arial",
        "heading_size": 20,
        "body_size": 13,
        "primary": "1A1A1A",
        "secondary": "595959",
        "muted": "BBBBBB",
        "accent": "C8102E",
        "emphasis_color": "C8102E",
        "bg": "FFFFFF",
        "panel": "F2F2F2",
        "header_style": "black_bar"
      }
    }
  ],
  "layouts": [
    { "id": "cover", "用途": "表紙" },
    { "id": "toc", "用途": "目次" },
    { "id": "big_number", "用途": "最重要数値を1枚で特大表示(ヒーローKPI)" },
    { "id": "bullets", "用途": "詳細説明箇条書き (1スライド最大6行)" },
    { "id": "image_right", "用途": "左に本文文章・右に図解/画像貼付枠" },
    { "id": "image_full", "用途": "画像貼付枠を中心に提示" },
    { "id": "two_column", "用途": "対比(課題/解決、Before/After)" },
    { "id": "table", "用途": "手順・比較表・料金・スケジュール" },
    { "id": "statement", "用途": "章の区切り・結論(メッセージ)" },
    { "id": "stats", "用途": "大きな数字の横並び(数値・実績値)" },
    { "id": "cards", "用途": "カードグリッド(課題・要素の整理)" }
  ],
  "prompt_assembly": {
    "passA_system_default": "あなたは資料の内容を構造化する編集者である。入力された元資料テキストから、重要な事実・数値・詳細な説明文章および重要度を抽出し、「インベントリ」へ変換せよ。出力はインベントリのみとする。",
    "passA_template": "以下の元資料テキストを構造化インベントリに変換してください。\n\n【資料タイトル】{title}\n【資料の種類】{doc_type.label}\n【想定読者】{audience}\n\n==============================\n{source_text}\n==============================\n"
  }
};

const PASS_A_CORE_V30 = `あなたは経営コンサルティングファームの資料分析責任者である。
【絶対最優先鉄則】長文だとしても資料内にある言葉に不必要なものは一切存在しない。どんな資料であっても、元の文章・言葉・解説・数値を勝手に削減・省略・要約切り捨てすることを永久に絶対禁止する。資料に含まれる全ての論理・根拠・文脈・補足テキストを100%完全に損失なく取り出した分析インベントリを作成せよ。

【分析の手順(この順で思考すること)】
手順1. 文書の全体理解
  この資料は誰が・誰に・何を達成するために書いたものかを特定する。

手順2. 主張と根拠の対抽出(ピラミッド原則)
  資料内の「主張(〜すべき/〜が有効)」と、それを支える
  「根拠(数値・事例・引用)」を必ずペアで抽出する。
  根拠のない主張は「根拠なし」と明記する。勝手に根拠を補わない。

手順3. 数値の文脈化
  数値は単体で抜き出さず、必ず「何と比べての数値か」
  (前年比か/業界平均比か/導入前比か)と「その数値が意味すること」を添える。

手順4. ストーリー要素の識別(SCQA)
  各セクションが物語上のどの役割かを判定する:
  S(状況: 前提の共有)/C(複雑化: 問題・変化)/
  Q(問い: 解くべき課題)/A(答え: 解決策・提案・結論)

手順5. 読者にとっての意味(So-What)の付与
  各セクションに「読者がこれを知ると何が変わるか」を1文で付す。

手順6. 反論・リスク・限界の抽出
  資料内に書かれている留保条件・リスク・適用限界を漏らさず拾う。

手順7. 原文引用ブロックの保全 (修正4)
  プロンプト・規約・コード・定型文など、一字一句に価値があるブロックは要約せず、
  verbatim: true を付して原文のまま text_body に収載せよ。

【インベントリの出力形式】
セクションごとに以下を記述する。
## セクション名
- type: 数値実績 / 課題列挙 / 対比 / 手順 / 一覧 / 概念説明 / 結論
- title: スライドタイトル案(話題名。15字以内)
- key_message: このセクションの主張1文
- so_what: 読者がこれを知ると何が変わるか(1文)
- story_role: S / C / Q / A のいずれか
- key_numbers: 「値|単位|意味と比較対象|重要度(高/中/低)」形式。
- evidence: 各主張を支える根拠の列挙
- keywords: 強調すべき語句(最大3個)
- caveats: 留保条件・リスク・適用限界
- verbatim: true または false
- text_body: セクションの詳細内容(原文の言葉・文面を1文字も削らず100%全件保持した詳細文章)

【絶対禁止事項】
・原文にある言葉・文章・補足のカット・省略・要約による切り捨て
・「〜など」「〜等」への丸め(列挙は全件書き出す)
・自己判断による重要度の切り捨て
`;

const PASS_A_PROMPTS_BY_TYPE = {
  pdf: PASS_A_CORE_V30 + `\n【PDF専用補足】PDF特有の改行ノイズを除外し、本文の言葉を100%全件保持して抽出せよ。`,
  pptx: PASS_A_CORE_V30 + `\n【PPTX専用補足】スライドの既存構成・テキスト・数値実績を省略せず100%全件保持して再構築せよ。`,
  txt_md: PASS_A_CORE_V30 + `\n【テキスト専用補足】文章中のすべての解説・言葉を1文字も削らず100%完全保持して整理せよ。`,
  docx: PASS_A_CORE_V30 + `\n【DOCX専用補足】文書資料の全文章・補足テキストを削らず100%保持して整理せよ。`
};

const PASS_B_CORE = `あなたは外資系コンサルティングファームのプレゼンテーションデザイナーである。

【設計の鉄則 v3.1】
1. 情報の完全保持と verbatim セクション保全 (修正4):
   ・verbatim: true のセクションは内容の要約・改変・分割統合を禁止。原文の行順を変えず100%そのまま bullets または cards 等で収載せよ。6行を超える場合は分割処理(続き)に委ねよ。
2. 再スライド化モードの順序維持 (修正5):
   ・元資料がスライド構造(【スライド n】等のマーカー)を持つ場合、元の章順・スライド順を厳格に維持せよ。SCQAによる章の順序再構成は、スライド構造を持たない平文文書の場合にのみ適用せよ。
3. 全レイアウト共通主張リード文 "lead" への配置 (修正3):
   ・スライドの主張(key_message)は、全レイアウト共通で "lead" フィールド(1行60字以内)に置くこと。body の1行目に置く旧ルールは廃止する。
4. キーの排他制約 (修正1):
   ・bullets / image_right ➔ body
   ・stats / cards ➔ items
   ・two_column ➔ left, right
   ・table ➔ columns, rows
   ・statement ➔ body (0〜2行)
   ・toc ➔ items (文字列配列)
   ※レイアウトで使用禁止されているキー(tableにbodyやleft/right等)の出力は固く禁ずる。

【最低限の形式(詳細はスキーマが強制する)】
・スライド仕様JSONのみを出力する。
・タイトルは15字以内の話題名。主張は lead フィールドに置く。
・キー名は lead / body / items / rows / left / right / image_slots のみ。
・meta.tone は "{tone.id}"。文体は {tone.writing_style} に従う。
`;

const PASS_B_VARIANTS = {
  data_driven: `\n【このデータ中心資料での必須構成】
・最も象徴的なトップ成果がある場合は big_number (value, unit, message, desc) を効果的に活用すること。
・重要数値が複数あるセクションは stats や cards、table を優先し、情報密度の高いスライド構成とすること。
・数値の出典・条件は desc または note に添えること。
・bullets の使用は最大1枚。
`,
  comparison: `\n【この対比中心資料での必須構成】
・対比セクションは two_column または table を使うこと。優位側の結論値は ** で太字強調すること。
・冒頭に statement で「何と何を比べ、何が結論か」を1枚で提示すること。
`,
  process: `\n【この手順中心資料での必須構成】
・手順は table(columns: [段階, 内容, 補足])または cards(1手順=1カード、tagは数字)で表現すること。
・各手順の所要時間・条件などの数値は ** で太字強調すること。
`,
  narrative: `\n【この説明中心資料での必須構成】
・章の変わり目に statement を入れ、key_message を大きく見せること。
・要素の列挙は cards や two_column を優先し、bullets は最大2枚。
`,
  manual_guide: `\n【このマニュアル・手引き・プロンプト集型資料での必須構成(最重要)】
1. 情報の完全保持（文章・要素の削り・要約の全面禁止）:
   ・原文に含まれる「プロンプト骨組み本文」「変数の説明(〔A〕〔B〕...)」「転用アイデア」「注意事項(事象・背景/対処)」は、一切要約・省略・削除してはならない。すべての変数・項目を100%保持して出力せよ。
2. 原文の配置・構造の再現:
   ・サマリー/概要 ➔ cards ＋ 使用モデル・コストの table
   ・骨組みプロンプト ➔ cards (上部にプロンプト本文、itemsに変数定義リスト)
   ・転用アイデア ➔ cards または two_column (転用先と書き換え箇所のペア)
   ・注意事項 ➔ table または two_column (左に「事象・背景」、右に「対処」を対照配置)
3. 章番号とタイトルの保持:
   ・タイトルは「1-1 案件サマリー」「1-2 骨組みプロンプト」「1-5 注意事項」等の話題名を15字以内で保持せよ。
`
};

const PASS_B_TEMPLATE = `以下の内容インベントリから、スライド仕様JSONを作成してください。

【資料タイトル】{title}
【資料の種類】{doc_type.label}
【想定読者】{audience}
【適用するトンマナ・文体】{tone.writing_style}

==============================
【内容インベントリ】
{inventory}
==============================
`;

let appState = {
  schema: null,
  customTones: [],
  attachmentsData: {
    sources: [],
    logo: null
  },
  inventoryText: '',
  profileResult: null,
  slideSpecJson: null,
  adminKeys: {
    gemini: '',
    openai: ''
  },
  providerPassA: 'auto',
  providerPassB: 'auto',
  openaiPassBModel: 'gpt-4o-mini',
  lastExecutionLog: null
};

const API_CONFIG = {
  gemini: {
    endpoint: (model) => `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
  },
  openai: {
    endpoint: () => 'https://api.openai.com/v1/chat/completions',
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initApp();
  });
} else {
  initApp();
}

function initApp() {
  try {
    loadSchema();
    loadCustomTones();
    loadAdminSettings();
  } catch (e) {
    console.warn('初期設定読み込み警告:', e);
    appState.schema = DEFAULT_V252_SCHEMA;
  }
  
  try {
    renderDynamicForm();
    renderToneList();
    updateProviderBadge();
    setupEventListeners();
  } catch (err) {
    console.error('初期化エラー:', err);
    appState.schema = DEFAULT_V252_SCHEMA;
    renderDynamicForm();
  }

  if (window.lucide) window.lucide.createIcons();
}

function profileInventory(inventoryText) {
  const sections = inventoryText.split(/^## /m).filter(Boolean);
  const count = (re) => (inventoryText.match(re) || []).length;
  const stats = {
    total: sections.length,
    highNumbers: count(/[|｜]\s*高|重要度\s*[:：]?\s*高/g),
    numeric: count(/type:\s*数値実績/g),
    compare: count(/type:\s*対比/g),
    procedure: count(/type:\s*(手順|一覧)/g),
    concept: count(/type:\s*(概念説明|結論)/g)
  };
  
  let profile = 'narrative';
  if (stats.highNumbers >= 3 || (stats.total > 0 && stats.numeric / stats.total >= 0.3)) profile = 'data_driven';
  else if (stats.total > 0 && stats.procedure / stats.total >= 0.4) profile = 'process';
  else if (stats.compare >= 2) profile = 'comparison';
  
  return { profile, stats };
}

function loadSchema() {
  const savedSchemaStr = localStorage.getItem('doc_system_schema_v252');
  if (savedSchemaStr) {
    try {
      const parsed = JSON.parse(savedSchemaStr);
      if (parsed.meta && parsed.meta.version === '2.5.2') {
        appState.schema = parsed;
        const ed = document.getElementById('schema-editor');
        if (ed) ed.value = JSON.stringify(appState.schema, null, 2);
        return;
      }
    } catch (e) {}
  }
  localStorage.removeItem('doc_system_schema_v24');
  localStorage.removeItem('doc_system_schema_v25');
  localStorage.removeItem('doc_system_schema_v251');
  localStorage.setItem('doc_system_schema_v252', JSON.stringify(DEFAULT_V252_SCHEMA, null, 2));
  appState.schema = DEFAULT_V252_SCHEMA;
  const ed = document.getElementById('schema-editor');
  if (ed) ed.value = JSON.stringify(DEFAULT_V252_SCHEMA, null, 2);
}

function loadCustomTones() {
  const savedTones = localStorage.getItem('doc_system_custom_tones');
  if (savedTones) {
    try { appState.customTones = JSON.parse(savedTones); } catch (e) { appState.customTones = []; }
  }
}

function loadAdminSettings() {
  appState.adminKeys.gemini = localStorage.getItem('doc_system_admin_gemini_key') || '';
  appState.adminKeys.openai = localStorage.getItem('doc_system_admin_openai_key') || '';
  appState.providerPassA = localStorage.getItem('doc_system_provider_passA') || 'auto';
  appState.providerPassB = localStorage.getItem('doc_system_provider_passB') || 'auto';
  appState.openaiPassBModel = localStorage.getItem('doc_system_openai_passB_model') || 'gpt-4o-mini';

  const geminiInput = document.getElementById('admin-gemini-key');
  const openaiInput = document.getElementById('admin-openai-key');
  const selectA = document.getElementById('setting-provider-passA');
  const selectB = document.getElementById('setting-provider-passB');
  const selectOpenAIModel = document.getElementById('setting-openai-model-passB');

  if (geminiInput) geminiInput.value = appState.adminKeys.gemini;
  if (openaiInput) openaiInput.value = appState.adminKeys.openai;
  if (selectA) selectA.value = appState.providerPassA;
  if (selectB) selectB.value = appState.providerPassB;
  if (selectOpenAIModel) selectOpenAIModel.value = appState.openaiPassBModel;
}

function resolveProviders() {
  const hasGemini = !!appState.adminKeys.gemini.trim();
  const hasOpenAI = !!appState.adminKeys.openai.trim();

  if (!hasGemini && !hasOpenAI) {
    return { passA: null, passB: null, error: 'APIキーが設定されていません。右上の「管理者設定」からGeminiまたはOpenAIのAPIキーを登録してください。' };
  }

  let passA = appState.providerPassA;
  let passB = appState.providerPassB;

  if (passA === 'auto') {
    passA = hasGemini ? 'gemini' : 'openai';
  } else if (passA === 'gemini' && !hasGemini) {
    passA = hasOpenAI ? 'openai' : null;
  } else if (passA === 'openai' && !hasOpenAI) {
    passA = hasGemini ? 'gemini' : null;
  }

  if (passB === 'auto') {
    if (hasGemini && hasOpenAI) passB = 'openai';
    else if (hasOpenAI) passB = 'openai';
    else passB = 'gemini';
  } else if (passB === 'openai' && !hasOpenAI) {
    passB = hasGemini ? 'gemini' : null;
  } else if (passB === 'gemini' && !hasGemini) {
    passB = hasOpenAI ? 'openai' : null;
  }

  if (!passA || !passB) {
    return { passA: null, passB: null, error: '選択されたプロバイダのAPIキーが管理者設定にありません。' };
  }

  return { passA, passB, error: null };
}

function updateProviderBadge() {
  const badge = document.getElementById('active-provider-badge');
  if (!badge) return;
  const res = resolveProviders();
  if (res.error) {
    badge.textContent = '⚠️ APIキー未設定 (管理者設定へ)';
    badge.className = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-950 text-red-300 border border-red-800 font-mono';
  } else {
    badge.textContent = `v2.5.2 [Pass A: ${res.passA.toUpperCase()} ➔ Pass B: ${res.passB.toUpperCase()}]`;
    badge.className = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-emerald-300 border border-emerald-900/50 font-mono';
  }
}

function renderDynamicForm() {
  const formEl = document.getElementById('dynamic-form');
  if (!formEl) return;
  formEl.innerHTML = '';
  
  const attachmentsWrapper = document.createElement('div');
  attachmentsWrapper.className = 'p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3 mb-4';
  
  const attTitle = document.createElement('h3');
  attTitle.className = 'text-xs font-bold text-slate-800 tracking-wider flex items-center gap-1.5';
  attTitle.innerHTML = '<i data-lucide="paperclip" class="w-4 h-4 text-indigo-600"></i> 資料やロゴの添付 (任意)';
  attachmentsWrapper.appendChild(attTitle);

  const sourceDiv = document.createElement('div');
  sourceDiv.className = 'space-y-1.5';
  sourceDiv.innerHTML = `
    <label class="block text-xs font-semibold text-slate-700">参考にしたい資料ファイル (PPTX / PDF / TXT / DOCX)</label>
    <input type="file" id="file-sources" multiple accept=".pptx,.txt,.md,.pdf,.docx,.xlsx" class="block w-full text-xs text-slate-700 file:mr-2.5 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300 cursor-pointer bg-white border border-slate-200 rounded-lg p-1 focus:outline-none">
    <div id="thumb-container-sources" class="hidden flex flex-wrap gap-2 pt-1"></div>
  `;
  attachmentsWrapper.appendChild(sourceDiv);

  const logoDiv = document.createElement('div');
  logoDiv.className = 'space-y-1.5';
  logoDiv.innerHTML = `
    <label class="block text-xs font-semibold text-slate-700">企業ロゴ画像 (PNG / SVG 推奨)</label>
    <input type="file" id="file-logo" accept=".png,.jpg,.jpeg,.svg,.webp" class="block w-full text-xs text-slate-700 file:mr-2.5 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300 cursor-pointer bg-white border border-slate-200 rounded-lg p-1 focus:outline-none">
    <div id="thumb-container-logo" class="hidden flex flex-wrap gap-2 pt-1"></div>
  `;
  attachmentsWrapper.appendChild(logoDiv);

  formEl.appendChild(attachmentsWrapper);

  const fields = [
    { id: 'usage_mode', label: '資料の用途', type: 'select', required: true, options: [
      { value: 'reading', label: '📖 閲覧用・配布用 (情報密度優先)' },
      { value: 'presentation', label: '🎤 発表用・プレゼン用 (視覚効果優先)' }
    ]},
    { id: 'title', label: '資料タイトル', type: 'text', required: false, placeholder: '例: 新事業提案書 (空欄時は自動設定)' },
    { id: 'doc_type', label: '資料の種類', type: 'select', required: true, options: [
      { value: 'sales_proposal', label: '営業提案書' },
      { value: 'internal_report', label: '社内報告書' },
      { value: 'technical_review', label: '技術・検証資料' },
      { value: 'training_manual', label: 'マニュアル・手引き' }
    ]},
    { id: 'audience', label: '想定読者', type: 'text', required: false, placeholder: '例: 経営層、担当者 (空欄時は自動分析)' },
    { id: 'tone', label: 'デザインスタイル', type: 'select', required: true, options_from_schema: true },
    { id: 'confidential', label: '社外秘表記を入れる', type: 'checkbox', required: false, default: true }
  ];

  fields.forEach(field => {
    const fieldDiv = document.createElement('div');
    fieldDiv.className = 'space-y-1';
    
    const label = document.createElement('label');
    label.className = 'block text-xs font-bold text-slate-700';
    label.innerHTML = `${field.label}${field.required ? ' <span class="text-red-500">*</span>' : ' <span class="text-slate-400 font-normal">(任意)</span>'}`;
    fieldDiv.appendChild(label);

    let inputEl;
    if (field.type === 'text') {
      inputEl = document.createElement('input');
      inputEl.type = 'text';
      if (field.default) inputEl.value = field.default;
      if (field.placeholder) inputEl.placeholder = field.placeholder;
    } else if (field.type === 'checkbox') {
      fieldDiv.className = 'flex items-center space-x-2 py-1';
      inputEl = document.createElement('input');
      inputEl.type = 'checkbox';
      inputEl.checked = field.default !== undefined ? field.default : true;
      inputEl.className = 'w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 bg-white';
      label.className = 'text-xs font-bold text-slate-700 select-none cursor-pointer';
      fieldDiv.innerHTML = '';
      fieldDiv.appendChild(inputEl);
      fieldDiv.appendChild(label);
    } else if (field.type === 'select') {
      inputEl = document.createElement('select');
      if (field.options_from_schema) {
        const presets = (appState.schema && appState.schema.tone_presets) ? appState.schema.tone_presets : (DEFAULT_V252_SCHEMA.tone_presets || []);
        const allTones = [...presets, ...(appState.customTones || [])];
        allTones.forEach(t => {
          const o = document.createElement('option');
          o.value = t.id;
          o.textContent = t.名称 || t.name;
          if (t.id === 'super_prime_v3') o.selected = true;
          inputEl.appendChild(o);
        });
      } else if (field.options) {
        field.options.forEach(opt => {
          const o = document.createElement('option');
          o.value = opt.value;
          o.textContent = opt.label;
          inputEl.appendChild(o);
        });
      }
    }

    if (inputEl) {
      inputEl.id = `field-${field.id}`;
      inputEl.name = field.id;
      if (field.type !== 'checkbox') {
        inputEl.className = 'w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 transition-colors';
        fieldDiv.appendChild(inputEl);
      }
    }
    formEl.appendChild(fieldDiv);
  });

  const fsEl = document.getElementById('file-sources');
  if (fsEl) fsEl.addEventListener('change', (e) => handleSourceFilesSelect(e));
  
  const flEl = document.getElementById('file-logo');
  if (flEl) flEl.addEventListener('change', (e) => handleLogoFileSelect(e));

  if (window.lucide) window.lucide.createIcons();
}

function updateFieldWithValue(fieldId, val) {
  const el = document.getElementById(`field-${fieldId}`);
  if (!el || !val) return;
  el.value = val;
  el.classList.remove('field-updated');
  void el.offsetWidth;
  el.classList.add('field-updated');
}

function cleanExtractedText(rawText) {
  if (!rawText) return '';
  return rawText
    .replace(/%PDF-[\s\S]*?(?=\n\n|\r\n\r\n|$)/gi, '')
    .replace(/stream[\s\S]*?endstream/gi, '')
    .replace(/\d+\s+\d+\s+obj[\s\S]*?endobj/gi, '')
    .replace(/<<[\s\S]*?>>/g, '')
    .replace(/[^\x09\x0A\x0D\x20-\x7E\u3000-\u30FF\u4E00-\u9FFF\uFF00-\uFFEF]/g, ' ') // バイナリ文字ノイズ除去
    .replace(/\s{3,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function extractTextFromPptxFile(file) {
  if (!window.JSZip) return '';
  try {
    const zip = await window.JSZip.loadAsync(file);
    let extractedSlideTexts = [];

    const slideFiles = Object.keys(zip.files).filter(filename => filename.startsWith('ppt/slides/slide') && filename.endsWith('.xml'));
    slideFiles.sort((a, b) => {
      const numA = parseInt(a.replace(/[^0-9]/g, '')) || 0;
      const numB = parseInt(b.replace(/[^0-9]/g, '')) || 0;
      return numA - numB;
    });

    for (let i = 0; i < slideFiles.length; i++) {
      const slidePath = slideFiles[i];
      const xmlText = await zip.files[slidePath].async('string');
      
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      const allTextElements = xmlDoc.querySelectorAll('t, a\\:t, w\\:t');
      let slideTextArr = [];

      if (allTextElements && allTextElements.length > 0) {
        allTextElements.forEach(node => {
          const t = node.textContent.trim();
          if (t && !slideTextArr.includes(t)) slideTextArr.push(t);
        });
      }

      if (slideTextArr.length > 0) {
        extractedSlideTexts.push(`【スライド ${i + 1} の本文テキスト】\n` + slideTextArr.join('\n'));
      }
    }

    return extractedSlideTexts.join('\n\n');
  } catch (err) {
    console.warn('PPTXパースエラー:', err);
    return '';
  }
}

async function extractTextFromPdfFile(file) {
  if (!window.pdfjsLib) return '';
  try {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let extractedPagesText = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageTextArr = textContent.items.map(item => item.str.trim()).filter(Boolean);
      
      if (pageTextArr.length > 0) {
        extractedPagesText.push(`【PDF ページ ${i} / ${pdf.numPages}】\n` + pageTextArr.join(' '));
      }
    }

    return extractedPagesText.join('\n\n');
  } catch (err) {
    console.warn('PDFパースエラー:', err);
    return '';
  }
}

async function analyzeAttachedDocAndAutofill() {
  const sources = appState.attachmentsData.sources || [];
  if (sources.length === 0) return;

  const statusBanner = document.getElementById('auto-analyze-status');
  const statusMsg = document.getElementById('auto-analyze-msg');
  const previewTextarea = document.getElementById('extracted-source-preview');
  const charCountEl = document.getElementById('extracted-char-count');
  
  if (statusBanner) {
    statusBanner.classList.remove('hidden');
    statusMsg.textContent = `✨ 添付資料「${sources[0].name}」から全テキストを解凍抽出中...`;
  }

  let combinedText = '';
  sources.forEach(s => { combinedText += `\n【資料名: ${s.name}】\n${s.content}\n`; });

  if (previewTextarea) previewTextarea.value = combinedText.trim();
  if (charCountEl) charCountEl.textContent = `${combinedText.trim().length} 文字解凍抽出完了 (編集可能)`;

  const fileNameClean = sources[0].name.replace(/\.[^/.]+$/, "");
  updateFieldWithValue('title', `${fileNameClean} に関する提案レポート`);
  updateFieldWithValue('audience', `関係者・意思決定グループ`);

  if (statusBanner) {
    statusMsg.textContent = `🎉 「${sources[0].name}」の全文章 (${combinedText.trim().length}文字) の抽出が完了しました！`;
    setTimeout(() => statusBanner.classList.add('hidden'), 3500);
  }
}

function handleSourceFilesSelect(event) {
  const files = event.target.files;
  appState.attachmentsData.sources = [];
  const container = document.getElementById('thumb-container-sources');
  if (!files || files.length === 0) {
    if (container) {
      container.classList.add('hidden');
      container.innerHTML = '';
    }
    return;
  }
  if (container) {
    container.classList.remove('hidden');
    container.innerHTML = '';
  }

  let loadedCount = 0;
  Array.from(files).forEach(async (file) => {
    const ext = file.name.toLowerCase().split('.').pop();
    let fileType = 'txt_md';
    if (ext === 'pdf') fileType = 'pdf';
    else if (ext === 'pptx') fileType = 'pptx';
    else if (ext === 'docx') fileType = 'docx';
    
    appState.attachmentsData.detectedFileType = fileType;

    const fileInfo = { name: file.name, size: file.size, fileType: fileType, content: '' };
    
    if (ext === 'pptx') {
      const extractedText = await extractTextFromPptxFile(file);
      fileInfo.content = extractedText || `【PPTXファイル: ${file.name}】`;
      appState.attachmentsData.sources.push(fileInfo);
      loadedCount++;
      if (loadedCount === files.length) analyzeAttachedDocAndAutofill();
    } else if (ext === 'pdf') {
      const extractedText = await extractTextFromPdfFile(file);
      fileInfo.content = extractedText || `【PDFファイル: ${file.name}】`;
      appState.attachmentsData.sources.push(fileInfo);
      loadedCount++;
      if (loadedCount === files.length) analyzeAttachedDocAndAutofill();
    } else if (ext === 'json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonObj = JSON.parse(e.target.result || '{}');
          if (jsonObj.schema_version === "1.1" || jsonObj.schema_version === "1.0" || jsonObj.facts) {
            let invText = `【Research Studio 構造化ソースパック (schema_version: ${jsonObj.schema_version || '1.1'})】\n対象: ${jsonObj.form_values?.target_entity || ''}\n目的: ${jsonObj.form_values?.goal || ''}\n\n`;
            
            if (Array.isArray(jsonObj.facts)) {
              invText += `## 検証済み一次ファクト (facts)\n`;
              jsonObj.facts.forEach(f => {
                const supportsStr = f.supports ? ` [対応章: ${f.supports}]` : '';
                invText += `- [${f.id}] (${f.category || '事実'}) ${f.statement}${supportsStr} (出典: ${f.source_id})\n`;
                if (Array.isArray(f.key_numbers)) {
                  invText += `  - key_numbers: ${f.key_numbers.join(', ')}\n`;
                }
              });
              invText += `\n`;
            }

            if (Array.isArray(jsonObj.sources)) {
              invText += `## 出典 Web メタデータ (sources)\n`;
              jsonObj.sources.forEach(s => {
                invText += `- [${s.id}] ${s.title} (${s.url}) [取得日: ${s.accessed}]\n`;
              });
              invText += `\n`;
            }

            if (Array.isArray(jsonObj.checklist)) {
              invText += `## チェックリスト＆留保事項 (checklist)\n`;
              jsonObj.checklist.forEach(c => {
                invText += `- [${c.status}] ${c.item} (${c.reason})\n`;
              });
              invText += `\n`;
            }

            if (Array.isArray(jsonObj.unresolved) && jsonObj.unresolved.length > 0) {
              invText += `## 未確認事項 (unresolved)\n`;
              jsonObj.unresolved.forEach(u => {
                invText += `- ${u}\n`;
              });
              invText += `\n`;
            }

            fileInfo.content = invText;

            if (jsonObj.form_values) {
              if (jsonObj.form_values.target_entity) updateFieldWithValue('title', `${jsonObj.form_values.target_entity} に関する提案レポート`);
              if (jsonObj.form_values.usage) updateFieldWithValue('usage_mode', jsonObj.form_values.usage);
              if (jsonObj.form_values.doc_type) updateFieldWithValue('doc_type', jsonObj.form_values.doc_type);
            }
          } else {
            fileInfo.content = cleanExtractedText(e.target.result || '');
          }
        } catch (err) {
          fileInfo.content = cleanExtractedText(e.target.result || '');
        }
        appState.attachmentsData.sources.push(fileInfo);
        loadedCount++;
        if (loadedCount === files.length) analyzeAttachedDocAndAutofill();
      };
      reader.readAsText(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        fileInfo.content = cleanExtractedText(e.target.result || '');
        appState.attachmentsData.sources.push(fileInfo);
        loadedCount++;
        if (loadedCount === files.length) analyzeAttachedDocAndAutofill();
      };
      reader.readAsText(file);
    }

    if (container) {
      const card = document.createElement('div');
      card.className = 'bg-slate-900 border border-blue-900/50 rounded-xl p-2 flex items-center gap-2 text-[10px] text-slate-300';
      card.innerHTML = `<i data-lucide="file-text" class="w-4 h-4 text-blue-400"></i><span class="font-bold truncate max-w-[150px]">${file.name}</span> <span class="text-emerald-400">✓</span>`;
      container.appendChild(card);
    }
  });
  if (window.lucide) window.lucide.createIcons();
}

function handleLogoFileSelect(event) {
  const files = event.target.files;
  const container = document.getElementById('thumb-container-logo');
  if (!files || files.length === 0) {
    appState.attachmentsData.logo = null;
    if (container) {
      container.classList.add('hidden');
      container.innerHTML = '';
    }
    return;
  }
  const file = files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    appState.attachmentsData.logo = { name: file.name, dataUrl: e.target.result };
    if (container) {
      container.classList.remove('hidden');
      container.innerHTML = `
        <div class="bg-slate-900 border border-blue-900/50 rounded-xl p-2 flex items-center gap-2">
          <img src="${e.target.result}" class="h-8 object-contain bg-slate-950 rounded p-1 border border-slate-800">
          <span class="text-[10px] text-slate-300 font-bold">${file.name}</span>
        </div>
      `;
    }
    if (appState.slideSpecJson) renderDeterministicWebPreview();
  };
  reader.readAsDataURL(file);
}

function renderToneList() {
  const toneListEl = document.getElementById('tone-list');
  if (!toneListEl) return;
  toneListEl.innerHTML = '';
  
  const systemPresets = (appState.schema && appState.schema.tone_presets) ? appState.schema.tone_presets : (DEFAULT_V252_SCHEMA.tone_presets || []);
  const allTones = [...systemPresets, ...(appState.customTones || [])];
  
  allTones.forEach(tone => {
    const isSystem = systemPresets.some(s => s.id === tone.id);
    const id = tone.id;
    const name = tone.名称 || tone.name;
    const style = tone.writing_style || tone.指針 || '';
    
    const card = document.createElement('div');
    card.className = `tone-preset-item p-2.5 rounded-xl flex flex-col justify-between gap-1 border ${id === 'super_prime_v3' ? 'border-indigo-500/80 bg-indigo-950/20' : 'border-slate-850 bg-slate-900/60'}`;
    
    const top = document.createElement('div');
    top.className = 'flex justify-between items-center';
    
    const title = document.createElement('h4');
    title.className = 'text-xs font-bold text-slate-200 flex items-center gap-1.5';
    title.innerHTML = `<span class="w-2 h-2 rounded-full ${id === 'super_prime_v3' ? 'bg-indigo-400 animate-pulse' : (isSystem ? 'bg-emerald-500' : 'bg-blue-500')}"></span> ${name}`;
    top.appendChild(title);
    
    if (!isSystem) {
      const actions = document.createElement('div');
      actions.className = 'flex space-x-1';
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'p-1 hover:text-red-400 text-slate-500 transition-colors';
      deleteBtn.innerHTML = '<i data-lucide="trash-2" class="w-3 h-3"></i>';
      deleteBtn.addEventListener('click', (e) => { e.stopPropagation(); deleteTone(id); });
      actions.appendChild(deleteBtn);
      top.appendChild(actions);
    } else {
      const tag = document.createElement('span');
      tag.className = 'text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800';
      tag.textContent = id === 'super_prime_v3' ? 'v3推奨' : '標準';
      top.appendChild(tag);
    }
    
    const desc = document.createElement('p');
    desc.className = 'text-[10px] text-slate-400 leading-tight line-clamp-2';
    desc.textContent = style;
    
    card.appendChild(top);
    card.appendChild(desc);
    toneListEl.appendChild(card);
  });
  
  if (window.lucide) window.lucide.createIcons();
}

function getFormValues() {
  const formValues = {};
  const fieldIds = ['usage_mode', 'title', 'doc_type', 'audience', 'tone', 'confidential'];
  fieldIds.forEach(id => {
    const el = document.getElementById(`field-${id}`);
    if (!el) return;
    if (el.type === 'checkbox') {
      formValues[id] = el.checked;
    } else if (id === 'doc_type') {
      const opt = el.options[el.selectedIndex];
      formValues[id] = { value: el.value, label: opt ? opt.textContent : el.value };
    } else if (id === 'tone') {
      const presets = (appState.schema && appState.schema.tone_presets) ? appState.schema.tone_presets : (DEFAULT_V252_SCHEMA.tone_presets || []);
      const allTones = [...presets, ...(appState.customTones || [])];
      const selected = allTones.find(t => t.id === el.value) || { id: el.value, writing_style: '' };
      formValues[id] = selected;
    } else {
      formValues[id] = el.value;
    }
  });
  return formValues;
}

// 修正4 (恒久対策): Gemini / OpenAI 用の Structured Outputs 呼び出しの実装
async function callLLMProvider(provider, promptText, isJsonMode = false) {
  const geminiKey = appState.adminKeys.gemini.trim();
  const openaiKey = appState.adminKeys.openai.trim();

  if (provider === 'gemini') {
    if (!geminiKey) throw new Error('Google Gemini APIキーが登録されていません。');
    const modelsToTry = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    let lastError = null;

    for (const targetModel of modelsToTry) {
      try {
        const bodyObj = {
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 65536
          }
        };
        if (isJsonMode) {
          bodyObj.generationConfig.responseMimeType = "application/json";
          bodyObj.generationConfig.responseSchema = SLIDE_SPEC_JSON_SCHEMA;
        }

        const response = await fetch(API_CONFIG.gemini.endpoint(targetModel) + `?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyObj)
        });

        if (response.ok) {
          const data = await response.json();
          const candidate = data.candidates?.[0];
          
          if (candidate?.finishReason === 'MAX_TOKENS') {
            throw new Error('【トークン上限切断エラー】最大出力トークン数に達し切断されました。');
          }

          const outText = candidate?.content?.parts?.[0]?.text || '';
          if (outText) return outText;
        }

        const err = await response.json().catch(() => ({}));
        const msg = err.error?.message || `Gemini HTTP ${response.status}`;
        if (msg.includes('not found') || msg.includes('no longer available') || msg.includes('is not supported')) {
          lastError = new Error(msg);
          continue;
        }
        throw new Error(msg);
      } catch (e) {
        lastError = e;
        if (e.message.includes('トークン上限切断エラー')) throw e;
      }
    }
    throw lastError || new Error('有効なGeminiモデルが見つかりませんでした。');

  } else if (provider === 'openai') {
    if (!openaiKey) throw new Error('OpenAI APIキーが登録されていません。');
    const targetModel = appState.openaiPassBModel || 'gpt-4o-mini';

    const bodyObj = {
      model: targetModel,
      messages: [{ role: 'user', content: promptText }],
      temperature: 0.1,
      max_tokens: 16384
    };

    if (isJsonMode) {
      bodyObj.response_format = {
        type: "json_schema",
        json_schema: {
          name: "slide_spec_schema",
          strict: true,
          schema: {
            type: "object",
            properties: {
              meta: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  tone: { type: "string" }
                },
                required: ["title", "tone"],
                additionalProperties: false
              },
              slides: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    layout: { type: "string" },
                    eyebrow: { type: "string" },
                    title: { type: "string" },
                    body: {
                      type: "array",
                      items: { type: "string" }
                    },
                    value: { type: "string" },
                    unit: { type: "string" },
                    message: { type: "string" },
                    desc: { type: "string" },
                    columns: {
                      type: "array",
                      items: { type: "string" }
                    },
                    rows: {
                      type: "array",
                      items: {
                        type: "array",
                        items: { type: "string" }
                      }
                    },
                    items: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          value: { type: "string" },
                          label: { type: "string" },
                          desc: { type: "string" },
                          tag: { type: "string" },
                          heading: { type: "string" },
                          body: {
                            type: "array",
                            items: { type: "string" }
                          },
                          note: { type: "string" }
                        },
                        required: ["value", "label", "desc", "tag", "heading", "body", "note"],
                        additionalProperties: false
                      }
                    },
                    left: {
                      type: "object",
                      properties: {
                        heading: { type: "string" },
                        body: {
                          type: "array",
                          items: { type: "string" }
                        }
                      },
                      required: ["heading", "body"],
                      additionalProperties: false
                    },
                    right: {
                      type: "object",
                      properties: {
                        heading: { type: "string" },
                        body: {
                          type: "array",
                          items: { type: "string" }
                        }
                      },
                      required: ["heading", "body"],
                      additionalProperties: false
                    },
                    image_slots: {
                      type: "object",
                      properties: {
                        main: { type: "string" }
                      },
                      required: ["main"],
                      additionalProperties: false
                    }
                  },
                  required: ["layout", "eyebrow", "title", "body", "value", "unit", "message", "desc", "columns", "rows", "items", "left", "right", "image_slots"],
                  additionalProperties: false
                }
              }
            },
            required: ["meta", "slides"],
            additionalProperties: false
          }
        }
      };
    }

    const response = await fetch(API_CONFIG.openai.endpoint(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`
      },
      body: JSON.stringify(bodyObj)
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `OpenAI HTTP ${response.status}`);
    }
    const data = await response.json();
    const choice = data.choices?.[0];

    if (choice?.finish_reason === 'length') {
      throw new Error('【トークン上限切断エラー】OpenAIの最大出力トークン数に達し切断されました。');
    }

    return choice?.message?.content || '';
  }
}

async function runChunkedPassA(provider, sourceText, formValues) {
  const CHUNK_SIZE = 12000;
  const fileType = appState.attachmentsData.detectedFileType || 'txt_md';
  const customRolePrompt = PASS_A_PROMPTS_BY_TYPE[fileType] || PASS_A_PROMPTS_BY_TYPE.txt_md;
  const defaultSys = appState.schema.prompt_assembly.passA_system_default || appState.schema.prompt_assembly.passA_system || '';
  const passA_sys = customRolePrompt + "\n\n" + defaultSys;

  if (sourceText.length <= CHUNK_SIZE) {
    const passA_tpl = appState.schema.prompt_assembly.passA_template;
    const prompt = passA_sys + "\n\n" + passA_tpl
      .replace('{title}', formValues.title || '提案レポート')
      .replace('{doc_type.label}', formValues.doc_type ? formValues.doc_type.label : '営業提案')
      .replace('{audience}', formValues.audience || '意思決定者')
      .replace('{source_text}', sourceText);
    return await callLLMProvider(provider, prompt, false);
  }

  let combinedInventory = '';
  let start = 0;
  let chunkIdx = 1;

  while (start < sourceText.length) {
    const chunkText = sourceText.substring(start, start + CHUNK_SIZE);
    const passA_tpl = appState.schema.prompt_assembly.passA_template;
    const prompt = passA_sys + `\n\n【分割パート ${chunkIdx}】\n` + passA_tpl
      .replace('{title}', (formValues.title || '提案レポート') + ` (Part ${chunkIdx})`)
      .replace('{doc_type.label}', formValues.doc_type ? formValues.doc_type.label : '営業提案')
      .replace('{audience}', formValues.audience || '意思決定者')
      .replace('{source_text}', chunkText);

    const chunkInv = await callLLMProvider(provider, prompt, false);
    combinedInventory += `\n\n<!-- Part ${chunkIdx} -->\n` + chunkInv;

    start += CHUNK_SIZE;
    chunkIdx++;
  }

  return combinedInventory;
}

async function runPassAPassBPipeline() {
  const providers = resolveProviders();
  if (providers.error) {
    alert(providers.error);
    document.getElementById('btn-show-settings').click();
    return;
  }

  const formValues = getFormValues();
  const toneObj = formValues.tone;
  const previewTextarea = document.getElementById('extracted-source-preview');
  let sourceText = previewTextarea ? previewTextarea.value.trim() : '';

  if (!sourceText) {
    alert('情報源テキストがありません。資料ファイル(.pptx/.txt)を添付するか、確認エリアにテキストを入力してください。');
    return;
  }

  const statusEl = document.getElementById('status-step1-direct');
  const statusMsg = document.getElementById('pipeline-status-msg');
  const btn = document.getElementById('btn-run-step1-direct');
  const jsonOutputEl = document.getElementById('json-output');
  const passBLogTag = document.getElementById('pass-b-log-tag');

  if (statusEl) statusEl.classList.remove('hidden');
  if (btn) btn.disabled = true;

  try {
    if (statusMsg) statusMsg.textContent = `[Pass A: ${providers.passA.toUpperCase()}] 重要度・数値インベントリを作成中...`;
    const inventoryResult = await runChunkedPassA(providers.passA, sourceText, formValues);
    appState.inventoryText = inventoryResult;

    const profResult = profileInventory(inventoryResult);
    appState.profileResult = profResult;

    if (statusMsg) statusMsg.textContent = `[Pass B: ${providers.passB.toUpperCase()}] プロファイル(${profResult.profile})に適合したJSONを出力中...`;

    const variantPrompt = PASS_B_VARIANTS[profResult.profile] || PASS_B_VARIANTS.narrative;
    const dynamicPassBSystem = PASS_B_CORE.replace('{tone.id}', toneObj.id) + variantPrompt;

    const passB_prompt = dynamicPassBSystem + "\n\n" + PASS_B_TEMPLATE
      .replace('{title}', formValues.title || '提案レポート')
      .replace('{doc_type.label}', formValues.doc_type ? formValues.doc_type.label : '営業提案')
      .replace('{audience}', formValues.audience || '意思決定者')
      .replace('{tone.writing_style}', toneObj.writing_style || '敬体。結論先行。')
      .replace('{inventory}', inventoryResult);

    const rawJsonStr = await callLLMProvider(providers.passB, passB_prompt, true);
    if (jsonOutputEl) jsonOutputEl.value = formatJsonString(rawJsonStr);

    appState.lastExecutionLog = {
      passA: providers.passA,
      passB: providers.passB,
      profile: profResult.profile,
      timestamp: new Date().toLocaleTimeString(),
      inventoryLength: inventoryResult.length,
      sourceLength: sourceText.length
    };

    if (passBLogTag) {
      passBLogTag.textContent = `プロファイル判定: ${profResult.profile} (重要数値:${profResult.stats.highNumbers}件) [${providers.passA.toUpperCase()} ➔ ${providers.passB.toUpperCase()}]`;
    }

    const isValOk = runStep2Validation();
    if (!isValOk) {
      alert("❌ 生成結果が仕様要件を満たしませんでした。エラーログをご確認の上、再実行を行ってください。");
    }

  } catch (err) {
    alert(`パイプライン実行エラー: ${err.message}`);
  } finally {
    if (statusEl) statusEl.classList.add('hidden');
    if (btn) btn.disabled = false;
  }
}

function loadMockSlideSpecV3() {
  try {
    const jsonStr = JSON.stringify(EMBEDDED_SAMPLE_SLIDE_SPEC_FORMAT_ONLY, null, 2);
    const jsonOutputEl = document.getElementById('json-output');
    if (jsonOutputEl) jsonOutputEl.value = jsonStr;
    runStep2Validation();
  } catch (e) {
    alert('形式見本JSONの読み込み中にエラーが発生しました: ' + e.message);
  }
}

// 修正2: キー名の吸収(エイリアス正規化)をパース直後に実行
function normalizeSpecKeys(spec) {
  if (!spec || !Array.isArray(spec.slides)) return spec;
  spec.slides.forEach(s => {
    if (!s.body) {
      const alias = s.content || s.points || s.texts || s.bullet_points || s.text;
      if (Array.isArray(alias)) s.body = alias.map(String);
      else if (typeof alias === 'string') s.body = [alias];
    }
    if (!s.title && s.heading) s.title = s.heading;
    ['content','points','texts','bullet_points','text','heading'].forEach(k => delete s[k]);
  });
  return spec;
}

function splitOverlongSlides(spec) {
  if (!spec || !Array.isArray(spec.slides)) return spec;
  const MAX = 6;
  const newSlides = [];
  spec.slides.forEach((sl) => {
    const splittable = ['bullets', 'image_right'];
    if (splittable.includes(sl.layout) && Array.isArray(sl.body) && sl.body.length > MAX) {
      for (let i = 0; i < sl.body.length; i += MAX) {
        const chunk = sl.body.slice(i, i + MAX);
        if (i === 0) {
          newSlides.push({ ...sl, body: chunk });
        } else {
          const cont = { ...sl, title: `${sl.title || 'スライド'} (続き)`, body: chunk, layout: 'bullets' };
          delete cont.image_slots;
          newSlides.push(cont);
        }
      }
    } else {
      newSlides.push(sl);
    }
  });
  spec.slides = newSlides;
  return spec;
}

function capEmphasis(spec, max = 3) {
  if (!spec || !Array.isArray(spec.slides)) return spec;
  spec.slides.forEach(sl => {
    let used = 0;
    const walk = (v) => typeof v === 'string'
      ? v.replace(/\*\*(.+?)\*\*/g, (m, g) => (++used <= max ? m : g))
      : v;
    if (Array.isArray(sl.body)) sl.body = sl.body.map(walk);
    (sl.items || []).forEach(it => {
      if (Array.isArray(it.body)) it.body = it.body.map(walk);
      if (it.desc) it.desc = walk(it.desc);
    });
    if (sl.title) sl.title = String(sl.title).replace(/\*\*/g, '');
  });
  return spec;
}

// 規約1: レイアウト写像関数
const LAYOUT_MAPPING = {
  handout: 'two_column',
  summary: 'bullets',
  agenda: 'toc',
  kpi: 'stats',
  overview: 'bullets',
  feature: 'cards'
};

function fixLayouts(spec, addLog) {
  if (!spec || !Array.isArray(spec.slides)) return spec;
  const VALID_LAYOUTS = ['cover', 'toc', 'bullets', 'image_right', 'image_full', 'two_column', 'table', 'statement', 'stats', 'cards', 'big_number'];
  spec.slides.forEach((sl, idx) => {
    let l = sl.layout ? String(sl.layout).toLowerCase().trim() : 'bullets';
    if (!VALID_LAYOUTS.includes(l)) {
      const mapped = LAYOUT_MAPPING[l] || 'two_column';
      addLog(`⚠️ [規約1] 未定義レイアウト "${sl.layout}" (Slide[${idx+1}]) を検出 ➔ 近似レイアウト "${mapped}" へ自動写像しました。`, false);
      sl.layout = mapped;
    } else {
      sl.layout = l;
    }
  });
  return spec;
}

// 規約3: 死にデータ・空キー除去 (修正2-c)
function stripEmptyKeys(obj) {
  if (Array.isArray(obj)) {
    const cleaned = obj.map(stripEmptyKeys).filter(v => 
      v !== null && 
      v !== undefined && 
      v !== '' && 
      !(Array.isArray(v) && v.length === 0) && 
      !(typeof v === 'object' && Object.keys(v).length === 0)
    );
    return cleaned.length === 0 ? undefined : cleaned;
  } else if (obj !== null && typeof obj === 'object') {
    const newObj = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v === null || v === undefined || v === '') continue;
      const cleanedV = stripEmptyKeys(v);
      if (cleanedV === null || cleanedV === undefined || cleanedV === '') continue;
      if (Array.isArray(cleanedV) && cleanedV.length === 0) continue;
      if (typeof cleanedV === 'object' && Object.keys(cleanedV).length === 0) continue;
      newObj[k] = cleanedV;
    }
    return Object.keys(newObj).length === 0 ? undefined : newObj;
  }
  return obj;
}

// 規約2 & v3.1: 構造取り違え自動変換・キー排他制御・lead自動救済
function fixStructuralMismatch(spec, addLog) {
  if (!spec || !Array.isArray(spec.slides)) return spec;
  spec.slides.forEach((sl, idx) => {
    // 修正2-a / 2-b: layout="table" なのに rows が空の救済
    if (sl.layout === 'table' && (!sl.rows || sl.rows.length === 0)) {
      if (sl.left || sl.right) {
        addLog(`⚠️ [v3.1救済] Slide[${idx+1}] table構造でrowsが空かつleft/rightが存在するため layout="two_column" へ自動換装しました。`, true);
        sl.layout = 'two_column';
      } else if (Array.isArray(sl.items) && sl.items.length > 0) {
        addLog(`⚠️ [v3.1救済] Slide[${idx+1}] table構造でrowsが空かつitemsが存在するため layout="cards" へ自動換装しました。`, true);
        sl.layout = 'cards';
      } else if (Array.isArray(sl.body) && sl.body.length > 0) {
        addLog(`⚠️ [v3.1救済] Slide[${idx+1}] table構造でrowsが空かつbodyが存在するため layout="bullets" へ自動換装しました。`, true);
        sl.layout = 'bullets';
      }
    }

    // 修正3: bodyを持たないレイアウトに body が残っていた場合、body[0] を lead へ移し、残りは note/items へ退避 (闇落ち救済)
    const bodylessLayouts = ['table', 'two_column', 'cards', 'stats', 'toc'];
    if (bodylessLayouts.includes(sl.layout) && Array.isArray(sl.body) && sl.body.length > 0) {
      if (!sl.lead) {
        sl.lead = sl.body[0];
        addLog(`⚠️ [v3.1救済] Slide[${idx+1}] (${sl.layout}) の body[0] を lead (主張行) へ自動移設しました。`, true);
      }
      const remaining = sl.body.slice(1);
      if (remaining.length > 0) {
        if (sl.layout === 'cards' && Array.isArray(sl.items) && sl.items.length > 0) {
          if (!sl.items[0].note) sl.items[0].note = remaining.join(' ');
        } else if (sl.layout === 'two_column' && sl.left) {
          if (!sl.left.body) sl.left.body = remaining;
          else sl.left.body = sl.left.body.concat(remaining);
        }
      }
      delete sl.body;
    }

    // cards <-> stats 構造互換補正
    if (sl.layout === 'cards' && Array.isArray(sl.items)) {
      sl.items.forEach((it, i) => {
        if (!it.heading && it.label) {
          addLog(`⚠️ [規約2] Slide[${idx+1}] cards に stats 構造 (label/desc) ➔ cards (heading/body) へ補正しました。`, false);
          it.heading = it.label;
          if (it.desc && !it.body) it.body = [it.desc];
          delete it.label;
          delete it.desc;
        }
        if (!it.tag) it.tag = String.fromCharCode(65 + i);
      });
    }
    if (sl.layout === 'stats' && Array.isArray(sl.items)) {
      sl.items.forEach((it) => {
        if (!it.value && (it.heading || it.body)) {
          addLog(`⚠️ [規約2] Slide[${idx+1}] stats に cards 構造 ➔ stats (value/label/desc) へ補正しました。`, false);
          it.value = it.heading || '要約';
          it.label = it.heading || '項目';
          it.desc = Array.isArray(it.body) ? it.body.join(' ') : (it.body || '');
          delete it.heading;
          delete it.body;
        }
      });
    }

    // 修正1: レイアウト別データキーの「排他制約」を全自動適用 (禁止キーを完全除外)
    if (sl.layout === 'bullets') { delete sl.items; delete sl.rows; delete sl.left; delete sl.right; }
    else if (sl.layout === 'image_right') { delete sl.items; delete sl.rows; delete sl.left; delete sl.right; }
    else if (sl.layout === 'stats') { delete sl.body; delete sl.rows; delete sl.left; delete sl.right; }
    else if (sl.layout === 'cards') { delete sl.body; delete sl.rows; delete sl.left; delete sl.right; }
    else if (sl.layout === 'two_column') { delete sl.body; delete sl.items; delete sl.rows; }
    else if (sl.layout === 'table') { delete sl.body; delete sl.items; delete sl.left; delete sl.right; }
    else if (sl.layout === 'statement') { delete sl.items; delete sl.rows; delete sl.left; delete sl.right; }
    else if (sl.layout === 'toc') { delete sl.body; delete sl.rows; delete sl.left; delete sl.right; }
  });
  return spec;
}

// 規約4: 冒頭構成 (表紙 cover・目次 toc) の自動補全
function ensureCoverAndToc(spec, formValues, addLog) {
  if (!spec || !Array.isArray(spec.slides)) return spec;
  if (spec.slides.length === 0 || spec.slides[0].layout !== 'cover') {
    addLog('⚠️ [規約4] 1枚目に表紙 (cover) が無いため、meta 情報から表紙スライドを自動生成して挿入しました。', false);
    const coverSlide = {
      layout: 'cover',
      eyebrow: 'PRESENTATION',
      title: (spec.meta && spec.meta.title) || formValues.title || 'プレゼンテーション'
    };
    spec.slides.unshift(coverSlide);
  }
  if (spec.slides.length < 2 || spec.slides[1].layout !== 'toc') {
    addLog('⚠️ [規約4] 2枚目に目次 (toc) が無いため、各スライドタイトルから目次スライドを自動生成して挿入しました。', false);
    const tocItems = spec.slides.slice(1).map(s => s.title || 'アジェンダ項目');
    const tocSlide = {
      layout: 'toc',
      eyebrow: 'AGENDA',
      title: 'アジェンダ',
      items: tocItems.length > 0 ? tocItems : ['概要', '詳細データ', '結論']
    };
    spec.slides.splice(1, 0, tocSlide);
  }
  return spec;
}

// 規約5: meta 必須5項目の補完
function ensureMetaFields(spec, formValues) {
  if (!spec.meta) spec.meta = {};
  if (!spec.meta.title) spec.meta.title = formValues.title || '提案レポート';
  if (!spec.meta.tone) spec.meta.tone = formValues.tone ? formValues.tone.id : 'super_prime_v3';
  if (!spec.meta.subtitle) spec.meta.subtitle = 'AI資料生成エンジン v2.5.2';
  if (!spec.meta.date_dept) spec.meta.date_dept = `${new Date().toLocaleDateString('ja-JP')} | 企画編集部`;
  if (spec.meta.confidential === undefined) spec.meta.confidential = !!formValues.confidential;
  return spec;
}

// 規約7: 単発スライドの自動統合
function mergeSingleItemSlides(spec, addLog) {
  if (!spec || !Array.isArray(spec.slides)) return spec;
  const merged = [];
  let i = 0;
  while (i < spec.slides.length) {
    const current = spec.slides[i];
    const isSingleCards = current.layout === 'cards' && Array.isArray(current.items) && current.items.length === 1;
    const isSingleStats = current.layout === 'stats' && Array.isArray(current.items) && current.items.length === 1;

    if (isSingleCards || isSingleStats) {
      let j = i + 1;
      const targetLayout = current.layout;
      while (j < spec.slides.length && j - i < 4) {
        const next = spec.slides[j];
        if (next.layout === targetLayout && Array.isArray(next.items) && next.items.length === 1) {
          const nextItem = next.items[0];
          if (targetLayout === 'cards' && !nextItem.heading && next.title) nextItem.heading = next.title;
          if (targetLayout === 'stats' && !nextItem.label && next.title) nextItem.label = next.title;
          current.items.push(nextItem);
          j++;
        } else {
          break;
        }
      }
      if (j > i + 1) {
        addLog(`⚠️ [規約7] 単発 ${targetLayout} スライドが ${j - i} 枚連続したため、1枚 (最大4件) に自動統合しました。`, false);
        i = j;
        merged.push(current);
        continue;
      }
    }
    merged.push(current);
    i++;
  }
  spec.slides = merged;
  return spec;
}

// 規約10: 資料用途スイッチ (閲覧用/発表用)
function convertModeBigNumber(spec, usageMode, addLog) {
  if (!spec || !Array.isArray(spec.slides)) return spec;
  if (usageMode === 'reading') {
    spec.slides.forEach((sl, idx) => {
      if (sl.layout === 'big_number') {
        addLog(`⚠️ [規約10] 閲覧用モード指定のため、Slide[${idx+1}] big_number を stats (数値提示) へ自動変換しました。`, false);
        sl.layout = 'stats';
        sl.items = [{
          value: (sl.value || '') + (sl.unit || ''),
          label: sl.message || sl.title || '最重要指標',
          desc: sl.desc || ''
        }];
        delete sl.value;
        delete sl.unit;
        delete sl.message;
      }
    });
  }
  return spec;
}

// 規約8: 英語アイブロウの強制補全
function fixEyebrowEnglish(spec, addLog) {
  if (!spec || !Array.isArray(spec.slides)) return spec;
  spec.slides.forEach((sl, idx) => {
    const l = sl.layout || 'bullets';
    const defaultEng = LAYOUT_EYEBROW_MAP[l] || 'OVERVIEW';

    if (!sl.eyebrow || /[一-龠ぁ-んァ-ヶ]/.test(sl.eyebrow) || sl.eyebrow.toUpperCase() === l.toUpperCase()) {
      if (sl.eyebrow && /[一-龠ぁ-んァ-ヶ]/.test(sl.eyebrow)) {
        addLog(`⚠️ [規約8] Slide[${idx+1}] の日本語アイブロウ "${sl.eyebrow}" を英語規定ラベル "${defaultEng}" で置換しました。`, false);
      }
      sl.eyebrow = defaultEng;
    } else {
      sl.eyebrow = String(sl.eyebrow).toUpperCase();
    }
  });
  return spec;
}

// 規約11: 「失敗を隠さない」＆ なぜ空になったかの解説フィードバック機能
function validateAndExplainErrors(spec, addLog) {
  let hasError = false;
  if (!spec || !Array.isArray(spec.slides) || spec.slides.length <= 1) {
    addLog('❌ 検証エラー: 生成されたスライド構造が不正または1枚以下です。元テキストを入力・添付して再実行してください。', false);
    return false;
  }

  spec.slides.forEach((sl, idx) => {
    const l = sl.layout || 'bullets';
    if (l !== 'cover' && l !== 'toc' && l !== 'statement') {
      const hasContent = (Array.isArray(sl.body) && sl.body.length > 0) ||
                         (Array.isArray(sl.items) && sl.items.length > 0) ||
                         (Array.isArray(sl.rows) && sl.rows.length > 0) ||
                         (sl.left && (sl.left.heading || Array.isArray(sl.left.body))) ||
                         (sl.right && (sl.right.heading || Array.isArray(sl.right.body))) ||
                         (sl.layout === 'big_number' && sl.value);

      if (!hasContent) {
        hasError = true;
        const slideTitle = sl.title || `スライド ${idx + 1}`;
        addLog(`❌ [規約11] 検証失敗: スライド [${idx + 1}]「${slideTitle}」の本文キー (body/items/rows/left/right) が空です。`, false);
        addLog(`💡 [原因解説とアドバイス] 添付・入力された元資料テキストに「${slideTitle}」に関する具体的説明文章や数値データが不足しているため、AIが本文を抽出・構成できませんでした。元テキストにこのテーマの詳細情報を追記して再実行してください。`, false);
      }
    }
  });

  return !hasError;
}

function capEmphasis(spec, max = 3) {
  if (!spec || !Array.isArray(spec.slides)) return spec;
  spec.slides.forEach(sl => {
    let used = 0;
    const walk = (v) => typeof v === 'string'
      ? v.replace(/\*\*(.+?)\*\*/g, (m, g) => (++used <= max ? m : g))
      : v;
    if (Array.isArray(sl.body)) sl.body = sl.body.map(walk);
    (sl.items || []).forEach(it => {
      if (Array.isArray(it.body)) it.body = it.body.map(walk);
      if (it.desc) it.desc = walk(it.desc);
    });
    if (sl.title) sl.title = String(sl.title).replace(/\*\*/g, '');
  });
  return spec;
}

// STEP 2: バリデーション (品質規約 v1.1 恒久修復パイプライン適用)
function runStep2Validation() {
  const jsonOutputEl = document.getElementById('json-output');
  if (!jsonOutputEl) return false;
  const jsonText = jsonOutputEl.value.trim();
  const reportEl = document.getElementById('validation-report');
  if (reportEl) reportEl.innerHTML = '';

  let logs = [];
  const addLog = (msg, isOk = true) => {
    logs.push(`<div class="flex items-start gap-1.5 ${isOk ? 'text-emerald-400' : 'text-amber-400'}"><span>${isOk ? '✓' : '⚠️'}</span> <div>${msg}</div></div>`);
  };

  const formValues = getFormValues();
  const selectedToneId = formValues.tone ? formValues.tone.id : 'super_prime_v3';
  const usageMode = formValues.usage_mode || 'reading';

  try {
    let cleanStr = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
    const firstBrace = cleanStr.indexOf('{');
    const firstBracket = cleanStr.indexOf('[');
    
    let spec = null;

    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
      const lastBrace = cleanStr.lastIndexOf('}');
      if (lastBrace > firstBrace) cleanStr = cleanStr.substring(firstBrace, lastBrace + 1);
    } else if (firstBracket !== -1) {
      const lastBracket = cleanStr.lastIndexOf(']');
      if (lastBracket > firstBracket) cleanStr = cleanStr.substring(firstBracket, lastBracket + 1);
    }

    try {
      spec = JSON.parse(cleanStr);
    } catch (parseErr) {
      addLog('❌ JSONパースエラー: LLMの出力構文が不正です。生成を中断し再実行を促します。', false);
      if (reportEl) reportEl.innerHTML = logs.join('');
      return false;
    }

    if (Array.isArray(spec)) {
      spec = { meta: { title: formValues.title || '提案レポート', tone: selectedToneId }, slides: spec };
    }

    if (spec && !spec.slides) {
      if (spec.presentation && Array.isArray(spec.presentation.slides)) spec.slides = spec.presentation.slides;
      else if (spec.data && Array.isArray(spec.data.slides)) spec.slides = spec.data.slides;
    }

    // もし貼り付けられたデータが完成スライド(slides)ではなく Research Studio のソースパック(v1.1 / v1.0)の場合
    if (spec && (spec.schema_version === "1.1" || spec.schema_version === "1.0" || spec.facts)) {
      addLog('💡 判定: 貼り付けられたJSONは完成スライドではなく『リサーチソースパック v1.1』です。', true);
      addLog('🚀 リサーチソースパックを自動解析し、スライド生成パイプライン (Pass A ➔ Pass B) を自動実行します...', true);

      // フォーム値を自動セット
      if (spec.form_values) {
        if (spec.form_values.target_entity) updateFieldWithValue('title', `${spec.form_values.target_entity} に関する提案レポート`);
        if (spec.form_values.usage) updateFieldWithValue('usage_mode', spec.form_values.usage);
        if (spec.form_values.doc_type) updateFieldWithValue('doc_type', spec.form_values.doc_type);
      }

      // 抽出ソースプレビューにインベントリ文をセット
      let invText = `【Research Studio 構造化ソースパック v1.1】\n対象: ${spec.form_values?.target_entity || ''}\n目的: ${spec.form_values?.goal || ''}\n\n`;
      if (Array.isArray(spec.facts)) {
        invText += `## 検証済み一次ファクト (facts)\n`;
        spec.facts.forEach(f => {
          invText += `- [${f.id}] (${f.category || '事実'}) ${f.statement} (出典: ${f.source_id})\n`;
        });
      }
      const sourcePreview = document.getElementById('extracted-source-preview');
      if (sourcePreview) sourcePreview.value = invText;

      if (reportEl) reportEl.innerHTML = logs.join('');

      // 自動で2段パイプラインを実行
      setTimeout(() => {
        executeFullPipeline();
      }, 500);

      return true;
    }

    if (!spec || !Array.isArray(spec.slides) || spec.slides.length <= 1) {
      addLog('❌ 生成失敗: 完成スライド構造 (slides: [...]) が見つかりません。画面最上部の「ファイル添付欄」へ slide_source_pack.json を添付して「スライド生成」を押してください。', false);
      if (reportEl) reportEl.innerHTML = logs.join('');
      return false;
    }
    addLog(`JSONフォーマット構文チェック: 正常 (${spec.slides.length}枚の初期スライド構造 PASS)`);

    // --- 規約1〜10 修復パイプラインの順次実行 ---
    spec = fixLayouts(spec, addLog);
    spec = normalizeSpecKeys(spec);
    spec = stripEmptyKeys(spec);
    spec = fixStructuralMismatch(spec, addLog);
    spec = ensureCoverAndToc(spec, formValues, addLog);
    spec = ensureMetaFields(spec, formValues);
    spec = mergeSingleItemSlides(spec, addLog);
    spec = convertModeBigNumber(spec, usageMode, addLog);
    spec = fixEyebrowEnglish(spec, addLog);
    spec = capEmphasis(spec, 3);
    spec = splitOverlongSlides(spec);

    // --- 規約11 検証 ＆ 原因解説ログ ---
    const isOk = validateAndExplainErrors(spec, addLog);
    if (!isOk) {
      if (reportEl) reportEl.innerHTML = logs.join('');
      return false;
    }
    addLog('品質規約 v1.1 全自動修復・バリデーションチェック: PASS (完全適合)');

    appState.slideSpecJson = spec;

    if (jsonOutputEl) jsonOutputEl.value = JSON.stringify(spec, null, 2);
    if (reportEl) reportEl.innerHTML = logs.join('');

    renderDeterministicWebPreview();
    return true;

  } catch (err) {
    if (reportEl) reportEl.innerHTML = `<div class="text-red-400 font-bold">❌ バリデーションエラー: ${err.message}</div>`;
    return false;
  }
}

function parseEmphasis(text, baseOpts = {}, emphasisColor = null) {
  const runs = [];
  if (text === null || text === undefined) return runs;
  const strText = String(text);
  const parts = strText.split(/\*\*(.+?)\*\*/g);

  const targetColor = emphasisColor || baseOpts.color;

  parts.forEach((seg, i) => {
    if (!seg) return;
    if (i % 2 === 1) {
      runs.push({
        text: seg,
        isEmphasis: true,
        options: { ...baseOpts, bold: true, color: targetColor }
      });
    } else {
      runs.push({
        text: seg,
        isEmphasis: false,
        options: baseOpts
      });
    }
  });
  return runs;
}

function renderEmphasisHTML(text, textColorHex = '') {
  if (!text) return '';
  const runs = parseEmphasis(text, {}, textColorHex || null);
  return runs.map(r => {
    if (r.isEmphasis) {
      return `<strong class="emphasis-run">${r.text}</strong>`;
    }
    return r.text;
  }).join('');
}

function getActiveThemeTokens() {
  const formValues = getFormValues();
  const toneId = (appState.slideSpecJson && appState.slideSpecJson.meta && appState.slideSpecJson.meta.tone) 
    ? appState.slideSpecJson.meta.tone 
    : (formValues.tone ? formValues.tone.id : 'super_prime_v3');
    
  const presets = appState.schema ? appState.schema.tone_presets : DEFAULT_V252_SCHEMA.tone_presets;
  const allTones = [...presets, ...appState.customTones];
  const found = allTones.find(t => t.id === toneId);
  return (found && found.design_tokens) ? found.design_tokens : DEFAULT_V252_SCHEMA.tone_presets[0].design_tokens;
}

function renderDeterministicWebPreview() {
  const container = document.getElementById('slide-preview-container');
  if (!container) return;
  container.innerHTML = '';

  if (!appState.slideSpecJson || !appState.slideSpecJson.slides) {
    container.innerHTML = '<div class="text-center py-20 text-slate-500 text-xs">スライドデータがありません。STEP 1/2を実行してください。</div>';
    return;
  }

  const spec = appState.slideSpecJson;
  const meta = spec.meta || {};
  const slides = spec.slides;
  const tokens = getActiveThemeTokens();
  const logoObj = appState.attachmentsData.logo;

  const cleanHex = (hex) => hex ? '#' + hex.replace('#', '') : '#FFFFFF';

  slides.forEach((sl, idx) => {
    const pageNum = idx + 1;
    const slideWrapper = document.createElement('div');
    slideWrapper.className = 'space-y-2 my-6';

    const card = document.createElement('div');
    card.className = 'slide-aspect-ratio rounded-xl shadow-2xl border transition-all p-6 flex flex-col justify-between overflow-hidden relative';
    card.style.backgroundColor = cleanHex(tokens.bg || 'FFFFFF');
    card.style.borderColor = cleanHex(tokens.muted || 'CCCCCC');
    card.style.fontFamily = (tokens.font === 'Yu Gothic' ? '"Yu Gothic", "YuGothic"' : 'Meiryo, sans-serif');

    const isEyebrow = (tokens.header_style === 'eyebrow');
    const primaryColor = cleanHex(tokens.primary || '111111');
    const secondaryColor = cleanHex(tokens.secondary || '666666');
    const mutedColor = cleanHex(tokens.muted || 'AAAAAA');
    const panelBg = cleanHex(tokens.panel || 'F5F5F5');
    const accentColor = cleanHex(tokens.emphasis_color || tokens.accent || 'C8102E');

    const layout = sl.layout || 'bullets';
    const slideTitle = sl.title || meta.title || `スライド ${pageNum}`;
    const slideEyebrow = sl.eyebrow || LAYOUT_EYEBROW_MAP[layout] || 'OVERVIEW';

    if (layout === 'cover' || idx === 0) {
      const coverBox = document.createElement('div');
      coverBox.className = 'flex flex-col justify-between h-full w-full relative p-2';

      if (logoObj && logoObj.dataUrl) {
        const logoDiv = document.createElement('div');
        logoDiv.className = 'absolute right-2 top-2 z-10 flex items-center justify-end';
        logoDiv.innerHTML = `<img src="${logoObj.dataUrl}" class="h-9 object-contain">`;
        coverBox.appendChild(logoDiv);
      }

      const centerGroup = document.createElement('div');
      centerGroup.className = 'my-auto space-y-3 max-w-[85%]';

      if (slideEyebrow) {
        const eb = document.createElement('p');
        eb.className = 'text-xs font-bold font-mono tracking-widest uppercase';
        eb.style.color = mutedColor;
        eb.textContent = slideEyebrow;
        centerGroup.appendChild(eb);
      }

      const titleEl = document.createElement('h2');
      titleEl.className = 'text-2xl font-black leading-tight tracking-tight';
      titleEl.style.color = primaryColor;
      titleEl.innerHTML = renderEmphasisHTML(slideTitle, accentColor);
      centerGroup.appendChild(titleEl);

      if (meta.subtitle) {
        const subEl = document.createElement('p');
        subEl.className = 'text-xs font-medium leading-relaxed';
        subEl.style.color = secondaryColor;
        subEl.textContent = meta.subtitle;
        centerGroup.appendChild(subEl);
      }
      coverBox.appendChild(centerGroup);

      const footRow = document.createElement('div');
      footRow.className = 'flex justify-between items-center text-[9px] font-mono border-t pt-2';
      footRow.style.borderColor = '#EEEEEE';
      footRow.style.color = secondaryColor;
      footRow.innerHTML = `<span>${meta.date_dept || ''}</span><span>${meta.confidential ? 'CONFIDENTIAL' : ''}</span>`;
      coverBox.appendChild(footRow);

      card.appendChild(coverBox);
    } else {
      const headBox = document.createElement('div');
      headBox.className = 'flex justify-between items-start mb-3 flex-shrink-0 relative z-10';
      
      const leftHead = document.createElement('div');
      if (slideEyebrow) {
        const eb = document.createElement('p');
        eb.className = 'text-[9px] font-bold font-mono tracking-widest uppercase mb-0.5';
        eb.style.color = mutedColor;
        eb.textContent = slideEyebrow;
        leftHead.appendChild(eb);
      }
      const titleEl = document.createElement('h3');
      titleEl.className = 'text-base font-extrabold tracking-tight';
      titleEl.style.color = primaryColor;
      titleEl.innerHTML = renderEmphasisHTML(slideTitle, accentColor);
      leftHead.appendChild(titleEl);
      headBox.appendChild(leftHead);

      if (logoObj && logoObj.dataUrl) {
        const logoDiv = document.createElement('div');
        logoDiv.className = 'flex items-center justify-end pl-2';
        logoDiv.innerHTML = `<img src="${logoObj.dataUrl}" class="h-6 object-contain">`;
        headBox.appendChild(logoDiv);
      }
      card.appendChild(headBox);

      const bodyArea = document.createElement('div');
      bodyArea.className = 'flex-1 flex flex-col justify-center overflow-hidden py-1';

      if (sl.lead) {
        const leadP = document.createElement('div');
        leadP.className = 'text-xs font-bold mb-2 pb-1 border-b border-slate-200/80 leading-relaxed flex-shrink-0';
        leadP.style.color = primaryColor;
        leadP.innerHTML = renderEmphasisHTML(sl.lead, accentColor);
        bodyArea.appendChild(leadP);
      }

      if (layout === 'big_number') {
        const heroBox = document.createElement('div');
        heroBox.className = 'flex flex-col items-center justify-center h-full text-center space-y-2 py-2';
        
        if (sl.message) {
          const msgP = document.createElement('p');
          msgP.className = 'text-xs font-bold text-slate-600 tracking-wide';
          msgP.innerHTML = renderEmphasisHTML(sl.message, accentColor);
          heroBox.appendChild(msgP);
        }

        const numGroup = document.createElement('div');
        numGroup.className = 'flex items-baseline justify-center gap-1.5';
        numGroup.innerHTML = `
          <span class="big-number-value" style="color:${accentColor}">${sl.value || ''}</span>
          <span class="big-number-unit" style="color:${primaryColor}">${sl.unit || ''}</span>
        `;
        heroBox.appendChild(numGroup);

        if (sl.desc) {
          const descP = document.createElement('p');
          descP.className = 'text-[10px] text-slate-500 max-w-lg leading-relaxed mt-1';
          descP.innerHTML = renderEmphasisHTML(sl.desc, accentColor);
          heroBox.appendChild(descP);
        }
        bodyArea.appendChild(heroBox);
      }
      else if (layout === 'toc') {
        const items = sl.items || [];
        const tocList = document.createElement('div');
        tocList.className = 'space-y-2';
        items.forEach((itemText, i) => {
          const row = document.createElement('div');
          row.className = 'flex items-center gap-3 py-1.5 border-b border-slate-200 text-xs font-bold';
          row.innerHTML = `<span class="font-mono text-slate-400 font-bold text-sm">0${i+1}</span><span style="color:${primaryColor}">${renderEmphasisHTML(itemText, accentColor)}</span>`;
          tocList.appendChild(row);
        });
        bodyArea.appendChild(tocList);
      }
      else if (layout === 'stats') {
        const items = sl.items || [];
        const grid = document.createElement('div');
        grid.className = `grid grid-cols-${Math.min(items.length, 4)} gap-3 flex-1 items-stretch`;
        items.slice(0, 4).forEach(it => {
          const col = document.createElement('div');
          col.className = 'p-3 rounded-xl border flex flex-col justify-start space-y-1.5 shadow-sm';
          col.style.backgroundColor = panelBg;
          col.style.borderColor = '#E5E5E5';
          col.innerHTML = `
            <div class="h-1 w-6 bg-slate-900 mb-1 rounded-full"></div>
            <div class="text-2xl font-black font-mono tracking-tight" style="color:${primaryColor}">${it.value || ''}</div>
            <div class="text-[10.5px] font-extrabold leading-tight" style="color:${primaryColor}">${it.label || ''}</div>
            <div class="text-xs leading-relaxed" style="color:${secondaryColor}">${renderEmphasisHTML(it.desc || '', accentColor)}</div>
          `;
          grid.appendChild(col);
        });
        bodyArea.appendChild(grid);
      }
      else if (layout === 'cards') {
        const items = sl.items || [];
        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-2 gap-3 flex-1 items-stretch';
        items.slice(0, 4).forEach((it, i) => {
          const cardBox = document.createElement('div');
          cardBox.className = 'p-3 rounded-xl border flex flex-col justify-between relative shadow-sm';
          cardBox.style.backgroundColor = panelBg;
          cardBox.style.borderColor = '#E5E5E5';

          const borderLeft = document.createElement('div');
          borderLeft.className = 'absolute left-0 top-0 bottom-0 w-1 rounded-l-xl';
          borderLeft.style.backgroundColor = primaryColor;
          cardBox.appendChild(borderLeft);

          const content = document.createElement('div');
          content.className = 'pl-1 space-y-1';
          content.innerHTML = `<h4 class="text-xs font-bold" style="color:${primaryColor}">${it.tag || String.fromCharCode(65+i)}　${it.heading || ''}</h4>`;
          
          if (Array.isArray(it.body)) {
            const ul = document.createElement('ul');
            ul.className = 'text-xs leading-relaxed space-y-0.5 list-disc pl-3';
            ul.style.color = primaryColor;
            it.body.forEach(b => { ul.innerHTML += `<li>${renderEmphasisHTML(b, accentColor)}</li>`; });
            content.appendChild(ul);
          }
          cardBox.appendChild(content);

          if (it.note) {
            const noteP = document.createElement('p');
            noteP.className = 'text-[8.5px] pl-1 pt-1 opacity-80';
            noteP.style.color = secondaryColor;
            noteP.textContent = it.note;
            cardBox.appendChild(noteP);
          }
          grid.appendChild(cardBox);
        });
        bodyArea.appendChild(grid);
      }
      else if (layout === 'statement') {
        const stateBox = document.createElement('div');
        stateBox.className = 'flex flex-col justify-center h-full space-y-3 px-4 py-3 bg-slate-50/60 rounded-xl border border-slate-200/80';
        stateBox.innerHTML = `<h2 class="text-lg font-black leading-relaxed" style="color:${primaryColor}">${renderEmphasisHTML(slideTitle, accentColor)}</h2>`;
        if (Array.isArray(sl.body)) {
          const bodyDiv = document.createElement('div');
          bodyDiv.className = 'space-y-1.5 text-xs leading-relaxed';
          bodyDiv.style.color = secondaryColor;
          sl.body.forEach(b => { bodyDiv.innerHTML += `<p>・${renderEmphasisHTML(b, accentColor)}</p>`; });
          stateBox.appendChild(bodyDiv);
        }
        bodyArea.appendChild(stateBox);
      }
      else if (layout === 'image_right') {
        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-12 gap-4 flex-1 items-stretch';
        
        const leftCol = document.createElement('div');
        leftCol.className = 'col-span-7 flex flex-col justify-center space-y-2 text-xs leading-relaxed pr-1';
        if (Array.isArray(sl.body)) {
          sl.body.forEach(b => { leftCol.innerHTML += `<p class="font-medium" style="color:${primaryColor}">・${renderEmphasisHTML(b, accentColor)}</p>`; });
        }
        grid.appendChild(leftCol);

        const rightPlaceholder = document.createElement('div');
        rightPlaceholder.className = 'col-span-5 flex flex-col items-center justify-center p-3 rounded-xl border-2 border-dashed border-slate-300 text-center space-y-1.5 bg-slate-50/80 hover:bg-slate-100/80 transition-colors relative';
        
        const descText = (sl.image_slots && (typeof sl.image_slots.main === 'string' ? sl.image_slots.main : sl.image_slots.main?.desc)) || '画像・図解の差し込み用スペース';
        rightPlaceholder.innerHTML = `
          <div class="w-8 h-8 rounded-full bg-slate-200/80 flex items-center justify-center">
            <i data-lucide="image-plus" class="w-4 h-4 text-slate-600"></i>
          </div>
          <span class="inline-block px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[9px] font-bold">〔画像差し込み枠〕</span>
          <p class="text-[9px] text-slate-500 font-medium leading-normal px-1">${descText}</p>
        `;
        grid.appendChild(rightPlaceholder);
        bodyArea.appendChild(grid);
      }
      else if (layout === 'image_full') {
        const slots = sl.image_slots || {};
        const descMain = (typeof slots.main === 'string' ? slots.main : slots.main?.desc) || '主要画像の説明';
        const ph = document.createElement('div');
        ph.className = 'flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-slate-300 text-center space-y-2 bg-slate-50/80 hover:bg-slate-100/80 transition-colors flex-1';
        ph.innerHTML = `
          <div class="w-9 h-9 rounded-full bg-slate-200/80 flex items-center justify-center">
            <i data-lucide="image-plus" class="w-5 h-5 text-slate-600"></i>
          </div>
          <span class="inline-block px-2.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[9.5px] font-bold">〔画像差し込み枠〕</span>
          <p class="text-[9.5px] text-slate-500 font-medium leading-normal px-2">${descMain}</p>
        `;
        bodyArea.appendChild(ph);
      }
      else if (layout === 'two_column') {
        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-2 gap-3 flex-1 items-stretch';
        [sl.left || {}, sl.right || {}].forEach(col => {
          const box = document.createElement('div');
          box.className = 'p-3 rounded-xl border flex flex-col space-y-1.5';
          box.style.backgroundColor = panelBg;
          box.style.borderColor = '#E5E5E5';
          box.innerHTML = `<h4 class="text-xs font-bold py-1 border-b" style="color:${primaryColor}; border-color:#DDD">${col.heading || ''}</h4>`;
          if (Array.isArray(col.body)) {
            col.body.forEach(b => { box.innerHTML += `<p class="text-xs leading-relaxed" style="color:${primaryColor}">・${renderEmphasisHTML(b, accentColor)}</p>`; });
          }
          grid.appendChild(box);
        });
        bodyArea.appendChild(grid);
      }
      else if (layout === 'table') {
        const cols = sl.columns || [];
        const rows = sl.rows || [];
        const tableBox = document.createElement('div');
        tableBox.className = 'overflow-x-auto border rounded-xl shadow-sm';
        tableBox.style.borderColor = '#E5E5E5';

        let tblHtml = `<table class="w-full text-left border-collapse text-[10px]">`;
        if (cols.length > 0) {
          tblHtml += `<thead class="bg-slate-900 text-white font-bold"><tr>`;
          cols.forEach(c => { tblHtml += `<th class="p-2 border border-slate-700">${c}</th>`; });
          tblHtml += `</tr></thead>`;
        }
        tblHtml += `<tbody>`;
        rows.forEach((r, rIdx) => {
          tblHtml += `<tr class="${rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-100'}">`;
          r.forEach(cell => { tblHtml += `<td class="p-2 border border-slate-200 font-medium" style="color:${primaryColor}">${renderEmphasisHTML(cell, accentColor)}</td>`; });
          tblHtml += `</tr>`;
        });
        tblHtml += `</tbody></table>`;
        tableBox.innerHTML = tblHtml;
        bodyArea.appendChild(tableBox);
      }
      else {
        const listDiv = document.createElement('div');
        listDiv.className = 'space-y-1.5 text-xs leading-relaxed px-1';
        if (Array.isArray(sl.body)) {
          sl.body.forEach(b => { listDiv.innerHTML += `<p class="font-medium" style="color:${primaryColor}">・${renderEmphasisHTML(b, accentColor)}</p>`; });
        }
        bodyArea.appendChild(listDiv);
      }

      card.appendChild(bodyArea);

      if (isEyebrow) {
        const foot = document.createElement('div');
        foot.className = 'flex justify-between items-center text-[8.5px] font-mono border-t pt-1.5 mt-1';
        foot.style.borderColor = '#EEEEEE';
        foot.style.color = mutedColor;
        foot.innerHTML = `<span>${tokens.footer_text || 'SUPER PRIME — AI BUSINESS'}</span><span>${pageNum.toString().padStart(2, '0')}</span>`;
        card.appendChild(foot);
      }
    }

    slideWrapper.appendChild(card);
    container.appendChild(slideWrapper);
  });

  if (window.lucide) window.lucide.createIcons();
}

function exportDeterministicPptx() {
  if (!appState.slideSpecJson || !appState.slideSpecJson.slides) {
    alert('スライド仕様データがありません。STEP 1/2を実行してください。');
    return;
  }

  const spec = appState.slideSpecJson;
  const meta = spec.meta || {};
  const slides = spec.slides;
  const tokens = getActiveThemeTokens();
  const logoObj = appState.attachmentsData.logo;

  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'WIDE_1333_750', width: 13.33, height: 7.5 });
  pptx.layout = 'WIDE_1333_750';

  const cleanHex = (hex) => hex ? hex.replace('#', '') : 'FFFFFF';
  const primaryHex = cleanHex(tokens.primary || '111111');
  const secondaryHex = cleanHex(tokens.secondary || '666666');
  const mutedHex = cleanHex(tokens.muted || 'AAAAAA');
  const panelHex = cleanHex(tokens.panel || 'F5F5F5');
  const bgHex = cleanHex(tokens.bg || 'FFFFFF');
  const accentHex = cleanHex(tokens.emphasis_color || tokens.accent || 'C8102E');
  const fontName = tokens.font || 'Yu Gothic';
  const fontEnName = tokens.font_en || 'Arial';

  const buildPptxRuns = (textOrArr, baseFontSize = 11, baseColor = primaryHex) => {
    const baseOpts = { fontSize: baseFontSize, color: baseColor, fontFace: fontName };
    if (Array.isArray(textOrArr)) {
      let allRuns = [];
      textOrArr.forEach(t => {
        const runs = parseEmphasis(t, baseOpts, baseColor);
        if (runs.length > 0) {
          runs[0].options.bullet = true;
          allRuns = allRuns.concat(runs);
        }
      });
      return allRuns;
    } else {
      return parseEmphasis(textOrArr, baseOpts, baseColor);
    }
  };

  slides.forEach((sl, idx) => {
    const slideObj = pptx.addSlide();
    slideObj.background = { color: bgHex };
    const layout = sl.layout || 'bullets';
    const pageNum = idx + 1;

    const slideTitle = sl.title || meta.title || `スライド ${pageNum}`;
    const slideEyebrow = sl.eyebrow || LAYOUT_EYEBROW_MAP[layout] || 'OVERVIEW';

    if (layout === 'cover' || idx === 0) {
      if (logoObj && logoObj.dataUrl) {
        slideObj.addImage({ data: logoObj.dataUrl, x: 10.5, y: 0.5, w: 2.2, h: 0.7, objectFit: 'contain' });
      }
      if (slideEyebrow) {
        slideObj.addText(slideEyebrow.toUpperCase(), { x: 0.8, y: 3.2, w: 11.0, h: 0.4, fontSize: 12, bold: true, color: mutedHex, fontFace: fontEnName });
      }
      const titleRuns = buildPptxRuns(slideTitle, 28, primaryHex);
      slideObj.addText(titleRuns, { x: 0.8, y: 3.7, w: 11.5, h: 1.6 });
      if (meta.subtitle) {
        slideObj.addText(meta.subtitle, { x: 0.8, y: 5.4, w: 11.5, h: 0.8, fontSize: 13, color: secondaryHex, fontFace: fontName });
      }
      const footStr = (meta.date_dept || '') + (meta.confidential ? '    CONFIDENTIAL' : '');
      slideObj.addText(footStr, { x: 0.8, y: 6.8, w: 11.5, h: 0.4, fontSize: 9, color: secondaryHex, fontFace: fontName });
      return;
    }

    if (slideEyebrow) {
      slideObj.addText(slideEyebrow.toUpperCase(), { x: 0.8, y: 0.4, w: 9.0, h: 0.3, fontSize: 10, bold: true, color: mutedHex, fontFace: fontEnName });
    }
    const titleRuns = buildPptxRuns(slideTitle, 20, primaryHex);
    slideObj.addText(titleRuns, { x: 0.8, y: 0.75, w: 9.0, h: 0.6 });
    
    if (logoObj && logoObj.dataUrl) {
      slideObj.addImage({ data: logoObj.dataUrl, x: 10.8, y: 0.4, w: 1.8, h: 0.6, objectFit: 'contain' });
    }
    
    slideObj.addText(tokens.footer_text || 'SUPER PRIME — AI BUSINESS', { x: 0.8, y: 7.0, w: 8.0, h: 0.3, fontSize: 8, color: mutedHex, fontFace: fontEnName });
    let y0 = 1.5;
    if (sl.lead) {
      const leadRuns = buildPptxRuns(sl.lead, 12, primaryHex);
      slideObj.addText(leadRuns, { x: 0.8, y: 1.35, w: 11.7, h: 0.5, bold: true });
      y0 = 1.95;
    }

    if (layout === 'big_number') {
      if (sl.message) {
        const msgRuns = buildPptxRuns(sl.message, 14, secondaryHex);
        slideObj.addText(msgRuns, { x: 0.8, y: y0 + 0.5, w: 11.7, h: 0.6, align: 'center' });
      }
      slideObj.addText(sl.value || '', { x: 0.8, y: y0 + 1.2, w: 8.0, h: 2.2, fontSize: 96, bold: true, color: accentHex, fontFace: fontEnName, align: 'right' });
      slideObj.addText(sl.unit || '', { x: 9.0, y: y0 + 2.4, w: 3.5, h: 0.8, fontSize: 32, bold: true, color: primaryHex, fontFace: fontName, align: 'left' });
      if (sl.desc) {
        const descRuns = buildPptxRuns(sl.desc, 10, secondaryHex);
        slideObj.addText(descRuns, { x: 0.8, y: y0 + 3.8, w: 11.7, h: 0.8, align: 'center' });
      }
    }
    else if (layout === 'toc') {
      (sl.items || []).forEach((t, i) => {
        const y = y0 + (i * 0.8);
        slideObj.addText(`0${i+1}`, { x: 0.8, y: y, w: 0.6, h: 0.6, fontSize: 14, bold: true, color: mutedHex, fontFace: fontEnName });
        const tocRuns = buildPptxRuns(t, 13, primaryHex);
        slideObj.addText(tocRuns, { x: 1.6, y: y, w: 10.5, h: 0.6 });
        slideObj.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: y + 0.65, w: 11.7, h: 0.01, fill: { color: 'E5E5E5' } });
      });
    }
    else if (layout === 'stats') {
      const items = (sl.items || []).slice(0, 4);
      const cw = 2.7, gap = 0.3;
      items.forEach((it, i) => {
        const x = 0.8 + i * (cw + gap);
        slideObj.addShape(pptx.shapes.RECTANGLE, { x: x, y: y0, w: cw, h: 4.8, fill: { color: panelHex }, line: { color: 'E5E5E5', width: 1 } });
        slideObj.addShape(pptx.shapes.RECTANGLE, { x: x, y: y0, w: 0.5, h: 0.05, fill: { color: primaryHex } });
        slideObj.addText(it.value || '', { x: x + 0.15, y: y0 + 0.3, w: cw - 0.3, h: 1.0, fontSize: 32, bold: true, color: primaryHex, fontFace: fontEnName });
        slideObj.addText(it.label || '', { x: x + 0.15, y: y0 + 1.4, w: cw - 0.3, h: 0.8, fontSize: 12, bold: true, color: primaryHex, fontFace: fontName });
        const descRuns = buildPptxRuns(it.desc || '', 10, secondaryHex);
        slideObj.addText(descRuns, { x: x + 0.15, y: y0 + 2.3, w: cw - 0.3, h: 2.2 });
      });
    }
    else if (layout === 'cards') {
      const items = (sl.items || []).slice(0, 4);
      const cw = 5.6, ch = 2.3;
      items.forEach((it, i) => {
        const x = 0.8 + (i % 2) * 6.1;
        const y = y0 + Math.floor(i / 2) * 2.5;
        slideObj.addShape(pptx.shapes.RECTANGLE, { x: x, y: y, w: cw, h: ch, fill: { color: panelHex }, line: { color: 'E5E5E5', width: 1 } });
        slideObj.addShape(pptx.shapes.RECTANGLE, { x: x, y: y, w: 0.1, h: ch, fill: { color: primaryHex } });
        slideObj.addText((it.tag || String.fromCharCode(65+i)) + '  ' + (it.heading || ''), { x: x + 0.3, y: y + 0.15, w: cw - 0.4, h: 0.4, fontSize: 12, bold: true, color: primaryHex, fontFace: fontName });
        if (Array.isArray(it.body)) {
          const bodyRuns = buildPptxRuns(it.body, 10, primaryHex);
          slideObj.addText(bodyRuns, { x: x + 0.3, y: y + 0.65, w: cw - 0.5, h: 1.2 });
        }
        if (it.note) {
          slideObj.addText(it.note, { x: x + 0.3, y: y + 1.8, w: cw - 0.5, h: 0.4, fontSize: 8.5, color: secondaryHex, fontFace: fontName });
        }
      });
    }
    else if (layout === 'statement') {
      slideObj.addText(buildPptxRuns(slideTitle, 24, primaryHex), { x: 0.8, y: y0 + 0.5, w: 11.5, h: 1.2 });
      if (Array.isArray(sl.body)) {
        const bodyRuns = buildPptxRuns(sl.body, 12, secondaryHex);
        slideObj.addText(bodyRuns, { x: 0.8, y: y0 + 2.0, w: 11.5, h: 2.5 });
      }
    }
    else if (layout === 'image_right') {
      if (Array.isArray(sl.body)) {
        const bodyRuns = buildPptxRuns(sl.body, 11, primaryHex);
        slideObj.addText(bodyRuns, { x: 0.8, y: y0, w: 5.6, h: 4.8 });
      }
      const descText = (sl.image_slots && (typeof sl.image_slots.main === 'string' ? sl.image_slots.main : sl.image_slots.main?.desc)) || '画像差し込み用の破線枠スペース';
      
      slideObj.addShape(pptx.shapes.RECTANGLE, { x: 6.7, y: y0, w: 5.6, h: 4.5, fill: { color: 'F8FAFC' }, line: { color: '94A3B8', width: 2, dashType: 'dash' } });
      slideObj.addText(`〔画像差し込み枠〕\n\n${descText}`, { x: 6.7, y: y0 + 1.0, w: 5.6, h: 2.5, align: 'center', fontSize: 11, color: '64748B', bold: true, fontFace: fontName });
    }
    else if (layout === 'image_full') {
      const slots = sl.image_slots || {};
      const descMain = (typeof slots.main === 'string' ? slots.main : slots.main?.desc) || '主要画像の説明';
      slideObj.addShape(pptx.shapes.RECTANGLE, { x: 2.2, y: y0, w: 8.8, h: 4.5, fill: { color: 'F8FAFC' }, line: { color: '94A3B8', width: 2, dashType: 'dash' } });
      slideObj.addText(`〔画像差し込み枠〕\n\n${descMain}`, { x: 2.2, y: y0 + 1.0, w: 8.8, h: 2.5, align: 'center', fontSize: 11, color: '64748B', bold: true, fontFace: fontName });
    }
    else if (layout === 'two_column') {
      [sl.left || {}, sl.right || {}].forEach((col, i) => {
        const x = 0.8 + i * 6.1;
        slideObj.addShape(pptx.shapes.RECTANGLE, { x: x, y: y0, w: 5.6, h: 4.8, fill: { color: panelHex }, line: { color: 'E5E5E5', width: 1 } });
        slideObj.addText(col.heading || '', { x: x + 0.2, y: y0 + 0.2, w: 5.2, h: 0.5, fontSize: 13, bold: true, color: primaryHex, fontFace: fontName });
        if (Array.isArray(col.body)) {
          const bodyRuns = buildPptxRuns(col.body, 11, primaryHex);
          slideObj.addText(bodyRuns, { x: x + 0.2, y: y0 + 0.8, w: 5.2, h: 3.8 });
        }
      });
    }
    else if (layout === 'table') {
      const cols = sl.columns || [];
      const rows = sl.rows || [];
      if (cols.length > 0 || rows.length > 0) {
        const allRows = cols.length > 0 ? [cols, ...rows] : rows;
        const formattedRows = allRows.map((r, rIdx) => {
          return r.map(c => {
            const isHeader = rIdx === 0 && cols.length > 0;
            const runs = parseEmphasis(c, {
              fill: isHeader ? primaryHex : (rIdx % 2 === 0 ? 'FFFFFF' : 'F8F8F8'),
              color: isHeader ? 'FFFFFF' : primaryHex,
              bold: isHeader,
              fontSize: 10,
              fontFace: fontName
            }, accentHex);
            return runs.length > 0 ? runs : [{ text: String(c), options: { fontSize: 10, color: primaryHex } }];
          });
        });
        slideObj.addTable(formattedRows, { x: 0.8, y: y0, w: 11.7, colW: Array(cols.length || 3).fill(11.7 / (cols.length || 3)) });
      }
    }
    else {
      if (Array.isArray(sl.body)) {
        const bodyRuns = buildPptxRuns(sl.body, 12, primaryHex);
        slideObj.addText(bodyRuns, { x: 0.8, y: y0, w: 11.7, h: 4.8 });
      }
    }
  });

  const safeFilename = (meta.title || 'Presentation').replace(/[\\\\/:*?\"<>|]/g, '_');
  pptx.writeFile({ fileName: `${safeFilename}.pptx` })
    .then(() => console.log('PPTXエクスポート成功'))
    .catch(err => alert('PPTX生成エラー: ' + err.message));
}

function deleteTone(id) {
  if (confirm('削除してもよろしいですか？')) {
    appState.customTones = appState.customTones.filter(t => t.id !== id);
    localStorage.setItem('doc_system_custom_tones', JSON.stringify(appState.customTones));
    renderToneList();
    renderDynamicForm();
  }
}

function formatJsonString(str) {
  try {
    let cleanStr = str.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanStr);
    return JSON.stringify(parsed, null, 2);
  } catch (e) {
    return str;
  }
}

function saveAdminSettings() {
  const geminiKey = document.getElementById('admin-gemini-key') ? document.getElementById('admin-gemini-key').value.trim() : '';
  const openaiKey = document.getElementById('admin-openai-key') ? document.getElementById('admin-openai-key').value.trim() : '';
  const passA = document.getElementById('setting-provider-passA') ? document.getElementById('setting-provider-passA').value : 'auto';
  const passB = document.getElementById('setting-provider-passB') ? document.getElementById('setting-provider-passB').value : 'auto';
  const openaiModelB = document.getElementById('setting-openai-model-passB') ? document.getElementById('setting-openai-model-passB').value : 'gpt-4o-mini';
  const schemaStr = document.getElementById('schema-editor') ? document.getElementById('schema-editor').value : '';

  if (schemaStr) {
    try {
      const parsed = JSON.parse(schemaStr);
      localStorage.setItem('doc_system_schema_v252', schemaStr);
      appState.schema = parsed;
    } catch (e) {
      alert(`スキーマJSONエラー: ${e.message}`);
      return false;
    }
  }

  localStorage.setItem('doc_system_admin_gemini_key', geminiKey);
  localStorage.setItem('doc_system_admin_openai_key', openaiKey);
  localStorage.setItem('doc_system_provider_passA', passA);
  localStorage.setItem('doc_system_provider_passB', passB);
  localStorage.setItem('doc_system_openai_passB_model', openaiModelB);

  appState.adminKeys.gemini = geminiKey;
  appState.adminKeys.openai = openaiKey;
  appState.providerPassA = passA;
  appState.providerPassB = passB;
  appState.openaiPassBModel = openaiModelB;

  updateProviderBadge();
  return true;
}

function setupEventListeners() {
  const safeAddListener = (id, event, handler) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener(event, handler);
  };

  safeAddListener('btn-run-step1-direct', 'click', runPassAPassBPipeline);
  safeAddListener('btn-generate-mock-json', 'click', loadMockSlideSpecV3);
  safeAddListener('btn-run-step2-val', 'click', runStep2Validation);
  safeAddListener('btn-render-preview', 'click', renderDeterministicWebPreview);
  safeAddListener('btn-export-pptx', 'click', exportDeterministicPptx);

  safeAddListener('json-output', 'input', () => {
    runStep2Validation();
  });

  safeAddListener('btn-show-settings', 'click', () => {
    const modal = document.getElementById('modal-settings');
    if (modal) {
      modal.classList.add('modal-active');
      modal.classList.remove('hidden');
      setTimeout(() => modal.classList.add('opacity-100'), 10);
    }
  });
  
  const closeSettings = () => {
    const modal = document.getElementById('modal-settings');
    if (modal) {
      modal.classList.remove('opacity-100');
      setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('modal-active');
      }, 300);
    }
  };
  
  safeAddListener('btn-close-modal-settings', 'click', closeSettings);
  safeAddListener('btn-cancel-settings', 'click', closeSettings);
  
  safeAddListener('btn-save-settings', 'click', () => {
    if (saveAdminSettings()) {
      renderToneList();
      closeSettings();
      alert('管理者設定を保存しました。');
    }
  });
  
  safeAddListener('btn-reset-schema', 'click', () => {
    if (confirm('スキーマ設定を初期状態に戻しますか？')) {
      localStorage.removeItem('doc_system_schema_v252');
      appState.schema = DEFAULT_V252_SCHEMA;
      const ed = document.getElementById('schema-editor');
      if (ed) ed.value = JSON.stringify(DEFAULT_V252_SCHEMA, null, 2);
      renderDynamicForm();
      renderToneList();
      closeSettings();
    }
  });
  
  safeAddListener('btn-reset-form', 'click', () => {
    if (confirm('フォームをリセットしますか？')) {
      const form = document.getElementById('dynamic-form');
      if (form) form.reset();
      appState.attachmentsData = { sources: [], logo: null };
      const previewTextarea = document.getElementById('extracted-source-preview');
      if (previewTextarea) previewTextarea.value = '';
      renderDynamicForm();
    }
  });

  safeAddListener('setting-provider-passA', 'change', () => {
    const el = document.getElementById('setting-provider-passA');
    if (el) {
      appState.providerPassA = el.value;
      updateProviderBadge();
    }
  });
  safeAddListener('setting-provider-passB', 'change', () => {
    const el = document.getElementById('setting-provider-passB');
    if (el) {
      appState.providerPassB = el.value;
      updateProviderBadge();
    }
  });
}

// ■ 品質規約 v1.1 恒久回帰テスト (壊れたJSON 8パターン自己修復テスト)
function runRegressionTests() {
  console.log("=== 品質規約 v1.1 恒久回帰テスト開始 ===");
  let passedCount = 0;
  const dummyLog = () => {};

  // テスト1: 未定義レイアウト(handout) 写像
  let t1 = { meta: { title: "T1", tone: "super_prime_v3" }, slides: [{ layout: "handout", title: "S1", body: ["行1"] }] };
  t1 = fixLayouts(t1, dummyLog);
  if (t1.slides[0].layout === "two_column") { console.log("✓ Test 1 (handout写像): PASS"); passedCount++; }

  // テスト2: cards に stats 構造混在の自動変換
  let t2 = { meta: { title: "T2", tone: "super_prime_v3" }, slides: [{ layout: "cards", title: "S2", items: [{ label: "見出し", desc: "説明文" }] }] };
  t2 = fixStructuralMismatch(t2, dummyLog);
  if (t2.slides[0].items[0].heading === "見出し") { console.log("✓ Test 2 (cards/stats混在変換): PASS"); passedCount++; }

  // テスト3: 空キー除去 (stripEmptyKeys)
  let t3 = { meta: { title: "T3", tone: "super_prime_v3" }, slides: [{ layout: "bullets", title: "S3", body: ["行1"], columns: [], value: "" }] };
  t3 = stripEmptyKeys(t3);
  if (!("columns" in t3.slides[0]) && !("value" in t3.slides[0])) { console.log("✓ Test 3 (空キーstrip): PASS"); passedCount++; }

  // テスト4: cover/toc なしの自動挿入
  let t4 = { meta: { title: "T4", tone: "super_prime_v3" }, slides: [{ layout: "bullets", title: "S4", body: ["行1"] }] };
  t4 = ensureCoverAndToc(t4, { title: "T4" }, dummyLog);
  if (t4.slides[0].layout === "cover" && t4.slides[1].layout === "toc") { console.log("✓ Test 4 (cover/toc自動挿入): PASS"); passedCount++; }

  // テスト5: 単発cardsの自動統合 (3枚 ➔ 1枚)
  let t5 = { meta: { title: "T5", tone: "super_prime_v3" }, slides: [
    { layout: "cover", title: "表紙" }, { layout: "toc", title: "目次", items: ["A"] },
    { layout: "cards", title: "C1", items: [{ heading: "H1", body: ["B1"] }] },
    { layout: "cards", title: "C2", items: [{ heading: "H2", body: ["B2"] }] },
    { layout: "cards", title: "C3", items: [{ heading: "H3", body: ["B3"] }] }
  ] };
  t5 = mergeSingleItemSlides(t5, dummyLog);
  if (t5.slides.length === 3 && t5.slides[2].items.length === 3) { console.log("✓ Test 5 (単発cards自動統合): PASS"); passedCount++; }

  // テスト6: 日本語アイブロウの英語規定ラベル置換
  let t6 = { meta: { title: "T6", tone: "super_prime_v3" }, slides: [{ layout: "stats", eyebrow: "数値実績", title: "S6", items: [{ value: "10", label: "L" }] }] };
  t6 = fixEyebrowEnglish(t6, dummyLog);
  if (t6.slides[0].eyebrow === "BY THE NUMBERS") { console.log("✓ Test 6 (英語アイブロウ置換): PASS"); passedCount++; }

  // テスト7: 閲覧用モードでの big_number ➔ stats 自動変換
  let t7 = { meta: { title: "T7", tone: "super_prime_v3" }, slides: [{ layout: "big_number", title: "S7", value: "93%", unit: "削減", message: "効果" }] };
  t7 = convertModeBigNumber(t7, "reading", dummyLog);
  if (t7.slides[0].layout === "stats" && t7.slides[0].items[0].value === "93%削減") { console.log("✓ Test 7 (閲覧用big_number変換): PASS"); passedCount++; }

  // テスト8: 太字強調上限 & タイトル**除去
  let t8 = { meta: { title: "T8", tone: "super_prime_v3" }, slides: [{ layout: "bullets", title: "**タイトル**", body: ["**A** **B** **C** **D**"] }] };
  t8 = capEmphasis(t8, 3);
  if (t8.slides[0].title === "タイトル" && (t8.slides[0].body[0].match(/\*\*/g) || []).length === 6) { console.log("✓ Test 8 (強調上限＆タイトル**除去): PASS"); passedCount++; }

  console.log(`=== 回帰テスト完了: ${passedCount} / 8 件 PASS ===`);
  return passedCount === 8;
}

// 初期化時に回帰テストを実行
setTimeout(() => { try { runRegressionTests(); } catch (e) { console.warn("回帰テスト実行警告:", e); } }, 1000);

