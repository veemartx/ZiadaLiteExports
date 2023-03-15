<script>
    import { onMount } from "svelte";
    import { Route, Router } from "svelte-navigator";
    import Loader from "../components/Loader.svelte";
    import BranchRanking from "../components/pdf/BranchRanking.svelte";
    import Inventory from "../components/pdf/Inventory.svelte";
    import Leaderboard from "../components/pdf/Leaderboard.svelte";
    import RegionRanking from "../components/pdf/RegionRanking.svelte";
    import UsersList from "../components/UsersList.svelte";

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
    </Router>
</main>

<style>
</style>
