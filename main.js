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
            console.log(r);
          const data = JSON.parse(r.result);
          resolve(data);
        })
        .catch(error => reject(error));
    });
  }





const salvaDati = (morti,feriti,data,luogo, long, lat,targa1,targa2,targa3 ) => {
    return new Promise((resolve, reject) => {
        prendiDatiCache(myKey, myToken)// prima di salvare i nuovi dati prendi i veccchi dati 
        .then(vecchiDati => {
          let titolo="Luogo: "+luogo+"-"+
          "Feriti: "+feriti+"-"+
          "Morti: "+morti+"-"+
          "Data: "+data+"-"+
          "Targa1: "+targa1+"-"+
          "Targa1: "+targa2+"-"+
          "Targa1: "+targa3+"-";
          console.log("VECCHI");
          console.log(vecchiDati);
          const nuoviDati = [
            ...(vecchiDati),{
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
              value: JSON.stringify(nuoviDati)
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

//[{name: "Piazza del Duomo Feriti: 3 Morti: 1 Data: 10/10/2024 ",coords: [45.4639102, 9.1906426]}]


let placess = [
    {
       name: "Indirizzo: Piazza del Duomo"+"\n"+
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

 const createTable = (parentElement) => {
  let data;
  return {
    build: (dataInput) => {
      data = dataInput;
    },
    render: () => {
      let htmlTable = "<table>";
      htmlTable += data.map((row) => 
        "<tr>" + row.map((col) => 
          "<td>" + col + "</td>"
        ).join("")
      ).join("") + "</tr>";
      htmlTable += "</table";
      parentElement.innerHTML = htmlTable;
    }
  }
}
 
 const render = () => {
  prendiDatiCache(myKey, myToken).then((places) => {
      console.log("Dati dalla cache:", places);

      // Pulire la mappa per evitare duplicazione dei marker
      map.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
              map.removeLayer(layer);
          }
      });

      // Tabella aggiornata
      const tableData = placess.map((place) => {
          const [lat, long] = place.coords;
          const [luogo, feriti, morti, data, targa1, targa2, targa3] = place.name.split('\n').map((item)=> item.split(':')[1]);
          return [luogo, feriti, morti, data, targa1, targa2, targa3];
      });

      // Aggiornare la tabella
      table1.build([["Indirizzo", "Feriti", "Morti", "Data", "Targa 1", "Targa 2", "Targa 3"], ...tableData]);
      table1.render();

      // Aggiungere i marker alla mappa
      placess.forEach((place) => {
          const marker = L.marker(place.coords).addTo(map);
          marker.bindPopup(`<b>${place.name.replace(/-/g, '<br>')}</b>`);
      });
  }).catch((error) => {
      console.error("Errore durante il recupero dei dati dalla cache:", error);
  });
};

// Inizializzare la tabella
const table1 = createTable(document.querySelector("#table1"));
table1.build([["Indirizzo", "Feriti", "Morti", "Data", "Targa 1", "Targa 2", "Targa 3"]]);
table1.render();

// Chiamare la funzione render per caricare i dati iniziali

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
        salvaDati(feriti,morti,data,luogo,long, lat).then(render);
    });
}
// tabella indirizzo(civ compreso) morti feriti data e ora 3 targhe input box filtro (es piazza filtra per tutti le piazze)