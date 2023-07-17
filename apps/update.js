import plugin from '../../../lib/plugins/plugin.js'
import { createRequire } from 'module'
import _ from 'lodash'
import fs from 'fs'

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

export class Update extends plugin {
  constructor () {
    super({
      name: '攻略图更新',
      event: 'message',
      priority: 1000,
      rule: [
        {
          reg: `^#*(崩坏3|bh3|崩3|崩崩崩)?(强制)?(更新乐土攻略|乐土攻略更新)(ghproxy)?$`,  //留个强制好了（
          fnc: 'updateRes',
          desc: '【#管理】更新素材'
        }
      ]
    })
  }

  async updateRes (e) {
    if (!await checkAuth(e)) {
      return true
    }
    let isForce = e.msg.includes('强制')
    let isGhproxy = e.msg.includes('ghproxy')
    let command = ''
    if (fs.existsSync(`${_path}/plugins/Elysian-Realm-plugin/resources/ElysianRealm-Data/`)) {
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
        url = 'https://ghproxy.com/https://github.com/MskTmi/ElysianRealm-Data.git'
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
}