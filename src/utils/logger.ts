export const log = (...args: any[]) => {
  if (__DEV__) console.log('[Rasguard]', ...args);
};
