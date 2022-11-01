# 备忘

### 发布

```bash
# 发布至 g.hz.netease.com ，用于同步源码仓库。
# 源码仓库地址： https://g.hz.netease.com/f2e/component/ne-build
$ git push -u origin master

# 发布至 github ，用于同步npm主页地址。
# github地址： https://github.com/NyPhile/ne-build
$ git push -u github master

# 修改版本号，发布至 npm：https://www.npmjs.com/package/ne-build ，之后可使用 npx 执行。
# 杭研npm使用ne-web scope发布: @ne-web/ne-build
$ npm publish

# 拉取代码 
# 拉取origin合并到master
$ git pull origin master
# 不合并
$ git fetch origin master
```