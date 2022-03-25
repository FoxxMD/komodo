import { Component, Show } from "solid-js";
import s from "../../deployment.module.css";
import { Deployment } from "@monitor/types";
import { createStore } from "solid-js/store";
import Grid from "../../../util/layout/Grid";
import Image from "./Image";
import { getDeployment } from "../../../../util/query";
import Network from "./Network";
import { TOPBAR_HEIGHT } from "../../../topbar/Topbar";
import Mounts from "./Mounts";
import Env from "./Env";

const Config: Component<{ deployment: Deployment }> = (p) => {
  const [deployment, setDeployment] = createStore<
    Deployment & { loaded: boolean }
  >({ ...p.deployment, loaded: false });
  getDeployment(p.deployment._id!).then((deployment) =>
    setDeployment({ ...deployment, loaded: true })
  );

  return (
    <Show when={deployment.loaded}>
      <Grid
        class={s.Config}
        placeItems="start center"
        style={{ "max-height": `calc(100vh - ${TOPBAR_HEIGHT}px)` }}
      >
        <Image deployment={deployment} setDeployment={setDeployment} />
        <Network deployment={deployment} setDeployment={setDeployment} />
        <Mounts deployment={deployment} setDeployment={setDeployment} />
        <Env deployment={deployment} setDeployment={setDeployment} />
      </Grid>
    </Show>
  );
};

export default Config;
