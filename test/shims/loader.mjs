// test/shims/loader.mjs — 仅测试用:把 @deepseek-ai/dsh-tools 解析到本地桩。
// DSH 运行时内无需此 shim(运行时会提供真实模块)。
export async function resolve(specifier, context, nextResolve) {
  if (specifier === '@deepseek-ai/dsh-tools') {
    return { shortCircuit: true, url: new URL('./dsh-tools-shim.mjs', import.meta.url).href };
  }
  return nextResolve(specifier, context);
}
