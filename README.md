基于SocketIO的即时聊天室
================

花了一天写出来的小DEMO，后续进行了小的修补，希望能够对你有所帮助 :-)

### 目录结构/文件说明

```
.
├── app.js // Server端脚本
├── index.html
├── js //Javascript目录
│   ├── client_config.js // 客户端配置文件，包含Server端协议、地址和端口的配置信息
│   ├── index.js // 客户端Javascript脚本
│   └── lib // 第三方资源
│       ├── bootstrap.min.js
│       ├── jquery-1.11.0.min.js
│       ├── mustache.js
│       ├── socket.io.min.js
│       └── underscore-min.js
├── LICENSE
├── package.json
├── README.md
└── style // 样式
    ├── index.css // 客户端样式
        └── lib // 第三方资源
                └── bootstrap.min.css
```

### 使用说明

- 克隆代码至一个HTTP Server中，执行命令`$npm install`

- 执行命令`$ node app.js`，开启Server端Socket服务，默认端口为`9000`

- 修改`/js/client_config.js`文件对应的客户端配置信息

### 前端兼容性

系统环境：Windows 7 SP1 X64

**Chrome 34.0.1847.131 m**

正常

**Firefox**

正常

**IE11**

正常
