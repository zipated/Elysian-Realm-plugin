# Elysian-Realm-plugin

适用于Yunzai([Miao-Yunzai](https://github.com/yoimiya-kokomi/Miao-Yunzai)、[TRSS-Yunzai](https://github.com/TimeRainStarSky/Yunzai))机器人的崩坏3乐土攻略机器人

攻略图来自米游社[月光中心official](https://www.miyoushe.com/bh3/accountCenter/postList?id=5625196)

图片来自[MskTmi/ElysianRealm-Data](https://github.com/MskTmi/ElysianRealm-Data)

目前确定可用功能

<details><summary>#人律乐土攻略<!-- 乐土睡觉攻略 --></summary>

&ensp;&ensp;具体参考[alias.yaml](defSet/alias.yaml)

</details>

<details><summary>#更新/重装乐土攻略(ghproxy) （仅主人可使用</summary>

&ensp;&ensp;ghproxy在未安装或重新安装乐土攻略时可用

&ensp;&ensp;使用例：

&ensp;&ensp;&ensp;- 使用<!-- 代码内提供的 -->ghproxy：

```
#更新乐土攻略ghproxy
```

&ensp;&ensp;&ensp;- 使用自定义的镜像代理地址：

```
#更新乐土攻略https://ghproxy.com/https://github.com
```
</details>

## 安装方法

进入Yunzai根目录

推荐使用git进行安装，方便后续升级，在Yunzai根目录内打开终端执行以下命令

```shell
# 使用 github
git clone --depth=1 https://github.com/zipated/Elysian-Realm-plugin.git ./plugins/Elysian-Realm-plugin

# 使用 gitee
git clone --depth=1 https://gitee.com/zipated/Elysian-Realm-plugin.git ./plugins/Elysian-Realm-plugin
```

启动后使用```#更新乐土攻略```获取攻略图片 (若连接github不顺畅可以用```#更新乐土攻略ghproxy```使用ghproxy代理获取)



## 自行添加别名

修改插件目录下```config/alias.yaml```

乐土角色名对照表参考[ElysianRealm-Data](https://github.com/MskTmi/ElysianRealm-Data)

（应该能用吧（嗯！

--------------------------------------------

<details><summary>感谢：</summary>

[hewang1an/StarRail-plugin](https://github.com/hewang1an/StarRail-plugin) (代码参考)

[MskTmi/ElysianRealm-Data](https://github.com/MskTmi/ElysianRealm-Data) (图片整合)

[MskTmi/Bh3-ElysianRealm-Strategy](https://github.com/MskTmi/Bh3-ElysianRealm-Strategy) （别名参考）

Bilibili [月光中心_official](https://space.bilibili.com/25289147)([米游社](https://www.miyoushe.com/bh3/accountCenter/postList?id=5625196))<!-- 、[光芒子](https://space.bilibili.com/4059724)--> 等参与攻略制作的大佬

<details><summary>Yunzai-Bots</summary>

| [Yunzai-Bot](https://gitee.com/Le-niao/Yunzai-Bot) | Le-niao |
| :----: | :---- |
| [Miao-Yunzai](https://github.com/yoimiya-kokomi/Miao-Yunzai) | yoimiya-kokomi |
| [TRSS-Yunzai](https://github.com/TimeRainStarSky/Yunzai) | TimeRainStarSky |

</details>

</details>