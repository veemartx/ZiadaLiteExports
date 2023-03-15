<script>
    // @ts-nocheck

    import { onMount } from "svelte";
    import axios from "axios";
    import { apiBaseUrl, sharedBaseUrl } from "../../config/config";
    import { read, utils, writeFileXLSX } from "xlsx";
    import Loader from "../Loader.svelte";
    import { useParams } from "svelte-navigator";

    import { useLocation } from "svelte-navigator";

    const location = useLocation();

    let currentDate = new Date();
    let timestamp = currentDate.getTime();

    let type, branch, from, to;

    let qs;

    $: {
        qs = $location.search;
        getParamsFromQs(qs);
    }

    function getParamsFromQs(qs) {
        const urlSearchParams = new URLSearchParams(qs);
        const params = Object.fromEntries(urlSearchParams.entries());
        type = params.type || "";
        branch = params.branch || "";

        from = params.from || "";
        to = params.to || "";
    }

    let users = [];

    const getLeaderboard = async () => {
        let dt = {
            dateFrom: from,
            dateTo: to,
            type: type,
            branch: branch,
        };

        console.log(dt);

        try {
            let response = await axios({
                method: "post",
                url: `${sharedBaseUrl}getLeaderboard.php`,
                data: dt,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            // console.log(response);

            users = response.data;

            generateExcel();
        } catch (err) {
            console.log(err);
        }
    };

    const generateExcel = () => {
        // console.log(users);
        const ws = utils.json_to_sheet(users);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Data");
        writeFileXLSX(wb, `Leaderboard_${timestamp}.xlsx`);
    };

    onMount(async () => {
        getLeaderboard();
    });
</script>

<main>
    <Loader />
</main>
