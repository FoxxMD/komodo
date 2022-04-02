import { Component, For, onCleanup, Show } from "solid-js";
import { ADD_UPDATE } from "../../state/actions";
import { useArray } from "../../state/hooks";
import { useAppState } from "../../state/StateProvider";
import { getUpdates } from "../../util/query";
import Update from "../update/Update";
import Grid from "../util/layout/Grid";

const Updates: Component<{}> = (p) => {
  const { ws, selected } = useAppState();
  const selectedUpdates = useArray(() =>
    getUpdates({ buildID: selected.id() })
  );
  const unsub = ws.subscribe([ADD_UPDATE], ({ update }) => {
    if (update.buildID === selected.id()) {
      selectedUpdates.add(update);
    }
  });
  onCleanup(unsub);
  return (
    <Show
      when={
        selectedUpdates.loaded() &&
        (selectedUpdates.collection()?.length || 0) > 0
      }
    >
      <Grid class="card shadow">
        <h1>updates</h1>
        <Grid class="updates-container scroller">
          <For each={selectedUpdates.collection()}>
            {(update) => <Update update={update} showName={false} />}
          </For>
        </Grid>
      </Grid>
    </Show>
  );
};

export default Updates;