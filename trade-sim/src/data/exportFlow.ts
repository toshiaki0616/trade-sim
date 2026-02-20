import type { Step } from '../types'

export const exportFlow: Step[] = [
  {
    id: 'export-01',
    stepNumber: 1,
    title: '輸出契約の締結と書類準備',
    description:
      '海外バイヤーから注文を受け、輸出契約を締結しました。次に準備すべき書類として正しい組み合わせはどれでしょうか？',
    type: 'decision',
    choices: [
      {
        id: 'a',
        label: 'Commercial Invoice・Packing List・輸出申告書',
        isCorrect: true,
      },
      {
        id: 'b',
        label: 'パスポートと在留カード',
        isCorrect: false,
      },
      {
        id: 'c',
        label: '輸入許可通知書',
        isCorrect: false,
      },
    ],
    explanation:
      '輸出時の基本書類は Commercial Invoice（商業送り状）・Packing List（梱包明細書）・輸出申告書です。これらを基に税関へ輸出申告を行います。信用状（L/C）取引の場合はL/Cの条件に合った書類が追加で必要になります。',
  },
  {
    id: 'export-02',
    stepNumber: 2,
    title: 'Commercial Invoice の確認',
    description:
      '作成したCommercial Invoiceに不備がないか確認してください。',
    type: 'document-check',
    documents: [
      {
        id: 'exp-doc-seller',
        label: 'Seller（輸出者）',
        value: '株式会社サンプル商事 〒100-0001 東京都千代田区...',
        hasError: false,
      },
      {
        id: 'exp-doc-buyer',
        label: 'Buyer（輸入者）',
        value: 'ABC Trading Co., Ltd.',
        hasError: false,
      },
      {
        id: 'exp-doc-hs',
        label: 'HSコード',
        value: '（記載なし）',
        hasError: true,
        errorHint: 'HSコードは輸出申告に必要です',
      },
      {
        id: 'exp-doc-price',
        label: '単価・合計金額',
        value: 'USD 50.00 × 200 pcs = USD 10,000.00',
        hasError: false,
      },
      {
        id: 'exp-doc-terms',
        label: '取引条件（Incoterms）',
        value: 'FOB Tokyo',
        hasError: false,
      },
    ],
    explanation:
      '不備は1点です。HSコードが記載されていません。輸出申告書にはHSコード（統計品目番号）の記載が必要です。またインボイスにHSコードを記載しておくと輸入国での通関でもスムーズです。',
  },
  {
    id: 'export-03',
    stepNumber: 3,
    title: '輸出規制品の確認',
    description:
      '輸出しようとしている商品が輸出規制の対象かどうか確認します。正しい手順はどれでしょうか？',
    type: 'decision',
    choices: [
      {
        id: 'a',
        label: '外国為替及び外国貿易法（外為法）に基づき、リスト規制・キャッチオール規制を確認する',
        isCorrect: true,
      },
      {
        id: 'b',
        label: '民間の商品であれば規制対象外なので確認不要',
        isCorrect: false,
      },
      {
        id: 'c',
        label: '相手国の税関に問い合わせる',
        isCorrect: false,
      },
    ],
    explanation:
      '輸出規制は外為法で定められており、①リスト規制（規制品目リストに掲載された品目）と②キャッチオール規制（リスト外でも大量破壊兵器等に転用のおそれがある場合）があります。輸出許可が必要な場合は経済産業省へ申請が必要です。',
  },
  {
    id: 'export-04',
    stepNumber: 4,
    title: '輸出申告',
    description:
      '輸出申告のタイミングとして正しいものはどれでしょうか？',
    type: 'decision',
    choices: [
      {
        id: 'a',
        label: '貨物を保税地域（CFS・コンテナヤード等）に搬入した後、本船積載前に申告する',
        isCorrect: true,
      },
      {
        id: 'b',
        label: '本船が出港してから申告する',
        isCorrect: false,
      },
      {
        id: 'c',
        label: '輸出契約書締結直後に申告する',
        isCorrect: false,
      },
    ],
    explanation:
      '輸出申告は貨物を保税地域に搬入した後、本船積載前に行います。NACCSで電子申告し、税関の審査・許可を受けてから船積みが可能になります。船積み後の申告は原則できません。',
  },
  {
    id: 'export-05',
    stepNumber: 5,
    title: '輸出許可と船積み',
    description:
      '税関から輸出許可が下りました。次のステップとして正しいものはどれでしょうか？',
    type: 'decision',
    choices: [
      {
        id: 'a',
        label: '輸出許可通知書を保管し、船会社（フォワーダー）に船積み指示を出す',
        isCorrect: true,
      },
      {
        id: 'b',
        label: '輸出許可通知書をバイヤーに送付する',
        isCorrect: false,
      },
      {
        id: 'c',
        label: '許可が下りたので手続きは完了',
        isCorrect: false,
      },
    ],
    explanation:
      '輸出許可通知書は5年間の保管義務があります。許可後は船会社またはフォワーダーに船積み指示（S/I: Shipping Instructions）を提出し、B/L（船荷証券）の発行を依頼します。B/Lは代金回収（荷為替手形取組）の際に必要な重要書類です。',
  },
  {
    id: 'export-06',
    stepNumber: 6,
    title: 'B/L（船荷証券）の受取と船積み書類の送付',
    description:
      '船積み後、船会社からB/Lが発行されました。バイヤーへの書類送付セットとして正しいものはどれでしょうか？',
    type: 'decision',
    choices: [
      {
        id: 'a',
        label: 'B/L・Commercial Invoice・Packing List（・保険証券・原産地証明書など契約に応じて追加）',
        isCorrect: true,
      },
      {
        id: 'b',
        label: 'B/Lのみ送付すればよい',
        isCorrect: false,
      },
      {
        id: 'c',
        label: '書類送付は不要でバイヤーが現地で受け取る',
        isCorrect: false,
      },
    ],
    explanation:
      'バイヤーへ送付する船積み書類セット（Shipping Documents）の基本は B/L・Commercial Invoice・Packing List の3点です。L/C取引ではL/C条件に従い保険証券（I/P）・原産地証明書・検査証明書なども含まれます。バイヤーはこれらを使って輸入通関を行います。',
  },
]
