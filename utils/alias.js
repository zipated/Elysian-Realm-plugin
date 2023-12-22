import setting from './setting.js'
import _ from 'lodash'

export default new class {
  /**
   * @description: 获取别名
   * @param {string} name 要匹配的名称
   * @return {string|false} 未匹配到别名则返回false
   */
  get (name) {
    const aliasList = { ...setting.getConfig('alias') }
    // 读取角色文件
    if (name in aliasList) return name
    const roleName = _.findKey(aliasList, alias => alias.includes(name))
    if (roleName) {
      return roleName
    } else {
      logger.error('[乐土角色别名]未找到角色')
      return false
    }
  }
  
  getAllName () {
    // 读取角色文件
    return { ...setting.getConfig('alias') }
  }
}()
