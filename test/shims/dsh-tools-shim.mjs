// test/shims/dsh-tools-shim.mjs — defineTool 的最小桩,契约对齐 DSH 真实实现:
// 透传 execute,保留 render/timeoutMs/isConcurrencySafe 等字段。
export function defineTool(options) {
  return {
    name: options.name,
    description: options.description,
    parameters: options.parameters,
    output: {
      schema: options.output?.schema,
      render: options.output?.render
    },
    ...(options.timeoutMs !== undefined ? { timeoutMs: options.timeoutMs } : {}),
    ...(options.isConcurrencySafe ? { isConcurrencySafe: options.isConcurrencySafe } : {}),
    async execute(args, exec) {
      return options.execute(args, exec);
    }
  };
}
