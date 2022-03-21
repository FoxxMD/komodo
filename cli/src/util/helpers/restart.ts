import { getCoreDeployment } from "../mongoose/deployment";
import { deleteContainer, dockerRun } from "./docker";

export type RestartError = {
	message: string;
	error: string;
}

export async function restart(
  args: { name: string; mongoUrl: string },
  onError: (err: RestartError) => void
) {
  try {
    const deployment = await getCoreDeployment(args);
    if (deployment) {
      try {
        await deleteContainer(deployment.containerName!);
        return await dockerRun(deployment);
      } catch (error) {
        onError({
          message: "failed to restart container",
          error: JSON.stringify(error),
        });
      }
    } else {
      onError({
        message: "could not find deployment at name",
        error: "",
      });
    }
  } catch (error) {
    onError({
      message: "failed to connect to mongo at url",
      error: JSON.stringify(error),
    });
  }
}