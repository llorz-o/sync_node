import {fileURLToPath} from "url";
// CommonJs
import Fastify from 'fastify'
import * as fileType from 'file-type'
import fs from 'fs'
import path from 'path'
import cors from '@fastify/cors'
import md5 from 'md5'

console.log(`
这个服务是用于获取本地静态文件夹结构数据，从而传输给前端 sync_web 服务
`)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

const fastify = Fastify({
    logger: true
})
await fastify.register(cors, {
    origin: "*"
})
// 变量
const isWin = process.platform.startsWith('win')
const dir = isWin ? 'C:\\Users\\17517\\OneDrive\\图片' : '/home/resilio_sync'
// 错误捕获
const handErr = err => console.error(err)
const resolvePath = (_path, file) => path.resolve(_path, file)
// 缓存
const createCache = () => ({staticURL: isWin ? 'http://localhost:3002/' : 'http://infinityweb.info:8001/'})
let cache = {...createCache()}
const hashMapPath = {}

const backslash = new RegExp("\\\\", 'g')

const captureFile = (_fileName) => {
    return (name, ...args) => {
        if (name.startsWith(_fileName)) {
            console.log(...args)
        }
    }
}

const captur01 = captureFile('01')

const readDir = (_dir, isRoot) => {
    fs.readdir(_dir, (err, dirs) => {
        if (err) return handErr(err)
        dirs.forEach((file) => {
            const filePath = resolvePath(_dir, file)
            const relativePath = filePath.replace(dir, '').replace(backslash, '/')
            const hash = md5(filePath)
            const dirHash = md5(_dir)
            const dirName = isRoot ? 'dirs' : dirHash
            hashMapPath[hash] = filePath

            fs.lstat(filePath, async (err, stat) => {
                if (err) return handErr(err)
                // 是文件
                if (file.startsWith('.')) return console.log(`忽略隐藏文件夹::${file}`)
                cache[dirName] = (cache[dirName] || [])
                console.log(cache[dirName] ? cache[dirName].length : cache[dirName], dirName)
                if (stat.isFile()) {
                    const memo = await fileType.fileTypeFromFile(filePath)
                    cache[dirName].push({
                        fileName: file,
                        hash,
                        relativePath,
                        isFile: true,
                        memo
                    })
                } else if (stat.isDirectory()) {
                    cache[dirName].push({
                        fileName: file,
                        hash,
                        relativePath,
                        isDir: true,
                    })
                    readDir(filePath)
                } else {
                    console.log('类型错误:', file)
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

setInterval(() => {
    cache = createCache()
    readDir(dir, true)
}, 10 * 1000)

setTimeout(() => {
    // Run the server!
    fastify.listen({port: 3001, host: "0.0.0.0"}, (err, address) => {
        if (err) return handErr(err)
        // Server is now listening on ${address}
    })
}, 2000)

export {}
