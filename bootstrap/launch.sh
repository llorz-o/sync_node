# 运行 node_sync 服务器
cd ~ || return
pm2 start ~/work/sync_node/sync_node.sh

# 运行静态文件服务器
pm2 start ~/work/sync_node/resilio_sync_static_server.sh

