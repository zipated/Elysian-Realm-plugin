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
                    reg: "^#*(.+)?乐土(.+)?攻略(2|3)?$",
                    fnc: 'strategy'
                }
            ]
        })
        this.path = './plugins/Elysian-Realm-plugin/resources/ElysianRealm-Data'
    }

    async strategy(e) {
        const messageText = e.msg
        let charName = messageText.replace(/#|＃|崩坏3|bh3|崩3|崩崩崩|更新|乐土|攻略/g, '')
        if (!charName) {
            return false
        }
        let char = alias.get(charName)
        const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
        const paths = [
            `${this.path}/${char}`,
            `${this.path}/data/${char}`
        ]

        for (const basePath of paths) {
            for (const ext of extensions) {
                const filePath = `${basePath}.${ext}`
                if (fs.existsSync(filePath)) {
                    return await this.e.reply(segment.image(filePath))
                }
            }
        }

        this.e.reply(`找不到攻略图哦，试试[#更新乐土攻略]？`)
        return true
    }
}