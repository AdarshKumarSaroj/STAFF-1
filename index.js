const express = require("express");
const http = require("http");
const mineflayer = require('mineflayer')
const pvp = require('mineflayer-pvp').plugin
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const armorManager = require('mineflayer-armor-manager')
const mc = require('minecraft-protocol');
const AutoAuth = require('mineflayer-auto-auth');
const keep_alive = require('./keep_alive.js')

const app = express();



app.use(express.json());


// U CAN ONLY EDIT THIS SECTION!!
function createBot() {
  const bot = mineflayer.createBot({
    host: 'Adrsihya__SMP.aternos.me',
    version: false, // U can replace with 1.16.5 for example, remember to use ', = '1.16.5'
    username: 'AFK',
    port: 13981,
    plugins: [AutoAuth],
    AutoAuth: 'ilovemyself'
  })
  /// DONT TOUCH ANYTHING MORE!
  bot.loadPlugin(pvp)
  bot.loadPlugin(armorManager)
  bot.loadPlugin(pathfinder)


  bot.on('playerCollect', (collector, itemDrop) => {
    if (collector !== bot.entity) return

    setTimeout(() => {
      const sword = bot.inventory.items().find(item => item.name.includes('sword'))
      if (sword) bot.equip(sword, 'hand')
    }, 150)
  })

  bot.on('playerCollect', (collector, itemDrop) => {
    if (collector !== bot.entity) return

    setTimeout(() => {
      const shield = bot.inventory.items().find(item => item.name.includes('shield'))
      if (shield) bot.equip(shield, 'off-hand')
    }, 250)
  })

  let guardPos = null

  function guardArea(pos) {
    guardPos = pos.clone()

    if (!bot.pvp.target) {
      moveToGuardPos()
    }
  }

  function stopGuarding() {
    guardPos = null
    bot.pvp.stop()
    bot.pathfinder.setGoal(null)
  }

  function moveToGuardPos() {
    const mcData = require('minecraft-data')(bot.version)
    bot.pathfinder.setMovements(new Movements(bot, mcData))
    bot.pathfinder.setGoal(new goals.GoalBlock(guardPos.x, guardPos.y, guardPos.z))
  }

  bot.on('stoppedAttacking', () => {
    if (guardPos) {
      moveToGuardPos()
    }
  })

  bot.on('physicTick', () => {
    if (bot.pvp.target) return
    if (bot.pathfinder.isMoving()) return

    const entity = bot.nearestEntity()
    if (entity) bot.lookAt(entity.position.offset(0, entity.height, 0))
  })
  bot.on('physicTick', () => {
    if (!guardPos) return
    const filter = e => e.type === 'mob' && e.position.distanceTo(bot.entity.position) < 16 &&
      e.mobType !== 'Armor Stand'
    const entity = bot.nearestEntity(filter)
    if (entity) {
      bot.pvp.attack(entity)
    }
  })
  bot.on('chat', (username, message) => {
    if (message === 'guard') {
      const player = bot.players[username]

      if (!player) {
        bot.chat('I will!')
        guardArea(player.entity.position)
      }

    }
    if (message === 'ishan.') {
      bot.chat('oye ishan teri maa ki chut maru bhen ke lode teri maa he chod dunga ')
      stopGuarding()
    }
    if (message === 'aakash.') {
      bot.chat('akash bhen ke lode randi Sale gand me Dam hai tere CHutiye Sale MC ')
      stopGuarding()
    }
    if (message === '@aakash') {
      bot.chat('4 chavani Ghode pe Aakash mere lode peeee ')
      bot.chat('Kyu Aakash ji Bheto ge naa')
      stopGuarding()
    }

    if (message === 'vansh.') {
      bot.chat('oye vansh sale jhaat ke baabl randi Sale Notxvansh vo XXX kr du tere sath Bta ')
      bot.chat('bol Randi bol ')
      stopGuarding()
    }
  })

  bot.on('kicked', console.log)
  bot.on('error', console.log)
  bot.on('end', createBot)
}

createBot()

//// Rembember to sucribe to my channels!
/// www.youtube.com/c/D
///www.youtube.com/channel/UC1SR0lQSDfdaSMhmUiaMitg
