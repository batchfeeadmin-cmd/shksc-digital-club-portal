export const triggerStateUpdate = () => {
  window.dispatchEvent(new Event('shksc_state_changed'));
  // Legacy CMS/public components still subscribe to this event name.
  // Dispatch both until all consumers are migrated to the canonical event.
  window.dispatchEvent(new Event('shksc_state_update'));
};
