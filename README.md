# tower-pomotodo-sync

同步[Tower](https://tower.im/)中的任务到[pomotodo](https://pomotodo.com)

# 实现思路

本项目为服务器端Nodejs程序。

监听tower的webhook，解析出任务后，调用pomotodo的api，添加任务。

# 环境部署

可直接部署在Heroku或自建服务器上。

环境变量：

- TOWER_USERNAME ： 用于过滤Tower中的昵称（不止自己的任务，不添加）
- POMOTODO_TOKEN ：pomotodo Token（高级版功能）

# 使用方法

在Tower中配置webhook，指向本程序的监听地址。例如：

> https://yoursite.com/towerhookhandler



