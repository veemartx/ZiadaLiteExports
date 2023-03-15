<script>
  import { onMount } from "svelte";
  import { Router, Route } from "svelte-navigator";
  import Loader from "./components/Loader.svelte";
  import Pdf from "./routes/Pdf.svelte";
  import Xlxs from "./routes/Xlxs.svelte";

  let showLoader = true;

  onMount(() => {});
</script>

<main>
  <Router>
    <Route path="/">
      <Loader />
    </Route>

    <Route path="/">
      <Loader />
    </Route>

    <Route path="/pdf/*">
      <Pdf />
    </Route>

    <Route path="/xlsx/*">
      <Xlxs />
    </Route>
  </Router>
</main>

<style>
</style>
