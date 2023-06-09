const plays = {
  "hamlet": { "name": "Hamlet", "type": "tragedy" },
  "as-like": { "name": "As You Like It", "type": "comedy" },
  "othello": { "name": "Othello", "type": "tragedy" }
}
module.exports = function statement(invoice, plays) {
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  return renderPlanText(statementData, plays)
}
function renderPlanText(data, plays) {
  let result = `Statement for ${data.customer}\n`;
  for (let perf of data.performances) {
    // 打印行此订单
    result += ` ${perf.play.name}: ${format(perf.amount / 100)} (${perf.audience} seats)\n`;
  } 
  result += `Amount owed is ${format(totalAmount(data) / 100)}\n`;
  result += `You earned ${ totalVolumeCredits(data)} credits \n`;
  function totalAmount(data) {
    return data.performances
    .reduce((total, p) => total + p.amount, 0);
  }
  function totalVolumeCredits(data) {
    return data.performances
    .reduce((total, p) => total + p.volumeCredits, 0);
  }
  return result;
}
function enrichPerformance(aPerformance) {
  const result = Object.assign({}, aPerformance);
  result.play = playFor(result);
  result.amount = amountFor(result);
  result.volumeCredits = volumeCreditsFor(result);
  return result;

}
function playFor(aper) {
  return plays[aper.playID]
}
function amountFor(perf) {
  let result = 0;
  switch (perf.play.type) {
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
      throw new Error(`unknown type: ${perf.play.type}`);
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
  if ("comedy" === aPerformance.play.type)
    result += Math.floor(aPerformance.audience / 5);
  return result;
}