## 分支管理策略

在实际开发中，我们应该按照几个基本原则进行分支管理：

首先，master分支应该是非常稳定的，也就是仅用来发布新版本，平时不能在上面干活；

那在哪干活呢？干活都在dev分支上，也就是说，dev分支是不稳定的，到某个时候，比如1.0版本发布时，再把dev分支合并到master上，在master分支发布1.0版本；

你和你的小伙伴们每个人都在dev分支上干活，每个人都有自己的分支，时不时地往dev分支上合并就可以了。

## 创建分支
```
git switch -c dev
```

## 删除分支
```
git branch -D dev
```

## 合并分支
```
git merge dev
```
## 推送
```
git push origin master
```

## 拉取
```
git pull origin master
```