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
# 然后到 http://npm.hz.netease.com/package/ne-build 同步，以保证npm.hz可用
$ npm publish
```