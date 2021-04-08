function getBucketsOfScores(scores) {
  const scoresMap = {};
  scoresMap["Poor"] = 0;
  scoresMap["Fair"] = 0;
  scoresMap["Good"] = 0;
  scoresMap["Excellent"] = 0;
  scoresMap["Elite"] = 0;
  for (let i = 0; i < scores.length; i++) {
    const currScore = scores[i];
    if (currScore < 600) {
      scoresMap["Poor"] += 1;
    } else if (currScore > 599 && currScore < 700) {
      scoresMap["Fair"] += 1;
    } else if (currScore > 699 && currScore < 750) {
      scoresMap["Good"] += 1;
    } else if (currScore > 749 && currScore < 800) {
      scoresMap["Excellent"] += 1;
    } else if (currScore > 799) {
      scoresMap["Elite"] += 1;
    }
  }

  const total =
    scoresMap["Poor"] +
    scoresMap["Fair"] +
    scoresMap["Good"] +
    scoresMap["Excellent"] +
    scoresMap["Elite"];

  let result = [];

  for (let i = 0; i < Object.keys(scoresMap).length; i++) {
    if (scoresMap["Poor"] > 0) {
      result += "Poor: " + ((scoresMap["Poor"] / total) * 100).toFixed(2);
    } else if (scoresMap["Fair"] > 0) {
      result += "Fair: " + ((scoresMap["Fair"] / total) * 100).toFixed(2);
    } else if (scoresMap["Good"] > 0) {
      result += "Good: " + ((scoresMap["Good"] / total) * 100).toFixed(2);
    } else if (scoresMap["Excellent"] > 0) {
      result +=
        "Excellent: " + ((scoresMap["Excellent"] / total) * 100).toFixed(2);
    } else if (scoresMap["Elite"] > 0) {
      result +=
        "Excellent: " + ((scoresMap["Excellent"] / total) * 100).toFixed(2);
    }
  }

  return result;
}

function test() {
  const scores = [330, 723, 730, 825];
  console.log(getBucketsOfScores(scores));
}
