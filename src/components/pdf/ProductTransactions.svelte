<script>
    // @ts-nocheck

    import { onMount } from "svelte";
    import axios from "axios";
    import pdfMake, { async } from "pdfmake/build/pdfmake";
    import "pdfmake/build/vfs_fonts";
    import logo from "../../config/logo";
    import { apiBaseUrl, sharedBaseUrl } from "../../config/config";
    import { useLocation } from "svelte-navigator";
    import { addCommas, formatDate } from "../../config/methods";

    const location = useLocation();

    let type, from, to, productId;

    let productTransactions = {};

    let activeBranches = [];

    let companyDetails = {
        postalCode: "P.o. Box 1263-09303 Nairobi Kenya",
        companyEmail: "info@pharmaplus.co.ke",
        physicalLocation: "info@pharmaplus.co.ke",
        companyPhone: "2547568383494",
    };

    let qs;

    $: {
        qs = $location.search;
        getParamsFromQs(qs);
    }

    pdfMake.fonts = {
        Liberation: {
            normal: "https://pharmaplusziadalite.co.ke/assets/fonts/Liberation_serif/liberation-serif.regular.ttf",
            bold: "https://pharmaplusziadalite.co.ke/assets/fonts/Liberation_serif/liberation-serif.bold.ttf",
            italics:
                "https://pharmaplusziadalite.co.ke/assets/fonts/Liberation_serif/liberation-serif.italic.ttf",
            bolditalics:
                "https://pharmaplusziadalite.co.ke/assets/fonts/Liberation_serif/liberation-serif.bold-italic.ttf",
        },
        Fontello: {
            normal: "https://pharmaplusziadalite.co.ke/assets/fonts/Liberation_serif/fontello.ttf",
            bold: "https://pharmaplusziadalite.co.ke/assets/fonts/Liberation_serif/fontello.ttf",
            italics:
                "https://pharmaplusziadalite.co.ke/assets/fonts/Liberation_serif/fontello.ttf",
            bolditalics:
                "https://pharmaplusziadalite.co.ke/assets/fonts/Liberation_serif/fontello.ttf",
        },
    };

    function getParamsFromQs(qs) {
        const urlSearchParams = new URLSearchParams(qs);
        const params = Object.fromEntries(urlSearchParams.entries());

        type = params.type || "";

        from = params.from || "";
        to = params.to || "";

        productId = params.pid || "";
    }

    const getProductTransactions = async () => {
        let dt = {
            type: type,
            from: from,
            to: to,
            pid: productId,
        };
        try {
            let response = await axios({
                method: "post",
                url: `${apiBaseUrl}getProductTransactions.php`,
                data: dt,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            // console.log(response);

            productTransactions = response.data;

            generatePdf();
        } catch (err) {
            console.log(err);
        }
    };

    const generatePdfBody = () => {
        let pdfBody = [];

        let pdfHeaderTitles = [
            { text: "No", bold: true, fontSize: 10 },
            { text: "Name", bold: true, fontSize: 10 },
            { text: "Code", bold: true, fontSize: 10 },
            { text: "Init", bold: true, fontSize: 10 },
            { text: "Branch", bold: true, fontSize: 10 },
            { text: "Receipt", bold: true, fontSize: 9 },
            { text: "Qty", bold: true, fontSize: 9 },
            { text: "Date", bold: true, fontSize: 10 },
        ];

        let pdfBodyTableWidths = [
            "5%",
            "20%",
            "10%",
            "15%",
            "13%",
            "12%",
            "10%",
            "15%",
        ];

        // have make the branch header
        activeBranches.forEach((branch) => {
            // filter the branch ones
            let branchValues = productTransactions.transactions.filter((v) => {
                if (v.branch == branch) {
                    return v;
                }
            });

            if (branchValues.length == 0) {
                return;
            } else {
                pdfBody.push({
                    margin: [15, 15, 15, 0],
                    style: "tableSubTitleName",
                    text: branch,
                });
            }

            let tableBody = [];

            tableBody.push(pdfHeaderTitles);

            branchValues.forEach((v, i) => {
                tableBody.push([
                    {
                        text: i + 1,
                        style: "reportNo",
                    },

                    {
                        text: v.name,
                        style: "reportValue",
                    },

                    {
                        text: v.code,
                        style: "reportValue",
                    },
                    {
                        text: v.init,
                        style: "reportValue",
                    },

                    {
                        text: v.branch,
                        style: "reportValue",
                    },
                    {
                        text: v.receipt,
                        style: "reportValue",
                    },
                    {
                        text: v.qty,
                        style: "reportValue",
                    },

                    {
                        text: formatDate(v.date),
                        style: "reportValue",
                    },
                ]);
            });

            pdfBody.push({
                margin: [15, 5, 15, 15],
                layout: "lightHorizontalLines",
                table: {
                    widths: pdfBodyTableWidths,
                    headerRows: 1,
                    body: tableBody,
                },
            });
        });

        return pdfBody;
    };

    const generatePdf = () => {
        //
        var docDefinition = {
            pageMargins: [0, 5, 5, 5],

            footer: function (currentPage, pageCount) {
                return [
                    {
                        text: currentPage.toString() + " of " + pageCount,
                        style: "footerText",
                    },
                ];
            },
            header: function (currentPage, pageCount, pageSize) {
                // you can apply any logic and return any valid pdfmake element

                return [
                    {
                        text: "ZIADA",
                        alignment: currentPage % 2 ? "left" : "right",
                        style: "headerText",
                    },
                    {
                        image: "" + logo + "",
                        width: 2000,
                        style: "logo",
                    },
                ];
            },
            watermark: {
                text: "Pharmaplus Pharmacies",
                color: "blue",
                opacity: 0.05,
                bold: false,
                italics: false,
                fontSize: 70,
            },
            content: [
                // logo
                {
                    border: [false, false, false, false],
                    image: "" + logo + "",
                    width: 250,
                    style: "logo",
                    outerHeight: 300,
                },

                {
                    style: "topCompanyName",
                    text: "Pharmaplus Pharmacies Ltd",
                },

                {
                    style: "topBarTable",
                    margin: [15, 15, 15, 0],
                    table: {
                        widths: ["100%"],
                        body: [
                            [
                                {
                                    text:
                                        "P.o. Box " +
                                        companyDetails.postalCode +
                                        " " +
                                        " | " +
                                        " " +
                                        companyDetails.companyPhone +
                                        " " +
                                        " | " +
                                        " " +
                                        companyDetails.companyEmail +
                                        " " +
                                        " | " +
                                        " " +
                                        companyDetails.physicalLocation,
                                    border: [false, false, false, true],
                                },
                            ],
                        ],
                    },
                },

                {
                    style: "headerTable",
                    margin: [15, 5, 15, 15],
                    table: {
                        widths: ["60%", "40%"],
                        body: [
                            [
                                {
                                    border: [false, false, false, false],
                                    text: `${productTransactions.name} [${productTransactions.code}]`,
                                    style: "mainTitle",
                                },
                                {
                                    border: [false, false, false, false],
                                    text: "ZiadaLite",
                                    style: "documentNumber",
                                },
                            ],
                            [
                                {
                                    border: [false, false, false, false],
                                    text: `${type}s Between ${formatDate(
                                        from
                                    )} & ${formatDate(to)}`,
                                    fontSize: 10,
                                    bold: true,
                                    color: "red",
                                },

                                {
                                    border: [false, false, false, false],
                                    text: `(${formatDate(new Date())})`,
                                    alignment: "right",
                                    fontSize: 10,
                                },
                            ],
                        ],
                    },
                },

                generatePdfBody(),
            ],
            defaultStyle: {
                font: "Liberation",
            },

            styles: {
                topCompanyName: {
                    fontSize: 20,
                    alignment: "center",
                    fontWeight: "bold",
                },

                topBarTable: {
                    color: "#2b2b2b",
                    fontSize: 10,
                },

                headerText: {
                    fontSize: 13,
                    bold: true,
                    color: "#ffffff",
                    opacity: 1,
                    margin: [10, 0, 0, 0],
                },
                footerText: {
                    fontSize: 13,
                    bold: true,
                    color: "rgba(18,18,18,0.9)",
                    opacity: 0.6,
                },
                headerCols: {
                    background: "red",
                },
                headerTable: {
                    border: false,
                },
                logo: {
                    italics: true,
                    alignment: "center",
                    background: "red",
                    marginTop: 10,
                },

                companyName: {
                    fontSize: 13,
                    bold: true,
                },
                mainTitle: {
                    fontSize: 13,
                    bold: true,
                },

                documentNumber: {
                    fontSize: 11,
                    bold: true,
                    alignment: "right",
                },

                contentTable: {
                    fontSize: 11,
                    margin: [15, 5, 15, 15],
                },

                footerRow: {
                    marginTop: 5,
                },

                tableHead: {
                    bold: true,
                    fontSize: 11,
                },

                summaryTable: {
                    marginTop: 20,
                },

                copyrightText: {
                    color: "gray",
                    fontSize: 10,
                    width: "*",
                    alignment: "right",
                    marginRight: 10,
                    italics: true,
                },

                tableCol: {
                    lineHeight: 1.5,
                    alignment: "justify",
                    marginTop: 8,
                    fontSize: 9,
                    marginLeft: 5,
                },
                chart: {
                    alignment: "justify",
                    background: "red",
                    marginTop: 10,
                    marginLeft: 10,
                },

                reportNo: {
                    margin: [1, 5],
                },
                reportValue: {
                    alignment: "justify",
                    fontSize: 9,
                    margin: [1, 5],
                },
                reportTitle: {
                    alignment: "justify",
                    fontSize: 11,
                    margin: [1, 5],
                },
                icon: { font: "Fontello" },

                tableSubTitleName: {
                    fontSize: 13,
                    alignment: "left",
                    fontWeight: "bold",
                },
            },
        };

        // pdfMake.createPdf(docDefinition).open({}, window);
        pdfMake.createPdf(docDefinition).open();
    };

    const getActiveBranches = async () => {
        let response = await axios.get(`${apiBaseUrl}getBranches.php`);

        activeBranches = response.data;
    };

    onMount(() => {
        getActiveBranches();
        getProductTransactions();
    });
</script>

<main>
    <div id="iframeContainer" />
</main>
