import {
  Build,
  BuildActionState,
  Builds,
  ContainerStatus,
  DeployActionState,
  Deployment,
  Deployments,
  Log,
  Network,
  Server,
  Servers,
  Update,
  User,
} from "@monitor/types";
import { client } from "..";
import { generateQuery } from "./helpers";

export async function getUpdates(query?: {
  offset?: number;
  buildID?: string;
  serverID?: string;
  deploymentID?: string;
}) {
  return await client.get<Update[]>("/api/updates" + generateQuery(query));
}

export async function getBuilds() {
  return await client.get<Builds>("/api/builds");
}

export async function getBuild(buildID: string) {
  return await client.get<Build>(`/api/build/${buildID}`);
}

export async function getBuildActionState(buildID: string) {
  return await client.get<BuildActionState>(
    `/api/build/${buildID}/action-state`
  );
}

export async function getDeployments(query?: { serverID?: string }) {
  return await client.get<Deployments>(
    "/api/deployments" + generateQuery(query)
  );
}

export async function getDeployment(deploymentID: string) {
  return await client.get<Deployment>("/api/deployment/" + deploymentID);
}

export async function getDeploymentLog(deploymentID: string, tail?: number) {
  return await client.get<Log>(
    `/api/deployment/${deploymentID}/log${generateQuery({ tail })}`
  );
}

export async function getDeploymentStatus(deploymentID: string) {
  return await client.get<ContainerStatus | "not deployed">(
    `/api/deployment/${deploymentID}/status`
  );
}

export async function getDeploymentActionState(deploymentID: string) {
  return await client.get<DeployActionState>(
    `/api/deployment/${deploymentID}/action-state`
  );
}

export async function getServers() {
  return await client.get<Servers>("/api/servers");
}

export async function getServer(id: string) {
  return await client.get<Server>(`/api/server/${id}`);
}

export async function getNetworks(serverID: string) {
  return await client.get<Network[]>("/api/networks/" + serverID);
}

export async function getGithubAccounts() {
  return await client.get<string[]>("/api/accounts/github");
}

export async function getDockerAccounts() {
  return await client.get<string[]>("/api/accounts/docker");
}

export async function getUsers() {
  return await client.get<User[]>("/api/users");
}

export async function updateUser(body: {
  userID: string;
  permissions?: number;
  enabled?: boolean;
}) {
  return await client.post("/api/user/update", body);
}

export async function deleteUser(id: string) {
  return await client.delete(`/api/user/${id}`);
}
