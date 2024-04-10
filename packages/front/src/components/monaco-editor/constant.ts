/**
 * 支持的代码语言
 */
export const LANGUAGES = ['c', 'cpp', 'java'] as const

export type Language = (typeof LANGUAGES)[number]

/**
 * C 代码模板
 */
export const C_CODE_TEMPLATE = `#include <stdio.h>

int main(int argc, char** argv) {
  return 0;
}
`

/**
 * C++ 代码模板
 */
export const CPP_CODE_TEMPLATE = `#include <iostream>
using namespace std;

int main(int argc, char** argv) {
  return 0;
}
`

/**
 * Java 代码模板
 */
export const JAVA_CODE_TEMPLATE = `public class Main {
  public static void main(String[] args) {
  }
}
`

/**
 * 语言名称映射
 */
export const LANGUAGE_NAME_MAP = {
  c: 'C',
  cpp: 'C++',
  java: 'Java',
} as const

export type LanguageName = (typeof LANGUAGE_NAME_MAP)[Language]

/**
 * 语言类型反映射
 */
export const LANGUAGE_TYPE_MAP = {
  C: 'c',
  'C++': 'cpp',
  Java: 'java',
} as const

/**
 * 不同语言的代码模板映射
 */
export const LANGUAGE_CODE_TEMPLATE_MAP: { [lang in LanguageName]: string } = {
  C: C_CODE_TEMPLATE,
  'C++': CPP_CODE_TEMPLATE,
  Java: JAVA_CODE_TEMPLATE,
}

/**
 * 代码本地存储的 key
 */
export const getCodeStorageKey = (
  codeStoragePreKey: string,
  lang: LanguageName,
) => {
  return `${codeStoragePreKey}_${lang}`
}

/**
 * 加载本地代码
 */
export function loadLocalCode(codeStoragePreKey: string, lang: LanguageName) {
  return localStorage.getItem(getCodeStorageKey(codeStoragePreKey, lang))
}

/**
 * 保存本地代码
 */
export function saveLocalCode(
  codeStoragePreKey: string,
  lang: LanguageName,
  code: string,
) {
  if (!code) return
  localStorage.setItem(getCodeStorageKey(codeStoragePreKey, lang), code)
}
