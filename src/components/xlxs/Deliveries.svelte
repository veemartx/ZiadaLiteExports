<script>
    // @ts-nocheck

    import { onMount } from "svelte";
    import axios from "axios";
    import "pdfmake/build/vfs_fonts";
    import { apiBaseUrl, sharedBaseUrl } from "../../config/config";
    import { useLocation } from "svelte-navigator";
    import { addCommas, formatDate } from "../../config/methods";
    import { read, utils, writeFileXLSX } from "xlsx";

    const location = useLocation();

    let branch, from, to;

    let deliveries = [];

    let qs;

    $: {
        qs = $location.search;
        getParamsFromQs(qs);
    }

    function getParamsFromQs(qs) {
        const urlSearchParams = new URLSearchParams(qs);
        const params = Object.fromEntries(urlSearchParams.entries());

        branch = params.branch || "";

        from = params.from || "";
        to = params.to || "";
    }

    const getDeliveries = async () => {
        let dt = {
            branch: branch,
            dateFrom: from,
            dateTo: to,
        };
        try {
            let response = await axios({
                method: "post",
                url: `${apiBaseUrl}getDeliveries.php`,
                data: dt,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            // console.log(response);

            deliveries = response.data;

            generateExcel();
        } catch (err) {
            console.log(err);
        }
    };

    const generateExcel = () => {
        // console.log(inventory);
        let currentDate = new Date();
        let timestamp = currentDate.getTime();

        const ws = utils.json_to_sheet(deliveries);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Data");
        writeFileXLSX(wb, `zdeliver_deliveries_report_${timestamp}.xlsx`);
    };

    onMount(() => {
        getDeliveries();
    });
</script>

<main>
    <div id="iframeContainer" />
</main>
