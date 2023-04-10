const plays = {
  "hamlet": { "name": "Hamlet", "type": "tragedy" },
  "as-like": { "name": "As You Like It", "type": "comedy" },
  "othello": { "name": "Othello", "type": "tragedy" }
}
module.exports = function statement(invoice, plays) {
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances
  return renderPlanText(statementData,invoice, plays)
}
function renderPlanText(data,invoice, plays) {
  let result = `Statement for ${invoice.customer}\n`;
  for (let perf of invoice.performances) {
    // 打印行此订单
    result += ` ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${perf.audience} seats)\n`;
  } 
  result += `Amount owed is ${format(totalAmount(invoice) / 100)}\n`;
  result += `You earned ${ totalVolumeCredits(invoice)} credits \n`;
  return result;
}
function playFor(aper) {
  return plays[aper.playID]
}
function totalAmount(invoice) {
   let result = 0;
  for (let perf of invoice.performances) {
    // 打印行此订单
    result += amountFor(perf);
  } 
  return result
}
function totalVolumeCredits(invoice) {
  let result = 0;
  for (let perf of invoice.performances) {
    // 添加数量积分
    result += volumeCreditsFor(perf);
  }
  return result
}
function amountFor(perf) {
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

function format(aNumber) {
  return new Intl.NumberFormat("en-US",
    {
      style: "currency", currency: "USD",
      minimumFractionDigits: 2
    }).format(aNumber);
}
  

function volumeCreditsFor(aPerformance) {
  let result = 0;
  result += Math.max(aPerformance.audience - 30, 0);
   // 每十名喜剧参与者增加额外积分分
  if ("comedy" === playFor(aPerformance).type)
    result += Math.floor(aPerformance.audience / 5);
  return result;
}