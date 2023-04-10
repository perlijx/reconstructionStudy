module.exports = function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  const format = new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", minimumFractionDigits: 2
  }).format;
  for (let perf of invoice.performances) {
    let thisAmount =  amountFor(perf, playFor(perf, plays))
    // 添加数量积分
    volumeCredits += Math.max(perf.audience - 30, 0);
    // 每十名喜剧参与者增加额外积分分
    if ("comedy" === playFor(perf, plays).type) volumeCredits += Math.floor(perf.audience / 5);

    // 打印行此订单
    result += ` ${playFor(perf).name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
    totalAmount += thisAmount;
  }

  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits \n`;
  return result;
}
const plays = {
  "hamlet": { "name": "Hamlet", "type": "tragedy" },
  "as-like": { "name": "As You Like It", "type": "comedy" },
  "othello": { "name": "Othello", "type": "tragedy" }
}
function playFor(aper) {
  return plays[aper.playID]
}

function amountFor(perf,play) {
  let result = 0;
  switch (playFor(perf).type) {
    case "tragedy":
      result = 40000;
      if (perf.audience > 30) {
        result += 1000 * (perf.audience - 30);
      }
      break;
    case "comedy":
      result = 30000;
      if (perf.audience > 20) {
        result += 10000 + 500 * (perf.audience - 20);
      }
      result += 300 * perf.audience;
      break;
    default:
      throw new Error(`unknown type: ${playFor(perf).type}`);
  }
  return result
}