<script>
    import { onMount } from "svelte";

    onMount(() => {});
</script>

<main>
    <div class="wrapper">
        <div class="loader">
            <div class="content">
                <h2>ZiadaLite</h2>
                <h2>ZiadaLite</h2>
            </div>
        </div>

        <div class="appName">
            Short Exp & Dead Stock Manager <sup>&trade;</sup>
        </div>
    </div>
</main>

<style>
    @import url("https://fonts.googleapis.com/css?family=Poppins:100,200,300,400,500,600,700,800,900");

    main {
        background: rgb(11, 85, 58);
    }

    
    .wrapper {
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: "Poppins", sans-serif;
    }

    .content {
        margin: -4em auto;
    }

    .content h2 {
        color: #fff;
        font-size: 3em;
        position: absolute;
        transform: translate(-50%, -50%);
    }

    .content h2:nth-child(1) {
        color: transparent;
        -webkit-text-stroke: 1px #12eb8dce;
    }

    .content h2:nth-child(2) {
        color: #119e4a;
        animation: animate 4s ease-in-out infinite;
    }

    .appName {
        margin-top: -2em;
        font-weight: 500;
        color: aliceblue;
        font-size: large;
    }
    @keyframes animate {
        0%,
        100% {
            clip-path: polygon(
                0% 45%,
                16% 44%,
                33% 50%,
                54% 60%,
                70% 61%,
                84% 59%,
                100% 52%,
                100% 100%,
                0% 100%
            );
        }

        50% {
            clip-path: polygon(
                0% 60%,
                15% 65%,
                34% 66%,
                51% 62%,
                67% 50%,
                84% 45%,
                100% 46%,
                100% 100%,
                0% 100%
            );
        }
    }

    @media only screen and (min-width: 640px) {
        .content h2 {
            color: #fff;
            font-size: 4em;
            position: absolute;
            transform: translate(-50%, -50%);
        }

        .appName {
            margin-top: -1em;
            font-weight: 500;
            color: aliceblue;
            font-size: large;
        }
    }
</style>
