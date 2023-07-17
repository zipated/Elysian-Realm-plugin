import plugin from '../../../lib/plugins/plugin.js'
export class help extends plugin {
    constructor(e) {
        super({
            name: '乐土攻略帮助',
            event: 'message',
            dsc: '乐土攻略帮助',
            priority: 100,
            rule: [
                {
                    reg: "^#*乐土攻略帮助$",
                    fnc: 'help'
                }
            ]
        })
    };

    // 我也不知道为什么我这样写
    async help(e) {
        let msg = `崩坏3往事乐土攻略帮助`
        msg = msg + `\n图片来源：米游社@催稿型光芒子`
        msg = msg + `\n`
        msg = msg + `\n【#爱莉乐土攻略】 查看爱莉希雅乐土攻略`
        msg = msg + `\n【#乐土攻略更新】 更新乐土攻略图片（首次获取可【#更新乐土攻略ghproxy】使用ghproxy代理`
        e.reply(msg)
        return true
    }
}