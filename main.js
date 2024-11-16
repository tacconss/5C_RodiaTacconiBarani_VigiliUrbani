let myKey="mappe";
let myToken="eee8fe52-399b-49a0-be7e-0d8f2bf5e450";
const prendiDati = (via) => {
    return new Promise((resolve, reject) => {
       
        fetch("https://us1.locationiq.com/v1/search?key=pk.6ce44662827952ac04f47a6165745bb3&q="+via +"&format=json&"
            
        )
        .then(r => r.json())
        .then(r => {
            //console.log(r);
           // const data = JSON.parse(r.result);
           // resolve(data);
            resolve(r);
        })
        .catch(error => reject(error));
    });
};


const prendiDatiCache = (chiave, token) => {
    return new Promise((resolve, reject) => {
      fetch('https://ws.cipiaceinfo.it/cache/get', {// da cambiare
        method: "POST",
        headers: {
          "content-type": "application/json",
          "key": "eee8fe52-399b-49a0-be7e-0d8f2bf5e450"
        },
        body: JSON.stringify({
          key: "mappe"
        })
      })
        .then(r => r.json())
        .then(r => {
          //  console.log(r);
          const data = JSON.parse(r.result);
          resolve(data);
        })
        .catch(error => reject(error));
    });
  }





const salvaDati = (morti,feriti,data,luogo, long, lat ) => {
    return new Promise((resolve, reject) => {
        prendiDatiCache(myKey, myToken)// prima di salvare i nuovi dati prendi i veccchi dati 
        .then(vecchiDati => {
          let titolo="Luogo: "+luogo+"\n"+
          "Feriti: "+feriti+"\n"+
          "Morti: "+morti+"\n"+
          "Data: "+data+"\n";
          const nuoviDati = [
            ...vecchiDati,{
            "name": titolo,
            "coords":[lat,long]
            }
          ];


          // a questo punto metti sulla cache i nuovi dati 
          fetch("https://ws.cipiaceinfo.it/cache/set", {//Da cambiare url 
            method: "POST",
            headers: {
              "content-type": "application/json",
              "key": myToken
            },
            body: JSON.stringify({
              key: myKey,
              value: JSON.stringify({nuoviDati})
            })
          })
            .then(r => r.json())
            .then(result => {
              resolve(result);
            })
            .catch(error => reject(error));
        })
        .catch(error => reject(error));
    
    });
}




let placess = [
    {
       name: "Piazza del Duomo"+"\n"+
       "Feriti: 3"+"\n"+
       "Morti: 1"+"\n"+
       "Data: 10/10/2024 ",
       coords: [45.4639102, 9.1906426]
    }
 ];
 let zoom = 12;
 let maxZoom = 19;
 let map=null;



  map = L.map('map').setView(placess[0].coords, zoom);
 L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: maxZoom,
    attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
 }).addTo(map);


 function render(){
    prendiDatiCache().then((places)=>{
       // console.log("risultato" );
        console.log(placess );
      places.forEach((placess) => {
    const marker = L.marker(place.coords).addTo(map);
    marker.bindPopup(`<b>${place.name}</b>`);
 });
 });




 }


 render();
 //const viaInput=document.getElementById("via");
 //const cittaInput=document.getElementById("città");
 const InviaInput=document.getElementById("Aggiungi");



 InviaInput.onclick=()=>{
   // console.log(cittaInput);
  //  let viaT= viaInput.value;
    //let cittaT=cittaInput.value;
   // viaInput.value="";
   // cittaInput.value="";
    prendiDati("via fiume 73,Vimodrone").then((responce)=>{
        let dim=responce.length;
        let valToUse=null;
        valToUse=responce[0];
        let long=valToUse["lon"];
        let lat=valToUse["lat"];
        let  morti="0";
        let feriti="0";
        let data="10/10/2024";
        let luogo="pIPPPO";
        salvaDati(morti,feriti,data,luogo,long, lat).then(render);
    });
}
