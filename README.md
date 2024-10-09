## Projektin hakeminen jotakuinkin näin
1. mkdir x
2. cd x
3. git init x
4. git remote add origin https://gitlab.jyu.fi/aaptappe/tiea207.git
5. git branch -M main
6. git pull origin main

jos vikisee personal access token, kuten mulla teki, niin sen saa luotua ja kopioitua talteen
https://gitlab.jyu.fi/-/user_settings/personal_access_tokens

## Käyttö

Vaatii npm:n asennuksen.
Kun npm ja projekti on haettu omalle koneelle,
riippuvuudet saadaan automaattisesti asennettua ainakin gitbashissa komennolla "npm install" (projektihakemistossa).
Sen jälkeen pystyy testaamaan sovellusta.

Helpoin tapa omasta mielestä:
1. open folder -> projekti
2. avaa vsc sisällä bash-terminaali
3. kirjoita "npm run dev" joka käynnistää "serverin"
ja ctrl+left click saa sovelluksen auki linkkiä klikkaamalla. 
4. serveri sulkeutuu ctrl+c ja sama näppäinyhdistelmä toimii myös terminaalissa serverin sulkemiselle

## Muistutus
git pull
git add --all
git commit -m "..."
git push