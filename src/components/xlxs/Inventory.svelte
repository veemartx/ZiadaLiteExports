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

    let type, branch, region, afrom, ato, efrom, eto, adf, edf;

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
        region = params.region || "";

        afrom = params.afrom || "";
        ato = params.ato || "";

        efrom = params.efrom || "";
        eto = params.eto || "";

        adf = params.adf || "";
        edf = params.edf || "";
    }

    let inventory = [];

    const getInventory = async () => {
        let dt = {
            aDateFrom: afrom,
            aDateTo: ato,
            eDateFrom: efrom,
            eDateTo: eto,
            region: region,
            type: type,
            branch: branch,
            additionDateFilter: adf,
            expiryDateFilter: edf,
        };

        console.log(dt);

        try {
            let response = await axios({
                method: "post",
                url: `${sharedBaseUrl}filterInventoryReport.php`,
                data: dt,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            // console.log(response);

            inventory = response.data;

            generateExcel();
        } catch (err) {
            console.log(err);
        }
    };

    const generateExcel = () => {
        // console.log(inventory);
        const ws = utils.json_to_sheet(inventory);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Data");
        writeFileXLSX(wb, `Inventory_${timestamp}.xlsx`);
    };

    onMount(async () => {
        getInventory();
    });
</script>

<main>
    <Loader />
</main>
