import { User } from "@monitor/types";
import { deleteContainer, dockerRun, DEPLOY, prettyStringify } from "@monitor/util";
import { FastifyInstance } from "fastify";
import { join } from "path";
import { DEPLOYMENT_REPO_PATH, PERMISSIONS_DENY_LOG, SECRETS, SYSROOT } from "../../config";
import { DEPLOYING } from "../../plugins/actionStates";
import { deletePeripheryContainer } from "../../util/periphery/container";
import { deployPeriphery } from "../../util/periphery/deploy";
import { addDeploymentUpdate } from "../../util/updates";

async function deployDeployment(
  app: FastifyInstance,
  user: User,
  { deploymentID, note }: { deploymentID: string; note?: string }
) {
  const deployment = await app.deployments.findById(deploymentID);
  if (!deployment) return;
  if (user.permissions! < 2 && !deployment.owners.includes(user.username)) {
    addDeploymentUpdate(
      app,
      deploymentID,
      DEPLOY,
      "Deploy (DENIED)",
      PERMISSIONS_DENY_LOG,
      user.username,
      note,
      true
    );
    return;
  }
  if (app.deployActionStates.get(deploymentID, DEPLOYING)) return;
  app.deployActionStates.set(deploymentID, DEPLOYING, true);
  app.broadcast(DEPLOY, { complete: false, deploymentID });
  try {
    const server =
      deployment.serverID === app.core._id
        ? undefined
        : await app.servers.findById(deployment.serverID!);
    if (server) {
      // delete the container on periphery
      await deletePeripheryContainer(server, deployment.containerName!);
    } else {
      // delete the container on core
      await deleteContainer(deployment.containerName!);
    }
    const build = deployment.buildID
      ? await app.builds.findById(deployment.buildID)
      : undefined;
    const image =
      build && build.dockerBuildArgs
        ? join(build.dockerAccount || "", build.pullName!)
        : undefined;
    const containerMount =
      deployment.repo && deployment.containerMount
        ? {
            repoFolder: DEPLOYMENT_REPO_PATH,
            containerMount: deployment.containerMount,
          }
        : undefined;
    const { command, log, isError } = server
      ? await deployPeriphery(server, deployment, image)
      : await dockerRun(
          {
            ...deployment,
            image: image ? image : deployment.image,
          },
          SYSROOT,
          containerMount,
          deployment.dockerAccount,
          deployment.dockerAccount &&
            SECRETS.DOCKER_ACCOUNTS[deployment.dockerAccount]
        );
    addDeploymentUpdate(
      app,
      deploymentID,
      DEPLOY,
      command,
      log,
      user.username,
      note,
      isError
    );
  } catch (error) {
    addDeploymentUpdate(
      app,
      deploymentID,
      DEPLOY,
      "Deploy (ERROR)",
      { stderr: prettyStringify(error) },
      user.username,
      note,
      true
    );
  }
  app.broadcast(DEPLOY, { complete: true, deploymentID });
  app.deployActionStates.set(deploymentID, DEPLOYING, false);
}

export default deployDeployment;
