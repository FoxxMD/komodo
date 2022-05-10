import { CommandLogError, SystemStats } from "@monitor/types";
import { Component, createEffect, createSignal, Show } from "solid-js";
import { pushNotification } from "../../..";
import { useAppState } from "../../../state/StateProvider";
import { useTheme } from "../../../state/ThemeProvider";
import { combineClasses } from "../../../util/helpers";
import { getServerStats, getServerSystemStats } from "../../../util/query";
import Button from "../../util/Button";
import Icon from "../../util/Icon";
import Flex from "../../util/layout/Flex";
import Grid from "../../util/layout/Grid";
import Loading from "../../util/loading/Loading";
import s from "./stats.module.scss";

const Stats: Component<{}> = (p) => {
  const { selected } = useAppState();
  const [log, setLog] = createSignal<CommandLogError>();
  const [refreshing, setRefreshing] = createSignal(false);
  const load = () => {
    if (selected.id()) {
      getServerStats(selected.id()).then(setLog);
    }
  };
  createEffect(load);
  const [sysStats, setSysStats] = createSignal<SystemStats>();
  const [refreshingStats, setRefreshingStats] = createSignal(false);
  const loadStats = () => {
    if (selected.id()) {
      getServerSystemStats(selected.id()).then(setSysStats);
    }
  };
  createEffect(loadStats);
  const { themeClass } = useTheme();
  return (
    <Grid
      placeItems="start center"
      style={{ overflow: "scroll", height: "fit-content" }}
    >
      <Show when={sysStats()}>
        <Flex alignItems="center" style={{ height: "fit-content" }}>
          <h2>cpu: {sysStats()!.cpu}%</h2>
          <h2>mem: {sysStats()!.mem.usedMemPercentage}%</h2>
          <h2>disk: {sysStats()!.disk.usedPercentage}%</h2>
          <Button
            class="blue"
            style={{ "justify-self": "end" }}
            onClick={async () => {
              setRefreshingStats(true);
              const stats = await getServerSystemStats(selected.id());
              setSysStats(stats);
              setRefreshingStats(false);
              pushNotification("good", "system stats refreshed");
            }}
          >
            <Show when={!refreshingStats()} fallback={<Loading />}>
              <Icon type="refresh" />
            </Show>
          </Button>
        </Flex>
      </Show>
      <Show when={log()} fallback={<Loading type="three-dot" scale={0.8} />}>
        <Grid class={combineClasses(s.StatsContainer, themeClass())}>
          <Button
            class="blue"
            style={{ "justify-self": "end" }}
            onClick={async () => {
              setRefreshing(true);
              const log = await getServerStats(selected.id());
              setLog(log);
              setRefreshing(false);
              pushNotification("good", "stats refreshed");
            }}
          >
            <Show when={!refreshing()} fallback={<Loading />}>
              <Icon type="refresh" />
            </Show>
          </Button>
          <pre class={s.Stats}>{log()!.log.stdout}</pre>
        </Grid>
      </Show>
    </Grid>
  );
};

export default Stats;
