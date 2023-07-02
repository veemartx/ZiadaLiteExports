<script>
    import { onMount } from "svelte";
    import { Route, Router } from "svelte-navigator";
    import Leaderboard from "../components/xlxs/Leaderboard.svelte";
    import Loader from "../components/Loader.svelte";
    import UsersList from "../components/xlxs/UsersList.svelte";
    import BranchRanking from "../components/xlxs/BranchRanking.svelte";
    import RegionRanking from "../components/xlxs/RegionRanking.svelte";
    import Inventory from "../components/xlxs/Inventory.svelte";
    import Deliveries from "../components/xlxs/Deliveries.svelte";

    onMount(() => {});
</script>

<main>
    <Router>
        <Route path="/">
            <Loader />
        </Route>

        <Route path="/users">
            <UsersList />
        </Route>

        <Route path="/leaderboard/*">
            <Leaderboard />
        </Route>

        <Route path="/branch-ranking/*">
            <BranchRanking />
        </Route>

        <Route path="/region-ranking/*">
            <RegionRanking />
        </Route>

        <Route path="/inventory/*">
            <Inventory />
        </Route>

        <Route path="/deliveries/*">
            <Deliveries />
        </Route>
    </Router>
</main>

<style>
</style>
