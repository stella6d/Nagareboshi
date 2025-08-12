const fs = require("fs");
const path = require("path");

const targetDomain = "https://www.stella6d.com/"; // 独自ドメイン
const srcDir = "./src";   // 元コンテンツ
const outDir = "./docs";  // GitHub Pages公開ディレクトリ

const template = fs.readFileSync("./redirect-template.html", "utf-8");

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(dir, entry.name);
    const relPath = path.relative(srcDir, srcPath);
    const destPath = path.join(outDir, relPath);

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      walk(srcPath);
    } else {
      if (entry.name.endsWith(".html")) {
        // HTMLはリダイレクトに置き換え
        const redirectUrl = "https://www.stella6d.com" + "/" + relPath.replace(/\\/g, "/");
        const html = template.replace(/__URL__/g, redirectUrl);
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.writeFileSync(destPath, html);
      } else {
        // HTML以外はそのままコピー
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

// docsをクリーンアップ
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

// 実行
walk(srcDir);
console.log("Redirect pages generated with fallback message.");
