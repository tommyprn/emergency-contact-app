import {create} from 'zustand';

type SOSState = {
  isActive: boolean;
  startedAt?: number;
  setActive: (val: boolean) => void;
};

export const useSOSStore = create<SOSState>(set => ({
  isActive: false,
  startedAt: undefined,
  setActive: val =>
    set(state => ({isActive: val, startedAt: val ? Date.now() : undefined})),
}));
