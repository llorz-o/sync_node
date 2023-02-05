import {fileURLToPath} from "url";
// CommonJs
import Fastify from 'fastify'
import * as fileType from 'file-type'
import fs from 'fs'
import path from 'path'

console.log(`
这个服务是用于获取本地静态文件夹结构数据，从而传输给前端 sync_web 服务
`)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

const fastify = Fastify({
    logger: true
})

const isWin = process.platform.startsWith('win')
const dir = isWin ? 'C:\\Users\\17517\\OneDrive\\图片' : '~/home/joe'

console.log(__dirname)
console.log(__filename)

const handErr = err => console.error(err)
const resolvePath = (_path, file) => path.resolve(_path, file)
const cache = {root: dir}

const readDir = (_dir, isRoot) => {
    fs.readdir(_dir, (err, dirs) => {
        if (err) return handErr(err)
        dirs.forEach(file => {
            const filePath = resolvePath(_dir, file)
            const relativePath = filePath.replace(dir, '')
            fs.lstat(filePath, async (err, stat) => {
                if (err) return handErr(err)
                // 是文件
                if (stat.isFile()) {
                    const memo = await fileType.fileTypeFromFile(filePath)
                    if (cache[isRoot ? 'dirs' : _dir]) {
                        cache[isRoot ? 'dirs' : _dir].push({
                            fileName: file,
                            filePath,
                            relativePath,
                            isFile: true,
                            memo
                        })
                    } else {
                        cache[isRoot ? 'dirs' : _dir] = [{
                            fileName: file,
                            filePath,
                            relativePath,
                            isFile: true,
                            stat
                        }]
                    }
                }
                if (stat.isDirectory()) {
                    if (cache[isRoot ? 'dirs' : _dir]) {
                        cache[isRoot ? 'dirs' : _dir].push({
                            fileName: file,
                            filePath,
                            relativePath,
                            isDir: true
                        })
                    } else {
                        cache[isRoot ? 'dirs' : _dir] = [{
                            fileName: file,
                            filePath,
                            relativePath,
                            isDir: true
                        }]
                    }
                    readDir(filePath)
                }
            })
        })

    })
}

readDir(dir, true)


// Declare a route
fastify.get('/', (request, reply) => {
    reply.send(cache)
})


setTimeout(() => {
    // Run the server!
    fastify.listen({port: 3000}, (err, address) => {
        if (err) return handErr(err)
        // Server is now listening on ${address}
    })
}, 2000)

export {}
