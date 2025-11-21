export interface RegexPreset {
  id: string;
  name: string;
  description: string;
  regularExpress: string[];
  examples: string[];
  autoExtensions?: string[];
}

export const REGEX_PRESETS: RegexPreset[] = [
  {
    id: 'asp-classic',
    name: 'ASP / Classic ASP',
    description: 'ASP include 문을 감지합니다 (<!--include file="..."-->)',
    regularExpress: [
      '/<!--(.*?)include(.+?)=(\\s+)?\\\"(?<filename>.*?)\\\"(.*)-->/g'
    ],
    examples: [
      '<!--include file="/common/header.asp"-->',
      '<!--include file="./utils/helper.asp"-->'
    ]
  },
  {
    id: 'javascript-import',
    name: 'JavaScript/TypeScript Import',
    description: 'ES6 import 문을 감지합니다',
    regularExpress: [
      '/import\\s+.*?from\\s+[\'"](?<filename>.*?)[\'\"]/g',
      '/import\\s+[\'"](?<filename>.*?)[\'"]/g'
    ],
    examples: [
      'import { Component } from "./components/Component"',
      'import "./styles/main.css"'
    ],
    autoExtensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']
  },
  {
    id: 'javascript-require',
    name: 'JavaScript Require',
    description: 'CommonJS require 문을 감지합니다',
    regularExpress: [
      '/require\\s*\\([\'"](?<filename>.*?)[\'"]\\)/g'
    ],
    examples: [
      'const utils = require("./utils")',
      'require("./config")'
    ]
  },
  {
    id: 'vue-import',
    name: 'Vue.js Import (@ 경로)',
    description: 'Vue.js의 @ alias import를 감지합니다',
    regularExpress: [
      '/import\\s+.*?from\\s+[\'"]@\\/(?<filename>.*?)[\'\"]/g',
      '/import\\s+[\'"]@\\/(?<filename>.*?)[\'"]/g'
    ],
    examples: [
      'import Component from "@/components/MyComponent.vue"',
      'import "@/styles/main.css"'
    ]
  },
  {
    id: 'python-import',
    name: 'Python Import',
    description: 'Python import 문을 감지합니다',
    regularExpress: [
      '/from\\s+(?<filename>[\\w.]+)\\s+import/g',
      '/import\\s+(?<filename>[\\w.]+)/g'
    ],
    examples: [
      'from utils.helper import function',
      'import os.path'
    ],
    autoExtensions: ['.py']
  },
  {
    id: 'php-include',
    name: 'PHP Include/Require',
    description: 'PHP의 include, require 문을 감지합니다',
    regularExpress: [
      '/(include|require)(_once)?\\s*\\(?[\'"](?<filename>.*?)[\'"]\\)?/g'
    ],
    examples: [
      'include("./header.php")',
      'require_once "config.php"'
    ]
  },
  {
    id: 'css-import',
    name: 'CSS @import',
    description: 'CSS의 @import 문을 감지합니다',
    regularExpress: [
      '/@import\\s+[\'"](?<filename>.*?)[\'"]/g',
      '/@import\\s+url\\([\'"](?<filename>.*?)[\'"]\\)/g'
    ],
    examples: [
      '@import "./variables.css"',
      '@import url("./theme.css")'
    ]
  },
  {
    id: 'html-src',
    name: 'HTML src/href',
    description: 'HTML의 src, href 속성을 감지합니다',
    regularExpress: [
      '/src=[\'"](?<filename>.*?)[\'"]/g',
      '/href=[\'"](?<filename>.*?)[\'"]/g'
    ],
    examples: [
      '<script src="./app.js"></script>',
      '<link href="./style.css" />'
    ]
  },
  {
    id: 'csharp-using',
    name: 'C# Using',
    description: 'C#의 using 디렉티브를 감지합니다',
    regularExpress: [
      '/using\\s+(?<filename>[\\w.]+);/g'
    ],
    examples: [
      'using System.Collections.Generic;',
      'using MyProject.Utils;'
    ]
  },
  {
    id: 'go-import',
    name: 'Go Import',
    description: 'Go의 import 문과 @file 주석을 감지합니다',
    regularExpress: [
      '/\\/\\/\\s*@file:\\s*(?<filename>.*?)(?:\\s|$)/g',
      '/import\\s+[\'"](?<filename>\\.\\/.*?)[\'"]/g',
      '/import\\s+\\w+\\s+[\'"](?<filename>\\.\\/.*?)[\'"]/g'
    ],
    examples: [
      '// @file: ./utils.go',
      'import "./utils"',
      'import utils "./helpers/utils"'
    ]
  }
];

export function getPresetById(id: string): RegexPreset | undefined {
  return REGEX_PRESETS.find(preset => preset.id === id);
}

export function getPresetNames(): string[] {
  return REGEX_PRESETS.map(preset => preset.name);
}

export function getAllPresets(): RegexPreset[] {
  return REGEX_PRESETS;
}
