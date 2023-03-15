<script>
    // @ts-nocheck

    import { onMount } from "svelte";
    import axios from "axios";
    import { apiBaseUrl } from "../../config/config";
    import { read, utils, writeFileXLSX } from "xlsx";
    import Loader from "../Loader.svelte";

    let users = [];

    const getUsers = async () => {
        try {
            let response = await axios({
                method: "get",
                url: `${apiBaseUrl}getUsers.php`,
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
        writeFileXLSX(wb, "SheetJSSvelteAoO.xlsx");
    };

    onMount(async () => {
        getUsers();
    });
</script>

<main>
    <Loader />
</main>
