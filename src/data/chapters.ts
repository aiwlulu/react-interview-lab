export const chapters = [
  {
    id: "chapter-01",
    title: "CH01 - React 狀態管理的陷阱與技巧",
    topics: [
      {
        id: "array-push-trap",
        title: "1.1 - Array.push 用在更新 state，居然不起作用了？",
      },
      {
        id: "setstate-multiple-call",
        title: "1.2 - setState 連續呼叫這麼多次，怎麼只作用一次？",
      },
      {
        id: "undefined-error-initial-state",
        title:
          "1.3 - 簡單的 useState 使用，卻出現了「Cannot set properties of undefined」的錯誤訊息？",
      },
      {
        id: "massive-state-organization",
        title: "1.4 - 元件內 state 有夠多，如何優雅地管理龐大的元件狀態？",
      },
      {
        id: "zero-in-conditional-render",
        title: "1.5 - 條件渲染怎麼多了個 0 啊？",
      },
      {
        id: "hooks-order-error",
        title:
          "1.6 - Rendered more hooks than during the previous render，這又是什麼鬼東西啊？",
      },
      {
        id: "initial-props-doesnt-update",
        title: "1.7 - 這個 useState 初始值重新渲染後，怎麼不會更新啊？",
      },
      {
        id: "useRef-vs-useState",
        title: "1.8 - 有時候也許 useState 並不夠好？",
      },
      {
        id: "form-state-dependency",
        title: "1.9 - 複雜表單：彼此依賴的 state 管理該怎麼做？",
      },
    ],
  },
  {
    id: "chapter-02",
    title: "CH02 - React 中你可能忽略的副作用",
    topics: [
      {
        id: "memory-leak-useeffect",
        title: "2.1 - 怪了，我的頁面怎麼越跑越慢啊？記憶體洩漏是什麼鬼？",
      },
      {
        id: "basic-fetch-issue",
        title: "2.2 - 在 useEffect 中做簡單的資料請求也能出問題？",
      },
      {
        id: "strictmode-double-call",
        title: "2.3 - 空的依賴陣列居然讓 Callback 觸發了兩次？",
      },
      {
        id: "race-condition",
        title: "2.4 - useEffect 中的競態條件又是怎麼一回事啊？",
      },
      {
        id: "derived-state-overuse",
        title: "2.5 - 這種情況用 useEffect 就對了⋯⋯吧？",
      },
      {
        id: "scroll-flicker-fix",
        title: "2.6 - 用 useEffect 處理事件，卻讓畫面抖了一下？",
      },
    ],
  },
  {
    id: "chapter-03",
    title: "CH03 - React 效能優化與最佳化實踐",
    topics: [
      {
        id: "key-index-problem",
        title: "3.1 - 使用索引作為 key 值簡單又方便，但這樣對嗎？",
      },
      {
        id: "rerender-cost",
        title: "3.2 - 重新渲染的昂貴代價該怎麼處理？",
      },
      {
        id: "react-memo-trap",
        title: "3.3 - React.memo 這麼好用，我還不用爆！",
      },
      {
        id: "context-rerender",
        title: "3.4 - 不過是個渲染行為，怎麼連 useContext 也在搞啊！",
      },
      {
        id: "memo-function-props",
        title: "3.5 - React.memo 怎麼碰到函數當作 props 就不行啦！",
      },
    ],
  },
  {
    id: "chapter-04",
    title: "CH04 - React 面試實戰問題",
    topics: [
      {
        id: "render-order-quiz",
        title:
          "4.1 - 你說你懂 React 渲染邏輯，那試著回答這元件內部的程式碼執行順序",
      },
      {
        id: "todo-basic-implementation",
        title: "4.2 - 簡單的待辦事項工具也能拿來考？",
      },
      {
        id: "tab-switch-challenge",
        title: "4.3 - 要我寫 Tab 元件？真的假的？",
      },
      {
        id: "custom-hook-usefetch",
        title: "4.4 - 現場寫一個 Custom Hook 是能有多難？",
      },
      {
        id: "pagination-demo",
        title: "4.5 - 寫一個簡單的分頁來應付大量資料呈現吧！",
      },
      {
        id: "emoji-click-effect-1",
        title: "4.6 - 點擊畫面後新增表情符號，也算是 React 面試題？（Part I）",
      },
      {
        id: "emoji-click-effect-2",
        title: "4.7 - 點擊畫面後新增表情符號，也算是 React 面試題？（Part II）",
      },
      {
        id: "synonym-fetcher",
        title: "4.8 - 自行查看文件，並完成請求同義字的功能吧！",
      },
      {
        id: "tic-tac-toe-game",
        title: "4.9 - 井字遊戲（Tic-Tac-Toe），為什麼連你都在面試場上啊？",
      },
      {
        id: "memory-card-game",
        title: "4.10 - 翻牌遊戲也來參一腳！",
      },
    ],
  },
];
