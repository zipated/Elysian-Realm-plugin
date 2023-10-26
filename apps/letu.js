import plugin from '../../../lib/plugins/plugin.js'
import alias from '../utils/alias.js'
import fs from 'node:fs'

export default class letu extends plugin {
    constructor(e) {
        super({
            name: '查询乐土攻略',
            event: 'message',
            dsc: '查询乐土攻略',
            priority: -100,
            rule: [
                {
                    reg: "^#*(.+)乐土攻略(\d)?$",
                    fnc: 'strategy'
                }
            ]
        })
        this.path = './plugins/Elysian-Realm-plugin/resources/ElysianRealm-Data'
    };

    async strategy(e) {
        const messageText = e.msg
        let charName = messageText.replace(/#|＃|崩坏3|bh3|崩3|崩崩崩|更新|乐土攻略/g, '')
        if (!charName) {
            return false
        }
        let char = alias.get(charName)
        // 嗯写
        if (fs.existsSync(`${this.path}/${char}.jpg`)) {
            await this.e.reply(segment.image(`${this.path}/${char}.jpg`))
            return
        }
        if (fs.existsSync(`${this.path}/${char}.jpg`)) {
            await this.e.reply(segment.image(`${this.path}/${char}.jpeg`))
            return
        }
        if (fs.existsSync(`${this.path}/${char}.png`)) {
            await this.e.reply(segment.image(`${this.path}/${char}.png`))
            return
        }
        if (fs.existsSync(`${this.path}/${char}.jpg`)) {
            await this.e.reply(segment.image(`${this.path}/${char}.gif`))
            return
        }
        if (fs.existsSync(`${this.path}/${char}.jpg`)) {
            await this.e.reply(segment.image(`${this.path}/${char}.webp`))
            return
        }

        this.e.reply(`找不到攻略图哦，试试[#更新乐土攻略]？`)
        return true
    }
}