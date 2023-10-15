import { createServer } from 'http'
import { join } from 'path'
import { promisify } from 'util'
import fs from 'fs'

const readFile = promisify(fs.readFile)

const router = async (request, response) => {
  let filePath = join(process.cwd(), request.url)
  if (filePath.at(filePath.length - 1) == "/") filePath = join(filePath, "index.html")
  console.log(`go to ${filePath}`)
  try {
    const filetype = request.url.split('.')[1]
    if (filetype === 'js') response.writeHead(200, {'Content-Type': 'application/javascript'});
    const content = await readFile(filePath, "utf8")
    response.end(content)
  } catch (e) {
    console.error("error happend:", e)
    response.end("not found")
  }
}
const server = createServer(router)
server.listen(4000, () => { console.log('listening on 4000') })
