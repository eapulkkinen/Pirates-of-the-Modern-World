/** 
 * This project is licensed under the CC BY-NC-SA 4.0 license. https://creativecommons.org/licenses/by-nc-sa/4.0/
 * See https://github.com/eapulkkinen/Pirates-of-the-Modern-World?tab=License-1-ov-file#readme
 */
const Footer = () => {
    return (
            <div id="footerdiv">
                <table id="sourceTable" className="footerTable">
                        <tbody>
                        <tr><th>Open data source</th></tr>
                        <tr><td>Benden, P., Feng, A., Howell, C., & Dalla Riva G. V. (2021)</td></tr>
                        <tr><td>Crime at Sea: A Global Database of Maritime Pirate Attacks (1993–2020)</td></tr>
                        <tr><td>Journal of Open Humanities Data, 7: 19, pp. 1–6. <a href="https://doi.org/10.5334/johd.39" target="_blank">DOI</a></td></tr>
                        <tr><td><a href="https://github.com/newzealandpaul/Maritime-Pirate-Attacks" target="_blank">Github repository</a></td></tr>
                        </tbody>
                </table>
                <table id="creatorTable" className="footerTable">
                        <tbody>
                        <tr><th>Application creators</th></tr>
                        <tr><td>Aapo Peltokangas</td></tr>
                        <tr><td>Eero Pulkkinen</td></tr>
                        <tr><td>Valtteri Sivula</td></tr>
                        <tr><td>Vili Sihvo</td></tr>
                        </tbody>
                </table>
            </div>
    )
}


export default Footer;