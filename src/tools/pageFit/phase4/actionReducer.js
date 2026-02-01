// src/tools/pageFit/phase4/actionReducer.js

/*
 Action Reducer
 --------------
 Limits execution plan to what humans can actually do.
*/

export default function reduceActions(actions, max = 5) {
  const highImpact = actions.filter(a => a.impact === "high");
  const mediumImpact = actions.filter(a => a.impact === "medium");

  let reduced = [...highImpact];

  if (reduced.length < max) {
    reduced = reduced.concat(
      mediumImpact.slice(0, max - reduced.length)
    );
  }

  return reduced.slice(0, max);
}
