import { Component, createSignal } from "solid-js";
import { useAppState } from "../../state/StateProvider";
import { combineClasses, inPx } from "../../util/helpers";
import Icon from "../util/Icon";
import Flex from "../util/layout/Flex";
import Menu from "../util/menu/Menu";
import Account from "./Account";
import s from "./topbar.module.scss";
import Updates from "./Updates";

export const TOPBAR_HEIGHT = 40;

const Topbar: Component = () => {
  const { sidebar } = useAppState();
  const [menu, setMenu] = createSignal<"updates" | "account">();
  const close = () => setMenu(undefined);
  return (
    <Flex
      class={combineClasses(s.Topbar, "shadow")}
      justifyContent="space-between"
      alignItems="center"
      style={{ height: inPx(TOPBAR_HEIGHT) }}
    >
      {/* right side */}
      <Flex alignItems="center" style={{ padding: "0rem 0.5rem" }}>
        <button onClick={sidebar.toggle}>
          <Icon type="menu" width="1.5rem" />
        </button>
        <div class={s.Monitor}>monitor</div>
      </Flex>
      {/* left side */}
      <Flex gap="0.5rem" alignItems="center" style={{ padding: "0rem 0.5rem" }}>
        <Menu
          show={menu() === "updates"}
          close={close}
          target={
            <button
              onClick={() =>
                menu() === "updates" ? setMenu(undefined) : setMenu("updates")
              }
            >
              <Icon type="notifications" alt="updates" width="1.5rem" />
            </button>
          }
          content={<Updates />}
          position="bottom right"
        />
        <Menu
          show={menu() === "account"}
          close={close}
          target={
            <button
              onClick={() =>
                menu() === "account" ? setMenu(undefined) : setMenu("account")
              }
            >
              <Icon type="user" alt="account" width="1.5rem" />
            </button>
          }
          content={<Account close={close} />}
          position="bottom right"
        />
      </Flex>
    </Flex>
  );
};

export default Topbar;
