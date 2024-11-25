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
          "Targa2: "+targa2+"-"+
          "Targa3: "+targa3+"-";
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
const createLogin = () =>{ // token ottenuto via mail 
  const inputName = document.querySelector("#name");
  const inputPassword = document.querySelector("#password");
  const loginButton = document.querySelector("#login");
  const divPrivate = document.querySelector("#private");
  const divLogin = document.querySelector("#login");

  divPrivate.classList.remove(".visible");
  divPrivate.classList.add(".hidden");
  isLogged = sessionStorage.getItem("Logged") || false;

  const login = (name, password) => {
    return new Promise((resolve, reject) => {
      fetch("http://ws.cipiaceinfo.it/credential/login", { 
        method: "POST",
        headers: {
           "content-type": "application/json",
           "key": myToken
        },
        body: JSON.stringify({
           username: name,
           password: password
        })
      })
      .then(r => r.json())
      .then(r => {
           resolve(r.result); 
        })
      .catch(reject);
    }),
    console.log(name);
  }

  loginButton.onclick = () => {
    login(inputName, inputPassword).then((result) => {
      congole.info(result);
      console.log("fij");
      if (login) {
        isLogged = true;
        sessionStorage.setItem("Logged"== true);
        console.log("pippo")
      }
    });
  }

  return {
    isLogged: () => isLogged
  }

  }

  createLogin();

let placess = [];
const caricaPlacessDaCache = () => {
    return new Promise((resolve, reject) => {
        prendiDatiCache(myKey, myToken)
            .then((data) => {
                // Aggiorna l'array placess con i dati dalla cache
                placess = data.map((item) => ({
                    name: item.name,
                    coords: item.coords,
                }));
                console.log("Dati caricati in placess:", placess);
                resolve(placess);
            })
            .catch((error) => {
                console.error("Errore nel caricamento dei dati dalla cache:", error);
                reject(error);
            });
    });
};

// Funzione per visualizzare i marker sulla mappa
const renderMarkersOnMap = () => {
  const zoom = 12;
  const maxZoom = 19;
  const map = L.map('map').setView(placess[0]?.coords || [0, 0], zoom);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: maxZoom,
      attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  placess.forEach((place) => {
      const marker = L.marker(place.coords).addTo(map);
      marker.bindPopup(`<b>${place.name}</b>`);
  });
};

// Carica i dati dalla cache al caricamento della pagina
caricaPlacessDaCache();
 let zoom = 12;
 let maxZoom = 19;
 let map=null;

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
  caricaPlacessDaCache().then(() => {
      // Pulire i marker dalla mappa
      if (map) {
          map.eachLayer((layer) => {
              if (layer instanceof L.Marker) {
                  map.removeLayer(layer);
              }
          });
      } else {
          // Inizializzare la mappa se non esiste
          map = L.map("map").setView(placess[0]?.coords || [0, 0], zoom);
          L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
              maxZoom: maxZoom,
              attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          }).addTo(map);
      }

      // Aggiornare la tabella
      const tableData = placess.map((place) => {
          const details = place.name.split("-").reduce((acc, item) => {
              const [key, value] = item.split(":").map((str) => str.trim());
              acc[key.toLowerCase()] = value || "";
              return acc;
          }, {});
          return [
              details.luogo || "",
              details.feriti || "0",
              details.morti || "0",
              details.data || "",
              details.targa1 || "",
              details.targa2 || "",
              details.targa3 || "",
          ];
      });

      const table1 = createTable(document.querySelector("#table1"));
table1.build([["Indirizzo", "Feriti", "Morti", "Data", "Targa 1", "Targa 2", "Targa 3"]]);
table1.render();

      table1.build([["Indirizzo", "Feriti", "Morti", "Data", "Targa 1", "Targa 2", "Targa 3"], ...tableData]);
      table1.render();

      // Aggiungere i marker alla mappa
      placess.forEach((place) => {
          const marker = L.marker(place.coords).addTo(map);
          marker.bindPopup(`<b>${place.name.replace(/-/g, "<br>")}</b>`);
      });
  });
};



      // Aggiungere i marker alla mappa
      placess.forEach((place) => {
          const marker = L.marker(place.coords).addTo(map);
          marker.bindPopup(`<b>${place.name.replace(/-/g, '<br>')}</b>`);
      });

// Inizializzare la tabella


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