import setting from './setting.js'
import _ from 'lodash'

export default new class {
  /**
   * @description: 获取别名
   * @param {string} name 要匹配的名称
   * @return {string|false} 未匹配到别名则返回false
   */
  get (name) {
    const aliasList = { ...defAlias, ...setting.getConfig('alias') }
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
    return { ...defAlias, ...setting.getConfig('alias') }
  }
}()
const defAlias = {
  Disciplinary: ['阿波尼亚', '戒律·深罪之槛', '戒律深罪之槛', '戒律'],
  Elysia: ['爱莉希雅', '粉色妖精小姐♪', '粉色妖精小姐', '爱莉'],
  TwinSeele: ['彼岸双生', '双生', '黑希'],
  Anchora: ['不灭星锚', '星锚', '星猫'],
  Refrigerator: ['苍骑士·月魂', '苍骑士月魂', '月魂', '冰箱', '冰塔'],
  Silverwing: ['次生银翼', '大鸭鸭'],
  Serenade: ['第六夜想曲', '冰卡', 's卡', 'S卡', '怪盗', '舞卡'],
  Raven: ['娜塔莎·希奥拉', '娜塔莎', '午夜苦艾', '渡鸦'],
  Fischl: ['菲谢尔', '皇女', '断罪皇女！！', '断罪皇女', '大幻梦森罗万象狂气断罪眼！'],
  Starry: ['格蕾修', '繁星·绘世之卷', '繁星', '绘世'],
  Excelsis: ['辉骑士·月魄', '辉骑士月魄', '幽兰戴尔', '月魄', '呆鹅'],
  Carol: ['卡萝尔', '甜辣女孩'],
  Void: ['空之律者', '空律', '女王'],
  Delta: ['萝莎莉娅', '萝莎莉娅·阿琳', '粉毛', '德尔塔', '狂热蓝调Δ', '狂热蓝调'],
  Thunder_Attack: ['雷之律者平A流', '雷律平A流'],
  Thunder_Punishment: ['雷之律者天罚流', '雷律天罚流'],
  Thunder: ['雷之律者', '雷律'],
  Susang: ['李素裳', '月痕', '李奶奶', '玉骑士·月痕', '玉骑士月痕'],
  Reason: ['理之律者', '理律', '摩托鸭', '车车'],
  Oven: ['缭乱星棘', '火塔', '烤箱', '星棘', '星塔'],
  Lnfinite: ['梅比乌斯', '无限·噬界之蛇', '无限噬界之蛇', '蛇蛇', '无限'],
  Twilight: ['暮光骑士·月煌', '暮光骑士月煌', '月煌', '紫苑'],
  Void_Skill: ['空之律者大招流', '女王大招流', '空律大招流'],
  Gloria: ['女武神·荣光', '女武神荣光', '荣光'],
  Felis: ['帕朵菲利丝', '空梦·掠集之兽', '帕朵', '猫猫', '菲利丝'],
  Bladestrike: ['破晓强袭', '强袭', '强袭强无敌'],
  Human_Branch: ['人之律者蓄力流', '人之律者纯蓄流', '人之律者蓄力', '人律蓄力流', '人律纯蓄流', '人律蓄力'],
  Human: ['真我·人之律者', '真我人之律者', '人之律者', '人律', '爱律'],
  Kallen: ['圣仪装·今样', '圣仪装今样', '今样', '卡莲'],
  Rosemary: ['迷迭', '失落迷迭'],
  Cabbage: ['爱衣', '时帆旅人', '包菜', '爱酱'],
  ShigureKira: ['时雨绮罗', '糖露星霜', '绮罗'],
  ShigureKira_Branch: ['时雨绮罗蓄力流', '糖露星霜蓄力流', '绮罗蓄力流'],
  Sentience: ['识之律者', '识律', '识宝', '小识'],
  First_Branch: ['始源之律者分支流', '始源分支流', '始源蓄力流', '始源分支流'],
  First: ['始源之律者', '始源之律者大招流', '始源', '始源大招流', '始源大招流', '回应我吧，爱莉希雅！'],
  Rebirth_Death: ['死生之律者', '死生之律者结命流', '死律结命流', '死律'],
  Rebirth_Life: ['死生之律者塑灵流', '死律塑灵流'],
  Susana: ['苏莎娜', '女武神·热砂', '女武神热砂', '苏珊娜', '热砂'],
  Palatinus: ['天元骑英', '天元', '天鹅', '泥头鹅'],
  Helical: ['维尔薇', '螺旋·愚戏之匣', '螺旋愚戏之匣', '维尔微', 'v2v', '螺旋'],
  Flamescion: ['薪炎之律者', '炎律', '薪炎'],
  Starchasm: ['魇夜星渊', '奶希', '冰希'],
  Golden: ['伊甸', '黄金·璀耀之歌', '黄金璀耀之歌', '黄金'],
  ShadowKnight: ['影骑士·月轮', '影骑士月轮', '月轮'],
  Dreamweaver: ['羽兔', '织羽梦旌', '米丝忒琳·沙尼亚特', '米丝忒琳', '米丝特琳'],
  Dreamweaver_Weapon: ['羽兔武器流', '织羽梦旌武器流', '米丝忒琳·沙尼亚特武器流', '米丝忒琳武器流', '米丝特琳武器流'],
  Moment: ['御神装·勿忘', '御神装勿忘', '勿忘', '机八', '冰八', '八重樱'],
  LunaKindred: ['月下初拥', '月下'],
  Eclipse: ['真红骑士·月蚀', '真红骑士月蚀', '姬子', '真红', '月蚀'],
  Eclipse_Branch: ['真红骑士·月蚀蓄力流', '真红骑士月蚀蓄力流', '姬子蓄力流', '真红蓄力流', '月蚀蓄力流'],
  Truth: ['真理之律者', '真理', '真律', '真鸭'],
  Truth_Weapon: ['真理之律者武器流', '真理武器流', '真律武器流', '真鸭武器流'],
  TerminalAide0017: ['终末协理0017', '普罗米修斯十七号', '普罗米修斯', '十七号', '0017', '普鸭', '崩坏意志'],
  Finally: ['终焉之律者', '终焉'],
  Finally_Branch: ['终焉之律者分支流', '终焉分支流', '终焉蓄力流', '终焉分支流'],
}
