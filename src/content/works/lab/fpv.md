---
title: 物理 FPV 模擬器
titleEn: Physical FPV
summary: 以真實物理打造的穿越機飛行練習：電池壓降、馬達負載，穿越 5 道門挑戰圈速。支援鍵盤、觸控與手把。
summaryEn: Physics-first FPV simulator built from real physical properties.
date: 2026-10-07
updated: 2026-10-29
kind: 飛行模擬
status: prototype
statusNote: v0.1；採用合成參數，尚未通過真實飛行器驗證
cover: ../../../assets/covers/lab-fpv.jpg
coverAlt: 模擬器畫面。跑道盡頭有幾道橘色的門，左側面板顯示「0 / 5 gates」，下方寫著「物理 FPV 模擬器」。
tech: [TypeScript, three.js, Rapier, Vite]
launchUrl: https://game.lijiabao.uk/fpv/
repoUrl: https://github.com/lijiabao1998/fpv
featured: 4
---

以物理方程式為基礎的網頁 FPV 穿越機模擬器。

模擬的範圍包括電池壓降與馬達負載。練習場上有 5 道門，穿過它們，計算圈速。免安裝，支援鍵盤、觸控與手把。

## 限制

這是基於物理方程的飛行模擬，採用合成參數，尚未通過真實飛行器驗證。
