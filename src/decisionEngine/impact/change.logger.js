export function logChange(note) {
  return {
    note,
    loggedAt: new Date().toISOString(),
  };
}
