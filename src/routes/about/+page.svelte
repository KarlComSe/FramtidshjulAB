<script>
  export let data;
</script>
<article class="prose mx-auto p-4">
<p>Det här är cykelns program. </p>
<p>Att bygga en riktig elsparkcykel med mikrodator eller liknande är utanför projektets omfång. Därav byggs denna programvara som får emulera cykel och cykelns program.</p>
<p>Det är byggt med SvelteKit.</p>
<p>Kravspecifikation:</p>
<ol>
    <li>Detta program är tänkt att köra i varje cykel och styra/övervaka den.</li>
    <li>Cykeln meddelar dess position med jämna mellanrum.</li>
    <li>Cykeln meddelar om den kör eller står stilla och vilken hastighet den rör sig i.</li>
    <li>Man skall kunna stänga av/stoppa en cykel så att den inte kan köras längre.</li>
    <li>När en kund hyr cykeln är det möjligt att starta den och köra.</li>
    <li>Kunden kan lämna tillbaka en cykel och släppa kontrollen över den.</li>
    <li>Cykeln varnar när den behöver laddas.</li>
    <li>Cykeln sparar en logg över sina resor med start (plats, tid) och slut (plats, tid) samt kund.</li>
    <li>När cykeln tas in för underhåll eller laddning så markeras det att cykeln är i underhållsläge. En cykel som laddas på en laddstation kan inte hyras av en kund och en röd lampa visar att den inte är tillgänglig.</li>
</ol>
<p>Tänkbara utvecklingar av programmet: 1. möjliggöra simulering utefter en förutbestämd rutt. 2. simulera flera cyklar samtidigt.<p>
</article>