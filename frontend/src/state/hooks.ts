import { Collection } from "@monitor/types";
import { createResource } from "solid-js";
import { getBuilds, getDeployments, getServers, getUpdates } from "../util/query";
import { State } from "./StateProvider";

export function useWs(state: State) {
  const ws = new WebSocket("");



  return ws;
}

export function useServers() {
	return useCollection(getServers);
}

export function useBuilds() {
  return useCollection(getBuilds)
}

export function useDeployments() {
  return useCollection(getDeployments)
}

export function useUpdates() {
	const [collection, { refetch }] = createResource(getUpdates);
	return {
		collection,
		refetch
	}
}

export function useCollection<T>(query: () => Promise<Collection<T>>) {
  const [collection, { mutate, refetch }] = createResource(query);
  const update = (item: T[keyof T] & { _id?: string }) => {
    mutate((collection: any) => ({ ...collection, [item._id!]: item }))
  }
  return {
    collection,
    refetch,
    mutate,
    update
  }
}