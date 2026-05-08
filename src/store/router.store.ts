import { create } from 'zustand'

interface RouteState {
  pathname: string;
  navigate: (to: string) => void;
}

export const useRouterStore = create<RouteState>((set, get) => ({
  pathname: window.location.pathname,

  navigate: (to: string) => {
    window.history.pushState(null, '', to)
    set({ ...get(), pathname: to })
  },
}))

window.addEventListener('popstate', () => {
  const currentState = useRouterStore.getState()
  useRouterStore.setState({ ...currentState, pathname: window.location.pathname})
})