import plugin from '../../../lib/plugins/plugin.js'
import { createRequire } from 'module'
import _ from 'lodash'
import fs from 'fs'
import { Restart } from '../../other/restart.js'

const _path = process.cwd()
const require = createRequire(import.meta.url)
const { exec, execSync } = require('child_process')

const checkAuth = async function (e) {
  if (!e.isMaster) {
    e.reply('只有主人才能使用该命令哦~')
    return false
  }
  return true
}

// 是否在更新中
let uping = false

export class Update extends plugin {
  constructor () {
    super({
      name: '攻略图更新',
      event: 'message',
      priority: -101,
      rule: [
        {
          reg: `^#*(崩坏3|bh3|崩3|崩崩崩)?((强制)?(更新|重装)乐土攻略|乐土攻略(强制)?(更新|重装))(ghproxy)?$`,
          fnc: 'updateRes',
          desc: '【#管理】更新素材'
        },
        {
          reg: `^#*(崩坏3|bh3|崩3|崩崩崩)?((强制)?更新乐土攻略插件|乐土攻略插件(强制)?更新)$`,
          fnc: 'update',
          desc: '【#管理】插件更新'
        }
      ]
    })
  }

  async updateRes (e) {
    if (!await checkAuth(e)) {
      return true
    }
    let isForce = e.msg.includes('强制')
    let isReinstall = e.msg.includes('重装')
    let isGhproxy = e.msg.includes('ghproxy')
    let command = ''
    let isInstalled = fs.existsSync(`${_path}/plugins/Elysian-Realm-plugin/resources/ElysianRealm-Data/`)
    if (isReinstall && isInstalled) {
      try {
        fs.rmSync(`${_path}/plugins/Elysian-Realm-plugin/resources/ElysianRealm-Data`, { recursive: true, force: true })
        e.reply(`开始重新安装乐土攻略`)
        isInstalled = false
      } catch (err) {
        e.reply(`乐土攻略重装失败:\n ${err.message}`)
        return false
      }
    }
    if (isInstalled) {
      e.reply('开始尝试更新，请耐心等待~')
      command = 'git pull'
      if (isForce) {
        command = 'git  checkout . && git  pull'
      }
      exec(command, { cwd: `${_path}/plugins/Elysian-Realm-plugin/resources/ElysianRealm-Data/` }, function (error, stdout, stderr) {
        console.log(stdout)
        if (/(Already up[ -]to[ -]date|已经是最新的)/.test(stdout)) {
          e.reply('目前所有攻略图片都已经是最新了~')
          return true
        }
        let numRet = /(\d*) files changed,/.exec(stdout)
        if (numRet && numRet[1]) {
          e.reply(`报告主人，更新成功，此次更新了${numRet[1]}个图片~`)
          return true
        }
        if (error) {
          e.reply('更新失败！\nError code: ' + error.code + '\n' + error.stack + '\n 请稍后重试。')
        } else {
          e.reply('乐土攻略图片更新成功~')
        }
      })
    } else {
      let url = 'https://github.com/MskTmi/ElysianRealm-Data.git'
      if (isGhproxy){
        url = 'https://ghfast.top/https://github.com/MskTmi/ElysianRealm-Data.git'
      }
      command = `git clone ${url} "${_path}/plugins/Elysian-Realm-plugin/resources/ElysianRealm-Data" --depth=1`
      e.reply('开始尝试安装乐土攻略图片，可能会需要一段时间，请耐心等待~')
      exec(command, function (error, stdout, stderr) {
        if (error) {
          e.reply('乐土攻略图片安装失败！\nError code: ' + error.code + '\n' + error.stack + '\n 请稍后重试。')
        } else {
          e.reply('乐土攻略图片安装成功！您后续也可以通过 #乐土攻略更新 命令来更新图像')
        }
      })
    }
    return true
  }

  /**
   * 异步执行git相关命令
   * @param {string} cmd git命令
   * @returns
   */
  async execSync (cmd) {
    return new Promise((resolve, reject) => {
      exec(cmd, { windowsHide: true }, (error, stdout, stderr) => {
        resolve({ error, stdout, stderr })
      })
    })
  }

  /**
   * 检查git是否安装
   * @returns
   */
  async checkGit () {
    let ret = await execSync('git --version', { encoding: 'utf-8' })
    if (!ret || !ret.includes('git version')) {
      await this.reply('请先安装git')
      return false
    }
    return true
  }

  async update (e) {
    if (!this.e.isMaster) return false

    /** 检查是否正在更新中 */
    if (uping) {
      await this.reply('已有命令更新中..请勿重复操作')
      return
    }

    /** 检查git安装 */
    if (!(await this.checkGit())) return

    const isForce = this.e.msg.includes('强制')

    /** 执行更新 */
    await this.runUpdate(isForce)

    /** 是否需要重启 */
    if (this.isUp) {
      // await this.reply("更新完毕，请重启云崽后生效")
      setTimeout(() => this.restart(), 2000)
    }
  }
  
  restart () {
    new Restart(this.e).restart()
  }

  /**
   * 星铁插件更新函数
   * @param {boolean} isForce 是否为强制更新
   * @returns
   */
  async runUpdate (isForce) {
    const _path = './plugins/Elysian-Realm-plugin/'
    let command = `git -C ${_path} pull --no-rebase`
    if (isForce) {
      command = `git -C ${_path} fetch --all && git -C ${_path} reset --hard HEAD`
      this.e.reply('正在执行强制更新操作，请稍等')
    } else {
      this.e.reply('正在执行更新操作，请稍等')
    }
    /** 获取上次提交的commitId，用于获取日志时判断新增的更新日志 */
    this.oldCommitId = await this.getcommitId('Elysian-Realm-plugin')
    uping = true
    let ret = await this.execSync(command)
    uping = false

    if (ret.error) {
      logger.mark(`${this.e.logFnc} 更新失败：Elysian-Realm-plugin`)
      this.gitErr(ret.error, ret.stdout)
      return false
    }

    /** 获取插件提交的最新时间 */
    let time = await this.getTime('Elysian-Realm-plugin')

    if (/(Already up[ -]to[ -]date|已经是最新的)/.test(ret.stdout)) {
      await this.reply(`Elysian-Realm-plugin已经是最新版本\n最后更新时间：${time}`)
    } else {
      await this.reply(`Elysian-Realm-plugin\n最后更新时间：${time}`)
      this.isUp = true
      /** 获取星铁组件的更新日志 */
      let log = await this.getLog('Elysian-Realm-plugin')
      await this.reply(log)
    }

    logger.mark(`${this.e.logFnc} 最后更新时间：${time}`)

    return true
  }

  /**
   * 获取插件的更新日志
   * @param {string} plugin 插件名称
   * @returns
   */
  async getLog (plugin = '') {
    let cm = `cd ./plugins/${plugin}/ && git log  -20 --oneline --pretty=format:"%h||[%cd]  %s" --date=format:"%m-%d %H:%M"`

    let logAll
    try {
      logAll = await execSync(cm, { encoding: 'utf-8' })
    } catch (error) {
      logger.error(error.toString())
      this.reply(error.toString())
    }

    if (!logAll) return false

    logAll = logAll.split('\n')

    let log = []
    for (let str of logAll) {
      str = str.split('||')
      if (str[0] == this.oldCommitId) break
      if (str[1].includes('Merge branch')) continue
      log.push(str[1])
    }
    let line = log.length
    log = log.join('\n\n')

    if (log.length <= 0) return ''

    // const end = '更多详细信息，请前往gitee查看\nhttps://gitee.com/hewang1an/StarRail-plugin'
    const end = '.> <.'

    log = await common.makeForwardMsg(this.e, [log, end], `Elysian-Realm-plugin更新日志，共${line}条`)

    return log
  }

  /**
   * 获取上次提交的commitId
   * @param {string} plugin 插件名称
   * @returns
   */
  async getcommitId (plugin = '') {
    let cm = `git -C ./plugins/${plugin}/ rev-parse --short HEAD`

    let commitId = await execSync(cm, { encoding: 'utf-8' })
    commitId = _.trim(commitId)

    return commitId
  }

  /**
   * 获取本次更新插件的最后一次提交时间
   * @param {string} plugin 插件名称
   * @returns
   */
  async getTime (plugin = '') {
    let cm = `cd ./plugins/${plugin}/ && git log -1 --oneline --pretty=format:"%cd" --date=format:"%m-%d %H:%M"`

    let time = ''
    try {
      time = await execSync(cm, { encoding: 'utf-8' })
      time = _.trim(time)
    } catch (error) {
      logger.error(error.toString())
      time = '获取时间失败'
    }
    return time
  }

  /**
   * 处理更新失败的相关函数
   * @param {string} err
   * @param {string} stdout
   * @returns
   */
  async gitErr (err, stdout) {
    let msg = '更新失败！'
    let errMsg = err.toString()
    stdout = stdout.toString()

    if (errMsg.includes('Timed out')) {
      let remote = errMsg.match(/'(.+?)'/g)[0].replace(/'/g, '')
      await this.reply(msg + `\n连接超时：${remote}`)
      return
    }

    if (/Failed to connect|unable to access/g.test(errMsg)) {
      let remote = errMsg.match(/'(.+?)'/g)[0].replace(/'/g, '')
      await this.reply(msg + `\n连接失败：${remote}`)
      return
    }

    if (errMsg.includes('be overwritten by merge')) {
      await this.reply(
        msg +
        `存在冲突：\n${errMsg}\n` +
        '请解决冲突后再更新，或者执行#强制更新，放弃本地修改'
      )
      return
    }

    if (stdout.includes('CONFLICT')) {
      await this.reply([
        msg + '存在冲突\n',
        errMsg,
        stdout,
        '\n请解决冲突后再更新，或者执行#强制更新，放弃本地修改'
      ])
      return
    }

    await this.reply([errMsg, stdout])
  }

  /**
   * 检查git是否安装
   * @returns
   */
  async checkGit () {
    let ret = await execSync('git --version', { encoding: 'utf-8' })
    if (!ret || !ret.includes('git version')) {
      await this.reply('请先安装git')
      return false
    }
    return true
  }
}