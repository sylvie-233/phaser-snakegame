// @snake/eslint-config — 共享 ESLint flat config(TypeScript)
// 环境 globals(window / node / 等)由各应用在自己的 eslint.config.ts 里按需补充,
// 这里只沉淀框架无关的团队规则,方便跨项目复用。
//
// 说明:本包入口是 .ts,由 ESLint 9.14+ 内置的 jiti 加载转译,不依赖 Node 版本。
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    name: '@snake/ignores',
    ignores: ['dist/**', 'release/**', 'out/**', 'coverage/**', 'node_modules/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    name: '@snake/team-rules',
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  // 必须放最后,关掉与 Prettier 冲突的格式类规则
  eslintConfigPrettier,
);
