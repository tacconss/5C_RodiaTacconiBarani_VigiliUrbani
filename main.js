let myKey="mappe";
let myToken="eee8fe52-399b-49a0-be7e-0d8f2bf5e450";


const prendiDati = (via) => {
    return new Promise((resolve, reject) => {
       
        fetch("https://us1.locationiq.com/v1/search?key=pk.6ce44662827952ac04f47a6165745bb3&q="+via +"&format=json&")
        .then(r => r.json())
        .then(r => {
            resolve(r);
        })
        .catch(error => reject(error));
    });
};

const prendiDatiCache = (chiave, token) => {
    return new Promise((resolve, reject) => {
      fetch('https://ws.cipiaceinfo.it/cache/get', {
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
        prendiDatiCache(myKey, myToken)
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
          fetch("https://ws.cipiaceinfo.it/cache/set", { 
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

const createLogin = () =>{
  const inputName = document.querySelector("#name");
  const inputPassword = document.querySelector("#password");
  const loginButton = document.querySelector("#loginButton");
  const registerButton= document.querySelector("#register");
  const form = document.querySelector("#form");
  const divPrivate = document.querySelector("#private");
  const divLogin = document.querySelector("#login");
  let isLogged = false;

  divPrivate.classList.remove(".visible");
  divPrivate.classList.add(".hidden");
  isLogged = sessionStorage.getItem("Logged") || false;

    const registra = (username, password) => {
      return new Promise((resolve, reject) => {
          fetch("https://ws.cipiaceinfo.it/credential/register", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "key": myToken
              },
              body: JSON.stringify({
                  username: username,
                  password: password
              })
          })
          .then(r => r.json())
          .then(r => {
              resolve(r.result); 
          })
          .catch(reject);
      });
  };

  registerButton.onclick = () => {
    console.log("cliccato")
    const username = inputName.value.trim();
    const password = inputPassword.value.trim();

    if (!username|| !password) {
        console.error("Inserisci username e password.");
        return;
    }

    registra(username, password).then((result) => {
        console.log("Registrazione completata:", result);
        if (result) {
            console.log("Effettua il login con le nuove credenziali.");
            alert("Registrazione avvenuta con successo! Effettua il login.");
        } else {
            console.error("Errore durante la registrazione.");
        }
    }).catch((error) => {
        console.error("Errore durante la registrazione:", error);
    });
  };

    // Nascondi la mappa e la tabella inizialmente
    form.classList.add("hidden");

    const login = (username, password) => {
      return new Promise((resolve, reject) => {
        fetch("http://ws.cipiaceinfo.it/credential/login", { 
          method: "POST",
          headers: {
             "content-type": "application/json",
             "key": myToken 
          },
          body: JSON.stringify({
             username: username,
             password: password
          })
        })
        .then(r => r.json())
        .then(r => {
             resolve(r.result); 
          })
        .catch(reject);
      })
    }

    loginButton.onclick = () => {
      const username = inputName.value;
      const password = inputPassword.value;

      if (!username || !password) {
          console.error("Inserisci username e password.");
          return;
      }

      login(username, password).then((result) => {
          console.log("Login risultato:", result);
          if (result) {
              isLogged = true;
              divLogin.classList.add("hidden");
              form.classList.remove("hidden");
          } else {
              console.error("Login fallito.");
          }
      }).catch((error) => {
        console.error("Errore durante la registrazione:", error);
    });
  
    };
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

      placess.forEach((place) => {
          const marker = L.marker(place.coords).addTo(map);
          marker.bindPopup(`<b>${place.name.replace(/-/g, "<br>")}</b>`);
      });
  });
};

      placess.forEach((place) => {
          const marker = L.marker(place.coords).addTo(map);
          marker.bindPopup(`<b>${place.name.replace(/-/g, '<br>')}</b>`);
      });

 render();

 const InviaInput=document.getElementById("Aggiungi");

 InviaInput.onclick=()=>{
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
