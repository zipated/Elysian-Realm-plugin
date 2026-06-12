import fs from 'node:fs'
import path from 'path'
import chokidar from 'chokidar'
import { pluginResources } from './path.js'

class MetaManager {
  constructor() {
    this.distIndexPath = path.join(pluginResources, 'ElysianRealm-Data', 'dist', 'elysian-realm-index.json')
    this.available = false
    this.keywordMap = null
    this.distResources = null
    this.distKeywords = null
    this.watchers = []
  }

  checkAvailability() {
    const distExists = fs.existsSync(this.distIndexPath)
    this.available = distExists
    return this.available
  }

  clearCache() {
    this.keywordMap = null
    this.distResources = null
    this.distKeywords = null
    logger.mark('[乐土攻略插件][meta] 数据已变更，下次查询将重新加载')
  }

  // 启动文件监听
  startWatching() {
    if (this.watchers.length > 0) return
    if (fs.existsSync(this.distIndexPath)) {
      const distWatcher = chokidar.watch(this.distIndexPath)
      distWatcher.on('change', () => this.clearCache())
      this.watchers.push(distWatcher)
    }
  }

  // 读取 dist index
  loadDistIndex() {
    if (this.distResources) return this.distResources
    if (!fs.existsSync(this.distIndexPath)) return null
    try {
      const data = JSON.parse(fs.readFileSync(this.distIndexPath, 'utf-8'))
      this.distResources = data.resources || {}
      this.distKeywords = data.keywords || {}
      return this.distResources
    } catch (e) {
      logger.error(`[乐土攻略插件][meta] dist 索引读取失败: ${e.message}`)
      return null
    }
  }

  // 处理关键词冲突：保留 last_updated 更近的
  _setBestMatch(key, id) {
    const existing = this.keywordMap[key]
    if (!existing) {
      this.keywordMap[key] = id
      return
    }
    if (existing === id) return
    const existingTime = this.distResources[existing]?.last_updated || '0'
    const newTime = this.distResources[id]?.last_updated || '0'
    if (newTime > existingTime) {
      this.keywordMap[key] = id
    }
  }

  getKeywordMap() {
    if (this.keywordMap) return this.keywordMap
    if (!this.checkAvailability()) return null

    // 首次使用时启动监听
    this.startWatching()

    this.loadDistIndex()
    if (!this.distKeywords) return null
    this.keywordMap = {}

    for (const [keyword, ids] of Object.entries(this.distKeywords)) {
      if (!ids || ids.length === 0) continue
      const bestId = ids[0]
      this._setBestMatch(keyword, bestId)
      const cleanKw = keyword.replace(/乐土/g, '')
      if (cleanKw && cleanKw !== keyword) {
        this._setBestMatch(cleanKw, bestId)
      }
    }
    return this.keywordMap
  }

  // 兼容旧接口，内部委托给 getKeywordMap
  getMetaAliasMap() {
    return this.getKeywordMap()
  }
}

export default new MetaManager()