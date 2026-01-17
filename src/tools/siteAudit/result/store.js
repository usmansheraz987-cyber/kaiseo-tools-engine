const resultStore = new Map();

export function saveResult(auditId, data) {
  resultStore.set(auditId, data);
}

export function getResult(auditId) {
  return resultStore.get(auditId) || null;
}
