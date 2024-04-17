// Fetch 一把梭

export interface IFreeGPTData {
  choices: {
    finish_reason: string
    index: number
    logprobs: unknown
    message: {
      content: string
      role: string
    }
  }[]
  created: number
  id: string
  model: string
  object: string
  system_fingerprint: string
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export class GPTApi {
  /**
   * 调用免费的 GPT-3 API
   */
  public static async callFreeGpt3(content: string, token: string) {
    const res = await fetch(
      'https://api.chatanywhere.com.cn/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: content,
            },
          ],
          temperature: 0.7,
        }),
      },
    )
    return (await res.json()) as Promise<IFreeGPTData>
  }
}

/**
 * 读取本地的 API key
 */
export function readGPTApiKey() {
  return localStorage.getItem('gpt-free-api-key')
}

/**
 * 保存 API key 到本地
 */
export function saveGPTApiKey(apiKey: string) {
  localStorage.setItem('gpt-free-api-key', apiKey)
}

/**
 * 删除本地的 API key
 */
export function deleteGPTApiKey() {
  localStorage.removeItem('gpt-free-api-key')
}
