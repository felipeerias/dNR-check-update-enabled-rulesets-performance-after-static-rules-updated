var NUM_RULES = 20000;

function getAverageAfterRemovingOutliers(arr) {
  const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;
  let avg = average(arr);
  let std = Math.sqrt(
    arr.map((v) => Math.pow(v - avg, 2)).reduce((p, c) => p + c, 0) /
      (arr.length - 1)
  );
  let max_limit = avg + 3 * std;
  let min_limit = avg - 3 * std;
  return average(arr.filter((v) => v <= max_limit && v >= min_limit));
}

function disableRulesetAndCheckUpdateEnabledRulesetsPerformance(resolve) {
  chrome.declarativeNetRequest.updateEnabledRulesets(
      { disableRulesetIds: [ 'ruleset' ] }, checkUpdateEnabledRulesetsPerformance);
}

function checkUpdateEnabledRulesetsPerformance(resolve) {
  var start = performance.now();
  chrome.declarativeNetRequest.updateEnabledRulesets(
      { enableRulesetIds: [ 'ruleset' ] },
      (result) => {
        let perf = performance.now() - start;
        let disabled_rules_count = test_context.disabled_rules_count_list[test_context.index];
        //console.error('Result with ' + disabled_rules_count + ' disabled rules: ' + perf);
        test_context.results[test_context.index].push(perf);

        if (test_context.iteration >= 100) {
          test_context.index += 1;
          new Promise(startTest);
        } else {
          test_context.iteration += 1;
          new Promise(disableRulesetAndCheckUpdateEnabledRulesetsPerformance);
        }
      });
}

function startTest(resolve) {
  if (test_context.index >= test_context.disabled_rules_count_list.length) {
    console.error('Test finished');
    for (const [i, perfs] of Object.entries(test_context.results)) {
      console.error("Result for " + test_context.disabled_rules_count_list[i] + ": " +
                    getAverageAfterRemovingOutliers(perfs));
    }
    //for (const [i, perfs] of Object.entries(test_context.results)) {
    //  console.error(test_context.disabled_rules_count_list[i] + ": " +
    //                JSON.stringify(Array.from(perfs, perf => perf.toFixed(2))));
    //}
  } else {
    let disabled_rules_count = test_context.disabled_rules_count_list[test_context.index];
    test_context.results[test_context.index] = [];
    test_context.iteration = 0;
    let option = {
      rulesetId: 'ruleset',
      disableRuleIds: [],
      enableRuleIds: []
    };

    if (disabled_rules_count == 0) {
      option.enableRuleIds = Array.from({ length: NUM_RULES }, (_, i) => i + 1);
      console.error('Enable all rules');
    } else {
      option.disableRuleIds = Array.from({length: disabled_rules_count}, (_, i) => i + 10001);
      console.error('Disable ' + disabled_rules_count + ' rules');
    }

    chrome.declarativeNetRequest.updateStaticRules(option, disableRulesetAndCheckUpdateEnabledRulesetsPerformance);
  }
}

var test_context = {
  index: 0,
  iteration: 0,
  disabled_rules_count_list:
    Array.from({ length: Math.floor(NUM_RULES / 1000 + 1) }, (_, i) => i * 1000),
  results: {},
};

console.error('Start test');

new Promise(startTest);
