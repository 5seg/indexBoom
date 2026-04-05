# IndexBoom

IndexBoomは、[IndexNow](https://www.bing.com/indexnow/)へのURL登録を行うためのスクリプトです。

## 動作

1. `sitemap.xml`を取得します。
2. 取得したサイトマップから、`<loc>`と`<lastmod>`が含まれている項目のみを抜き取ります。
3. IndexNowへURLを送信します。

このとき、`3.`の送信処理では前回の取得済データとの比較が行われます。取得済データがある場合は差分のみを送信し、データがない場合は全て送信します。

## セットアップ

Bun (v1.3.11以降) が必要です。

1. このリポジトリをクローン
2. `bun i`で依存関係をインストール
3. `.env.example`を`.env`としてコピーし、編集

## 実行

`bun run index.ts`で実行できます。
