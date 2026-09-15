export const triggerStateUpdate = () => {
  window.dispatchEvent(new Event('shksc_state_changed'));
};
