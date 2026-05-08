import { useRouterStore } from "@/store/router.store";

export function navigate(to: string) {
  useRouterStore.getState().navigate(to)
}
