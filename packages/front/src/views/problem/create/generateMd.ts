import { ProblemContent } from '@simple-oj-frontend/api'

const getSampleHtml = (
  sample: ProblemContent['sampleGroup'][0],
  index: number,
) => {
  return `
<div class="sample">
    <div>
        <h4>输入#${index}</h4>
        <pre>${sample.in}</pre>
    </div>
    <div>
        <h4>输出#${index}</h4>
        <pre>${sample.out}</pre>
    </div>
</div>
    `
}

const getSampleGroupHtml = (sampleGroup: ProblemContent['sampleGroup']) => {
  const result = sampleGroup.reduce((pre, cur, index) => {
    return pre + getSampleHtml(cur, index)
  }, '')

  return result
}

export const generateMd = (content: ProblemContent, id?: number) => {
  const { title, description, inputFormat, outputFormat, sampleGroup, hint } =
    content

  return `# ${id ? id + '. ' : ''}${title}

## 题目描述
${description}

## 输入格式
${inputFormat}

## 输出格式
${outputFormat}

## 样例

${getSampleGroupHtml(sampleGroup)}

## 提示说明
${hint}

- 内存限制：${content.memoryLimit}MB
- 时间限制：${content.timeLimit}MS
`
}
