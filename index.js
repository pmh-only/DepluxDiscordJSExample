const express = require('express')
const { Client } = require('discord.js')

const CONFIG = require('./config.json')

const app = express()
const bot = new Client()
const count = {}

bot.login(CONFIG.token)

bot.on('ready', () => bot.user.setActivity('Hosting on Deplux (https://deplux.io)'))
bot.on('message', (msg) => {
  if (msg.author.bot) return

  count[msg.author.id] = (count[msg.author.id] || 0) + 1

  if (count[msg.author.id] % 100) return
  msg.channel.send('<@' + msg.author.id + '>님이 ' + count[msg.author.id] + '번째 메시지를 달성하셨습니다!')
})

app.use(async (_, res) => {
  let str = ''
  for (const id of Object.keys(count)) {
    const user = await bot.users.fetch(id)
    str += '<br />' + user.username + ': ' + count[id] + ' 메시지'
  }

  res
    .set('Content-Type', 'text/html; charset=UTF-8')
    .send(str)
})

app.listen(80)
