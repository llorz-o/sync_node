## 安装docker

其实根目录下有`docker`的安装脚本

[linux install docker](https://docs.docker.com/engine/install/ubuntu/#install-using-the-convenience-script)

这种方法是比较简单容易安装一些的,可以使用`--dry-run`学习什么步骤脚本会执行当你引用脚本时

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh ./get-docker.sh --dry-run
# 最终执行
sudo sh ./get-docker.sh
```

## 安装 nimmis/resilio_sync

```bash
docker pull nimmis/resilio-sync
docker run -d -v /root/resilio:/data -e RSLSYNC_USER=joe -e RSLSYNC_PASS=zlc725361 --name sync -p 8888:8888 -p 33333:33333 nimmis/resilio-sync
```

## 安装 nvm

[readme NVM](https://github.com/nvm-sh/nvm#installing-and-updating)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
# or
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```

写入`.bashrc`source

```bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

安装nodejs

```bash
nvm -v
nvm install --lts
```

## 安装全局包


### FAQ: `GLIBC_2.28' not found

```bash
sudo apt-get remove nodejs
nvm install 16.15.1
```

```bash
npm install nodemon -g
npm install http-server -g
npm install pm2 -g
```

## sync_nodes

```bash
cd ~
mkdir work
cd work
git clone https://github.com/llorz-o/sync_node.git
cd sync_node/bootstrap
cp launch.sh git_pull_sync_node.sh unzip_sync.infinityweb.info.sh ~
```

## 修改nginx配置

```bash
cd /etc/nginx/conf.d/domains
cat /root/work/sync_node/bootstrap/sync.infinityweb.info.conf >> sync.infinityweb.info.conf
cat /root/work/sync_node/bootstrap/sync.infinityweb.info.ssl.conf >> sync.infinityweb.info.ssl.conf
```

## 启动服务

上传页面静态文件并执行`sh ~/unzip_sync.infinityweb.info.sh`

```bash
sh ~/launch.sh
```
