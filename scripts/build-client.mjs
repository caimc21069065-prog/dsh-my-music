// scripts/build-client.mjs — 用 esbuild 把 src/client.jsx 打包成 DSH 客户端模块格式:
//   window.__ModuleLoader__.load({ id, factory(require) { ... } })
// react / react-dom 为 external,运行时由 DSH 浏览器模块表提供(factory 的 require 参数)。

import { build } from 'esbuild';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const pkg = JSON.parse(await import('node:fs').then((fs) => fs.readFileSync('package.json', 'utf-8')));

await mkdir('lib', { recursive: true });

const banner = `window.__ModuleLoader__.load({
  id: ${JSON.stringify(pkg.name)},
  factory(require) {`;

const footer = `
  return __dsh_music_face;
  },
});`;

await build({
  entryPoints: ['src/client.jsx'],
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  outfile: 'lib/client.js',
  jsx: 'automatic',
  minify: false,
  minifyWhitespace: true,
  minifySyntax: true,
  minifyIdentifiers: false, // footer 按名引用 __dsh_music_face,标识符不可重命名
  sourcemap: false,
  treeShaking: false, // 工厂通过 footer 引用 __dsh_music_face,esbuild 无法感知该依赖,必须关闭摇树
  loader: { '.css': 'text' }, // CSS 以文本内联,运行时渲染 <style>;DSH 只加载 client.js 单文件
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  banner: { js: banner },
  footer: { js: footer },
  logLevel: 'info'
});

console.log('client bundle → lib/client.js');
