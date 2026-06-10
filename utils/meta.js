import fs from 'node:fs'
import path from 'path'
import chokidar from 'chokidar'
import { pluginResources } from './path.js'

class MetaManager {
  constructor() {
    this.metaDir = path.join(pluginResources, 'ElysianRealm-Data', 'meta')
    this.distIndexPath = path.join(pluginResources, 'ElysianRealm-Data', 'dist', 'elysian-realm-index.json')
    this.available = false
    this.metaAliasMap = null
    this.distResources = null
    this.watchers = []
  }

  checkAvailability() {
    const metaExists = fs.existsSync(this.metaDir)
    const distExists = fs.existsSync(this.distIndexPath)
    this.available = metaExists && distExists
    return this.available
  }

  clearCache() {
    this.metaAliasMap = null
    this.distResources = null
    logger.mark('[乐土攻略插件][meta] 数据已变更，缓存已清除，下次查询将重新加载')
  }

  // 启动文件监听
  startWatching() {
    if (this.watchers.length > 0) return

    // 监听 dist 索引文件变化
    if (fs.existsSync(this.distIndexPath)) {
      const distWatcher = chokidar.watch(this.distIndexPath)
      distWatcher.on('change', () => this.clearCache())
      this.watchers.push(distWatcher)
    }

    // 监听 meta 文件变化
    if (fs.existsSync(this.metaDir)) {
      const metaWatcher = chokidar.watch(path.join(this.metaDir, '*.json'))
      metaWatcher.on('change', () => this.clearCache())
      this.watchers.push(metaWatcher)
    }
  }

  // 读取 dist index，获取 resources 中的 last_updated 信息
  loadDistIndex() {
    if (this.distResources) return this.distResources
    if (!fs.existsSync(this.distIndexPath)) return null
    try {
      const data = JSON.parse(fs.readFileSync(this.distIndexPath, 'utf-8'))
      this.distResources = data.resources || {}
      return this.distResources
    } catch (e) {
      logger.error(`[乐土攻略插件][meta] dist 索引读取失败: ${e.message}`)
      return null
    }
  }

  // 读取 meta 文件，处理关键词，消歧后返回映射表
  getMetaAliasMap() {
    if (this.metaAliasMap) return this.metaAliasMap
    if (!this.checkAvailability()) return null

    // 首次使用时启动监听
    this.startWatching()

    this.loadDistIndex()
    if (!this.distResources) return null

    // 读取所有 meta JSON 文件，构建映射
    const metaFiles = fs.readdirSync(this.metaDir).filter(f => f.endsWith('.json'))
    const tempMap = {}

    for (const file of metaFiles) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(this.metaDir, file), 'utf-8'))
        if (!data.keywords || !Array.isArray(data.keywords)) continue
        for (const kw of data.keywords) {
          const cleanKw = kw.replace(/乐土/g, '')
          if (!cleanKw) continue
          if (!tempMap[cleanKw]) tempMap[cleanKw] = []
          if (!tempMap[cleanKw].includes(data.id)) {
            tempMap[cleanKw].push(data.id)
          }
        }
      } catch (e) {
        logger.error(`[乐土攻略插件][meta] 读取 ${file} 失败: ${e.message}`)
      }
    }

    this.metaAliasMap = {}
    for (const [keyword, ids] of Object.entries(tempMap)) {
      if (ids.length === 1) {
        this.metaAliasMap[keyword] = ids[0]
      } else {
        const sorted = [...ids].sort((a, b) => {
          const timeA = this.distResources[a]?.last_updated || '0'
          const timeB = this.distResources[b]?.last_updated || '0'
          return timeB.localeCompare(timeA)
        })
        const latest = sorted.filter(id => {
          const time = this.distResources[id]?.last_updated || '0'
          return time === this.distResources[sorted[0]]?.last_updated
        })
        if (latest.length > 1) {
          this.metaAliasMap[keyword] = latest[Math.floor(Math.random() * latest.length)]
        } else {
          this.metaAliasMap[keyword] = sorted[0]
        }
      }
    }

    return this.metaAliasMap
  }
}

export default new MetaManager()