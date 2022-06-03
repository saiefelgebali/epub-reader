/* @refresh reload */
import { render } from "solid-js/web";

import "./css/styles.css";
import App from "./App";

import "./css/nprogress.css";
import nProgress from "nprogress";

nProgress.configure({ showSpinner: false });

// Render app
render(() => <App />, document.getElementById("root") as HTMLElement);
