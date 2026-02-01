// src/tools/pageFit/phase4/riskAssessor.js

/*
 Risk Assessor
 -------------
 Labels each action by execution risk.
*/

export default function assessRisk(actions) {
  return actions.map(action => {
    let risk = "safe";

    if (action.source === "phase2") {
      risk = "moderate";
    }

    if (action.source === "phase3") {
      risk = "risky";
    }

    return {
      ...action,
      risk,
    };
  });
}
