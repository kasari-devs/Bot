const Telegraf = require ('telegraf');
const axios = require('axios');
const bot = new Telegraf('bot key here');
const apikey = "API key here";
bot.command('start', ctx => {
  sendStartMessage(ctx);
})

bot.action('start', ctx => {
  ctx.deleteMessage();
  sendStartMessage(ctx);
})

function sendStartMessage (ctx) {
  let startMessage = `welcome! get your crypto information here`;
  bot.telegram.sendMessage(ctx.chat.id, startMessage,
    {
       reply_markup: {
         inline_keyboard: [
           [
             {text: "crypto prices", callback_data: 'price'}
           ],
           [
             {text: "coinMarketCap", url: 'https://coinmarketcap.com/'}
           ]
         ]
       }
    })
}

bot.action ('price', ctx => {
  let priceMessage = `Get price information, select one of the cryptos below`;
  ctx.deleteMessage();
  bot.telegram.sendMessage(ctx.chat.id, priceMessage, {
    reply_markup: {
      inline_keyboard: [
        [
          {text: "BTC", callback_data: 'price-BTC'},
          {text: "ETH", callback_data: 'price-ETH'}
        ],
        [
          {text: "BTH", callback_data: 'price-BTH'},
          {text: "LTC", callback_data: 'price-LTC'}
        ],
        [
          {text: "Back to menu", callback_data: 'start'}
        ]
      ]
    }
  })
})
let priceActionList = ['price-BTC', 'price-ETH', 'price-BTH', 'price-LTC'];
bot.action(priceActionList, async ctx => {
  //"match" contains the item clicked content e.g. price-BTC. we get only the crypto icon with below method
  let symbol = ctx.match.split('-')[1];
  console.log(symbol);
  try {
    let res = await axios.get(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbol}&tsyms=USD&api_key=${apikey} `)
    let data = res.data.DISPLAY[symbol].USD
    console.log(data);
    let message =
      `
        symbol: ${symbol}
        price: ${data.PRICE}
        open: ${data.OPENDAY}
        high: ${data.HIGHDAY}
        low: ${data.LOWDAY}
        supply: ${data.SUPPLY}
        market cap: ${data.MKTCAP}
      `;
      ctx.deleteMessage();
      bot.telegram.sendMessage(ctx.chat.id, message, {
        reply_markup: {
          inline_keyboard: [
            [
              {text:'Back to price', callback_data:'price'}
            ]
          ]
        }
      })
  } catch (err){
    console.log(err);
    ctx.reply('Error Encountered');
  }
})
bot.command('info', ctx => {
  bot.telegram.sendMessage(ctx.chat.id, "Bot info", {
    reply_markup: {
      keyboard: [
        [
          {text: "Credits"},
          {text: "API"}
        ]
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  })
})
bot.hears('Credits', ctx => {
  ctx.reply('this bot was made by user')
})
bot.hears('API', ctx => {
  ctx.reply('this bot usees cryptocompare')
})
bot.launch();
