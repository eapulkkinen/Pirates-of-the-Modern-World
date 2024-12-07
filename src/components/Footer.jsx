/**
 * Tähän käyttöoikeudet
 */
const Footer = () => {
    return (
            <div id="footerdiv">
                <table id="sourceTable" className="footerTable">
                        <tr><th>Open data source</th></tr>
                        <tr><td>Benden, P., Feng, A., Howell, C., & Dalla Riva G. V. (2021)</td></tr>
                        <tr><td>Crime at Sea: A Global Database of Maritime Pirate Attacks (1993–2020)</td></tr>
                        <tr><td>Journal of Open Humanities Data, 7: 19, pp. 1–6. <a href="https://doi.org/10.5334/johd.39" target="_blank">DOI</a></td></tr>
                        <tr><td><a href="https://github.com/newzealandpaul/Maritime-Pirate-Attacks" target="_blank">Github repository</a></td></tr>
                </table>
                <table id="creatorTable" className="footerTable">
                        <tr><th>Application creators</th></tr>
                        <tr><td>Aapo Peltokangas</td></tr>
                        <tr><td>Eero Pulkkinen</td></tr>
                        <tr><td>Valtteri Sivula</td></tr>
                        <tr><td>Vili Sihvo</td></tr>
                </table>
            </div>
    )
}


export default Footer;